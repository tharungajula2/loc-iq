import primaryIdentifiers from '../data/data_primary_identifiers.json';
import apiUniverse from '../data/data_api_universe.json';
import dataFields from '../data/data_fetched_data_fields.json';
import masterclassData from '../data/masterclass.json';
import { curatedMappingRegistry } from './knowledgeGraphCurated';
import { 
  KnowledgeGraphNode, 
  KnowledgeGraphEdge, 
  KnowledgeGraph, 
  PrimaryIdentifierDef, 
  ApiUniverseDef, 
  DataFieldDef 
} from '../types';

export interface UnresolvedReport {
  unmappedSources: string[];
  unmappedFields: string[];
  unmappedTopics: string[];
}

export function buildKnowledgeGraph(): KnowledgeGraph {
  const nodes: KnowledgeGraphNode[] = [];
  const nodeMap = new Map<string, KnowledgeGraphNode>();

  // 1. IDENTIFIER Nodes (6)
  (primaryIdentifiers as PrimaryIdentifierDef[]).forEach(i => {
    const node: KnowledgeGraphNode = {
      id: `id:${i.identifier}`,
      label: i.identifier,
      type: 'IDENTIFIER',
      catalogueId: i.identifier,
      category: i.category,
      description: i.what_it_means,
      metadata: {
        where_it_comes_from: i.where_it_comes_from,
        why_it_matters: i.why_it_matters,
        what_it_unlocks: i.what_it_unlocks,
        example: i.example
      }
    };
    nodes.push(node);
    nodeMap.set(node.id, node);
  });

  // 2. DATA_SOURCE Nodes (46)
  (apiUniverse as ApiUniverseDef[]).forEach(a => {
    const node: KnowledgeGraphNode = {
      id: `api:${a.id}`,
      label: a.source,
      type: 'DATA_SOURCE',
      catalogueId: a.id,
      accessMode: a.access,
      description: a.why_it_matters,
      metadata: {
        input_needed: a.input_needed,
        what_it_returns: a.what_it_returns,
        remarks: a.remarks,
        example_link: a.example_link
      }
    };
    nodes.push(node);
    nodeMap.set(node.id, node);
  });

  // 3. FETCHED_FIELD Nodes (42)
  (dataFields as DataFieldDef[]).forEach(f => {
    const node: KnowledgeGraphNode = {
      id: `field:${f.data_field}`,
      label: f.data_field,
      type: 'FETCHED_FIELD',
      catalogueId: f.id || f.data_field,
      category: f.category,
      sitsIn: f.sits_in,
      description: f.what_it_means,
      metadata: {
        fetched_using_key: f.fetched_using_key,
        where_it_comes_from: f.where_it_comes_from,
        why_it_matters: f.why_it_matters,
        lookup_api: f.lookup_api,
        example: f.example
      }
    };
    nodes.push(node);
    nodeMap.set(node.id, node);
  });

  // 4. DERIVED_SIGNAL Nodes (77)
  const derivedSignalsList: Array<{
    derived_variable: string;
    parent_field: string;
    category: string;
    description: string;
  }> = [];

  (dataFields as DataFieldDef[]).forEach(f => {
    if (!f.derived_columns || f.derived_columns.includes('(not used')) return;
    f.derived_columns.split('. ').forEach(dc => {
      const parts = dc.split('=');
      if (parts.length >= 2) {
        derivedSignalsList.push({
          derived_variable: parts[0].trim(),
          parent_field: f.data_field,
          category: f.category,
          description: parts.slice(1).join('=').trim()
        });
      }
    });
  });

  derivedSignalsList.forEach(s => {
    const node: KnowledgeGraphNode = {
      id: `sig:${s.derived_variable}`,
      label: s.derived_variable,
      type: 'DERIVED_SIGNAL',
      catalogueId: s.derived_variable,
      category: s.category,
      description: s.description,
      metadata: {
        parent_field: s.parent_field
      }
    };
    nodes.push(node);
    nodeMap.set(node.id, node);
  });

  // 5. KNOWLEDGE_TOPIC Nodes (102)
  Object.entries(masterclassData as Record<string, string>).forEach(([topic, text]) => {
    const node: KnowledgeGraphNode = {
      id: `doc:${topic}`,
      label: topic,
      type: 'KNOWLEDGE_TOPIC',
      catalogueId: topic,
      description: text.slice(0, 150) + '...',
      metadata: {
        full_text: text
      }
    };
    nodes.push(node);
    nodeMap.set(node.id, node);
  });

  // ----------------------------------------------------
  // EDGE GENERATION (DIRECT, NORMALIZED, CURATED ONLY)
  // ----------------------------------------------------
  const edges: KnowledgeGraphEdge[] = [];
  let edgeCounter = 0;

  // Rule 1: FETCHED_FIELD --DERIVES_SIGNAL--> DERIVED_SIGNAL (DIRECT - 77 edges)
  derivedSignalsList.forEach(s => {
    const sourceId = `field:${s.parent_field}`;
    const targetId = `sig:${s.derived_variable}`;
    if (nodeMap.has(sourceId) && nodeMap.has(targetId)) {
      edges.push({
        id: `ke_${++edgeCounter}`,
        source: sourceId,
        target: targetId,
        relationshipType: 'DERIVES_SIGNAL',
        certainty: 'DIRECT',
        sourceDataset: 'data_fetched_data_fields.json',
        sourceProperty: 'derived_columns',
        explanation: `Derived variable '${s.derived_variable}' is explicitly defined under parent field '${s.parent_field}'.`
      });
    }
  });

  // Rule 2: DATA_SOURCE --RETURNS_FIELD--> FETCHED_FIELD (NORMALIZED - 29 edges)
  (dataFields as DataFieldDef[]).forEach(f => {
    if (!f.lookup_api) return;
    const targetId = `field:${f.data_field}`;
    
    (apiUniverse as ApiUniverseDef[]).forEach(a => {
      // Unambiguous normalized mapping via explicit lookup_api code match
      if (a.id.includes(f.lookup_api!) || f.lookup_api!.includes(a.id)) {
        edges.push({
          id: `ke_${++edgeCounter}`,
          source: `api:${a.id}`,
          target: targetId,
          relationshipType: 'RETURNS_FIELD',
          certainty: 'NORMALIZED',
          sourceDataset: 'data_fetched_data_fields.json',
          sourceProperty: 'lookup_api',
          explanation: `API source '${a.source}' is normalized to return field '${f.data_field}' via lookup_api key '${f.lookup_api}'.`
        });
      }
    });
  });

  // Rule 3: CURATED Mapping Registry Glue
  curatedMappingRegistry.forEach(c => {
    if (nodeMap.has(c.sourceId) && nodeMap.has(c.targetId)) {
      edges.push({
        id: `ke_${++edgeCounter}`,
        source: c.sourceId,
        target: c.targetId,
        relationshipType: c.relationshipType,
        certainty: c.certainty,
        sourceDataset: c.sourceDataset,
        sourceProperty: c.sourceProperty,
        explanation: c.explanation
      });
    }
  });

  return { nodes, edges };
}

