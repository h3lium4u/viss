(function (root, factory) {
  if (typeof sap === "object" && typeof sap.ui === "object" && typeof sap.ui.define === "function") {
    sap.ui.define([], factory);
  } else if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.calculations = factory();
  }
})(this, function () {
  "use strict";

  function getItemStatus(assigned, notAssigned) {
    if (assigned === 0 && notAssigned === 0) return "no-data";
    if (assigned > 0 && notAssigned === 0) return "fully-assigned";
    if (assigned === 0 && notAssigned > 0) return "none-assigned";
    return "partially-assigned";
  }

  function calculatePercentage(assigned, total) {
    if (total <= 0) return null;
    return (assigned / total) * 100;
  }

  function formatPercentage(val, decimals) {
    if (val === null || val === undefined || isNaN(val)) {
      return "No data";
    }
    var d = typeof decimals === "number" ? decimals : 1;
    return val.toFixed(d) + "%";
  }

  function calculateDatasetStats(items) {
    var totalAssigned = 0;
    var totalNotAssigned = 0;
    var maxItemVolume = 0;
    var maxAssigned = 0;
    var maxNotAssigned = 0;
    var fullyAssignedCount = 0;
    var partiallyAssignedCount = 0;
    var noneAssignedCount = 0;
    var noDataCount = 0;

    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      totalAssigned += item.assigned;
      totalNotAssigned += item.notAssigned;

      if (item.total > maxItemVolume) {
        maxItemVolume = item.total;
      }
      if (item.assigned > maxAssigned) {
        maxAssigned = item.assigned;
      }
      if (item.notAssigned > maxNotAssigned) {
        maxNotAssigned = item.notAssigned;
      }

      switch (item.status) {
        case "fully-assigned":
          fullyAssignedCount++;
          break;
        case "partially-assigned":
          partiallyAssignedCount++;
          break;
        case "none-assigned":
          noneAssignedCount++;
          break;
        case "no-data":
          noDataCount++;
          break;
      }
    }

    var totalVolume = totalAssigned + totalNotAssigned;
    var overallPercentage = totalVolume > 0 ? (totalAssigned / totalVolume) * 100 : null;
    var maxSingleValue = Math.max(maxAssigned, maxNotAssigned, 1);

    return {
      totalItems: items.length,
      totalAssigned: totalAssigned,
      totalNotAssigned: totalNotAssigned,
      totalVolume: totalVolume,
      overallPercentage: overallPercentage,
      maxItemVolume: maxItemVolume > 0 ? maxItemVolume : 1,
      maxAssigned: maxAssigned,
      maxNotAssigned: maxNotAssigned,
      maxSingleValue: maxSingleValue,
      fullyAssignedCount: fullyAssignedCount,
      partiallyAssignedCount: partiallyAssignedCount,
      noneAssignedCount: noneAssignedCount,
      noDataCount: noDataCount
    };
  }

  function filterItems(items, searchQuery, statusFilter) {
    var query = (searchQuery || "").trim().toLowerCase();
    var filter = statusFilter || "all";

    return items.filter(function (item) {
      if (filter !== "all" && item.status !== filter) {
        return false;
      }
      if (query) {
        var matchName = item.name.toLowerCase().indexOf(query) !== -1;
        var matchId = item.id.toLowerCase().indexOf(query) !== -1;
        var matchCategory = (item.category || "").toLowerCase().indexOf(query) !== -1;
        return matchName || matchId || matchCategory;
      }
      return true;
    });
  }

  function sortItems(items, sortOption) {
    var sorted = items.slice();
    var opt = sortOption || "name-asc";

    sorted.sort(function (a, b) {
      switch (opt) {
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "percent-asc": {
          if (a.assignedPercentage === null && b.assignedPercentage === null) return 0;
          if (a.assignedPercentage === null) return 1;
          if (b.assignedPercentage === null) return -1;
          return a.assignedPercentage - b.assignedPercentage;
        }
        case "percent-desc": {
          if (a.assignedPercentage === null && b.assignedPercentage === null) return 0;
          if (a.assignedPercentage === null) return 1;
          if (b.assignedPercentage === null) return -1;
          return b.assignedPercentage - a.assignedPercentage;
        }
        case "not-assigned-desc":
          return b.notAssigned - a.notAssigned;
        case "total-desc":
          return b.total - a.total;
        default:
          return 0;
      }
    });

    return sorted;
  }

  return {
    getItemStatus: getItemStatus,
    calculatePercentage: calculatePercentage,
    formatPercentage: formatPercentage,
    calculateDatasetStats: calculateDatasetStats,
    filterItems: filterItems,
    sortItems: sortItems
  };
});
