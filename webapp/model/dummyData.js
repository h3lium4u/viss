(function (root, factory) {
  if (typeof sap === "object" && typeof sap.ui === "object" && typeof sap.ui.define === "function") {
    sap.ui.define([], factory);
  } else if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.dummyData = factory();
  }
})(this, function () {
  "use strict";

  function SeededRNG(seed) {
    this.seed = seed % 2147483647;
    if (this.seed <= 0) this.seed += 2147483646;
  }

  SeededRNG.prototype.next = function () {
    this.seed = (this.seed * 16807) % 2147483647;
    return (this.seed - 1) / 2147483646;
  };

  SeededRNG.prototype.nextInt = function (min, max) {
    return Math.floor(this.next() * (max - min + 1)) + min;
  };

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

  var categories = ["Infrastructure", "Core Services", "Security", "Analytics", "Operations", "Billing", "Platform"];
  var departments = ["Cloud Eng", "Data Ops", "Infra Core", "SecOps", "Enterprise Apps", "FinTech Systems"];
  var priorities = ["High", "Medium", "Low"];

  var curatedItems = [
    { id: "ITM-001", name: "Inventory Sync Service", category: "Core Services", department: "Enterprise Apps", priority: "High", assigned: 18, notAssigned: 12, description: "Synchronizes stock levels across multiple geographic warehouses." },
    { id: "ITM-002", name: "Payment Gateway Adapter", category: "Billing", department: "FinTech Systems", priority: "High", assigned: 7, notAssigned: 23, description: "External payment gateway routing and transaction settlement." },
    { id: "ITM-003", name: "Order Dispatch Pipeline", category: "Operations", department: "Enterprise Apps", priority: "High", assigned: 25, notAssigned: 5, description: "Automated fulfillment dispatch and carrier assignment." },
    { id: "ITM-004", name: "Customer Analytics Stream", category: "Analytics", department: "Data Ops", priority: "Medium", assigned: 11, notAssigned: 9, description: "Real-time user event ingestion and cohort behavioral analysis." },
    { id: "ITM-005", name: "Warehouse Robotics Unit", category: "Operations", department: "Enterprise Apps", priority: "High", assigned: 42, notAssigned: 0, description: "Automated guided vehicle fleet routing. All slots fully allocated." },
    { id: "ITM-006", name: "Legacy Ledger Migrator", category: "Core Services", department: "FinTech Systems", priority: "Low", assigned: 0, notAssigned: 34, description: "Pending migration backlog awaiting schema verification." },
    { id: "ITM-007", name: "Decommissioned Node 7", category: "Infrastructure", department: "Infra Core", priority: "Low", assigned: 0, notAssigned: 0, description: "Retired compute cluster preserved for audit trail. No active workload." },
    { id: "ITM-008", name: "Global Search Indexer", category: "Platform", department: "Cloud Eng", priority: "High", assigned: 480, notAssigned: 220, description: "Distributed document indexer operating at enterprise search volume." },
    { id: "ITM-009", name: "Micro-Notification Queue", category: "Infrastructure", department: "Cloud Eng", priority: "Low", assigned: 2, notAssigned: 1, description: "Low-throughput canary queue for webhook delivery." },
    { id: "ITM-010", name: "Enterprise Resource Planning Cross-Department Synchronizer Core", category: "Core Services", department: "Enterprise Apps", priority: "High", assigned: 19, notAssigned: 14, description: "Large-scale inter-service ERP data synchronization bus." },
    { id: "ITM-011", name: "API Gateway Mesh", category: "Infrastructure", department: "Cloud Eng", priority: "High", assigned: 15, notAssigned: 15, description: "Evenly balanced traffic split across primary ingress points." },
    { id: "ITM-012", name: "Telemetry Collector", category: "Analytics", department: "Data Ops", priority: "Medium", assigned: 8, notAssigned: 32, description: "System performance and health metrics ingestion." },
    { id: "ITM-013", name: "OAuth Authorization Server", category: "Security", department: "SecOps", priority: "High", assigned: 50, notAssigned: 50, description: "50/50 token generation and validation pool." },
    { id: "ITM-014", name: "Fraud Detection Engine", category: "Security", department: "SecOps", priority: "High", assigned: 88, notAssigned: 12, description: "Real-time anomaly scoring for suspicious transactions." },
    { id: "ITM-015", name: "Audit Compliance Logger", category: "Security", department: "SecOps", priority: "Medium", assigned: 30, notAssigned: 10, description: "Immutable audit trail recorder for regulatory compliance." },
    { id: "ITM-016", name: "Billing Rate Calculator", category: "Billing", department: "FinTech Systems", priority: "Medium", assigned: 14, notAssigned: 26, description: "Tiered subscription and metered usage tariff engine." },
    { id: "ITM-017", name: "Document Storage Cluster", category: "Platform", department: "Cloud Eng", priority: "Medium", assigned: 60, notAssigned: 40, description: "High-availability object store for client invoices." },
    { id: "ITM-018", name: "Identity Federation Service", category: "Security", department: "SecOps", priority: "High", assigned: 5, notAssigned: 45, description: "SAML/OIDC SSO federation gateway with pending sync." },
    { id: "ITM-019", name: "Realtime Notification Hub", category: "Platform", department: "Cloud Eng", priority: "Medium", assigned: 72, notAssigned: 8, description: "Push notification routing for mobile and desktop clients." },
    { id: "ITM-020", name: "Supply Chain Tracker", category: "Operations", department: "Enterprise Apps", priority: "High", assigned: 33, notAssigned: 27, description: "End-to-end consignment tracking and transit updates." },
    { id: "ITM-021", name: "Asset Tagging Daemon", category: "Operations", department: "Enterprise Apps", priority: "Low", assigned: 19, notAssigned: 21, description: "RFID and barcode serialization registry." },
    { id: "ITM-022", name: "Log Aggregator Worker", category: "Analytics", department: "Data Ops", priority: "Medium", assigned: 44, notAssigned: 16, description: "Centralized syslog parsing and index shipper." },
    { id: "ITM-023", name: "Database Shard Manager", category: "Infrastructure", department: "Infra Core", priority: "High", assigned: 80, notAssigned: 20, description: "Dynamic partitioning router for PostgreSQL cluster." },
    { id: "ITM-024", name: "Archive Staging Volume", category: "Infrastructure", department: "Infra Core", priority: "Low", assigned: 0, notAssigned: 0, description: "Cold storage volume awaiting lifecycle activation." },
    { id: "ITM-025", name: "Edge CDN Cache Node", category: "Infrastructure", department: "Cloud Eng", priority: "High", assigned: 65, notAssigned: 5, description: "PoP edge caching node with 93% hit allocation." },
    { id: "ITM-026", name: "Queue Depth Monitor", category: "Analytics", department: "Data Ops", priority: "Medium", assigned: 12, notAssigned: 48, description: "Kafka consumer lag detection and backpressure alerting." },
    { id: "ITM-027", name: "Batch Invoice Processor", category: "Billing", department: "FinTech Systems", priority: "High", assigned: 38, notAssigned: 12, description: "Overnight billing batch cycle job scheduler." },
    { id: "ITM-028", name: "Session Replication Broker", category: "Platform", department: "Cloud Eng", priority: "Medium", assigned: 29, notAssigned: 31, description: "Redis active-active session state synchronizer." },
    { id: "ITM-029", name: "Secrets Vault Connector", category: "Security", department: "SecOps", priority: "High", assigned: 52, notAssigned: 8, description: "Dynamic API key rotation and cert provisioning." },
    { id: "ITM-030", name: "Container Mesh Proxy", category: "Infrastructure", department: "Cloud Eng", priority: "High", assigned: 17, notAssigned: 33, description: "Envoy sidecar proxy routing internal microservice traffic." }
  ];

  var serviceNames = [
    "Rate Limiter Service", "Event Bus Coordinator", "GraphQL Gateway", "Metrics Forwarder",
    "Customer Profiler", "Email Delivery Relay", "SMS Notification Gateway", "PDF Generation Worker",
    "Data Export Scheduler", "Import Validation Engine", "User Session Manager", "Feature Flag Dispatcher",
    "Configuration Manager", "Certificate Authority Sync", "Network Traffic Analyzer", "Webhook Event Listener",
    "File Upload Pipeline", "Thumbnail Generator Service", "GeoIP Resolver Service", "Localization Dictionary",
    "Currency Conversion Feed", "Tax Calculation Engine", "Discount Rule Evaluator", "Credit Check Verification",
    "Address Normalizer", "Shipping Rate Estimator", "Inventory Reservation Lock", "Returns Processing Handler",
    "Support Ticket Router", "Customer Survey Ingestion", "Sentiment Analysis Engine", "Recommendation Model",
    "Machine Learning Inference Node", "Feature Store Pipeline", "Data Lake Cataloguer", "Cold Storage Migrator",
    "Database Backup Agent", "Failover Orchestrator", "DNS Record Updater", "SSL Termination Proxy",
    "Health Check Sentinel", "Alert Escalation Matrix", "Incident Response Bot", "Audit Report Synthesizer",
    "GDPR Compliance Scrub", "PII Redaction Service", "Token Refresh Worker", "Access Policy Enforcer",
    "Role Permission Cache", "API Key Validator", "Single Sign-On Connector", "Multi-Factor Authentication Hub",
    "Device Fingerprint Analyzer", "Bot Mitigation Filter", "Rate Limit Enforcer", "Traffic Throttling Controller",
    "Load Balancer Probe", "Microservice Router", "Fault Injection Tester", "Distributed Tracing Agent",
    "Memory Cache Replicator", "Key-Value Store Node", "Elasticsearch Cluster Shard", "Time Series Database Collector",
    "Graph Database Engine", "Vector Similarity Search", "Document Indexing Worker", "Content Moderation Filter",
    "Fraud Scoring Model", "Risk Assessment Engine", "Payment Clearing Gateway", "Direct Debit Mandate Worker",
    "Virtual Account Allocator", "Reconciliation Engine", "Financial Ledger Validator", "Tax Exemption Verifier",
    "Contract Lifecycle Tracker", "Vendor Integration Bridge", "Partner API Dispatcher", "Webhook Delivery Broker",
    "Notification Delivery Guard", "Push Token Registry", "In-App Messaging Service", "User Feedback Aggregator",
    "Search Autocomplete Provider", "Facet Aggregation Service", "Catalog Sync Worker", "Pricing Matrix Calculator",
    "Promotional Campaign Engine", "Affiliate Referral Tracker", "Clickstream Attribution Worker"
  ];

  function generateFullDataset() {
    var rng = new SeededRNG(98765);
    var dataset = [];

    // Add first 30 curated items
    for (var i = 0; i < curatedItems.length; i++) {
      var c = curatedItems[i];
      var total = c.assigned + c.notAssigned;
      var pct = calculatePercentage(c.assigned, total);
      var status = getItemStatus(c.assigned, c.notAssigned);
      dataset.push({
        id: c.id,
        name: c.name,
        category: c.category,
        department: c.department,
        priority: c.priority,
        assigned: c.assigned,
        notAssigned: c.notAssigned,
        total: total,
        assignedPercentage: pct,
        status: status,
        description: c.description
      });
    }

    // Generate items 31 to 120 deterministically
    for (var j = 31; j <= 120; j++) {
      var idStr = "ITM-" + (j < 100 ? "0" + j : j);
      var nameIdx = (j - 31) % serviceNames.length;
      var name = serviceNames[nameIdx];
      var cat = categories[rng.nextInt(0, categories.length - 1)];
      var dept = departments[rng.nextInt(0, departments.length - 1)];
      var prio = priorities[rng.nextInt(0, priorities.length - 1)];

      var roll = rng.next();
      var assigned = 0;
      var notAssigned = 0;

      if (roll < 0.04) {
        // Zero-total edge case
        assigned = 0;
        notAssigned = 0;
      } else if (roll < 0.08) {
        // Fully assigned edge case
        assigned = rng.nextInt(15, 60);
        notAssigned = 0;
      } else if (roll < 0.12) {
        // None assigned edge case
        assigned = 0;
        notAssigned = rng.nextInt(15, 55);
      } else if (roll < 0.16) {
        // Large volume edge case
        assigned = rng.nextInt(200, 600);
        notAssigned = rng.nextInt(100, 400);
      } else if (roll < 0.22) {
        // Small volume edge case
        assigned = rng.nextInt(1, 4);
        notAssigned = rng.nextInt(1, 4);
      } else {
        // Standard random distribution
        assigned = rng.nextInt(5, 75);
        notAssigned = rng.nextInt(5, 75);
      }

      var itmTotal = assigned + notAssigned;
      var itmPct = calculatePercentage(assigned, itmTotal);
      var itmStatus = getItemStatus(assigned, notAssigned);

      dataset.push({
        id: idStr,
        name: name,
        category: cat,
        department: dept,
        priority: prio,
        assigned: assigned,
        notAssigned: notAssigned,
        total: itmTotal,
        assignedPercentage: itmPct,
        status: itmStatus,
        description: "Enterprise operational module handling " + name.toLowerCase() + " functions."
      });
    }

    return dataset;
  }

  var fullDataset = generateFullDataset();

  return {
    getFullDataset: function () {
      return fullDataset.slice();
    },
    getDatasetBySize: function (size) {
      var n = parseInt(size, 10) || 30;
      return fullDataset.slice(0, n);
    },
    getItemStatus: getItemStatus,
    calculatePercentage: calculatePercentage
  };
});
