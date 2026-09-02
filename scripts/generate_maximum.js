/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const fields = require('../src/data/data_fetched_data_fields.json');

const maxTrace = {
    case_label: "MAXIMUM",
    summary: "A sprawling real-world forensic scenario involving heavy cross-referencing: a sophisticated identity theft operation where the user registered an account in Mumbai, logged in via multiple foreign proxies, used a ported mobile number registered in Delhi, provided a PAN linked to Kolkata, and conducted UPI transactions at a merchant mapped to Pune. The system stitches 20+ distinct API calls to map this complex web and pinpoint the truth.",
    identifiers: {
      mobile_number: "9811122233",
      pan: "BXXXX9999Y",
      aadhaar_number: "999988887777",
      email_id: "scammer.xyz@proton.me",
      customer_key: "CUST-HV-1029",
      case_id: "CASE-FRAUD-RING-7"
    },
    fetched_fields: [],
    signals: []
};

// Add fetched fields mapping correctly to real APIs
// Let's pick a diverse set of fields
const selectedFields = [
  "public_ip", "mobile_number", "bureau_address_history", "branch_ifsc", "declared_pincode", "declared_city", "declared_state",
  "full_address_text", "upi_merchant_or_vpa_metadata", "cash_deposit_branch", "cell_mcc_mnc_lac_cellid", "wifi_bssid_hashes",
  "device_timezone", "user_agent"
];

const mockValues = {
  "public_ip": "143.244.50.12 (DigitalOcean)",
  "mobile_number": "9811122233",
  "bureau_address_history": "700001 (Kolkata), 411001 (Pune)",
  "branch_ifsc": "HDFC0000001",
  "declared_pincode": "400001",
  "declared_city": "Mumbai",
  "declared_state": "Maharashtra",
  "full_address_text": "Flat 4B, Sea View Apts, Colaba",
  "upi_merchant_or_vpa_metadata": "Pune Merchant (VPA: merchant@okaxis)",
  "cash_deposit_branch": "HDFC Pune Camp Branch",
  "cell_mcc_mnc_lac_cellid": "MCC:404 MNC:11 LAC:450 Cell:892",
  "wifi_bssid_hashes": "00:14:22:01:23:45",
  "device_timezone": "Asia/Kolkata",
  "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
};

const mockResolvesTo = {
  "public_ip": "Singapore",
  "mobile_number": "Delhi circle",
  "bureau_address_history": "Kolkata (WB) & Pune (MH)",
  "branch_ifsc": "Mumbai (MH)",
  "declared_pincode": "Mumbai (MH)",
  "declared_city": "Mumbai (MH)",
  "declared_state": "Mumbai (MH)",
  "full_address_text": "Mumbai (MH)",
  "upi_merchant_or_vpa_metadata": "Pune (MH)",
  "cash_deposit_branch": "Pune (MH)",
  "cell_mcc_mnc_lac_cellid": "Pune (MH)",
  "wifi_bssid_hashes": "Pune (MH)",
  "device_timezone": "India",
  "user_agent": "Desktop"
};

const locations = {
  "mumbai": { id: "400001", label: "Mumbai 400001 (Declared)" },
  "pune": { id: "411001", label: "Pune 411001 (Actual Operation)" },
  "kolkata": { id: "700001", label: "Kolkata 700001 (Bureau History)" },
  "delhi": { id: "110001", label: "Delhi (Mobile Origin)" },
  "singapore": { id: "singapore", label: "Singapore (VPN Exit)" }
};

fields.forEach(f => {
  if (selectedFields.includes(f.data_field)) {
    const val = mockValues[f.data_field] || "Unknown";
    const res = mockResolvesTo[f.data_field] || "Unknown";
    const isProxy = f.data_field === 'public_ip';
    maxTrace.fetched_fields.push({
      data_field: f.data_field,
      value: val,
      source_api: f.source_api,
      resolves_to: res,
      freshness_date: "2026-06-15",
      ...(isProxy ? { proxy: true } : {})
    });
  }
});

// Signals
const signalsData = [
  { signal: "IP geolocation", loc: "singapore", api: "ip-api.com JSON endpoint", w: 0.9, r: 1, ipt: 0.1, ev: "IP matches datacenter block; heavily penalized." },
  { signal: "Telecom circle", loc: "delhi", api: "Python phonenumbers library", w: 0.3, r: 0.5, ipt: 1, ev: "Number originated in Delhi." },
  { signal: "Bureau current address", loc: "kolkata", api: "Credit bureaus: CIBIL / Experian / Equifax / CRIF", w: 0.8, r: 0.7, ipt: 1, ev: "Registered PAN address in Kolkata." },
  { signal: "Bureau previous address", loc: "pune", api: "Credit bureaus: CIBIL / Experian / Equifax / CRIF", w: 0.7, r: 0.8, ipt: 1, ev: "Recent credit pull originated in Pune." },
  { signal: "Branch IFSC location", loc: "mumbai", api: "Razorpay IFSC API", w: 0.5, r: 0.6, ipt: 1, ev: "Account opened in Mumbai." },
  { signal: "UPI Merchant / VPA Location", loc: "pune", api: "NPCI / Bank UPI Switch (via aggregator)", w: 0.9, r: 1, ipt: 1, ev: "Live high-frequency transactions at a Pune merchant." },
  { signal: "Cash deposit branch", loc: "pune", api: "Core Banking System (CBS) / LMS", w: 0.85, r: 0.9, ipt: 1, ev: "Physical cash deposits made at Pune branch." },
  { signal: "Cell Tower (MCC/MNC/LAC/CellID)", loc: "pune", api: "Unwired Labs / OpenCelliD", w: 0.95, r: 1, ipt: 1, ev: "Cell tower triangulates to Pune." },
  { signal: "Wi-Fi BSSID geolocation", loc: "pune", api: "Google / Mozilla Geolocation API", w: 0.95, r: 1, ipt: 1, ev: "Wi-Fi scan matches Pune router MACs." }
];

signalsData.forEach(s => {
  maxTrace.signals.push({
    signal: s.signal,
    location_id: locations[s.loc].id,
    location_label: locations[s.loc].label,
    base_weight: s.w,
    recency_factor: s.r,
    ip_trust_factor: s.ipt,
    source_api: s.api,
    evidence: s.ev
  });
});

maxTrace.expected_output = {
  ranked: [
    { rank: 1, location: "Pune 411001 (Actual Operation)", confidence: 72 },
    { rank: 2, location: "Kolkata 700001 (Bureau History)", confidence: 15 },
    { rank: 3, location: "Mumbai 400001 (Declared)", confidence: 8 },
    { rank: 4, location: "Delhi (Mobile Origin)", confidence: 4 },
    { rank: 5, location: "Singapore (VPN Exit)", confidence: 1, note: "proxy - discarded" }
  ],
  top_candidate: "411001",
  declared: "400001",
  truth_flag: "RED",
  reason: "Severe mismatch. Declared Mumbai, but live behavioral evidence (UPI, Cash Deposits, Cell Towers, Wi-Fi) overwhelmingly points to Pune, while routing through a Singapore VPN. High-risk fraud ring."
};

fs.writeFileSync('generated_max.json', JSON.stringify(maxTrace, null, 2));
console.log("Done");
