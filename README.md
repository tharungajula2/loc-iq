# LOC-IQ

LOC-IQ is a front-end web application that visualises location probability in credit risk and fraud evaluation. It demonstrates how digital footprints can be structured into a directed network graph to evaluate applicant location without using live GPS tracking.

Live: Not deployed

## What it does

Retail credit underwriting relies on validating applicant location to manage default and fraud risk. Live GPS tracking is restricted by regulation and user consent.

LOC-IQ aggregates digital footprints from 46 external data sources across 6 primary identifiers. The system maps these data sources into 42 fetched fields and 77 derived columns to construct location signals.

The application computes composite signal weights to penalise connection risks such as proxy IP addresses. It evaluates candidate location PIN codes and displays automated location truth flags across static risk scenarios.

## Key numbers

| Metric | Value | Dataset or Component | Source File |
| :--- | :--- | :--- | :--- |
| Primary Identifiers in Catalogue | 6 | Catalogue | `src/data/data_primary_identifiers.json` |
| External APIs in Catalogue | 46 | Catalogue | `src/data/data_api_universe.json` |
| Fetched Data Fields in Catalogue | 42 | Catalogue | `src/data/data_fetched_data_fields.json` |
| Total Derived Columns Parsed | 77 | Runtime Catalogue | `app/page.tsx` |
| Clean Trace Top Candidate PIN | Bengaluru 560001 | Clean Demo Case | `src/data/data_demo_cases.json` |
| Clean Trace Confidence Score | 95% | Clean Demo Case | `src/data/data_demo_cases.json` |
| Clean Trace Truth Flag | GREEN | Clean Demo Case | `src/data/data_demo_cases.json` |
| Fraud Trace Top Candidate PIN | Delhi 110001 | Fraud Demo Case | `src/data/data_demo_cases.json` |
| Fraud Trace Confidence Score | 70% | Fraud Demo Case | `src/data/data_demo_cases.json` |
| Fraud Trace Truth Flag | RED | Fraud Demo Case | `src/data/data_demo_cases.json` |
| Maximum Trace Top Candidate PIN | Pune 411001 | Maximum Demo Case | `src/data/data_demo_cases.json` |
| Maximum Trace Confidence Score | 72% | Maximum Demo Case | `src/data/data_demo_cases.json` |
| Maximum Trace Truth Flag | RED | Maximum Demo Case | `src/data/data_demo_cases.json` |
| Proxy IP Trust Penalty Factor | 0.1 | Fraud & Maximum Cases | `src/data/data_demo_cases.json` |

## How it works

The system processes input identifiers through six sequential graph layout layers to rank location candidates.

```
[Primary Identifiers] (6 keys)
       │
       ▼
[API Universe] (46 sources)
       │
       ▼
[Fetched Data Fields] (42 fields)
       │
       ▼
[Derived Signals] (Composite weight: base_weight * recency * ip_trust)
       │
       ▼
[Candidate Locations] (Ranked PIN codes)
       │
       ▼
[Truth Flag Output] (GREEN / AMBER / RED)
```

1. **Input Selection**: The user selects a pre-configured scenario (Clean, Fraud, or Maximum) or enters primary keys.
2. **Context Hydration**: Global React context sets analysis status and populates primary keys, fetched fields, and expected output states using simulated delays of 300ms and 400ms.
3. **Graph Assembly**: ReactFlow renders nodes across 6 horizontal coordinate layers from x = 50 to x = 1400.
4. **Signal Calculation**: Edge weights are calculated using the formula `effWeight = base_weight * recency_factor * ip_trust_factor`.
5. **Output Inspection**: Candidates are ranked by score, and slide-over panels parse markdown documentation to display technical details.

## What is real and what is a demo

All inputs, candidate PIN codes, and scoring outputs are 100% synthetic test data. Real personal data and live external APIs were never involved.

