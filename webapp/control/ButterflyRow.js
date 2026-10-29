sap.ui.define(["sap/ui/core/Control"], function (Control) {
  "use strict";

  return Control.extend("sap.dashboard.control.ButterflyRow", {
    metadata: {
      properties: {
        itemId: { type: "string", defaultValue: "" },
        name: { type: "string", defaultValue: "" },
        assigned: { type: "int", defaultValue: 0 },
        notAssigned: { type: "int", defaultValue: 0 },
        total: { type: "int", defaultValue: 0 },
        maxSingleValue: { type: "int", defaultValue: 100 }
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
      var maxVal = oControl.getMaxSingleValue() || 100;
      if (maxVal <= 0) maxVal = 1;

      var notAssignedPct = Math.min(100, (notAssigned / maxVal) * 100);
      var assignedPct = Math.min(100, (assigned / maxVal) * 100);

      oRm.openStart("div", oControl);
      oRm.class("sapDashButterflyRow");
      oRm.attr("tabindex", "0");
      oRm.attr("role", "button");
      oRm.attr("title", id + " - " + name + "\nNot Assigned: " + notAssigned + " | Assigned: " + assigned);
      oRm.openEnd();

      // Left wing: Not Assigned (Number + Bar extending left to center)
      oRm.openStart("div");
      oRm.class("sapDashButterflyLeftWing");
      oRm.openEnd();

      oRm.openStart("span");
      oRm.class("sapDashButterflyValLeft");
      oRm.openEnd();
      oRm.text(notAssigned);
      oRm.close("span");

      oRm.openStart("div");
      oRm.class("sapDashButterflyTrackLeft");
      oRm.openEnd();

      if (total <= 0) {
        oRm.openStart("div");
        oRm.class("sapDashNoDataBar");
        oRm.style("width", "100%");
        oRm.style("height", "14px");
        oRm.openEnd();
        oRm.close("div");
      } else if (notAssigned > 0) {
        oRm.openStart("div");
        oRm.class("sapDashButterflyBarLeft");
        oRm.style("width", notAssignedPct + "%");
        oRm.openEnd();
        oRm.close("div");
      }

      oRm.close("div"); // track left
      oRm.close("div"); // wing left

      // Center: Zero Axis + Item Label
      oRm.openStart("div");
      oRm.class("sapDashButterflyCenter");
      oRm.openEnd();

      oRm.openStart("div");
      oRm.class("sapDashButterflyAxisLine");
      oRm.openEnd();
      oRm.close("div");

      oRm.openStart("span");
      oRm.class("sapDashButterflyId");
      oRm.openEnd();
      oRm.text(id);
      oRm.close("span");

      oRm.openStart("span");
      oRm.class("sapDashButterflyName");
      oRm.openEnd();
      oRm.text(name);
      oRm.close("span");

      oRm.close("div"); // center

      // Right wing: Assigned (Bar extending right from center + Number)
      oRm.openStart("div");
      oRm.class("sapDashButterflyRightWing");
      oRm.openEnd();

      oRm.openStart("div");
      oRm.class("sapDashButterflyTrackRight");
      oRm.openEnd();

      if (total <= 0) {
        oRm.openStart("div");
        oRm.class("sapDashNoDataBar");
        oRm.style("width", "100%");
        oRm.style("height", "14px");
        oRm.openEnd();
        oRm.close("div");
      } else if (assigned > 0) {
        oRm.openStart("div");
        oRm.class("sapDashButterflyBarRight");
        oRm.style("width", assignedPct + "%");
        oRm.openEnd();
        oRm.close("div");
      }

      oRm.close("div"); // track right

      oRm.openStart("span");
      oRm.class("sapDashButterflyValRight");
      oRm.openEnd();
      oRm.text(assigned);
      oRm.close("span");

      oRm.close("div"); // wing right

      oRm.close("div"); // row
    }
  });
});
