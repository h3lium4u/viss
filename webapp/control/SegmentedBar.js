sap.ui.define(["sap/ui/core/Control"], function (Control) {
  "use strict";

  return Control.extend("sap.dashboard.control.SegmentedBar", {
    metadata: {
      properties: {
        assigned: { type: "int", defaultValue: 0 },
        notAssigned: { type: "int", defaultValue: 0 },
        total: { type: "int", defaultValue: 0 },
        scaleMode: { type: "string", defaultValue: "proportion" },
        maxVolume: { type: "int", defaultValue: 100 },
        height: { type: "string", defaultValue: "8px" }
      }
    },

    renderer: function (oRm, oControl) {
      var assigned = oControl.getAssigned() || 0;
      var notAssigned = oControl.getNotAssigned() || 0;
      var total = oControl.getTotal() || 0;
      var scaleMode = oControl.getScaleMode() || "proportion";
      var maxVolume = oControl.getMaxVolume() || 100;
      if (maxVolume <= 0) maxVolume = 1;
      var height = oControl.getHeight() || "8px";

      oRm.openStart("div", oControl);
      oRm.class("sapDashSegmentedBarTrack");
      oRm.style("height", height);
      oRm.openEnd();

      if (total <= 0) {
        // Zero-total "No data" striped bar
        oRm.openStart("div");
        oRm.class("sapDashNoDataBar");
        oRm.style("width", "100%");
        oRm.style("height", "100%");
        oRm.openEnd();
        oRm.close("div");
      } else if (scaleMode === "absolute") {
        // Absolute volume scale
        var barWidthPct = Math.min(100, Math.max(2, (total / maxVolume) * 100));
        var assignedPct = (assigned / total) * 100;
        var notAssignedPct = (notAssigned / total) * 100;

        oRm.openStart("div");
        oRm.class("sapDashAbsoluteInnerBar");
        oRm.style("width", barWidthPct + "%");
        oRm.style("height", "100%");
        oRm.openEnd();

        if (assigned > 0) {
          oRm.openStart("div");
          oRm.class("sapDashSegmentAssigned");
          oRm.style("width", assignedPct + "%");
          oRm.style("height", "100%");
          oRm.openEnd();
          oRm.close("div");
        }
        if (notAssigned > 0) {
          oRm.openStart("div");
          oRm.class("sapDashSegmentNotAssigned");
          oRm.style("width", notAssignedPct + "%");
          oRm.style("height", "100%");
          oRm.openEnd();
          oRm.close("div");
        }

        oRm.close("div");
      } else {
        // Proportional scale
        var pAssigned = (assigned / total) * 100;
        var pNotAssigned = (notAssigned / total) * 100;

        if (assigned > 0) {
          oRm.openStart("div");
          oRm.class("sapDashSegmentAssigned");
          oRm.style("width", pAssigned + "%");
          oRm.style("height", "100%");
          oRm.openEnd();
          oRm.close("div");
        }
        if (notAssigned > 0) {
          oRm.openStart("div");
          oRm.class("sapDashSegmentNotAssigned");
          oRm.style("width", pNotAssigned + "%");
          oRm.style("height", "100%");
          oRm.openEnd();
          oRm.close("div");
        }
      }

      oRm.close("div");
    }
  });
});
