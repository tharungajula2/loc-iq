import { KnowledgeRelationType, EdgeCertainty } from '../types';

export interface CuratedMappingEntry {
  sourceId: string;
  targetId: string;
  relationshipType: KnowledgeRelationType;
  certainty: EdgeCertainty;
  sourceDataset: string;
  sourceProperty: string;
  explanation: string;
}

export const curatedMappingRegistry: CuratedMappingEntry[] = [
  // 1. IDENTIFIER -> DATA_SOURCE Curated Glue
  {
    sourceId: 'id:mobile_number',
    targetId: 'api:mobile_intelligence_apis',
    relationshipType: 'REQUIRES_IDENTIFIER',
    certainty: 'CURATED',
    sourceDataset: 'data_primary_identifiers.json',
    sourceProperty: 'what_it_unlocks',
    explanation: 'Mobile number unlocks phone-intelligence vendors, Twilio lookup, and caller-ID services.'
  },
  {
    sourceId: 'id:pan',
    targetId: 'api:credit_bureaus_cibil_experian_equifax_crif',
    relationshipType: 'REQUIRES_IDENTIFIER',
    certainty: 'CURATED',
    sourceDataset: 'data_primary_identifiers.json',
    sourceProperty: 'what_it_unlocks',
    explanation: 'PAN is the primary key required by credit bureaus (CIBIL / Experian / Equifax / CRIF).'
  },
  {
    sourceId: 'id:aadhaar_number',
    targetId: 'api:ckyc_registry',
    relationshipType: 'REQUIRES_IDENTIFIER',
    certainty: 'CURATED',
    sourceDataset: 'data_primary_identifiers.json',
    sourceProperty: 'what_it_unlocks',
    explanation: 'Aadhaar number links to the Central KYC (CKYC) registry and verified KYC address.'
  },
  {
    sourceId: 'id:email_id',
    targetId: 'api:people_data_enrichment_services',
    relationshipType: 'REQUIRES_IDENTIFIER',
    certainty: 'CURATED',
    sourceDataset: 'data_primary_identifiers.json',
    sourceProperty: 'what_it_unlocks',
    explanation: 'Email address feeds people-data enrichment providers (PeopleDataLabs, Clearbit, Hunter.io).'
  },

  // 2. DATA_SOURCE -> FETCHED_FIELD Curated Glue
  {
    sourceId: 'api:credit_bureaus_cibil_experian_equifax_crif',
    targetId: 'field:bureau_address_history',
    relationshipType: 'RETURNS_FIELD',
    certainty: 'CURATED',
    sourceDataset: 'data_fetched_data_fields.json',
    sourceProperty: 'where_it_comes_from',
    explanation: 'Credit bureaus return historical address records, previous states, and enquiry locations.'
  },
  {
    sourceId: 'api:mobile_intelligence_apis',
    targetId: 'field:mobile_number',
    relationshipType: 'RETURNS_FIELD',
    certainty: 'CURATED',
    sourceDataset: 'data_fetched_data_fields.json',
    sourceProperty: 'where_it_comes_from',
    explanation: 'Mobile intelligence APIs validate phone number series and telecom circle carrier details.'
  },
  {
    sourceId: 'api:ip_geolocation_services',
    targetId: 'field:public_ip',
    relationshipType: 'RETURNS_FIELD',
    certainty: 'CURATED',
    sourceDataset: 'data_fetched_data_fields.json',
    sourceProperty: 'where_it_comes_from',
    explanation: 'IP Geolocation APIs (ip-api, MaxMind) resolve public IP addresses to city, ISP, and proxy flags.'
  },

  // 3. FETCHED_FIELD -> KNOWLEDGE_TOPIC Curated Glue
  {
    sourceId: 'field:public_ip',
    targetId: 'doc:1.4 Digital Location & Geolocation APIs',
    relationshipType: 'DOCUMENTED_IN',
    certainty: 'CURATED',
    sourceDataset: 'masterclass.json',
    sourceProperty: 'topic_title',
    explanation: 'Public IP fields and proxy observations are documented in Masterclass Section 1.4.'
  },
  {
    sourceId: 'field:bureau_address_history',
    targetId: 'doc:1.2 Bureau & Credit History',
    relationshipType: 'DOCUMENTED_IN',
    certainty: 'CURATED',
    sourceDataset: 'masterclass.json',
    sourceProperty: 'topic_title',
    explanation: 'Bureau address history and stability scoring are documented in Masterclass Section 1.2.'
  }
];
