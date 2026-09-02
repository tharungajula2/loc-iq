"use client";

import React, { useState, useMemo } from "react";
import { useAppContext } from "../context/AppContext";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  BookOpen, Database, Fingerprint, Activity, Search, ShieldCheck, 
  FileText, CheckCircle2, Lock, Globe, Filter, X, ArrowUpRight 
} from "lucide-react";
import masterclassData from "../data/masterclass.json";
import { MarkdownText } from "./MarkdownText";

interface ReferenceLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialFocusKey?: string | null;
  onViewInIntelligenceGraph?: (canonicalId: string) => void;
}

export const ReferenceLibraryModal: React.FC<ReferenceLibraryModalProps> = ({ 
  isOpen, 
  onClose,
  initialFocusKey = null,
  onViewInIntelligenceGraph
}) => {
  const { catalogue, currentTrace } = useAppContext();

  const [activeTab, setActiveTab] = useState<"identifiers" | "apis" | "fields" | "derived" | "masterclass">("apis");
  const [searchTerm, setSearchTerm] = useState<string>(initialFocusKey || "");
  const [accessFilter, setAccessFilter] = useState<string>("ALL");
  const [activeOnlyFilter, setActiveOnlyFilter] = useState<boolean>(false);
  const [selectedRecord, setSelectedRecord] = useState<{ type: string; data: Record<string, unknown> } | null>(null);

  // Sync search term if initialFocusKey changes
  React.useEffect(() => {
    if (initialFocusKey) {
      const timer = setTimeout(() => setSearchTerm(initialFocusKey), 0);
      return () => clearTimeout(timer);
    }
  }, [initialFocusKey]);

  // Derived Signals Catalogue Generation
  const derivedSignalsList = useMemo(() => {
    const list: Array<{
      derived_variable: string;
      parent_field: string;
      category: string;
      description: string;
      rawField: Record<string, unknown>;
    }> = [];

    catalogue.fields.forEach(field => {
      if (!field.derived_columns || field.derived_columns.includes('(not used')) return;
      field.derived_columns.split('. ').forEach(dc => {
        const parts = dc.split('=');
        if (parts.length >= 2) {
          list.push({
            derived_variable: parts[0].trim(),
            parent_field: field.data_field,
            category: field.category,
            description: parts.slice(1).join('=').trim(),
            rawField: field as unknown as Record<string, unknown>
          });
        }
      });
    });
    return list;
  }, [catalogue.fields]);

  // Active Trace Sets for Cross-Referencing
  const activeSet = useMemo(() => {
    const identifiers = new Set<string>();
    const apis = new Set<string>();
    const fields = new Set<string>();
    const signals = new Set<string>();

    if (currentTrace) {
      if (currentTrace.input) {
        Object.entries(currentTrace.input).forEach(([k, v]) => {
          if (v && v.trim() !== '') identifiers.add(k);
        });
      }
      if (currentTrace.fetchedFields) {
        currentTrace.fetchedFields.forEach(f => {
          fields.add(f.data_field);
          if (f.source_api) apis.add(f.source_api);
        });
      }
      if (currentTrace.signals) {
        currentTrace.signals.forEach(s => {
          signals.add(s.signal);
        });
      }
      if (currentTrace.graph && currentTrace.graph.nodes) {
        currentTrace.graph.nodes.forEach(n => {
          if (n.type === 'IDENTIFIER') identifiers.add(n.label);
          if (n.type === 'SOURCE') apis.add(n.label);
          if (n.type === 'EVIDENCE') fields.add(n.label);
          if (n.type === 'SIGNAL') signals.add(n.label);
        });
      }
    }

    return { identifiers, apis, fields, signals };
  }, [currentTrace]);

  const term = searchTerm.toLowerCase().trim();

  // 1. Filtered Identifiers (6 total)
  const filteredIdentifiers = useMemo(() => {
    return catalogue.identifiers.filter(item => {
      const isMatch = !term || 
        item.identifier.toLowerCase().includes(term) || 
        item.category.toLowerCase().includes(term) || 
        item.what_it_means.toLowerCase().includes(term) ||
        item.what_it_unlocks.toLowerCase().includes(term);

      const isActive = activeSet.identifiers.has(item.identifier);
      if (activeOnlyFilter && !isActive) return false;
      return isMatch;
    });
  }, [catalogue.identifiers, term, activeOnlyFilter, activeSet.identifiers]);

  // 2. Filtered API Universe (46 total)
  const filteredApis = useMemo(() => {
    return catalogue.apis.filter(api => {
      const isMatch = !term || 
        api.source.toLowerCase().includes(term) || 
        (api.access && api.access.toLowerCase().includes(term)) || 
        (api.what_it_returns && api.what_it_returns.toLowerCase().includes(term)) ||
        (api.why_it_matters && api.why_it_matters.toLowerCase().includes(term)) ||
        (api.input_needed && api.input_needed.toLowerCase().includes(term));

      const isActive = activeSet.apis.has(api.source) || activeSet.apis.has(api.id);
      if (activeOnlyFilter && !isActive) return false;

      if (accessFilter !== 'ALL') {
        if (accessFilter === 'PUBLIC' && !api.access?.toLowerCase().includes('public')) return false;
        if (accessFilter === 'PERMISSIONED' && api.access?.toLowerCase().includes('public')) return false;
      }

      return isMatch;
    });
  }, [catalogue.apis, term, activeOnlyFilter, accessFilter, activeSet.apis]);

  // 3. Filtered Data Fields (42 total)
  const filteredFields = useMemo(() => {
    return catalogue.fields.filter(f => {
      const isMatch = !term || 
        f.data_field.toLowerCase().includes(term) || 
        f.category.toLowerCase().includes(term) || 
        f.where_it_comes_from.toLowerCase().includes(term) ||
        f.what_it_means.toLowerCase().includes(term) ||
        f.sits_in.toLowerCase().includes(term);

      const isActive = activeSet.fields.has(f.data_field);
      if (activeOnlyFilter && !isActive) return false;

      if (accessFilter !== 'ALL') {
        if (accessFilter === 'PERMISSIONED' && !f.sits_in?.toLowerCase().includes('bank permission')) return false;
      }

      return isMatch;
    });
  }, [catalogue.fields, term, activeOnlyFilter, accessFilter, activeSet.fields]);

  // 4. Filtered Derived Signals
  const filteredDerived = useMemo(() => {
    return derivedSignalsList.filter(s => {
      const isMatch = !term || 
        s.derived_variable.toLowerCase().includes(term) || 
        s.parent_field.toLowerCase().includes(term) || 
        s.category.toLowerCase().includes(term) ||
        s.description.toLowerCase().includes(term);

      const isActive = activeSet.signals.has(s.derived_variable);
      if (activeOnlyFilter && !isActive) return false;

      return isMatch;
    });
  }, [derivedSignalsList, term, activeOnlyFilter, activeSet.signals]);

  // 5. Masterclass Entries
  const masterclassEntries = useMemo(() => {
    return Object.entries(masterclassData as Record<string, string>).filter(([key, text]) => {
      if (!term) return true;
      return key.toLowerCase().includes(term) || text.toLowerCase().includes(term);
    });
  }, [term]);

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-[95vw] max-w-[1300px] sm:max-w-[1400px] overflow-hidden bg-card p-0 border-l border-border select-none flex flex-col">
        {/* Top Header Bar */}
        <SheetHeader className="p-4 border-b border-border/80 bg-muted/20 flex-none space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded bg-primary/10 border border-primary/30 text-primary">
                <BookOpen className="w-5 h-5 text-primary" />
              </div>
              <div>
                <SheetTitle className="text-xl font-bold tracking-tight font-mono text-foreground">
                  Master Data & Fraud Intelligence Library
                </SheetTitle>
                <p className="text-xs text-muted-foreground">
                  Complete technical registry: 6 Primary Identifiers, 46 API Sources, 42 Data Fields, Derived Signals, and Forensic Masterclass.
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 font-mono text-xs">
              <Badge variant="outline" className="border-primary/40 text-primary bg-primary/5">
                {catalogue.identifiers.length} Identifiers
              </Badge>
              <Badge variant="outline" className="border-sky-500/40 text-sky-400 bg-sky-500/5">
                {catalogue.apis.length} Mapped APIs
              </Badge>
              <Badge variant="outline" className="border-emerald-500/40 text-emerald-400 bg-emerald-500/5">
                {catalogue.fields.length} Data Fields
              </Badge>
              <Badge variant="outline" className="border-amber-500/40 text-amber-400 bg-amber-500/5">
                {derivedSignalsList.length} Derived Variables
              </Badge>
            </div>
          </div>

          {/* Search & Filter Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="relative flex-1 min-w-[280px]">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground" />
              <Input 
                placeholder="Search across all 6 identifiers, 46 APIs, 42 data fields, and masterclass docs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 text-xs font-mono h-9 bg-muted/20 border-border/80"
              />
              {searchTerm && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setSearchTerm("")} 
                  className="absolute right-1 top-1 h-7 w-7 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-3.5 h-3.5" />
                </Button>
              )}
            </div>

            <div className="flex items-center space-x-2 text-xs font-mono">
              <span className="text-muted-foreground flex items-center gap-1"><Filter className="w-3 h-3" /> Access:</span>
              <Button 
                variant={accessFilter === 'ALL' ? 'default' : 'outline'} 
                size="sm" 
                onClick={() => setAccessFilter('ALL')}
                className="h-7 text-xs px-2.5"
              >
                All
              </Button>
              <Button 
                variant={accessFilter === 'PUBLIC' ? 'default' : 'outline'} 
                size="sm" 
                onClick={() => setAccessFilter('PUBLIC')}
                className="h-7 text-xs px-2.5 text-sky-400"
              >
                <Globe className="w-3 h-3 mr-1" /> Public APIs
              </Button>
              <Button 
                variant={accessFilter === 'PERMISSIONED' ? 'default' : 'outline'} 
                size="sm" 
                onClick={() => setAccessFilter('PERMISSIONED')}
                className="h-7 text-xs px-2.5 text-amber-400"
              >
                <Lock className="w-3 h-3 mr-1" /> Permissioned
              </Button>

              <div className="h-4 w-px bg-border/60 mx-1" />

              <Button
                variant={activeOnlyFilter ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveOnlyFilter(!activeOnlyFilter)}
                className={`h-7 text-xs px-2.5 font-bold ${activeOnlyFilter ? 'bg-emerald-600 text-white' : 'text-emerald-400'}`}
              >
                <CheckCircle2 className="w-3 h-3 mr-1" /> Active in Current Case
              </Button>
            </div>
          </div>
        </SheetHeader>

        {/* Workspace Body: Left Registry List + Right Record Detail Inspector */}
        <div className="flex flex-1 overflow-hidden">
          {/* Main Registry Column */}
          <div className="flex-1 flex flex-col overflow-hidden border-r border-border/80">
            {/* Collection Tabs Header */}
            <div className="px-4 py-2 bg-muted/40 border-b border-border/60 flex-none">
              <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "identifiers" | "apis" | "fields" | "derived" | "masterclass")}>
                <TabsList className="bg-background/80 border border-border/60 p-1 font-mono text-xs">
                  <TabsTrigger value="apis" className="text-xs">
                    <Database className="w-3.5 h-3.5 mr-1.5 text-sky-400" /> API Sources ({filteredApis.length})
                  </TabsTrigger>
                  <TabsTrigger value="fields" className="text-xs">
                    <Activity className="w-3.5 h-3.5 mr-1.5 text-emerald-400" /> Data Fields ({filteredFields.length})
                  </TabsTrigger>
                  <TabsTrigger value="identifiers" className="text-xs">
                    <Fingerprint className="w-3.5 h-3.5 mr-1.5 text-purple-400" /> Primary Identifiers ({filteredIdentifiers.length})
                  </TabsTrigger>
                  <TabsTrigger value="derived" className="text-xs">
                    <ShieldCheck className="w-3.5 h-3.5 mr-1.5 text-amber-400" /> Derived Signals ({filteredDerived.length})
                  </TabsTrigger>
                  <TabsTrigger value="masterclass" className="text-xs">
                    <FileText className="w-3.5 h-3.5 mr-1.5 text-red-400" /> Masterclass Docs ({masterclassEntries.length})
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Collection Content Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {/* TAB 1: API / DATA SOURCES */}
              {activeTab === 'apis' && (
                <div className="border rounded-lg overflow-hidden border-border/60 bg-muted/10">
                  <Table>
                    <TableHeader className="bg-muted/50 font-mono text-xs sticky top-0 z-10">
                      <TableRow>
                        <TableHead>Source Provider</TableHead>
                        <TableHead>Access Classification</TableHead>
                        <TableHead>Input Needed</TableHead>
                        <TableHead>What It Returns</TableHead>
                        <TableHead className="text-right">Case Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="text-xs font-mono">
                      {filteredApis.map((api, idx) => {
                        const isActive = activeSet.apis.has(api.source) || activeSet.apis.has(api.id);
                        return (
                          <TableRow 
                            key={idx} 
                            onClick={() => setSelectedRecord({ type: 'api', data: api as unknown as Record<string, unknown> })}
                            className="hover:bg-primary/10 cursor-pointer transition-colors"
                          >
                            <TableCell className="font-bold text-foreground flex items-center gap-2">
                              <span>{api.source}</span>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className={`text-[10px] ${
                                api.access?.toLowerCase().includes('public') ? 'border-sky-500/40 text-sky-400 bg-sky-500/5' : 'border-amber-500/40 text-amber-400 bg-amber-500/5'
                              }`}>
                                {api.access}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-muted-foreground max-w-[150px] truncate">{api.input_needed || 'Seed Identifier'}</TableCell>
                            <TableCell className="text-muted-foreground max-w-xs truncate">{api.what_it_returns}</TableCell>
                            <TableCell className="text-right">
                              {isActive ? (
                                <Badge variant="default" className="bg-emerald-600 text-white font-mono text-[9px]">
                                  <CheckCircle2 className="w-3 h-3 mr-1" /> ACTIVE IN CASE
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="text-[9px] text-muted-foreground">Mapped</Badge>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}

              {/* TAB 2: FETCHED DATA FIELDS */}
              {activeTab === 'fields' && (
                <div className="border rounded-lg overflow-hidden border-border/60 bg-muted/10">
                  <Table>
                    <TableHeader className="bg-muted/50 font-mono text-xs sticky top-0 z-10">
                      <TableRow>
                        <TableHead>Data Field</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Where It Sits / Bank Permission</TableHead>
                        <TableHead>Source Origin</TableHead>
                        <TableHead className="text-right">Case Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="text-xs font-mono">
                      {filteredFields.map((field, idx) => {
                        const isActive = activeSet.fields.has(field.data_field);
                        return (
                          <TableRow 
                            key={idx} 
                            onClick={() => setSelectedRecord({ type: 'field', data: field as unknown as Record<string, unknown> })}
                            className="hover:bg-primary/10 cursor-pointer transition-colors"
                          >
                            <TableCell className="font-bold text-emerald-400">{field.data_field}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="text-[10px]">{field.category}</Badge>
                            </TableCell>
                            <TableCell className="text-muted-foreground max-w-[200px] truncate">{field.sits_in}</TableCell>
                            <TableCell className="text-muted-foreground max-w-[150px] truncate">{field.where_it_comes_from}</TableCell>
                            <TableCell className="text-right">
                              {isActive ? (
                                <Badge variant="default" className="bg-emerald-600 text-white font-mono text-[9px]">
                                  <CheckCircle2 className="w-3 h-3 mr-1" /> ACTIVE IN CASE
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="text-[9px] text-muted-foreground">Catalogue</Badge>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}

              {/* TAB 3: PRIMARY IDENTIFIERS */}
              {activeTab === 'identifiers' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredIdentifiers.map((item, idx) => {
                    const isActive = activeSet.identifiers.has(item.identifier);
                    return (
                      <Card 
                        key={idx} 
                        onClick={() => setSelectedRecord({ type: 'identifier', data: item as unknown as Record<string, unknown> })}
                        className="bg-muted/10 border-border/60 hover:border-primary cursor-pointer transition-colors"
                      >
                        <CardHeader className="py-2.5 px-4 bg-muted/20 border-b border-border/40 flex flex-row items-center justify-between">
                          <CardTitle className="text-sm font-bold font-mono text-purple-400">{item.identifier}</CardTitle>
                          <div className="flex items-center space-x-2">
                            {isActive && (
                              <Badge variant="default" className="bg-emerald-600 text-white text-[9px] font-mono">
                                ACTIVE IN CASE
                              </Badge>
                            )}
                            <Badge variant="outline" className="text-[10px]">{item.category}</Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="p-4 space-y-2 text-xs font-mono">
                          <div>
                            <span className="text-muted-foreground text-[10px] block uppercase font-sans">Meaning</span>
                            <p className="text-foreground leading-relaxed font-sans">{item.what_it_means}</p>
                          </div>
                          <div className="pt-2 border-t border-border/40 flex justify-between items-center text-[10px]">
                            <span className="text-muted-foreground">Example format:</span>
                            <span className="text-foreground font-bold">{item.example}</span>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}

              {/* TAB 4: DERIVED SIGNALS / VARIABLES */}
              {activeTab === 'derived' && (
                <div className="border rounded-lg overflow-hidden border-border/60 bg-muted/10">
                  <Table>
                    <TableHeader className="bg-muted/50 font-mono text-xs sticky top-0 z-10">
                      <TableRow>
                        <TableHead>Derived Signal</TableHead>
                        <TableHead>Parent Field</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Signal Meaning & Logic</TableHead>
                        <TableHead className="text-right">Case Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="text-xs font-mono">
                      {filteredDerived.map((sig, idx) => {
                        const isActive = activeSet.signals.has(sig.derived_variable);
                        return (
                          <TableRow 
                            key={idx} 
                            onClick={() => setSelectedRecord({ type: 'signal', data: sig as unknown as Record<string, unknown> })}
                            className="hover:bg-primary/10 cursor-pointer transition-colors"
                          >
                            <TableCell className="font-bold text-amber-400">{sig.derived_variable}</TableCell>
                            <TableCell className="text-emerald-400 font-semibold">{sig.parent_field}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="text-[10px]">{sig.category}</Badge>
                            </TableCell>
                            <TableCell className="text-muted-foreground max-w-sm truncate">{sig.description}</TableCell>
                            <TableCell className="text-right">
                              {isActive ? (
                                <Badge variant="default" className="bg-emerald-600 text-white font-mono text-[9px]">
                                  <CheckCircle2 className="w-3 h-3 mr-1" /> ACTIVE IN CASE
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="text-[9px] text-muted-foreground">Catalogue</Badge>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}

              {/* TAB 5: FORENSIC MASTERCLASS */}
              {activeTab === 'masterclass' && (
                <div className="space-y-4">
                  {masterclassEntries.map(([key, text], idx) => (
                    <Card key={idx} className="bg-muted/10 border-border/60">
                      <CardHeader className="py-2.5 px-4 bg-muted/20 border-b border-border/40">
                        <CardTitle className="text-sm font-bold font-mono text-red-400">{key}</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4">
                        <MarkdownText text={text} />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Record Detail Inspector (Exposes ALL raw metadata) */}
          <div className="w-[420px] flex-none bg-muted/20 flex flex-col overflow-y-auto p-4 select-text">
            {selectedRecord ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-border/60 pb-3">
                  <div>
                    <span className="text-[10px] uppercase font-mono text-primary font-semibold">Record Inspector</span>
                    <h3 className="text-sm font-bold font-mono text-foreground">
                      {String(selectedRecord.data.source || selectedRecord.data.data_field || selectedRecord.data.identifier || selectedRecord.data.derived_variable || 'Record Detail')}
                    </h3>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setSelectedRecord(null)} className="h-6 w-6 text-muted-foreground">
                    <X className="w-3.5 h-3.5" />
                  </Button>
                </div>

                <div className="space-y-3 font-mono text-xs">
                  {Object.entries(selectedRecord.data).map(([k, v]) => {
                    if (v === null || v === undefined || k.startsWith('_') || k === 'rawField') return null;
                    return (
                      <div key={k} className="p-2.5 bg-card rounded border border-border/40 space-y-1">
                        <span className="text-[10px] uppercase font-semibold text-primary block font-sans">{k.replace(/_/g, ' ')}</span>
                        {typeof v === 'string' && v.startsWith('http') ? (
                          <a href={v} target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:underline flex items-center gap-1 text-[11px]">
                            {v} <ArrowUpRight className="w-3 h-3" />
                          </a>
                        ) : (
                          <p className="text-foreground leading-relaxed text-xs whitespace-pre-line font-sans">{String(v)}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
                {onViewInIntelligenceGraph && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const canonicalId = (selectedRecord.data.id || selectedRecord.data.identifier || selectedRecord.data.data_field || selectedRecord.data.derived_variable) as string;
                      onClose();
                      onViewInIntelligenceGraph(canonicalId);
                    }}
                    className="w-full h-8 text-xs font-mono mt-4 text-sky-400 border-sky-500/40 hover:bg-sky-950/30"
                  >
                    View in Intelligence Graph →
                  </Button>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-3 text-muted-foreground p-6">
                <BookOpen className="w-10 h-10 opacity-30 text-primary" />
                <h4 className="font-mono text-sm font-bold text-foreground">Complete Metadata Inspector</h4>
                <p className="text-xs max-w-xs leading-relaxed">
                  Click any API source, data field, primary identifier, or derived signal row on the left to inspect its complete underlying schema and forensic metadata.
                </p>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
