sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/json/JSONModel",
  "sap/ui/core/Fragment",
  "sap/dashboard/model/dummyData",
  "sap/dashboard/model/calculations",
  "sap/dashboard/model/formatter"
], function (Controller, JSONModel, Fragment, dummyData, calculations, formatter) {
  "use strict";

  return Controller.extend("sap.dashboard.controller.Dashboard", {
    formatter: formatter,

    onInit: function () {
      var initialCohortSize = 30;
      var rawItems = dummyData.getDatasetBySize(initialCohortSize);
      var stats = calculations.calculateDatasetStats(rawItems);
      var filteredItems = calculations.sortItems(
        calculations.filterItems(rawItems, "", "all"),
        "name-asc"
      );

      var oViewModel = new JSONModel({
        viewMode: "grid",
        scaleMode: "proportion",
        cohortSize: "30",
        searchQuery: "",
        statusFilter: "all",
        sortOption: "name-asc",
        allItems: rawItems,
        filteredItems: filteredItems,
        stats: stats,
        selectedItem: null
      });

      this.getView().setModel(oViewModel, "dashboard");
      this._oDialogPromise = null;
    },

    _updateDataset: function () {
      var oModel = this.getView().getModel("dashboard");
      var allItems = oModel.getProperty("/allItems");
      var searchQuery = oModel.getProperty("/searchQuery");
      var statusFilter = oModel.getProperty("/statusFilter");
      var sortOption = oModel.getProperty("/sortOption");

      var stats = calculations.calculateDatasetStats(allItems);
      var filtered = calculations.filterItems(allItems, searchQuery, statusFilter);
      var sorted = calculations.sortItems(filtered, sortOption);

      oModel.setProperty("/stats", stats);
      oModel.setProperty("/filteredItems", sorted);
    },

    onViewModeChange: function (oEvent) {
      var key = oEvent.getParameter("item").getKey();
      var oModel = this.getView().getModel("dashboard");
      oModel.setProperty("/viewMode", key);
    },

    onScaleModeChange: function (oEvent) {
      var key = oEvent.getParameter("item").getKey();
      var oModel = this.getView().getModel("dashboard");
      oModel.setProperty("/scaleMode", key);
    },

    onCohortSizeChange: function (oEvent) {
      var size = parseInt(oEvent.getParameter("item").getKey(), 10) || 30;
      var newItems = dummyData.getDatasetBySize(size);
      var oModel = this.getView().getModel("dashboard");

      oModel.setProperty("/allItems", newItems);
      this._updateDataset();
    },

    onSearchLiveChange: function (oEvent) {
      var query = oEvent.getParameter("newValue") || "";
      var oModel = this.getView().getModel("dashboard");
      oModel.setProperty("/searchQuery", query);
      this._updateDataset();
    },

    onFilterChange: function (oEvent) {
      var key = oEvent.getParameter("selectedItem").getKey();
      var oModel = this.getView().getModel("dashboard");
      oModel.setProperty("/statusFilter", key);
      this._updateDataset();
    },

    onSortChange: function (oEvent) {
      var key = oEvent.getParameter("selectedItem").getKey();
      var oModel = this.getView().getModel("dashboard");
      oModel.setProperty("/sortOption", key);
      this._updateDataset();
    },

    onResetFilters: function () {
      var oModel = this.getView().getModel("dashboard");
      oModel.setProperty("/searchQuery", "");
      oModel.setProperty("/statusFilter", "all");
      oModel.setProperty("/sortOption", "name-asc");
      this._updateDataset();
    },

    onItemPress: function (oEvent) {
      var oBindingContext = oEvent.getSource().getBindingContext("dashboard");
      if (oBindingContext) {
        var item = oBindingContext.getObject();
        this._openItemDetail(item);
      }
    },

    onTableItemPress: function (oEvent) {
      var oItem = oEvent.getParameter("listItem");
      if (oItem) {
        var oBindingContext = oItem.getBindingContext("dashboard");
        if (oBindingContext) {
          this._openItemDetail(oBindingContext.getObject());
        }
      }
    },

    _generateInsightText: function (item) {
      if (!item) return "";
      if (item.total <= 0) {
        return "This item represents an inactive or decommissioned service record with 0 total volume. Percentage is undefined ('No data') to maintain mathematical precision.";
      }
      if (item.status === "fully-assigned") {
        return "Optimal allocation achieved: 100% of the " + item.total + " operational units are assigned with zero backlog remaining.";
      }
      if (item.status === "none-assigned") {
        return "Critical attention required: 0% of the " + item.total + " units are assigned, leaving all " + item.notAssigned + " units unallocated.";
      }
      if (item.assignedPercentage >= 50) {
        return "Healthy progress: " + item.assignedPercentage.toFixed(1) + "% (" + item.assigned + " of " + item.total + ") of units are assigned. Backlog is " + item.notAssigned + " units.";
      }
      return "Sub-optimal balance: Only " + item.assignedPercentage.toFixed(1) + "% (" + item.assigned + " of " + item.total + ") is assigned, with " + item.notAssigned + " units remaining unallocated.";
    },

    _openItemDetail: function (item) {
      var oView = this.getView();
      var oModel = oView.getModel("dashboard");

      var itemCopy = Object.assign({}, item);
      itemCopy.insightText = this._generateInsightText(item);
      oModel.setProperty("/selectedItem", itemCopy);

      if (!this._oDialog) {
        this._oDialog = Fragment.load({
          id: oView.getId(),
          name: "sap.dashboard.view.fragments.ItemDetailDialog",
          controller: this
        }).then(function (oDialog) {
          oView.addDependent(oDialog);
          return oDialog;
        });
      }

      this._oDialog.then(function (oDialog) {
        oDialog.open();
      });
    },

    onCloseDialog: function () {
      if (this._oDialog) {
        this._oDialog.then(function (oDialog) {
          oDialog.close();
        });
      }
    },

    onDialogEscape: function (oPromise) {
      oPromise.resolve();
    }
  });
});
