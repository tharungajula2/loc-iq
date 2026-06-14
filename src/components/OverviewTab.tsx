import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Activity, Database, Network, Target, MapPin, X, Info } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export function OverviewTab({ setActiveTab }: { setActiveTab: (tab: string) => void }) {
  const { loadDemoCase, catalogue } = useAppContext();
  const [showIntro, setShowIntro] = useState(true);

  const handleDemo = async (type: 'clean' | 'fraud' | 'maximum') => {
    setActiveTab('graph-engine');
    await loadDemoCase(type);
  };

  const steps = [
    { id: 'primary-identifiers', icon: <MapPin className="w-5 h-5"/>, title: 'Identifiers', desc: 'Starting keys' },
    { id: 'api-universe', icon: <Database className="w-5 h-5"/>, title: 'APIs/Sources', desc: 'Data providers' },
    { id: 'fetched-data', icon: <Database className="w-5 h-5"/>, title: 'Data Fields', desc: 'Raw fetched values' },
    { id: 'derived-columns', icon: <Activity className="w-5 h-5"/>, title: 'Derived', desc: 'Computed metrics' },
    { id: 'graph-engine', icon: <Network className="w-5 h-5"/>, title: 'Knowledge Graph', desc: 'Pipeline visualizer' },
    { id: 'output', icon: <Target className="w-5 h-5"/>, title: 'Output', desc: 'Ranked candidates' }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-10">
      <div className="text-center space-y-4 pt-10">
        <h1 className="text-4xl font-extrabold tracking-tight text-primary">Loc-IQ Builder Console</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          A builder's visualization console for inspecting the entire fraud-location pipeline. 
          It ranks likely physical locations from digital footprints and bank events — no live GPS required.
        </p>
      </div>

      {showIntro && (
        <Card className="bg-sky-500/10 border-sky-500/30 relative animate-in fade-in zoom-in duration-300">
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-2 right-2 h-8 w-8 text-muted-foreground hover:text-foreground"
            onClick={() => setShowIntro(false)}
          >
            <X className="h-4 w-4" />
          </Button>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2 text-sky-500">
              <Info className="h-5 w-5" /> 
              How to use this console
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
              <li><strong>Load a Trace:</strong> Click one of the demo buttons below to initiate a simulation.</li>
              <li><strong>Inspect the Data:</strong> Navigate through the tabs. Switch between <em>Catalogue</em> (the full library) and <em>This Trace</em> (the active case data).</li>
              <li><strong>Click Everything:</strong> Every row in the data tables and every node in the graph is clickable. Click them to open a deep-dive explanation panel.</li>
              <li><strong>Analyze the Output:</strong> See how the graph engine resolves conflicting signals into a final Ranked Location Output.</li>
            </ol>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg">Clean Demo</CardTitle>
            <p className="text-xs text-muted-foreground">Everything agrees on Bengaluru. Truth flag GREEN.</p>
          </CardHeader>
          <CardContent>
            <Button onClick={() => handleDemo('clean')} className="w-full" size="sm">
              <Play className="w-3 h-3 mr-2" /> Simulate
            </Button>
          </CardContent>
        </Card>
        <Card className="bg-destructive/5 border-destructive/20">
          <CardHeader>
            <CardTitle className="text-lg">Fraud Demo</CardTitle>
            <p className="text-xs text-muted-foreground">Proxy IP and conflicting evidence. Truth flag RED.</p>
          </CardHeader>
          <CardContent>
            <Button onClick={() => handleDemo('fraud')} variant="destructive" className="w-full" size="sm">
              <Play className="w-3 h-3 mr-2" /> Simulate
            </Button>
          </CardContent>
        </Card>
        <Card className="bg-amber-500/5 border-amber-500/20">
          <CardHeader>
            <CardTitle className="text-lg">Maximum Data</CardTitle>
            <p className="text-xs text-muted-foreground">Hits all available APIs to showcase engine scale.</p>
          </CardHeader>
          <CardContent>
            <Button onClick={() => handleDemo('maximum')} variant="outline" className="w-full border-amber-500/50 text-amber-600 hover:bg-amber-500/10" size="sm">
              <Play className="w-3 h-3 mr-2" /> Simulate
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>The Pipeline Architecture</CardTitle>
          <p className="text-sm text-muted-foreground">Click any stage to inspect the underlying knowledge base and active trace data.</p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {steps.map((step, idx) => (
              <React.Fragment key={step.id}>
                <div 
                  className="flex flex-col items-center gap-2 cursor-pointer group p-3 rounded-lg hover:bg-muted transition-colors flex-1 text-center"
                  onClick={() => setActiveTab(step.id)}
                >
                  <div className="bg-background p-3 rounded-full border group-hover:border-primary group-hover:text-primary transition-colors">
                    {step.icon}
                  </div>
                  <div className="font-semibold text-sm">{step.title}</div>
                  <div className="text-xs text-muted-foreground">{step.desc}</div>
                </div>
                {idx < steps.length - 1 && (
                  <div className="hidden sm:block text-muted-foreground/50">→</div>
                )}
              </React.Fragment>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-muted/30">
          <CardHeader className="py-4"><CardTitle className="text-sm font-medium text-muted-foreground">Primary Identifiers</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold">{catalogue.identifiers.length}</div></CardContent>
        </Card>
        <Card className="bg-muted/30">
          <CardHeader className="py-4"><CardTitle className="text-sm font-medium text-muted-foreground">API Universe</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold">{catalogue.apis.length}</div></CardContent>
        </Card>
        <Card className="bg-muted/30">
          <CardHeader className="py-4"><CardTitle className="text-sm font-medium text-muted-foreground">Data Fields</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold">{catalogue.fields.length}</div></CardContent>
        </Card>
      </div>

    </div>
  );
}
