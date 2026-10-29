sap.ui.define(["sap/ui/core/Control"], function (Control) {
  "use strict";

  return Control.extend("sap.dashboard.control.DonutChart", {
    metadata: {
      properties: {
        itemId: { type: "string", defaultValue: "" },
        name: { type: "string", defaultValue: "" },
        assigned: { type: "int", defaultValue: 0 },
        notAssigned: { type: "int", defaultValue: 0 },
        total: { type: "int", defaultValue: 0 },
        assignedPercentage: { type: "float", defaultValue: null },
        status: { type: "string", defaultValue: "partially-assigned" },
        size: { type: "int", defaultValue: 130 },
        showMeta: { type: "boolean", defaultValue: true }
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
      var size = oControl.getSize() || 130;
      var showMeta = oControl.getShowMeta();

      var radius = 38;
      var circumference = 2 * Math.PI * radius; // ~238.761

      var arcColor = "#0a6ed1"; // SAP Horizon Blue
      var textColor = "#1d2d3e";
      var isZeroTotal = total <= 0 || status === "no-data" || pct === null;

      if (isZeroTotal) {
        arcColor = "#89919a";
        textColor = "#64748b";
      } else if (status === "fully-assigned" || pct === 100) {
        arcColor = "#107e3e"; // Green for 100%
      } else if (status === "none-assigned" || pct === 0) {
        arcColor = "#bb0000"; // Red for 0%
      } else if (pct >= 50) {
        arcColor = "#0a6ed1"; // SAP Blue for majority assigned
      } else {
        arcColor = "#d08014"; // SAP Gold for majority unassigned
      }

      var strokeDashoffset = isZeroTotal
        ? circumference
        : circumference * (1 - Math.max(0, Math.min(100, pct)) / 100);

      var pctLabel = isZeroTotal ? "—" : Math.round(pct) + "%";

      oRm.openStart("div", oControl);
      oRm.class("sapDashDonutCard");
      oRm.attr("tabindex", "0");
      oRm.attr("role", "button");
      oRm.attr("title", id + ": " + name + "\nAssigned: " + assigned + " | Not Assigned: " + notAssigned + " (" + pctLabel + ")");
      oRm.openEnd();

      // Top row: Item ID badge
      if (showMeta && id) {
        oRm.openStart("div");
        oRm.class("sapDashDonutHeader");
        oRm.openEnd();

        oRm.openStart("span");
        oRm.class("sapDashCardId");
        oRm.openEnd();
        oRm.text(id);
        oRm.close("span");

        oRm.close("div");
      }

      // SVG Donut Ring
      oRm.openStart("div");
      oRm.class("sapDashDonutSvgWrap");
      oRm.style("width", size + "px");
      oRm.style("height", size + "px");
      oRm.openEnd();

      oRm.openStart("svg");
      oRm.attr("viewBox", "0 0 100 100");
      oRm.attr("class", "sapDashDonutSvg");
      oRm.openEnd();

      // Inactive Background Track (Light Gray Ring)
      oRm.openStart("circle");
      oRm.attr("cx", "50");
      oRm.attr("cy", "50");
      oRm.attr("r", radius);
      oRm.attr("fill", "none");
      oRm.attr("stroke", isZeroTotal ? "#e2e8f0" : "#eaedf0");
      oRm.attr("stroke-width", "13");
      if (isZeroTotal) {
        oRm.attr("stroke-dasharray", "4, 3");
      }
      oRm.openEnd();
      oRm.close("circle");

      // Active Arc (Colored)
      if (!isZeroTotal && pct > 0) {
        oRm.openStart("circle");
        oRm.attr("cx", "50");
        oRm.attr("cy", "50");
        oRm.attr("r", radius);
        oRm.attr("fill", "none");
        oRm.attr("stroke", arcColor);
        oRm.attr("stroke-width", "13");
        oRm.attr("stroke-dasharray", circumference.toFixed(2));
        oRm.attr("stroke-dashoffset", strokeDashoffset.toFixed(2));
        oRm.attr("transform", "rotate(-90 50 50)");
        oRm.attr("class", "sapDashDonutArc");
        oRm.openEnd();
        oRm.close("circle");
      }

      // Center Percentage Text (Bold & Centered)
      oRm.openStart("text");
      oRm.attr("x", "50");
      oRm.attr("y", "56");
      oRm.attr("text-anchor", "middle");
      oRm.attr("class", "sapDashDonutCenterText");
      oRm.style("fill", textColor);
      oRm.openEnd();
      oRm.text(pctLabel);
      oRm.close("text");

      oRm.close("svg");
      oRm.close("div"); // donut svg wrap

      // Bottom Meta & Counts
      if (showMeta) {
        oRm.openStart("div");
        oRm.class("sapDashDonutName");
        oRm.openEnd();
        oRm.text(name);
        oRm.close("div");

        oRm.openStart("div");
        oRm.class("sapDashDonutStats");
        oRm.openEnd();

        oRm.openStart("span");
        oRm.style("color", "#0a6ed1");
        oRm.style("font-weight", "600");
        oRm.openEnd();
        oRm.text(assigned + "A");
        oRm.close("span");

        oRm.openStart("span");
        oRm.style("color", "#cbd5e1");
        oRm.openEnd();
        oRm.text("/");
        oRm.close("span");

        oRm.openStart("span");
        oRm.style("color", "#d08014");
        oRm.style("font-weight", "600");
        oRm.openEnd();
        oRm.text(notAssigned + "U");
        oRm.close("span");

        oRm.openStart("span");
        oRm.style("color", "#64748b");
        oRm.openEnd();
        oRm.text("(" + total + ")");
        oRm.close("span");

        oRm.close("div"); // stats
      }

      oRm.close("div"); // card
    }
  });
});
