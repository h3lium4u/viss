sap.ui.define(["sap/ui/core/Control"], function (Control) {
  "use strict";

  return Control.extend("sap.dashboard.control.DumbbellRow", {
    metadata: {
      properties: {
        itemId: { type: "string", defaultValue: "" },
        name: { type: "string", defaultValue: "" },
        assigned: { type: "int", defaultValue: 0 },
        notAssigned: { type: "int", defaultValue: 0 },
        total: { type: "int", defaultValue: 0 },
        assignedPercentage: { type: "float", defaultValue: null },
        scaleMode: { type: "string", defaultValue: "proportion" },
        maxVolume: { type: "int", defaultValue: 100 }
      },
      events: {
        press: {}
      }
    },

    onclick: function () {
      this.firePress();
    },

    onkeydown: function (oEvent) {
      if (oEvent.keyCode === 13 || oEvent.keyCode === 32) {
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
      var scaleMode = oControl.getScaleMode();
      var maxVol = oControl.getMaxVolume() || 100;
      if (maxVol <= 0) maxVol = 1;

      var delta = Math.abs(assigned - notAssigned);
      var deltaSign = assigned >= notAssigned ? "+" : "-";

      // Compute dot positions as percentages 0..100%
      var posAssigned = 0;
      var posNotAssigned = 0;

      if (total > 0) {
        if (scaleMode === "absolute") {
          posAssigned = Math.min(96, Math.max(4, (assigned / maxVol) * 100));
          posNotAssigned = Math.min(96, Math.max(4, (notAssigned / maxVol) * 100));
        } else {
          posAssigned = Math.min(96, Math.max(4, (assigned / total) * 100));
          posNotAssigned = Math.min(96, Math.max(4, (notAssigned / total) * 100));
        }
      }

      var minPos = Math.min(posAssigned, posNotAssigned);
      var maxPos = Math.max(posAssigned, posNotAssigned);
      var isCoincident = total > 0 && Math.abs(posAssigned - posNotAssigned) < 2.5;

      oRm.openStart("div", oControl);
      oRm.class("sapDashDumbbellRow");
      oRm.attr("tabindex", "0");
      oRm.attr("role", "button");
      oRm.attr("title", id + " - " + name + "\nAssigned: " + assigned + " | Not Assigned: " + notAssigned + " (Delta: " + delta + ")");
      oRm.openEnd();

      // Left Column: Item ID & Name
      oRm.openStart("div");
      oRm.class("sapDashDumbbellLabelCol");
      oRm.openEnd();

      oRm.openStart("span");
      oRm.class("sapDashDumbbellId");
      oRm.openEnd();
      oRm.text(id);
      oRm.close("span");

      oRm.openStart("span");
      oRm.class("sapDashDumbbellName");
      oRm.openEnd();
      oRm.text(name);
      oRm.close("span");

      oRm.close("div"); // Label col

      // Center Column: Track with Connecting Line and Dots
      oRm.openStart("div");
      oRm.class("sapDashDumbbellTrackCol");
      oRm.openEnd();

      oRm.openStart("div");
      oRm.class("sapDashDumbbellTrack");
      oRm.openEnd();

      if (total <= 0) {
        // Zero-total "No data" appearance
        oRm.openStart("div");
        oRm.class("sapDashNoDataBar");
        oRm.style("width", "100%");
        oRm.style("height", "4px");
        oRm.openEnd();
        oRm.close("div");
      } else {
        // Connecting Delta Line
        oRm.openStart("div");
        oRm.class("sapDashDumbbellConnector");
        oRm.style("left", minPos + "%");
        oRm.style("width", (maxPos - minPos) + "%");
        oRm.openEnd();
        oRm.close("div");

        if (isCoincident) {
          // Coincident: Concentric Dual Ring
          oRm.openStart("div");
          oRm.class("sapDashDumbbellDotCoincident");
          oRm.style("left", posAssigned + "%");
          oRm.attr("title", "Equal Values: " + assigned);
          oRm.openEnd();
          oRm.close("div");
        } else {
          // Orange dot: Not Assigned
          oRm.openStart("div");
          oRm.class("sapDashDumbbellDotNotAssigned");
          oRm.style("left", posNotAssigned + "%");
          oRm.attr("title", "Not Assigned: " + notAssigned);
          oRm.openEnd();
          oRm.close("div");

          // Blue dot: Assigned
          oRm.openStart("div");
          oRm.class("sapDashDumbbellDotAssigned");
          oRm.style("left", posAssigned + "%");
          oRm.attr("title", "Assigned: " + assigned);
          oRm.openEnd();
          oRm.close("div");
        }
      }

      oRm.close("div"); // track
      oRm.close("div"); // track col

      // Right Column: Numerical Delta Badge & Exact Values
      oRm.openStart("div");
      oRm.class("sapDashDumbbellStatsCol");
      oRm.openEnd();

      if (total <= 0) {
        oRm.openStart("span");
        oRm.class("sapDashDumbbellNoDataBadge");
        oRm.openEnd();
        oRm.text("No data");
        oRm.close("span");
      } else {
        oRm.openStart("span");
        oRm.class("sapDashDumbbellCountAssigned");
        oRm.openEnd();
        oRm.text(assigned);
        oRm.close("span");

        oRm.openStart("span");
        oRm.class("sapDashDumbbellCountDivider");
        oRm.openEnd();
        oRm.text("/");
        oRm.close("span");

        oRm.openStart("span");
        oRm.class("sapDashDumbbellCountNotAssigned");
        oRm.openEnd();
        oRm.text(notAssigned);
        oRm.close("span");

        oRm.openStart("span");
        oRm.class("sapDashDumbbellDeltaBadge");
        if (assigned >= notAssigned) {
          oRm.class("sapDashDeltaPositive");
        } else {
          oRm.class("sapDashDeltaNegative");
        }
        oRm.openEnd();
        oRm.text("Δ " + delta);
        oRm.close("span");
      }

      oRm.close("div"); // stats col

      oRm.close("div"); // row
    }
  });
});
