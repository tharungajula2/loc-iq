"use client";

import React from "react";
import { useAppContext } from "../context/AppContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Database, Play, AlertCircle, Fingerprint, ShieldCheck } from "lucide-react";

export const CaseContextRail: React.FC = () => {
  const { currentTrace, loadDemoCase } = useAppContext();

  if (!currentTrace || !currentTrace.graph) {
    return (
      <aside className="w-80 border-r border-border bg-card/50 p-4 flex flex-col justify-between flex-none">
        <div className="text-center space-y-4 pt-10">
          <AlertCircle className="w-10 h-10 text-muted-foreground mx-auto opacity-40" />
          <p className="text-xs text-muted-foreground">No active investigation trace loaded.</p>
          <Button size="sm" onClick={() => loadDemoCase('fraud')} className="w-full text-xs">
            Load Fraud Scenario
          </Button>
        </div>
      </aside>
    );
  }

  const graph = currentTrace.graph;
  const input = currentTrace.input;

  return (
    <aside className="w-80 border-r border-border bg-card/40 flex flex-col flex-none select-none overflow-y-auto">
      {/* Case Header Card */}
      <div className="p-4 border-b border-border/60 bg-muted/20">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] uppercase font-mono tracking-widest text-muted-foreground font-semibold">Investigation Context</span>
          <Badge variant="outline" className="text-[9px] font-mono border-primary/40 text-primary uppercase">
            Synthetic Case
          </Badge>
        </div>
        <h3 className="text-base font-bold tracking-tight text-foreground font-mono">{graph.case_label}</h3>
        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
          {graph.case_label === 'CLEAN' ? 'Consistent location trace; declared address supported.' :
           graph.case_label === 'FRAUD' ? 'Conflicting evidence; physical evidence clusters in Andhra Pradesh.' :
           'Multi-source forensic scenario across 20+ simulated API observations.'}
        </p>
      </div>

      <div className="p-4 space-y-5 flex-1">
        {/* Applicant Seed Identifiers (Marked Synthetic) */}
        <Card className="bg-muted/10 border-border/60">
          <CardHeader className="py-2.5 px-3 border-b border-border/40">
            <CardTitle className="text-xs font-semibold uppercase font-mono tracking-wider text-foreground flex items-center justify-between">
              <span className="flex items-center gap-1.5"><Fingerprint className="w-3.5 h-3.5 text-primary" /> Seed Identifiers</span>
              <span className="text-[9px] text-muted-foreground font-normal">Simulated</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 space-y-2 text-xs font-mono">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Declared PIN:</span>
              <Badge variant="secondary" className="font-bold text-foreground bg-primary/10 border-primary/20 text-xs">
                <MapPin className="w-3 h-3 mr-1 text-primary inline" />
                {input.declared_pincode || 'Unverified'}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">PAN:</span>
              <span className="text-foreground">{input.pan || 'N/A'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Mobile:</span>
              <span className="text-foreground">{input.mobile_number || 'N/A'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Email:</span>
              <span className="text-foreground truncate max-w-[140px]">{input.email_id || 'N/A'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Customer Key:</span>
              <span className="text-foreground truncate max-w-[130px]">{input.customer_key || 'N/A'}</span>
            </div>
          </CardContent>
        </Card>

        {/* Evidence Sources Summary */}
        <Card className="bg-muted/10 border-border/60">
          <CardHeader className="py-2.5 px-3 border-b border-border/40">
            <CardTitle className="text-xs font-semibold uppercase font-mono tracking-wider text-foreground flex items-center justify-between">
              <span className="flex items-center gap-1.5"><Database className="w-3.5 h-3.5 text-sky-400" /> Evidence Pipeline</span>
              <Badge variant="outline" className="text-[9px]">{currentTrace.fetchedFields.length} Sources</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 space-y-2 text-xs">
            <div className="flex justify-between items-center text-muted-foreground">
              <span>Runtime Nodes:</span>
              <span className="font-mono text-foreground font-semibold">{graph.nodes.length}</span>
            </div>
            <div className="flex justify-between items-center text-muted-foreground">
              <span>Provenance Edges:</span>
              <span className="font-mono text-foreground font-semibold">{graph.edges.length}</span>
            </div>
            <div className="flex justify-between items-center text-muted-foreground">
              <span>Physical Hypotheses:</span>
              <span className="font-mono text-emerald-400 font-semibold">{graph.candidates.length}</span>
            </div>
            <div className="flex justify-between items-center text-muted-foreground">
              <span>Risk Indicators:</span>
              <span className="font-mono text-amber-400 font-semibold">{graph.riskIndicators.length}</span>
            </div>
          </CardContent>
        </Card>

        {/* Scenario Switcher Buttons */}
        <div className="space-y-2 pt-1">
          <span className="text-[10px] uppercase font-mono tracking-widest text-muted-foreground font-semibold block mb-1">
            Predefined Scenarios
          </span>
          <Button 
            variant={graph.case_label === 'CLEAN' ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => loadDemoCase('clean')}
            className="w-full justify-start text-xs h-8 font-mono"
          >
            <Play className="w-3 h-3 mr-2 text-emerald-400" /> 1. Clean Scenario (560001)
          </Button>
          <Button 
            variant={graph.case_label === 'FRAUD' ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => loadDemoCase('fraud')}
            className="w-full justify-start text-xs h-8 font-mono"
          >
            <Play className="w-3 h-3 mr-2 text-red-400" /> 2. Physical Conflict (110001)
          </Button>
          <Button 
            variant={graph.case_label === 'MAXIMUM' ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => loadDemoCase('maximum')}
            className="w-full justify-start text-xs h-8 font-mono"
          >
            <Play className="w-3 h-3 mr-2 text-amber-400" /> 3. Multi-Source (400001)
          </Button>
        </div>
      </div>

      {/* Footer Banner */}
      <div className="p-3 border-t border-border/60 bg-muted/30 text-[10px] text-muted-foreground flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
        <span>Deterministic synthetic evidence trace generator active. Zero live personal lookup.</span>
      </div>
    </aside>
  );
};