// Deterministic explanation utility for relationship inspection
export function whyConnected(edge: KnowledgeGraphEdge): string {
  return `${edge.explanation} [Provenance: ${edge.certainty} via ${edge.sourceDataset} -> ${edge.sourceProperty}]`;
}

// Lineage traversal utility
export function getLineageTrace(graph: KnowledgeGraph, startNodeId: string): string[][] {
  const paths: string[][] = [];

  function traverse(currentId: string, currentPath: string[]) {
    const outgoing = graph.edges.filter(e => e.source === currentId);
    if (outgoing.length === 0) {
      if (currentPath.length > 1) {
        paths.push([...currentPath]);
      }
      return;
    }
    outgoing.forEach(e => {
      traverse(e.target, [...currentPath, e.target]);
    });
  }

  traverse(startNodeId, [startNodeId]);
  return paths;
}

// Unweighted Shortest Path (BFS)
export function getShortestPath(graph: KnowledgeGraph, sourceId: string, targetId: string): string[] | null {
  if (sourceId === targetId) return [sourceId];
  if (!graph.nodes.some(n => n.id === sourceId) || !graph.nodes.some(n => n.id === targetId)) {
    return null;
  }

  const queue: string[][] = [[sourceId]];
  const visited = new Set<string>([sourceId]);

  while (queue.length > 0) {
    const path = queue.shift()!;
    const lastNode = path[path.length - 1];

    const neighbors = graph.edges
      .filter(e => e.source === lastNode || e.target === lastNode)
      .map(e => (e.source === lastNode ? e.target : e.source));

    for (const neighbor of neighbors) {
      if (neighbor === targetId) {
        return [...path, neighbor];
      }
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push([...path, neighbor]);
      }
    }
  }

  return null;
}

// Connected Components Analysis
export function getConnectedComponents(graph: KnowledgeGraph): string[][] {
  const visited = new Set<string>();
  const components: string[][] = [];

  const adj = new Map<string, Set<string>>();
  graph.nodes.forEach(n => adj.set(n.id, new Set()));
  graph.edges.forEach(e => {
    adj.get(e.source)?.add(e.target);
    adj.get(e.target)?.add(e.source);
  });

  graph.nodes.forEach(node => {
    if (!visited.has(node.id)) {
      const component: string[] = [];
      const queue: string[] = [node.id];
      visited.add(node.id);

      while (queue.length > 0) {
        const current = queue.shift()!;
        component.push(current);

        adj.get(current)?.forEach(neighbor => {
          if (!visited.has(neighbor)) {
            visited.add(neighbor);
            queue.push(neighbor);
          }
        });
      }
      components.push(component);
    }
  });

  return components;
}

// Diagnostic Report Generator
export function getUnresolvedReport(graph: KnowledgeGraph): UnresolvedReport {
  const apiNodes = graph.nodes.filter(n => n.type === 'DATA_SOURCE');
  const fieldNodes = graph.nodes.filter(n => n.type === 'FETCHED_FIELD');
  const topicNodes = graph.nodes.filter(n => n.type === 'KNOWLEDGE_TOPIC');

  const connectedSources = new Set(graph.edges.filter(e => e.source.startsWith('api:') || e.target.startsWith('api:')).flatMap(e => [e.source, e.target]));
  const connectedFields = new Set(graph.edges.filter(e => e.source.startsWith('field:') || e.target.startsWith('field:')).flatMap(e => [e.source, e.target]));
  const connectedTopics = new Set(graph.edges.filter(e => e.source.startsWith('doc:') || e.target.startsWith('doc:')).flatMap(e => [e.source, e.target]));

  const unmappedSources = apiNodes.filter(n => !connectedSources.has(n.id)).map(n => n.label);
  const unmappedFields = fieldNodes.filter(n => !connectedFields.has(n.id)).map(n => n.label);
  const unmappedTopics = topicNodes.filter(n => !connectedTopics.has(n.id)).map(n => n.label);

  return {
    unmappedSources,
    unmappedFields,
    unmappedTopics
  };
}
