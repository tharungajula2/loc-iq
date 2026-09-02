/* eslint-disable @typescript-eslint/no-require-imports, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import { demoCases } from '../src/context/AppContext';
import { resolveCanonicalGraph, resolveCustomTrace } from '../src/lib/resolver';
import { InputState } from '../src/types';

let totalTests = 0;
let passedTests = 0;

function assert(condition: boolean, description: string) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✓ PASS: ${description}`);
  } else {
    console.error(`  ✗ FAIL: ${description}`);
    process.exitCode = 1;
  }
}

console.log('====================================================');
console.log('       LOC-IQ CANONICAL ENGINE REGRESSION SUITE     ');
console.log('====================================================\n');

// ----------------------------------------------------
// 1. CLEAN DEMO INVARIANTS
// ----------------------------------------------------
console.log('▶ Testing Clean Demo Scenario...');
const cleanTrace = resolveCanonicalGraph(
  demoCases.clean.identifiers,
  demoCases.clean.fetched_fields,
  demoCases.clean.signals,
  demoCases.clean.case_label
);
const cleanGraph = cleanTrace.graph;

assert(cleanGraph.declaredLocation === '560001', 'Clean Demo declared location is valid "560001"');
assert(cleanGraph.addressConsistency === 'CONSISTENT', 'Clean Demo evaluates to CONSISTENT');
assert(cleanGraph.topCandidate === '560001', 'Clean Demo top candidate is expected geography "560001"');
assert(cleanGraph.candidates.length === 1, 'Clean Demo has exactly 1 ranked physical candidate (no regional pollution)');
assert(cleanGraph.candidates[0].location_label === 'Bengaluru 560001', 'Top candidate is "Bengaluru 560001"');

const cleanShareSum = cleanGraph.candidates.reduce((sum, c) => sum + c.evidenceShare, 0);
assert(cleanShareSum === 100, `Clean Demo displayed evidence shares sum to exactly 100% (Actual: ${cleanShareSum}%)`);

assert(cleanGraph.corroboratingEvidence.length > 0, 'Regional evidence is present under corroboratingEvidence');
assert(cleanGraph.corroboratingEvidence[0].region_label === 'Karnataka (region)', 'Corroborating region is "Karnataka (region)"');
assert(!cleanGraph.candidates.some(c => c.location_label.includes('(region)')), 'Regional scope is not ranked as a competing physical candidate');
assert(cleanGraph.riskIndicators.length === 0, 'No unexplained proxy risk indicators in Clean Demo');


// ----------------------------------------------------
// 2. FRAUD DEMO INVARIANTS
// ----------------------------------------------------
console.log('\n▶ Testing Fraud Demo Scenario...');
const fraudTrace = resolveCanonicalGraph(
  demoCases.fraud.identifiers,
  demoCases.fraud.fetched_fields,
  demoCases.fraud.signals,
  demoCases.fraud.case_label
);
const fraudGraph = fraudTrace.graph;

assert(fraudGraph.declaredLocation === '110001', 'Fraud Demo declared location is valid "110001"');
assert(fraudGraph.addressConsistency === 'CONFLICT', 'Fraud Demo evaluates to CONFLICT');
assert(fraudGraph.topCandidate === '515001', 'Fraud Demo top physical candidate is "515001" (Anantapur)');
assert(fraudGraph.topCandidate !== fraudGraph.declaredLocation, 'Top candidate materially differs from declared location');

const fraudShareSum = fraudGraph.candidates.reduce((sum, c) => sum + c.evidenceShare, 0);
assert(fraudShareSum === 100, `Fraud Demo displayed evidence shares sum to exactly 100% (Actual: ${fraudShareSum}%)`);

assert(fraudGraph.networkObservations.length > 0, 'Proxy/network observations remain in networkObservations');
assert(fraudGraph.networkObservations.some(n => n.is_proxy), 'Proxy exit node identified');
assert(!fraudGraph.candidates.some(c => c.location_id === 'frankfurt'), 'Frankfurt proxy exit is NOT ranked as a physical candidate');
assert(fraudGraph.riskIndicators.includes('VPN/Hosting Proxy Connection Detected'), 'Proxy risk indicator recorded separately');


// ----------------------------------------------------
// 3. MAXIMUM DEMO INVARIANTS
// ----------------------------------------------------
console.log('\n▶ Testing Maximum Demo Scenario...');
const maxTrace = resolveCanonicalGraph(
  demoCases.maximum.identifiers,
  demoCases.maximum.fetched_fields,
  demoCases.maximum.signals,
  demoCases.maximum.case_label
);
const maxGraph = maxTrace.graph;

assert(maxGraph.declaredLocation === '400001', 'Maximum Demo declared location resolves to "400001" (not blank)');
assert(maxGraph.nodes.length > cleanGraph.nodes.length, 'Maximum Demo has a richer evidence graph than Clean Demo');
assert(maxGraph.topCandidate === '411001', 'Top candidate follows actual weighted evidence ("411001" Pune)');
assert(maxGraph.addressConsistency === 'CONFLICT', 'Address consistency evaluates to CONFLICT against declared "400001"');

const maxShareSum = maxGraph.candidates.reduce((sum, c) => sum + c.evidenceShare, 0);
assert(maxShareSum === 100, `Maximum Demo displayed evidence shares sum to exactly 100% (Actual: ${maxShareSum}%)`);
assert(!maxGraph.candidates.some(c => c.location_id === 'singapore'), 'Singapore VPN exit is NOT ranked as a physical candidate');


// ----------------------------------------------------
// 4. CUSTOM BASELINE DETERMINISM & CLEAN TRACE INVARIANTS
// ----------------------------------------------------
console.log('\n▶ Testing Custom Baseline Traces...');
const input1: InputState = {
  mobile_number: '9845012345',
  pan: 'ABCDE1234F',
  aadhaar_number: '123456789012',
  email_id: 'john.doe@company.com',
  customer_key: 'CUST-BLR-01',
  case_id: 'CASE-BLR-01',
  declared_pincode: '560001'
};

const customRunA = resolveCustomTrace(input1, 'baseline');
const customRunB = resolveCustomTrace(input1, 'baseline');

assert(JSON.stringify(customRunA.graph.candidates) === JSON.stringify(customRunB.graph.candidates), 'Same input gives 100% deterministic candidates');
assert(customRunA.graph.addressConsistency === customRunB.graph.addressConsistency, 'Same input gives deterministic decision');
assert(customRunA.graph.riskIndicators.length === 0, 'Baseline custom input does not silently generate proxy/VPN risk');
assert(Boolean(customRunA.graph.corroboratingEvidence.some(c => c.region_label.includes('Karnataka'))), 'Karnataka regional evidence corroborates Bengaluru rather than competing');


// ----------------------------------------------------
// 5. PROXY PROFILE INVARIANTS
// ----------------------------------------------------
console.log('\n▶ Testing Proxy Profile Custom Trace...');
const proxyTrace = resolveCustomTrace(input1, 'proxy_risk');
const proxyGraph = proxyTrace.graph;

assert(proxyGraph.networkObservations.some(n => n.is_proxy), 'Explicit proxy profile creates a proxy network observation');
assert(proxyGraph.riskIndicators.includes('VPN/Hosting Proxy Connection Detected'), 'Risk indicator appears for proxy profile');
assert(proxyGraph.addressConsistency === 'CONSISTENT', 'Proxy presence alone does NOT force CONFLICT when physical evidence matches declared');


// ----------------------------------------------------
// 6. PHYSICAL CONFLICT PROFILE INVARIANTS
// ----------------------------------------------------
console.log('\n▶ Testing Physical Conflict Profile Custom Trace...');
const confInput: InputState = {
  ...input1,
  declared_pincode: '110001'
};
const confTrace = resolveCustomTrace(confInput, 'physical_conflict');
const confGraph = confTrace.graph;

assert(confGraph.candidates.length >= 2, 'Explicit conflict profile produces competing physical candidates');
assert(confTrace.fetchedFields.some(f => f.source_api.includes('(Simulated)')), 'Conflicting evidence has explicit simulated provenance');


// ----------------------------------------------------
// 7. MISSING DECLARED LOCATION INVARIANTS
// ----------------------------------------------------
console.log('\n▶ Testing Missing Declared Location Invariants...');
const missingDeclInput: InputState = {
  ...input1,
  declared_pincode: ''
};
const missingTrace = resolveCanonicalGraph(
  missingDeclInput,
  demoCases.clean.fetched_fields,
  demoCases.clean.signals,
  'MISSING DECLARATION TEST'
);
const missingGraph = missingTrace.graph;

assert(missingGraph.addressConsistency === 'REVIEW', 'Missing declared location resolves to REVIEW');
assert(missingGraph.addressConsistency !== 'CONSISTENT' && missingGraph.addressConsistency !== 'CONFLICT', 'Missing declared location NEVER resolves to CONSISTENT or CONFLICT');
assert(missingGraph.decisionReason.includes('Declared location is missing or unverified'), 'Decision reason clearly states address consistency cannot be fully evaluated');
assert(!missingGraph.decisionReason.includes('Declared location  is'), 'Decision reason does not contain empty declared location sentence');


// ----------------------------------------------------
// 8. GENERAL ENGINE INVARIANTS
// ----------------------------------------------------
console.log('\n▶ Testing General Engine Invariants...');
[cleanGraph, fraudGraph, maxGraph, customRunA.graph, proxyGraph, confGraph].forEach((g, idx) => {
  assert(g.candidates.every(c => c.geographicCategory === 'PHYSICAL_LOCALITY'), `Graph ${idx + 1}: All ranked candidates have category PHYSICAL_LOCALITY`);
  assert(!g.candidates.some(c => c.location_label.includes('proxy') || c.location_label.includes('VPN')), `Graph ${idx + 1}: Proxy/VPN exit nodes do not leak into physical candidate rankings`);
  
  const shareSum = g.candidates.reduce((sum, c) => sum + c.evidenceShare, 0);
  assert(shareSum === 100, `Graph ${idx + 1}: Displayed physical evidence share sum is exactly 100%`);
  assert(!isNaN(shareSum), `Graph ${idx + 1}: Evidence share sum is not NaN`);
  assert(isFinite(shareSum), `Graph ${idx + 1}: Evidence share sum is not Infinity`);
  assert(Boolean(g.decisionReason && g.decisionReason.trim() !== ''), `Graph ${idx + 1}: Decision reason is not blank`);
});

// ----------------------------------------------------
// 9. KNOWLEDGE GRAPH DOMAIN INVARIANTS (PHASE 2.2)
// ----------------------------------------------------
console.log('\n▶ Testing Knowledge Graph Domain Invariants...');
const { 
  buildKnowledgeGraph, 
  whyConnected, 
  getUnresolvedReport,
  getShortestPath,
  getLineageTrace,
  getConnectedComponents 
} = require('../src/lib/knowledgeGraph');

const kg1 = buildKnowledgeGraph();
const kg2 = buildKnowledgeGraph();

// Node Counts Invariants
const idNodes = kg1.nodes.filter((n: any) => n.type === 'IDENTIFIER');
const srcNodes = kg1.nodes.filter((n: any) => n.type === 'DATA_SOURCE');
const fldNodes = kg1.nodes.filter((n: any) => n.type === 'FETCHED_FIELD');
const sigNodes = kg1.nodes.filter((n: any) => n.type === 'DERIVED_SIGNAL');
const docNodes = kg1.nodes.filter((n: any) => n.type === 'KNOWLEDGE_TOPIC');

assert(idNodes.length === 6, `KG Node Count: 6 Primary Identifiers (Actual: ${idNodes.length})`);
assert(srcNodes.length === 46, `KG Node Count: 46 Data Sources (Actual: ${srcNodes.length})`);
assert(fldNodes.length === 42, `KG Node Count: 42 Fetched Fields (Actual: ${fldNodes.length})`);
assert(sigNodes.length === 77, `KG Node Count: 77 Derived Signals (Actual: ${sigNodes.length})`);
assert(docNodes.length === 102, `KG Node Count: 102 Masterclass Topics (Actual: ${docNodes.length})`);
assert(kg1.nodes.length === 273, `KG Total Node Count: 273 Nodes (Actual: ${kg1.nodes.length})`);

// Edge & Provenance Invariants
const nodeIds = new Set(kg1.nodes.map((n: any) => n.id));
assert(kg1.edges.every((e: any) => nodeIds.has(e.source) && nodeIds.has(e.target)), 'Every KG edge references valid existing source and target nodes');
assert(kg1.edges.every((e: any) => ['DIRECT', 'NORMALIZED', 'CURATED'].includes(e.certainty)), 'Every KG edge has a valid provenance classification (DIRECT, NORMALIZED, or CURATED)');
assert(kg1.edges.every((e: any) => e.certainty !== 'HEURISTIC'), 'ZERO HEURISTIC edges exist in the production Knowledge Graph');

// Signal Provenance Invariant
assert(sigNodes.every((s: any) => s.metadata && s.metadata.parent_field), 'Every derived signal has an explicitly traceable parent field');

// Leakage Invariants
assert(!kg1.nodes.some((n: any) => n.label.includes('PHYSICAL_LOCALITY') || n.label.includes('REGIONAL_SCOPE')), 'No runtime Investigation Graph nodes leak into Knowledge Graph');
assert(!kg1.nodes.some((n: any) => n.label === '560001' || n.label === '110001'), 'No synthetic customer applicant values exist in Knowledge Graph');

// Analytics Invariants
const path1 = getShortestPath(kg1, 'id:pan', 'sig:address_stability_score');
assert(Boolean(path1 && path1.length >= 3), 'Shortest path successfully finds multi-hop path from id:pan to sig:address_stability_score');

const pathNo = getShortestPath(kg1, 'id:pan', 'non_existent_node');
assert(pathNo === null, 'Shortest path correctly returns null when no path exists');

const lineagePan = getLineageTrace(kg1, 'id:pan');
assert(lineagePan.length > 0, 'Lineage trace returns valid lineage paths starting from id:pan');

const components = getConnectedComponents(kg1);
assert(components.length > 0, 'Connected components utility partitions Knowledge Graph into non-empty components');

// ----------------------------------------------------
// 10. SYNTHETIC ENTITY NETWORK LAB DOMAIN INVARIANTS (PHASE 2.4)
// ----------------------------------------------------
console.log('\n▶ Testing Synthetic Entity Network Lab Domain Invariants (Phase 2.4)...');
const { buildSyntheticEntityNetwork } = require('../src/lib/entityNetworkData');
const { 
  getNeighborhood, 
  getDegreeCounts, 
  getConnectedComponents: getEntityComponents, 
  getShortestPath: getEntityShortestPath, 
  getSharedNeighbors, 
  getEntityOverlap, 
  detectNetworkPatterns 
} = require('../src/lib/entityNetworkAnalytics');

const netGraph = buildSyntheticEntityNetwork();

// A. Data Integrity & Synthetic Guarantee
assert(netGraph.metadata.isSynthetic === true, 'Entity Network is 100% synthetic dataset');
assert(netGraph.nodes.length >= 60, `Entity Network has sufficient multi-case node count (Actual: ${netGraph.nodes.length})`);
assert(netGraph.edges.length >= 40, `Entity Network has sufficient relationship edge count (Actual: ${netGraph.edges.length})`);

const netNodeIds = new Set(netGraph.nodes.map((n: any) => n.id));
assert(netNodeIds.size === netGraph.nodes.length, 'All Entity Network node IDs are unique');
assert(netGraph.edges.every((e: any) => netNodeIds.has(e.source) && netNodeIds.has(e.target)), 'Every Entity Network edge references valid source and target nodes');

// B. Schema Separation Invariant
assert(!netGraph.nodes.some((n: any) => n.type === 'DATA_SOURCE' || n.type === 'FETCHED_FIELD' || n.type === 'KNOWLEDGE_TOPIC'), 'Zero Knowledge Graph schema nodes exist as Entity Network runtime instances');
assert(netGraph.nodes.some((n: any) => Boolean(n.kgConceptId)), 'Entity Network instance nodes reference Knowledge Graph schema by canonical kgConceptId');

// C. Analytics & Topological Traversal
const netComps = getEntityComponents(netGraph);
assert(netComps.length >= 3, `Entity Network partitions into distinct connected components (Actual: ${netComps.length})`);

// Shortest Path Assertions (5 Required Types)
const pathSharedDev = getEntityShortestPath(netGraph, 'cust:ramesh_kumar', 'cust:suresh_patel');
assert(Boolean(pathSharedDev && pathSharedDev.length === 3), 'Shortest path 1: Customers Ramesh and Suresh linked via shared device (3 hops)');

const pathProxyNet = getEntityShortestPath(netGraph, 'case:app_09', 'case:app_10');
assert(Boolean(pathProxyNet && pathProxyNet.length === 3), 'Shortest path 2: Cases 09 and 10 linked via common proxy infrastructure (3 hops)');

const pathMultiHop = getEntityShortestPath(netGraph, 'cust:ramesh_kumar', 'addr:fort_mumbai_400001');
assert(Boolean(pathMultiHop && pathMultiHop.length >= 4), 'Shortest path 3: Multi-hop 4+ node relationship from Ramesh to Fort Mumbai address');

const pathLocationEvent = getEntityShortestPath(netGraph, 'case:app_18', 'loc:anantapur_hub_515001');
assert(Boolean(pathLocationEvent && pathLocationEvent.length === 3), 'Shortest path 4: Operational location relationship from Case 18 to Anantapur Hub');

const pathDisconnected = getEntityShortestPath(netGraph, 'case:app_clean_baseline', 'cust:ramesh_kumar');
assert(pathDisconnected === null, 'Shortest path 5: Disconnected clean baseline case pair returns null (No Path)');

// Shared Neighbors Assertions
const sharedHousehold = getSharedNeighbors(netGraph, 'case:app_01', 'case:app_02');
assert(sharedHousehold.some((n: any) => n.id === 'addr:indiranagar_blr_560001'), 'Shared neighbors: Household cases 01 & 02 share Indiranagar address');

const sharedProxyCases = getSharedNeighbors(netGraph, 'case:app_09', 'case:app_10');
assert(sharedProxyCases.some((n: any) => n.id === 'ip:proxy_frankfurt_01'), 'Shared neighbors: Cases 09 & 10 share Frankfurt proxy endpoint');

const overlapRes = getEntityOverlap(netGraph, 'case:app_01', 'case:app_02');
assert(overlapRes.sharedCount >= 2, 'Entity overlap: Household cases have non-zero shared entity overlap');

// D. Structural Pattern Rules Assertions
const findings = detectNetworkPatterns(netGraph);
assert(findings.length >= 5, `Structural pattern engine detects all 5+ inspectable findings (Actual: ${findings.length})`);

const ruleDev = findings.find((f: any) => f.ruleId === 'RULE_SHARED_DEVICE_MULTIPLE_IDENTITIES');
assert(Boolean(ruleDev && ruleDev.observedValue === 4), 'Pattern B: Shared device rule detects 4 distinct customer identities on device DEV_SYN_04');

const ruleReuse = findings.find((f: any) => f.ruleId === 'RULE_REUSED_CONTACT_ATTRIBUTES');
assert(Boolean(ruleReuse && ruleReuse.observedValue === 2), 'Pattern C: Reused contact attribute rule detects mobile/email sharing');

const ruleProxy = findings.find((f: any) => f.ruleId === 'RULE_SHARED_PROXY_ENDPOINT');
assert(Boolean(ruleProxy && ruleProxy.observedValue >= 4), `Pattern D: Shared proxy rule detects 4+ applications via Frankfurt proxy (Actual: ${ruleProxy?.observedValue})`);

const ruleAddr = findings.find((f: any) => f.ruleId === 'RULE_ADDRESS_CONCENTRATION');
assert(Boolean(ruleAddr && ruleAddr.observedValue >= 5), `Pattern E: Address concentration rule detects 5+ applications at Fort Mumbai (Actual: ${ruleAddr?.observedValue})`);

const ruleHousehold = findings.find((f: any) => f.ruleId === 'RULE_BENIGN_HOUSEHOLD_PATTERN');
assert(Boolean(ruleHousehold && ruleHousehold.classification === 'CONTEXTUAL_LINK'), 'Benign Counterexample: Household members sharing address & IP correctly evaluated as CONTEXTUAL_LINK (not fraud!)');

// ----------------------------------------------------
// 11. ENTITY NETWORK SEMANTIC INTEGRITY & TYPED COUNTING (PHASE 2.4.1)
// ----------------------------------------------------
console.log('\n▶ Testing Entity Network Semantic Integrity & Typed Counting (Phase 2.4.1)...');
const { getComponentDiagnostics } = require('../src/lib/entityNetworkAnalytics');

// E. Component Diagnostics Classification Terminology
const compDiag = getComponentDiagnostics(netGraph);
assert(compDiag.totalComponentCount >= 3, `Component Diagnostics: partitions into components (Actual: ${compDiag.totalComponentCount})`);
assert(compDiag.standaloneCaseComponents.length >= 2, `Component Diagnostics: standalone case components correctly identified (Actual: ${compDiag.standaloneCaseComponents.length})`);
assert(compDiag.standaloneCaseComponents.every((c: any) => c.size >= 2), 'Component Diagnostics: standalone case components have size >= 2');
assert(Array.isArray(compDiag.isolatedNodes), 'Component Diagnostics: isolatedNodes array is present');

// F. Typed Counting vs Raw Degree Leakage Prevention
assert(ruleDev.observedEntityType === 'PERSON', 'Shared Device Rule: observedEntityType is PERSON');
assert(ruleDev.observedValue === 4, 'Shared Device Rule: observedValue is exactly 4 DISTINCT PERSONs (app_inst neighbor excluded)');
assert(Boolean(ruleDev.excludedNeighbors && ruleDev.excludedNeighbors.some((n: any) => n.id === 'app_inst:inst_04_shared')), 'Shared Device Rule: excluded app_inst neighbor explicitly logged');

assert(ruleProxy.observedEntityType === 'APPLICATION', 'Shared Proxy Rule: observedEntityType is APPLICATION');
assert(ruleProxy.observedValue === 4, 'Shared Proxy Rule: observedValue is exactly 4 DISTINCT APPLICATIONs (session neighbor excluded)');
assert(Boolean(ruleProxy.excludedNeighbors && ruleProxy.excludedNeighbors.some((n: any) => n.id === 'session:sess_priya_20')), 'Shared Proxy Rule: excluded session neighbor explicitly logged');

assert(ruleAddr.observedEntityType === 'APPLICATION', 'Address Concentration Rule: observedEntityType is APPLICATION');
assert(ruleAddr.observedValue === 5, 'Address Concentration Rule: observedValue is exactly 5 DISTINCT APPLICATIONs (person neighbor excluded)');
assert(Boolean(ruleAddr.excludedNeighbors && ruleAddr.excludedNeighbors.some((n: any) => n.id === 'cust:dinesh_verma')), 'Address Concentration Rule: excluded customer neighbor explicitly logged');

const ruleGeo = findings.find((f: any) => f.ruleId === 'RULE_GEOGRAPHIC_CONVERGENCE');
assert(Boolean(ruleGeo), 'Geographic Convergence Rule finding exists');
assert(ruleGeo.observedEntityType === 'APPLICATION', 'Geographic Convergence Rule: observedEntityType is APPLICATION');
assert(ruleGeo.observedValue === 2, 'Geographic Convergence Rule: observedValue is exactly 2 DISTINCT APPLICATIONs (case:app_18 and case:app_19)');
assert(Boolean(ruleGeo.excludedNeighbors && ruleGeo.excludedNeighbors.some((n: any) => n.id === 'cust:priya_nair')), 'Geographic Convergence Rule: excluded person neighbor explicitly logged');

// G. Finding Output Rich Metadata
assert(Boolean(ruleHousehold.benignContextNote), 'Benign Household Finding exposes explicit benignContextNote');
assert(findings.every((f: any) => Boolean(f.findingId && f.focalEntityId && f.observedEntityType && f.thresholdEntityType)), 'Every finding exposes findingId, focalEntityId, observedEntityType, and thresholdEntityType');

console.log('\n====================================================');
console.log(`RESULTS: ${passedTests} / ${totalTests} assertions passed.`);

console.log('====================================================\n');

if (passedTests !== totalTests) {
  process.exit(1);
}


