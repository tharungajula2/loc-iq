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
  Network, Search, Compass, Activity, 
  BookOpen, Route, X, RefreshCw, 
  ExternalLink, AlertCircle, CheckCircle2, Lock
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import { buildKnowledgeGraph, whyConnected, getShortestPath } from "@/lib/knowledgeGraph";
import { getActiveCaseBridge } from "@/lib/activeCaseBridge";
import { KnowledgeGraphNode, KnowledgeGraphEdge, KnowledgeNodeType } from "@/types";
import { useAppContext } from "@/context/AppContext";
import { KnowledgeNodeComponent } from "./KnowledgeNodeComponent";
import { MarkdownText } from "./MarkdownText";

const nodeTypes = {
  knowledgeNode: KnowledgeNodeComponent
};

export interface IntelligenceGraphWorkspaceProps {
  onClose: () => void;
  onOpenMasterData: (canonicalId?: string) => void;
  initialFocusKey?: string | null;
}

type LensType = "LINEAGE" | "ACCESS" | "ACTIVE_CASE" | "METHODOLOGY";

function InnerGraphWorkspace({ onClose, onOpenMasterData, initialFocusKey }: IntelligenceGraphWorkspaceProps) {
  const { currentTrace } = useAppContext();
  const reactFlowInstance = useReactFlow();

  const fullGraph = useMemo(() => buildKnowledgeGraph(), []);
  const activeBridge = useMemo(() => getActiveCaseBridge(currentTrace), [currentTrace]);

  // State
  const [activeLens, setActiveLens] = useState<LensType>("LINEAGE");
  const [selectedRootId, setSelectedRootId] = useState<string>("id:pan");
  const [expansionDepth, setExpansionDepth] = useState<number>(2);
  const [accessFilter, setAccessFilter] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [nodeTypeFilter, setNodeTypeFilter] = useState<string>("ALL");

  // Path Finding Mode
  const [isFindPathMode, setIsFindPathMode] = useState<boolean>(false);
  const [pathSourceId, setPathSourceId] = useState<string>("id:pan");
  const [pathTargetId, setPathTargetId] = useState<string>("sig:address_stability_score");
  const [activePathResult, setActivePathResult] = useState<string[] | null>(null);

  // Inspector Selection State
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>("id:pan");
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);

  // Handle initial focus key if passed
  useEffect(() => {
    if (initialFocusKey) {
      const matchedNode = fullGraph.nodes.find(n => 
        n.catalogueId.toLowerCase() === initialFocusKey.toLowerCase() ||
        n.id.toLowerCase() === initialFocusKey.toLowerCase() ||
        n.label.toLowerCase() === initialFocusKey.toLowerCase()
      );
      if (matchedNode) {
        const timer = setTimeout(() => {
          setSelectedNodeId(matchedNode.id);
          if (matchedNode.type === "IDENTIFIER") {
            setSelectedRootId(matchedNode.id);
          }
        }, 0);
        return () => clearTimeout(timer);
      }
    }
  }, [initialFocusKey, fullGraph.nodes]);

  // Determine Visible Subgraph based on Lens and Expansion State
  const visibleSubgraph = useMemo(() => {
    let visibleNodeIds = new Set<string>();

    if (isFindPathMode) {
      if (activePathResult && activePathResult.length > 0) {
        // Find Path Mode with Path: Mount ONLY nodes on the shortest path
        activePathResult.forEach(id => visibleNodeIds.add(id));
      } else {
        // Find Path Mode with No Path: Mount ONLY source and target nodes (2 nodes)
        visibleNodeIds.add(pathSourceId);
        visibleNodeIds.add(pathTargetId);
      }
    } else if (activeLens === "LINEAGE") {
      // Lineage Lens: Start from root identifier and expand downstream by expansionDepth
      const queue: Array<{ id: string; depth: number }> = [{ id: selectedRootId, depth: 0 }];
      visibleNodeIds.add(selectedRootId);

      while (queue.length > 0) {
        const { id, depth } = queue.shift()!;
        if (depth < expansionDepth) {
          const outgoingEdges = fullGraph.edges.filter(e => e.source === id);
          outgoingEdges.forEach(e => {
            if (!visibleNodeIds.has(e.target)) {
              visibleNodeIds.add(e.target);
              queue.push({ id: e.target, depth: depth + 1 });
            }
          });
        }
      }
    } else if (activeLens === "ACCESS") {
      // Access Lens: Start from active root lineage and filter by access mode
      const queue: Array<{ id: string; depth: number }> = [{ id: selectedRootId, depth: 0 }];
      const lineageSet = new Set<string>([selectedRootId]);
      while (queue.length > 0) {
        const { id, depth } = queue.shift()!;
        if (depth < 2) {
          fullGraph.edges.filter(e => e.source === id).forEach(e => {
            if (!lineageSet.has(e.target)) {
              lineageSet.add(e.target);
              queue.push({ id: e.target, depth: depth + 1 });
            }
          });
        }
      }

      lineageSet.forEach(id => {
        const n = fullGraph.nodes.find(x => x.id === id);
        if (!n) return;
        if (accessFilter === "ALL") {
          visibleNodeIds.add(n.id);
        } else if (accessFilter === "PUBLIC" && n.accessMode && n.accessMode.toLowerCase().includes("public")) {
          visibleNodeIds.add(n.id);
        } else if (accessFilter === "PERMISSIONED" && n.accessMode && (n.accessMode.toLowerCase().includes("permissioned") || n.accessMode.toLowerCase().includes("bureau") || n.accessMode.toLowerCase().includes("bank"))) {
          visibleNodeIds.add(n.id);
        } else if (accessFilter === "BANK_INTERNAL" && n.sitsIn && n.sitsIn.toLowerCase().includes("bank")) {
          visibleNodeIds.add(n.id);
        } else if (n.type === "IDENTIFIER") {
          visibleNodeIds.add(n.id);
        }
      });
    } else if (activeLens === "ACTIVE_CASE") {
      // Active Case Lens: Mount ONLY catalogue nodes active in current case
      activeBridge.activeNodeIds.forEach(id => visibleNodeIds.add(id));
    } else if (activeLens === "METHODOLOGY") {
      // Methodology Lens: Mount active root lineage + connected documentation topics
      const rootLineage = new Set<string>([selectedRootId]);
      fullGraph.edges.filter(e => e.source === selectedRootId).forEach(e => {
        rootLineage.add(e.target);
        fullGraph.edges.filter(e2 => e2.source === e.target).forEach(e2 => rootLineage.add(e2.target));
      });
      rootLineage.forEach(id => visibleNodeIds.add(id));

      // Add connected documentation nodes
      fullGraph.edges
        .filter(e => e.relationshipType === "DOCUMENTED_IN" && visibleNodeIds.has(e.source))
        .forEach(e => visibleNodeIds.add(e.target));
    }

    // Apply Node Type Filter if specified
    if (nodeTypeFilter !== "ALL") {
      const filtered = new Set<string>();
      visibleNodeIds.forEach(id => {
        const node = fullGraph.nodes.find(n => n.id === id);
        if (node && (node.type === nodeTypeFilter || node.type === "IDENTIFIER")) {
          filtered.add(id);
        }
      });
      visibleNodeIds = filtered;
    }

    // Always include selected node + 1-hop neighborhood if selected by user
    if (selectedNodeId && fullGraph.nodes.some(n => n.id === selectedNodeId)) {
      visibleNodeIds.add(selectedNodeId);
      fullGraph.edges
        .filter(e => e.source === selectedNodeId || e.target === selectedNodeId)
        .forEach(e => {
          visibleNodeIds.add(e.source);
          visibleNodeIds.add(e.target);
        });
    }

    const nodes = fullGraph.nodes.filter(n => visibleNodeIds.has(n.id));
    const edges = fullGraph.edges.filter(e => visibleNodeIds.has(e.source) && visibleNodeIds.has(e.target));

    return { nodes, edges };
  }, [activeLens, selectedRootId, expansionDepth, accessFilter, nodeTypeFilter, isFindPathMode, activePathResult, pathSourceId, pathTargetId, selectedNodeId, fullGraph, activeBridge]);

  // Construct ReactFlow Nodes & Edges with Layout Positioning
  const flowNodes: FlowNode[] = useMemo(() => {
    // Deterministic 2D Grid Layout by Node Type Column
    const colX: Record<KnowledgeNodeType, number> = {
      IDENTIFIER: 50,
      DATA_SOURCE: 360,
      FETCHED_FIELD: 720,
      DERIVED_SIGNAL: 1080,
      KNOWLEDGE_TOPIC: 1440
    };

    const typeCounters: Record<KnowledgeNodeType, number> = {
      IDENTIFIER: 0,
      DATA_SOURCE: 0,
      FETCHED_FIELD: 0,
      DERIVED_SIGNAL: 0,
      KNOWLEDGE_TOPIC: 0
    };

    const isPathActive = isFindPathMode && activePathResult;

    return visibleSubgraph.nodes.map(n => {
      const idxInType = typeCounters[n.type];
      const maxCols = (n.type === "FETCHED_FIELD" || n.type === "DERIVED_SIGNAL" || n.type === "KNOWLEDGE_TOPIC") ? 2 : 1;
      const subCol = idxInType % maxCols;
      const subRow = Math.floor(idxInType / maxCols);

      const col = (colX[n.type] || 500) + subCol * 240;
      const row = subRow * 95 + 60;
      typeCounters[n.type]++;

      const isActiveInCase = activeBridge.activeNodeIds.has(n.id);
      const isDimmed = isPathActive ? !activePathResult.includes(n.id) : false;
      const isSelected = selectedNodeId === n.id;

      return {
        id: n.id,
        type: "knowledgeNode",
        position: { x: col, y: row },
        data: {
          label: n.label,
          type: n.type,
          catalogueId: n.catalogueId,
          category: n.category,
          accessMode: n.accessMode,
          sitsIn: n.sitsIn,
          isActiveInCase,
          isDimmed,
          isSelected
        }
      };
    });
  }, [visibleSubgraph.nodes, activeBridge, isFindPathMode, activePathResult, selectedNodeId]);

  const flowEdges: FlowEdge[] = useMemo(() => {
    const isPathActive = isFindPathMode && activePathResult;

    return visibleSubgraph.edges.map(e => {
      const isSelected = selectedEdgeId === e.id;
      const isPathEdge = isPathActive && activePathResult.includes(e.source) && activePathResult.includes(e.target);

      let strokeColor = "#38bdf8"; // sky blue default
      if (e.certainty === "DIRECT") strokeColor = "#10b981"; // emerald
      if (e.certainty === "CURATED") strokeColor = "#f59e0b"; // amber

      return {
        id: e.id,
        source: e.source,
        target: e.target,
        label: e.relationshipType,
        labelStyle: { fill: "#94a3b8", fontSize: 9, fontFamily: "monospace" },
        labelBgStyle: { fill: "#0f172a", fillOpacity: 0.8 },
        animated: Boolean(isSelected || isPathEdge),
        style: {
          stroke: isSelected ? "#38bdf8" : isPathEdge ? "#10b981" : strokeColor,
          strokeWidth: isSelected || isPathEdge ? 2.5 : 1.5,
          opacity: isPathActive && !isPathEdge ? 0.2 : 0.85
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 12,
          height: 12,
          color: isSelected ? "#38bdf8" : isPathEdge ? "#10b981" : strokeColor
        }
      };
    });
  }, [visibleSubgraph.edges, selectedEdgeId, isFindPathMode, activePathResult]);

  const [nodes, setNodes, onNodesChange] = useNodesState(flowNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(flowEdges);

  useEffect(() => {
    setNodes(flowNodes);
    setEdges(flowEdges);
  }, [flowNodes, flowEdges, setNodes, setEdges]);

  // Selection Handlers
  const onNodeClick = useCallback((_: React.MouseEvent, node: FlowNode) => {
    setSelectedNodeId(node.id);
    setSelectedEdgeId(null);
  }, []);

  const onEdgeClick = useCallback((_: React.MouseEvent, edge: FlowEdge) => {
    setSelectedEdgeId(edge.id);
    setSelectedNodeId(null);
  }, []);

  // Search Results Filter
  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const term = searchTerm.toLowerCase();
    return fullGraph.nodes.filter(n => 
      n.label.toLowerCase().includes(term) ||
      n.catalogueId.toLowerCase().includes(term) ||
      n.type.toLowerCase().includes(term) ||
      (n.description && n.description.toLowerCase().includes(term))
    ).slice(0, 10);
  }, [searchTerm, fullGraph.nodes]);

  const handleSelectSearchResult = (nodeId: string) => {
    setSelectedNodeId(nodeId);
    setSelectedEdgeId(null);
    setSearchTerm("");
    const node = fullGraph.nodes.find(n => n.id === nodeId);
    if (node && node.type === "IDENTIFIER") {
      setSelectedRootId(node.id);
    }
  };

  // Find Path Execution
  const handleExecuteFindPath = () => {
    const path = getShortestPath(fullGraph, pathSourceId, pathTargetId);
    setActivePathResult(path);
  };

  const handleResetView = () => {
    setIsFindPathMode(false);
    setActivePathResult(null);
    setSelectedRootId("id:pan");
    setExpansionDepth(2);
    setAccessFilter("ALL");
    setNodeTypeFilter("ALL");
    setSelectedNodeId("id:pan");
    setSelectedEdgeId(null);
    setTimeout(() => reactFlowInstance.fitView({ padding: 0.2 }), 50);
  };

  // Selected Item Object resolution
  const selectedNodeObj = useMemo(() => 
    selectedNodeId ? fullGraph.nodes.find(n => n.id === selectedNodeId) || null : null
  , [selectedNodeId, fullGraph.nodes]);

  const selectedEdgeObj = useMemo(() => 
    selectedEdgeId ? fullGraph.edges.find(e => e.id === selectedEdgeId) || null : null
  , [selectedEdgeId, fullGraph.edges]);

  // Selected Node Neighbors
  const selectedNodeNeighbors = useMemo(() => {
    if (!selectedNodeId) return { incoming: [], outgoing: [] };
    const incoming = fullGraph.edges
      .filter(e => e.target === selectedNodeId)
      .map(e => ({ edge: e, node: fullGraph.nodes.find(n => n.id === e.source) }))
      .filter(x => x.node) as Array<{ edge: KnowledgeGraphEdge; node: KnowledgeGraphNode }>;

    const outgoing = fullGraph.edges
      .filter(e => e.source === selectedNodeId)
      .map(e => ({ edge: e, node: fullGraph.nodes.find(n => n.id === e.target) }))
      .filter(x => x.node) as Array<{ edge: KnowledgeGraphEdge; node: KnowledgeGraphNode }>;

    return { incoming, outgoing };
  }, [selectedNodeId, fullGraph]);

  return (
    <div className="flex flex-col h-screen w-screen bg-background text-foreground overflow-hidden font-sans select-none">
      {/* 1. TOP TOOLBAR */}
      <header className="h-12 border-b border-border/80 bg-background/95 backdrop-blur flex items-center justify-between px-4 z-20 flex-none">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Network className="w-5 h-5 text-sky-400" />
            <h1 className="text-sm font-bold font-mono tracking-wide text-foreground">
              LOC-IQ INTELLIGENCE GRAPH
            </h1>
          </div>
          <Badge variant="outline" className="text-[10px] font-mono text-muted-foreground bg-muted/30">
            {visibleSubgraph.nodes.length} visible / {fullGraph.nodes.length} catalogue nodes
          </Badge>
          <Badge variant="outline" className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 border-emerald-500/40">
            {visibleSubgraph.edges.length} edges (0 heuristic)
          </Badge>
        </div>

        {/* Lenses Navigation */}
        <div className="flex items-center gap-1 bg-muted/40 p-1 rounded-md border border-border/60">
          <Button
            variant={activeLens === "LINEAGE" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => { setActiveLens("LINEAGE"); setIsFindPathMode(false); }}
            className="h-7 text-[11px] font-mono gap-1.5"
          >
            <Compass className="w-3.5 h-3.5 text-sky-400" /> Data Lineage
          </Button>
          <Button
            variant={activeLens === "ACCESS" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => { setActiveLens("ACCESS"); setIsFindPathMode(false); }}
            className="h-7 text-[11px] font-mono gap-1.5"
          >
            <Lock className="w-3.5 h-3.5 text-amber-400" /> Access & Permission
          </Button>
          <Button
            variant={activeLens === "ACTIVE_CASE" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => { setActiveLens("ACTIVE_CASE"); setIsFindPathMode(false); }}
            className="h-7 text-[11px] font-mono gap-1.5 text-emerald-400"
          >
            <Activity className="w-3.5 h-3.5" /> Active Case Provenance
          </Button>
          <Button
            variant={activeLens === "METHODOLOGY" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => { setActiveLens("METHODOLOGY"); setIsFindPathMode(false); }}
            className="h-7 text-[11px] font-mono gap-1.5 text-red-400"
          >
            <BookOpen className="w-3.5 h-3.5" /> Knowledge Docs
          </Button>
        </div>

        {/* Toolbar Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant={isFindPathMode ? "default" : "outline"}
            size="sm"
            onClick={() => setIsFindPathMode(!isFindPathMode)}
            className="h-7 text-[10px] font-mono gap-1"
          >
            <Route className="w-3.5 h-3.5" /> Find Path
          </Button>

          <Button variant="ghost" size="icon" onClick={handleResetView} className="h-7 w-7" title="Reset View">
            <RefreshCw className="w-3.5 h-3.5 text-muted-foreground" />
          </Button>

          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onOpenMasterData(selectedNodeObj?.catalogueId)}
            className="h-7 text-[10px] font-mono gap-1 text-sky-400 border-sky-500/40"
          >
            <ExternalLink className="w-3.5 h-3.5" /> Open Master Data
          </Button>

          <Button variant="default" size="sm" onClick={onClose} className="h-7 text-[10px] font-mono bg-primary text-primary-foreground gap-1">
            <X className="w-3.5 h-3.5" /> Return to Case
          </Button>
        </div>
      </header>

      {/* 2. MAIN 3-PANEL WORKSPACE */}
      <main className="flex-1 flex overflow-hidden relative">
        {/* LEFT PANEL: EXPLORATION & CONTROLS */}
        <aside className="w-72 flex-none bg-muted/20 border-r border-border/80 flex flex-col overflow-y-auto p-3 gap-3">
          {/* Graph Search Bar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search 273 nodes (e.g. pan, bureau)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 h-8 text-xs font-mono bg-background border-border/60"
            />
            {searchResults.length > 0 && (
              <div className="absolute top-9 left-0 right-0 bg-background border border-border/80 rounded-md shadow-xl z-30 max-h-56 overflow-y-auto">
                {searchResults.map(n => (
                  <div
                    key={n.id}
                    onClick={() => handleSelectSearchResult(n.id)}
                    className="p-2 hover:bg-primary/10 cursor-pointer text-xs font-mono border-b border-border/40 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-foreground">{n.label}</div>
                      <div className="text-[10px] text-muted-foreground">{n.type}</div>
                    </div>
                    {activeBridge.activeNodeIds.has(n.id) && (
                      <Badge variant="default" className="text-[8px] bg-emerald-600">ACTIVE</Badge>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* FIND PATH CONTROLS (If Mode Active) */}
          {isFindPathMode && (
            <Card className="bg-muted/30 border-sky-500/40">
              <CardHeader className="py-2 px-3 bg-sky-950/20 border-b border-sky-500/30">
                <CardTitle className="text-xs font-bold font-mono text-sky-400 flex items-center gap-1.5">
                  <Route className="w-3.5 h-3.5" /> Shortest Path Finder
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 space-y-2 text-xs font-mono">
                <div>
                  <label className="text-[10px] text-muted-foreground">From Node:</label>
                  <select 
                    value={pathSourceId} 
                    onChange={e => setPathSourceId(e.target.value)}
                    className="w-full bg-background border border-border/60 rounded px-2 py-1 text-xs font-mono mt-0.5"
                  >
                    {fullGraph.nodes.map(n => (
                      <option key={n.id} value={n.id}>{n.type}: {n.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-muted-foreground">To Node:</label>
                  <select 
                    value={pathTargetId} 
                    onChange={e => setPathTargetId(e.target.value)}
                    className="w-full bg-background border border-border/60 rounded px-2 py-1 text-xs font-mono mt-0.5"
                  >
                    {fullGraph.nodes.map(n => (
                      <option key={n.id} value={n.id}>{n.type}: {n.label}</option>
                    ))}
                  </select>
                </div>
                <Button size="sm" onClick={handleExecuteFindPath} className="w-full h-7 text-[10px] font-mono bg-sky-600 hover:bg-sky-500">
                  Find Shortest Path
                </Button>

                {activePathResult && (
                  <div className="mt-2 p-2 bg-background/60 rounded border border-border/40 text-[10px]">
                    <div className="font-bold text-emerald-400 mb-1">
                      PATH FOUND ({activePathResult.length - 1} hops)
                    </div>
                    <div className="space-y-1">
                      {activePathResult.map((id, idx) => (
                        <div key={id} className="flex items-center gap-1">
                          <span className="text-muted-foreground">{idx + 1}.</span>
                          <span className="font-semibold text-foreground">{fullGraph.nodes.find(n => n.id === id)?.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activePathResult === null && isFindPathMode && (
                  <div className="mt-2 p-2 bg-amber-950/30 text-amber-400 border border-amber-500/30 rounded text-[10px]">
                    <AlertCircle className="w-3 h-3 inline mr-1" /> NO TRUSTWORTHY PATH FOUND
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* LENS A: DATA LINEAGE CONTROLS */}
          {activeLens === "LINEAGE" && !isFindPathMode && (
            <Card className="bg-muted/20 border-border/60">
              <CardHeader className="py-2 px-3 bg-muted/40 border-b border-border/40">
                <CardTitle className="text-xs font-bold font-mono text-sky-400 flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5" /> Lineage Explorer
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 space-y-3 text-xs font-mono">
                <div>
                  <label className="text-[10px] text-muted-foreground">Root Identifier:</label>
                  <select 
                    value={selectedRootId} 
                    onChange={e => setSelectedRootId(e.target.value)}
                    className="w-full bg-background border border-border/60 rounded px-2 py-1 text-xs font-mono mt-0.5 text-purple-400 font-bold"
                  >
                    {fullGraph.nodes.filter(n => n.type === "IDENTIFIER").map(n => (
                      <option key={n.id} value={n.id}>{n.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-muted-foreground">Downstream Expansion Depth:</label>
                  <div className="flex gap-1 mt-1">
                    {[1, 2, 3].map(d => (
                      <Button
                        key={d}
                        variant={expansionDepth === d ? "default" : "outline"}
                        size="sm"
                        onClick={() => setExpansionDepth(d)}
                        className="flex-1 h-6 text-[10px] font-mono"
                      >
                        {d} {d === 1 ? "Hop" : "Hops"}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* LENS B: ACCESS & PERMISSION CONTROLS */}
          {activeLens === "ACCESS" && !isFindPathMode && (
            <Card className="bg-muted/20 border-border/60">
              <CardHeader className="py-2 px-3 bg-muted/40 border-b border-border/40">
                <CardTitle className="text-xs font-bold font-mono text-amber-400 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" /> Access Boundary Filter
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 space-y-2 text-xs font-mono">
                {[
                  { key: "ALL", label: "All Access Modes" },
                  { key: "PUBLIC", label: "Publicly Available APIs" },
                  { key: "PERMISSIONED", label: "Permissioned / Bureau Access" },
                  { key: "BANK_INTERNAL", label: "Bank-Internal Logs" }
                ].map(f => (
                  <Button
                    key={f.key}
                    variant={accessFilter === f.key ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setAccessFilter(f.key)}
                    className="w-full justify-start h-7 text-[11px] font-mono"
                  >
                    {f.label}
                  </Button>
                ))}
              </CardContent>
            </Card>
          )}

          {/* LENS C: ACTIVE CASE PROVENANCE CONTROLS */}
          {activeLens === "ACTIVE_CASE" && !isFindPathMode && (
            <Card className="bg-emerald-950/20 border-emerald-500/40">
              <CardHeader className="py-2 px-3 bg-emerald-950/40 border-b border-emerald-500/30">
                <CardTitle className="text-xs font-bold font-mono text-emerald-400 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5" /> Active Investigation Overlay
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 space-y-2 text-xs font-mono">
                <div className="text-[11px] text-muted-foreground">
                  Current Case: <span className="font-bold text-foreground">{currentTrace?.case_label || "FRAUD DEMO"}</span>
                </div>
                <div className="p-2 bg-background/60 rounded border border-border/40 space-y-1 text-[10px]">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Active Identifiers:</span>
                    <span className="font-bold text-purple-400">{activeBridge.activeIdentifierIds.size}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Active Data Fields:</span>
                    <span className="font-bold text-emerald-400">{activeBridge.activeFieldIds.size}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Active Signals:</span>
                    <span className="font-bold text-amber-400">{activeBridge.activeSignalIds.size}</span>
                  </div>
                  <div className="flex justify-between border-t border-border/40 pt-1">
                    <span className="text-muted-foreground">Mapped Sources:</span>
                    <span className="font-bold text-sky-400">{activeBridge.activeSourceIds.size}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Node Type Filter */}
          <div className="space-y-1">
            <label className="text-[10px] text-muted-foreground font-mono">Node Type Filter:</label>
            <select
              value={nodeTypeFilter}
              onChange={e => setNodeTypeFilter(e.target.value)}
              className="w-full bg-background border border-border/60 rounded px-2 py-1 text-xs font-mono"
            >
              <option value="ALL">All Node Types</option>
              <option value="IDENTIFIER">IDENTIFIER</option>
              <option value="DATA_SOURCE">DATA_SOURCE</option>
              <option value="FETCHED_FIELD">FETCHED_FIELD</option>
              <option value="DERIVED_SIGNAL">DERIVED_SIGNAL</option>
              <option value="KNOWLEDGE_TOPIC">KNOWLEDGE_TOPIC</option>
            </select>
          </div>
        </aside>

        {/* CENTER GRAPH CANVAS (REACTFLOW) */}
        <section className="flex-1 relative bg-background/95 overflow-hidden">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={onNodeClick}
            onEdgeClick={onEdgeClick}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.2 }}
            minZoom={0.2}
            maxZoom={2}
            className="bg-background"
          >
            <Background color="#334155" gap={24} size={1} />
            <Controls className="bg-background border border-border/60 fill-foreground" />
          </ReactFlow>
        </section>

        {/* RIGHT INSPECTOR PANEL */}
        <aside className="w-80 flex-none bg-muted/20 border-l border-border/80 flex flex-col overflow-y-auto p-4 select-text">
          {/* A. NODE INSPECTOR */}
          {selectedNodeObj && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-border/60 pb-2">
                <div className="flex items-center gap-1.5">
                  <Badge variant="outline" className="text-[10px] font-mono uppercase text-sky-400 border-sky-500/40">
                    {selectedNodeObj.type}
                  </Badge>
                </div>
                {activeBridge.activeNodeIds.has(selectedNodeObj.id) && (
                  <Badge variant="default" className="bg-emerald-600 text-white text-[9px] font-mono">
                    <CheckCircle2 className="w-3 h-3 mr-1" /> ACTIVE IN CASE
                  </Badge>
                )}
              </div>

              <div>
                <h3 className="text-base font-bold font-mono text-foreground break-words">{selectedNodeObj.label}</h3>
                <div className="text-[11px] font-mono text-muted-foreground mt-0.5">ID: {selectedNodeObj.catalogueId}</div>
              </div>

              {selectedNodeObj.description && (
                <div className="p-2.5 bg-background/60 rounded border border-border/40">
                  <MarkdownText text={selectedNodeObj.description} />
                </div>
              )}

              {selectedNodeObj.accessMode && (
                <div className="p-2 bg-amber-950/20 border border-amber-500/30 rounded text-xs font-mono text-amber-400">
                  Access: {selectedNodeObj.accessMode}
                </div>
              )}

              {selectedNodeObj.sitsIn && (
                <div className="p-2 bg-emerald-950/20 border border-emerald-500/30 rounded text-xs font-mono text-emerald-400">
                  Bank Location: {selectedNodeObj.sitsIn}
                </div>
              )}

              {/* NEIGHBORS SUMMARY */}
              <div className="space-y-2 border-t border-border/60 pt-3">
                <div className="text-xs font-bold font-mono text-foreground">Immediate Lineage Connections</div>

                {selectedNodeNeighbors.incoming.length > 0 && (
                  <div>
                    <div className="text-[10px] font-mono text-muted-foreground mb-1">Incoming ({selectedNodeNeighbors.incoming.length}):</div>
                    <div className="space-y-1">
                      {selectedNodeNeighbors.incoming.map(({ edge, node }) => (
                        <div 
                          key={edge.id} 
                          onClick={() => setSelectedNodeId(node.id)}
                          className="p-1.5 bg-background/50 hover:bg-primary/10 rounded border border-border/40 cursor-pointer text-xs font-mono flex items-center justify-between"
                        >
                          <span>{node.label}</span>
                          <Badge variant="outline" className="text-[8px]">{edge.relationshipType}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedNodeNeighbors.outgoing.length > 0 && (
                  <div className="mt-2">
                    <div className="text-[10px] font-mono text-muted-foreground mb-1">Outgoing ({selectedNodeNeighbors.outgoing.length}):</div>
                    <div className="space-y-1">
                      {selectedNodeNeighbors.outgoing.map(({ edge, node }) => (
                        <div 
                          key={edge.id} 
                          onClick={() => setSelectedNodeId(node.id)}
                          className="p-1.5 bg-background/50 hover:bg-primary/10 rounded border border-border/40 cursor-pointer text-xs font-mono flex items-center justify-between"
                        >
                          <span>{node.label}</span>
                          <Badge variant="outline" className="text-[8px]">{edge.relationshipType}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 border-t border-border/60 pt-3">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => onOpenMasterData(selectedNodeObj.catalogueId)}
                  className="w-full h-8 text-xs font-mono text-sky-400 border-sky-500/40 hover:bg-sky-950/30"
                >
                  <ExternalLink className="w-3.5 h-3.5 mr-1.5" /> Inspect in Master Data Library
                </Button>

                {activeBridge.activeNodeIds.has(selectedNodeObj.id) && (
                  <Button 
                    variant="default" 
                    size="sm" 
                    onClick={onClose}
                    className="w-full h-8 text-xs font-mono bg-emerald-600 hover:bg-emerald-500 text-white"
                  >
                    <Activity className="w-3.5 h-3.5 mr-1.5" /> View in Current Investigation
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* B. EDGE INSPECTOR ("WHY ARE THESE CONNECTED?") */}
          {selectedEdgeObj && !selectedNodeObj && (
            <div className="space-y-4">
              <div className="border-b border-border/60 pb-2">
                <Badge variant="outline" className="text-[10px] font-mono uppercase text-amber-400 border-amber-500/40">
                  RELATIONSHIP INSPECTOR
                </Badge>
                <h3 className="text-sm font-bold font-mono text-foreground mt-1">WHY THESE ARE CONNECTED</h3>
              </div>

              <div className="p-3 bg-muted/30 rounded-md border border-border/60 space-y-2 font-mono text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">From:</span>
                  <span className="font-bold text-sky-400">{fullGraph.nodes.find(n => n.id === selectedEdgeObj.source)?.label}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Relation:</span>
                  <Badge variant="secondary" className="font-mono text-[10px]">{selectedEdgeObj.relationshipType}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">To:</span>
                  <span className="font-bold text-emerald-400">{fullGraph.nodes.find(n => n.id === selectedEdgeObj.target)?.label}</span>
                </div>
              </div>

              {/* Provenance Badge & Details */}
              <div className="space-y-2">
                <div className="text-xs font-bold font-mono text-foreground">Relationship Provenance</div>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant="default" 
                    className={`font-mono text-[10px] ${
                      selectedEdgeObj.certainty === "DIRECT" ? "bg-emerald-600" :
                      selectedEdgeObj.certainty === "NORMALIZED" ? "bg-sky-600" : "bg-amber-600"
                    }`}
                  >
                    {selectedEdgeObj.certainty} PROVENANCE
                  </Badge>
                </div>

                <div className="p-3 bg-background/60 rounded border border-border/40 text-xs leading-relaxed text-muted-foreground font-sans">
                  {whyConnected(selectedEdgeObj)}
                </div>

                <div className="p-2 bg-muted/40 rounded border border-border/40 text-[10px] font-mono space-y-1">
                  <div>Source Dataset: <span className="text-foreground font-semibold">{selectedEdgeObj.sourceDataset}</span></div>
                  <div>Source Property: <span className="text-foreground font-semibold">{selectedEdgeObj.sourceProperty}</span></div>
                </div>
              </div>
            </div>
          )}

          {/* C. EMPTY INSPECTOR STATE */}
          {!selectedNodeObj && !selectedEdgeObj && (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-4 text-muted-foreground">
              <Compass className="w-8 h-8 opacity-40 mb-2 text-sky-400" />
              <p className="text-xs font-mono">Select any node or edge on the canvas to inspect its architecture provenance & lineage metadata.</p>
            </div>
          )}
        </aside>
      </main>
    </div>
  );
}

export function IntelligenceGraphWorkspace(props: IntelligenceGraphWorkspaceProps) {
  return (
    <ReactFlowProvider>
      <InnerGraphWorkspace {...props} />
    </ReactFlowProvider>
  );
}
