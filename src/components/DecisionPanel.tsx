"use client";

import React from "react";
import { useAppContext } from "../context/AppContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle2, XCircle, ShieldAlert, AlertTriangle, 
  MapPin, Compass, Globe, Check, Info, X 
} from "lucide-react";
import { InvestigationNode } from "../types";

interface DecisionPanelProps {
  selectedNode: InvestigationNode | null;
  onClearSelectedNode: () => void;
  onInspectInLibrary?: (key: string) => void;
}

export const DecisionPanel: React.FC<DecisionPanelProps> = ({ selectedNode, onClearSelectedNode, onInspectInLibrary }) => {
  const { currentTrace } = useAppContext();
  const [selectedRankIdx, setSelectedRankIdx] = React.useState<number>(0);

  if (!currentTrace || !currentTrace.graph) {
    return (
      <aside className="w-96 border-l border-border bg-card/40 p-4 flex items-center justify-center flex-none">
        <p className="text-xs text-muted-foreground">No decision data available.</p>
      </aside>
    );
  }

  const graph = currentTrace.graph;
  const candidates = graph.candidates;
  const selectedCandidate = candidates[selectedRankIdx] || candidates[0];

  return (
    <aside className="w-[420px] border-l border-border bg-card/40 flex flex-col flex-none select-none overflow-y-auto">
      {/* Panel Header */}
      <div className="p-4 border-b border-border/60 bg-muted/20 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold tracking-tight text-foreground font-mono">Decision & Evidence Panel</h3>
          <p className="text-[11px] text-muted-foreground">Deterministic hypothesis ranking & forensic decomposition</p>
        </div>
        <Badge variant="outline" className="text-[9px] font-mono border-primary/30 text-primary">
          Ranked Engine
        </Badge>
      </div>

      <div className="p-4 space-y-5 flex-1 overflow-y-auto">
        {/* 1. Address Consistency Decision Banner */}
        <Card className={`border-2 transition-all ${
          graph.addressConsistency === 'CONSISTENT' ? 'border-emerald-500/50 bg-emerald-500/10' :
          graph.addressConsistency === 'CONFLICT' ? 'border-red-500/50 bg-red-500/10' :
          'border-amber-500/50 bg-amber-500/10'
        }`}>
          <CardHeader className="py-3 px-4 pb-2">
            <CardTitle className="text-sm font-bold flex items-center gap-2 font-mono">
              {graph.addressConsistency === 'CONSISTENT' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
              {graph.addressConsistency === 'CONFLICT' && <XCircle className="w-5 h-5 text-red-400" />}
              {graph.addressConsistency === 'REVIEW' && <ShieldAlert className="w-5 h-5 text-amber-400" />}
              <span className={`tracking-widest uppercase text-sm ${
                graph.addressConsistency === 'CONSISTENT' ? 'text-emerald-400' :
                graph.addressConsistency === 'CONFLICT' ? 'text-red-400' : 'text-amber-400'
              }`}>
                Address Consistency: {graph.addressConsistency}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-3 space-y-3">
            <p className="text-xs leading-relaxed text-foreground font-medium">{graph.decisionReason}</p>
            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono border-t border-border/40 pt-2.5">
              <div>
                <span className="text-muted-foreground block text-[10px] uppercase">Declared Location</span>
                <strong className="text-foreground">{graph.declaredLocation || 'Unverified'}</strong>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px] uppercase">Top Evidence Cluster</span>
                <strong className="text-foreground truncate block">{graph.topCandidate || 'None'}</strong>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Selected Graph Node Detail Inspector */}
        {selectedNode && (
          <Card className="border-primary/50 bg-primary/5 relative animate-in fade-in zoom-in duration-200">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 h-6 w-6 text-muted-foreground hover:text-foreground"
              onClick={onClearSelectedNode}
            >
              <X className="h-3.5 w-3.5" />
            </Button>
            <CardHeader className="py-2.5 px-3 border-b border-primary/20">
              <CardTitle className="text-xs font-semibold uppercase font-mono text-primary flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-primary" /> Node Inspector: {selectedNode.label}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 text-xs space-y-2 font-mono">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Type:</span>
                <Badge variant="outline" className="text-[10px] border-primary/40 text-primary">{selectedNode.type}</Badge>
              </div>
              {selectedNode.value && (
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Value:</span>
                  <span className="text-foreground font-bold">{selectedNode.value}</span>
                </div>
              )}
              {selectedNode.sourceApi && (
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Source API:</span>
                  <span className="text-foreground text-[10px] truncate max-w-[180px]">{selectedNode.sourceApi}</span>
                </div>
              )}
              {selectedNode.metadata && (
                <div className="pt-2 border-t border-border/40 space-y-1 text-[10px]">
                  <span className="text-muted-foreground font-sans block font-semibold mb-1">Signal Metrics:</span>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Base Weight:</span>
                    <span className="text-foreground">{String(selectedNode.metadata.base_weight ?? '-')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Recency Factor:</span>
                    <span className="text-foreground">{String(selectedNode.metadata.recency_factor ?? '-')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">IP Trust Factor:</span>
                    <span className="text-foreground">{String(selectedNode.metadata.ip_trust_factor ?? '-')}</span>
                  </div>
                  {Boolean(selectedNode.metadata.evidence) && (
                    <p className="text-[11px] text-muted-foreground/90 font-sans italic mt-1 bg-background/40 p-2 rounded border border-border/40">
                      &quot;{String(selectedNode.metadata.evidence)}&quot;
                    </p>
                  )}
                </div>
              )}
              {onInspectInLibrary && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => onInspectInLibrary(selectedNode.label)}
                  className="w-full h-7 text-[10px] font-mono mt-2 text-primary border-primary/30 hover:bg-primary/10"
                >
                  Inspect in Master Data Library →
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* 2. Investigation Risk Indicators */}
        {graph.riskIndicators && graph.riskIndicators.length > 0 && (
          <Card className="border-amber-500/40 bg-amber-500/5">
            <CardHeader className="py-2.5 px-3">
              <CardTitle className="text-xs font-semibold font-mono text-amber-400 flex items-center gap-1.5 uppercase">
                <AlertTriangle className="w-3.5 h-3.5" /> Risk Indicators ({graph.riskIndicators.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="px-3 pb-3 space-y-1.5">
              {graph.riskIndicators.map((risk, i) => (
                <div key={i} className="text-xs font-mono text-amber-300 bg-background/60 px-2.5 py-1 rounded border border-amber-500/30 flex items-center justify-between">
                  <span className="truncate pr-2">{risk}</span>
                  <Badge variant="outline" className="text-[9px] border-amber-500/40 text-amber-400 shrink-0">RISK</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* 3. Ranked Physical Location Hypotheses */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-semibold uppercase font-mono tracking-wider text-muted-foreground flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" /> Ranked Physical Hypotheses
            </h4>
            <span className="text-[10px] text-muted-foreground font-mono">100% Share Sum</span>
          </div>

          <div className="space-y-2">
            {candidates.map((cand, idx) => (
              <Card 
                key={idx}
                className={`cursor-pointer transition-all ${
                  selectedRankIdx === idx ? 'border-primary ring-1 ring-primary bg-primary/10' : 'hover:border-border/80 bg-muted/20'
                }`}
                onClick={() => setSelectedRankIdx(idx)}
              >
                <CardContent className="p-3 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold font-mono text-xs truncate pr-2 text-foreground">
                      #{cand.rank} {cand.location_label}
                    </span>
                    <Badge variant={idx === 0 ? "default" : "secondary"} className="font-mono text-xs">
                      {cand.evidenceShare}% Share
                    </Badge>
                  </div>
                  <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                    <div 
                      className={`h-1.5 rounded-full transition-all ${idx === 0 ? 'bg-primary' : 'bg-muted-foreground/60'}`} 
                      style={{ width: `${cand.evidenceShare}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-muted-foreground font-mono">
                    <span className="text-emerald-400 font-semibold">{cand.supportingSignalCount} direct signals</span>
                    {cand.contradictionCount > 0 && (
                      <span className="text-destructive font-semibold">{cand.contradictionCount} competing</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* 4. Corroborating Regional Evidence Card */}
        {graph.corroboratingEvidence && graph.corroboratingEvidence.length > 0 && (
          <Card className="border-sky-500/30 bg-sky-500/5">
            <CardHeader className="py-2.5 px-3">
              <CardTitle className="text-xs font-semibold font-mono text-sky-400 flex items-center gap-1.5 uppercase">
                <Compass className="w-3.5 h-3.5" /> Corroborating Regional Evidence ({graph.corroboratingEvidence.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="px-3 pb-3 space-y-2 text-xs">
              {graph.corroboratingEvidence.map((corrob, i) => (
                <div key={i} className="p-2 bg-background/50 rounded border border-sky-500/20">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-medium text-foreground">{corrob.region_label}</span>
                    <Badge variant="outline" className="text-[9px] border-sky-500/40 text-sky-400">CORROBORATION</Badge>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1">{corrob.reasoning}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* 5. Network & Proxy Observations Card */}
        {graph.networkObservations && graph.networkObservations.length > 0 && (
          <Card className="border-purple-500/30 bg-purple-500/5">
            <CardHeader className="py-2.5 px-3">
              <CardTitle className="text-xs font-semibold font-mono text-purple-400 flex items-center gap-1.5 uppercase">
                <Globe className="w-3.5 h-3.5" /> Network Observations ({graph.networkObservations.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="px-3 pb-3 space-y-2 text-xs">
              {graph.networkObservations.map((net, i) => (
                <div key={i} className="p-2 bg-background/50 rounded border border-purple-500/20">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-medium text-purple-300">{net.network_label}</span>
                    {net.is_proxy && <Badge variant="outline" className="text-[9px] border-purple-400/50 text-purple-300">PROXY DISCARDED</Badge>}
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1">{net.reasoning}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* 6. Selected Candidate Evidence Decomposition */}
        {selectedCandidate && (
          <Card className="border-border/60 bg-muted/10">
            <CardHeader className="py-2.5 px-3 border-b border-border/40">
              <CardTitle className="text-xs font-semibold font-mono text-foreground flex items-center justify-between">
                <span>Decomposition: {selectedCandidate.location_label}</span>
                <Badge variant="outline" className="text-[10px]">{selectedCandidate.evidenceShare}% Share</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 space-y-3">
              {/* Supporting Signals */}
              <div>
                <h5 className="text-[10px] font-semibold font-mono uppercase tracking-wider text-emerald-400 mb-1.5 flex items-center gap-1">
                  <Check className="w-3 h-3" /> Direct Signals ({selectedCandidate.supportingSignalCount})
                </h5>
                <div className="space-y-1.5">
                  {selectedCandidate.supportingEvidence.map((ev, i) => (
                    <div key={i} className="p-2 bg-emerald-500/5 rounded border border-emerald-500/20 text-xs">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="font-medium font-mono text-foreground text-[11px]">{ev.signal}</span>
                        <span className="text-[9px] font-mono text-emerald-400">wt: {ev.weight.toFixed(2)}</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground">{ev.evidence}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Competing Hypotheses / Contradictions */}
              {selectedCandidate.contradictions.length > 0 && (
                <div className="pt-2 border-t border-border/40">
                  <h5 className="text-[10px] font-semibold font-mono uppercase tracking-wider text-destructive mb-1.5 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> Competing Hypotheses ({selectedCandidate.contradictionCount})
                  </h5>
                  <div className="space-y-1.5">
                    {selectedCandidate.contradictions.map((c, i) => (
                      <div key={i} className="p-2 bg-destructive/5 rounded border border-destructive/20 text-xs">
                        <span className="font-mono text-destructive text-[11px] block">{c.signal}</span>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{c.reason}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </aside>
  );
};
