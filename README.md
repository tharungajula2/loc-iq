# LOC-IQ

A synthetic fraud-intelligence prototype for investigating location evidence in credit workflows.

**Live:** [loc-iq.vercel.app](https://loc-iq.vercel.app/)

---

## What it is

LOC-IQ demonstrates how an applicant's location can be inferred and verified from digital footprints — bureau address history, IP geolocation, cell tower metadata, UPI merchant patterns and bank IFSC codes — and how much evidential weight each signal actually deserves.

It is an interactive prototype. There is no live API integration, no production backend, no real customer data, and no machine-learning model. All data is synthetic.

---

## Four product surfaces

### 1. Investigation Workspace

A single synthetic credit application is investigated through a deterministic runtime provenance graph.

```
Identifiers → Evidence Providers → Observations → Derived Signals → Candidate Locations
```

Each edge carries a computed weight (`base_weight × recency_factor × ip_trust_factor`). The system resolves to ranked physical location hypotheses and an **Address Consistency** verdict: `CONSISTENT`, `CONFLICT`, or `REVIEW REQUIRED`.

Three pre-built scenarios demonstrate different outcomes:

| Scenario | Declared Location | Top Hypothesis | Address Consistency |
|---|---|---|---|
| Coherent Evidence | 560001 (Bengaluru) | 560001 | CONSISTENT |
| Physical Conflict | 110001 (Delhi) | 515001 (Anantapur) | CONFLICT |
| Multi-Source | 400001 (Mumbai) | 411001 (Pune) | CONFLICT |

### 2. Master Data & Fraud Intelligence Library

A searchable researched registry of the data landscape:

| Category | Count |
|---|---|
| Primary Identifiers | 6 |
| API / Data Sources | 46 |
| Fetched Data Fields | 42 |
| Derived Signals / Variables | 77 |
| Masterclass Knowledge Sections | 102 |

Each entry includes access classification, permission model, identifier requirements, and methodology notes.

### 3. Intelligence Graph

An interactive lineage graph tracing the **schema architecture** from identifier to derived signal. Exposes:

- `DIRECT`, `NORMALIZED`, and `CURATED` edge provenance
- progressive node expansion (never loads all 273 nodes by default)
- Find Path traversal between any two catalogue nodes
- Active Case Provenance lens — showing only the nodes active in the current investigation

### 4. Synthetic Entity Network Lab

A multi-case entity-linkage workspace across 79 synthetic instance nodes and 61 relationships, demonstrating what becomes visible only when many cases are viewed together.

Findings are **finding-first**: the system surfaces explainable structural patterns before rendering any graph. Verified patterns include:

| Finding | Observed | Classification |
|---|---|---|
| Shared Device Across Identities | 4 distinct PERSONs on one device | STRONG_ENTITY_LINK |
| Reused Contact Attribute | 2 customers sharing mobile / email | STRONG_ENTITY_LINK |
| Shared Proxy Infrastructure | 4 applications via Frankfurt proxy | CONTEXTUAL_LINK |
| Address Concentration | 5 applications at one commercial address | CONTEXTUAL_LINK |
| Geographic Convergence | 2 cases with operational events at same hub | CONTEXTUAL_LINK |
| Benign Household Counterexample | Shared address + IP, distinct devices + PAN | CONTEXTUAL_LINK (not escalated) |

Every finding exposes typed entity counts, excluded neighbors, supporting edge IDs, and deterministic explanation. Raw graph degree is never substituted for a typed business count.

---

## What is real and what is synthetic

| | Status |
|---|---|
| Next.js / React / TypeScript application | Real |
| Six-layer deterministic provenance graph engine | Real |
| Edge weight computation (recency decay, proxy trust penalty) | Real |
| 131 permanent regression assertions | Real |
| Researched catalogue of 46 APIs, 42 fields, 77 signals | Real research, synthetic presentation |
| Evidence shares, location hypotheses, address consistency | Deterministically computed at runtime from synthetic inputs |
| Knowledge Graph (273 nodes, 115 edges) | Fully auditable, ZERO heuristic edges |
| Entity Network (79 nodes, 61 relationships) | 100% synthetic fixture dataset |
| Any live API call | None |
| Any real customer data | None |
| Any ML / scoring model | None |
| Any graph database | None |
| Any Gemini / LLM integration | None |
| Any authentication or persistence backend | None |

---

## Explicit limitations

1. Evidence shares are computed from synthetic weighted inputs, not from a calibrated statistical model.
2. No live API integration. Nothing calls a real data source.
3. All synthetic customers, applications, identifiers and addresses are fictional.
4. Consent classification appears as labels only — there is no consent-gating logic in code.
5. Masterclass pattern rules are labelled as demonstration rules, not statistically calibrated thresholds.

---

## Stack

Next.js 16.2 · React 19.2 · TypeScript 5 · Vanilla CSS (via Tailwind 4) · `@xyflow/react` 12.11 · Radix UI · lucide-react · xlsx

## Running it

```bash
git clone https://github.com/tharungajula2/loc-iq.git
cd loc-iq
npm install
npm run dev
```

## Contact

Tharun Gajula · Bengaluru, India  
[tharun.gajula.2@gmail.com](mailto:tharun.gajula.2@gmail.com) · [LinkedIn](https://linkedin.com/in/tharungajula) · [Portfolio](https://tharungajula.vercel.app)
