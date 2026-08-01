
---
---

# 1. loc-iq

═══════════════════════════════════════════════════

# LOC-IQ

A console for location intelligence in retail credit underwriting and fraud investigation. It shows how an applicant's location can be inferred and verified from digital footprints, without live GPS tracking, and how much confidence each inference actually deserves.

**Live:** [loc-iq.vercel.app](https://loc-iq.vercel.app/)

---

## What it does

When a lender needs to verify where an applicant actually lives, the address on the form is often the least reliable signal available. Bureau address history, IP geolocation, cell tower metadata, UPI merchant patterns and bank IFSC codes each point somewhere, with different reliability and different age.

LOC-IQ maps that whole surface. It takes six primary identifiers, traces what each one unlocks across 46 external API sources, and assembles the result into a directed six-layer graph that resolves to a ranked set of candidate pincodes with a confidence flag.

The value is not the answer. It is seeing which signals carry weight, which are stale, and where a proxy IP or a mismatched tower quietly breaks the chain.

## Key numbers

| Item | Count |
|---|---|
| Primary identifiers | 6 |
| External API sources mapped | 46 |
| Fetched data fields defined | 42 |
| Derived columns parsed | 77 |
| Worked scenarios | 3 |
| Graph layers | 6 |

## How it works

```
identifiers → APIs → data fields → derived signals → candidate locations → output
```

Each edge carries a computed weight:

```
effWeight = base_weight × recency_factor × ip_trust_factor
```

Recency decays the influence of older signals. The proxy IP trust penalty is 0.1, and penalised edges render in red so a reviewer can see the break rather than read about it.

The three scenarios show the range:

| Scenario | Top candidate | Confidence | Flag |
|---|---|---|---|
| Clean | Bengaluru 560001 | 95% | GREEN |
| Fraud | Delhi 110001 | 70% | RED |
| Maximum | Pune 411001 | 72% | RED |

The fraud scenario surfaces a competing Frankfurt 60306 candidate at 20%, which is the proxy IP showing itself.

## What is real and what is a demo

**Real:** the Next.js application, the six-layer ReactFlow graph engine, the edge weight computation, the full catalogue of identifiers, APIs and fields, the markdown-parsed deep dive panels, and scenario switching.

**Demo:** every confidence score and truth flag is a static value in the scenario data, not computed at runtime. There is no live API integration anywhere; the interface labels its own responses as illustrative. Custom form input triggers a browser alert rather than running the pipeline. There is no statistical or machine learning model.

All three scenarios run on synthetic data. No real applicant data, address or phone number appears anywhere in this repository.

## Hardest problems solved

**Making weight visible rather than asserted.** A confidence number on its own tells a reviewer nothing. Rendering the computed edge weight, including the recency decay and the trust penalty, means the reviewer can see why a candidate ranks where it does and disagree with it.

**Graph layout across six layers without it becoming unreadable.** Six layers of nodes with many-to-many relationships collapses into noise under a naive force layout. The layers are positioned deterministically so the same identifier always sits in the same place.

**Cataloguing the field surface honestly.** 46 API sources unlocking 42 fields that derive into 77 columns is a lot of structure to hold. Getting the counts right, and keeping the interface consistent with them, was most of the work.

## Limitations

1. Confidence scores are illustrative values, not model outputs. There is no scoring engine.
2. No live API integration. Nothing here calls a real data source.
3. The scenarios are synthetic and were constructed to show specific failure modes.
4. Consent classification appears as interface labels only. There is no consent gating logic in code.
5. The pincode candidates are illustrative Indian metros, not a real geographic resolution index.

## Stack

Next.js 16.2, React 19.2, TypeScript 5, Tailwind CSS 4, ReactFlow (`@xyflow/react` 12.11), Framer Motion 12.40, Radix UI primitives, lucide-react, `xlsx`.

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

═══════════════════════════════════════════════════

---
---


═══════════════════════════════════════════════════
