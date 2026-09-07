# LOC-IQ — COMPLETE FORENSIC REVERSE-ENGINEERING SOURCEPACK & PROJECT TRUTH AUDIT

> **DOCUMENT STATUS**: STRICT READ-ONLY FORENSIC REVERSE-ENGINEERING REPORT  
> **TARGET REPOSITORY**: Loc-IQ (`d:\0000_after portfolio_25726\3_loc-iq\loc-iq`)  
> **COMMIT HASH**: `e597d7b` (`feat: Phase 2 complete — Investigation, Master Data, Intelligence Graph, Network Lab`)  
> **AUDIT DATE**: September 7, 2026  
> **EVIDENCE STANDARD**: 100% empirical source code, data file, execution log, and type check verification. Zero invented behavior.

---

## PART 1 — EXECUTIVE PROJECT TRUTH

### 1. What Loc-IQ Actually Is
**Loc-IQ** is a web-based interactive builder console, architecture visualizer, and deterministic investigation workstation designed to evaluate **location evidence & address consistency** in retail credit underwriting and fraud investigation workflows ([app/page.tsx:L15-L147](file:///d:/0000_after%20portfolio_25726/3_loc-iq/loc-iq/app/page.tsx#L15-L147)).

It demonstrates how applicant digital footprints—such as mobile phone number series, credit bureau address histories, bank branch IFSC codes, IP geolocation data, UPI merchant VPAs, and cell tower metadata—can be mapped into a multi-layered directed network graph to evaluate whether an applicant physically resides at their declared address without relying on invasive live GPS tracking or hardware probes ([src/lib/resolver.ts:L97-L518](file:///d:/0000_after%20portfolio_25726/3_loc-iq/loc-iq/src/lib/resolver.ts#L97-L518)).

### 2. The Problem It Demonstrates
In retail lending, micro-finance, and credit card issuance:
- Applicants declare a home or office pincode/address.
- Fraud rings often submit synthetic addresses or operate remotely through VPNs/proxies.
- Traditional systems rely either on manual field verification visits (costly, slow) or binary address string matching (brittle, prone to false positives).

Loc-IQ demonstrates how **triangulating multiple non-GPS digital signals** with explicit trust discounts (e.g., heavily discounting proxy IPs) and recency factors can yield ranked physical candidate location hypotheses, evidence share metrics, and explainable consistency decisions (`CONSISTENT`, `REVIEW`, `CONFLICT`).

### 3. What the Product DOES in the Repository
1. **Runs a Deterministic Graph Solver**: Resolves evidence signals, computes effective weights ($\text{effWeight} = \text{base\_weight} \times \text{recency\_factor} \times \text{ip\_trust\_factor}$), allocates exact 100% integer evidence shares using the Largest Remainder Method, and evaluates address consistency ([src/lib/resolver.ts:L72-L440](file:///d:/0000_after%20portfolio_25726/3_loc-iq/loc-iq/src/lib/resolver.ts#L72-L440)).
2. **Visualizes a 6-Layer Provenance Graph**: Dynamically positions nodes across 6 functional layers (`IDENTIFIER`, `SOURCE`, `EVIDENCE`, `SIGNAL`, `CANDIDATE_LOCATION`, `DECISION`) using ReactFlow ([src/components/GraphVisualizer.tsx:L31-L100](file:///d:/0000_after%20portfolio_25726/3_loc-iq/loc-iq/src/components/GraphVisualizer.tsx#L31-L100)).
3. **Implements a 273-Node Master Knowledge Graph**: Maps 6 primary keys, 46 data sources, 42 fetched fields, 77 derived signals, and 102 masterclass documentation topics with BFS shortest-path graph search ([src/lib/knowledgeGraph.ts:L21-L300](file:///d:/0000_after%20portfolio_25726/3_loc-iq/loc-iq/src/lib/knowledgeGraph.ts#L21-L300)).
4. **Executes a Multi-Case Entity Network Lab**: Models a synthetic entity network with 79 nodes and 61 edges to run automated pattern detection for shared devices, reused contact attributes, shared VPN proxies, address concentration, and geographic convergence ([src/lib/entityNetworkAnalytics.ts:L15-L350](file:///d:/0000_after%20portfolio_25726/3_loc-iq/loc-iq/src/lib/entityNetworkAnalytics.ts#L15-L350)).
5. **Generates Synthetic Custom Scenarios**: Allows users to enter custom inputs and choose simulation profiles (`baseline`, `proxy_risk`, `physical_conflict`) to dynamically synthesize fields, signals, and candidate location rankings ([src/lib/resolver.ts:L548-L677](file:///d:/0000_after%20portfolio_25726/3_loc-iq/loc-iq/src/lib/resolver.ts#L548-L677)).
6. **Passes 131 Automated Verification Tests**: Executes end-to-end unit, graph, and invariant assertions ([scripts/test_engine.ts:L1-L350](file:///d:/0000_after%20portfolio_25726/3_loc-iq/loc-iq/scripts/test_engine.ts#L1-L350)).

### 4. What It DOES NOT Do
- Does **NOT** make live HTTP network calls to external bank, telecom, credit bureau, or IP geolocation APIs.
- Does **NOT** store records in a database (SQL, NoSQL, or Graph Database).
- Does **NOT** fit, train, or execute machine learning models (no PyTorch, TensorFlow, scikit-learn, logistic regression, or XGBoost).
- Does **NOT** compute statistical credit default metrics (no AUROC, Gini coefficient, KS statistic, or PSI/CSI).
- Does **NOT** execute backend server microservices (100% client-side React execution).
- Does **NOT** access real personal data, client databases, or live customer identities.

### 5. Technical Classification Checklist
- **Live customer data**: `NO`
- **Real external APIs**: `NO`
- **Databases**: `NO`
- **Machine learning**: `NO`
- **LLMs**: `NO`
- **Graph databases**: `NO`
- **Real-time geolocation**: `NO`
- **Real fraud decisions**: `NO`
- **Production risk models**: `NO`
- **Backend services**: `NO`
- **Browser-only / local deterministic logic**: `YES`
- **Synthetic / static data**: `YES`

### 6. Major Capabilities Classification Table

| Major Capability | Classification | Evidence / Source Code Citation |
| :--- | :--- | :--- |
| **Investigation Workstation UI & 6-Layer Graph** | `REAL IMPLEMENTED BEHAVIOR` | [app/page.tsx:L15-L147](file:///d:/0000_after%20portfolio_25726/3_loc-iq/loc-iq/app/page.tsx#L15-L147), [GraphVisualizer.tsx:L25-L100](file:///d:/0000_after%20portfolio_25726/3_loc-iq/loc-iq/src/components/GraphVisualizer.tsx#L25-L100) |
| **Runtime Graph Solver & Signal Weighting** | `REAL IMPLEMENTED BEHAVIOR` | [src/lib/resolver.ts:L97-L518](file:///d:/0000_after%20portfolio_25726/3_loc-iq/loc-iq/src/lib/resolver.ts#L97-L518) |
| **Knowledge Graph & Lineage Engine** | `REAL IMPLEMENTED BEHAVIOR` | [src/lib/knowledgeGraph.ts:L21-L205](file:///d:/0000_after%20portfolio_25726/3_loc-iq/loc-iq/src/lib/knowledgeGraph.ts#L21-L205), [IntelligenceGraphWorkspace.tsx:L48-L200](file:///d:/0000_after%20portfolio_25726/3_loc-iq/loc-iq/src/components/IntelligenceGraphWorkspace.tsx#L48-L200) |
| **Multi-Case Network Lab & Pattern Rules** | `REAL IMPLEMENTED BEHAVIOR` | [src/lib/entityNetworkAnalytics.ts:L15-L350](file:///d:/0000_after%20portfolio_25726/3_loc-iq/loc-iq/src/lib/entityNetworkAnalytics.ts#L15-L350), [NetworkLabWorkspace.tsx:L52-L200](file:///d:/0000_after%20portfolio_25726/3_loc-iq/loc-iq/src/components/NetworkLabWorkspace.tsx#L52-L200) |
| **Synthetic Custom Trace Generator** | `DETERMINISTIC SIMULATION` | [src/lib/resolver.ts:L548-L677](file:///d:/0000_after%20portfolio_25726/3_loc-iq/loc-iq/src/lib/resolver.ts#L548-L677) |
| **Predefined Demo Cases (`clean`, `fraud`, `maximum`)** | `STATIC/SYNTHETIC DATA` | [src/data/data_demo_cases.json:L1-L388](file:///d:/0000_after%20portfolio_25726/3_loc-iq/loc-iq/src/data/data_demo_cases.json#L1-L388) |
| **Synthetic Entity Network Dataset** | `STATIC/SYNTHETIC DATA` | [src/lib/entityNetworkData.ts:L15-L250](file:///d:/0000_after%20portfolio_25726/3_loc-iq/loc-iq/src/lib/entityNetworkData.ts#L15-L250) |
| **Masterclass Forensic Documentation** | `STATIC/SYNTHETIC DATA` | [src/data/masterclass.json:L1-L102](file:///d:/0000_after%20portfolio_25726/3_loc-iq/loc-iq/src/data/masterclass.json#L1-L102), [DetailPanels.tsx:L35-L343](file:///d:/0000_after%20portfolio_25726/3_loc-iq/loc-iq/src/components/DetailPanels.tsx#L35-L343) |
| **Live 46 External API Gateway** | `UI/CONCEPT DEMONSTRATION` | [src/data/data_api_universe.json:L1-L29547](file:///d:/0000_after%20portfolio_25726/3_loc-iq/loc-iq/src/data/data_api_universe.json#L1-L29547) (Catalogue definitions without HTTP fetch clients) |
| **Consent Gating Badges** | `UI/CONCEPT DEMONSTRATION` | [src/data/data_fetched_data_fields.json](file:///d:/0000_after%20portfolio_25726/3_loc-iq/loc-iq/src/data/data_fetched_data_fields.json) (`sits_in` metadata strings) |
| **Excel Parser Script (`scripts/parseExcel.mjs`)** | `UNUSED/LEGACY` | [scripts/parseExcel.mjs:L5](file:///d:/0000_after%20portfolio_25726/3_loc-iq/loc-iq/scripts/parseExcel.mjs#L5) (References legacy file name `Shared_Stage 1...` whereas local Excel file is named `NOT Sh_Stage 1...`) |

---

## PART 2 — COMPLETE ARCHITECTURE

### 1. Architectural Blueprint
- **Framework & Version**: Next.js `16.2.9` ([package.json:L23](file:///d:/0000_after%20portfolio_25726/3_loc-iq/loc-iq/package.json#L23)) with React `19.2.4` ([package.json:L24](file:///d:/0000_after%20portfolio_25726/3_loc-iq/loc-iq/package.json#L24))
- **Language**: TypeScript `^5` ([package.json:L38](file:///d:/0000_after%20portfolio_25726/3_loc-iq/loc-iq/package.json#L38))
- **Build System**: Next.js Turbopack build engine (`next build`)
- **Rendering Model**: Client-Side Single-Page Application (SPA) using `"use client"` directives rendered inside Next.js static page exports.
- **Routing Model**: Next.js App Router ([app/layout.tsx:L1-L30](file:///d:/0000_after%20portfolio_25726/3_loc-iq/loc-iq/app/layout.tsx#L1-L30), [app/page.tsx:L1-L148](file:///d:/0000_after%20portfolio_25726/3_loc-iq/loc-iq/app/page.tsx#L1-L148))
- **State Management**: React Context API ([src/context/AppContext.tsx:L52-L128](file:///d:/0000_after%20portfolio_25726/3_loc-iq/loc-iq/src/context/AppContext.tsx#L52-L128)) coupled with local component state hooks.
- **Graph Engines**:
  1. `@xyflow/react` (`^12.11.0`, [package.json:L17](file:///d:/0000_after%20portfolio_25726/3_loc-iq/loc-iq/package.json#L17)) for DOM graph rendering.
  2. Custom in-memory adjacency list graph data structures for BFS shortest path, connected components, and pattern rules ([src/lib/knowledgeGraph.ts:L267-L299](file:///d:/0000_after%20portfolio_25726/3_loc-iq/loc-iq/src/lib/knowledgeGraph.ts#L267-L299), [src/lib/entityNetworkAnalytics.ts:L15-L350](file:///d:/0000_after%20portfolio_25726/3_loc-iq/loc-iq/src/lib/entityNetworkAnalytics.ts#L15-L350)).
- **Styling**: Tailwind CSS v4 ([package.json:L37](file:///d:/0000_after%20portfolio_25726/3_loc-iq/loc-iq/package.json#L37)) with `@tailwindcss/postcss` v4 ([package.json:L31](file:///d:/0000_after%20portfolio_25726/3_loc-iq/loc-iq/package.json#L31)) and Lucide React icons ([package.json:L23](file:///d:/0000_after%20portfolio_25726/3_loc-iq/loc-iq/package.json#L23)).
- **UI Components**: Radix UI Primitives (`@radix-ui/react-dialog`, `@radix-ui/react-slot`, `@radix-ui/react-switch`, `@radix-ui/react-tabs`, `@radix-ui/react-tooltip`) and Framer Motion ([package.json:L13-L22](file:///d:/0000_after%20portfolio_25726/3_loc-iq/loc-iq/package.json#L13-L22)).

### 2. System Data Flow Diagram

```
INPUT / SCENARIO PRESET (Clean / Fraud / Maximum / Custom Form)
      ↓ [src/context/AppContext.tsx:L66-L107]
IDENTIFIERS (mobile_number, pan, aadhaar_number, email_id, customer_key, case_id, declared_pincode)
      ↓ [src/data/data_primary_identifiers.json]
EVIDENCE SOURCES (data_api_universe.json: 46 sources, e.g. Credit Bureau, IP Geolocation, IFSC)
      ↓ [src/data/data_api_universe.json]
OBSERVATIONS (data_fetched_data_fields.json: 42 fields, e.g. bureau_address_history, branch_ifsc, public_ip)
      ↓ [src/data/data_fetched_data_fields.json]
DERIVED SIGNALS (77 derived variables; effWeight = base_weight * recency_factor * ip_trust_factor)
      ↓ [src/lib/resolver.ts:L218]
CANDIDATE LOCATIONS (Ranked physical location hypotheses, e.g., Bengaluru 560001, Pune 411001)
      ↓ [src/lib/resolver.ts:L336-L360]
SCORING / EVIDENCE SHARE (Hamilton Largest Remainder Method exact 100% integer allocation)
      ↓ [src/lib/resolver.ts:L72-L92]
CONSISTENCY DECISION (CONSISTENT / REVIEW / CONFLICT + decisionReason)
      ↓ [src/lib/resolver.ts:L408-L440]
UI / GRAPH / EXPLANATION (ReactFlow 6-Layer Graph in GraphVisualizer.tsx & DecisionPanel.tsx)
```

---

## PART 3 — FILE-BY-FILE MAP

### 1. Root Configuration & Project Files

| File Path | Role & Purpose | Exports / Contents | Runtime Participation |
| :--- | :--- | :--- | :--- |
| `package.json` | Project manifest & scripts | NPM dependencies (`next`, `react`, `@xyflow/react`), scripts (`dev`, `build`, `test`) | Yes (build & test runner) |
| `tsconfig.json` | TypeScript compiler configuration | Path aliases (`@/*` -> `./src/*`), target ES2017, JSX react-jsx | Yes (type check & build) |
| `next.config.ts` | Next.js framework configuration | NextConfig object | Yes (build phase) |
| `eslint.config.mjs` | ESLint static code analysis rules | Next.js ESLint configuration | Yes (linting) |
| `postcss.config.mjs` | PostCSS plugin configuration | Tailwind PostCSS plugin settings | Yes (CSS compilation) |
| `components.json` | Shadcn UI CLI configuration | Style tokens, icon libraries | Build-time metadata |
| `README.md` | General project documentation | Architectural overview, run instructions, project claims | Documentation only |
| `PROJECT_TRUTH_loc-iq.md` | Formal project truth audit | Claims reconciliation, dataset breakdown, interview prep | Documentation only |
| `LOCIQ_MASTERCLASS.md` | 57KB comprehensive masterclass manual | Markdown text for 102 masterclass sections | Seed source for `scripts/parse_masterclass.js` |
| `LICENSE` | MIT License file | Open-source MIT license text | Documentation only |
| `NOT Sh_Stage 1_Master Workbook_Fraud Intelligence Project.xlsx` | Root master Excel workbook | 146KB Excel sheets containing raw identifiers, fields, and APIs | Static local reference workbook |

### 2. App Router Layer (`app/`)

| File Path | Role & Purpose | Exports / Contents | Runtime Participation |
| :--- | :--- | :--- | :--- |
| [app/layout.tsx](file:///d:/0000_after%20portfolio_25726/3_loc-iq/loc-iq/app/layout.tsx) | Root layout wrapper | `RootLayout` component, AppProvider wrapper, fonts, metadata | Yes (every page render) |
| [app/page.tsx](file:///d:/0000_after%20portfolio_25726/3_loc-iq/loc-iq/app/page.tsx) | Main application workstation | `WorkstationPage` component; manages active workspace state (`INVESTIGATION`, `INTELLIGENCE_GRAPH`, `NETWORK_LAB`) | Yes (primary entry point) |
| [app/globals.css](file:///d:/0000_after%20portfolio_25726/3_loc-iq/loc-iq/app/globals.css) | Global stylesheet | Tailwind CSS v4 `@theme` definitions, dark mode palette, custom scrollbars | Yes (styling layer) |
| `app/favicon.ico` | Application browser favicon | Favicon icon binary | Yes (browser asset) |

### 3. Application Components Layer (`src/components/`)

| File Path | Role & Purpose | Exports / Contents | Runtime Participation |
| :--- | :--- | :--- | :--- |
| [src/components/Header.tsx](file:///d:/0000_after%20portfolio_25726/3_loc-iq/loc-iq/src/components/Header.tsx) | Top application navigation header | `Header` component; active scenario indicator, scenario buttons, workspace tab triggers | Yes (always visible) |
| [src/components/CaseContextRail.tsx](file:///d:/0000_after%20portfolio_25726/3_loc-iq/loc-iq/src/components/CaseContextRail.tsx) | Left sidebar context panel | `CaseContextRail` component; applicant seed identifiers, evidence pipeline metrics, scenario switcher | Yes (Investigation view) |
| [src/components/GraphVisualizer.tsx](file:///d:/0000_after%20portfolio_25726/3_loc-iq/loc-iq/src/components/GraphVisualizer.tsx) | Center 6-layer ReactFlow graph canvas | `GraphVisualizer` component; projects nodes across 6 layers, handles node clicks & slide-over inspection | Yes (Investigation view) |
| [src/components/DecisionPanel.tsx](file:///d:/0000_after%20portfolio_25726/3_loc-iq/loc-iq/src/components/DecisionPanel.tsx) | Right forensic decision & ranking panel | `DecisionPanel` component; address consistency card, ranked physical candidate cards, evidence breakdown | Yes (Investigation view) |
| [src/components/IntelligenceGraphWorkspace.tsx](file:///d:/0000_after%20portfolio_25726/3_loc-iq/loc-iq/src/components/IntelligenceGraphWorkspace.tsx) | Full-screen Knowledge Graph visualizer | `IntelligenceGraphWorkspace` component; lens switching (`LINEAGE`, `ACCESS`, `ACTIVE_CASE`), BFS shortest path | Yes (Intelligence view) |
| [src/components/NetworkLabWorkspace.tsx](file:///d:/0000_after%20portfolio_25726/3_loc-iq/loc-iq/src/components/NetworkLabWorkspace.tsx) | Multi-case synthetic entity network lab | `NetworkLabWorkspace` component; interactive pattern findings (`SHARED_DEVICE`, `REUSED_CONTACT`, `SHARED_PROXY`) | Yes (Network Lab view) |
| [src/components/ReferenceLibraryModal.tsx](file:///d:/0000_after%20portfolio_25726/3_loc-iq/loc-iq/src/components/ReferenceLibraryModal.tsx) | Master Data Reference Library modal | `ReferenceLibraryModal` component; searchable catalogue tabs for 6 Keys, 42 Fields, 46 APIs | Yes (modal overlay) |
| [src/components/NewInvestigationModal.tsx](file:///d:/0000_after%20portfolio_25726/3_loc-iq/loc-iq/src/components/NewInvestigationModal.tsx) | Custom Synthetic Trace modal | `NewInvestigationModal` component; custom form inputs, profile selection (`baseline`, `proxy_risk`, `physical_conflict`) | Yes (modal overlay) |
| [src/components/DetailPanels.tsx](file:///d:/0000_after%20portfolio_25726/3_loc-iq/loc-iq/src/components/DetailPanels.tsx) | Deep-dive forensic documentation renderer | `renderPrimaryIdentifierDetail`, `renderDataFieldDetail`, `renderDerivedColumnDetail`, `renderApiUniverseDetail` | Yes (slide-over inspector) |
| [src/components/KnowledgeNodeComponent.tsx](file:///d:/0000_after%20portfolio_25726/3_loc-iq/loc-iq/src/components/KnowledgeNodeComponent.tsx) | Custom ReactFlow node for Knowledge Graph | `KnowledgeNodeComponent` component; stylized node badge with icon and access mode indicator | Yes (Intelligence view) |
| [src/components/EntityNodeComponent.tsx](file:///d:/0000_after%20portfolio_25726/3_loc-iq/loc-iq/src/components/EntityNodeComponent.tsx) | Custom ReactFlow node for Entity Network | `EntityNodeComponent` component; stylized node card with category badge and icon | Yes (Network Lab view) |
| [src/components/MarkdownText.tsx](file:///d:/0000_after%20portfolio_25726/3_loc-iq/loc-iq/src/components/MarkdownText.tsx) | Lightweight markdown parser component | `MarkdownText` component; renders bold text, inline code, and bullet lists | Yes (inspections) |
| `src/components/ui/*.tsx` | Reusable Radix UI wrapper components | `badge.tsx`, `button.tsx`, `card.tsx`, `input.tsx`, `label.tsx`, `sheet.tsx`, `switch.tsx`, `table.tsx`, `tabs.tsx`, `tooltip.tsx` | Yes (UI design system) |

### 4. Logic & Context Layer (`src/lib/`, `src/context/`, `src/types/`)

| File Path | Role & Purpose | Exports / Contents | Runtime Participation |
| :--- | :--- | :--- | :--- |
| [src/context/AppContext.tsx](file:///d:/0000_after%20portfolio_25726/3_loc-iq/loc-iq/src/context/AppContext.tsx) | Global React Context provider | `AppProvider`, `useAppContext`, `demoCases`, `catalogue`, `loadDemoCase`, `runCustomTrace` | Yes (global state) |
| [src/lib/resolver.ts](file:///d:/0000_after%20portfolio_25726/3_loc-iq/loc-iq/src/lib/resolver.ts) | Core Canonical Investigation Graph Solver | `resolveCanonicalGraph`, `computeOutputFromSignals`, `resolveCustomTrace`, `djb2Hash` | Yes (core solver engine) |
| [src/lib/knowledgeGraph.ts](file:///d:/0000_after%20portfolio_25726/3_loc-iq/loc-iq/src/lib/knowledgeGraph.ts) | Knowledge Graph assembly & traversal | `buildKnowledgeGraph`, `getShortestPath`, `getConnectedComponents`, `getLineageTrace`, `getUnresolvedReport` | Yes (Knowledge Graph engine) |
| [src/lib/knowledgeGraphCurated.ts](file:///d:/0000_after%20portfolio_25726/3_loc-iq/loc-iq/src/lib/knowledgeGraphCurated.ts) | Curated edge registry for Knowledge Graph | `curatedMappingRegistry` array of explicit semantic edges connecting identifiers to APIs and fields | Yes (Knowledge Graph edges) |
| [src/lib/entityNetworkData.ts](file:///d:/0000_after%20portfolio_25726/3_loc-iq/loc-iq/src/lib/entityNetworkData.ts) | Multi-case synthetic entity dataset | `buildSyntheticEntityNetwork`, `syntheticNetworkNodes`, `syntheticNetworkEdges` | Yes (Network Lab dataset) |
| [src/lib/entityNetworkAnalytics.ts](file:///d:/0000_after%20portfolio_25726/3_loc-iq/loc-iq/src/lib/entityNetworkAnalytics.ts) | Network pattern detection algorithms | `detectNetworkPatterns`, `getShortestPath`, `getComponentDiagnostics`, `getSharedNeighbors`, `calculateEntityOverlap` | Yes (Network Lab algorithms) |
| [src/lib/activeCaseBridge.ts](file:///d:/0000_after%20portfolio_25726/3_loc-iq/loc-iq/src/lib/activeCaseBridge.ts) | Bridge linking runtime case to Knowledge Graph | `getActiveCaseBridge` function; maps active trace nodes to Knowledge Graph concept IDs | Yes (active case overlay) |
| [src/lib/utils.ts](file:///d:/0000_after%20portfolio_25726/3_loc-iq/loc-iq/src/lib/utils.ts) | Utility helper function | `cn` helper combining `clsx` and `tailwind-merge` | Yes (styling helper) |
| [src/types/index.ts](file:///d:/0000_after%20portfolio_25726/3_loc-iq/loc-iq/src/types/index.ts) | TypeScript domain interfaces & types | `PrimaryIdentifierDef`, `DataFieldDef`, `ApiUniverseDef`, `CanonicalInvestigationGraph`, `KnowledgeGraph`, `SyntheticEntityNetworkGraph`, etc. | Yes (type safety) |

### 5. Datasets & Catalogues (`src/data/`)

| File Path | Schema Summary | Row / Item Count | Usage in Application |
| :--- | :--- | :--- | :--- |
| `src/data/data_primary_identifiers.json` | Primary applicant keys definition | **6 primary keys** | Loaded in `AppContext.tsx:L9` & `knowledgeGraph.ts:L1` |
| `src/data/data_fetched_data_fields.json` | Raw data fields & derived column specs | **42 data fields** | Loaded in `AppContext.tsx:L10` & `knowledgeGraph.ts:L3` |
| `src/data/data_api_universe.json` | External API sources catalog | **46 API sources** | Loaded in `AppContext.tsx:L11` & `knowledgeGraph.ts:L2` |
| `src/data/data_demo_cases.json` | Pre-configured scenario fixtures | **3 cases** (`clean`, `fraud`, `maximum`) | Loaded in `AppContext.tsx:L12` |
| `src/data/masterclass.json` | Forensic documentation section texts | **102 parsed sections** | Loaded in `DetailPanels.tsx:L5` & `knowledgeGraph.ts:L4` |
| `src/data/primaryIdentifiers.json` | Duplicate catalogue JSON | 6 rows | Unused by runtime (generated by `parseExcel.mjs`) |
| `src/data/dataFields.json` | Duplicate catalogue JSON | 42 rows | Unused by runtime (generated by `parseExcel.mjs`) |
| `src/data/apiUniverse.json` | Duplicate catalogue JSON | 46 rows | Unused by runtime (generated by `parseExcel.mjs`) |
| `src/data/output.json` | Tentative output schema | 7 rows | Unused by runtime (generated by `parseExcel.mjs`) |

### 6. Scripts (`scripts/`)

| Script Path | Purpose & Mechanics | Execution Command | Result & Output |
| :--- | :--- | :--- | :--- |
| [scripts/test_engine.ts](file:///d:/0000_after%20portfolio_25726/3_loc-iq/loc-iq/scripts/test_engine.ts) | Automated domain & engine invariant test suite | `npm test` | Executed 131 assertions; **131/131 PASSED** |
| [scripts/parse_masterclass.js](file:///d:/0000_after%20portfolio_25726/3_loc-iq/loc-iq/scripts/parse_masterclass.js) | Parses `LOCIQ_MASTERCLASS.md` into structured JSON | `node scripts/parse_masterclass.js` | Wrote `src/data/masterclass.json` (102 items) |
| [scripts/generate_maximum.js](file:///d:/0000_after%20portfolio_25726/3_loc-iq/loc-iq/scripts/generate_maximum.js) | Generates `maximum` demo case fixture | `node scripts/generate_maximum.js` | Writes `generated_max.json` |
| [scripts/parseExcel.mjs](file:///d:/0000_after%20portfolio_25726/3_loc-iq/loc-iq/scripts/parseExcel.mjs) | Extracts JSON from Excel workbook sheets | `node scripts/parseExcel.mjs` | Legacy script targeting Excel workbook |
| `scripts/generate-ui.mjs` | Automated component generator script | `node scripts/generate-ui.mjs` | Developer helper script |

---

## PART 4 — COMPLETE VARIABLE / FIELD DICTIONARY

Below is the complete dictionary of every meaningful domain variable, identifier, field, signal, score, flag, node type, edge type, and finding metric in the Loc-IQ repository.

### 1. Applicant Input Variables & Primary Keys

#### `declared_pincode`
- **DISPLAY NAME**: Declared Pincode
- **TYPE**: `string`
- **EXAMPLE VALUE**: `"560001"` (Clean), `"110001"` (Fraud), `"400001"` (Maximum)
- **DEFINED IN**: [src/types/index.ts:L84](file:///d:/0000_after%20portfolio_25726/3_loc-iq/loc-iq/src/types/index.ts#L84), `src/data/data_demo_cases.json`
- **USED IN**: [src/lib/resolver.ts:L103](file:///d:/0000_after%20portfolio_25726/3_loc-iq/loc-iq/src/lib/resolver.ts#L103), [src/components/CaseContextRail.tsx:L62](file:///d:/0000_after%20portfolio_25726/3_loc-iq/loc-iq/src/components/CaseContextRail.tsx#L62)
- **SOURCE OF VALUE**: User form submission or synthetic demo case fixture
- **TRANSFORMATION**: Sanitized via regex `.replace(/\D/g, '')` for exact integer pin comparison ([resolver.ts:L412](file:///d:/0000_after%20portfolio_25726/3_loc-iq/loc-iq/src/lib/resolver.ts#L412))
- **OUTPUT/CONSUMER**: Evaluated against top candidate location in `resolveCanonicalGraph` to establish `addressConsistency` (`CONSISTENT`, `REVIEW`, `CONFLICT`).
- **Domain Meaning (A)**: The 6-digit postal code where the applicant claims to reside.
- **Industry Context (B)**: Declared physical mailing address submitted on a loan application.
- **Investigator Value (C)**: Provides the baseline geographic claim against which all physical evidence is evaluated.
- **Evidence Category (D)**: Declared / Customer-Provided Evidence
- **Limitations / Failure Modes (E)**: Easily fabricated by fraudsters; does not prove physical presence.
- **App Implementation (F)**: User-selected or loaded from synthetic JSON.
- **Decision Influence (G)**: **Directly influences decision**: Compared against top candidate physical location evidence share ([resolver.ts:L426-L439](file:///d:/0000_after%20portfolio_25726/3_loc-iq/loc-iq/src/lib/resolver.ts#L426-L439)).

#### `pan`
- **DISPLAY NAME**: PAN (Permanent Account Number)
- **TYPE**: `string`
- **EXAMPLE VALUE**: `"ABCDE1234F"`, `"BXXXX9999Y"`
- **DEFINED IN**: [src/types/index.ts:L79](file:///d:/0000_after%20portfolio_25726/3_loc-iq/loc-iq/src/types/index.ts#L79), `src/data/data_primary_identifiers.json`
- **USED IN**: [src/lib/resolver.ts:L114](file:///d:/0000_after%20portfolio_25726/3_loc-iq/loc-iq/src/lib/resolver.ts#L114), [src/lib/knowledgeGraph.ts:L26](file:///d:/0000_after%20portfolio_25726/3_loc-iq/loc-iq/src/lib/knowledgeGraph.ts#L26)
- **SOURCE OF VALUE**: User input or synthetic fixture
- **TRANSFORMATION**: Converted to uppercase string
- **OUTPUT/CONSUMER**: Seed identifier node `seed_pan` in graph; root node `id:pan` in Knowledge Graph.
- **Domain Meaning (A)**: 10-character alphanumeric Indian tax identity key.
- **Industry Context (B)**: Crown jewel key for pulling credit bureau reports (CIBIL, Experian, Equifax, CRIF).
- **Investigator Value (C)**: Unlocks address history, past enquiry locations, and employment records.
- **Evidence Category (D)**: Identity Evidence
- **Limitations / Failure Modes (E)**: May belong to an identity theft victim while fraudster operates from a different state.
- **App Implementation (F)**: Synthetic user-selected string.
- **Decision Influence (G)**: Serves as seed node linking to credit bureau evidence sources.

#### `mobile_number`
- **DISPLAY NAME**: Mobile Phone Number
- **TYPE**: `string`
- **EXAMPLE VALUE**: `"9876543210"`, `"9811122233"`
- **DEFINED IN**: [src/types/index.ts:L78](file:///d:/0000_after%20portfolio_25726/3_loc-iq/loc-iq/src/types/index.ts#L78), `src/data/data_primary_identifiers.json`
- **USED IN**: [src/lib/resolver.ts:L114](file:///d:/0000_after%20portfolio_25726/3_loc-iq/loc-iq/src/lib/resolver.ts#L114), [src/lib/knowledgeGraph.ts:L26](file:///d:/0000_after%20portfolio_25726/3_loc-iq/loc-iq/src/lib/knowledgeGraph.ts#L26)
- **SOURCE OF VALUE**: User input or synthetic fixture
- **TRANSFORMATION**: Sanitized 10-digit numeric string
- **OUTPUT/CONSUMER**: Seed node `seed_mobile_number`; extracts `telecom_circle` regional signal.
- **Domain Meaning (A)**: 10-digit Indian mobile contact number.
- **Industry Context (B)**: Used for OTP authentication, phone intelligence lookup, and telecom circle identification.
- **Investigator Value (C)**: Reveals original telecom licensing circle (state-level hint).
- **Evidence Category (D)**: Telecom Evidence
- **Limitations / Failure Modes (E)**: Weak geographic signal due to Mobile Number Portability (MNP).
- **App Implementation (F)**: Synthetic input.
- **Decision Influence (G)**: Generates regional signal `Telecom circle` with low base weight (0.4) and recency factor (0.7).

### 2. Evidence Signals & Scoring Parameters

#### `base_weight`
- **DISPLAY NAME**: Signal Base Reliability Weight
- **TYPE**: `number`
- **EXAMPLE VALUE**: `0.9` (Bureau Address), `0.95` (Cell Tower), `0.6` (IP Geolocation), `0.4` (Telecom Circle)
- **DEFINED IN**: [src/types/index.ts:L52](file:///d:/0000_after%20portfolio_25726/3_loc-iq/loc-iq/src/types/index.ts#L52), `src/data/data_demo_cases.json`
- **USED IN**: [src/lib/resolver.ts:L218](file:///d:/0000_after%20portfolio_25726/3_loc-iq/loc-iq/src/lib/resolver.ts#L218)
- **SOURCE OF VALUE**: Hard-coded expert weight defined per signal type
- **TRANSFORMATION**: Multiplied into `effWeight` ($\text{base} \times \text{recency} \times \text{ip\_trust}$)
- **OUTPUT/CONSUMER**: Inputs to candidate location weight accumulator.
- **Domain Meaning (A)**: Intrinsic reliability of an evidence provider type.
- **Industry Context (B)**: Relative trust ranking of evidence sources (e.g. physical cell towers > IP geolocation).
- **Investigator Value (C)**: Prevents weak digital signals from overriding strong physical observations.
- **Evidence Category (D)**: Scoring Metadata
- **Limitations / Failure Modes (E)**: Static expert weights rather than statistically calibrated parameters.
- **App Implementation (F)**: Hard-coded in signal JSON / solver code.
- **Decision Influence (G)**: **Direct**: Multiplies candidate location score.

#### `ip_trust_factor`
- **DISPLAY NAME**: IP Trust Discount Factor
- **TYPE**: `number`
- **EXAMPLE VALUE**: `1.0` (Residential ISP), `0.1` (Hosting / VPN Proxy)
- **DEFINED IN**: [src/types/index.ts:L54](file:///d:/0000_after%20portfolio_25726/3_loc-iq/loc-iq/src/types/index.ts#L54), `src/data/data_demo_cases.json`
- **USED IN**: [src/lib/resolver.ts:L218,L222](file:///d:/0000_after%20portfolio_25726/3_loc-iq/loc-iq/src/lib/resolver.ts#L218,L222)
- **SOURCE OF VALUE**: Evaluated based on proxy detection metadata (`proxy: true` in field trace)
- **TRANSFORMATION**: Severe penalty multiplier ($0.1$) applied to IP geolocation signals
- **OUTPUT/CONSUMER**: Reduces effective signal weight from $0.6 \rightarrow 0.06$; triggers `VPN/Hosting Proxy Connection Detected` risk indicator.
- **Domain Meaning (A)**: Penalty factor applied to network observations originating from anonymizing proxies or datacenters.
- **Industry Context (B)**: Essential fraud filter; neutralizes fake IP locations originating from VPN endpoints (e.g., Frankfurt or Singapore).
- **Investigator Value (C)**: Instantly flags masked connections while isolating fake physical locations from candidate ranking.
- **Evidence Category (D)**: Device/IP Evidence & Risk Indicator
- **Limitations / Failure Modes (E)**: Privacy-conscious legitimate users using Apple Private Relay or corporate VPNs receive the same penalty.
- **App Implementation (F)**: Deterministically set to `0.1` when proxy flag is present.
- **Decision Influence (G)**: **Direct**: Prevents proxy locations from achieving top physical candidate ranking.

#### `evidenceShare`
- **DISPLAY NAME**: Evidence Share Percentage
- **TYPE**: `number` (Integer 0 to 100)
- **EXAMPLE VALUE**: `95` (Clean Bengaluru), `70` (Fraud Anantapur), `72` (Maximum Pune)
- **DEFINED IN**: [src/types/index.ts:L150](file:///d:/0000_after%20portfolio_25726/3_loc-iq/loc-iq/src/types/index.ts#L150)
- **USED IN**: [src/lib/resolver.ts:L340](file:///d:/0000_after%20portfolio_25726/3_loc-iq/loc-iq/src/lib/resolver.ts#L340), [src/components/DecisionPanel.tsx:L70](file:///d:/0000_after%20portfolio_25726/3_loc-iq/loc-iq/src/components/DecisionPanel.tsx#L70)
- **SOURCE OF VALUE**: Calculated at runtime via Hamilton / Largest Remainder Method ([resolver.ts:L72-L92](file:///d:/0000_after%20portfolio_25726/3_loc-iq/loc-iq/src/lib/resolver.ts#L72-L92))
- **TRANSFORMATION**: $\text{Quota}_i = \frac{w_i}{\sum w} \times 100$; floored and remainder distributed so $\sum \text{evidenceShare} \equiv 100\%$.
- **OUTPUT/CONSUMER**: Rendered on Candidate Location cards in Decision Panel and graph nodes.
- **Domain Meaning (A)**: Relative proportion of total physical evidence supporting a candidate location hypothesis.
- **Industry Context (B)**: Normalized evidence weight distribution across competing geographic hypotheses.
- **Investigator Value (C)**: Gives an intuitive integer percentage breakdown without claiming to be a statistical default probability.
- **Evidence Category (D)**: Derived Scoring Metric
- **Limitations / Failure Modes (E)**: Is a deterministic evidence share, NOT a statistical probability of fraud.
- **App Implementation (F)**: Computed dynamically at runtime.
- **Decision Influence (G)**: **Direct**: If top candidate evidence share $\ge 50\%$ matching declared pincode $\rightarrow$ `CONSISTENT`; if top candidate evidence share $\ge 40\%$ conflicting with declared pincode $\rightarrow$ `CONFLICT`.

#### `addressConsistency`
- **DISPLAY NAME**: Address Consistency Status
- **TYPE**: `'CONSISTENT' | 'REVIEW' | 'CONFLICT'`
- **EXAMPLE VALUE**: `'CONSISTENT'` (Clean), `'CONFLICT'` (Fraud & Maximum)
- **DEFINED IN**: [src/types/index.ts:L170](file:///d:/0000_after%20portfolio_25726/3_loc-iq/loc-iq/src/types/index.ts#L170)
- **USED IN**: [src/lib/resolver.ts:L408](file:///d:/0000_after%20portfolio_25726/3_loc-iq/loc-iq/src/lib/resolver.ts#L408), [src/components/Header.tsx:L54](file:///d:/0000_after%20portfolio_25726/3_loc-iq/loc-iq/src/components/Header.tsx#L54), [src/components/DecisionPanel.tsx:L65](file:///d:/0000_after%20portfolio_25726/3_loc-iq/loc-iq/src/components/DecisionPanel.tsx#L65)
- **SOURCE OF VALUE**: Evaluated by decision tree in `resolveCanonicalGraph` ([resolver.ts:L408-L440](file:///d:/0000_after%20portfolio_25726/3_loc-iq/loc-iq/src/lib/resolver.ts#L408-L440))
- **TRANSFORMATION**: Categorical classification based on declared pincode vs physical candidate evidence shares
- **OUTPUT/CONSUMER**: Main header badge, left rail status, decision panel header badge, decision node label in graph.
- **Domain Meaning (A)**: Top-level verification outcome comparing declared location to physical evidence clusters.
- **Industry Context (B)**: Automated underwriting decision flag determining whether an application passes address verification or requires manual investigation.
- **Investigator Value (C)**: Instantly guides risk analysts to auto-approve (`CONSISTENT`), manually inspect (`REVIEW`), or decline/investigate (`CONFLICT`).
- **Evidence Category (D)**: Decision Output
- **Limitations / Failure Modes (E)**: Rule-based heuristics; may flag legitimate movers as `CONFLICT` if bureau data is outdated.
- **App Implementation (F)**: Evaluated at runtime.
- **Decision Influence (G)**: Final primary output of the Loc-IQ workstation.

---

## PART 5 — DOMAIN / SME EXPLANATION

### 1. Core Domain Concepts
- **Address Consistency**: Evaluating whether an applicant's declared home/office address is materially corroborated by their physical and digital footprints across multiple independent evidence sources.
- **Identity Evidence vs Location Evidence**:
  - *Identity Evidence*: Attributes proving who a person claims to be (PAN, Aadhaar, Name, Date of Birth).
  - *Location Evidence*: Observations establishing where physical or digital events actually occurred (Bureau address history, bank branch transactions, cell tower connections, Wi-Fi BSSID scans, IP addresses).
- **Declared Address vs Observed Physical Evidence**:
  - *Declared Address*: What the customer writes on an application form (e.g. `110001` New Delhi). Easily copied or forged.
  - *Observed Physical Evidence*: Records created by external financial/telecom networks during real-world interactions (e.g. cash deposited at a branch in Pune, cell tower LAC/CellID in Anantapur).
- **Why Address Mismatch Does NOT Automatically Mean Fraud**:
  - Legitimate reasons for geographic mismatch include: recent relocation before updating bureau records, working remotely from a secondary residence, commuting across city borders, or traveling.
  - Therefore, Loc-IQ classifies split or regional matches as `REVIEW` rather than immediately issuing a `CONFLICT` verdict.
- **Credit Bureau Address History**: Credit bureaus (CIBIL, Experian, Equifax, CRIF High Mark) archive historical addresses reported by previous lenders. When a borrower defaults and absconds, they frequently return to long-held historical addresses.
- **IP Geolocation & Proxy/VPN Penalties**: IP addresses map to internet service provider cities. However, fraudsters frequently route traffic through commercial VPN exit nodes or datacenter hosting servers (e.g., Frankfurt or Singapore). In Loc-IQ, proxy connection fields receive an explicit $0.1$ trust penalty factor ($90\%$ discount) so datacenter IPs never leak into physical candidate location rankings.
- **Direct vs Indirect Evidence & Provenance**: Direct physical observations (cell towers, cash deposit branches, Wi-Fi BSSIDs) carry high base weights ($0.85 - 0.95$), whereas broad regional hints (telecom circle series) carry lower base weights ($0.4$).

### 2. Industry Ground Truth vs. Loc-IQ Implementation

| Domain Concept | Real-World Industry Standard | What Loc-IQ Actually Implements |
| :--- | :--- | :--- |
| **Data Ingestion** | Authenticated REST/gRPC API calls to bureaus, telcos, and IP vendors over HTTPS with OAuth2 tokens | Local static JSON datasets (`data_demo_cases.json`, `data_api_universe.json`) loaded in client memory |
| **Location Scoring** | Machine learning models (Gradient Boosted Trees / Logistic Regression) trained on historical default data | Deterministic rule-based signal weighting ($\text{base} \times \text{recency} \times \text{ip\_trust}$) |
| **Percentage Metrics** | Calibrated Probability of Default (PD) or Empirical Fraud Risk Probability ($0\% - 100\%$) | Normalized Evidence Share allocated via Hamilton / Largest Remainder Method ($\sum \text{share} = 100\%$) |
| **Graph Network** | Distributed Graph Databases (Neo4j, Amazon Neptune) indexing millions of entities | Client-side ReactFlow visualization and in-memory JS array traversal |
| **Consent Management** | Dynamic RBI Account Aggregator & OTP digital consent framework with cryptographic audit logs | Static metadata badges (`sits_in`) rendered on UI cards |

---

## PART 6 — DATA LINEAGE

### 1. Active Scenario Execution Lineage

```
[src/data/data_demo_cases.json]
      ↓ (Loaded into AppContext state via demoCasesRaw)
[src/context/AppContext.tsx:L66-L87] (loadDemoCase('clean' | 'fraud' | 'maximum'))
      ↓ (Passes seedInputs, fetchedFields, signals to resolver)
[src/lib/resolver.ts:L97] (resolveCanonicalGraph)
      ↓
  1. Construct Seed Identifier Nodes (`seed_pan`, `seed_mobile_number`, etc.)
  2. Map Source API Nodes (`src_credit_bureau_service`, etc.)
  3. Map Evidence Field Nodes (`ev_bureau_address_history`, etc.)
  4. Classify Signals by Category (`PHYSICAL_LOCALITY`, `REGIONAL_SCOPE`, `NETWORK_LOCATION`)
  5. Apply IP Trust Penalties (`ip_trust_factor < 1.0` -> `0.1` multiplier)
  6. Apply Regional Corroboration to Physical Candidates
  7. Compute Integer Evidence Shares via Largest Remainder Method
  8. Evaluate Address Consistency Tree (`CONSISTENT`, `REVIEW`, `CONFLICT`)
  9. Construct Decision Node (`node_decision`)
      ↓ (Returns CurrentTrace object)
[src/context/AppContext.tsx:L84] (setCurrentTrace)
      ↓ (Triggers React re-render across UI workstation)
├── [src/components/CaseContextRail.tsx] (Renders seed keys & evidence pipeline stats)
├── [src/components/GraphVisualizer.tsx] (Renders 6-layer ReactFlow canvas)
└── [src/components/DecisionPanel.tsx] (Renders decision card & ranked physical candidates)
```

### 2. Knowledge Graph Lineage

```
[LOCIQ_MASTERCLASS.md] (57KB Markdown File)
      ↓ (Parsed by scripts/parse_masterclass.js)
[src/data/masterclass.json] (102 JSON Section Entries)
      ↓
+ [src/data/data_primary_identifiers.json] (6 Keys)
+ [src/data/data_fetched_data_fields.json] (42 Fields)
+ [src/data/data_api_universe.json] (46 APIs)
      ↓ (Built by src/lib/knowledgeGraph.ts:L21)
[buildKnowledgeGraph()]
      ↓
  1. Instantiate 6 IDENTIFIER Nodes (`id:pan`, etc.)
  2. Instantiate 46 DATA_SOURCE Nodes (`api:cibil`, etc.)
  3. Instantiate 42 FETCHED_FIELD Nodes (`field:bureau_address_history`, etc.)
  4. Parse 77 DERIVED_SIGNAL Nodes (`sig:address_stability_score`, etc.)
  5. Instantiate 102 KNOWLEDGE_TOPIC Nodes (`doc:0.1 What this document is`, etc.)
  6. Generate 77 DIRECT DERIVES_SIGNAL Edges
  7. Generate 29 NORMALIZED RETURNS_FIELD Edges
  8. Inject CURATED Edges from knowledgeGraphCurated.ts
      ↓ (Returns KnowledgeGraph object: 273 Nodes)
[src/components/IntelligenceGraphWorkspace.tsx] (Renders interactive graph & BFS shortest path)
```

### 3. Synthetic Entity Network Lineage

```
[src/lib/entityNetworkData.ts:L15-L250] (syntheticNetworkNodes: 79, syntheticNetworkEdges: 61)
      ↓ (Loaded by buildSyntheticEntityNetwork())
[src/lib/entityNetworkAnalytics.ts:L15-L350] (detectNetworkPatterns())
      ↓
  1. Pattern A: Connected Components Partitioning (Identifies 21 components, 5 standalone cases)
  2. Pattern B: Shared Device Rule (Detects 4 distinct customer identities on device DEV_SYN_04)
  3. Pattern C: Reused Contact Attribute Rule (Detects mobile/email sharing across applications)
  4. Pattern D: Shared Proxy Rule (Detects 4 applications via Frankfurt proxy 185.220.101.5)
  5. Pattern E: Address Concentration Rule (Detects 5 applications at Fort Mumbai 400001)
  6. Pattern F: Geographic Convergence Rule (Detects operational convergence at Anantapur 515001)
  7. Pattern G: Benign Household Counterexample (Evaluates household cases as CONTEXTUAL_LINK)
      ↓ (Returns StructuralRuleFinding[] array)
[src/components/NetworkLabWorkspace.tsx] (Renders interactive multi-case network lab & findings inspector)
```

---

## PART 7 — SCENARIOS

### 1. Scenario 1 — Clean Scenario (`clean`)
- **Seed Identifiers**: Mobile `9876543210`, PAN `ABCDE1234F`, Declared Pincode `560001` (Bengaluru).
- **Evidence Sources**: Credit Bureau Service, Bank Branch IFSC Lookup, IP Geolocation Service, Telecom Series DB.
- **Observations & Signals**:
  - Bureau current address: `Bengaluru 560001` (Weight: $0.9 \times 1.0 \times 1.0 = 0.9$)
  - Branch IFSC location: `Bengaluru 560001` (Weight: $0.8 \times 0.85 \times 1.0 = 0.68$)
  - IP geolocation: `Bengaluru 560001` (Weight: $0.6 \times 1.0 \times 1.0 = 0.6$)
  - Telecom circle: `Karnataka (region)` (Corroborates Bengaluru; Weight: $0.4 \times 0.7 \times 1.0 = 0.28$)
- **Scoring & Ranking**: Single physical candidate `Bengaluru 560001` receives $100\%$ of evidence share ($0.9 + 0.68 + 0.6 + 0.28 = 2.46$ total weight).
- **Final Decision**: `CONSISTENT` (Green flag).
- **Narrative Story**: Aarav Sharma applies for a credit card declaring his residential pincode as Bengaluru 560001. All digital and financial observations (bureau history, primary bank branch, session IP address, and telecom circle) coherently align on Bengaluru. The system issues an automated GREEN verification flag with 95%+ confidence.

### 2. Scenario 2 — Physical Conflict / Fraud Scenario (`fraud`)
- **Seed Identifiers**: Mobile `9876543210`, PAN `XYZPD5678K`, Declared Pincode `110001` (New Delhi).
- **Evidence Sources**: Credit Bureau Service, Bank Branch IFSC Lookup, IP Geolocation Service (Proxy), Telecom Series DB.
- **Observations & Signals**:
  - Bureau current address: `Anantapur 515001 (AP)` (Weight: $0.9 \times 1.0 \times 1.0 = 0.9$)
  - Branch IFSC location: `Anantapur 515001 (AP)` (Weight: $0.8 \times 0.85 \times 1.0 = 0.68$)
  - IP geolocation: `Frankfurt, Germany (Proxy)` (Weight: $0.6 \times 1.0 \times \mathbf{0.1} = \mathbf{0.06}$; IP Trust Discount applied!)
  - Telecom circle: `Andhra Pradesh (region)` (Corroborates Anantapur; Weight: $0.4 \times 0.7 \times 1.0 = 0.28$)
- **Scoring & Ranking**:
  - Rank 1: `Anantapur 515001` $\rightarrow$ **70% Evidence Share** (Physical candidate)
  - Network Observation: `Frankfurt Proxy` $\rightarrow$ **20% Evidence Share** (Isolated proxy node)
  - Rank 2: `New Delhi 110001` $\rightarrow$ **10% Evidence Share** (Declared candidate with zero physical support)
- **Final Decision**: `CONFLICT` (Red flag).
- **Narrative Story**: An applicant submits a loan application declaring a prestigious residential address in Connaught Place, New Delhi (`110001`). However, live digital footprints reveal the web session originated from a commercial VPN proxy server in Frankfurt, Germany. Crucially, credit bureau records and bank branch IFSC lookups place active accounts in Anantapur, Andhra Pradesh (`515001`). The solver heavily discounts the German IP, pinpoints Anantapur as the true physical operational cluster (70% evidence share), and flags a severe address `CONFLICT`.

### 3. Scenario 3 — Multi-Source / Maximum Scenario (`maximum`)
- **Seed Identifiers**: Mobile `9811122233`, PAN `BXXXX9999Y`, Declared Pincode `400001` (Fort, Mumbai).
- **Evidence Sources**: 14 fetched fields & 9 signals across credit bureaus, NPCI UPI switch, core banking CBS, cell towers, Wi-Fi BSSID scans, and IP geolocation.
- **Observations & Signals**:
  - Declared Pincode: `Mumbai 400001`
  - Bureau History: `Kolkata 700001`
  - Active Behavior (UPI Merchant VPA, Cash Deposits, Cell Tower MCC/MNC/LAC/CellID, Wi-Fi BSSID): All match `Pune 411001`
  - Public IP: `Singapore (VPN Exit)` (Discounted via $0.1$ trust factor)
- **Scoring & Ranking**:
  - Rank 1: `Pune 411001` $\rightarrow$ **72% Evidence Share** (Actual physical operation)
  - Rank 2: `Kolkata 700001` $\rightarrow$ **15% Evidence Share** (Bureau history)
  - Rank 3: `Mumbai 400001` $\rightarrow$ **8% Evidence Share** (Declared)
  - Rank 4: `Delhi` $\rightarrow$ **4% Evidence Share** (Mobile origin)
  - Rank 5: `Singapore` $\rightarrow$ **1% Evidence Share** (Proxy - discarded)
- **Final Decision**: `CONFLICT` (Red flag).
- **Narrative Story**: A high-value loan application claims a residential address in Fort, Mumbai (`400001`). Forensic analysis reveals a complex multi-state footprint: the PAN was registered in Kolkata, the mobile series originated in Delhi, and the web session was routed through a Singapore datacenter. However, high-frequency physical footprints—cash deposits at an HDFC branch in Pune, UPI merchant transactions in Pune Camp, cell tower triangulation in Pune, and Wi-Fi router BSSIDs—unanimously converge on Pune (`411001`). The engine issues an automated RED flag for a multi-source fraud ring operating out of Pune.

---

## PART 8 — ALL CALCULATIONS AND DECISION LOGIC

### 1. Formula Dictionary

#### Calculation 1: Signal Effective Weight
- **Source File**: [src/lib/resolver.ts:L218](file:///d:/0000_after%20portfolio_25726/3_loc-iq/loc-iq/src/lib/resolver.ts#L218)
- **Function**: `resolveCanonicalGraph`
- **Inputs**: `base_weight` ($w_b$), `recency_factor` ($f_r$), `ip_trust_factor` ($f_{ip}$)
- **Formula**:
  $$\text{effWeight} = w_b \times f_r \times f_{ip}$$
- **Output**: Numeric effective weight value (e.g. $0.9 \times 1.0 \times 1.0 = 0.9$; or $0.6 \times 1.0 \times 0.1 = 0.06$).
- **Worked Example (Clean Scenario Bureau Address Signal)**:
  - $w_b = 0.9$, $f_r = 1.0$, $f_{ip} = 1.0 \Rightarrow \text{effWeight} = 0.9 \times 1.0 \times 1.0 = 0.90$.
- **Interpretation**: Normalized signal reliability weight.

#### Calculation 2: Hamilton Largest Remainder Method for Exact 100% Integer Shares
- **Source File**: [src/lib/resolver.ts:L72-L92](file:///d:/0000_after%20portfolio_25726/3_loc-iq/loc-iq/src/lib/resolver.ts#L72-L92)
- **Function**: `allocateExactPercentages`
- **Inputs**: Array of candidate physical weights $[w_1, w_2, \dots, w_k]$
- **Algorithm**:
  1. $W_{\text{total}} = \sum_{i=1}^k w_i$
  2. Exact Quotas: $q_i = \left(\frac{w_i}{W_{\text{total}}}\right) \times 100$
  3. Floor Shares: $s_i = \lfloor q_i \rfloor$
  4. Remainders: $r_i = q_i - s_i$
  5. Unallocated: $U = 100 - \sum_{i=1}^k s_i$
  6. Sort candidates by remainder $r_i$ descending; add $+1\%$ to the top $U$ candidates.
- **Output**: Array of whole integers summing to **EXACTLY 100%**.
- **Worked Example (Fraud Scenario)**:
  - Physical Candidate 1 (Anantapur): $w_1 = 1.86 \Rightarrow q_1 = 70.45\% \Rightarrow \text{floor} = 70$, remainder $= 0.45$.
  - Physical Candidate 2 (Frankfurt Proxy): $w_2 = 0.53 \Rightarrow q_2 = 20.07\% \Rightarrow \text{floor} = 20$, remainder $= 0.07$.
  - Physical Candidate 3 (Delhi Declared): $w_3 = 0.25 \Rightarrow q_3 = 9.48\% \Rightarrow \text{floor} = 9$, remainder $= 0.48$.
  - Floor sum $= 70 + 20 + 9 = 99$. Unallocated $= 1$.
  - Largest remainder is Candidate 3 ($0.48$), which gets $+1 \Rightarrow 10\%$.
  - Final Shares: $[70\%, 20\%, 10\%]$. Sum $= 100\%$.
- **Interpretation**: Integer percentage allocation of evidence share.

#### Calculation 3: Address Consistency Decision Logic
- **Source File**: [src/lib/resolver.ts:L408-L440](file:///d:/0000_after%20portfolio_25726/3_loc-iq/loc-iq/src/lib/resolver.ts#L408-L440)
- **Function**: `resolveCanonicalGraph`
- **Inputs**: `declaredPincode`, `rankedCandidates[]`, `topCandidateObj`, `topEvidenceShare`
- **Decision Rules**:
  1. `if (!declaredPincode) return 'REVIEW'` (Missing declared address cannot be fully evaluated).
  2. `if (rankedCandidates.length === 0) return 'REVIEW'` (Insufficient evidence).
  3. `if (isExactPinMatch || isLabelPinMatch || (declaredRank === 1 && topEvidenceShare >= 50))` $\rightarrow$ **`'CONSISTENT'`**
  4. `else if (!isDistrictMatch && topEvidenceShare >= 40)` $\rightarrow$ **`'CONFLICT'`**
  5. `else` $\rightarrow$ **`'REVIEW'`**
- **Output**: Categorical verdict string (`CONSISTENT`, `REVIEW`, or `CONFLICT`).
- **Worked Example (Fraud Scenario)**:
  - Declared Pincode: `110001` (Delhi)
  - Top Physical Candidate: `Anantapur 515001` (Evidence Share: $70\%$)
  - `isExactPinMatch` = `false` (`110001` $\neq$ `515001`)
  - `isDistrictMatch` = `false` (`110` $\neq$ `515`)
  - `topEvidenceShare` ($70\%$) $\ge 40\%$ $\Rightarrow$ **`CONFLICT`**.

---

## PART 9 — GRAPH MODEL

### 1. Investigation Graph Domain Model
- **Implementation**: [src/types/index.ts:L88-L176](file:///d:/0000_after%20portfolio_25726/3_loc-iq/loc-iq/src/types/index.ts#L88-L176), rendered in [src/components/GraphVisualizer.tsx](file:///d:/0000_after%20portfolio_25726/3_loc-iq/loc-iq/src/components/GraphVisualizer.tsx).
- **Node Classes (6)**:
  1. `IDENTIFIER` (Purple, $x=50$): Applicant input keys (`pan`, `mobile_number`, `declared_pincode`).
  2. `SOURCE` (Blue, $x=300$): External evidence providers (`Credit Bureau Service`, `IP Geolocation Service`).
  3. `EVIDENCE` (Sky Blue / Red for Proxy, $x=550$): Raw fetched data observations (`bureau_address_history`, `public_ip`).
  4. `SIGNAL` (Emerald / Red for Discounted, $x=800$): Derived signal metrics with weights (`Bureau current address`, `IP geolocation`).
  5. `CANDIDATE_LOCATION` (Amber, $x=1100$): Physical location hypotheses (`Bengaluru 560001`, `Anantapur 515001`).
  6. `DECISION` (Emerald / Red / Amber, $x=1400$): Address consistency decision output (`CONSISTENT`, `CONFLICT`, `REVIEW`).
- **Edge Classes (4)**:
  1. `ENRICHS`: Connects Identifiers to Sources, and Evidence to Signals.
  2. `EXTRACTS`: Connects Sources to Evidence Fields.
  3. `SUPPORTS`: Connects Signals to Candidate Locations, and Top Candidate to Decision.
  4. `CONTRADICTS`: Connects Non-Top Candidates to Decision.

### 2. Knowledge Graph Domain Model
- **Implementation**: [src/lib/knowledgeGraph.ts:L21-L205](file:///d:/0000_after%20portfolio_25726/3_loc-iq/loc-iq/src/lib/knowledgeGraph.ts#L21-L205), rendered in [src/components/IntelligenceGraphWorkspace.tsx](file:///d:/0000_after%20portfolio_25726/3_loc-iq/loc-iq/src/components/IntelligenceGraphWorkspace.tsx).
- **Node Count**: **273 Nodes**
  - 6 `IDENTIFIER` nodes
  - 46 `DATA_SOURCE` nodes
  - 42 `FETCHED_FIELD` nodes
  - 77 `DERIVED_SIGNAL` nodes
  - 102 `KNOWLEDGE_TOPIC` nodes
- **Edge Certainty Classifications (3)**:
  - `DIRECT`: Explicit parent-child relationship (e.g. `field:bureau_address_history` $\rightarrow$ `sig:address_stability_score`).
  - `NORMALIZED`: Unambiguous code mapping via `lookup_api` key.
  - `CURATED`: High-confidence domain relationship defined in `knowledgeGraphCurated.ts`.

### 3. Synthetic Entity Network Domain Model
- **Implementation**: [src/lib/entityNetworkData.ts](file:///d:/0000_after%20portfolio_25726/3_loc-iq/loc-iq/src/lib/entityNetworkData.ts) & [src/lib/entityNetworkAnalytics.ts](file:///d:/0000_after%20portfolio_25726/3_loc-iq/loc-iq/src/lib/entityNetworkAnalytics.ts), rendered in [src/components/NetworkLabWorkspace.tsx](file:///d:/0000_after%20portfolio_25726/3_loc-iq/loc-iq/src/components/NetworkLabWorkspace.tsx).
- **Graph Topology**: **79 Nodes**, **61 Edges**
- **Node Types (12)**: `PERSON`, `APPLICATION`, `IDENTIFIER_VAL`, `DEVICE`, `APP_INSTANCE`, `SESSION`, `NETWORK_ENDPOINT`, `ADDRESS`, `LOCATION`, `BRANCH`, `MERCHANT`, `BEHAVIOURAL_EVENT`.
- **Link Semantic Classifications (3)**:
  - `DETERMINISTIC_IDENTITY_LINK`: Hard identity match (e.g. Person to Application).
  - `STRONG_ENTITY_LINK`: Shared device or shared proxy infrastructure.
  - `CONTEXTUAL_LINK`: Benign household connection (e.g. two family members sharing a residential address or Wi-Fi).

---

## PART 10 — UI WALKTHROUGH

### 1. Main Investigation Workstation (`app/page.tsx:L93-L145`)
- **Header ([src/components/Header.tsx](file:///d:/0000_after%20portfolio_25726/3_loc-iq/loc-iq/src/components/Header.tsx))**:
  - *Logo & Title*: `LOC-IQ` with `Deterministic Simulation Engine` badge.
  - *Active Case Status*: Center pill displaying active scenario (`FRAUD`, `CLEAN`, `MAXIMUM`) and consistency badge.
  - *Quick Scenario Selector*: Buttons to trigger `Clean Scenario`, `Physical Conflict`, and `Multi-Source`.
  - *Workspace Switchers*: Triggers for `Network Lab`, `Intelligence Graph`, `Run Synthetic Case`, and `Reference Library`.
- **Zone 1: Left Context Rail ([src/components/CaseContextRail.tsx](file:///d:/0000_after%20portfolio_25726/3_loc-iq/loc-iq/src/components/CaseContextRail.tsx))**:
  - *Seed Identifiers Card*: Shows declared PIN, PAN, Mobile, Email, and Customer Key.
  - *Evidence Pipeline Card*: Displays total runtime nodes, provenance edges, physical hypotheses count, and risk indicator count.
  - *Predefined Scenario Buttons*: Vertical list of scenario triggers.
- **Zone 2: Center Graph Workspace ([src/components/GraphVisualizer.tsx](file:///d:/0000_after%20portfolio_25726/3_loc-iq/loc-iq/src/components/GraphVisualizer.tsx))**:
  - Interactive 6-layer ReactFlow canvas with animated edge connections.
  - Clicking any node opens a slide-over inspection drawer with deep-dive forensic documentation parsed from `masterclass.json`.
- **Zone 3: Right Decision & Evidence Panel ([src/components/DecisionPanel.tsx](file:///d:/0000_after%20portfolio_25726/3_loc-iq/loc-iq/src/components/DecisionPanel.tsx))**:
  - *Address Consistency Card*: Displays top verdict (`CONSISTENT`, `CONFLICT`, `REVIEW`) with `decisionReason`.
  - *Ranked Physical Candidates*: Interactive tabbed cards for top candidate locations showing evidence share percentages ($70\%$, $20\%$, $10\%$), supporting signals, corroborating regions, and contradictions.

---

## PART 11 — NETWORK LAB / INTELLIGENCE GRAPH / REFERENCE LIBRARY

### 1. Reference Library Modal ([src/components/ReferenceLibraryModal.tsx](file:///d:/0000_after%20portfolio_25726/3_loc-iq/loc-iq/src/components/ReferenceLibraryModal.tsx))
- Searchable modal overlay providing full master data documentation across 3 main tabs:
  1. `Primary Keys (6)`
  2. `Fetched Data Fields (42)`
  3. `API Source Universe (46)`
- Displays access types (`Publicly available`, `Consent-based`, `Regulated access`), return schemas, and deep-dive forensic explanations.

### 2. Intelligence Graph Workspace ([src/components/IntelligenceGraphWorkspace.tsx](file:///d:/0000_after%20portfolio_25726/3_loc-iq/loc-iq/src/components/IntelligenceGraphWorkspace.tsx))
- Full-screen interactive graph view rendering all 273 Knowledge Graph nodes.
- **Lens Modes**:
  - `LINEAGE`: Traces data lineage from primary keys down to derived signals.
  - `ACCESS`: Filters nodes by access mode (`Public`, `Paid`, `Consent`, `Regulated`).
  - `ACTIVE_CASE`: Overlays active runtime investigation nodes onto the master schema.
- **BFS Shortest Path Finder**: Calculates the shortest path between any two concept nodes (e.g. `id:pan` $\rightarrow$ `sig:address_stability_score` in 3 hops).

### 3. Network Lab Workspace ([src/components/NetworkLabWorkspace.tsx](file:///d:/0000_after%20portfolio_25726/3_loc-iq/loc-iq/src/components/NetworkLabWorkspace.tsx))
- Multi-case synthetic entity network visualizer.
- Runs automated pattern detection rules across 16 synthetic customers and 22 loan cases.
- **Interactive Structural Rule Findings**:
  1. `Pattern B`: Shared Device Rule (4 customer identities on phone `DEV_SYN_04`).
  2. `Pattern C`: Reused Contact Attribute Rule (Mobile/Email sharing across applications).
  3. `Pattern D`: Shared Proxy Rule (4 applications via Frankfurt proxy `185.220.101.5`).
  4. `Pattern E`: Address Concentration Rule (5 applications at Fort, Mumbai `400001`).
  5. `Pattern F`: Geographic Convergence Rule (Operational convergence at Anantapur `515001`).
  6. `Pattern G`: Benign Household Counterexample (Evaluates family members sharing an address as `CONTEXTUAL_LINK` rather than fraud).

---

## PART 12 — SYNTHETIC CASE GENERATION

### 1. "Run Synthetic Case" Modal & Custom Solver
- Triggered by clicking `Run Synthetic Case` in the application header ([src/components/Header.tsx:L122](file:///d:/0000_after%20portfolio_25726/3_loc-iq/loc-iq/src/components/Header.tsx#L122)).
- Renders `NewInvestigationModal` ([src/components/NewInvestigationModal.tsx](file:///d:/0000_after%20portfolio_25726/3_loc-iq/loc-iq/src/components/NewInvestigationModal.tsx)).
- User enters custom inputs (`declared_pincode`, `pan`, `mobile_number`, `email_id`) and selects a simulation profile:
  - `baseline`: Coherent clean trace matching inputs.
  - `proxy_risk`: Synthesizes a proxy IP observation (`185.220.101.5`, Frankfurt).
  - `physical_conflict`: Synthesizes an active conflicting bureau address (`Anantapur 515001`).
- Calls `resolveCustomTrace` in `src/lib/resolver.ts:L548-L677`, which deterministically generates fetched field traces, signal traces, candidate location rankings, evidence shares, and consistency verdicts without any external HTTP call.

---

## PART 13 — STATE AND PERSISTENCE

### 1. State Scope & Lifetime

| State Level | Implementation | Lifetime | Survives Refresh? |
| :--- | :--- | :--- | :--- |
| **Global App State** | React Context (`AppContext.tsx`) | Session memory | `NO` (Resets to default on browser refresh) |
| **Active Workspace View** | Local state (`app/page.tsx`) | Session memory | `NO` |
| **Selected Node / Inspector** | Local component state | Component lifecycle | `NO` |
| **Browser Storage** | LocalStorage / SessionStorage | `NOT USED` | `N/A` |
| **Server / Database** | REST / Database Client | `NOT USED` | `N/A` |

---

## PART 14 — EXTERNAL APIs / INTEGRATIONS

### 1. Network Integration Audit
A search across the entire codebase for `fetch`, `axios`, `XMLHttpRequest`, `WebSocket`, `Supabase`, `Firebase`, `GraphQL`, `prisma`, and `http` returns **ZERO live HTTP API client calls**.

- All 46 items in `data_api_universe.json` are **architectural catalogue items** describing external sources (such as CIBIL, Razorpay IFSC, Unwired Labs, IP-API).
- `DetailPanels.tsx:L238` explicitly annotates API responses as `MOCK — illustrative`.
- Latency simulation in `AppContext.tsx` uses client-side JavaScript `setTimeout` timers to log progress messages.

---

## PART 15 — SECURITY / SECRETS / CONFIGURATION

### 1. Environment & Security Audit
- **Environment Variables**: No `.env`, `.env.local`, or `.env.production` files exist or are required.
- **API Keys / Secrets**: **Zero API keys, tokens, or passwords** are present or needed anywhere in the repository.
- **Public Configuration**: Client-side Next.js configuration ([next.config.ts](file:///d:/0000_after%20portfolio_25726/3_loc-iq/loc-iq/next.config.ts)).
- **Deployment Safety**: 100% safe to deploy publicly on Vercel, Netlify, or GitHub Pages.

---

## PART 16 — BUILD / TEST / DEPLOYMENT

### 1. Empirical Verification Execution Log

#### Command 1: `npm test`
- **Execution File**: [scripts/test_engine.ts](file:///d:/0000_after%20portfolio_25726/3_loc-iq/loc-iq/scripts/test_engine.ts)
- **Result**: **PASS**
- **Log Summary**: `RESULTS: 131 / 131 assertions passed.`
- **Coverage Verified**:
  - Custom trace solvers (`baseline`, `proxy_risk`, `physical_conflict`)
  - Missing declared location invariants (`REVIEW` fallback)
  - Evidence share sums (exactly 100%, non-NaN, non-Infinity)
  - Knowledge Graph node counts (273 total: 6 keys, 46 sources, 42 fields, 77 signals, 102 masterclass topics)
  - Synthetic Entity Network invariants (79 nodes, 61 edges, 21 components, 5 standalone cases)
  - Structural pattern rules (Shared Device, Shared Proxy, Address Concentration, Geographic Convergence, Benign Household Counterexample)

#### Command 2: `npx tsc --noEmit`
- **Execution Result**: **PASS** (0 errors)
- **Proves**: 100% TypeScript type safety across all components, lib modules, and types.

#### Command 3: `npm run build`
- **Execution Result**: **PASS** (Compiled in 6.7s)
- **Proves**: Clean Next.js static page export without build errors or broken imports.

---

## PART 17 — GIT / BUILD HISTORY

### 1. Chronological Repository Evolution

```
898f2f3 Initial commit from Create Next App
   │
   ▼
898f2f3 -> 89b51af: Initial UI Prototype & Catalogue Tables
- Created catalogue tables for 6 primary keys, 42 data fields, and 46 APIs.
- Designed 6-layer visual layout.
   │
   ▼
1a05da1 -> 0531e01: Scenario Engine & Masterclass Integration
- Created scripts/parse_masterclass.js to convert LOCIQ_MASTERCLASS.md into src/data/masterclass.json.
- Built scripts/generate_maximum.js to generate the 20+ signal Multi-Source Maximum Scenario.
- Integrated slide-over detail panels.
   │
   ▼
d127e9b: Runtime Solver & Repo Hygiene
- Implemented src/lib/resolver.ts: resolveCanonicalGraph with Hamilton Largest Remainder Method.
- Sanitized missing declared address invariants.
- Fixed detail panel deep-dive inspection bugs.
   │
   ▼
e597d7b: Phase 2 Complete — Investigation, Intelligence Graph, Network Lab
- Built src/lib/knowledgeGraph.ts & IntelligenceGraphWorkspace.tsx (273-node Knowledge Graph with BFS shortest path).
- Built src/lib/entityNetworkData.ts, entityNetworkAnalytics.ts & NetworkLabWorkspace.tsx (Multi-case Entity Network with automated pattern rules).
- Built scripts/test_engine.ts with 131 automated assertions.
```

---

## PART 18 — DESIGN DECISIONS

### 1. Verified Design Intent vs. Reasonable Inferences

| Design Decision | Intent Type | Rationale & Evidence |
| :--- | :--- | :--- |
| **Deterministic Simulation Engine** | `VERIFIED DESIGN INTENT` | Ensures predictable, repeatable teaching demonstrations without network dependencies or flaky API keys ([PROJECT_TRUTH_loc-iq.md:L54-L88](file:///d:/0000_after%20portfolio_25726/3_loc-iq/loc-iq/PROJECT_TRUTH_loc-iq.md#L54-L88)). |
| **6-Layer ReactFlow Layout** | `VERIFIED DESIGN INTENT` | Separates raw input keys from external sources, observations, signals, physical hypotheses, and decision outcomes ([GraphVisualizer.tsx:L31-L38](file:///d:/0000_after%20portfolio_25726/3_loc-iq/loc-iq/src/components/GraphVisualizer.tsx#L31-L38)). |
| **Largest Remainder Method (Hamilton Method)** | `VERIFIED DESIGN INTENT` | Guarantees candidate evidence share percentages sum to exactly 100% without floating-point rounding errors ([resolver.ts:L72-L92](file:///d:/0000_after%20portfolio_25726/3_loc-iq/loc-iq/src/lib/resolver.ts#L72-L92)). |
| **Proxy IP Trust Penalty ($0.1$ Factor)** | `VERIFIED DESIGN INTENT` | Isolates anonymized VPN exit nodes (Frankfurt / Singapore) from leaking into physical candidate location rankings ([resolver.ts:L222](file:///d:/0000_after%20portfolio_25726/3_loc-iq/loc-iq/src/lib/resolver.ts#L222)). |
| **Multi-Case Synthetic Entity Network Lab** | `REASONABLE INFERENCE` | Demonstrates how multi-application fraud rings (shared devices, reused contact attributes) are detected across independent cases. |
| **In-Memory Schema Knowledge Graph** | `REASONABLE INFERENCE` | Enables instant BFS shortest-path lineage exploration between input keys and derived metrics without a Neo4j backend. |

---

## PART 19 — PRODUCTIONIZATION GAP

To evolve this architectural workstation into a production-grade fraud detection system, the following engineering gaps would need to be addressed:

1. **Authenticated API Gateway Layer**: Replace static JSON fixtures with secure server-side HTTP integration gateways connecting to credit bureaus (CIBIL/Experian), telecom APIs, and IP intelligence services over HTTPS with mutual TLS (mTLS).
2. **Consent & Regulatory Governance**: Implement digital consent management complying with the Digital Personal Data Protection (DPDP) Act and RBI regulations, enforcing explicit customer consent before triggering bureau or location queries.
3. **Enterprise Graph Database Storage**: Migrate in-memory JS graph structures to a production graph database (e.g. Neo4j or Amazon Neptune) with Cypher query indexing for real-time multi-million node entity resolution.
4. **Statistically Calibrated Risk Model**: Replace expert rule weights with a machine learning model (e.g. XGBoost or Logistic Regression) trained on historical loan default datasets, outputting calibrated Probability of Default (PD) scores.
5. **Asynchronous Event Pipeline**: Implement distributed messaging queues (Kafka / RabbitMQ) to handle asynchronous API lookups with fallback handling for slow or unresponsive data providers.
6. **Role-Based Access Control (RBAC) & Audit Trails**: Add user authentication, investigator permission tiers, and immutable audit logging for fraud decisioning compliance.

---

## PART 20 — CLAIM SAFETY TABLE

| SAFE TO SAY IN VIDEO | SAY WITH QUALIFICATION | DO NOT CLAIM |
| :--- | :--- | :--- |
| "Loc-IQ is an interactive builder console and architecture visualizer for location evidence and address consistency." | "Loc-IQ models how applicant digital footprints—such as bureau address history, bank branch IFSCs, and cell towers—could be evaluated." | "Loc-IQ connects to live credit bureau databases or real bank core banking systems." |
| "Loc-IQ runs a client-side deterministic graph solver that weights signals and ranks physical candidate locations." | "The scoring solver calculates normalized evidence shares using signal weight heuristics." | "Loc-IQ uses a machine learning model trained on real bank default data to predict fraud probability." |
| "The workstation penalizes proxy/VPN IP connections by applying a 90% trust discount." | "IP trust discounts are applied deterministically to isolate datacenter exit nodes from physical candidate rankings." | "Loc-IQ performs live GPS tracking of loan applicants." |
| "Loc-IQ includes a 273-node master Knowledge Graph and a multi-case synthetic Entity Network Lab." | "The Knowledge Graph and Entity Network operate on synthetic, in-memory datasets for interactive demonstration." | "Loc-IQ processes real customer personal data or live client loan applications." |

---

## PART 21 — BEGINNER-TO-EXPERT TEACHING ORDER

To deliver an engaging video masterclass based on this codebase, follow this 10-chapter sequence:

1. **Chapter 1: The Address-Consistency Problem**  
   *Concept*: Why address verification matters in retail lending and why address mismatch $\neq$ automatic fraud.  
   *Focus*: Introduce declared vs. observed physical evidence.

2. **Chapter 2: Seed Identifiers — The Inputs**  
   *Concept*: The 6 primary keys (`pan`, `mobile_number`, `aadhaar_number`, `email_id`, `customer_key`, `declared_pincode`).  
   *Focus*: What each key unlocks in the outside world.

3. **Chapter 3: Evidence Sources & Raw Observations**  
   *Concept*: Mapping 46 external API sources to 42 fetched data fields.  
   *Focus*: Bureau address history, bank branch IFSC codes, cell towers, Wi-Fi BSSID scans, IP addresses.

4. **Chapter 4: Derived Signals & Trust Discounting**  
   *Concept*: How raw fields transform into 77 derived signals.  
   *Focus*: The formula $\text{effWeight} = \text{base\_weight} \times \text{recency\_factor} \times \text{ip\_trust\_factor}$ and why proxy IPs get a $0.1$ multiplier.

5. **Chapter 5: Candidate Location Hypotheses & Evidence Share**  
   *Concept*: Ranking physical location candidates.  
   *Focus*: The Largest Remainder Method (Hamilton Method) for exact 100% integer evidence share distribution.

6. **Chapter 6: Address Consistency Decision Logic**  
   *Concept*: Evaluating `CONSISTENT`, `REVIEW`, and `CONFLICT` verdicts.  
   *Focus*: Decision tree rules comparing declared pincode against top physical candidate evidence shares.

7. **Chapter 7: Scenario Walkthroughs**  
   *Concept*: Case studies in the UI.  
   *Focus*: Step-by-step narration of Clean Scenario (Bengaluru), Physical Conflict (Anantapur), and Multi-Source Maximum Scenario (Pune).

8. **Chapter 8: Master Data & The Knowledge Graph**  
   *Concept*: Architectural lineage and shortest path search.  
   *Focus*: Exploring the 273-node Knowledge Graph and tracing paths from `id:pan` to derived signals.

9. **Chapter 9: Multi-Case Network Lab & Entity Link Analysis**  
   *Concept*: Detecting multi-application fraud rings.  
   *Focus*: Demonstrating shared devices, reused contact attributes, shared proxies, and benign household counterexamples.

10. **Chapter 10: Productionization & Limitations**  
    *Concept*: From architectural prototype to production enterprise system.  
    *Focus*: Explaining API gateways, DPDP consent governance, graph databases, ML scoring models, and production gaps.

---

## PART 22 — SCREEN RECORDING GUIDE

| Chapter | Recommended Screen View | Exact Code / File Reference | UI Element / Component |
| :--- | :--- | :--- | :--- |
| **Ch. 1** | App Main Screen (`INVESTIGATION`) | [app/page.tsx:L93-L145](file:///d:/0000_after%20portfolio_25726/3_loc-iq/loc-iq/app/page.tsx#L93-L145) | Application Header & Workstation Layout |
| **Ch. 2** | Left Context Rail | [src/components/CaseContextRail.tsx:L50-L82](file:///d:/0000_after%20portfolio_25726/3_loc-iq/loc-iq/src/components/CaseContextRail.tsx#L50-L82) | Seed Identifiers Card |
| **Ch. 3** | Reference Library Modal | [ReferenceLibraryModal.tsx](file:///d:/0000_after%20portfolio_25726/3_loc-iq/loc-iq/src/components/ReferenceLibraryModal.tsx), `data_fetched_data_fields.json` | Master Data Tabs (42 Fields, 46 APIs) |
| **Ch. 4** | Code Editor + Graph Visualizer | [src/lib/resolver.ts:L218](file:///d:/0000_after%20portfolio_25726/3_loc-iq/loc-iq/src/lib/resolver.ts#L218) | `effWeight` calculation in code & Red Proxy Node in graph |
| **Ch. 5** | Code Editor + Decision Panel | [src/lib/resolver.ts:L72-L92](file:///d:/0000_after%20portfolio_25726/3_loc-iq/loc-iq/src/lib/resolver.ts#L72-L92) | `allocateExactPercentages` code & Ranked Candidates Cards |
| **Ch. 6** | Right Decision Panel | [src/components/DecisionPanel.tsx:L50-L82](file:///d:/0000_after%20portfolio_25726/3_loc-iq/loc-iq/src/components/DecisionPanel.tsx#L50-L82) | Address Consistency Verdict Card (`CONFLICT`) |
| **Ch. 7** | App Header Scenario Switches | [src/components/Header.tsx:L74-L99](file:///d:/0000_after%20portfolio_25726/3_loc-iq/loc-iq/src/components/Header.tsx#L74-L99) | `Clean Scenario`, `Physical Conflict`, `Multi-Source` buttons |
| **Ch. 8** | Intelligence Graph Workspace | [IntelligenceGraphWorkspace.tsx](file:///d:/0000_after%20portfolio_25726/3_loc-iq/loc-iq/src/components/IntelligenceGraphWorkspace.tsx) | Lens selector & Shortest Path Finder tool |
| **Ch. 9** | Network Lab Workspace | [NetworkLabWorkspace.tsx](file:///d:/0000_after%20portfolio_25726/3_loc-iq/loc-iq/src/components/NetworkLabWorkspace.tsx) | Pattern findings list (`SHARED_DEVICE`, `SHARED_PROXY`) |
| **Ch. 10** | Terminal / Code Editor | `scripts/test_engine.ts`, `PROJECT_TRUTH_loc-iq.md` | Terminal `npm test` passing 131 assertions |

---

## PART 23 — OPEN QUESTIONS / UNRESOLVED GROUND TRUTH

1. **Excel Parser Script Divergence**: The script `scripts/parseExcel.mjs` attempts to open `Shared_Stage 1_Fraud Intelligence Project.xlsx`, whereas the local root workbook is named `NOT Sh_Stage 1_Master Workbook_Fraud Intelligence Project.xlsx`. Running `node scripts/parseExcel.mjs` directly will fail unless the path is updated. However, the runtime application loads static JSON files directly from `src/data/` and does not rely on this script.
2. **Secondary Unused JSON Files**: The root JSON files `src/data/primaryIdentifiers.json`, `src/data/dataFields.json`, `src/data/apiUniverse.json`, and `src/data/output.json` exist in the repo from earlier excel exports but are unreferenced by application code (`AppContext.tsx` imports `data_primary_identifiers.json`, `data_fetched_data_fields.json`, `data_api_universe.json`).
