export interface PrimaryIdentifierDef {
  id: string;
  category: string;
  identifier: string;
  where_it_comes_from: string;
  what_it_means: string;
  why_it_matters: string;
  what_it_unlocks: string;
  derived_columns: string;
  example: string;
}

export interface DataFieldDef {
  id: string;
  category: string;
  data_field: string;
  fetched_using_key: string;
  sits_in: string;
  where_it_comes_from: string;
  what_it_means: string;
  why_it_matters: string;
  lookup_api: string | null;
  derived_columns: string;
  example: string;
}

export interface ApiUniverseDef {
  id: string;
  source: string;
  input_needed: string | null;
  what_it_returns: string | null;
  why_it_matters: string | null;
  access: string;
  remarks: string;
  example_link: string | null;
}

export interface FetchedFieldTrace {
  data_field: string;
  value: string;
  source_api: string;
  resolves_to: string;
  freshness_date: string;
  proxy?: boolean;
  note?: string;
}

export interface GraphSignalTrace {
  signal: string;
  location_id: string;
  location_label: string;
  base_weight: number;
  recency_factor: number;
  ip_trust_factor: number;
  source_api: string;
  evidence: string;
}

export interface ExpectedOutputTrace {
  ranked: { rank: number; location: string; confidence: number; note?: string }[];
  top_candidate: string;
  declared: string;
  truth_flag: 'GREEN' | 'AMBER' | 'RED';
  reason: string;
}

export interface DemoCaseDef {
  case_label: string;
  summary: string;
  identifiers: InputState;
  fetched_fields: FetchedFieldTrace[];
  signals: GraphSignalTrace[];
}

// Global State Interfaces
export interface InputState {
  mobile_number: string;
  pan: string;
  aadhaar_number: string;
  email_id: string;
  customer_key: string;
  case_id: string;
  declared_pincode: string;
}

export interface GraphNode {
  id: string;
  type: string; // Identifier, API, DataField, Derived, Location, Output
  value: string;
  label: string;
  dimmed?: boolean; // For catalogue nodes
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  relationshipType: string;
  weight: number;
  dimmed?: boolean;
}

// Extended Trace State for the detailed tabs
export interface CurrentTrace {
  case_label: string | null;
  input: InputState;
  fetchedFields: FetchedFieldTrace[];
  signals: GraphSignalTrace[];
  expected_output: ExpectedOutputTrace | null;
}
