/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useMemo } from "react";
import { useAppContext } from "../context/AppContext";
import { ReactFlow, Controls, Background, BackgroundVariant, Node, Edge, MarkerType } from "@xyflow/react";
import '@xyflow/react/dist/style.css';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { 
  renderPrimaryIdentifierDetail, 
  renderDataFieldDetail, 
  renderDerivedColumnDetail, 
  renderApiUniverseDetail 
} from "@/components/DetailPanels";
import { InvestigationNode } from "../types";

interface GraphVisualizerProps {
  onSelectNode?: (node: InvestigationNode) => void;
}

export const GraphVisualizer: React.FC<GraphVisualizerProps> = ({ onSelectNode }) => {
  const { isAnalyzing, currentTrace, catalogue } = useAppContext();
  const [selectedNode, setSelectedNode] = useState<{ type: string; item: any; label: string } | null>(null);

  const graphProjection = useMemo(() => {
    if (!currentTrace || !currentTrace.graph) {
      return { nodes: [], edges: [], candidateLocations: [] };
    }

    const activeGraph = currentTrace.graph;
    const layerX = {
      IDENTIFIER: 50,
      SOURCE: 300,
      EVIDENCE: 550,
      SIGNAL: 800,
      CANDIDATE_LOCATION: 1100,
      DECISION: 1400
    };

    // Group nodes by layer type for balanced Y-positioning
    const nodesByType = new Map<string, InvestigationNode[]>();
    activeGraph.nodes.forEach(node => {
      const list = nodesByType.get(node.type) || [];
      list.push(node);
      nodesByType.set(node.type, list);
    });

    const getStartY = (count: number, gap: number = 90) => {
      const totalH = count * gap;
      return 400 - (totalH / 2);
    };

    const flowNodes: Node[] = [];

    nodesByType.forEach((typeNodes, type) => {
      const startX = layerX[type as keyof typeof layerX] || 100;
      let startY = getStartY(typeNodes.length, type === 'IDENTIFIER' ? 90 : 80);

      typeNodes.forEach(node => {
        let color = '#94a3b8';
        let label = node.label;
        if (node.value) label += `\n[${node.value}]`;

        if (node.type === 'IDENTIFIER') color = '#a855f7';
        if (node.type === 'SOURCE') color = '#3b82f6';
        if (node.type === 'EVIDENCE') {
          color = '#0ea5e9';
          if (node.value?.includes('Proxy Detected') || node.isSimulated) color = node.value?.includes('Proxy Detected') ? '#ef4444' : '#0ea5e9';
        }
        if (node.type === 'SIGNAL') {
          color = '#10b981';
          const meta = node.metadata as Record<string, number> | undefined;
          if (meta && typeof meta.ip_trust_factor === 'number' && meta.ip_trust_factor < 1.0) color = '#ef4444';
        }
        if (node.type === 'CANDIDATE_LOCATION') color = '#f59e0b';
        if (node.type === 'DECISION') {
          color = activeGraph.addressConsistency === 'CONSISTENT' ? '#10b981' : activeGraph.addressConsistency === 'CONFLICT' ? '#ef4444' : '#f59e0b';
          label = `[ADDRESS CONSISTENCY]\n${activeGraph.addressConsistency}\n${activeGraph.topCandidate}`;
        }

        flowNodes.push({
          id: node.id,
          type: 'default',
          position: { x: startX, y: startY },
          data: { label, item: node, rawType: node.type },
          style: {
            background: `${color}18`,
            color: color,
            border: `1px solid ${color}`,
            borderRadius: '8px',
            padding: '10px',
            fontSize: '11px',
            fontFamily: 'monospace',
            textAlign: 'center' as const,
            boxShadow: `0 0 12px ${color}35`,
            width: 160,
            transition: 'all 0.4s ease'
          }
        });

        startY += (type === 'IDENTIFIER' ? 90 : 80);
      });
    });

    const flowEdges: Edge[] = activeGraph.edges.map(edge => {
      let strokeColor = '#3b82f6';
      if (edge.relationshipType === 'CONTRADICTS') strokeColor = '#ef4444';
      if (edge.relationshipType === 'SUPPORTS') strokeColor = '#10b981';
      if (edge.relationshipType === 'EXTRACTS') strokeColor = '#0ea5e9';

      const weightLabel = edge.effectiveWeight > 0 ? `${(edge.effectiveWeight * 100).toFixed(0)}%` : undefined;

      return {
        id: edge.id,
        source: edge.source,
        target: edge.target,
        animated: true,
        label: weightLabel,
        style: { 
          stroke: strokeColor, 
          strokeWidth: Math.max(1.8, edge.effectiveWeight * 4.5), 
          opacity: 0.9 
        },
        markerEnd: { type: MarkerType.ArrowClosed, color: strokeColor },
        labelStyle: { fill: strokeColor, fontSize: 10, fontWeight: 700 },
        labelBgStyle: { fill: '#0f172a', fillOpacity: 0.85 }
      };
    });

    return { nodes: flowNodes, edges: flowEdges, candidateLocations: activeGraph.candidates };
  }, [currentTrace]);

  if (!isAnalyzing && !currentTrace) {
    return (
      <div className="w-full h-full min-h-[600px] flex flex-col items-center justify-center bg-muted/5 rounded-xl border border-border/50">
        <div className="w-16 h-16 border border-muted-foreground/30 rounded-full flex items-center justify-center animate-pulse mb-4">
          <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
        </div>
        <p className="text-muted-foreground tracking-widest uppercase text-xs font-semibold">System Standby: Select a Scenario to Build Investigation Graph</p>
      </div>
    );
  }

  if (isAnalyzing) {
    return (
      <div className="w-full h-full min-h-[600px] flex flex-col items-center justify-center bg-blue-900/5 rounded-xl border border-blue-900/30">
        <div className="relative w-28 h-28 flex items-center justify-center mb-6">
          <div className="absolute inset-0 border-4 border-blue-900 border-t-primary rounded-full animate-spin"></div>
        </div>
        <p className="text-primary tracking-widest uppercase text-xs font-bold animate-pulse">Resolving Canonical Investigation Graph...</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full min-h-[700px] flex flex-col rounded-xl overflow-hidden border border-border/50 shadow-2xl">
      <div className="absolute top-4 left-4 z-10 pointer-events-none">
        <div className="bg-background/90 backdrop-blur border rounded-lg p-3 text-xs pointer-events-auto shadow-lg flex flex-col gap-2">
          <h4 className="font-bold text-muted-foreground uppercase tracking-wider mb-1">Active Investigation Graph</h4>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-purple-500"/> Seed Keys</div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-500"/> Evidence Providers</div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-sky-500"/> Evidence Observations</div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-500"/> Derived Signals</div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-amber-500"/> Candidate Locations</div>
          <div className="mt-2 pt-2 border-t text-[10px] text-muted-foreground font-mono">
            Nodes: {graphProjection.nodes.length} | Edges: {graphProjection.edges.length}
          </div>
        </div>
      </div>

      <ReactFlow
        nodes={graphProjection.nodes}
        edges={graphProjection.edges}
        onNodesChange={() => {}}
        onEdgesChange={() => {}}
        onNodeClick={(_, node) => {
          const data = node.data as any;
          if (data.item) {
            const rawNode = data.item as InvestigationNode;
            let resolvedItem: any = rawNode;

            if (rawNode.type === 'IDENTIFIER') {
              const catId = catalogue.identifiers.find(i => i.identifier === rawNode.label);
              if (catId) resolvedItem = catId;
            } else if (rawNode.type === 'SOURCE') {
              const catApi = catalogue.apis.find(a => a.source === rawNode.label);
              if (catApi) resolvedItem = catApi;
            } else if (rawNode.type === 'EVIDENCE') {
              const traceField = currentTrace?.fetchedFields.find(f => f.data_field === rawNode.label);
              const catField = catalogue.fields.find(f => f.data_field === rawNode.label);
              resolvedItem = traceField ? { ...traceField, _catalogueRef: catField } : catField;
            } else if (rawNode.type === 'SIGNAL') {
              const sigTrace = currentTrace?.signals.find(s => s.signal === rawNode.label);
              resolvedItem = sigTrace || rawNode;
            }

            setSelectedNode({
              type: rawNode.type.toLowerCase(),
              item: resolvedItem,
              label: rawNode.label
            });
            if (onSelectNode) {
              onSelectNode(rawNode);
            }
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
            <p className="text-sm text-muted-foreground">Canonical Investigation Node Details</p>
          </SheetHeader>
          <div className="space-y-6">
            {(selectedNode?.type === 'identifier' || selectedNode?.type === 'seed') && renderPrimaryIdentifierDetail(selectedNode.item, true)}
            {(selectedNode?.type === 'source' || selectedNode?.type === 'api') && renderApiUniverseDetail(selectedNode.item)}
            {(selectedNode?.type === 'evidence' || selectedNode?.type === 'field') && renderDataFieldDetail(selectedNode.item, true)}
            {(selectedNode?.type === 'signal' || selectedNode?.type === 'derived') && renderDerivedColumnDetail(selectedNode.item, true)}
            {(selectedNode?.type === 'candidate_location' || selectedNode?.type === 'decision') && (
              <div className="text-muted-foreground text-sm">
                See the Output tab for detailed location candidate ranking, supporting evidence, and contradiction breakdowns.
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};
