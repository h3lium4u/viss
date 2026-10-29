sap.ui.define([
  "sap/ui/core/ComponentContainer"
], function (ComponentContainer) {
  "use strict";

  // Remove or hide initial loading indicator
  var loader = document.getElementById("ui5-loading-indicator");
  if (loader) {
    loader.style.display = "none";
  }

  new ComponentContainer({
    name: "sap.dashboard",
    height: "100%",
    settings: {
      id: "sap.dashboard"
    },
    async: true
  }).placeAt("content");
});
