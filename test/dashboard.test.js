const test = require("node:test");
const assert = require("node:assert/strict");

const dummyData = require("../webapp/model/dummyData.js");
const calculations = require("../webapp/model/calculations.js");
const formatter = require("../webapp/model/formatter.js");

test("Deterministic data generation returns stable slices", () => {
  const d30_1 = dummyData.getDatasetBySize(30);
  const d30_2 = dummyData.getDatasetBySize(30);
  const d50 = dummyData.getDatasetBySize(50);
  const d100 = dummyData.getDatasetBySize(100);

  assert.equal(d30_1.length, 30);
  assert.equal(d50.length, 50);
  assert.equal(d100.length, 100);

  // Must be strictly deterministic across calls
  assert.deepEqual(d30_1, d30_2);

  // Slices must preserve identical items in identical order
  assert.equal(d50[0].id, d30_1[0].id);
  assert.equal(d50[29].id, d30_1[29].id);
  assert.equal(d100[49].id, d50[49].id);
});

test("Math: total === assigned + notAssigned for all records", () => {
  const full = dummyData.getFullDataset();
  for (const item of full) {
    assert.equal(
      item.total,
      item.assigned + item.notAssigned,
      `Item ${item.id} total mismatch`
    );
  }
});

test("Math: assignedPercentage is mathematically accurate and handles 0 total as null", () => {
  const full = dummyData.getFullDataset();
  for (const item of full) {
    if (item.total === 0) {
      assert.equal(
        item.assignedPercentage,
        null,
        `Zero-total item ${item.id} must have null percentage, not 0%`
      );
    } else {
      const expected = (item.assigned / item.total) * 100;
      assert.ok(
        Math.abs(item.assignedPercentage - expected) < 1e-9,
        `Item ${item.id} percentage mismatch`
      );
    }
  }
});

test("Status classification: correctly categorizes all edge cases", () => {
  assert.equal(calculations.getItemStatus(0, 0), "no-data");
  assert.equal(calculations.getItemStatus(42, 0), "fully-assigned");
  assert.equal(calculations.getItemStatus(0, 34), "none-assigned");
  assert.equal(calculations.getItemStatus(18, 12), "partially-assigned");
});

test("Curated edge cases: ITM-005, ITM-006, ITM-007, ITM-008, ITM-013", () => {
  const items = dummyData.getDatasetBySize(30);

  // ITM-005: 100% Fully Assigned
  const itm5 = items.find((i) => i.id === "ITM-005");
  assert.ok(itm5);
  assert.equal(itm5.assigned, 42);
  assert.equal(itm5.notAssigned, 0);
  assert.equal(itm5.assignedPercentage, 100);
  assert.equal(itm5.status, "fully-assigned");

  // ITM-006: 0% None Assigned
  const itm6 = items.find((i) => i.id === "ITM-006");
  assert.ok(itm6);
  assert.equal(itm6.assigned, 0);
  assert.equal(itm6.notAssigned, 34);
  assert.equal(itm6.assignedPercentage, 0);
  assert.equal(itm6.status, "none-assigned");

  // ITM-007: Zero-total No Data
  const itm7 = items.find((i) => i.id === "ITM-007");
  assert.ok(itm7);
  assert.equal(itm7.assigned, 0);
  assert.equal(itm7.notAssigned, 0);
  assert.equal(itm7.total, 0);
  assert.equal(itm7.assignedPercentage, null);
  assert.equal(itm7.status, "no-data");

  // ITM-008: High Volume
  const itm8 = items.find((i) => i.id === "ITM-008");
  assert.ok(itm8);
  assert.equal(itm8.assigned, 480);
  assert.equal(itm8.notAssigned, 220);
  assert.equal(itm8.total, 700);

  // ITM-013: 50/50 Split
  const itm13 = items.find((i) => i.id === "ITM-013");
  assert.ok(itm13);
  assert.equal(itm13.assigned, 50);
  assert.equal(itm13.notAssigned, 50);
  assert.equal(itm13.assignedPercentage, 50);
});

test("Dataset stats calculation matches manual sums", () => {
  const items = dummyData.getDatasetBySize(30);
  const stats = calculations.calculateDatasetStats(items);

  assert.equal(stats.totalItems, 30);
  let sumAssigned = 0;
  let sumNotAssigned = 0;
  for (const it of items) {
    sumAssigned += it.assigned;
    sumNotAssigned += it.notAssigned;
  }
  assert.equal(stats.totalAssigned, sumAssigned);
  assert.equal(stats.totalNotAssigned, sumNotAssigned);
  assert.equal(stats.totalVolume, sumAssigned + sumNotAssigned);
  assert.ok(stats.overallPercentage > 0);
  assert.equal(stats.maxItemVolume, 700); // ITM-008 is max volume in first 30
});

test("Formatter displays correct percentage and status text", () => {
  assert.equal(formatter.percentageText(null), "—");
  assert.equal(formatter.percentageText(undefined), "—");
  assert.equal(formatter.percentageText(60.0), "60.0%");
  assert.equal(formatter.percentageText(23.333), "23.3%");

  assert.equal(formatter.statusState("fully-assigned"), "Success");
  assert.equal(formatter.statusState("none-assigned"), "Warning");
  assert.equal(formatter.statusState("no-data"), "None");

  assert.equal(formatter.statusText("fully-assigned"), "Fully Assigned");
  assert.equal(formatter.statusText("no-data"), "No Data");
});

test("Filter items by query and status", () => {
  const items = dummyData.getDatasetBySize(30);

  // Filter by query
  const queryResult = calculations.filterItems(items, "ITM-001", "all");
  assert.equal(queryResult.length, 1);
  assert.equal(queryResult[0].id, "ITM-001");

  // Filter by category
  const secResult = calculations.filterItems(items, "Security", "all");
  assert.ok(secResult.length >= 1);

  // Filter by status
  const fullyResult = calculations.filterItems(items, "", "fully-assigned");
  for (const it of fullyResult) {
    assert.equal(it.status, "fully-assigned");
  }

  const noDataResult = calculations.filterItems(items, "", "no-data");
  assert.ok(noDataResult.length >= 2); // ITM-007 and ITM-024
});

test("Sorting: sorts correctly by name, percentage, unassigned, and total", () => {
  const items = dummyData.getDatasetBySize(30);

  // Name asc
  const byName = calculations.sortItems(items, "name-asc");
  for (let i = 0; i < byName.length - 1; i++) {
    assert.ok(byName[i].name.localeCompare(byName[i + 1].name) <= 0);
  }

  // Total desc
  const byTotal = calculations.sortItems(items, "total-desc");
  assert.equal(byTotal[0].id, "ITM-008"); // 700 is highest total
  for (let i = 0; i < byTotal.length - 1; i++) {
    assert.ok(byTotal[i].total >= byTotal[i + 1].total);
  }

  // Percent desc (nulls should be at the end)
  const byPctDesc = calculations.sortItems(items, "percent-desc");
  assert.equal(byPctDesc[0].assignedPercentage, 100);
  assert.equal(byPctDesc[byPctDesc.length - 1].assignedPercentage, null);
});
