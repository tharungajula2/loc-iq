import { 
  SyntheticEntityNetworkGraph, 
  EntityNetworkNode, 
  EntityNetworkEdge 
} from "../types";

/**
 * LOC-IQ PHASE 2.4 — DETERMINISTIC SYNTHETIC ENTITY NETWORK DATASET
 * 
 * Research-backed multi-case synthetic graph modeling 16 synthetic customers,
 * 22 applications/cases, devices, IPs, addresses, operational locations, branches,
 * merchants, and behavioural events across 8 explicit structural patterns.
 */

export const syntheticNetworkNodes: EntityNetworkNode[] = [
  // =========================================================================
  // 1. PERSON / CUSTOMER NODES (16)
  // =========================================================================
  { id: "cust:aarav_sharma", type: "PERSON", label: "Aarav Sharma", category: "Synthetic Applicant", kgConceptId: "id:pan", metadata: { customerKey: "CUST-BLR-01", householdId: "HOUSEHOLD_BLR_01" } },
  { id: "cust:ananya_sharma", type: "PERSON", label: "Ananya Sharma", category: "Synthetic Applicant", kgConceptId: "id:pan", metadata: { customerKey: "CUST-BLR-02", householdId: "HOUSEHOLD_BLR_01" } },
  
  { id: "cust:ramesh_kumar", type: "PERSON", label: "Ramesh Kumar", category: "Synthetic Applicant", kgConceptId: "id:pan", metadata: { customerKey: "CUST-DEV-03" } },
  { id: "cust:suresh_patel", type: "PERSON", label: "Suresh Patel", category: "Synthetic Applicant", kgConceptId: "id:pan", metadata: { customerKey: "CUST-DEV-04" } },
  { id: "cust:vikram_singh", type: "PERSON", label: "Vikram Singh", category: "Synthetic Applicant", kgConceptId: "id:pan", metadata: { customerKey: "CUST-DEV-05" } },
  { id: "cust:dinesh_verma", type: "PERSON", label: "Dinesh Verma", category: "Synthetic Applicant", kgConceptId: "id:pan", metadata: { customerKey: "CUST-DEV-06" } },

  { id: "cust:kavita_reddy", type: "PERSON", label: "Kavita Reddy", category: "Synthetic Applicant", kgConceptId: "id:mobile_number", metadata: { customerKey: "CUST-REUSE-07" } },
  { id: "cust:rajesh_reddy", type: "PERSON", label: "Rajesh Reddy", category: "Synthetic Applicant", kgConceptId: "id:mobile_number", metadata: { customerKey: "CUST-REUSE-08" } },

  { id: "cust:vijay_kumar", type: "PERSON", label: "Vijay Kumar", category: "Synthetic Applicant", kgConceptId: "id:email_id", metadata: { customerKey: "CUST-PROXY-09" } },
  { id: "cust:pooja_gupta", type: "PERSON", label: "Pooja Gupta", category: "Synthetic Applicant", kgConceptId: "id:email_id", metadata: { customerKey: "CUST-PROXY-10" } },
  { id: "cust:amit_shah", type: "PERSON", label: "Amit Shah", category: "Synthetic Applicant", kgConceptId: "id:email_id", metadata: { customerKey: "CUST-PROXY-11" } },
  { id: "cust:sunil_mehta", type: "PERSON", label: "Sunil Mehta", category: "Synthetic Applicant", kgConceptId: "id:email_id", metadata: { customerKey: "CUST-PROXY-12" } },

  { id: "cust:neha_joshi", type: "PERSON", label: "Neha Joshi", category: "Synthetic Applicant", kgConceptId: "id:pan", metadata: { customerKey: "CUST-ADDR-13" } },
  { id: "cust:deepak_malhotra", type: "PERSON", label: "Deepak Malhotra", category: "Synthetic Applicant", kgConceptId: "id:pan", metadata: { customerKey: "CUST-ADDR-14" } },

  { id: "cust:alok_mishra", type: "PERSON", label: "Alok Mishra", category: "Synthetic Applicant", kgConceptId: "id:pan", metadata: { customerKey: "CUST-GEO-18" } },
  { id: "cust:priya_nair", type: "PERSON", label: "Priya Nair", category: "Synthetic Applicant", kgConceptId: "id:pan", caseId: "CASE-DEL-99", metadata: { customerKey: "CUST-DEL-99" } },

  // =========================================================================
  // 2. APPLICATION / CASE NODES (22)
  // =========================================================================
  { id: "case:app_01", type: "APPLICATION", label: "CASE-BLR-01 (Aarav)", category: "Synthetic Loan Case", caseId: "CASE-BLR-01" },
  { id: "case:app_02", type: "APPLICATION", label: "CASE-BLR-02 (Ananya)", category: "Synthetic Loan Case" },
  { id: "case:app_03", type: "APPLICATION", label: "CASE-DEV-03 (Ramesh)", category: "Synthetic Loan Case" },
  { id: "case:app_04", type: "APPLICATION", label: "CASE-DEV-04 (Suresh)", category: "Synthetic Loan Case" },
  { id: "case:app_05", type: "APPLICATION", label: "CASE-DEV-05 (Vikram)", category: "Synthetic Loan Case" },
  { id: "case:app_06", type: "APPLICATION", label: "CASE-DEV-06 (Dinesh)", category: "Synthetic Loan Case" },
  { id: "case:app_07", type: "APPLICATION", label: "CASE-REUSE-07 (Kavita)", category: "Synthetic Loan Case" },
  { id: "case:app_08", type: "APPLICATION", label: "CASE-REUSE-08 (Rajesh)", category: "Synthetic Loan Case" },
  { id: "case:app_09", type: "APPLICATION", label: "CASE-PROXY-09 (Vijay)", category: "Synthetic Loan Case" },
  { id: "case:app_10", type: "APPLICATION", label: "CASE-PROXY-10 (Pooja)", category: "Synthetic Loan Case" },
  { id: "case:app_11", type: "APPLICATION", label: "CASE-PROXY-11 (Amit)", category: "Synthetic Loan Case" },
  { id: "case:app_12", type: "APPLICATION", label: "CASE-PROXY-12 (Sunil)", category: "Synthetic Loan Case" },
  { id: "case:app_13", type: "APPLICATION", label: "CASE-ADDR-13 (Neha)", category: "Synthetic Loan Case" },
  { id: "case:app_14", type: "APPLICATION", label: "CASE-ADDR-14 (Deepak)", category: "Synthetic Loan Case" },
  { id: "case:app_15", type: "APPLICATION", label: "CASE-ADDR-15 (Manoj)", category: "Synthetic Loan Case" },
  { id: "case:app_16", type: "APPLICATION", label: "CASE-ADDR-16 (Sanjay)", category: "Synthetic Loan Case" },
  { id: "case:app_17", type: "APPLICATION", label: "CASE-ADDR-17 (Pankaj)", category: "Synthetic Loan Case" },
  { id: "case:app_18", type: "APPLICATION", label: "CASE-GEO-18 (Alok)", category: "Synthetic Loan Case" },
  { id: "case:app_19", type: "APPLICATION", label: "CASE-GEO-19 (Rohan)", category: "Synthetic Loan Case" },
  { id: "case:app_20", type: "APPLICATION", label: "CASE-DEL-99 (Priya Fraud)", category: "Synthetic Loan Case", caseId: "CASE-DEL-99" },
  { id: "case:app_clean_baseline", type: "APPLICATION", label: "CASE-CLEAN-BASE (John Baseline)", category: "Synthetic Loan Case", caseId: "CASE-BLR-01" },
  { id: "case:app_maximum_trace", type: "APPLICATION", label: "CASE-MAX-01 (Pune Maximum)", category: "Synthetic Loan Case", caseId: "CASE-MAX-01" },

  // =========================================================================
  // 3. DEVICE & SESSION NODES (8)
  // =========================================================================
  { id: "dev:household_tab_01", type: "DEVICE", label: "Device DEV_SYN_01 (Aarav Tab)", category: "Tablet Device", kgConceptId: "field:app_instance_id" },
  { id: "dev:mobile_ananya_02", type: "DEVICE", label: "Device DEV_SYN_02 (Ananya Phone)", category: "Mobile Phone", kgConceptId: "field:app_instance_id" },
  { id: "dev:shared_rig_04", type: "DEVICE", label: "Device DEV_SYN_04 (Shared Phone)", category: "Shared Mobile Phone", kgConceptId: "field:app_instance_id", metadata: { deviceHash: "a8f9c2d1e03b" } },
  { id: "dev:mobile_kavita_07", type: "DEVICE", label: "Device DEV_SYN_07", category: "Mobile Phone", kgConceptId: "field:app_instance_id" },
  { id: "dev:mobile_vijay_09", type: "DEVICE", label: "Device DEV_SYN_09", category: "Mobile Phone", kgConceptId: "field:app_instance_id" },
  { id: "dev:mobile_priya_20", type: "DEVICE", label: "Device DEV_SYN_20", category: "Mobile Phone", kgConceptId: "field:app_instance_id" },
  
  { id: "app_inst:inst_04_shared", type: "APP_INSTANCE", label: "AppInstance INST-SYN-04", category: "Mobile App Instance", kgConceptId: "field:app_instance_id" },
  { id: "session:sess_priya_20", type: "SESSION", label: "Session SESS-DEL-99", category: "Web Session", kgConceptId: "field:session_id_hash" },

  // =========================================================================
  // 4. NETWORK ENDPOINT NODES (5)
  // =========================================================================
  { id: "ip:airtel_broadband_blr_01", type: "NETWORK_ENDPOINT", label: "IP 122.171.1.10 (Residential Airtel BLR)", category: "Residential ISP", kgConceptId: "field:public_ip" },
  { id: "ip:proxy_frankfurt_01", type: "NETWORK_ENDPOINT", label: "IP 185.220.101.5 (Frankfurt VPN Proxy)", category: "VPN Proxy Exit", kgConceptId: "sig:proxy_risk_flag", metadata: { isProxy: true } },
  { id: "ip:jio_mobile_delhi_02", type: "NETWORK_ENDPOINT", label: "IP 49.36.1.20 (Jio Mobile Delhi)", category: "Cellular IP", kgConceptId: "field:public_ip" },
  { id: "ip:bsnl_mumbai_03", type: "NETWORK_ENDPOINT", label: "IP 117.201.2.30 (BSNL Mumbai)", category: "Broadband IP", kgConceptId: "field:public_ip" },
  { id: "ip:singapore_vpn_04", type: "NETWORK_ENDPOINT", label: "IP 103.28.52.1 (Singapore Proxy)", category: "VPN Proxy Exit", kgConceptId: "sig:proxy_risk_flag", metadata: { isProxy: true } },

  // =========================================================================
  // 5. ADDRESS & PHYSICAL LOCATION NODES (10)
  // =========================================================================
  { id: "addr:indiranagar_blr_560001", type: "ADDRESS", label: "Indiranagar, Bengaluru 560001", category: "Residential Address", kgConceptId: "field:declared_pincode" },
  { id: "addr:fort_mumbai_400001", type: "ADDRESS", label: "Fort, Mumbai 400001 (Commercial)", category: "Commercial Address", kgConceptId: "field:declared_pincode" },
  { id: "addr:connaught_delhi_110001", type: "ADDRESS", label: "Connaught Place, New Delhi 110001", category: "Declared Geography", kgConceptId: "field:declared_pincode" },
  { id: "addr:koramangala_blr_560034", type: "ADDRESS", label: "Koramangala, Bengaluru 560034", category: "Residential Address", kgConceptId: "field:declared_pincode" },
  { id: "addr:jaipur_302001", type: "ADDRESS", label: "MI Road, Jaipur 302001", category: "Declared Geography", kgConceptId: "field:declared_pincode" },

  { id: "loc:anantapur_hub_515001", type: "LOCATION", label: "Anantapur Physical Hub (515001)", category: "Observed Physical Locality", kgConceptId: "sig:cell_tower_lac_cid", metadata: { state: "Andhra Pradesh" } },
  { id: "loc:bengaluru_cbd_560001", type: "LOCATION", label: "Bengaluru CBD Locality (560001)", category: "Observed Physical Locality", kgConceptId: "field:bureau_address_history" },
  { id: "loc:mumbai_fort_400001", type: "LOCATION", label: "Mumbai Fort Locality (400001)", category: "Observed Physical Locality", kgConceptId: "field:bureau_address_history" },
  { id: "loc:delhi_cp_110001", type: "LOCATION", label: "Delhi CP Locality (110001)", category: "Observed Physical Locality", kgConceptId: "field:bureau_address_history" },

  // =========================================================================
  // 6. BRANCH, MERCHANT & EVENT NODES (11)
  // =========================================================================
  { id: "branch:hdfc_indiranagar_01", type: "BRANCH", label: "HDFC Bank Indiranagar Branch", category: "Bank Branch", kgConceptId: "field:branch_ifsc" },
  { id: "branch:icici_fort_mumbai_02", type: "BRANCH", label: "ICICI Bank Fort Mumbai Branch", category: "Bank Branch", kgConceptId: "field:branch_ifsc" },
  { id: "branch:sbi_anantapur_03", type: "BRANCH", label: "SBI Anantapur Main Branch", category: "Bank Branch", kgConceptId: "field:branch_ifsc" },

  { id: "merchant:vpa_anantapur_electronics", type: "MERCHANT", label: "VPA: anantapur.elec@okicici", category: "UPI Merchant VPA", kgConceptId: "field:upi_merchant_metadata" },
  { id: "merchant:vpa_swiggy_blr", type: "MERCHANT", label: "VPA: swiggy@bank", category: "UPI Merchant VPA", kgConceptId: "field:upi_merchant_metadata" },
  { id: "merchant:vpa_flipkart_mumbai", type: "MERCHANT", label: "VPA: flipkart@paytm", category: "UPI Merchant VPA", kgConceptId: "field:upi_merchant_metadata" },
  { id: "merchant:pos_retail_delhi", type: "MERCHANT", label: "POS: Retail DEL-9912", category: "POS Terminal", kgConceptId: "field:pos_terminal_id" },

  { id: "event:atm_withdrawal_anantapur_01", type: "BEHAVIOURAL_EVENT", label: "ATM Cash Withdrawal (Anantapur SBI)", category: "Bank Transaction Event", kgConceptId: "field:atm_transaction_location" },
  { id: "event:pos_tx_anantapur_02", type: "BEHAVIOURAL_EVENT", label: "POS Transaction (Anantapur Retail)", category: "POS Event", kgConceptId: "field:pos_merchant_location" },
  { id: "event:field_visit_mumbai_03", type: "BEHAVIOURAL_EVENT", label: "Field Collection Visit (Mumbai CODE-04)", category: "Verification Event", kgConceptId: "field:field_visit_outcome_code" },
  { id: "event:mail_returned_delhi_04", type: "BEHAVIOURAL_EVENT", label: "Returned Mail Event (Delhi PIN 110001)", category: "Courier Event", kgConceptId: "field:returned_mail_pincode" },

  // =========================================================================
  // 7. IDENTIFIER VALUE NODES (8)
  // =========================================================================
  { id: "id_val:pan_aarav", type: "IDENTIFIER_VAL", label: "PAN: ABCDE1234F", category: "Permanent Account Number", kgConceptId: "id:pan" },
  { id: "id_val:pan_ananya", type: "IDENTIFIER_VAL", label: "PAN: XYZPS9876Q", category: "Permanent Account Number", kgConceptId: "id:pan" },
  { id: "id_val:pan_ramesh", type: "IDENTIFIER_VAL", label: "PAN: RPRPK1122M", category: "Permanent Account Number", kgConceptId: "id:pan" },
  { id: "id_val:pan_kavita", type: "IDENTIFIER_VAL", label: "PAN: KVKVR3344P", category: "Permanent Account Number", kgConceptId: "id:pan" },
  { id: "id_val:pan_priya", type: "IDENTIFIER_VAL", label: "PAN: PRYNR5566K", category: "Permanent Account Number", kgConceptId: "id:pan" },
  { id: "id_val:mob_shared_9845099999", type: "IDENTIFIER_VAL", label: "Mobile: +91 9845099999", category: "Mobile Number", kgConceptId: "id:mobile_number" },
  { id: "id_val:email_shared_family", type: "IDENTIFIER_VAL", label: "Email: family.reddy@gmail.com", category: "Email Address", kgConceptId: "id:email_id" },
  { id: "id_val:aadhaar_aarav", type: "IDENTIFIER_VAL", label: "Aadhaar: 1234 5678 9012", category: "Aadhaar Number", kgConceptId: "id:aadhaar_number" }
];

