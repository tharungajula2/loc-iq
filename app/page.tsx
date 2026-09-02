"use client";

import React, { useEffect, useState } from "react";
import { useAppContext } from "@/context/AppContext";
import { Header } from "@/components/Header";
import { CaseContextRail } from "@/components/CaseContextRail";
import { GraphVisualizer } from "@/components/GraphVisualizer";
import { DecisionPanel } from "@/components/DecisionPanel";
import { ReferenceLibraryModal } from "@/components/ReferenceLibraryModal";
import { IntelligenceGraphWorkspace } from "@/components/IntelligenceGraphWorkspace";
import { NetworkLabWorkspace } from "@/components/NetworkLabWorkspace";
import { NewInvestigationModal } from "@/components/NewInvestigationModal";
import { InvestigationNode } from "@/types";

export default function WorkstationPage() {
  const { currentTrace, loadDemoCase } = useAppContext();
  const [activeWorkspace, setActiveWorkspace] = useState<"INVESTIGATION" | "INTELLIGENCE_GRAPH" | "NETWORK_LAB">("INVESTIGATION");
  const [selectedNode, setSelectedNode] = useState<InvestigationNode | null>(null);
  const [isReferenceOpen, setIsReferenceOpen] = useState(false);
  const [isNewInvestigationOpen, setIsNewInvestigationOpen] = useState(false);
  const [libraryFocusKey, setLibraryFocusKey] = useState<string | null>(null);
  const [graphFocusKey, setGraphFocusKey] = useState<string | null>(null);

  // First-load experience: Automatically hydrate Fraud Scenario so first-time visitors see a rich investigation
  useEffect(() => {
    if (!currentTrace) {
      loadDemoCase('fraud');
    }
  }, [currentTrace, loadDemoCase]);

  const handleInspectInLibrary = (key: string) => {
    setLibraryFocusKey(key);
    setIsReferenceOpen(true);
  };

  const handleInspectInIntelligenceGraph = (key: string) => {
    setGraphFocusKey(key);
    setActiveWorkspace("INTELLIGENCE_GRAPH");
  };

  const handleOpenCaseInvestigation = (caseId: string) => {
    // Map synthetic entity network case ID to Investigation Workspace scenario
    if (caseId.includes('01') || caseId.includes('clean')) {
      loadDemoCase('clean');
    } else if (caseId.includes('maximum') || caseId.includes('13')) {
      loadDemoCase('maximum');
    } else {
      loadDemoCase('fraud');
    }
    setActiveWorkspace("INVESTIGATION");
  };

  if (activeWorkspace === "NETWORK_LAB") {
    return (
      <>
        <NetworkLabWorkspace
          onClose={() => setActiveWorkspace("INVESTIGATION")}
          onOpenCaseInvestigation={handleOpenCaseInvestigation}
          onViewDataLineage={(kgConceptId) => {
            setGraphFocusKey(kgConceptId);
            setActiveWorkspace("INTELLIGENCE_GRAPH");
          }}
          onOpenMasterData={(canonicalId) => {
            if (canonicalId) setLibraryFocusKey(canonicalId);
            setIsReferenceOpen(true);
          }}
        />

        {/* Master Data Library Modal Overlay */}
        <ReferenceLibraryModal 
          isOpen={isReferenceOpen}
          onClose={() => setIsReferenceOpen(false)}
          initialFocusKey={libraryFocusKey}
          onViewInIntelligenceGraph={handleInspectInIntelligenceGraph}
        />
      </>
    );
  }

  if (activeWorkspace === "INTELLIGENCE_GRAPH") {
    return (
      <IntelligenceGraphWorkspace
        onClose={() => setActiveWorkspace("INVESTIGATION")}
        onOpenMasterData={(canonicalId) => {
          if (canonicalId) setLibraryFocusKey(canonicalId);
          setIsReferenceOpen(true);
        }}
        initialFocusKey={graphFocusKey}
      />
    );
  }

  return (
    <div className="flex flex-col h-screen w-screen bg-background text-foreground overflow-hidden font-sans">
      {/* 1. Global Application Header */}
      <Header 
        onOpenReference={() => {
          setLibraryFocusKey(null);
          setIsReferenceOpen(true);
        }}
        onOpenNewInvestigation={() => setIsNewInvestigationOpen(true)}
        onOpenIntelligenceGraph={() => {
          setGraphFocusKey(null);
          setActiveWorkspace("INTELLIGENCE_GRAPH");
        }}
        onOpenNetworkLab={() => {
          setActiveWorkspace("NETWORK_LAB");
        }}
        activeWorkspace={activeWorkspace}
      />

      {/* 2. Desktop-First 3-Zone Investigation Workstation */}
      <main className="flex flex-1 overflow-hidden relative">
        {/* Zone 1: Left Investigation Context Rail */}
        <CaseContextRail />

        {/* Zone 2: Center Provenance Graph Workspace */}
        <section className="flex-1 relative bg-background/95 overflow-hidden flex flex-col">
          <GraphVisualizer 
            onSelectNode={(node) => setSelectedNode(node)}
          />
        </section>

        {/* Zone 3: Right Decision & Forensic Inspection Panel */}
        <DecisionPanel 
          selectedNode={selectedNode}
          onClearSelectedNode={() => setSelectedNode(null)}
          onInspectInLibrary={handleInspectInLibrary}
        />
      </main>

      {/* Secondary Master Data Library Modal */}
      <ReferenceLibraryModal 
        isOpen={isReferenceOpen}
        onClose={() => setIsReferenceOpen(false)}
        initialFocusKey={libraryFocusKey}
        onViewInIntelligenceGraph={handleInspectInIntelligenceGraph}
      />

      {/* Custom Synthetic Case Generator Modal */}
      <NewInvestigationModal 
        isOpen={isNewInvestigationOpen}
        onClose={() => setIsNewInvestigationOpen(false)}
      />
    </div>
  );
}
