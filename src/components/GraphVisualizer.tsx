"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import { ReactFlow, Controls, Background, BackgroundVariant, applyNodeChanges, applyEdgeChanges, NodeChange, EdgeChange, Node, Edge, MarkerType } from "@xyflow/react";
import '@xyflow/react/dist/style.css';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, StepForward, RotateCcw, MapPin, Target, Database, Activity, LayoutGrid } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { renderPrimaryIdentifierDetail, renderDataFieldDetail, renderDerivedColumnDetail, renderApiUniverseDetail } from "@/components/DetailPanels";

export const GraphVisualizer: React.FC = () => {
  const { isAnalyzing, currentTrace, catalogue } = useAppContext();

  const [selectedNode, setSelectedNode] = useState<{ type: string; item: any; label: string } | null>(null);

  const derivedCatalogue = useMemo(() => {
    return catalogue.fields.flatMap(field => {
      if (!field.derived_columns || field.derived_columns.includes('(not used')) return [];
      return field.derived_columns.split('. ').map(dc => {
        const parts = dc.split('=');
        if (parts.length < 2) return null;
        return {
          derived_variable: parts[0].trim(),
          parent_field: field.data_field,
          category: field.category,
          description: parts.slice(1).join('=').trim()
        };
      }).filter((item): item is NonNullable<typeof item> => Boolean(item));
    });
  }, [catalogue.fields]);

  const universe = useMemo(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];
    
    const layerX = { l1: 50, l2: 300, l3: 550, l4: 800, l5: 1100, l6: 1400 };
    
    const getStartY = (count: number, gap: number = 80) => {
      const totalH = count * gap;
      return 2310 - (totalH / 2);
    };

    let y1 = getStartY(catalogue.identifiers.length, 120);
    catalogue.identifiers.forEach(id => {
      nodes.push({ id: `id_${id.identifier}`, position: { x: layerX.l1, y: y1 }, data: { label: id.identifier, item: id, type: 'identifier' }, type: 'default' });
      y1 += 120;
    });

    let y2 = getStartY(catalogue.apis.length, 70);
    catalogue.apis.forEach(api => {
      nodes.push({ id: `api_${api.source}`, position: { x: layerX.l2, y: y2 }, data: { label: api.source, item: api, type: 'api' }, type: 'default' });
      y2 += 70;
    });

    let y3 = getStartY(catalogue.fields.length, 70);
    catalogue.fields.forEach(f => {
      nodes.push({ id: `fetch_${f.data_field}`, position: { x: layerX.l3, y: y3 }, data: { label: f.data_field, item: f, type: 'field' }, type: 'default' });
      y3 += 70;
    });

    let y4 = getStartY(derivedCatalogue.length, 55);
    derivedCatalogue.forEach(d => {
      nodes.push({ id: `derived_${d.derived_variable}`, position: { x: layerX.l4, y: y4 }, data: { label: d.derived_variable, item: d, type: 'derived' }, type: 'default' });
      y4 += 55;
    });

    let candidateLocations: any[] = [];
    if (currentTrace) {
      const locSet = new Set(currentTrace.signals.map(s => JSON.stringify({ id: s.location_id, label: s.location_label })));
      candidateLocations = Array.from(locSet).map(s => JSON.parse(s as string));
    }
    let y5 = getStartY(candidateLocations.length, 150);
    candidateLocations.forEach(loc => {
      nodes.push({ id: `loc_${loc.id}`, position: { x: layerX.l5, y: y5 }, data: { label: loc.label, item: loc, type: 'location' }, type: 'default' });
      y5 += 150;
    });

    if (currentTrace && currentTrace.expected_output) {
      nodes.push({ id: `output_node`, position: { x: layerX.l6, y: 2310 }, data: { label: `[OUTPUT] \n${currentTrace.expected_output.truth_flag}\n${currentTrace.expected_output.top_candidate}`, item: currentTrace.expected_output, type: 'output' }, type: 'default' });
    }

    // Edges
    catalogue.apis.forEach(api => {
      const inputNeeded = api.input_needed?.toLowerCase() || '';
      catalogue.identifiers.forEach(id => {
        if (inputNeeded.includes(id.identifier.toLowerCase()) || inputNeeded.includes('identifiers')) {
          edges.push({ id: `e_id_${id.identifier}_api_${api.source}`, source: `id_${id.identifier}`, target: `api_${api.source}`, data: { type: 'universe' } });
        }
      });
    });

    catalogue.fields.forEach(field => {
      const lookupApi = field.lookup_api?.toLowerCase() || '';
      catalogue.apis.forEach(api => {
        if (lookupApi.includes(api.source.toLowerCase())) {
          edges.push({ id: `e_api_${api.source}_fetch_${field.data_field}`, source: `api_${api.source}`, target: `fetch_${field.data_field}`, data: { type: 'universe' } });
        }
      });
    });

    derivedCatalogue.forEach(d => {
      edges.push({ id: `e_fetch_${d.parent_field}_derived_${d.derived_variable}`, source: `fetch_${d.parent_field}`, target: `derived_${d.derived_variable}`, data: { type: 'universe' } });
    });

    return { nodes, edges, candidateLocations };
  }, [catalogue, derivedCatalogue, currentTrace]);

  const activePath = useMemo(() => {
    const nSet = new Set<string>();
    const eMap = new Map<string, { weight: number, color: string, label: string }>();
    if (!currentTrace) return { activeNodes: nSet, activeEdges: eMap };

    Object.keys(currentTrace.input).forEach(k => nSet.add(`id_${k}`));

    const activeApis = new Set(currentTrace.fetchedFields.map(f => f.source_api));
    activeApis.forEach(api => nSet.add(`api_${api}`));

    activeApis.forEach(api => {
      Object.keys(currentTrace.input).forEach(k => {
        eMap.set(`e_id_${k}_api_${api}`, { weight: 0.5, color: '#3b82f6', label: '' });
      });
    });

    currentTrace.fetchedFields.forEach(f => {
      nSet.add(`fetch_${f.data_field}`);
      eMap.set(`e_api_${f.source_api}_fetch_${f.data_field}`, { weight: 1, color: '#0ea5e9', label: '' });
    });

    currentTrace.signals.forEach((s) => {
      const signalNodeId = `derived_${s.signal}`;
      nSet.add(signalNodeId);
      
      const parentField = currentTrace.fetchedFields.find(f => f.source_api === s.source_api);
      if (parentField) {
        eMap.set(`e_fetch_${parentField.data_field}_${signalNodeId}`, { weight: 1, color: '#10b981', label: '' });
      }

      const effWeight = s.base_weight * s.recency_factor * s.ip_trust_factor;
      const color = s.ip_trust_factor < 1.0 ? '#ef4444' : '#10b981';
      
      const locId = `loc_${s.location_id}`;
      nSet.add(locId);

      eMap.set(`e_${signalNodeId}_${locId}`, { weight: effWeight, color, label: `${(effWeight * 100).toFixed(0)}%` });
    });

    if (currentTrace.expected_output) {
      nSet.add('output_node');
      const outColor = currentTrace.expected_output.truth_flag === 'GREEN' ? '#10b981' : currentTrace.expected_output.truth_flag === 'RED' ? '#ef4444' : '#f59e0b';
      currentTrace.expected_output.ranked.forEach(rank => {
        const matchingLoc = universe.candidateLocations.find(l => l.label.includes(rank.location));
        if (matchingLoc) {
          eMap.set(`e_loc_${matchingLoc.id}_output_node`, { weight: rank.confidence / 100, color: rank.rank === 1 ? outColor : '#475569', label: `Rank ${rank.rank}` });
        }
      });
    }

    return { activeNodes: nSet, activeEdges: eMap };
  }, [currentTrace, universe]);

  const coloredNodes = useMemo(() => {
    return universe.nodes.map(n => {
      const isActive = activePath.activeNodes.has(n.id);
      
      let color = '#94a3b8';
      let label = n.data.label as string;
      
      if (n.data.type === 'identifier') color = '#a855f7';
      if (n.data.type === 'api') color = '#3b82f6';
      if (n.data.type === 'field') {
        color = '#0ea5e9';
        if (isActive && currentTrace) {
          const field = currentTrace.fetchedFields.find(f => f.data_field === label);
          if (field?.proxy) color = '#ef4444';
          if (field) label = `${label}\n[${field.value}]`;
        }
      }
      if (n.data.type === 'derived') {
        color = '#10b981';
        if (isActive && currentTrace) {
          const sig = currentTrace.signals.find(s => s.signal === label);
          if (sig && sig.ip_trust_factor < 1.0) color = '#ef4444';
          if (sig) label = `${label}\nwt: ${(sig.base_weight * sig.recency_factor * sig.ip_trust_factor).toFixed(2)}`;
        }
      }
      if (n.data.type === 'location') color = '#f59e0b';
      if (n.data.type === 'output' && currentTrace?.expected_output) {
        color = currentTrace.expected_output.truth_flag === 'GREEN' ? '#10b981' : currentTrace.expected_output.truth_flag === 'RED' ? '#ef4444' : '#f59e0b';
      }

      return {
        ...n,
        hidden: false,
        data: { ...n.data, label },
        style: {
          background: `${color}15`,
          color: color,
          border: `1px solid ${color}`,
          borderRadius: '8px',
          padding: '8px',
          fontSize: '10px',
          fontFamily: 'monospace',
          textAlign: 'center' as const,
          boxShadow: `0 0 10px ${color}40`,
          width: 150,
          opacity: 1,
          transition: 'all 0.4s ease'
        }
      };
    });
  }, [universe.nodes, activePath.activeNodes, currentTrace]);

  const styledEdges = useMemo(() => {
    return universe.edges.map(e => {
      const activeEdge = activePath.activeEdges.get(e.id);
      const isActive = !!activeEdge;
      
      const sNode = universe.nodes.find(n => n.id === e.source);
      let defaultColor = '#475569';
      if (sNode) {
        if (sNode.data.type === 'identifier') defaultColor = '#a855f750';
        if (sNode.data.type === 'api') defaultColor = '#3b82f650';
        if (sNode.data.type === 'field') defaultColor = '#0ea5e950';
        if (sNode.data.type === 'derived') defaultColor = '#10b98150';
      }

      const color = activeEdge ? activeEdge.color : defaultColor;
      const weight = activeEdge ? activeEdge.weight : 0.5;
      const label = activeEdge ? activeEdge.label : undefined;

      return {
        ...e,
        hidden: false,
        label,
        animated: true,
        style: { stroke: color, strokeWidth: Math.max(1.5, weight * 4), opacity: isActive ? 1 : 0.6, transition: 'all 0.4s ease' },
        markerEnd: { type: MarkerType.ArrowClosed, color: color },
        labelStyle: { fill: color, fontSize: 10, fontWeight: 700 },
        labelBgStyle: { fill: '#0f172a', fillOpacity: 0.8 }
      };
    });
  }, [universe.edges, activePath.activeEdges, currentTrace, universe.nodes]);



  if (!isAnalyzing && !currentTrace) {
    return (
      <div className="w-full h-full min-h-[600px] flex flex-col items-center justify-center bg-muted/5 rounded-xl border border-border/50">
        <div className="w-16 h-16 border border-muted-foreground/30 rounded-full flex items-center justify-center animate-pulse mb-4">
           <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
        </div>
        <p className="text-muted-foreground tracking-widest uppercase text-xs font-semibold">System Standby: Awaiting Trace Initiation</p>
      </div>
    );
  }

  if (isAnalyzing) {
    return (
      <div className="w-full h-full min-h-[600px] flex flex-col items-center justify-center bg-blue-900/5 rounded-xl border border-blue-900/30">
        <div className="relative w-32 h-32 flex items-center justify-center mb-6">
           <div className="absolute inset-0 border-4 border-blue-900 border-t-primary rounded-full animate-spin"></div>
           <div className="absolute inset-4 border-4 border-emerald-900/50 border-b-green-500 rounded-full animate-[spin_2s_linear_infinite_reverse]"></div>
        </div>
        <p className="text-primary tracking-widest uppercase text-xs font-bold animate-pulse">Establishing Network Vectors...</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full min-h-[700px] flex flex-col rounded-xl overflow-hidden border border-border/50 shadow-2xl">
      <div className="absolute top-4 left-4 z-10 pointer-events-none">
        {/* Legend */}
        <div className="bg-background/90 backdrop-blur border rounded-lg p-3 text-xs pointer-events-auto shadow-lg flex flex-col gap-2">
          <h4 className="font-bold text-muted-foreground uppercase tracking-wider mb-1">Graph Legend</h4>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-purple-500"/> Identifiers</div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-500"/> APIs / Sources</div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-sky-500"/> Data Fields</div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-500"/> Derived Signals</div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-amber-500"/> Candidate Locations</div>
          <div className="mt-2 pt-2 border-t text-[10px] text-muted-foreground font-mono">
            Nodes: {universe.nodes.length} | Active: {activePath.activeNodes.size}
          </div>
        </div>
      </div>

      <ReactFlow
        nodes={coloredNodes}
        edges={styledEdges}
        onNodesChange={() => {}}
        onEdgesChange={() => {}}
        onNodeClick={(_, node) => {
           const data = node.data as any;
           if (data.item) {
             let resolvedItem = data.item;
             if (currentTrace) {
               if (data.type === 'field') {
                 const fieldTrace = currentTrace.fetchedFields.find(f => f.data_field === data.item.data_field);
                 if (fieldTrace) resolvedItem = { ...fieldTrace, _catalogueRef: data.item };
               } else if (data.type === 'derived') {
                 const sigTrace = currentTrace.signals.find(s => s.signal === data.item.derived_variable);
                 if (sigTrace) resolvedItem = { ...sigTrace, _catalogueRef: data.item };
               }
             }
             setSelectedNode({ type: data.type as string, item: resolvedItem, label: data.label as string });
           }
        }}
        fitView
        className="bg-slate-950 flex-1"
        colorMode="dark"
        minZoom={0.1}
        maxZoom={1.5}
      >
        <Background variant={BackgroundVariant.Dots} gap={16} size={1} color="#334155" />
        <Controls className="bg-background border-border/50" />
      </ReactFlow>


      <Sheet open={!!selectedNode} onOpenChange={(open) => !open && setSelectedNode(null)}>
        <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
          <SheetHeader className="mb-6">
            <SheetTitle className="text-2xl text-primary whitespace-pre-wrap">
              {selectedNode?.label}
            </SheetTitle>
            <p className="text-sm text-muted-foreground">Deep inspection of this graph node</p>
          </SheetHeader>
          <div className="space-y-6">
            {selectedNode?.type === 'identifier' && renderPrimaryIdentifierDetail(selectedNode.item, !!currentTrace)}
            {selectedNode?.type === 'api' && renderApiUniverseDetail(selectedNode.item)}
            {selectedNode?.type === 'field' && renderDataFieldDetail(selectedNode.item, !!currentTrace)}
            {selectedNode?.type === 'derived' && renderDerivedColumnDetail(selectedNode.item, !!currentTrace)}
            {(selectedNode?.type === 'location' || selectedNode?.type === 'output') && (
              <div className="text-muted-foreground">See Output tab for detailed location scoring.</div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};
