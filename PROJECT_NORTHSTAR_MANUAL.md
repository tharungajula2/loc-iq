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

If you open the Loc-IQ app right now, you won't see "Derived Columns" or "API Handshakes" written on the screen. It feels like the app is ignoring the Master Excel Workbook we created. 

It is absolutely not ignoring it! It is just happening **under the hood**, inside the brain of the app (the "Backend" or "Data Service"). Let's translate your Excel workbook directly into the app you see:

*   **Excel Sheet 3 (Primary Identifiers) = The Input Form on the Left Panel.**
    When you look at the left side of the dashboard, you see text boxes for Mobile Number, PAN, Aadhaar, etc. This is literally Sheet 3 brought to life. It is the starting clue we hand to our detective.

*   **Excel Sheet 5 (API Universe) & Sheet 4 (Data Fields) = The Invisible Fetcher (`mockDataService.ts`).**
    When you click the button, the app pretends to reach out to the real world (Telecom companies, Credit Bureaus). Because we are building a prototype, it doesn't *actually* call the real government databases yet. Instead, we wrote an invisible script that pretends to be the internet, immediately handing back the "Data Fields" you designed in Sheet 4. 

*   **Derived Columns = The Math Engine (`graphEngine.ts`).**
    Once the app gathers the clues, it has to make sense of them. The "Derived Columns" from your Excel sheet are actually mathematical formulas running at lightning speed inside the code to weigh which clues are trustworthy and which are garbage.

*   **Excel Sheet 2 (Output) = The Leaderboard and Entity Inspector on the Right Panel.**
    Finally, the app prints out its final answer on the right side of the screen. The "Candidate Pincodes", "Confidence Scores", and "Truth Flags" are exactly what you designed in Sheet 2.

---

## 3. Step-by-Step: What happens when you click "Initiate Trace"?

Let's slow time down. When you click that blue "Initiate Trace" button, here is the exact chronological sequence of events happening in milliseconds:

**Step A: The Clue is Handed Over**
You type in a PAN card (e.g., CLEAN1111A) and a Declared PIN Code (the PIN the customer claims they live at).

**Step B: The App Goes into "Analyzing" Mode**
The screen pulses. The Telemetry Log (the hacking-style text at the bottom left) starts scrolling. The app is reaching into its invisible engine and asking for evidence. It "downloads" their Bureau Address history, their IP Geolocation, and their Bank Branch location.

**Step C: The Graph Engine does the Math**
The app throws all this evidence onto a digital pinboard (The Graph). It draws a node (a dot) for the PAN card. It draws dots for the PIN codes it found on the internet. Then, it draws strings connecting them. If a piece of evidence is highly trusted (like a Credit Bureau report), it draws a very thick string. If it's weak (like an IP address that can be faked), it draws a thin string.

**Step D: Objective A (The Address Truth Flag)**
The app looks at the thickest, most tangled cluster of strings to find the **Top Ranked PIN**. 
Then, it compares it to what the customer told us (the Declared PIN):
*   **GREEN (Match):** The network says they live in 560001, and the customer *declared* 560001. They are telling the truth!
*   **AMBER (Partial):** The network says they live in 560003, but they declared 560001. Both are in Bengaluru. They probably just moved down the street. Medium risk.
*   **RED (Severe):** The network says they are in Frankfurt using a VPN, but they declared Delhi. High risk! Fraud alert!

**Step E: The Output Renders**
The math finishes. The pulsing stops. The beautiful web visualizer draws itself in the center, and the ranked answers populate the right-side Leaderboard.

---

## 4. The Graph Database Engine (Explained for a 5-year-old)

You hear the words "Graph Database" or "Graph Architecture" a lot. It sounds like a terrifying calculus problem. It isn't.

Think of a Graph Database exactly like a detective's corkboard covered in photos and red strings.

*   **What is a Node?**
    A Node is just a photo pinned to the corkboard. It can be a photo of a person (a PAN card), or a photo of a place (a PIN Code). 

*   **What is an Edge?**
    An Edge is the red string connecting two photos. If the PAN card is connected to a PIN code because we found a utility bill, we tie a red string between them.