| Feature / Component | Status | Implementation Details |
| :--- | :--- | :--- |
| Next.js Web Console & Layout | REAL | App Router page rendering and layout run end-to-end (`app/page.tsx`) |
| ReactFlow 6-Layer Graph Engine | REAL | Computes node layout coordinates and renders dynamic edge weights (`src/components/GraphVisualizer.tsx`) |
| Markdown Forensic Parser | REAL | Parses `LOCIQ_MASTERCLASS.md` into structured JSON for detail panels (`scripts/parse_masterclass.js`) |
| Pre-computed Scoring Engine | MOCKED | Loads pre-calculated confidence scores and truth flags from static JSON (`src/data/data_demo_cases.json`) |
| Live External API Integrations | MOCKED | Catalogue of 46 sources is mapped, but no HTTP network requests are executed |
| Manual Input Form Submission | PARTIAL | Custom input triggers a browser alert rather than dynamic model calculation (`src/components/InputForm.tsx`) |
| Consent Gating Enforcement | MOCKED | Data fields display static consent tags without runtime access blocking (`app/page.tsx`) |
| Excel Ingestion Pipeline | STUB | Ingestion script references a missing workbook file name (`scripts/parseExcel.mjs`) |
| Statistical Model Calibration | PLANNED | No machine learning model fitting code, AUROC, Gini, or probability estimation scripts exist |

## Hardest problems solved

1. **Multi-Layer Graph Layout Engineering**: Computed explicit (x, y) coordinate boundaries across 6 functional layers to display up to 170 graph nodes without overlapping nodes or visual clutter.
2. **Dynamic Signal Weight Composition**: Implemented inline edge weight calculations (`effWeight = base_weight * recency_factor * ip_trust_factor`) and visual proxy penalty indicators (`ip_trust_factor < 1.0` altering edge colors) inside graph rendering components.
3. **Structured Markdown Parser for Forensic Documentation**: Developed a parser script to convert a 57KB markdown file (`LOCIQ_MASTERCLASS.md`) into a JSON structure (`src/data/masterclass.json`) to populate contextual deep-dive panels upon node clicks.

## Limitations

1. **Static Pre-computed Traces**: The application does not compute location probabilities dynamically; outputs are read from static JSON files.
2. **Absence of Live API Client Code**: Mapped external APIs have no HTTP client logic or active backend network connections.
3. **Unimplemented Manual Form Processing**: Submitting custom inputs in the user interface displays a browser alert instead of processing backend data.
4. **No Statistical Credit Risk Model**: The repository contains no statistical model training, validation, or metric calculation (such as AUROC, Gini, or KS statistics).
5. **Indian Market Specificity**: Data schemas are restricted to Indian identifiers and infrastructure, including PAN, Aadhaar, UPI, CIBIL, IFSC, and CERSAI.
6. **No Runtime Privacy Enforcement**: Consent gating exists only as static UI badges without active policy enforcement.

## Stack

### Core
- `next`: `16.2.9`
- `react`: `19.2.4`
- `react-dom`: `19.2.4`
- `typescript`: `^5`

### UI & Visualisation
- `@xyflow/react`: `^12.11.0`
- `tailwindcss`: `^4`
- `@tailwindcss/postcss`: `^4`
- `framer-motion`: `^12.40.0`
- `lucide-react`: `^1.18.0`
- `clsx`: `^2.1.1`
- `tailwind-merge`: `^3.6.0`
- `class-variance-authority`: `^0.7.1`
- `cmdk`: `^1.1.1`

### Radix UI Primitives
- `@radix-ui/react-dialog`: `^1.1.16`
- `@radix-ui/react-slot`: `^1.2.5`
- `@radix-ui/react-switch`: `^1.3.0`
- `@radix-ui/react-tabs`: `^1.1.14`
- `@radix-ui/react-tooltip`: `^1.2.9`

### Data Processing
- `xlsx`: `^0.18.5`

## Running it

1. Clone the repository using relative paths within your workspace.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open `http://localhost:3000` in a browser.

## Contact

Tharun Gajula · Bengaluru, India
tharun.gajula.2@gmail.com · linkedin.com/in/tharungajula · tharungajula.vercel.app
