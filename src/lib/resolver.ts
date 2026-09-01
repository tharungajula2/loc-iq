import { GraphSignalTrace, ExpectedOutputTrace, FetchedFieldTrace, CurrentTrace, InputState } from '../types';

/**
 * Computes candidate location confidence scores and truth flags dynamically
 * from resolved graph signals' effective weights: base_weight * recency_factor * ip_trust_factor.
 */
export function computeOutputFromSignals(
  signals: GraphSignalTrace[],
  declaredPincode: string
): ExpectedOutputTrace {
  const declared = (declaredPincode || '').trim();

  const locationMap = new Map<string, {
    location: string;
    location_id: string;
    totalWeight: number;
    notes: string[];
  }>();

  let totalGraphWeight = 0;
  let hasProxyRisk = false;

  signals.forEach(s => {
    const effWeight = s.base_weight * s.recency_factor * s.ip_trust_factor;
    totalGraphWeight += effWeight;

    if (s.ip_trust_factor < 1.0) {
      hasProxyRisk = true;
    }

    const key = s.location_id || s.location_label;
    if (!locationMap.has(key)) {
      locationMap.set(key, {
        location: s.location_label,
        location_id: s.location_id,
        totalWeight: 0,
        notes: []
      });
    }

    const locEntry = locationMap.get(key)!;
    locEntry.totalWeight += effWeight;
    if (s.ip_trust_factor < 1.0) {
      locEntry.notes.push('Proxy IP Penalty (trust factor 0.1)');
    }
  });

  const rankedLocations = Array.from(locationMap.values()).map(loc => {
    const rawConfidence = totalGraphWeight > 0 ? (loc.totalWeight / totalGraphWeight) * 100 : 0;
    const confidence = Math.round(rawConfidence);
    return {
      location: loc.location,
      location_id: loc.location_id,
      totalWeight: loc.totalWeight,
      confidence,
      note: loc.notes.length > 0 ? loc.notes.join(', ') : undefined
    };
  });

  rankedLocations.sort((a, b) => b.totalWeight - a.totalWeight);

  const ranked = rankedLocations.map((loc, idx) => ({
    rank: idx + 1,
    location: loc.location,
    confidence: loc.confidence,
    note: loc.note
  }));

  const topLoc = rankedLocations[0];
  const top_candidate = topLoc ? topLoc.location_id : declared;
  const topCandidateLabel = topLoc ? topLoc.location : declared;

  let truth_flag: 'GREEN' | 'AMBER' | 'RED' = 'RED';
  let reason = '';

  const cleanDeclared = declared.replace(/\D/g, '');
  const cleanTopPin = top_candidate.replace(/\D/g, '');

  const isExactPinMatch = cleanDeclared.length === 6 && cleanTopPin.length === 6 && cleanDeclared === cleanTopPin;
  const isRegionMatch = cleanDeclared.length >= 3 && cleanTopPin.length >= 3 && cleanDeclared.slice(0, 3) === cleanTopPin.slice(0, 3);

  if (hasProxyRisk) {
    truth_flag = 'RED';
    reason = `Proxy/VPN connection risk detected (IP trust penalty applied). Declared PIN ${declared} differs from physical evidence cluster (${topCandidateLabel}).`;
  } else if (isExactPinMatch || (cleanDeclared && topCandidateLabel.includes(cleanDeclared))) {
    truth_flag = 'GREEN';
    reason = `Declared PIN ${declared} matches top network trace evidence (${topCandidateLabel}) with ${topLoc?.confidence || 0}% graph confidence.`;
  } else if (isRegionMatch) {
    truth_flag = 'AMBER';
    reason = `Declared PIN ${declared} is in the same district/region as top network trace (${topCandidateLabel}), but exact pincode differs.`;
  } else {
    truth_flag = 'RED';
    reason = `Declared PIN ${declared} conflicts with primary network trace evidence (${topCandidateLabel}).`;
  }

  return {
    ranked,
    top_candidate,
    declared,
    truth_flag,
    reason
  };
}

/**
 * Resolves an arbitrary custom input into a full CurrentTrace with dynamically
 * calculated fields, graph signals, and runtime-resolved confidence scores.
 */