*   **How do we calculate the "Confidence Score" out of 100?**
    Not all red strings are equal. 
    Imagine tying strings between the photos. A government Aadhaar document gets a very thick, heavy rope (High Trust Weight). A random IP address gets a very thin, fragile thread (Low Trust Weight). 
    To get a score out of 100, the app simply looks at a PIN Code photo and asks: *"How many thick ropes are pulling towards this photo?"* If a location has a lot of heavy ropes pulling toward it, it gets a 99% score.

---

## 5. The Demo Scenarios Explained

To make the app easy to show to your bosses without having to type for five minutes, we added two "Ghost Buttons" at the top left. Clicking them instantly fills the form and tells the backend to trigger two highly specific stories.

**[LOAD CASE: CLEAN]**
*   **The Code:** When you click this, the app looks for the PAN `CLEAN1111A`.
*   **What Happens:** The invisible backend is hardcoded to return perfect, matching evidence. It says the Bureau, the IP, and the Bank branch *all* point to Bengaluru. 
*   **The Result:** The graph visualizer in the center will form a beautiful, tight, perfect circle. The Leaderboard will rank Bengaluru at 99%. The Inspector will show a happy GREEN Truth Flag because the customer told the truth.

**[LOAD CASE: FRAUD]**
*   **The Code:** When you click this, the app looks for the PAN `FRAUD9999X`.
*   **What Happens:** The invisible backend is hardcoded to return a chaotic mess. The customer *claims* to live in Delhi. But the Bureau says Andhra Pradesh. And their internet IP says Frankfurt, Germany, with a known hacker Proxy!
*   **The Result:** The graph visualizer will draw a huge, messy, scattered web. The Leaderboard will rank a remote village in Andhra Pradesh at the top. The Inspector will throw a massive RED Truth flag, warning the bank not to give this person money.

---

**You did it.**
You have designed a complex, enterprise-grade architecture that translates raw Excel data into a living, breathing software application. The "black box" is just a pinboard doing math. You are ready to present.

---

## Appendix: Technical Developer Blueprint

For developers, engineers, or technical architects reviewing this codebase, the Loc-IQ application is built on a highly modern, performant, and type-safe stack. Here is the technical translation of the concepts above:

**1. Tech Stack Overview**
*   **Framework:** Next.js 16 (App Router) + React 19.
*   **Language:** Strict TypeScript (defining exact schemas from the Excel workbook).
*   **Styling:** Tailwind CSS (Dark mode, enterprise palettes, custom CSS animations).
*   **Data Flow:** React Context API (`AppContext.tsx`) orchestrating global state across a 3-column dashboard grid.

**2. The Graph Engine (`src/lib/graphEngine.ts`)**
*   Rather than relying on a heavy third-party graph database (like Neo4j) for a prototype, we engineered an **In-Memory Adjacency List**.
*   The `buildGraph` method instantiates a structured graph of `GraphNode` and `GraphEdge` arrays.
*   The math engine uses a weighted sum algorithm to parse `EnrichmentPayload`. It iterates over the edges pointing to `LOCATION` nodes, aggregating the `weight` values. It then normalizes these sums to a `0-100` float, representing the final `confidence_score` inside the `calculateLocationProbability` method.

**3. The Visualizer (`src/components/GraphVisualizer.tsx`)**
*   To avoid Server-Side Rendering (SSR) hydration errors and massive dependency bloat from libraries like D3.js, the graph visualizer uses **Native React SVG Rendering**.
*   **Concentric Math Logic:** Identifiers are mathematically locked inside a 100px radius inner ring using `Math.cos` and `Math.sin` trigonometry. Locations are plotted on a 240px outer ring. 
*   **Hardware Acceleration:** SVG styling utilizes native `transform-gpu` and calculated `strokeWidth` bindings tied directly to the edge weights, guaranteeing 60fps animations.

**4. The Objective A Flag (`address_truth_flag`)**
*   The logic runs entirely inside the Engine layer rather than the UI layer. During the `calculateLocationProbability` loop, the engine intercepts the `declared_pincode` string.
*   It performs a strict equality check for `GREEN` status.
*   It performs a `substring(0, 3)` proximity check for `AMBER` status.
*   It evaluates boolean flags like `is_proxy` directly from the `ip_geolocation` mock API endpoint to throw a `RED` status.
