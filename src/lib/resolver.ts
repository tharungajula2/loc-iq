import { 
  CanonicalInvestigationGraph, 
  CandidateDecomposition, 
  CorroboratingEvidenceTrace,
  CurrentTrace, 
  ExpectedOutputTrace, 
  FetchedFieldTrace, 
  GeographicCategory,
  GraphSignalTrace, 
  InputState, 
  InvestigationEdge, 
  InvestigationNode,
  NetworkObservationTrace
} from '../types';

/**
 * Computes a deterministic integer hash from a string.
 */
export function djb2Hash(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/**
 * Helper to determine geographic category for a location ID / label / signal.
 */
function classifyGeographicCategory(locationId: string, label: string, isProxy?: boolean, trustFactor?: number): GeographicCategory {
  if (isProxy || (trustFactor !== undefined && trustFactor < 1.0) || locationId.includes('frankfurt') || locationId.includes('singapore') || label.includes('proxy') || label.includes('VPN')) {
    return 'NETWORK_LOCATION';
  }
  if (locationId.includes('region') || locationId.includes('karnataka') || locationId.includes('maharashtra') || label.includes('(region)') || label.includes('circle')) {
    return 'REGIONAL_SCOPE';
  }
  return 'PHYSICAL_LOCALITY';
}

/**
 * Helper to check whether a regional scope corroborates a physical locality.
 */
function checkRegionalCorroboration(physicalId: string, physicalLabel: string, regionId: string, regionLabel: string): boolean {
  const pStr = `${physicalId} ${physicalLabel}`.toLowerCase();
  const rStr = `${regionId} ${regionLabel}`.toLowerCase();

  if (rStr.includes('karnataka') && (pStr.includes('bengaluru') || pStr.includes('560'))) return true;
  if (rStr.includes('maharashtra') && (pStr.includes('mumbai') || pStr.includes('pune') || pStr.includes('400') || pStr.includes('411'))) return true;
  if (rStr.includes('delhi') && (pStr.includes('delhi') || pStr.includes('110'))) return true;
  if (rStr.includes('andhra') || rStr.includes('telangana')) {
    if (pStr.includes('anantapur') || pStr.includes('hyderabad') || pStr.includes('515') || pStr.includes('500')) return true;
  }

  // General pincode prefix matching (e.g. 560 -> 56)
  const pinMatch = physicalId.match(/\d{6}/) || physicalLabel.match(/\d{6}/);
  if (pinMatch) {
    const pin = pinMatch[0];
    if (pin.startsWith('56') && rStr.includes('karnataka')) return true;
    if ((pin.startsWith('40') || pin.startsWith('41')) && rStr.includes('maharashtra')) return true;
    if (pin.startsWith('11') && rStr.includes('delhi')) return true;
    if ((pin.startsWith('50') || pin.startsWith('51')) && (rStr.includes('andhra') || rStr.includes('telangana'))) return true;
  }

  return false;
}

/**
 * Largest Remainder Method (Hamilton Method) to distribute whole-number percentages
 * so that candidate evidence shares sum to EXACTLY 100%.
 */
function allocateExactPercentages(weights: number[]): number[] {
  const totalWeight = weights.reduce((acc, w) => acc + w, 0);
  if (totalWeight <= 0) return weights.map(() => 0);

  const exactQuotas = weights.map(w => (w / totalWeight) * 100);
  const floorShares = exactQuotas.map(q => Math.floor(q));
  const remainders = exactQuotas.map((q, idx) => ({ remainder: q - floorShares[idx], index: idx }));

  const currentSum = floorShares.reduce((acc, s) => acc + s, 0);
  const unallocated = 100 - currentSum;

  // Sort remainders descending, breaking ties by index
  remainders.sort((a, b) => b.remainder - a.remainder || a.index - b.index);

  const finalShares = [...floorShares];
  for (let i = 0; i < unallocated && i < remainders.length; i++) {
    finalShares[remainders[i].index] += 1;
  }

  return finalShares;
}

/**
 * Core Canonical Investigation Graph Solver (Phase 1.2).
 */
export function resolveCanonicalGraph(
  seedInputs: InputState,
  fetchedFields: FetchedFieldTrace[],
  signals: GraphSignalTrace[],
  caseLabel: string
): CurrentTrace {
  const declaredPincode = (seedInputs.declared_pincode || '').trim();

  // 1. Build Canonical Nodes & Edges
  const nodes: InvestigationNode[] = [];
  const edges: InvestigationEdge[] = [];
  const riskIndicators: string[] = [];
  const corroboratingEvidence: CorroboratingEvidenceTrace[] = [];
  const networkObservations: NetworkObservationTrace[] = [];

  // Seed Input Nodes
  const identifierKeys: (keyof InputState)[] = [
    'pan', 'mobile_number', 'aadhaar_number', 'email_id', 'customer_key', 'case_id', 'declared_pincode'
  ];

  identifierKeys.forEach(key => {
    const val = seedInputs[key];
    if (val && val.trim() !== '') {
      nodes.push({
        id: `seed_${key}`,
        type: 'IDENTIFIER',
        label: key,
        value: val,
        category: 'Seed Applicant Key',
        provenance: 'Applicant Submission'
      });
    }
  });

  // Source API Nodes & Evidence Field Nodes
  const sourceApiMap = new Map<string, string>();
  fetchedFields.forEach((field) => {
    const sourceApiName = field.source_api || 'Unknown Provider';
    const sourceId = `src_${sourceApiName.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;

    if (field.proxy) {
      if (!riskIndicators.includes('VPN/Hosting Proxy Connection Detected')) {
        riskIndicators.push('VPN/Hosting Proxy Connection Detected');
      }
      networkObservations.push({
        signal: field.data_field,
        source_api: sourceApiName,
        network_label: field.resolves_to || field.value,
        is_proxy: true,
        reasoning: `Proxy / hosting server detected on field ${field.data_field}. Location observation isolated from physical candidate ranking.`
      });
    }

    if (!sourceApiMap.has(sourceApiName)) {
      sourceApiMap.set(sourceApiName, sourceId);
      nodes.push({
        id: sourceId,
        type: 'SOURCE',
        label: sourceApiName,
        category: 'Evidence Provider',
        provenance: sourceApiName
      });

      // Edge from Seed Key to Source API
      nodes.filter(n => n.type === 'IDENTIFIER').slice(0, 2).forEach(idNode => {
        edges.push({
          id: `e_${idNode.id}_${sourceId}`,
          source: idNode.id,
          target: sourceId,
          relationshipType: 'ENRICHS',
          baseReliability: 1.0,
          freshnessFactor: 1.0,
          trustModifier: 1.0,
          effectiveWeight: 1.0,
          reason: 'Seed key used to request evidence payload'
        });
      });
    }

    const fieldNodeId = `ev_${field.data_field}`;
    nodes.push({
      id: fieldNodeId,
      type: 'EVIDENCE',
      label: field.data_field,
      value: field.value,
      category: 'Fetched Observation',
      sourceApi: sourceApiName,
      provenance: sourceApiName,
      isSimulated: sourceApiName.includes('Simulated')
    });

    edges.push({
      id: `e_${sourceId}_${fieldNodeId}`,
      source: sourceId,
      target: fieldNodeId,
      relationshipType: 'EXTRACTS',
      baseReliability: 0.9,
      freshnessFactor: 1.0,
      trustModifier: field.proxy ? 0.1 : 1.0,
      effectiveWeight: field.proxy ? 0.09 : 0.9,
      reason: `Returned by ${sourceApiName}`
    });
  });

  // 2. Classify Signals & Map Geographic Categorization
  const physicalCandidatesMap = new Map<string, {
    locationId: string;
    locationLabel: string;
    totalSupportingWeight: number;
    supportingSignalCount: number;
    supportingEvidence: { signal: string; source_api: string; weight: number; evidence: string }[];
    corroboratingRegions: Set<string>;
    contradictions: { signal: string; source_api: string; reason: string }[];
  }>();

  const regionalSignalsList: {
    sig: GraphSignalTrace;
    effWeight: number;
  }[] = [];

  signals.forEach((sig) => {
    const effWeight = sig.base_weight * sig.recency_factor * sig.ip_trust_factor;
    const cat = classifyGeographicCategory(sig.location_id, sig.location_label, false, sig.ip_trust_factor);

    if (sig.ip_trust_factor < 1.0) {
      if (!riskIndicators.includes('IP Trust Factor Discount (Proxy/VPN)')) {
        riskIndicators.push('IP Trust Factor Discount (Proxy/VPN)');
      }
      if (!networkObservations.some(n => n.signal === sig.signal)) {
        networkObservations.push({
          signal: sig.signal,
          source_api: sig.source_api,
          network_label: sig.location_label,
          is_proxy: true,
          reasoning: sig.evidence
        });
      }
    }

    if (cat === 'PHYSICAL_LOCALITY') {
      const locKey = sig.location_id || sig.location_label;
      if (!physicalCandidatesMap.has(locKey)) {
        physicalCandidatesMap.set(locKey, {
          locationId: sig.location_id,
          locationLabel: sig.location_label,
          totalSupportingWeight: 0,
          supportingSignalCount: 0,
          supportingEvidence: [],
          corroboratingRegions: new Set<string>(),
          contradictions: []
        });
      }

      const entry = physicalCandidatesMap.get(locKey)!;
      entry.totalSupportingWeight += effWeight;
      entry.supportingSignalCount += 1;
      entry.supportingEvidence.push({
        signal: sig.signal,
        source_api: sig.source_api,
        weight: effWeight,
        evidence: sig.evidence
      });
    } else if (cat === 'REGIONAL_SCOPE') {
      regionalSignalsList.push({ sig, effWeight });
    }

    // Build Graph Nodes & Edges for all signals
    const signalNodeId = `sig_${sig.signal.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
    nodes.push({
      id: signalNodeId,
      type: 'SIGNAL',
      label: sig.signal,
      value: `wt: ${effWeight.toFixed(2)}`,
      category: `Derived Metric (${cat})`,
      sourceApi: sig.source_api,
      provenance: sig.source_api,
      metadata: {
        base_weight: sig.base_weight,
        recency_factor: sig.recency_factor,
        ip_trust_factor: sig.ip_trust_factor,
        evidence: sig.evidence,
        category: cat
      }
    });

    const parentEvNode = nodes.find(n => n.type === 'EVIDENCE' && (n.sourceApi === sig.source_api || n.label.includes(sig.signal)));
    if (parentEvNode) {
      edges.push({
        id: `e_${parentEvNode.id}_${signalNodeId}`,
        source: parentEvNode.id,
        target: signalNodeId,
        relationshipType: 'ENRICHS',
        baseReliability: sig.base_weight,
        freshnessFactor: sig.recency_factor,
        trustModifier: sig.ip_trust_factor,
        effectiveWeight: effWeight,
        reason: 'Observation evaluated into signal metric'
      });
    }
  });

  // Apply Regional Corroboration to Physical Candidates
  regionalSignalsList.forEach(({ sig, effWeight }) => {
    let matchedAnyPhysical = false;
    physicalCandidatesMap.forEach((cand) => {
      if (checkRegionalCorroboration(cand.locationId, cand.locationLabel, sig.location_id, sig.location_label)) {
        matchedAnyPhysical = true;
        cand.totalSupportingWeight += effWeight;
        cand.supportingSignalCount += 1;
        cand.supportingEvidence.push({
          signal: `${sig.signal} (Corroborating Region)`,
          source_api: sig.source_api,
          weight: effWeight,
          evidence: sig.evidence
        });
        cand.corroboratingRegions.add(sig.location_label);

        corroboratingEvidence.push({
          signal: sig.signal,
          source_api: sig.source_api,
          region_label: sig.location_label,
          weight: effWeight,
          reasoning: `Regional observation (${sig.location_label}) corroborates physical locality ${cand.locationLabel}.`
        });
      }
    });

    if (!matchedAnyPhysical) {
      corroboratingEvidence.push({
        signal: sig.signal,
        source_api: sig.source_api,
        region_label: sig.location_label,
        weight: effWeight,
        reasoning: `Broad regional observation (${sig.location_label}) recorded.`
      });
    }
  });

  // 3. Build Physical Location Candidates Array
  const physicalCandidatesList = Array.from(physicalCandidatesMap.values());

  // Calculate Exact 100% Integer Evidence Share Allocation via Largest Remainder Method
  const rawWeights = physicalCandidatesList.map(c => c.totalSupportingWeight);
  const exactShares = allocateExactPercentages(rawWeights);

  const rankedCandidates: CandidateDecomposition[] = physicalCandidatesList.map((c, idx) => ({
    location_id: c.locationId,
    location_label: c.locationLabel,
    geographicCategory: 'PHYSICAL_LOCALITY' as GeographicCategory,
    totalSupportingWeight: c.totalSupportingWeight,
    totalContradictingWeight: 0,
    supportingSignalCount: c.supportingSignalCount,
    contradictionCount: 0,
    evidenceShare: exactShares[idx],
    rank: 0,
    supportingEvidence: c.supportingEvidence,
    corroboratingRegions: Array.from(c.corroboratingRegions),
    contradictions: []
  }));

  // Sort Physical Candidates by totalSupportingWeight descending
  rankedCandidates.sort((a, b) => b.totalSupportingWeight - a.totalSupportingWeight);
  rankedCandidates.forEach((c, idx) => { c.rank = idx + 1; });

  // Add Candidate Location Nodes to Graph
  rankedCandidates.forEach(cand => {
    const locNodeId = `loc_${cand.location_id}`;
    nodes.push({
      id: locNodeId,
      type: 'CANDIDATE_LOCATION',
      label: cand.location_label,
      value: `Share: ${cand.evidenceShare}%`,
      category: 'Physical Location Hypothesis',
      provenance: 'Aggregated Physical & Corroborating Evidence'
    });

    cand.supportingEvidence.forEach(ev => {
      const sigNodeId = `sig_${ev.signal.replace(/\s*\(Corroborating Region\)/, '').toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
      if (nodes.some(n => n.id === sigNodeId)) {
        edges.push({
          id: `e_${sigNodeId}_${locNodeId}`,
          source: sigNodeId,
          target: locNodeId,
          relationshipType: 'SUPPORTS',
          baseReliability: 0.9,
          freshnessFactor: 1.0,
          trustModifier: 1.0,
          effectiveWeight: ev.weight,
          reason: ev.evidence
        });
      }
    });
  });

  const topCandidateObj = rankedCandidates[0];
  const topCandidateId = topCandidateObj ? topCandidateObj.location_id : '';
  const topCandidateLabel = topCandidateObj ? topCandidateObj.location_label : 'No Candidate';
  const topEvidenceShare = topCandidateObj ? topCandidateObj.evidenceShare : 0;

  // Track Contradictions explicitly against non-top candidate physical hypotheses
  rankedCandidates.forEach(cand => {
    if (cand.rank > 1 && topCandidateObj) {
      cand.contradictions.push({
        signal: 'Competing Physical Location Hypothesis',
        source_api: 'Graph Resolver',
        reason: `Primary physical hypothesis (${topCandidateLabel}) holds ${topEvidenceShare}% evidence share compared to ${cand.evidenceShare}%.`
      });
      cand.contradictionCount = cand.contradictions.length;
    }
  });

  // 4. Runtime Invariants & Address Consistency Decision
  let addressConsistency: 'CONSISTENT' | 'REVIEW' | 'CONFLICT' = 'REVIEW';
  let decisionReason = '';

  const cleanDeclaredPin = declaredPincode.replace(/\D/g, '');
  const cleanTopPin = topCandidateId.replace(/\D/g, '');

  const hasValidDeclaredLocation = declaredPincode.length > 0;

  if (!hasValidDeclaredLocation) {
    addressConsistency = 'REVIEW';
    decisionReason = 'Declared location is missing or unverified; address consistency cannot be fully evaluated.';
  } else if (rankedCandidates.length === 0) {
    addressConsistency = 'REVIEW';
    decisionReason = `Declared location ${declaredPincode} cannot be evaluated: insufficient physical location evidence in graph.`;
  } else {
    const isExactPinMatch = cleanDeclaredPin.length === 6 && cleanTopPin.length === 6 && cleanDeclaredPin === cleanTopPin;
    const isDistrictMatch = cleanDeclaredPin.length >= 3 && cleanTopPin.length >= 3 && cleanDeclaredPin.slice(0, 3) === cleanTopPin.slice(0, 3);
    const isLabelPinMatch = cleanDeclaredPin.length >= 4 && topCandidateLabel.includes(cleanDeclaredPin);

    const declaredCandidateObj = rankedCandidates.find(c => c.location_id === declaredPincode || c.location_label.includes(cleanDeclaredPin));

    if (isExactPinMatch || isLabelPinMatch || (declaredCandidateObj && declaredCandidateObj.rank === 1 && topEvidenceShare >= 50)) {
      addressConsistency = 'CONSISTENT';
      decisionReason = `Declared location ${declaredPincode} is materially supported by ${topEvidenceShare}% of physical graph evidence.`;
    } else if (!isDistrictMatch && topCandidateObj && topEvidenceShare >= 40) {
      addressConsistency = 'CONFLICT';
      decisionReason = `Declared location ${declaredPincode} conflicts with primary physical evidence cluster (${topCandidateLabel}, ${topEvidenceShare}% evidence share).`;
    } else {
      addressConsistency = 'REVIEW';
      decisionReason = `Declared location ${declaredPincode} requires review: evidence is split or matches regional district level (${topCandidateLabel}, ${topEvidenceShare}% evidence share).`;
    }
  }

  // Decision Node
  const decisionNodeId = 'node_decision';
  nodes.push({
    id: decisionNodeId,
    type: 'DECISION',
    label: `Consistency: ${addressConsistency}`,
    value: hasValidDeclaredLocation ? topCandidateLabel : 'Unverified Declaration',
    category: 'Address Consistency Evaluation',
    provenance: 'Canonical Graph Resolver'
  });

  rankedCandidates.forEach(cand => {
    const candNodeId = `loc_${cand.location_id}`;
    if (nodes.some(n => n.id === candNodeId)) {
      edges.push({
        id: `e_${candNodeId}_${decisionNodeId}`,
        source: candNodeId,
        target: decisionNodeId,
        relationshipType: cand.rank === 1 ? 'SUPPORTS' : 'CONTRADICTS',
        baseReliability: 1.0,
        freshnessFactor: 1.0,
        trustModifier: 1.0,
        effectiveWeight: cand.evidenceShare / 100,
        reason: `Rank ${cand.rank} physical location hypothesis (${cand.evidenceShare}% evidence share)`
      });
    }
  });

  let totalSupportingCount = 0;
  let totalContradictionCount = 0;
  rankedCandidates.forEach(c => {
    totalSupportingCount += c.supportingSignalCount;
    totalContradictionCount += c.contradictionCount;
  });

  const canonicalGraph: CanonicalInvestigationGraph = {
    id: `graph_${Date.now()}`,
    case_label: caseLabel,
    seedInputs,
    nodes,
    edges,
    candidates: rankedCandidates,
    corroboratingEvidence,
    networkObservations,
    topCandidate: topCandidateId,
    declaredLocation: declaredPincode,
    addressConsistency,
    decisionReason,
    riskIndicators,
    totalSupportingCount,
    totalContradictionCount
  };

  // Backwards-compatible ExpectedOutputTrace
  const expected_output: ExpectedOutputTrace = {
    ranked: rankedCandidates.map(c => ({
      rank: c.rank,
      location: c.location_label,
      evidence_share: c.evidenceShare,
      note: c.contradictions.length > 0 ? c.contradictions.map(x => x.reason).join(', ') : undefined
    })),
    top_candidate: topCandidateId,
    declared: declaredPincode,
    address_consistency: addressConsistency,
    reason: decisionReason,
    risk_indicators: riskIndicators
  };

  return {
    case_label: caseLabel,
    input: seedInputs,
    fetchedFields,
    signals,
    expected_output,
    graph: canonicalGraph
  };
}

/**
 * Resolves a demo case through the Canonical Investigation Graph.
 */
export function computeOutputFromSignals(
  signals: GraphSignalTrace[],
  declaredPincode: string
): ExpectedOutputTrace {
  const dummyInput: InputState = {
    mobile_number: '9876543210',
    pan: 'DEMO1234A',
    aadhaar_number: '123456789012',
    email_id: 'user@demo.com',
    customer_key: 'CUST-DEMO',
    case_id: 'CASE-DEMO',
    declared_pincode: declaredPincode
  };

  const trace = resolveCanonicalGraph(dummyInput, [], signals, 'DEMO CASE');
  return trace.expected_output!;
}

/**
 * Custom Synthetic Trace Generator with Explicit Simulation Profiles (Phase 1.2).
 * Supported profiles:
 * - 'baseline' (default): Coherent clean trace matching applicant inputs.
 * - 'proxy_risk': Explicit proxy IP observation.
 * - 'physical_conflict': Explicit conflicting bureau address observation.
 */
export function resolveCustomTrace(
  input: InputState, 
  profile: 'baseline' | 'proxy_risk' | 'physical_conflict' = 'baseline'
): CurrentTrace {
  const pincode = (input.declared_pincode || '560001').trim();
  const pan = (input.pan || 'CUSTOM1234A').trim().toUpperCase();
  const mobile = (input.mobile_number || '9876543210').trim();
  const email = (input.email_id || 'user@example.com').trim().toLowerCase();
  const customer_key = input.customer_key || 'CUST-CUSTOM-01';
  const case_id = input.case_id || 'CASE-CUSTOM-01';
  const aadhaar = input.aadhaar_number || '123456789012';

  // Coherent City and Region Mapping from Pincode Prefix
  let cityName = `Location ${pincode}`;
  let regionName = `Karnataka (region)`;

  const pPrefix = pincode.slice(0, 3);
  if (pPrefix === '560') { cityName = `Bengaluru ${pincode}`; regionName = `Karnataka (region)`; }
  else if (pPrefix === '110') { cityName = `Delhi ${pincode}`; regionName = `Delhi (region)`; }
  else if (pPrefix === '400') { cityName = `Mumbai ${pincode}`; regionName = `Maharashtra (region)`; }
  else if (pPrefix === '500') { cityName = `Hyderabad ${pincode}`; regionName = `Andhra Pradesh / Telangana (region)`; }
  else if (pPrefix === '600') { cityName = `Chennai ${pincode}`; regionName = `Tamil Nadu (region)`; }
  else if (pPrefix === '700') { cityName = `Kolkata ${pincode}`; regionName = `West Bengal (region)`; }
  else if (pPrefix === '411') { cityName = `Pune ${pincode}`; regionName = `Maharashtra (region)`; }
  else if (pPrefix === '515') { cityName = `Anantapur ${pincode}`; regionName = `Andhra Pradesh / Telangana (region)`; }
  else { cityName = `Area ${pincode}`; regionName = `Region (${pPrefix})`; }

  // Simulation Profile Conditions
  const isProxyScenario = (profile === 'proxy_risk');
  const isConflictScenario = (profile === 'physical_conflict');

  const conflictPincode = '515001';
  const conflictCityName = 'Anantapur 515001 (AP)';

  const todayStr = new Date().toISOString().split('T')[0];

  const fetchedFields: FetchedFieldTrace[] = [
    {
      data_field: 'declared_pincode',
      value: pincode,
      source_api: 'Pincode Directory (Simulated)',
      resolves_to: cityName,
      freshness_date: todayStr
    },
    {
      data_field: 'bureau_address_history',
      value: isConflictScenario ? `${conflictPincode} (active)` : `${pincode} (active)`,
      source_api: 'Credit Bureau Service (Simulated)',
      resolves_to: isConflictScenario ? conflictCityName : cityName,
      freshness_date: todayStr
    },
    {
      data_field: 'branch_ifsc',
      value: `IFSC${pincode.slice(0, 4)}`,
      source_api: 'Bank Branch IFSC Lookup (Simulated)',
      resolves_to: cityName,
      freshness_date: todayStr
    },
    {
      data_field: 'public_ip',
      value: isProxyScenario ? '185.220.101.5' : '103.21.244.1',
      source_api: 'IP Geolocation Service (Simulated)',
      resolves_to: isProxyScenario ? 'Frankfurt, Germany (Proxy Detected)' : cityName,
      proxy: isProxyScenario,
      freshness_date: todayStr
    },
    {
      data_field: 'mobile_number',
      value: mobile,
      source_api: 'Telecom Number Series Database (Simulated)',
      resolves_to: regionName,
      freshness_date: 'original-issue'
    }
  ];

  const signals: GraphSignalTrace[] = [
    {
      signal: 'Bureau current address',
      location_id: isConflictScenario ? conflictPincode : pincode,
      location_label: isConflictScenario ? conflictCityName : cityName,
      base_weight: 0.9,
      recency_factor: 1.0,
      ip_trust_factor: 1.0,
      source_api: 'Credit Bureau Service (Simulated)',
      evidence: isConflictScenario ? `Bureau records indicate active address in ${conflictCityName}.` : `Bureau records verify current active address in ${cityName}.`
    },
    {
      signal: 'Branch IFSC location',
      location_id: pincode,
      location_label: cityName,
      base_weight: 0.8,
      recency_factor: 0.85,
      ip_trust_factor: 1.0,
      source_api: 'Bank Branch IFSC Lookup (Simulated)',
      evidence: `Account primary branch IFSC maps to ${cityName}.`
    },
    {
      signal: 'IP geolocation',
      location_id: isProxyScenario ? 'frankfurt' : pincode,
      location_label: isProxyScenario ? 'Frankfurt, DE (proxy)' : cityName,
      base_weight: 0.6,
      recency_factor: 1.0,
      ip_trust_factor: isProxyScenario ? 0.1 : 1.0,
      source_api: 'IP Geolocation Service (Simulated)',
      evidence: isProxyScenario ? 'Session IP identified as hosting/VPN proxy server in Frankfurt.' : `Active session IP matches ${cityName}.`
    },
    {
      signal: 'Telecom circle',
      location_id: regionName.toLowerCase().replace(/[^a-z0-9]/g, '_'),
      location_label: regionName,
      base_weight: 0.4,
      recency_factor: 0.7,
      ip_trust_factor: 1.0,
      source_api: 'Telecom Number Series Database (Simulated)',
      evidence: `Mobile number series registered in ${regionName}.`
    }
  ];

  const sanitizedInput: InputState = {
    mobile_number: mobile,
    pan,
    aadhaar_number: aadhaar,
    email_id: email,
    customer_key,
    case_id,
    declared_pincode: pincode
  };

  return resolveCanonicalGraph(sanitizedInput, fetchedFields, signals, `CUSTOM TRACE (${profile.toUpperCase()})`);
}
