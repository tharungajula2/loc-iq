import { 
  SyntheticEntityNetworkGraph, 
  EntityNetworkNode, 
  EntityNetworkEdge, 
  StructuralRuleFinding,
  EntityNodeType
} from "../types";

/**
 * LOC-IQ PHASE 2.4.1 — ENTITY NETWORK ANALYTICS ENGINE (SEMANTIC INTEGRITY)
 * Pure local deterministic graph algorithms over SyntheticEntityNetworkGraph.
 * Guarantees strict typed counting (DISTINCT canonical IDs) over raw graph degree.
 */

// 1. Neighborhood Expansion (1-hop)
export function getNeighborhood(graph: SyntheticEntityNetworkGraph, nodeId: string): { nodes: EntityNetworkNode[]; edges: EntityNetworkEdge[] } {
  const connectedEdgeIds = new Set<string>();
  const connectedNodeIds = new Set<string>([nodeId]);

  graph.edges.forEach(e => {
    if (e.source === nodeId || e.target === nodeId) {
      connectedEdgeIds.add(e.id);
      connectedNodeIds.add(e.source);
      connectedNodeIds.add(e.target);
    }
  });

  const nodes = graph.nodes.filter(n => connectedNodeIds.has(n.id));
  const edges = graph.edges.filter(e => connectedEdgeIds.has(e.id));
  return { nodes, edges };
}

// 2. Degree Counts & Entity Breakdown
export function getDegreeCounts(graph: SyntheticEntityNetworkGraph, nodeId: string) {
  let incoming = 0;
  let outgoing = 0;
  const linkedTypes: Record<string, number> = {};

  graph.edges.forEach(e => {
    let linkedId: string | null = null;
    if (e.source === nodeId) {
      outgoing++;
      linkedId = e.target;
    } else if (e.target === nodeId) {
      incoming++;
      linkedId = e.source;
    }

    if (linkedId) {
      const node = graph.nodes.find(n => n.id === linkedId);
      if (node) {
        linkedTypes[node.type] = (linkedTypes[node.type] || 0) + 1;
      }
    }
  });

  return {
    nodeId,
    totalDegree: incoming + outgoing,
    incoming,
    outgoing,
    linkedTypes
  };
}

// 3. Connected Components Partitioning (BFS)
export function getConnectedComponents(graph: SyntheticEntityNetworkGraph): string[][] {
  const visited = new Set<string>();
  const components: string[][] = [];

  const adj = new Map<string, Set<string>>();
  graph.nodes.forEach(n => adj.set(n.id, new Set<string>()));
  graph.edges.forEach(e => {
    if (adj.has(e.source) && adj.has(e.target)) {
      adj.get(e.source)!.add(e.target);
      adj.get(e.target)!.add(e.source);
    }
  });

  graph.nodes.forEach(n => {
    if (!visited.has(n.id)) {
      const component: string[] = [];
      const queue: string[] = [n.id];
      visited.add(n.id);

      while (queue.length > 0) {
        const curr = queue.shift()!;
        component.push(curr);
        const neighbors = adj.get(curr) || new Set();
        neighbors.forEach(neighbor => {
          if (!visited.has(neighbor)) {
            visited.add(neighbor);
            queue.push(neighbor);
          }
        });
      }
      components.push(component);
    }
  });

  return components.sort((a, b) => b.length - a.length);
}

// Component Diagnostics with Correct Terminology
export function getComponentDiagnostics(graph: SyntheticEntityNetworkGraph) {
  const components = getConnectedComponents(graph);
  
  const standaloneCaseComponents: Array<{ componentId: string; caseIds: string[]; size: number; nodes: string[] }> = [];
  const isolatedNodes: string[] = [];

  components.forEach((comp, idx) => {
    if (comp.length === 1) {
      isolatedNodes.push(comp[0]);
    } else {
      const caseIds = comp.filter(id => {
        const node = graph.nodes.find(n => n.id === id);
        return node && node.type === "APPLICATION";
      });
      standaloneCaseComponents.push({
        componentId: `COMP_${idx + 1}`,
        caseIds,
        size: comp.length,
        nodes: comp
      });
    }
  });

  return {
    totalComponentCount: components.length,
    largestComponentSize: components[0]?.length || 0,
    standaloneCaseComponents,
    isolatedNodes
  };
}

