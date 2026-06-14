# PROJECT NORTHSTAR: The Beginner's Guide to Loc-IQ

Welcome! If you are reading this, you might be feeling a little overwhelmed. You might be wondering, "We talked about all these Excel sheets, Data Fields, and APIs... but all I see on the screen is a dark dashboard with a web and some moving lines. Where did the data go? Is the app actually doing anything?"

Take a deep breath. You are completely fine. 

What you are experiencing is totally normal. Modern software development often feels like a magic trick—or a "black box"—because the most complex, heavy lifting happens completely invisibly behind the scenes. 

This manual is designed specifically for you. No coding jargon. No confusing tech-speak. We are going to walk through exactly what Loc-IQ is, how it works, and where all your hard work from the Excel sheets is currently living inside the app.

Let's dive in.

---

## 1. The Big Picture: What is Loc-IQ?

**The Real-World Problem**
Imagine a bank gives a large loan to a customer. A few months later, the customer stops paying. The bank tries to send a recovery agent to the customer's house, but when the agent arrives, the house is empty. The address the customer gave the bank was fake, or they moved and didn't tell anyone. The fraudster has disappeared into the wind.

**The Loc-IQ Solution**
Your first thought might be: *"Why don't we just track their phone's live GPS?"* 
Because live GPS tracking is illegal without a warrant. It's surveillance. Banks are not allowed to do that.

Instead of tracking them like a spy, Loc-IQ acts like a brilliant **Digital Detective**. 
Every time a person uses their phone, pays a utility bill, opens an internet connection, or applies for a credit card, they leave a tiny "digital footprint" of their location. 

Loc-IQ doesn't use GPS. It uses a **Location Probability Model**. It gathers all these scattered digital footprints from around the internet, throws them onto a detective's pinboard, and uses math to say: *"Based on the evidence, we are 95% confident this person is hiding in Bengaluru."*

---

## 2. Demystifying the Black Box: Where is the Excel Data?

If you open the Loc-IQ builder console right now, you'll see a series of tabs. This console is the direct manifestation of your Excel workbook. Let's translate your Excel workbook directly into the app you see:

*   **Primary Identifiers Tab**
    This is literally Sheet 3 brought to life. These are the 6 starting clues we hand to our detective (like PAN, Mobile Number, Aadhaar).
*   **API Universe Tab**
    This translates Sheet 5. It shows the 46 different external databases, government registries, and telecom APIs Loc-IQ connects to.
*   **Fetched Data Fields Tab**
    This is Sheet 4. Here, you see exactly what raw data is pulled back from those APIs (e.g., "Bureau Address History", "Telecom Circle"). You can see whether the data sits internally at the bank, or requires customer consent.
*   **Derived Columns Tab**
    Once the app gathers the raw clues, it has to make sense of them. The "Derived Columns" are mathematical formulas running at lightning speed to weigh which clues are trustworthy and which are garbage.
*   **Graph Engine Tab**
    This is the visual detective's pinboard. It maps out all the nodes (Identifiers, APIs, Data Fields, Signals) and shows you exactly how the data flows from start to finish.
*   **Output Tab**
    Finally, the app prints out its final answer. The "Candidate Pincodes", "Confidence Scores", and "Truth Flags" are exactly what you designed in Sheet 2.

---

## 3. Step-by-Step: What happens when you click "Play Trace"?

In the Graph Engine tab, we've built a "Play Trace" feature. When you click that green button, time slows down and we walk you through the 7-step process of exactly how Loc-IQ thinks:

**Step 1: Identifiers Injected**
We start with the raw input—the PAN card, the mobile number, the declared PIN code.

**Step 2: Dispatch to APIs**
The app reaches out to the internet. You'll see lines shoot out connecting the identifiers to external APIs (like CIBIL, Experian, Razorpay IFSC, IP-API).

**Step 3: Fields Extracted**
The APIs reply with raw data fields. The graph illuminates the extracted footprints—IP addresses, branch codes, historical addresses.

**Step 4: Signals Derived**
Loc-IQ converts the raw data into mathematical "signals". Here, it applies weights. For example, a proxy IP gets down-weighted (trust factor 0.1), while a recent credit bureau address gets a high weight.

