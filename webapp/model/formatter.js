(function (root, factory) {
  if (typeof sap === "object" && typeof sap.ui === "object" && typeof sap.ui.define === "function") {
    sap.ui.define([], factory);
  } else if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.formatter = factory();
  }
})(this, function () {
  "use strict";

  return {
    percentageText: function (pct) {
      if (pct === null || pct === undefined || isNaN(pct)) {
        return "—";
      }
      return Number(pct).toFixed(1) + "%";
    },

    statusState: function (status) {
      switch (status) {
        case "fully-assigned":
          return "Success";
        case "partially-assigned":
          return "Information";
        case "none-assigned":
          return "Warning";
        case "no-data":
          return "None";
        default:
          return "None";
      }
    },

    statusText: function (status) {
      switch (status) {
        case "fully-assigned":
          return "Fully Assigned";
        case "partially-assigned":
          return "Partially Assigned";
        case "none-assigned":
          return "None Assigned";
        case "no-data":
          return "No Data";
        default:
          return "Unknown";
      }
    },

    formatNumber: function (num) {
      if (num === null || num === undefined) return "0";
      return Number(num).toLocaleString();
    },

    macroDistributionText: function (assigned, overallPct) {
      if (overallPct === null || overallPct === undefined || isNaN(overallPct)) {
        return "Assigned: " + (assigned || 0) + " (—)";
      }
      return "Assigned: " + (assigned || 0) + " (" + Number(overallPct).toFixed(1) + "%)";
    },

    isViewVisible: function (currentView, targetView) {
      return currentView === targetView;
    },

    isScaleAbsolute: function (scaleMode) {
      return scaleMode === "absolute";
    }
  };
});