export function resolveCustomTrace(input: InputState): CurrentTrace {
  const pincode = input.declared_pincode.trim() || '560001';
  const pan = (input.pan || 'CUSTOM1234').toUpperCase();
  const mobile = input.mobile_number || '9876543210';
  const email = input.email_id || 'user@example.com';
  const customer_key = input.customer_key || 'CUST-CUSTOM-01';
  const case_id = input.case_id || 'CASE-2026-CUSTOM';

  let cityName = `Location ${pincode}`;
  const pPrefix = pincode.slice(0, 3);
  if (pPrefix === '560') cityName = `Bengaluru ${pincode}`;
  else if (pPrefix === '110') cityName = `Delhi ${pincode}`;
  else if (pPrefix === '400') cityName = `Mumbai ${pincode}`;
  else if (pPrefix === '500') cityName = `Hyderabad ${pincode}`;
  else if (pPrefix === '600') cityName = `Chennai ${pincode}`;
  else if (pPrefix === '700') cityName = `Kolkata ${pincode}`;
  else if (pPrefix === '411') cityName = `Pune ${pincode}`;
  else if (pPrefix === '515') cityName = `Anantapur ${pincode}`;
  else cityName = `Area ${pincode}`;

  const isProxy = email.includes('anon') || email.includes('vpn') || email.includes('proxy') || pan.includes('FRAUD') || pan.includes('VPN');

  let telecomCircle = 'Karnataka (region)';
  if (mobile.startsWith('984') || mobile.startsWith('944') || mobile.startsWith('701')) telecomCircle = 'Andhra Pradesh / Telangana (region)';
  else if (mobile.startsWith('981') || mobile.startsWith('991') || mobile.startsWith('987')) telecomCircle = 'Delhi (region)';
  else if (mobile.startsWith('982') || mobile.startsWith('992') || mobile.startsWith('882')) telecomCircle = 'Maharashtra (region)';
  else if (mobile.startsWith('988') || mobile.startsWith('998')) telecomCircle = 'Karnataka (region)';
  else telecomCircle = `Telecom Region (${mobile.slice(0, 4) || 'Unknown'})`;

  const fetchedFields: FetchedFieldTrace[] = [
    {
      data_field: 'declared_pincode',
      value: pincode,
      source_api: 'Data.gov.in Pincode Directory',
      resolves_to: cityName,
      freshness_date: new Date().toISOString().split('T')[0]
    },
    {
      data_field: 'bureau_address_history',
      value: `${pincode} (current)`,
      source_api: 'Credit bureaus: CIBIL / Experian / Equifax / CRIF',
      resolves_to: cityName,
      freshness_date: new Date().toISOString().split('T')[0]
    },
    {
      data_field: 'branch_ifsc',
      value: 'HDFC0000001',
      source_api: 'Razorpay IFSC API',
      resolves_to: cityName,
      freshness_date: new Date().toISOString().split('T')[0]
    },
    {
      data_field: 'public_ip',
      value: isProxy ? '185.220.101.5' : '103.21.244.1',
      source_api: 'ip-api.com JSON endpoint',
      resolves_to: isProxy ? 'Frankfurt, Germany (Proxy Detected)' : cityName,
      proxy: isProxy,
      freshness_date: new Date().toISOString().split('T')[0]
    },
    {
      data_field: 'mobile_number',
      value: mobile,
      source_api: 'Python phonenumbers library',
      resolves_to: telecomCircle,
      freshness_date: 'original-issue'
    }
  ];

  const signals: GraphSignalTrace[] = [
    {
      signal: 'Bureau current address',
      location_id: pincode,
      location_label: cityName,
      base_weight: 0.9,
      recency_factor: 1.0,
      ip_trust_factor: 1.0,
      source_api: 'Credit bureaus',
      evidence: `Bureau lists active address record in ${cityName}.`
    },
    {
      signal: 'Branch IFSC location',
      location_id: pincode,
      location_label: cityName,
      base_weight: 0.8,
      recency_factor: 0.85,
      ip_trust_factor: 1.0,
      source_api: 'Razorpay IFSC API',
      evidence: `Account home branch resolves to ${cityName}.`
    },
    {
      signal: 'IP geolocation',
      location_id: isProxy ? '60306' : pincode,
      location_label: isProxy ? 'Frankfurt 60306' : cityName,
      base_weight: 0.6,
      recency_factor: 1.0,
      ip_trust_factor: isProxy ? 0.1 : 1.0,
      source_api: 'ip-api.com',
      evidence: isProxy ? 'IP identified as VPN/Hosting proxy.' : `Active session IP matches ${cityName}.`
    },
    {
      signal: 'Telecom circle',
      location_id: telecomCircle.toLowerCase().replace(/[^a-z0-9]/g, '_'),
      location_label: telecomCircle,
      base_weight: 0.4,
      recency_factor: 0.7,
      ip_trust_factor: 1.0,
      source_api: 'phonenumbers',
      evidence: `Mobile series registered in ${telecomCircle}.`
    }
  ];

  const expected_output = computeOutputFromSignals(signals, pincode);

  return {
    case_label: 'CUSTOM TRACE',
    input: {
      mobile_number: mobile,
      pan,
      aadhaar_number: input.aadhaar_number || '123456789012',
      email_id: email,
      customer_key,
      case_id,
      declared_pincode: pincode
    },
    fetchedFields,
    signals,
    expected_output
  };
}
