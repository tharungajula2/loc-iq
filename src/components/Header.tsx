"use client";

import React from "react";
import { useAppContext } from "../context/AppContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Network, Play, BookOpen, PlusCircle, Shield, CheckCircle2, XCircle, ShieldAlert } from "lucide-react";

interface HeaderProps {
  onOpenReference: () => void;
  onOpenNewInvestigation: () => void;
  onOpenIntelligenceGraph: () => void;
  onOpenNetworkLab: () => void;
  activeWorkspace?: "INVESTIGATION" | "INTELLIGENCE_GRAPH" | "NETWORK_LAB";
}

export const Header: React.FC<HeaderProps> = ({ 
  onOpenReference, 
  onOpenNewInvestigation,
  onOpenIntelligenceGraph,
  onOpenNetworkLab,
  activeWorkspace = "INVESTIGATION"
}) => {
  const { currentTrace, loadDemoCase } = useAppContext();

  const graph = currentTrace?.graph;
  const addressConsistency = graph?.addressConsistency;

  return (
    <header className="h-16 bg-card border-b border-border px-6 flex items-center justify-between flex-none select-none z-20">
      {/* Brand & Product Identity */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded bg-primary/20 border border-primary/40 flex items-center justify-center text-primary font-bold font-mono text-sm">
            <Shield className="w-4 h-4 text-primary" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-bold tracking-tight text-base text-foreground font-mono">LOC-IQ</h1>
              <Badge variant="outline" className="text-[10px] uppercase font-mono border-primary/30 text-primary bg-primary/5 whitespace-nowrap shrink-0">
                Deterministic Simulation Engine
              </Badge>
            </div>
            <p className="text-[11px] text-muted-foreground">Location Evidence & Address-Consistency Workstation</p>
          </div>
        </div>
      </div>

      {/* Center Case Status Banner */}
      <div className="flex items-center space-x-3 bg-muted/30 border border-border/80 rounded-lg px-4 py-1.5 font-mono">
        <span className="text-xs text-muted-foreground">Active Investigation:</span>
        <span className="text-xs font-bold text-foreground">{graph?.case_label || 'FRAUD DEMO'}</span>

        {addressConsistency === 'CONSISTENT' && (
          <Badge className="bg-emerald-600 text-white font-mono text-[10px] px-2">
            <CheckCircle2 className="w-3 h-3 mr-1" /> CONSISTENT
          </Badge>
        )}
        {addressConsistency === 'CONFLICT' && (
          <Badge variant="destructive" className="font-mono text-[10px] px-2">
            <XCircle className="w-3 h-3 mr-1" /> CONFLICT
          </Badge>
        )}
        {addressConsistency === 'REVIEW' && (
          <Badge variant="secondary" className="bg-amber-600/20 text-amber-400 border-amber-500/30 font-mono text-[10px] px-2">
            <ShieldAlert className="w-3 h-3 mr-1" /> REVIEW REQUIRED
          </Badge>
        )}
      </div>

      {/* Global Actions */}
      <div className="flex items-center space-x-3">
        {/* Predefined Scenarios Quick Selector */}
        <div className="flex items-center space-x-1 bg-muted/40 p-1 rounded-md border border-border/60">
          <Button 
            variant={graph?.case_label === 'CLEAN' ? 'default' : 'ghost'} 
            size="sm" 
            onClick={() => loadDemoCase('clean')}
            className="h-7 text-xs font-medium px-2.5"
          >
            <Play className="w-3 h-3 mr-1" /> Clean Scenario
          </Button>
          <Button 
            variant={graph?.case_label === 'FRAUD' ? 'default' : 'ghost'} 
            size="sm" 
            onClick={() => loadDemoCase('fraud')}
            className="h-7 text-xs font-medium px-2.5"
          >
            <Play className="w-3 h-3 mr-1" /> Physical Conflict
          </Button>
          <Button 
            variant={graph?.case_label === 'MAXIMUM' ? 'default' : 'ghost'} 
            size="sm" 
            onClick={() => loadDemoCase('maximum')}
            className="h-7 text-xs font-medium px-2.5"
          >
            <Play className="w-3 h-3 mr-1" /> Multi-Source
          </Button>
        </div>

        {/* Network Lab Trigger */}
        <Button 
          variant={activeWorkspace === "NETWORK_LAB" ? "default" : "outline"} 
          size="sm" 
          onClick={onOpenNetworkLab}
          className="h-8 text-xs font-semibold font-mono gap-1.5 border-pink-500/40 text-pink-400 hover:bg-pink-950/30"
        >
          <Network className="w-3.5 h-3.5" /> Network Lab
        </Button>

        {/* Intelligence Graph Workspace Trigger */}
        <Button 
          variant={activeWorkspace === "INTELLIGENCE_GRAPH" ? "default" : "outline"} 
          size="sm" 
          onClick={onOpenIntelligenceGraph}
          className="h-8 text-xs font-semibold font-mono gap-1.5 border-sky-500/40 text-sky-400 hover:bg-sky-950/30"
        >
          <Shield className="w-3.5 h-3.5" /> Intelligence Graph
        </Button>

        {/* Custom Simulation Trigger */}
        <Button size="sm" onClick={onOpenNewInvestigation} className="h-8 text-xs font-semibold">
          <PlusCircle className="w-3.5 h-3.5 mr-1.5" /> Run Synthetic Case
        </Button>

        {/* Reference Library Modal Trigger */}
        <Button variant="outline" size="sm" onClick={onOpenReference} className="h-8 text-xs font-medium">
          <BookOpen className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" /> Reference Library
        </Button>
      </div>
    </header>
  );
};
