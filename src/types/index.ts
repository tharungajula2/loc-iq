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
  ranked: { rank: number; location: string; evidence_share: number; note?: string }[];
  top_candidate: string;
  declared: string;
  address_consistency: 'CONSISTENT' | 'REVIEW' | 'CONFLICT';
  reason: string;
  risk_indicators: string[];
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

// Canonical Investigation Graph Domain Model
export type InvestigationNodeType = 
  | 'IDENTIFIER' 
  | 'SOURCE' 
  | 'EVIDENCE' 
  | 'SIGNAL' 
  | 'CANDIDATE_LOCATION' 
  | 'DECISION';

export type InvestigationEdgeType = 
  | 'ENRICHS' 
  | 'EXTRACTS' 
  | 'SUPPORTS' 
  | 'CONTRADICTS';

export interface InvestigationNode {
  id: string;
  type: InvestigationNodeType;
  label: string;
  value?: string;
  category?: string;
  sourceApi?: string;
  provenance?: string;
  isSimulated?: boolean;
  metadata?: Record<string, unknown>;
}

export interface InvestigationEdge {
  id: string;
  source: string;
  target: string;
  relationshipType: InvestigationEdgeType;
  baseReliability: number;
  freshnessFactor: number;
  trustModifier: number;
  effectiveWeight: number;
  reason?: string;
}

export type GeographicCategory = 'PHYSICAL_LOCALITY' | 'REGIONAL_SCOPE' | 'NETWORK_LOCATION';

export interface CorroboratingEvidenceTrace {
  signal: string;
  source_api: string;
  region_label: string;
  weight: number;
  reasoning: string;
}

export interface NetworkObservationTrace {
  signal: string;
  source_api: string;
  network_label: string;
  is_proxy: boolean;
  reasoning: string;
}

export interface CandidateDecomposition {
  location_id: string;
  location_label: string;
  geographicCategory: GeographicCategory;
  totalSupportingWeight: number;
  totalContradictingWeight: number;
  supportingSignalCount: number;
  contradictionCount: number;
  evidenceShare: number;
  rank: number;
  supportingEvidence: { signal: string; source_api: string; weight: number; evidence: string }[];
  corroboratingRegions: string[];
  contradictions: { signal: string; source_api: string; reason: string }[];
}

export interface CanonicalInvestigationGraph {
  id: string;
  case_label: string;
  seedInputs: InputState;
  nodes: InvestigationNode[];
  edges: InvestigationEdge[];
  candidates: CandidateDecomposition[];
  corroboratingEvidence: CorroboratingEvidenceTrace[];
  networkObservations: NetworkObservationTrace[];
  topCandidate: string;
  declaredLocation: string;
  addressConsistency: 'CONSISTENT' | 'REVIEW' | 'CONFLICT';
  decisionReason: string;
  riskIndicators: string[];
  totalSupportingCount: number;
  totalContradictionCount: number;
}

export interface GraphNode {
  id: string;
  type: string;
  value: string;
  label: string;
  dimmed?: boolean;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  relationshipType: string;
  weight: number;
  dimmed?: boolean;
}

// Extended Trace State for the detailed tabs & graph visualizer
export interface CurrentTrace {
  case_label: string | null;
  input: InputState;
  fetchedFields: FetchedFieldTrace[];
  signals: GraphSignalTrace[];
  expected_output: ExpectedOutputTrace | null;
  graph: CanonicalInvestigationGraph;
}

// ----------------------------------------------------
// KNOWLEDGE GRAPH DOMAIN MODEL (Catalogue / Architecture)
// ----------------------------------------------------
export type EdgeCertainty = 'DIRECT' | 'NORMALIZED' | 'CURATED';

export type KnowledgeNodeType = 
  | 'IDENTIFIER' 
  | 'DATA_SOURCE' 
  | 'FETCHED_FIELD' 
  | 'DERIVED_SIGNAL' 
  | 'KNOWLEDGE_TOPIC';