export const syntheticNetworkEdges: EntityNetworkEdge[] = [
  // =========================================================================
  // PATTERN A: BENIGN HOUSEHOLD OVERLAP (Aarav & Ananya)
  // =========================================================================
  { id: "e:cust1_app1", source: "cust:aarav_sharma", target: "case:app_01", relationshipType: "HAS_APPLICATION", classification: "DETERMINISTIC_IDENTITY_LINK", explanation: "Customer Aarav Sharma submitted application CASE-BLR-01.", firstSeen: "2026-01-10T09:00:00Z" },
  { id: "e:cust1_pan", source: "cust:aarav_sharma", target: "id_val:pan_aarav", relationshipType: "HAS_IDENTIFIER", classification: "DETERMINISTIC_IDENTITY_LINK", explanation: "Verified PAN ABCDE1234F belongs to Aarav Sharma." },
  { id: "e:cust1_aadhaar", source: "cust:aarav_sharma", target: "id_val:aadhaar_aarav", relationshipType: "HAS_IDENTIFIER", classification: "DETERMINISTIC_IDENTITY_LINK", explanation: "Verified Aadhaar belongs to Aarav Sharma." },
  { id: "e:cust1_dev1", source: "cust:aarav_sharma", target: "dev:household_tab_01", relationshipType: "USES_DEVICE", classification: "STRONG_ENTITY_LINK", explanation: "Aarav Sharma completed application on Household Tablet." },
  { id: "e:app1_ip1", source: "case:app_01", target: "ip:airtel_broadband_blr_01", relationshipType: "SEEN_AT_IP", classification: "CONTEXTUAL_LINK", explanation: "Application submitted from residential IP 122.171.1.10." },
  { id: "e:app1_addr1", source: "case:app_01", target: "addr:indiranagar_blr_560001", relationshipType: "DECLARED_AT", classification: "CONTEXTUAL_LINK", explanation: "Declared residential address in Indiranagar, Bengaluru 560001." },

  { id: "e:cust2_app2", source: "cust:ananya_sharma", target: "case:app_02", relationshipType: "HAS_APPLICATION", classification: "DETERMINISTIC_IDENTITY_LINK", explanation: "Customer Ananya Sharma submitted application CASE-BLR-02.", firstSeen: "2026-01-12T14:30:00Z" },
  { id: "e:cust2_pan", source: "cust:ananya_sharma", target: "id_val:pan_ananya", relationshipType: "HAS_IDENTIFIER", classification: "DETERMINISTIC_IDENTITY_LINK", explanation: "Verified PAN XYZPS9876Q belongs to Ananya Sharma." },
  { id: "e:cust2_dev2", source: "cust:ananya_sharma", target: "dev:mobile_ananya_02", relationshipType: "USES_DEVICE", classification: "STRONG_ENTITY_LINK", explanation: "Ananya Sharma completed application on personal Mobile DEV_SYN_02." },
  { id: "e:app2_ip1", source: "case:app_02", target: "ip:airtel_broadband_blr_01", relationshipType: "SEEN_AT_IP", classification: "CONTEXTUAL_LINK", explanation: "Ananya submitted from shared household IP 122.171.1.10." },
  { id: "e:app2_addr1", source: "case:app_02", target: "addr:indiranagar_blr_560001", relationshipType: "DECLARED_AT", classification: "CONTEXTUAL_LINK", explanation: "Ananya declared same household address in Indiranagar 560001." },

  // =========================================================================
  // PATTERN B: SHARED DEVICE ACROSS DISTINCT APPLICANTS (Ramesh, Suresh, Vikram, Dinesh)
  // =========================================================================
  { id: "e:cust3_app3", source: "cust:ramesh_kumar", target: "case:app_03", relationshipType: "HAS_APPLICATION", classification: "DETERMINISTIC_IDENTITY_LINK", explanation: "Ramesh Kumar submitted CASE-DEV-03." },
  { id: "e:cust3_pan", source: "cust:ramesh_kumar", target: "id_val:pan_ramesh", relationshipType: "HAS_IDENTIFIER", classification: "DETERMINISTIC_IDENTITY_LINK", explanation: "Ramesh PAN RPRPK1122M." },
  { id: "e:cust3_dev4", source: "cust:ramesh_kumar", target: "dev:shared_rig_04", relationshipType: "USES_DEVICE", classification: "STRONG_ENTITY_LINK", explanation: "Ramesh logged in from device DEV_SYN_04 (a8f9c2d1e03b)." },

  { id: "e:cust4_app4", source: "cust:suresh_patel", target: "case:app_04", relationshipType: "HAS_APPLICATION", classification: "DETERMINISTIC_IDENTITY_LINK", explanation: "Suresh Patel submitted CASE-DEV-04." },
  { id: "e:cust4_dev4", source: "cust:suresh_patel", target: "dev:shared_rig_04", relationshipType: "USES_DEVICE", classification: "STRONG_ENTITY_LINK", explanation: "Suresh logged in from exact same device DEV_SYN_04." },

  { id: "e:cust5_app5", source: "cust:vikram_singh", target: "case:app_05", relationshipType: "HAS_APPLICATION", classification: "DETERMINISTIC_IDENTITY_LINK", explanation: "Vikram Singh submitted CASE-DEV-05." },
  { id: "e:cust5_dev4", source: "cust:vikram_singh", target: "dev:shared_rig_04", relationshipType: "USES_DEVICE", classification: "STRONG_ENTITY_LINK", explanation: "Vikram logged in from exact same device DEV_SYN_04." },

  { id: "e:cust6_app6", source: "cust:dinesh_verma", target: "case:app_06", relationshipType: "HAS_APPLICATION", classification: "DETERMINISTIC_IDENTITY_LINK", explanation: "Dinesh Verma submitted CASE-DEV-06." },
  { id: "e:cust6_dev4", source: "cust:dinesh_verma", target: "dev:shared_rig_04", relationshipType: "USES_DEVICE", classification: "STRONG_ENTITY_LINK", explanation: "Dinesh logged in from exact same device DEV_SYN_04." },
  { id: "e:cust6_addr_fort", source: "cust:dinesh_verma", target: "addr:fort_mumbai_400001", relationshipType: "DECLARED_AT", classification: "CONTEXTUAL_LINK", explanation: "Dinesh declared Fort Mumbai address." },
  { id: "e:dev4_inst", source: "dev:shared_rig_04", target: "app_inst:inst_04_shared", relationshipType: "HAS_APP_INSTANCE", classification: "STRONG_ENTITY_LINK", explanation: "Device DEV_SYN_04 hosts app instance INST-SYN-04." },

  // =========================================================================
  // PATTERN C: REUSED CONTACT ATTRIBUTES (Kavita & Rajesh)
  // =========================================================================
  { id: "e:cust7_app7", source: "cust:kavita_reddy", target: "case:app_07", relationshipType: "HAS_APPLICATION", classification: "DETERMINISTIC_IDENTITY_LINK", explanation: "Kavita Reddy submitted CASE-REUSE-07." },
  { id: "e:cust7_pan", source: "cust:kavita_reddy", target: "id_val:pan_kavita", relationshipType: "HAS_IDENTIFIER", classification: "DETERMINISTIC_IDENTITY_LINK", explanation: "Kavita PAN KVKVR3344P." },
  { id: "e:cust7_mob", source: "cust:kavita_reddy", target: "id_val:mob_shared_9845099999", relationshipType: "HAS_IDENTIFIER", classification: "STRONG_ENTITY_LINK", explanation: "Kavita declared mobile +91 9845099999." },
  { id: "e:cust7_email", source: "cust:kavita_reddy", target: "id_val:email_shared_family", relationshipType: "HAS_IDENTIFIER", classification: "STRONG_ENTITY_LINK", explanation: "Kavita declared email family.reddy@gmail.com." },

  { id: "e:cust8_app8", source: "cust:rajesh_reddy", target: "case:app_08", relationshipType: "HAS_APPLICATION", classification: "DETERMINISTIC_IDENTITY_LINK", explanation: "Rajesh Reddy submitted CASE-REUSE-08." },
  { id: "e:cust8_mob", source: "cust:rajesh_reddy", target: "id_val:mob_shared_9845099999", relationshipType: "HAS_IDENTIFIER", classification: "STRONG_ENTITY_LINK", explanation: "Rajesh declared exact same mobile +91 9845099999." },
  { id: "e:cust8_email", source: "cust:rajesh_reddy", target: "id_val:email_shared_family", relationshipType: "HAS_IDENTIFIER", classification: "STRONG_ENTITY_LINK", explanation: "Rajesh declared exact same email family.reddy@gmail.com." },

  // =========================================================================
  // PATTERN D: SHARED PROXY NETWORK (Vijay, Pooja, Amit, Sunil)
  // =========================================================================
  { id: "e:cust9_app9", source: "cust:vijay_kumar", target: "case:app_09", relationshipType: "HAS_APPLICATION", classification: "DETERMINISTIC_IDENTITY_LINK", explanation: "Vijay Kumar submitted CASE-PROXY-09." },
  { id: "e:app9_proxy", source: "case:app_09", target: "ip:proxy_frankfurt_01", relationshipType: "SEEN_AT_IP", classification: "CONTEXTUAL_LINK", explanation: "Application 09 routed via Frankfurt VPN Exit 185.220.101.5." },

  { id: "e:cust10_app10", source: "cust:pooja_gupta", target: "case:app_10", relationshipType: "HAS_APPLICATION", classification: "DETERMINISTIC_IDENTITY_LINK", explanation: "Pooja Gupta submitted CASE-PROXY-10." },
  { id: "e:app10_proxy", source: "case:app_10", target: "ip:proxy_frankfurt_01", relationshipType: "SEEN_AT_IP", classification: "CONTEXTUAL_LINK", explanation: "Application 10 routed via same Frankfurt VPN Exit 185.220.101.5." },

  { id: "e:cust11_app11", source: "cust:amit_shah", target: "case:app_11", relationshipType: "HAS_APPLICATION", classification: "DETERMINISTIC_IDENTITY_LINK", explanation: "Amit Shah submitted CASE-PROXY-11." },
  { id: "e:app11_proxy", source: "case:app_11", target: "ip:proxy_frankfurt_01", relationshipType: "SEEN_AT_IP", classification: "CONTEXTUAL_LINK", explanation: "Application 11 routed via same Frankfurt VPN Exit 185.220.101.5." },

  { id: "e:cust12_app12", source: "cust:sunil_mehta", target: "case:app_12", relationshipType: "HAS_APPLICATION", classification: "DETERMINISTIC_IDENTITY_LINK", explanation: "Sunil Mehta submitted CASE-PROXY-12." },
  { id: "e:app12_proxy", source: "case:app_12", target: "ip:proxy_frankfurt_01", relationshipType: "SEEN_AT_IP", classification: "CONTEXTUAL_LINK", explanation: "Application 12 routed via same Frankfurt VPN Exit 185.220.101.5." },

  // =========================================================================
  // PATTERN E: ADDRESS CONCENTRATION (Neha, Deepak, Manoj, Sanjay, Pankaj)
  // =========================================================================
  { id: "e:cust13_app13", source: "cust:neha_joshi", target: "case:app_13", relationshipType: "HAS_APPLICATION", classification: "DETERMINISTIC_IDENTITY_LINK", explanation: "Neha Joshi submitted CASE-ADDR-13." },
  { id: "e:app13_addr", source: "case:app_13", target: "addr:fort_mumbai_400001", relationshipType: "DECLARED_AT", classification: "CONTEXTUAL_LINK", explanation: "Declared Fort Mumbai 400001." },

  { id: "e:cust14_app14", source: "cust:deepak_malhotra", target: "case:app_14", relationshipType: "HAS_APPLICATION", classification: "DETERMINISTIC_IDENTITY_LINK", explanation: "Deepak Malhotra submitted CASE-ADDR-14." },
  { id: "e:app14_addr", source: "case:app_14", target: "addr:fort_mumbai_400001", relationshipType: "DECLARED_AT", classification: "CONTEXTUAL_LINK", explanation: "Declared same Fort Mumbai 400001." },

  { id: "e:app15_addr", source: "case:app_15", target: "addr:fort_mumbai_400001", relationshipType: "DECLARED_AT", classification: "CONTEXTUAL_LINK", explanation: "CASE-ADDR-15 declared same Fort Mumbai 400001." },
  { id: "e:app16_addr", source: "case:app_16", target: "addr:fort_mumbai_400001", relationshipType: "DECLARED_AT", classification: "CONTEXTUAL_LINK", explanation: "CASE-ADDR-16 declared same Fort Mumbai 400001." },
  { id: "e:app17_addr", source: "case:app_17", target: "addr:fort_mumbai_400001", relationshipType: "DECLARED_AT", classification: "CONTEXTUAL_LINK", explanation: "CASE-ADDR-17 declared same Fort Mumbai 400001." },
  { id: "e:app13_event", source: "case:app_13", target: "event:field_visit_mumbai_03", relationshipType: "FIELD_VISITED_AT", classification: "CONTEXTUAL_LINK", explanation: "Field collection visit at Mumbai Fort address." },

  // =========================================================================
  // PATTERN F: GEOGRAPHIC CONVERGENCE (Alok & Rohan in Anantapur)
  // =========================================================================
  { id: "e:cust18_app18", source: "cust:alok_mishra", target: "case:app_18", relationshipType: "HAS_APPLICATION", classification: "DETERMINISTIC_IDENTITY_LINK", explanation: "Alok Mishra submitted CASE-GEO-18 (Declared Delhi)." },
  { id: "e:app18_addr", source: "case:app_18", target: "addr:connaught_delhi_110001", relationshipType: "DECLARED_AT", classification: "CONTEXTUAL_LINK", explanation: "Alok declared Delhi 110001." },
  { id: "e:app18_event", source: "case:app_18", target: "event:atm_withdrawal_anantapur_01", relationshipType: "USED_ATM_AT", classification: "CONTEXTUAL_LINK", explanation: "Alok performed ATM withdrawal in Anantapur 515001." },
  { id: "e:event_anantapur_loc", source: "event:atm_withdrawal_anantapur_01", target: "loc:anantapur_hub_515001", relationshipType: "TRANSACTED_AT", classification: "CONTEXTUAL_LINK", explanation: "ATM transaction located at Anantapur Hub." },

  { id: "e:app19_addr", source: "case:app_19", target: "addr:jaipur_302001", relationshipType: "DECLARED_AT", classification: "CONTEXTUAL_LINK", explanation: "CASE-GEO-19 declared Jaipur 302001." },
  { id: "e:app19_merchant", source: "case:app_19", target: "merchant:vpa_anantapur_electronics", relationshipType: "TRANSACTED_AT", classification: "CONTEXTUAL_LINK", explanation: "Repeated UPI payments to Anantapur Electronics VPA." },
  { id: "e:merchant_anantapur_loc", source: "merchant:vpa_anantapur_electronics", target: "loc:anantapur_hub_515001", relationshipType: "TRANSACTED_AT", classification: "CONTEXTUAL_LINK", explanation: "Merchant registered at Anantapur Hub." },

  // =========================================================================
  // PATTERN G: SINGLE CASE LOCATION CONFLICT (Priya Fraud Demo - CASE-DEL-99)
  // =========================================================================
  { id: "e:cust20_app20", source: "cust:priya_nair", target: "case:app_20", relationshipType: "HAS_APPLICATION", classification: "DETERMINISTIC_IDENTITY_LINK", explanation: "Priya Nair submitted CASE-DEL-99." },
  { id: "e:cust20_pan", source: "cust:priya_nair", target: "id_val:pan_priya", relationshipType: "HAS_IDENTIFIER", classification: "DETERMINISTIC_IDENTITY_LINK", explanation: "Priya PAN PRYNR5566K." },
  { id: "e:cust20_dev20", source: "cust:priya_nair", target: "dev:mobile_priya_20", relationshipType: "USES_DEVICE", classification: "STRONG_ENTITY_LINK", explanation: "Priya used Mobile DEV_SYN_20." },
  { id: "e:app20_sess", source: "case:app_20", target: "session:sess_priya_20", relationshipType: "SEEN_AT_IP", classification: "STRONG_ENTITY_LINK", explanation: "Web session SESS-DEL-99." },
  { id: "e:sess_proxy", source: "session:sess_priya_20", target: "ip:proxy_frankfurt_01", relationshipType: "SEEN_AT_IP", classification: "CONTEXTUAL_LINK", explanation: "Session routed through Frankfurt Proxy." },
  { id: "e:app20_addr", source: "case:app_20", target: "addr:connaught_delhi_110001", relationshipType: "DECLARED_AT", classification: "CONTEXTUAL_LINK", explanation: "Declared Delhi 110001." },
  { id: "e:cust20_bureau_loc", source: "cust:priya_nair", target: "loc:anantapur_hub_515001", relationshipType: "BUREAU_REPORTED_AT", classification: "CONTEXTUAL_LINK", explanation: "Credit bureau reports historical address in Anantapur AP 515001." },

  // =========================================================================
  // PATTERN H: DISCONNECTED CLEAN BASELINE CASE
  // =========================================================================
  { id: "e:app_clean_addr", source: "case:app_clean_baseline", target: "addr:koramangala_blr_560034", relationshipType: "DECLARED_AT", classification: "CONTEXTUAL_LINK", explanation: "Clean baseline declared Koramangala 560034." },
  { id: "e:app_clean_branch", source: "case:app_clean_baseline", target: "branch:hdfc_indiranagar_01", relationshipType: "CASH_DEPOSITED_AT", classification: "CONTEXTUAL_LINK", explanation: "Clean baseline deposits at Indiranagar HDFC." }
];

export function buildSyntheticEntityNetwork(): SyntheticEntityNetworkGraph {
  return {
    nodes: syntheticNetworkNodes,
    edges: syntheticNetworkEdges,
    metadata: {
      datasetVersion: "2.4.0-synthetic-entity-network",
      generatedAt: "2026-09-02T20:10:00Z",
      isSynthetic: true
    }
  };
}
