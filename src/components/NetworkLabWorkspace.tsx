"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import {
  ReactFlow,
  Node as FlowNode,
  Edge as FlowEdge,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  MarkerType,
  useReactFlow,
  ReactFlowProvider
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { 
  Network, Search, Compass, ShieldAlert, 
  Route, X, RefreshCw, ExternalLink, AlertCircle, 
  CheckCircle2, Layers
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import { buildSyntheticEntityNetwork } from "@/lib/entityNetworkData";
import { 
  getShortestPath, 
  detectNetworkPatterns 
} from "@/lib/entityNetworkAnalytics";
import { 
  EntityNetworkNode, 
  EntityNetworkEdge, 
  EntityNodeType
} from "@/types";

import { EntityNodeComponent } from "./EntityNodeComponent";

const nodeTypes = {
  entityNode: EntityNodeComponent
};

interface NetworkLabWorkspaceProps {
  onOpenCaseInvestigation?: (caseId: string) => void;
  onViewDataLineage?: (kgConceptId: string) => void;
  onOpenMasterData?: (catalogueId?: string) => void;
  onClose?: () => void;
}

const NetworkLabContent: React.FC<NetworkLabWorkspaceProps> = ({
  onOpenCaseInvestigation,
  onViewDataLineage,
  onOpenMasterData,
  onClose
}) => {
  const fullGraph = useMemo(() => buildSyntheticEntityNetwork(), []);
  const allFindings = useMemo(() => detectNetworkPatterns(fullGraph), [fullGraph]);

  // Mode Selection: "FINDINGS" | "EXPLORE" | "PATH"
  const [activeMode, setActiveMode] = useState<"FINDINGS" | "EXPLORE" | "PATH">("FINDINGS");
  
  // Active Selected Finding (Default to SHARED_DEVICE)
  const [selectedFindingId, setSelectedFindingId] = useState<string>(
    allFindings[0]?.findingId || "FINDING_SHARED_DEVICE_dev_shared_rig_04"
  );

  // Active Selected Node or Edge for Inspector
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);

  // Search Query for Explore Mode
  const [searchQuery, setSearchQuery] = useState("");

  // Path Finder State
  const [pathSourceId, setPathSourceId] = useState<string>("cust:ramesh_kumar");
  const [pathTargetId, setPathTargetId] = useState<string>("cust:suresh_patel");
  const [activePathResult, setActivePathResult] = useState<string[] | null | undefined>(undefined);

  const { fitView } = useReactFlow();

  // Reset view to default first-load finding
  const handleResetView = useCallback(() => {
    setActiveMode("FINDINGS");
    if (allFindings.length > 0) {
      setSelectedFindingId(allFindings[0].findingId);
    }
    setSelectedNodeId(null);
    setSelectedEdgeId(null);
    setActivePathResult(undefined);
    setTimeout(() => fitView({ padding: 0.3, duration: 400 }), 50);
  }, [allFindings, fitView]);

  // Selected Finding Object
  const selectedFindingObj = useMemo(() => {
    return allFindings.find(f => f.findingId === selectedFindingId) || allFindings[0];
  }, [allFindings, selectedFindingId]);

  // Determine Visible Subgraph based on Active Mode / Finding / Path / Node Search
  const visibleSubgraph = useMemo(() => {
    const visibleNodeIds = new Set<string>();

    if (activeMode === "PATH") {
      if (activePathResult && activePathResult.length > 0) {
        activePathResult.forEach(id => visibleNodeIds.add(id));
      } else {
        visibleNodeIds.add(pathSourceId);
        visibleNodeIds.add(pathTargetId);
      }
    } else if (activeMode === "FINDINGS" && selectedFindingObj) {
      // Focus strictly on involved entities for the selected finding
      selectedFindingObj.involvedEntities.forEach(id => visibleNodeIds.add(id));
    } else if (activeMode === "EXPLORE") {
      if (selectedNodeId) {
        visibleNodeIds.add(selectedNodeId);
        fullGraph.edges.forEach(e => {
          if (e.source === selectedNodeId || e.target === selectedNodeId) {
            visibleNodeIds.add(e.source);
            visibleNodeIds.add(e.target);
          }
        });
      } else {
        // Initial explore: show top 6 key customers & devices
        fullGraph.nodes.slice(0, 8).forEach(n => visibleNodeIds.add(n.id));
      }
    }

    if (selectedNodeId && fullGraph.nodes.some(n => n.id === selectedNodeId)) {
      visibleNodeIds.add(selectedNodeId);
    }

    const nodes = fullGraph.nodes.filter(n => visibleNodeIds.has(n.id));
    const edges = fullGraph.edges.filter(e => visibleNodeIds.has(e.source) && visibleNodeIds.has(e.target));

    return { nodes, edges };
  }, [activeMode, selectedFindingObj, activePathResult, pathSourceId, pathTargetId, selectedNodeId, fullGraph]);

  // Construct ReactFlow Nodes & Edges with Deterministic Layout Positioning
  const flowNodes: FlowNode[] = useMemo(() => {
    // Column layout X positions by Entity Type
    const colX: Record<EntityNodeType, number> = {
      PERSON: 50,
      APPLICATION: 320,
      IDENTIFIER_VAL: 590,
      DEVICE: 590,
      APP_INSTANCE: 860,
      SESSION: 860,
      NETWORK_ENDPOINT: 860,
      ADDRESS: 860,
      LOCATION: 1130,
      BRANCH: 1130,
      MERCHANT: 1130,
      BEHAVIOURAL_EVENT: 1400
    };

    const typeCounters: Record<string, number> = {};

    return visibleSubgraph.nodes.map(n => {
      const typeKey = n.type;
      const count = typeCounters[typeKey] || 0;
      typeCounters[typeKey] = count + 1;

      // Tailored Layouts per Finding
      let posX = (colX[n.type] || 500);
      let posY = count * 105 + 80;

      // Centered Star Layout for Device/Address/Proxy findings
      if (activeMode === "FINDINGS" && selectedFindingObj) {
        if (selectedFindingObj.ruleId === "RULE_SHARED_DEVICE_MULTIPLE_IDENTITIES" && selectedFindingObj.focalEntityId === n.id) {
          posX = 500;
          posY = 200;
        } else if (selectedFindingObj.ruleId === "RULE_SHARED_DEVICE_MULTIPLE_IDENTITIES" && n.type === "PERSON") {
          posX = 150;
          posY = count * 95 + 60;
        } else if (selectedFindingObj.ruleId === "RULE_BENIGN_HOUSEHOLD_PATTERN") {
          if (n.type === "PERSON") {
            posX = 100 + count * 350;
            posY = 80;
          } else if (n.type === "APPLICATION") {
            posX = 100 + count * 350;
            posY = 200;
          } else {
            posX = 275;
            posY = 330 + count * 90;
          }
        }
      }

      const isFocal = selectedFindingObj?.focalEntityId === n.id;
      const isSelected = selectedNodeId === n.id;

      return {
        id: n.id,
        type: "entityNode",
        position: { x: posX, y: posY },
        data: {
          label: n.label,
          type: n.type,
          category: n.category,
          kgConceptId: n.kgConceptId,
          caseId: n.caseId,
          isFocal,
          isSelected,
          metadata: n.metadata
        }
      };
    });
  }, [visibleSubgraph.nodes, activeMode, selectedFindingObj, selectedNodeId]);

  const flowEdges: FlowEdge[] = useMemo(() => {
    return visibleSubgraph.edges.map(e => {
      const isSelected = selectedEdgeId === e.id;
      
      let strokeColor = "#38bdf8"; // Sky default
      if (e.classification === "STRONG_ENTITY_LINK") strokeColor = "#ec4899"; // Pink
      if (e.classification === "DETERMINISTIC_IDENTITY_LINK") strokeColor = "#a855f7"; // Purple
      if (e.classification === "CONTEXTUAL_LINK") strokeColor = "#f59e0b"; // Amber

      return {
        id: e.id,
        source: e.source,
        target: e.target,
        label: e.relationshipType,
        labelStyle: { fill: "#94a3b8", fontSize: 9, fontFamily: "monospace" },
        labelBgStyle: { fill: "#0f172a", fillOpacity: 0.8 },
        animated: Boolean(isSelected),
        style: {
          stroke: isSelected ? "#38bdf8" : strokeColor,
          strokeWidth: isSelected ? 2.5 : 1.5,
          opacity: isSelected ? 1 : 0.85
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: isSelected ? "#38bdf8" : strokeColor,
          width: 14,
          height: 14
        }
      };
    });
  }, [visibleSubgraph.edges, selectedEdgeId]);

  const [nodes, setNodes, onNodesChange] = useNodesState(flowNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(flowEdges);

  useEffect(() => {
    setNodes(flowNodes);
  }, [flowNodes, setNodes]);

  useEffect(() => {
    setEdges(flowEdges);
  }, [flowEdges, setEdges]);

  // Handle Node Selection
  const onNodeClick = useCallback((_: React.MouseEvent, node: FlowNode) => {
    setSelectedNodeId(node.id);
    setSelectedEdgeId(null);
  }, []);

  // Handle Edge Selection
  const onEdgeClick = useCallback((_: React.MouseEvent, edge: FlowEdge) => {
    setSelectedEdgeId(edge.id);
    setSelectedNodeId(null);
  }, []);

  // Selected Node Object
  const selectedNodeObj = useMemo(() => {
    if (!selectedNodeId) return null;
    return fullGraph.nodes.find(n => n.id === selectedNodeId) || null;
  }, [selectedNodeId, fullGraph]);

  // Selected Edge Object
  const selectedEdgeObj = useMemo(() => {
    if (!selectedEdgeId) return null;
    return fullGraph.edges.find(e => e.id === selectedEdgeId) || null;
  }, [selectedEdgeId, fullGraph]);

  // Selected Node Neighbors Summary
  const selectedNodeNeighbors = useMemo(() => {
    if (!selectedNodeObj) return { incoming: [], outgoing: [] };
    const incoming: Array<{ edge: EntityNetworkEdge; node: EntityNetworkNode }> = [];
    const outgoing: Array<{ edge: EntityNetworkEdge; node: EntityNetworkNode }> = [];

    fullGraph.edges.forEach(e => {
      if (e.target === selectedNodeObj.id) {
        const srcNode = fullGraph.nodes.find(n => n.id === e.source);
        if (srcNode) incoming.push({ edge: e, node: srcNode });
      } else if (e.source === selectedNodeObj.id) {
        const tgtNode = fullGraph.nodes.find(n => n.id === e.target);
        if (tgtNode) outgoing.push({ edge: e, node: tgtNode });
      }
    });

    return { incoming, outgoing };
  }, [selectedNodeObj, fullGraph]);

  // Search Filter Results for Explore Mode
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return fullGraph.nodes.slice(0, 10);
    const q = searchQuery.toLowerCase();
    return fullGraph.nodes.filter(n => 
      n.label.toLowerCase().includes(q) || 
      n.id.toLowerCase().includes(q) || 
      n.category.toLowerCase().includes(q) ||
      n.type.toLowerCase().includes(q)
    );
  }, [searchQuery, fullGraph]);

  // Path Execution
  const handleExecuteFindPath = useCallback(() => {
    setActiveMode("PATH");
    const result = getShortestPath(fullGraph, pathSourceId, pathTargetId);
    setActivePathResult(result);
    setSelectedNodeId(null);
    setSelectedEdgeId(null);
    setTimeout(() => fitView({ padding: 0.3, duration: 400 }), 50);
  }, [fullGraph, pathSourceId, pathTargetId, fitView]);

  return (
    <div className="flex flex-col h-screen w-screen bg-background text-foreground overflow-hidden font-sans select-none">
      {/* ========================================================================= */}
      {/* 1. TOP NAVIGATION & WORKSPACE TOOLBAR */}
      {/* ========================================================================= */}
      <header className="h-12 px-4 border-b border-border bg-card/80 backdrop-blur shrink-0 flex items-center justify-between z-30">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Network className="w-5 h-5 text-pink-400" />
            <span className="font-bold font-mono text-sm tracking-wider bg-gradient-to-r from-pink-400 via-sky-400 to-purple-400 bg-clip-text text-transparent">
              LOC-IQ SYNTHETIC ENTITY NETWORK LAB
            </span>
          </div>

          <Badge variant="outline" className="font-mono text-[10px] bg-pink-950/40 text-pink-400 border-pink-500/40 gap-1.5">
            <Layers className="w-3 h-3" />
            Synthetic Portfolio: {fullGraph.nodes.length} nodes / {fullGraph.edges.length} rels
          </Badge>
        </div>

        {/* View Mode Selectors */}
        <div className="flex items-center gap-1.5 bg-muted/40 p-1 rounded-md border border-border/60">
          <Button
            variant={activeMode === "FINDINGS" ? "default" : "ghost"}
            size="sm"
            onClick={() => { setActiveMode("FINDINGS"); setActivePathResult(undefined); }}
            className={`h-7 text-[11px] font-mono gap-1.5 ${activeMode === "FINDINGS" ? "bg-pink-600 text-white" : ""}`}
          >
            <ShieldAlert className="w-3.5 h-3.5" /> Findings ({allFindings.length})
          </Button>

          <Button
            variant={activeMode === "EXPLORE" ? "default" : "ghost"}
            size="sm"
            onClick={() => { setActiveMode("EXPLORE"); setActivePathResult(undefined); }}
            className={`h-7 text-[11px] font-mono gap-1.5 ${activeMode === "EXPLORE" ? "bg-sky-600 text-white" : ""}`}
          >
            <Search className="w-3.5 h-3.5" /> Explore Network
          </Button>

          <Button
            variant={activeMode === "PATH" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveMode("PATH")}
            className={`h-7 text-[11px] font-mono gap-1.5 ${activeMode === "PATH" ? "bg-purple-600 text-white" : ""}`}
          >
            <Route className="w-3.5 h-3.5" /> Find Connection
          </Button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={handleResetView} className="h-7 w-7" title="Reset View">
            <RefreshCw className="w-3.5 h-3.5 text-muted-foreground" />
          </Button>

          {onOpenMasterData && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onOpenMasterData(selectedNodeObj?.kgConceptId || selectedNodeObj?.id)}
              className="h-7 text-[10px] font-mono gap-1 text-sky-400 border-sky-500/40"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Master Data
            </Button>
          )}

          {onViewDataLineage && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onViewDataLineage(selectedNodeObj?.kgConceptId || "id:pan")}
              className="h-7 text-[10px] font-mono gap-1 text-purple-400 border-purple-500/40"
            >
              <Compass className="w-3.5 h-3.5" /> Data Lineage
            </Button>
          )}

          {onClose && (
            <Button variant="default" size="sm" onClick={onClose} className="h-7 text-[10px] font-mono bg-primary text-primary-foreground gap-1">
              <X className="w-3.5 h-3.5" /> Return to Case
            </Button>
          )}
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. MAIN WORKSPACE CONTENT AREA */}
      {/* ========================================================================= */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* ----------------------------------------------------------------------- */}
        {/* A. LEFT EXPLORATION / FINDINGS PANEL */}
        {/* ----------------------------------------------------------------------- */}
        <aside className="w-80 border-r border-border bg-card/60 backdrop-blur shrink-0 flex flex-col overflow-hidden z-20">
          {/* FINDINGS MODE PANEL */}
          {activeMode === "FINDINGS" && (
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="p-3 border-b border-border/60 bg-muted/30">
                <div className="text-xs font-bold font-mono text-foreground flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-pink-400">
                    <ShieldAlert className="w-4 h-4" /> Structural Findings
                  </span>
                  <Badge variant="outline" className="text-[9px] font-mono">{allFindings.length} Detected</Badge>
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">
                  Deterministic graph linkage findings derived from multi-case entity analytics.
                </p>
              </div>

              <div className="flex-1 overflow-y-auto p-2 space-y-2">
                {allFindings.map(finding => {
                  const isSelected = selectedFindingId === finding.findingId;
                  return (
                    <div
                      key={finding.findingId}
                      onClick={() => {
                        setSelectedFindingId(finding.findingId);
                        setSelectedNodeId(null);
                        setSelectedEdgeId(null);
                        setTimeout(() => fitView({ padding: 0.3, duration: 400 }), 50);
                      }}
                      className={`p-2.5 rounded-md border cursor-pointer transition-all ${
                        isSelected 
                          ? "bg-pink-950/40 border-pink-500/60 shadow-md ring-1 ring-pink-500/40" 
                          : "bg-background/40 hover:bg-muted/40 border-border/60"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-xs font-bold font-mono text-foreground truncate">{finding.ruleName}</span>
                        <Badge 
                          variant="default" 
                          className={`text-[8px] font-mono shrink-0 ${
                            finding.classification === "STRONG_ENTITY_LINK" ? "bg-pink-600" :
                            finding.classification === "DETERMINISTIC_IDENTITY_LINK" ? "bg-purple-600" : "bg-amber-600"
                          }`}
                        >
                          {finding.classification.replace("_LINK", "")}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground mb-1.5">
                        <span>Observed: <strong className="text-foreground font-bold">{finding.observedValue} {finding.observedEntityType}s</strong></span>
                        <span>•</span>
                        <span>Threshold: {finding.thresholdValue}</span>
                      </div>

                      <p className="text-[10px] text-muted-foreground line-clamp-2 leading-relaxed font-sans">
                        {finding.explanation}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* EXPLORE MODE PANEL */}
          {activeMode === "EXPLORE" && (
            <div className="flex-1 flex flex-col p-3 space-y-3 overflow-hidden">
              <div className="space-y-1">
                <label className="text-xs font-bold font-mono text-sky-400 flex items-center gap-1.5">
                  <Search className="w-3.5 h-3.5" /> Search 79 Instance Nodes
                </label>
                <Input
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="e.g. Ramesh, DEV_SYN_04, Fort..."
                  className="h-8 text-xs font-mono bg-background border-border/60"
                />
              </div>

              <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
                <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-1">
                  Matching Entities ({searchResults.length}):
                </div>
                {searchResults.map(node => (
                  <div
                    key={node.id}
                    onClick={() => {
                      setSelectedNodeId(node.id);
                      setSelectedEdgeId(null);
                      setTimeout(() => fitView({ padding: 0.3, duration: 400 }), 50);
                    }}
                    className={`p-2 rounded border cursor-pointer text-xs font-mono transition-all flex items-center justify-between ${
                      selectedNodeId === node.id ? "bg-sky-950/40 border-sky-500/60 text-sky-300" : "bg-background/40 hover:bg-muted/40 border-border/40 text-foreground"
                    }`}
                  >
                    <div className="overflow-hidden mr-2">
                      <div className="font-bold truncate">{node.label}</div>
                      <div className="text-[9px] text-muted-foreground truncate">{node.category}</div>
                    </div>
                    <Badge variant="outline" className="text-[8px] shrink-0 font-mono">{node.type}</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PATH FINDER MODE PANEL */}
          {activeMode === "PATH" && (
            <div className="flex-1 flex flex-col p-3 space-y-3 overflow-hidden">
              <div className="text-xs font-bold font-mono text-purple-400 flex items-center gap-1.5 border-b border-border/60 pb-2">
                <Route className="w-4 h-4" /> Find Network Connection
              </div>

              <div className="space-y-2 text-xs font-mono">
                <div>
                  <label className="text-[10px] text-muted-foreground">FROM Entity:</label>
                  <select 
                    value={pathSourceId} 
                    onChange={e => setPathSourceId(e.target.value)}
                    className="w-full bg-background border border-border/60 rounded px-2 py-1.5 text-xs font-mono mt-0.5"
                  >
                    {fullGraph.nodes.map(n => (
                      <option key={n.id} value={n.id}>{n.type}: {n.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-muted-foreground">TO Entity:</label>
                  <select 
                    value={pathTargetId} 
                    onChange={e => setPathTargetId(e.target.value)}
                    className="w-full bg-background border border-border/60 rounded px-2 py-1.5 text-xs font-mono mt-0.5"
                  >
                    {fullGraph.nodes.map(n => (
                      <option key={n.id} value={n.id}>{n.type}: {n.label}</option>
                    ))}
                  </select>
                </div>

                <Button size="sm" onClick={handleExecuteFindPath} className="w-full h-8 text-xs font-mono bg-purple-600 hover:bg-purple-500 gap-1.5">
                  <Route className="w-3.5 h-3.5" /> Execute Traversal
                </Button>
              </div>

              {activePathResult && (
                <div className="p-2.5 bg-background/60 rounded border border-border/60 text-xs font-mono space-y-1.5">
                  <div className="font-bold text-emerald-400 flex items-center justify-between">
                    <span>PATH FOUND</span>
                    <Badge variant="outline" className="text-[9px]">{activePathResult.length - 1} Hops</Badge>
                  </div>
                  <div className="space-y-1 text-[11px]">
                    {activePathResult.map((id, idx) => (
                      <div key={id} className="flex items-center gap-1.5 truncate">
                        <span className="text-muted-foreground font-bold">{idx + 1}.</span>
                        <span className="text-foreground truncate">{fullGraph.nodes.find(n => n.id === id)?.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activePathResult === null && (
                <div className="p-3 bg-amber-950/30 text-amber-400 border border-amber-500/30 rounded text-xs font-mono flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>NO NETWORK CONNECTION FOUND</span>
                </div>
              )}
            </div>
          )}
        </aside>

        {/* ----------------------------------------------------------------------- */}
        {/* B. CENTER GRAPH CANVAS (ReactFlow) */}
        {/* ----------------------------------------------------------------------- */}
        <main className="flex-1 h-full bg-[#030712] relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={onNodeClick}
            onEdgeClick={onEdgeClick}
            nodeTypes={nodeTypes}
            fitView
            minZoom={0.2}
            maxZoom={2.5}
            proOptions={{ hideAttribution: true }}
          >
            <Background color="#1e293b" gap={24} size={1} />
            <Controls className="bg-card border-border fill-foreground text-foreground" />
          </ReactFlow>

          {/* Subgraph Mounted Metric Overlay */}
          <div className="absolute bottom-3 left-3 bg-card/80 backdrop-blur border border-border/60 px-3 py-1.5 rounded-md text-xs font-mono text-muted-foreground flex items-center gap-2 z-10 shadow-md">
            <span className="font-bold text-foreground">{visibleSubgraph.nodes.length} Mounted Nodes</span>
            <span>•</span>
            <span>{visibleSubgraph.edges.length} Relationships</span>
            <span>•</span>
            <span className="text-pink-400 font-semibold">{activeMode} Mode</span>
          </div>
        </main>

        {/* ----------------------------------------------------------------------- */}
        {/* C. RIGHT INSPECTOR PANEL */}
        {/* ----------------------------------------------------------------------- */}
        <aside className="w-80 border-l border-border bg-card/60 backdrop-blur shrink-0 flex flex-col p-4 space-y-4 overflow-y-auto z-20">
          {/* INSPECTOR MODE A: SELECTED STRUCTURAL FINDING (Default) */}
          {!selectedNodeObj && !selectedEdgeObj && selectedFindingObj && activeMode === "FINDINGS" && (
            <div className="space-y-4">
              <div className="border-b border-border/60 pb-3">
                <Badge 
                  variant="default" 
                  className={`font-mono text-[9px] mb-1.5 ${
                    selectedFindingObj.classification === "STRONG_ENTITY_LINK" ? "bg-pink-600" :
                    selectedFindingObj.classification === "DETERMINISTIC_IDENTITY_LINK" ? "bg-purple-600" : "bg-amber-600"
                  }`}
                >
                  {selectedFindingObj.classification}
                </Badge>
                <h3 className="text-sm font-bold font-mono text-foreground">{selectedFindingObj.ruleName}</h3>
                <div className="text-[10px] font-mono text-muted-foreground mt-0.5">ID: {selectedFindingObj.findingId}</div>
              </div>

              <div className="space-y-2 text-xs font-mono">
                <div className="p-2.5 bg-background/60 rounded border border-border/40 space-y-1">
                  <div className="text-[10px] text-muted-foreground">Observed Typed Count:</div>
                  <div className="text-sm font-bold text-pink-400">
                    {selectedFindingObj.observedValue} {selectedFindingObj.observedEntityType}s
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-1">
                    Threshold: {selectedFindingObj.thresholdValue} {selectedFindingObj.thresholdEntityType}s
                  </div>
                </div>

                <div className="p-3 bg-background/60 rounded border border-border/40 space-y-1.5 leading-relaxed text-muted-foreground font-sans text-xs">
                  <div className="font-bold text-foreground font-mono text-[11px] mb-1">Deterministic Finding Proof</div>
                  {selectedFindingObj.explanation}
                </div>

                {selectedFindingObj.excludedNeighbors && selectedFindingObj.excludedNeighbors.length > 0 && (
                  <div className="p-2 bg-amber-950/20 border border-amber-500/30 rounded text-[10px] space-y-1">
                    <div className="font-bold text-amber-400">Excluded Non-Matching Neighbors:</div>
                    {selectedFindingObj.excludedNeighbors.map(ex => (
                      <div key={ex.id} className="text-muted-foreground truncate">• {ex.reason}</div>
                    ))}
                  </div>
                )}

                {selectedFindingObj.benignContextNote && (
                  <div className="p-2.5 bg-emerald-950/30 border border-emerald-500/40 rounded text-xs text-emerald-300 font-sans leading-relaxed">
                    <div className="font-bold font-mono text-[11px] mb-1 flex items-center gap-1 text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Benign Context Note
                    </div>
                    {selectedFindingObj.benignContextNote}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* INSPECTOR MODE B: SELECTED NODE */}
          {selectedNodeObj && (
            <div className="space-y-4">
              <div className="border-b border-border/60 pb-3">
                <div className="flex items-center justify-between mb-1.5">
                  <Badge variant="outline" className="font-mono text-[9px]">{selectedNodeObj.type}</Badge>
                  {selectedNodeObj.caseId && (
                    <Badge variant="default" className="text-[9px] bg-sky-600 font-mono">CASE MAPPED</Badge>
                  )}
                </div>
                <h3 className="text-sm font-bold font-mono text-foreground break-words">{selectedNodeObj.label}</h3>
                <div className="text-[10px] font-mono text-muted-foreground mt-0.5">ID: {selectedNodeObj.id}</div>
              </div>

              <div className="p-2 bg-background/60 rounded border border-border/40 text-xs font-mono text-muted-foreground">
                Category: <strong className="text-foreground">{selectedNodeObj.category}</strong>
              </div>

              {/* Immediate Lineage Connections */}
              <div className="space-y-2 border-t border-border/60 pt-3 text-xs font-mono">
                <div className="font-bold text-foreground">Immediate Lineage Connections</div>

                {selectedNodeNeighbors.incoming.length > 0 && (
                  <div>
                    <div className="text-[10px] text-muted-foreground mb-1">Incoming ({selectedNodeNeighbors.incoming.length}):</div>
                    <div className="space-y-1">
                      {selectedNodeNeighbors.incoming.map(({ edge, node }) => (
                        <div 
                          key={edge.id} 
                          onClick={() => setSelectedNodeId(node.id)}
                          className="p-1.5 bg-background/50 hover:bg-sky-950/30 rounded border border-border/40 cursor-pointer text-xs flex items-center justify-between"
                        >
                          <span className="truncate">{node.label}</span>
                          <Badge variant="outline" className="text-[8px] shrink-0 font-mono">{edge.relationshipType}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedNodeNeighbors.outgoing.length > 0 && (
                  <div className="mt-2">
                    <div className="text-[10px] text-muted-foreground mb-1">Outgoing ({selectedNodeNeighbors.outgoing.length}):</div>
                    <div className="space-y-1">
                      {selectedNodeNeighbors.outgoing.map(({ edge, node }) => (
                        <div 
                          key={edge.id} 
                          onClick={() => setSelectedNodeId(node.id)}
                          className="p-1.5 bg-background/50 hover:bg-sky-950/30 rounded border border-border/40 cursor-pointer text-xs flex items-center justify-between"
                        >
                          <span className="truncate">{node.label}</span>
                          <Badge variant="outline" className="text-[8px] shrink-0 font-mono">{edge.relationshipType}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons for Node */}
              <div className="space-y-2 pt-2">
                {selectedNodeObj.caseId && onOpenCaseInvestigation && (
                  <Button 
                    onClick={() => onOpenCaseInvestigation(selectedNodeObj.caseId!)}
                    className="w-full h-8 text-xs font-mono bg-sky-600 hover:bg-sky-500 gap-1.5"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> Open Case Investigation
                  </Button>
                )}

                {selectedNodeObj.kgConceptId && onViewDataLineage && (
                  <Button 
                    variant="outline"
                    onClick={() => onViewDataLineage(selectedNodeObj.kgConceptId!)}
                    className="w-full h-8 text-xs font-mono text-purple-400 border-purple-500/40 hover:bg-purple-950/30 gap-1.5"
                  >
                    <Compass className="w-3.5 h-3.5" /> View Data Lineage
                  </Button>
                )}

                {onOpenMasterData && (
                  <Button 
                    variant="outline"
                    onClick={() => onOpenMasterData(selectedNodeObj.kgConceptId || selectedNodeObj.id)}
                    className="w-full h-8 text-xs font-mono text-sky-400 border-sky-500/40 hover:bg-sky-950/30 gap-1.5"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> Inspect in Master Data
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* INSPECTOR MODE C: SELECTED EDGE ("WHY ARE THESE LINKED?") */}
          {selectedEdgeObj && (
            <div className="space-y-4">
              <div className="border-b border-border/60 pb-3">
                <Badge variant="outline" className="font-mono text-[9px] mb-1.5 text-sky-400 border-sky-500/40">
                  RELATIONSHIP INSPECTOR
                </Badge>
                <h3 className="text-xs font-bold font-mono text-foreground uppercase tracking-wider">WHY ARE THESE LINKED?</h3>
              </div>

              <div className="p-2.5 bg-background/60 rounded border border-border/40 text-xs font-mono space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">From:</span>
                  <span className="font-bold text-sky-400">{fullGraph.nodes.find(n => n.id === selectedEdgeObj.source)?.label}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Relation:</span>
                  <Badge variant="outline" className="text-[9px]">{selectedEdgeObj.relationshipType}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">To:</span>
                  <span className="font-bold text-emerald-400">{fullGraph.nodes.find(n => n.id === selectedEdgeObj.target)?.label}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-bold font-mono text-foreground">Link Semantic Classification</div>
                <Badge 
                  variant="default" 
                  className={`font-mono text-[10px] ${
                    selectedEdgeObj.classification === "STRONG_ENTITY_LINK" ? "bg-pink-600" :
                    selectedEdgeObj.classification === "DETERMINISTIC_IDENTITY_LINK" ? "bg-purple-600" : "bg-amber-600"
                  }`}
                >
                  {selectedEdgeObj.classification}
                </Badge>

                <div className="p-3 bg-background/60 rounded border border-border/40 text-xs leading-relaxed text-muted-foreground font-sans">
                  {selectedEdgeObj.explanation}
                </div>
              </div>
            </div>
          )}

          {/* EMPTY INSPECTOR STATE */}
          {!selectedNodeObj && !selectedEdgeObj && activeMode !== "FINDINGS" && (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-4 text-muted-foreground">
              <Compass className="w-8 h-8 opacity-40 mb-2 text-pink-400" />
              <p className="text-xs font-mono">Select any finding, node, or relationship edge on the canvas to inspect its deterministic proof & lineage metadata.</p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};

export const NetworkLabWorkspace: React.FC<NetworkLabWorkspaceProps> = (props) => {
  return (
    <ReactFlowProvider>
      <NetworkLabContent {...props} />
    </ReactFlowProvider>
  );
};
