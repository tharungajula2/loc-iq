"use client";

import React, { useState, useMemo } from "react";
import { useAppContext } from "../src/context/AppContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { InputForm } from "@/components/InputForm";
import { DataTab } from "@/components/DataTab";
import { OverviewTab } from "@/components/OverviewTab";
import { OutputView } from "@/components/OutputView";
import { GraphVisualizer } from "@/components/GraphVisualizer";
import {
  renderPrimaryIdentifierDetail,
  renderDataFieldDetail,
  renderDerivedColumnDetail,
  renderApiUniverseDetail
} from "@/components/DetailPanels";

export default function Home() {
  const { isAnalyzing, currentTrace, catalogue } = useAppContext();
  const [activeTab, setActiveTab] = useState("overview");

  // Generate Derived Columns Catalogue from Data Fields
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
      }).filter(Boolean);
    });
  }, [catalogue.fields]);

  // Link trace fetched fields to their catalogue items
  const linkedFetchedFields = currentTrace?.fetchedFields.map(f => {
    const catItem = catalogue.fields.find(cf => cf.data_field === f.data_field);
    return { ...f, _catalogueRef: catItem };
  }) || null;

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background text-foreground">
      {/* App Header */}
      <header className="flex-none border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center px-6">
          <div className="flex items-center gap-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary font-bold text-primary-foreground">
              LIQ
            </div>
            <div>
              <h1 className="text-lg font-semibold tracking-tight">LOC-IQ</h1>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                Location Probability — Builder Console
              </p>
            </div>
          </div>
          <div className="ml-auto flex items-center space-x-4">
            {isAnalyzing ? (
              <Badge variant="warning" className="animate-in fade-in transition-all px-3 py-1">
                <span className="mr-2 flex h-2 w-2 rounded-full bg-amber-500 animate-ping" />
                Tracing in progress...
              </Badge>
            ) : currentTrace ? (
              (() => {
                const label = currentTrace.case_label.toUpperCase();
                let colorClass = 'bg-primary/20 text-primary border-primary/30';
                if (label === 'FRAUD') colorClass = 'bg-destructive/20 text-destructive border-destructive/30';
                else if (label === 'MAXIMUM') colorClass = 'bg-amber-500/20 text-amber-500 border-amber-500/30';
                
                return (
                  <Badge variant="outline" className={`ml-4 ${colorClass}`}>
                    <div className={`w-2 h-2 rounded-full mr-2 ${label === 'FRAUD' ? 'bg-destructive' : label === 'MAXIMUM' ? 'bg-amber-500' : 'bg-primary'} animate-pulse`} />
                    Simulation Ready: {label}
                  </Badge>
                );
              })()
            ) : (
              <Badge variant="success" className="animate-in fade-in transition-all px-3 py-1">
                <span className="mr-2 flex h-2 w-2 rounded-full bg-emerald-500" />
                System Ready
              </Badge>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col w-full h-full">
          
          <div className="flex-none border-b border-border/50 px-6 pt-4 bg-muted/20">
            <TabsList className="h-10 w-full justify-start gap-2 bg-transparent p-0 overflow-x-auto overflow-y-hidden">
              <TabsTrigger value="overview" className="data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-t-lg rounded-b-none border-b-0 h-10 px-4">
                Overview
              </TabsTrigger>
              <TabsTrigger value="primary-identifiers" className="data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-t-lg rounded-b-none border-b-0 h-10 px-4">
                Primary Identifiers
              </TabsTrigger>
              <TabsTrigger value="api-universe" className="data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-t-lg rounded-b-none border-b-0 h-10 px-4">
                API Universe
              </TabsTrigger>
              <TabsTrigger value="fetched-data" className="data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-t-lg rounded-b-none border-b-0 h-10 px-4">
                Fetched Data Fields
              </TabsTrigger>
              <TabsTrigger value="derived-columns" className="data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-t-lg rounded-b-none border-b-0 h-10 px-4">
                Derived Columns
              </TabsTrigger>
              <TabsTrigger value="graph-engine" className="data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-t-lg rounded-b-none border-b-0 h-10 px-4 text-primary font-medium">
                Graph Engine
              </TabsTrigger>
              <TabsTrigger value="output" className="data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-t-lg rounded-b-none border-b-0 h-10 px-4">
                Output
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 overflow-y-auto bg-muted/10 p-6 relative">
            <TabsContent value="overview" className="mt-0 h-full border-none p-0 outline-none">
              <OverviewTab setActiveTab={setActiveTab} />
            </TabsContent>
            
            <TabsContent value="primary-identifiers" className="mt-0 h-full border-none p-0 outline-none">
              <div className="h-full overflow-y-auto max-w-7xl mx-auto flex gap-6">
                <div className="w-1/3">
                  <InputForm />
                </div>
                <div className="w-2/3 h-full">
                  <DataTab 
                    title="Primary Identifiers" 
                    bannerDescription="The starting inputs that unlock the rest of the trace."
                    excelSheetName="1. Primary Identifiers"
                    catalogueData={catalogue.identifiers}
                    traceData={currentTrace ? catalogue.identifiers.filter(id => Object.keys(currentTrace.input).includes(id.identifier)) : null}
                    catalogueColumns={[
                      { key: "identifier", label: "Identifier" },
                      { key: "category", label: "Category", isBadge: true },
                      { key: "what_it_unlocks", label: "Unlocks" }
                    ]}
                    traceColumns={[
                      { key: "identifier", label: "Identifier" },
                      { key: "category", label: "Category", isBadge: true },
                      { key: "what_it_unlocks", label: "Unlocks" }
                    ]}
                    renderDetailPanel={renderPrimaryIdentifierDetail}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="api-universe" className="mt-0 h-full border-none p-0 outline-none">
              <div className="h-full overflow-y-auto max-w-7xl mx-auto">
                <DataTab 
                  title="API Universe" 
                  bannerDescription="The full catalogue of external APIs and internal systems used to build the graph network."
                  excelSheetName="4. The API Universe"
                  catalogueData={catalogue.apis}
                  traceData={currentTrace ? catalogue.apis.filter(api => currentTrace.fetchedFields.some(f => f.source_api === api.source) || currentTrace.signals.some(s => s.source_api === api.source)) : null}
                  catalogueColumns={[
                    { key: "source", label: "Provider / API" },
                    { key: "access", label: "Access Type", isBadge: true },
                    { key: "what_it_returns", label: "Returns" }
                  ]}
                  traceColumns={[
                    { key: "source", label: "Provider / API" },
                    { key: "access", label: "Access Type", isBadge: true },
                    { key: "what_it_returns", label: "Returns" }
                  ]}
                  renderDetailPanel={renderApiUniverseDetail}
                />
              </div>
            </TabsContent>

            <TabsContent value="fetched-data" className="mt-0 h-full border-none p-0 outline-none">
              <div className="h-full overflow-y-auto max-w-7xl mx-auto">
                <DataTab 
                  title="Fetched Data Fields" 
                  bannerDescription="Raw payload data retrieved from various APIs and databases."
                  excelSheetName="2. Fetched Data Fields"
                  catalogueData={catalogue.fields}
                  traceData={linkedFetchedFields}
                  catalogueColumns={[
                    { key: "data_field", label: "Data Field" },
                    { key: "category", label: "Category" },
                    { key: "fetched_using_key", label: "Fetched Using Key" },
                    { key: "sits_in", label: "Sits In", tooltip: "Internal bank data vs Public data", customBadge: (val) => {
                      if (typeof val !== 'string') return { text: val, className: 'border-slate-500 text-slate-500' };
                      const lower = val.toLowerCase();
                      if (lower.includes('bank-internal')) return { text: 'Bank permission', className: 'border-amber-500 text-amber-600 bg-amber-500/10' };
                      if (lower.includes('consent')) return { text: 'Consent', className: 'border-blue-500 text-blue-600 bg-blue-500/10' };
                      if (lower.includes('regulated')) return { text: 'Regulated', className: 'border-purple-500 text-purple-600 bg-purple-500/10' };
                      return { text: 'Public', className: 'border-emerald-500 text-emerald-600 bg-emerald-500/10' };
                    }}
                  ]}
                  traceColumns={[
                    { key: "data_field", label: "Data Field" },
                    { key: "value", label: "Value", isBadge: true },
                    { key: "source_api", label: "Returned By" },
                    { key: "resolves_to", label: "Resolves To", isBadge: true },
                    { key: "freshness_date", label: "Freshness" }
                  ]}
                  renderDetailPanel={renderDataFieldDetail}
                />
              </div>
            </TabsContent>

            <TabsContent value="derived-columns" className="mt-0 h-full border-none p-0 outline-none">
               <div className="h-full overflow-y-auto max-w-7xl mx-auto">
                <DataTab 
                  title="Derived Columns" 
                  bannerDescription="Secondary inferred values, scoring logic, and graph signals."
                  excelSheetName="3. Derived Columns"
                  catalogueData={derivedCatalogue}
                  traceData={currentTrace ? currentTrace.signals : null}
                  catalogueColumns={[
                    { key: "derived_variable", label: "Signal / Derived Variable" },
                    { key: "parent_field", label: "Parent Field" },
                    { key: "category", label: "Category", isBadge: true }
                  ]}
                  traceColumns={[
                    { key: "signal", label: "Signal / Derived Variable" },
                    { key: "base_weight", label: "Weight", isBadge: true },
                    { key: "evidence", label: "Value / Evidence" }
                  ]}
                  renderDetailPanel={renderDerivedColumnDetail}
                />
              </div>
            </TabsContent>

            <TabsContent value="graph-engine" className="mt-0 h-full border-none p-0 outline-none">
              <div className="h-full">
                <GraphVisualizer />
              </div>
            </TabsContent>

            <TabsContent value="output" className="mt-0 h-full border-none p-0 outline-none">
              <div className="h-full">
                <OutputView />
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </main>
    </div>
  );
}
