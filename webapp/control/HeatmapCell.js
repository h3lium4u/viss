sap.ui.define(["sap/ui/core/Control"], function (Control) {
  "use strict";

  return Control.extend("sap.dashboard.control.HeatmapCell", {
    metadata: {
      properties: {
        itemId: { type: "string", defaultValue: "" },
        name: { type: "string", defaultValue: "" },
        assigned: { type: "int", defaultValue: 0 },
        notAssigned: { type: "int", defaultValue: 0 },
        total: { type: "int", defaultValue: 0 },
        assignedPercentage: { type: "float", defaultValue: null },
        status: { type: "string", defaultValue: "partially-assigned" }
      },
      events: {
        press: {}
      }
    },

    onclick: function (oEvent) {
      this.firePress();
    },

    onkeydown: function (oEvent) {
      if (oEvent.keyCode === 13 || oEvent.keyCode === 32) {
        // Enter or Space
        oEvent.preventDefault();
        this.firePress();
      }
    },

    renderer: function (oRm, oControl) {
      var id = oControl.getItemId();
      var name = oControl.getName();
      var assigned = oControl.getAssigned();
      var notAssigned = oControl.getNotAssigned();
      var total = oControl.getTotal();
      var pct = oControl.getAssignedPercentage();
      var status = oControl.getStatus();

      var isDark = false;
      var bgStyle = "";
      var textColor = "#1d2d3e";

      if (total <= 0 || status === "no-data" || pct === null) {
        bgStyle = "background: repeating-linear-gradient(45deg, #f5f6f7, #f5f6f7 5px, #e2e8f0 5px, #e2e8f0 10px); border: 1px dashed #a8b4be;";
        textColor = "#64748b";
      } else if (pct === 0) {
        bgStyle = "background-color: #fff9ed; border: 1px solid #ffd591;";
        textColor = "#9254de";
      } else if (pct <= 25) {
        bgStyle = "background-color: #e6f4ff; border: 1px solid #bae0ff;";
        textColor = "#0050b3";
      } else if (pct <= 50) {
        bgStyle = "background-color: #91caff; border: 1px solid #69b1ff;";
        textColor = "#002c8c";
      } else if (pct <= 75) {
        bgStyle = "background-color: #4096ff; border: 1px solid #1677ff;";
        textColor = "#ffffff";
        isDark = true;
      } else if (pct < 100) {
        bgStyle = "background-color: #1677ff; border: 1px solid #0958d9;";
        textColor = "#ffffff";
        isDark = true;
      } else {
        // 100% Fully Assigned
        bgStyle = "background-color: #0a6ed1; border: 1px solid #0854a0;";
        textColor = "#ffffff";
        isDark = true;
      }

      var tooltipText = id + ": " + name + "\n" +
        "Assigned: " + assigned + " | Not Assigned: " + notAssigned + " (Total: " + total + ")\n" +
        "Rate: " + (pct !== null ? pct.toFixed(1) + "%" : "No Data");

      oRm.openStart("div", oControl);
      oRm.class("sapDashHeatmapCell");
      if (isDark) oRm.class("sapDashHeatmapCellDark");
      oRm.attr("tabindex", "0");
      oRm.attr("role", "button");
      oRm.attr("title", tooltipText);
      oRm.attr("style", bgStyle);
      oRm.openEnd();

      // Top row: ID and %
      oRm.openStart("div");
      oRm.class("sapDashHeatmapCellHeader");
      oRm.style("color", textColor);
      oRm.openEnd();

      oRm.openStart("span");
      oRm.class("sapDashHeatmapCellId");
      oRm.openEnd();
      oRm.text(id);
      oRm.close("span");

      oRm.openStart("span");
      oRm.class("sapDashHeatmapCellPct");
      oRm.openEnd();
      oRm.text(pct !== null ? Math.round(pct) + "%" : "—");
      oRm.close("span");

      oRm.close("div");

      // Bottom row: Counts
      oRm.openStart("div");
      oRm.class("sapDashHeatmapCellFooter");
      oRm.style("color", isDark ? "rgba(255,255,255,0.85)" : "#556b82");
      oRm.openEnd();
      oRm.text(assigned + " / " + notAssigned);
      oRm.close("div");

      oRm.close("div");
    }
  });
});
