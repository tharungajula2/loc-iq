import { CurrentTrace } from '../types';

export interface ActiveCaseBridge {
  activeNodeIds: Set<string>;
  activeIdentifierIds: Set<string>;
  activeSourceIds: Set<string>;
  activeFieldIds: Set<string>;
  activeSignalIds: Set<string>;
}

export function getActiveCaseBridge(currentTrace: CurrentTrace | null): ActiveCaseBridge {
  const activeNodeIds = new Set<string>();
  const activeIdentifierIds = new Set<string>();
  const activeSourceIds = new Set<string>();
  const activeFieldIds = new Set<string>();
  const activeSignalIds = new Set<string>();

  if (!currentTrace) {
    return {
      activeNodeIds,
      activeIdentifierIds,
      activeSourceIds,
      activeFieldIds,
      activeSignalIds
    };
  }

  // 1. Active Primary Identifiers
  const inputKeys = Object.keys(currentTrace.input);
  inputKeys.forEach(k => {
    if (currentTrace.input[k as keyof typeof currentTrace.input]) {
      const idNodeId = `id:${k}`;
      activeIdentifierIds.add(idNodeId);
      activeNodeIds.add(idNodeId);
    }
  });

  // 2. Active Fetched Fields
  currentTrace.fetchedFields.forEach(f => {
    const fieldNodeId = `field:${f.data_field}`;
    activeFieldIds.add(fieldNodeId);
    activeNodeIds.add(fieldNodeId);
  });

  // 3. Active Derived Signals
  currentTrace.signals.forEach(s => {
    const sigNodeId = `sig:${s.signal}`;
    activeSignalIds.add(sigNodeId);
    activeNodeIds.add(sigNodeId);
  });

  // 4. Mapped Active Data Sources
  // Explicit mapping from active fields to catalogue sources
  if (activeFieldIds.has('field:bureau_address_history') || activeFieldIds.has('field:cibil_score')) {
    const srcId = 'api:credit_bureaus_cibil_experian_equifax_crif';
    activeSourceIds.add(srcId);
    activeNodeIds.add(srcId);
  }
  if (activeFieldIds.has('field:public_ip')) {
    const srcId = 'api:ip_geolocation_services';
    activeSourceIds.add(srcId);
    activeNodeIds.add(srcId);
  }
  if (activeIdentifierIds.has('id:mobile_number')) {
    const srcId = 'api:mobile_intelligence_apis';
    activeSourceIds.add(srcId);
    activeNodeIds.add(srcId);
  }

  return {
    activeNodeIds,
    activeIdentifierIds,
    activeSourceIds,
    activeFieldIds,
    activeSignalIds
  };
}