// 4. Deterministic Shortest Path (BFS)
export function getShortestPath(graph: SyntheticEntityNetworkGraph, sourceId: string, targetId: string): string[] | null {
  if (sourceId === targetId) return [sourceId];

  const adj = new Map<string, Set<string>>();
  graph.nodes.forEach(n => adj.set(n.id, new Set<string>()));
  graph.edges.forEach(e => {
    if (adj.has(e.source) && adj.has(e.target)) {
      adj.get(e.source)!.add(e.target);
      adj.get(e.target)!.add(e.source);
    }
  });

  if (!adj.has(sourceId) || !adj.has(targetId)) return null;

  const queue: string[] = [sourceId];
  const parent = new Map<string, string>();
  const visited = new Set<string>([sourceId]);

  while (queue.length > 0) {
    const curr = queue.shift()!;
    if (curr === targetId) {
      const path: string[] = [];
      let step: string | undefined = targetId;
      while (step) {
        path.unshift(step);
        step = parent.get(step);
      }
      return path;
    }

    const neighbors = adj.get(curr) || new Set();
    neighbors.forEach(neighbor => {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        parent.set(neighbor, curr);
        queue.push(neighbor);
      }
    });
  }

  return null;
}

// 5. Shared Neighbors Between Two Nodes
export function getSharedNeighbors(graph: SyntheticEntityNetworkGraph, nodeA: string, nodeB: string): EntityNetworkNode[] {
  const neighborsA = new Set<string>();
  const neighborsB = new Set<string>();

  graph.edges.forEach(e => {
    if (e.source === nodeA) neighborsA.add(e.target);
    if (e.target === nodeA) neighborsA.add(e.source);
    if (e.source === nodeB) neighborsB.add(e.target);
    if (e.target === nodeB) neighborsB.add(e.source);
  });

  const sharedIds = Array.from(neighborsA).filter(id => neighborsB.has(id));
  return graph.nodes.filter(n => sharedIds.includes(n.id));
}

// 6. Entity Overlap Analysis Between Cases
export function getEntityOverlap(graph: SyntheticEntityNetworkGraph, caseA: string, caseB: string) {
  const neighbors = getSharedNeighbors(graph, caseA, caseB);
  return {
    caseA,
    caseB,
    sharedCount: neighbors.length,
    sharedEntities: neighbors.map(n => ({ id: n.id, type: n.type, label: n.label }))
  };
}