export type KnowledgeRelationType = 
  | 'REQUIRES_IDENTIFIER' 
  | 'RETURNS_FIELD' 
  | 'DERIVES_SIGNAL' 
  | 'DOCUMENTED_IN';

export interface KnowledgeGraphNode {
  id: string;
  label: string;
  type: KnowledgeNodeType;
  catalogueId: string;
  category?: string;
  accessMode?: string;
  sitsIn?: string | null;
  description?: string | null;
  metadata?: Record<string, unknown>;
}

export interface KnowledgeGraphEdge {
  id: string;
  source: string;
  target: string;
  relationshipType: KnowledgeRelationType;
  certainty: EdgeCertainty;
  sourceDataset: string;
  sourceProperty: string;
  explanation: string;
}

export interface KnowledgeGraph {
  nodes: KnowledgeGraphNode[];
  edges: KnowledgeGraphEdge[];
}

// ----------------------------------------------------
// SYNTHETIC ENTITY NETWORK DOMAIN MODEL (Multi-Case Lab)
// ----------------------------------------------------
export type EntityNodeType = 
  | 'PERSON' 
  | 'APPLICATION' 
  | 'IDENTIFIER_VAL' 
  | 'DEVICE' 
  | 'APP_INSTANCE' 
  | 'SESSION' 
  | 'NETWORK_ENDPOINT' 
  | 'ADDRESS' 
  | 'LOCATION' 
  | 'BRANCH' 
  | 'MERCHANT' 
  | 'BEHAVIOURAL_EVENT';

export type EntityEdgeType = 
  | 'HAS_APPLICATION' 
  | 'HAS_IDENTIFIER' 
  | 'USES_DEVICE' 
  | 'HAS_APP_INSTANCE' 
  | 'SEEN_AT_IP' 
  | 'DECLARED_AT' 
  | 'BUREAU_REPORTED_AT' 
  | 'TRANSACTED_AT' 
  | 'USED_ATM_AT' 
  | 'CASH_DEPOSITED_AT' 
  | 'FIELD_VISITED_AT' 
  | 'MAILED_TO';

export type LinkSemanticClassification = 
  | 'DETERMINISTIC_IDENTITY_LINK' 
  | 'STRONG_ENTITY_LINK' 
  | 'CONTEXTUAL_LINK';

export interface EntityNetworkNode {
  id: string;
  type: EntityNodeType;
  label: string;
  category: string;
  kgConceptId?: string; // Canonical reference to Knowledge Graph schema node (e.g. 'id:pan', 'field:bureau_address_history')
  caseId?: string;      // Canonical reference to Investigation Workspace case if mapped
  metadata?: Record<string, unknown>;
}

export interface EntityNetworkEdge {
  id: string;
  source: string;
  target: string;
  relationshipType: EntityEdgeType;
  classification: LinkSemanticClassification;
  explanation: string;
  firstSeen?: string;
  lastSeen?: string;
  eventTimestamp?: string;
  metadata?: Record<string, unknown>;
}

export interface SyntheticEntityNetworkGraph {
  nodes: EntityNetworkNode[];
  edges: EntityNetworkEdge[];
  metadata: {
    datasetVersion: string;
    generatedAt: string;
    isSynthetic: boolean;
  };
}

export interface StructuralRuleFinding {
  findingId: string;
  ruleId: string;
  ruleName: string;
  classification: LinkSemanticClassification | 'INVESTIGATION_FINDING';
  focalEntityId: string;
  observedValue: number;
  observedEntityType: EntityNodeType;
  thresholdValue: number;
  thresholdEntityType: EntityNodeType;
  involvedEntities: string[];
  involvedApplicationIds: string[];
  involvedCustomerIds: string[];
  excludedNeighbors?: { id: string; type: EntityNodeType; reason: string }[];
  supportingPaths: string[][];
  supportingEdgeIds: string[];
  explanation: string;
  benignContextNote?: string;
}



