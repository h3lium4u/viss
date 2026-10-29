# SAP Fiori Workload Analytics: Assigned vs. Not Assigned Dashboard

A high-performance SAPUI5 / OpenUI5 application comparing six visualization paradigms for individual "Assigned vs. Not Assigned" workload items using deterministic dummy cohorts.

---

## 🛠 Technology Stack

- **Framework**: SAPUI5 / OpenUI5 (official SAP Horizon theme `sap_horizon`)
- **Layout & Declarative Views**: SAPUI5 XML Views & XML Fragments
- **Application Logic & Interactions**: Vanilla JavaScript (ES6 / AMD / SAPUI5 modular controls)
- **Styling**: Pure CSS (`webapp/css/style.css`) utilizing official SAP Fiori Horizon design tokens
- **Testing**: Node.js native test runner (`node:test` & `node:assert/strict`)
- **Runtime / Server**: Zero-dependency Node HTTP static server (`server.js`)

> **Note**: Completely free of React, JSX/TSX, TypeScript, Vite, Tailwind CSS, or third-party charting libraries.

---

## 🚀 Running the Application

### 1. Start the Local Server
```bash
npm start
# Or directly:
node dev-server.js
```
The application will be accessible at:
- Root URL: [http://127.0.0.1:8080/](http://127.0.0.1:8080/)
- WebApp Entry: [http://127.0.0.1:8080/webapp/index.html](http://127.0.0.1:8080/webapp/index.html)

### 2. Run the Unit Test Suite
```bash
npm test
# Or directly:
node test/dashboard.test.js
```

### 3. Deploy to Vercel
This project is pre-configured for one-click static hosting on Vercel:
- **Option A (Vercel CLI)**: Run `vercel` in the project root.
- **Option B (GitHub / Git)**: Push to GitHub and import the repository on [Vercel](https://vercel.com/new). Vercel will automatically detect `vercel.json` and serve the dashboard globally.

---

## 📊 The Six Visualization Modes

Switch between all six modes with the prominent view switcher:

```
[ Card Grid ] [ Compact List ] [ Heatmap Matrix ] [ Butterfly Chart ] [ Dumbbell Plot ] [ Circular Donut / Pie ]
```

1. **Compact Card Grid (`grid`)**:
   Responsive multi-column card layout (`sap.f.Card` style). Each card displays item ID, assignment %, full name, a segmented horizontal bar (`#0a6ed1` assigned, `#d08014` not assigned), and exact counts. Click any card to open the detail dialog.

2. **Compact Visualization List (`list`)**:
   Dense, scannable tabular view (`sap.m.Table`). Shows ID & Name, inline segmented bar, numerical counts, percentage badge, total volume, and status.

3. **Heatmap Matrix (`heatmap`)**:
   Uniform compact cells arranged in a responsive grid. Assignment intensity is mapped to a 7-bracket lightness scale (from No Data striped gray to 100% solid SAP blue). Features an integrated legend and exact counts.

4. **Butterfly / Diverging Bar Chart (`butterfly`)**:
   Bilateral bars extending in opposite directions from a central zero baseline. Unassigned volume extends left (`#d08014`); assigned volume extends right (`#0a6ed1`). Enables direct visual comparison of work balance.

5. **Dumbbell / Paired Dot Plot (`dumbbell`)**:
   Horizontal tracks featuring an Assigned dot (`#0a6ed1`) and a Not Assigned dot (`#d08014`) connected by a delta line. Displays exact gap (`Δ`) and concentric rings when values are identical.

6. **Circular Donut / Pie Progress Chart (`pie`)**:
   Circular donut progress rings directly modeled on the uploaded reference pattern. Each card features an outer SVG ring with a light neutral track (`#eaedf0`), an active filled arc proportional to the assignment percentage starting at 12 o'clock, bold centered percentage text, and item counts. Includes an executive macro cohort donut at the top. Click any ring card to inspect complete item details.

---

## ⚙ Shared Features & Controls

- **Deterministic Cohorts**: Stable 30, 50, and 100 item cohorts generated using a seeded Linear Congruential Generator.
- **Mathematical Integrity**:
  $$\text{Total} = \text{Assigned} + \text{Not Assigned}$$
  $$\text{Assigned \%} = \frac{\text{Assigned}}{\text{Total}} \times 100 \quad (\text{null if Total} = 0)$$
- **Zero-Total Handling**: Items with 0 volume display "—" or "No Data" (never "0%").
- **State Preservation**: Switching views preserves search queries, status filters, sorting, scale modes, and cohort sizes.
- **Interactive Inspection**: Selecting any item across all 6 views opens the SAPUI5 `ItemDetailDialog` with full metadata, dual-scale bars, and contextual analysis.