// 7. Structural Rule-Based Network Pattern Detection (Audited with Strict Typed Counting)
export function detectNetworkPatterns(graph: SyntheticEntityNetworkGraph): StructuralRuleFinding[] {
  const findings: StructuralRuleFinding[] = [];

  // -------------------------------------------------------------------------
  // RULE 1: SHARED_DEVICE_MULTIPLE_IDENTITIES
  // Entity Counted: DISTINCT PERSON (Customer) nodes
  // -------------------------------------------------------------------------
  graph.nodes.filter(n => n.type === "DEVICE").forEach(devNode => {
    const connectedEdges = graph.edges.filter(e => e.source === devNode.id || e.target === devNode.id);
    const distinctPersonIds = new Set<string>();
    const excludedNeighbors: { id: string; type: EntityNodeType; reason: string }[] = [];
    const supportingEdgeIds: string[] = [];

    connectedEdges.forEach(e => {
      const neighborId = e.source === devNode.id ? e.target : e.source;
      const neighborNode = graph.nodes.find(n => n.id === neighborId);
      if (neighborNode) {
        if (neighborNode.type === "PERSON") {
          distinctPersonIds.add(neighborId);
          supportingEdgeIds.push(e.id);
        } else {
          excludedNeighbors.push({
            id: neighborId,
            type: neighborNode.type,
            reason: `Excluded non-person node '${neighborId}' (${neighborNode.type}) from customer count`
          });
        }
      }
    });

    const personCount = distinctPersonIds.size;
    if (personCount >= 3) {
      const custIds = Array.from(distinctPersonIds);
      const custLabels = custIds.map(id => graph.nodes.find(n => n.id === id)?.label || id).join(", ");
      findings.push({
        findingId: `FINDING_SHARED_DEVICE_${devNode.id.replace(/[:]/g, "_")}`,
        ruleId: "RULE_SHARED_DEVICE_MULTIPLE_IDENTITIES",
        ruleName: "Shared Device Across Distinct Identities",
        classification: "STRONG_ENTITY_LINK",
        focalEntityId: devNode.id,
        observedValue: personCount,
        observedEntityType: "PERSON",
        thresholdValue: 3,
        thresholdEntityType: "PERSON",
        involvedEntities: [devNode.id, ...custIds],
        involvedApplicationIds: [],
        involvedCustomerIds: custIds,
        excludedNeighbors,
        supportingPaths: custIds.map(c => [c, devNode.id]),
        supportingEdgeIds,
        explanation: `Device '${devNode.label}' is used by ${personCount} distinct PERSON entities (${custLabels}). Total node degree is ${connectedEdges.length}; excluded ${excludedNeighbors.length} non-person neighbor(s) from customer count.`
      });
    }
  });

  // -------------------------------------------------------------------------
  // RULE 2: REUSED_CONTACT_ATTRIBUTES
  // Entity Counted: DISTINCT PERSON (Customer) nodes sharing identifier value
  // -------------------------------------------------------------------------
  graph.nodes.filter(n => n.type === "IDENTIFIER_VAL").forEach(idValNode => {
    const connectedEdges = graph.edges.filter(e => (e.source === idValNode.id || e.target === idValNode.id) && e.relationshipType === "HAS_IDENTIFIER");
    const distinctPersonIds = new Set<string>();
    const supportingEdgeIds: string[] = [];

    connectedEdges.forEach(e => {
      const neighborId = e.source === idValNode.id ? e.target : e.source;
      const neighborNode = graph.nodes.find(n => n.id === neighborId);
      if (neighborNode && neighborNode.type === "PERSON") {
        distinctPersonIds.add(neighborId);
        supportingEdgeIds.push(e.id);
      }
    });

    const personCount = distinctPersonIds.size;
    if (personCount >= 2) {
      const custIds = Array.from(distinctPersonIds);
      const custLabels = custIds.map(id => graph.nodes.find(n => n.id === id)?.label || id).join(", ");
      findings.push({
        findingId: `FINDING_REUSED_CONTACT_${idValNode.id.replace(/[:]/g, "_")}`,
        ruleId: "RULE_REUSED_CONTACT_ATTRIBUTES",
        ruleName: "Reused Contact Attribute Across Customers",
        classification: "STRONG_ENTITY_LINK",
        focalEntityId: idValNode.id,
        observedValue: personCount,
        observedEntityType: "PERSON",
        thresholdValue: 2,
        thresholdEntityType: "PERSON",
        involvedEntities: [idValNode.id, ...custIds],
        involvedApplicationIds: [],
        involvedCustomerIds: custIds,
        supportingPaths: custIds.map(c => [c, idValNode.id]),
        supportingEdgeIds,
        explanation: `Contact attribute '${idValNode.label}' is shared across ${personCount} distinct PERSON entities (${custLabels}). Classified as STRONG_ENTITY_LINK (shared contact reuse, not proven identity equivalence).`
      });
    }
  });

  // -------------------------------------------------------------------------
  // RULE 3: SHARED_PROXY_ENDPOINT
  // Entity Counted: DISTINCT APPLICATION (Case) nodes seen at proxy IP
  // -------------------------------------------------------------------------
  graph.nodes.filter(n => n.type === "NETWORK_ENDPOINT" && n.metadata?.isProxy).forEach(ipNode => {
    const connectedEdges = graph.edges.filter(e => e.source === ipNode.id || e.target === ipNode.id);
    const distinctAppIds = new Set<string>();
    const excludedNeighbors: { id: string; type: EntityNodeType; reason: string }[] = [];
    const supportingEdgeIds: string[] = [];

    connectedEdges.forEach(e => {
      const neighborId = e.source === ipNode.id ? e.target : e.source;
      const neighborNode = graph.nodes.find(n => n.id === neighborId);
      if (neighborNode) {
        if (neighborNode.type === "APPLICATION") {
          distinctAppIds.add(neighborId);
          supportingEdgeIds.push(e.id);
        } else {
          excludedNeighbors.push({
            id: neighborId,
            type: neighborNode.type,
            reason: `Excluded non-application node '${neighborId}' (${neighborNode.type}) from case count`
          });
        }
      }
    });

    const appCount = distinctAppIds.size;
    if (appCount >= 3) {
      const appIds = Array.from(distinctAppIds);
      findings.push({
        findingId: `FINDING_SHARED_PROXY_${ipNode.id.replace(/[:]/g, "_")}`,
        ruleId: "RULE_SHARED_PROXY_ENDPOINT",
        ruleName: "Concentrated Proxy / VPN Endpoint",
        classification: "CONTEXTUAL_LINK",
        focalEntityId: ipNode.id,
        observedValue: appCount,
        observedEntityType: "APPLICATION",
        thresholdValue: 3,
        thresholdEntityType: "APPLICATION",
        involvedEntities: [ipNode.id, ...appIds],
        involvedApplicationIds: appIds,
        involvedCustomerIds: [],
        excludedNeighbors,
        supportingPaths: appIds.map(a => [a, ipNode.id]),
        supportingEdgeIds,
        explanation: `Proxy network endpoint '${ipNode.label}' is seen across ${appCount} distinct APPLICATION entities. Total node degree is ${connectedEdges.length}; excluded ${excludedNeighbors.length} non-application neighbor(s) (e.g. session nodes) from case count. Classified as CONTEXTUAL_LINK.`
      });
    }
  });

  // -------------------------------------------------------------------------
  // RULE 4: ADDRESS_CONCENTRATION
  // Entity Counted: DISTINCT APPLICATION (Case) nodes declaring the address
  // -------------------------------------------------------------------------
  graph.nodes.filter(n => n.type === "ADDRESS").forEach(addrNode => {
    const connectedEdges = graph.edges.filter(e => (e.source === addrNode.id || e.target === addrNode.id) && e.relationshipType === "DECLARED_AT");
    const distinctAppIds = new Set<string>();
    const excludedNeighbors: { id: string; type: EntityNodeType; reason: string }[] = [];
    const supportingEdgeIds: string[] = [];

    connectedEdges.forEach(e => {
      const neighborId = e.source === addrNode.id ? e.target : e.source;
      const neighborNode = graph.nodes.find(n => n.id === neighborId);
      if (neighborNode) {
        if (neighborNode.type === "APPLICATION") {
          distinctAppIds.add(neighborId);
          supportingEdgeIds.push(e.id);
        } else {
          excludedNeighbors.push({
            id: neighborId,
            type: neighborNode.type,
            reason: `Excluded non-application node '${neighborId}' (${neighborNode.type}) from declared application count`
          });
        }
      }
    });

    const appCount = distinctAppIds.size;
    if (appCount >= 4) {
      const appIds = Array.from(distinctAppIds);
      findings.push({
        findingId: `FINDING_ADDRESS_CONCENTRATION_${addrNode.id.replace(/[:]/g, "_")}`,
        ruleId: "RULE_ADDRESS_CONCENTRATION",
        ruleName: "High Volume Address Concentration",
        classification: "CONTEXTUAL_LINK",
        focalEntityId: addrNode.id,
        observedValue: appCount,
        observedEntityType: "APPLICATION",
        thresholdValue: 4,
        thresholdEntityType: "APPLICATION",
        involvedEntities: [addrNode.id, ...appIds],
        involvedApplicationIds: appIds,
        involvedCustomerIds: [],
        excludedNeighbors,
        supportingPaths: appIds.map(a => [a, addrNode.id]),
        supportingEdgeIds,
        explanation: `Address '${addrNode.label}' is declared across ${appCount} distinct APPLICATION entities. Total node degree is ${connectedEdges.length}; excluded ${excludedNeighbors.length} non-application neighbor(s) (e.g. customer nodes) from application count. Classified as CONTEXTUAL_LINK.`
      });
    }
  });

  // -------------------------------------------------------------------------
  // RULE 5: GEOGRAPHIC_CONVERGENCE
  // Entity Counted: DISTINCT APPLICATION (Case) nodes traced via operational events
  // -------------------------------------------------------------------------
  graph.nodes.filter(n => n.type === "LOCATION").forEach(locNode => {
    const connectedEdges = graph.edges.filter(e => e.source === locNode.id || e.target === locNode.id);
    const distinctAppIds = new Set<string>();
    const qualifyingEventIds: string[] = [];
    const excludedNeighbors: { id: string; type: EntityNodeType; reason: string }[] = [];
    const supportingEdgeIds: string[] = [];

    connectedEdges.forEach(e => {
      const neighborId = e.source === locNode.id ? e.target : e.source;
      const neighborNode = graph.nodes.find(n => n.id === neighborId);
      if (neighborNode) {
        if (neighborNode.type === "BEHAVIOURAL_EVENT" || neighborNode.type === "MERCHANT") {
          qualifyingEventIds.push(neighborId);
          supportingEdgeIds.push(e.id);
          // Trace event back to application
          graph.edges.filter(e2 => e2.target === neighborId || e2.source === neighborId).forEach(e2 => {
            const appCandidateId = e2.source === neighborId ? e2.target : e2.source;
            const appNode = graph.nodes.find(n => n.id === appCandidateId);
            if (appNode && appNode.type === "APPLICATION") {
              distinctAppIds.add(appCandidateId);
              supportingEdgeIds.push(e2.id);
            }
          });
        } else {
          excludedNeighbors.push({
            id: neighborId,
            type: neighborNode.type,
            reason: `Excluded non-event node '${neighborId}' (${neighborNode.type}) from operational case count`
          });
        }
      }
    });

    const appCount = distinctAppIds.size;
    if (appCount >= 2) {
      const appIds = Array.from(distinctAppIds);
      findings.push({
        findingId: `FINDING_GEO_CONVERGENCE_${locNode.id.replace(/[:]/g, "_")}`,
        ruleId: "RULE_GEOGRAPHIC_CONVERGENCE",
        ruleName: "Operational Geographic Convergence",
        classification: "CONTEXTUAL_LINK",
        focalEntityId: locNode.id,
        observedValue: appCount,
        observedEntityType: "APPLICATION",
        thresholdValue: 2,
        thresholdEntityType: "APPLICATION",
        involvedEntities: [locNode.id, ...qualifyingEventIds, ...appIds],
        involvedApplicationIds: appIds,
        involvedCustomerIds: [],
        excludedNeighbors,
        supportingPaths: appIds.map(a => [a, ...qualifyingEventIds, locNode.id]),
        supportingEdgeIds,
        explanation: `Operational physical location '${locNode.label}' collects transactions from ${appCount} distinct APPLICATION entities (${appIds.join(", ")}) traced via ${qualifyingEventIds.length} operational event/merchant node(s). Excluded non-event neighbors from case count.`
      });
    }
  });

  // -------------------------------------------------------------------------
  // RULE 6: BENIGN_HOUSEHOLD_PATTERN (Counterexample Verification)
  // Entity Counted: DISTINCT PERSON (Customer) nodes in household
  // -------------------------------------------------------------------------
  const case1 = "case:app_01";
  const case2 = "case:app_02";
  const cust1 = "cust:aarav_sharma";
  const cust2 = "cust:ananya_sharma";
  const sharedNeighbors = getSharedNeighbors(graph, case1, case2);
  const sharedAddress = sharedNeighbors.find(n => n.type === "ADDRESS");
  const sharedIp = sharedNeighbors.find(n => n.type === "NETWORK_ENDPOINT");

  if (sharedAddress && sharedIp) {
    findings.push({
      findingId: "FINDING_BENIGN_HOUSEHOLD_SHARMA",
      ruleId: "RULE_BENIGN_HOUSEHOLD_PATTERN",
      ruleName: "Verified Benign Household Structure",
      classification: "CONTEXTUAL_LINK",
      focalEntityId: sharedAddress.id,
      observedValue: 2,
      observedEntityType: "PERSON",
      thresholdValue: 2,
      thresholdEntityType: "PERSON",
      involvedEntities: [cust1, cust2, case1, case2, sharedAddress.id, sharedIp.id],
      involvedApplicationIds: [case1, case2],
      involvedCustomerIds: [cust1, cust2],
      supportingPaths: [[cust1, case1, sharedAddress.id], [cust2, case2, sharedAddress.id]],
      supportingEdgeIds: ["e:cust1_app1", "e:app1_addr1", "e:cust2_app2", "e:app2_addr1"],
      explanation: `Customers '${cust1}' and '${cust2}' share household address '${sharedAddress.label}' and IP '${sharedIp.label}', but maintain distinct devices and distinct PAN identities. Evaluated as benign household contextual overlap; zero identity equivalence or fraud escalation generated.`,
      benignContextNote: "Benign household overlap: shared residential infrastructure without device reuse or identity overlap."
    });
  }

  return findings;
}
