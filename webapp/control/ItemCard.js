sap.ui.define(["sap/ui/core/Control"], function (Control) {
  "use strict";

  return Control.extend("sap.dashboard.control.ItemCard", {
    metadata: {
      properties: {
        itemId: { type: "string", defaultValue: "" },
        name: { type: "string", defaultValue: "" },
        assigned: { type: "int", defaultValue: 0 },
        notAssigned: { type: "int", defaultValue: 0 },
        total: { type: "int", defaultValue: 0 },
        assignedPercentage: { type: "float", defaultValue: null },
        status: { type: "string", defaultValue: "partially-assigned" },
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
      var status = oControl.getStatus();
      var scaleMode = oControl.getScaleMode();
      var maxVol = Math.max(oControl.getMaxVolume() || 1, 1);

      var pctText = pct !== null && !isNaN(pct) ? pct.toFixed(1) + "%" : "—";
      var pctColor = "#0a6ed1";
      if (total <= 0 || status === "no-data") {
        pctColor = "#89919a";
      } else if (status === "fully-assigned") {
        pctColor = "#107e3e";
      } else if (status === "none-assigned") {
        pctColor = "#bb0000";
      } else if (pct < 50) {
        pctColor = "#d08014";
      }

      oRm.openStart("div", oControl);
      oRm.class("sapDashItemCard");
      oRm.attr("tabindex", "0");
      oRm.attr("role", "button");
      oRm.attr("title", id + ": " + name + " (Click to view details)");
      oRm.openEnd();

      // Top Row: ID + %
      oRm.openStart("div");
      oRm.class("sapDashCardHeader");
      oRm.openEnd();

      oRm.openStart("span");
      oRm.class("sapDashCardId");
      oRm.openEnd();
      oRm.text(id);
      oRm.close("span");

      oRm.openStart("span");
      oRm.class("sapDashCardPct");
      oRm.style("color", pctColor);
      oRm.openEnd();
      oRm.text(pctText);
      oRm.close("span");

      oRm.close("div"); // card header

      // Name
      oRm.openStart("div");
      oRm.class("sapDashCardName");
      oRm.openEnd();
      oRm.text(name);
      oRm.close("div");

      // Segmented Bar Track
      oRm.openStart("div");
      oRm.class("sapDashSegmentedBarTrack");
      oRm.style("height", "10px");
      oRm.style("margin", "6px 0 10px 0");
      oRm.openEnd();

      if (total <= 0) {
        oRm.openStart("div");
        oRm.class("sapDashNoDataBar");
        oRm.style("width", "100%");
        oRm.style("height", "100%");
        oRm.openEnd();
        oRm.close("div");
      } else if (scaleMode === "absolute") {
        var barWidth = Math.min(100, Math.max(3, (total / maxVol) * 100));
        var aPct = (assigned / total) * 100;
        var naPct = (notAssigned / total) * 100;

        oRm.openStart("div");
        oRm.class("sapDashAbsoluteInnerBar");
        oRm.style("width", barWidth + "%");
        oRm.openEnd();

        if (assigned > 0) {
          oRm.openStart("div");
          oRm.class("sapDashSegmentAssigned");
          oRm.style("width", aPct + "%");
          oRm.openEnd();
          oRm.close("div");
        }
        if (notAssigned > 0) {
          oRm.openStart("div");
          oRm.class("sapDashSegmentNotAssigned");
          oRm.style("width", naPct + "%");
          oRm.openEnd();
          oRm.close("div");
        }

        oRm.close("div");
      } else {
        var pa = (assigned / total) * 100;
        var pna = (notAssigned / total) * 100;

        if (assigned > 0) {
          oRm.openStart("div");
          oRm.class("sapDashSegmentAssigned");
          oRm.style("width", pa + "%");
          oRm.openEnd();
          oRm.close("div");
        }
        if (notAssigned > 0) {
          oRm.openStart("div");
          oRm.class("sapDashSegmentNotAssigned");
          oRm.style("width", pna + "%");
          oRm.openEnd();
          oRm.close("div");
        }
      }

      oRm.close("div"); // bar track

      // Counts Footer
      oRm.openStart("div");
      oRm.class("sapDashCardStats");
      oRm.openEnd();

      oRm.openStart("span");
      oRm.style("color", "#0a6ed1");
      oRm.style("font-weight", "600");
      oRm.openEnd();
      oRm.text(assigned + " Assigned");
      oRm.close("span");

      oRm.openStart("span");
      oRm.style("color", "#d08014");
      oRm.style("font-weight", "600");
      oRm.openEnd();
      oRm.text(notAssigned + " Not Assigned");
      oRm.close("span");

      oRm.openStart("span");
      oRm.style("color", "#64748b");
      oRm.openEnd();
      oRm.text(total + " Total");
      oRm.close("span");

      oRm.close("div"); // stats

      oRm.close("div"); // card
    }
  });
});