**Step 5: Locations Pinpointed**
The signals vote on candidate locations. Thick lines point to the most probable pincodes.

**Step 6: Confidence Scored**
The math finishes. The engine aggregates all the weights and assigns a confidence score out of 100 to the candidate locations.

**Step 7: Truth Flag Issued**
The app compares the winning location to what the customer originally declared:
*   **GREEN (Match):** The network says they live in 560001, and the customer *declared* 560001. Truth!
*   **AMBER (Partial):** The network says they live in 560003, but they declared 560001. Medium risk.
*   **RED (Severe):** The network says they are in Frankfurt using a VPN, but they declared Delhi. High risk! Fraud alert!

---

## 4. The Demo Scenarios Explained

To showcase the true power of Loc-IQ without having to manually type inputs, we built three specific "Trace" scenarios you can load from the Overview tab.

**[LOAD CASE: CLEAN]**
*   **What Happens:** The backend returns perfect, matching evidence. The Bureau, the IP, and the Bank branch *all* point to Bengaluru. 
*   **The Result:** The graph forms a tight, confident cluster. The Output ranks Bengaluru at 95% confidence. The Truth Flag is GREEN.

**[LOAD CASE: FRAUD]**
*   **What Happens:** The customer *claims* to live in Delhi. But the Bureau says Andhra Pradesh. And their internet IP says Frankfurt, Germany, with a known hacker Proxy!
*   **The Result:** The graph draws a scattered web. The engine detects the proxy and heavily down-weights Frankfurt. The Output ranks Andhra Pradesh as the true location. The Truth Flag is a massive RED.

**[LOAD CASE: MAXIMUM DATA]**
*   **What Happens:** This is the ultimate stress test. It hits almost every API in the universe (MCA, GSTIN, Vahan, FASTag, Telecom, etc.) pulling back 30 data fields and 15 derived signals.
*   **The Result:** You will see the Graph Engine light up like a massive constellation, demonstrating how Loc-IQ scales flawlessly to handle massive, complex B2B or entity-level investigations. 

---

**You did it.**
You have designed a complex, enterprise-grade architecture that translates raw Excel data into a living, breathing software application. The "black box" is just a pinboard doing math. You are ready to present.

---

## Appendix: Technical Developer Blueprint

For developers, engineers, or technical architects reviewing this codebase, the Loc-IQ application is built on a highly modern, performant, and type-safe stack. Here is the technical translation of the concepts above:

**1. Tech Stack Overview**
*   **Framework:** Next.js 16 (App Router) + React 19.
*   **Language:** Strict TypeScript (defining exact schemas from the JSON data).
*   **Styling:** Tailwind CSS (Dark mode, enterprise palettes, custom UI components via shadcn/ui).
*   **Data Flow:** React Context API (`AppContext.tsx`) orchestrating global state.

**2. The Graph Engine (`src/components/GraphVisualizer.tsx`)**
*   We utilized **@xyflow/react** (React Flow) to construct a massive directed acyclic graph (DAG) representing the full 170-node API universe. 
*   **Layered Layout Engine:** Nodes are procedurally plotted into 6 distinct X-axis layers (Identifiers → APIs → Fields → Derived → Locations → Output). 
*   **State Machine Animation:** A `playbackStep` integer state drives CSS opacity transitions and edge coloring to simulate data flow over time, creating a cinematic storytelling experience without heavy video assets.

**3. The Math Model (`src/data/data_demo_cases.json`)**
*   The actual probability mechanics use a weighted sum algorithm: `effective_weight = base_weight * recency_factor * ip_trust_factor`.
*   Proxy and VPN IPs automatically trigger a massive penalty (`ip_trust_factor: 0.1`) which structurally prevents fraudulent international IP addresses from outweighing physical domestic evidence (like a FASTag toll ping).

**4. The Objective A Flag (`truth_flag`)**
*   The logic compares the `declared_pincode` string against the `top_candidate` string.
*   The result acts as the ultimate pass/fail output for the bank's underwriting pipeline.
