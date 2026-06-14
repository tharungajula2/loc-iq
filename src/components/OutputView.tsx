"use client";

import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, ShieldAlert, CheckCircle2, XCircle } from "lucide-react";

export const OutputView: React.FC = () => {
  const { currentTrace, isAnalyzing } = useAppContext();
  const [selectedRankIdx, setSelectedRankIdx] = useState<number>(0);

  if (isAnalyzing) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground space-y-4">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="tracking-widest uppercase text-sm font-semibold">Calculating Probabilities...</p>
      </div>
    );
  }

  const trace = currentTrace;
  if (!trace || !trace.expected_output) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground space-y-2">
        <MapPin className="w-12 h-12 opacity-20" />
        <p>No active trace data. Initiate a trace to view outputs.</p>
      </div>
    );
  }

  const output = trace.expected_output;
  const selectedRank = output.ranked[selectedRankIdx];

  // Find underlying signals for the selected location to show in the evidence box
  const supportingSignals = trace.signals.filter(s => 
    selectedRank && selectedRank.location.includes(s.location_id) || 
    s.location_label === selectedRank?.location
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-6 h-full flex flex-col">
      <div className="flex items-center justify-between flex-none">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Objective A: Address Truth</h2>
          <p className="text-muted-foreground">Final probability ranking of physical location.</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 flex-1 min-h-0">
        <div className="col-span-1 border-r border-border/50 pr-6 overflow-y-auto space-y-4">
          <h3 className="text-sm font-semibold tracking-widest uppercase text-muted-foreground mb-4">Ranked Candidates</h3>
          {output.ranked.map((loc, idx) => (
            <Card 
              key={idx}
              className={`cursor-pointer transition-colors ${selectedRankIdx === idx ? 'border-primary ring-1 ring-primary bg-primary/5' : 'hover:border-muted-foreground/30'}`}
              onClick={() => setSelectedRankIdx(idx)}
            >
              <CardContent className="p-4 flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <span className="font-bold tracking-wider text-base truncate pr-2">{loc.location}</span>
                  <Badge variant={idx === 0 ? "default" : "secondary"}>{loc.confidence}%</Badge>
                </div>
                <div className="w-full bg-muted rounded-full h-1.5">
                  <div 
                    className={`h-1.5 rounded-full ${idx === 0 ? 'bg-primary' : 'bg-muted-foreground'}`} 
                    style={{ width: `${loc.confidence}%` }}
                  />
                </div>
                {loc.note && (
                  <div className="text-[10px] text-destructive tracking-widest uppercase mt-1">
                    {loc.note}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="col-span-2 pl-2 overflow-y-auto space-y-6">
          <Card className={`border-2 ${output.truth_flag === 'GREEN' ? 'border-emerald-500/50 bg-emerald-500/5' : output.truth_flag === 'RED' ? 'border-red-500/50 bg-red-500/5' : 'border-amber-500/50 bg-amber-500/5'}`}>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                {output.truth_flag === 'GREEN' ? <CheckCircle2 className="text-emerald-500" /> : output.truth_flag === 'RED' ? <XCircle className="text-red-500" /> : <ShieldAlert className="text-amber-500" />}
                <span className="tracking-widest uppercase">Truth Flag: {output.truth_flag}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg leading-relaxed">{output.reason}</p>
              <div className="mt-4 flex items-center gap-6 text-sm text-muted-foreground border-t pt-4">
                 <div>Declared: <strong className="text-foreground">{output.declared}</strong></div>
                 <div>Top Network Trace: <strong className="text-foreground">{output.top_candidate}</strong></div>
              </div>
            </CardContent>
          </Card>

          {selectedRank && (
             <Card>
               <CardHeader>
                 <CardTitle>Evidence Signals for {selectedRank.location}</CardTitle>
               </CardHeader>
               <CardContent className="space-y-4">
                 {supportingSignals.length > 0 ? (
                   <div className="space-y-3">
                     {supportingSignals.map((sig, i) => (
                        <div key={i} className="flex flex-col p-3 bg-muted/30 rounded-md border border-border/50">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-sm text-primary">{sig.signal}</span>
                            <Badge variant="outline" className="text-[10px]">Wt: {(sig.base_weight * sig.recency_factor * sig.ip_trust_factor).toFixed(2)}</Badge>
                          </div>
                          <span className="text-xs text-muted-foreground">{sig.evidence}</span>
                        </div>
                     ))}
                   </div>
                 ) : (
                   <p className="text-sm text-muted-foreground italic">No direct signals loaded for this location in the trace.</p>
                 )}
               </CardContent>
             </Card>
          )}
        </div>
      </div>
    </div>
  );
};
