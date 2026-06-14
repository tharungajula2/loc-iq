import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import masterclassData from '../data/masterclass.json';

const MarkdownText = ({ text }: { text: string }) => {
  return (
    <div className="space-y-3 text-sm leading-relaxed text-foreground/90">
      {text.split('\n').map((line, i) => {
        if (!line.trim()) return null;
        // Basic bold parser
        const parts = line.split(/(\*\*.*?\*\*|`.*?`)/g);
        return (
          <p key={i} className={line.startsWith('- ') ? 'ml-4 flex gap-2' : 'mt-2'}>
            {line.startsWith('- ') && <span className="text-primary mt-1">•</span>}
            <span>
              {parts.map((p, j) => {
                if (p.startsWith('**') && p.endsWith('**')) {
                  return <strong key={j} className="text-foreground">{p.slice(2, -2)}</strong>;
                }
                if (p.startsWith('`') && p.endsWith('`')) {
                  return <code key={j} className="bg-muted px-1 py-0.5 rounded text-xs font-mono">{p.slice(1, -1)}</code>;
                }
                return p.startsWith('- ') ? p.substring(2) : p;
              })}
            </span>
          </p>
        );
      })}
    </div>
  );
};

export const renderPrimaryIdentifierDetail = (item: any, isTrace: boolean) => {
  const deepDiveText = (masterclassData as Record<string, string>)[item.identifier];
  return (
  <div className="space-y-4">
    <div className="grid grid-cols-2 gap-4">
      <div>
        <h4 className="text-sm font-medium text-muted-foreground">Category</h4>
        <p className="mt-1 font-medium">{item.category}</p>
      </div>
      <div>
        <h4 className="text-sm font-medium text-muted-foreground">Identifier Key</h4>
        <Badge variant="outline" className="mt-1">{item.identifier}</Badge>
      </div>
    </div>
    
    <div>
      <h4 className="text-sm font-medium text-muted-foreground border-b pb-1 mb-2">Where it comes from</h4>
      <p className="text-sm leading-relaxed">{item.where_it_comes_from}</p>
    </div>

    <div>
      <h4 className="text-sm font-medium text-muted-foreground border-b pb-1 mb-2">What it means</h4>
      <p className="text-sm leading-relaxed">{item.what_it_means}</p>
    </div>

    <div>
      <h4 className="text-sm font-medium text-muted-foreground border-b pb-1 mb-2">Why it matters</h4>
      <p className="text-sm leading-relaxed">{item.why_it_matters}</p>
    </div>

    <div>
      <h4 className="text-sm font-medium text-muted-foreground border-b pb-1 mb-2">What this key unlocks</h4>
      <p className="text-sm leading-relaxed text-primary/90">{item.what_it_unlocks}</p>
    </div>

    <div>
      <h4 className="text-sm font-medium text-muted-foreground border-b pb-1 mb-2">Derived Columns</h4>
      <p className="text-sm leading-relaxed whitespace-pre-wrap text-emerald-500/90 font-mono text-xs p-3 bg-muted rounded-md border">
        {item.derived_columns.split('. ').map((col: string, i: number) => (
          <span key={i} className="block mb-1">{col.trim()}{col.endsWith('.') ? '' : '.'}</span>
        ))}
      </p>
    </div>

    <div>
      <h4 className="text-sm font-medium text-muted-foreground">Example</h4>
      <code className="text-xs bg-muted px-2 py-1 rounded mt-1 block">{item.example}</code>
    </div>

    {deepDiveText && (
      <div className="mt-8 pt-6 border-t">
        <h4 className="text-sm font-bold text-primary mb-3 uppercase tracking-wider flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          Forensic Deep Dive
        </h4>
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 shadow-inner">
          <MarkdownText text={deepDiveText} />
        </div>
      </div>
    )}
  </div>
  );
};

export const renderDataFieldDetail = (item: any, isTrace: boolean) => {
  const catalogueItem = item._catalogueRef || item;
  const traceItem = item._catalogueRef ? item : (isTrace && item.value ? item : null);
  const targetKey = catalogueItem?.data_field;
  const deepDiveText = (masterclassData as Record<string, string>)[targetKey];
  
  return (
    <div className="space-y-4">
      {traceItem && (
        <Card className="bg-primary/10 border-primary/30 mb-6">
          <CardHeader className="py-3 px-4">
            <CardTitle className="text-sm font-medium text-primary">Trace Data</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 space-y-2">
            <div><span className="text-xs text-muted-foreground">Value:</span> <span className="font-mono text-sm block">{traceItem.value}</span></div>
            <div><span className="text-xs text-muted-foreground">Source API:</span> <span className="text-sm block">{traceItem.source_api}</span></div>
            <div><span className="text-xs text-muted-foreground">Resolves to:</span> <span className="text-sm font-medium block">{traceItem.resolves_to}</span></div>
            <div className="flex gap-4">
              <div><span className="text-xs text-muted-foreground">Freshness:</span> <Badge variant="secondary" className="ml-2 text-[10px]">{traceItem.freshness_date}</Badge></div>
              {traceItem.proxy && <Badge variant="destructive" className="text-[10px]">PROXY IP DETECTED</Badge>}
            </div>
            {traceItem.note && <div className="text-xs text-destructive mt-2">{traceItem.note}</div>}
          </CardContent>
        </Card>
      )}

      {catalogueItem && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Category</h4>
              <p className="mt-1 font-medium">{catalogueItem.category}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Fetched using key</h4>
              <Badge variant="outline" className="mt-1">{catalogueItem.fetched_using_key}</Badge>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-muted-foreground border-b pb-1 mb-2">Sits in</h4>
            <p className="text-sm">{catalogueItem.sits_in}</p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-muted-foreground border-b pb-1 mb-2">Where it comes from</h4>
            <p className="text-sm leading-relaxed">{catalogueItem.where_it_comes_from}</p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-muted-foreground border-b pb-1 mb-2">What it means</h4>
            <p className="text-sm leading-relaxed">{catalogueItem.what_it_means}</p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-muted-foreground border-b pb-1 mb-2">Why it matters</h4>
            <p className="text-sm leading-relaxed">{catalogueItem.why_it_matters}</p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-muted-foreground border-b pb-1 mb-2">Derived Columns Explanation</h4>
            <p className="text-sm leading-relaxed whitespace-pre-wrap text-emerald-500/90 font-mono text-xs p-3 bg-muted rounded-md border">
              {catalogueItem.derived_columns.split('. ').map((col: string, i: number) => (
                <span key={i} className="block mb-1">{col.trim()}{col.endsWith('.') ? '' : '.'}</span>
              ))}
            </p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-muted-foreground">Example</h4>
            <code className="text-xs bg-muted px-2 py-1 rounded mt-1 block">{catalogueItem.example}</code>
          </div>

          {deepDiveText && (
            <div className="mt-8 pt-6 border-t">
              <h4 className="text-sm font-bold text-sky-500 mb-3 uppercase tracking-wider flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
                Forensic Deep Dive
              </h4>
              <div className="bg-sky-500/5 border border-sky-500/20 rounded-xl p-4 shadow-inner">
                <MarkdownText text={deepDiveText} />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export const renderApiUniverseDetail = (item: any) => {
  const deepDiveText = (masterclassData as Record<string, string>)[item.source];
  return (
  <div className="space-y-4">
    <div className="grid grid-cols-2 gap-4">
      <div>
        <h4 className="text-sm font-medium text-muted-foreground">Access Type</h4>
        <Badge variant={item.access.includes('Paid') ? 'destructive' : 'secondary'} className="mt-1">
          {item.access}
        </Badge>
      </div>
      <div>
        <h4 className="text-sm font-medium text-muted-foreground">Input Needed</h4>
        <Badge variant="outline" className="mt-1 truncate max-w-full" title={item.input_needed}>
          {item.input_needed || 'None'}
        </Badge>
      </div>
    </div>
    
    <div>
      <h4 className="text-sm font-medium text-muted-foreground border-b pb-1 mb-2">What it returns</h4>
      <p className="text-sm leading-relaxed">{item.what_it_returns}</p>
    </div>

    <div>
      <h4 className="text-sm font-medium text-muted-foreground border-b pb-1 mb-2">Why it matters for location</h4>
      <p className="text-sm leading-relaxed">{item.why_it_matters}</p>
    </div>

    <div>
      <h4 className="text-sm font-medium text-muted-foreground border-b pb-1 mb-2">Remarks (Beginner Notes)</h4>
      <p className="text-sm leading-relaxed p-3 bg-primary/5 rounded-md border border-primary/20 text-foreground/90">
        {item.remarks}
      </p>
    </div>

    {item.example_link && item.example_link !== 'No link' && (
      <div>
        <h4 className="text-sm font-medium text-muted-foreground">Documentation / Link</h4>
        <a href={item.example_link} target="_blank" rel="noreferrer" className="text-xs text-blue-400 hover:underline break-all block mt-1">
          {item.example_link}
        </a>
      </div>
    )}

    {/* Mock Response Box */}
    <div className="mt-6">
      <h4 className="text-sm font-medium text-muted-foreground border-b pb-1 mb-2 flex items-center justify-between">
        Mock Response
        <Badge variant="outline" className="text-[10px] border-amber-500/50 text-amber-500">MOCK — illustrative</Badge>
      </h4>
      <div className="h-32 w-full rounded-md border bg-muted/30 overflow-y-auto">
        <div className="p-4">
          <pre className="text-[10px] font-mono text-muted-foreground whitespace-pre-wrap">
            {JSON.stringify({
              status: "success",
              source: item.source,
              timestamp: new Date().toISOString(),
              mock_data: "This is an illustrative response to show the shape of data.",
              fields: item.what_it_returns?.split(',').map((s: string) => s.trim()) || []
            }, null, 2)}
          </pre>
        </div>
      </div>
    </div>

    {deepDiveText && (
      <div className="mt-8 pt-6 border-t">
        <h4 className="text-sm font-bold text-blue-500 mb-3 uppercase tracking-wider flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          Forensic Deep Dive
        </h4>
        <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4 shadow-inner">
          <MarkdownText text={deepDiveText} />
        </div>
      </div>
    )}
  </div>
);
};

export const renderDerivedColumnDetail = (item: any, isTrace: boolean) => {
  const catalogueItem = item._catalogueRef || item;
  const traceItem = item._catalogueRef ? item : (isTrace && item.evidence ? item : null);
  const targetKey = catalogueItem?.derived_variable;
  const deepDiveText = (masterclassData as Record<string, string>)[targetKey];

  return (
    <div className="space-y-4">
      {traceItem && (
        <Card className="bg-emerald-500/10 border-emerald-500/30 mb-6">
          <CardHeader className="py-3 px-4">
            <CardTitle className="text-sm font-medium text-emerald-500">Computed Signal</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 space-y-2">
            <div><span className="text-xs text-muted-foreground">Location:</span> <span className="font-mono text-sm block">{traceItem.location_label}</span></div>
            <div className="grid grid-cols-3 gap-2 mt-2">
              <div className="bg-background p-2 rounded text-center">
                <div className="text-[10px] text-muted-foreground">Base Wt</div>
                <div className="font-bold">{traceItem.base_weight}</div>
              </div>
              <div className="bg-background p-2 rounded text-center">
                <div className="text-[10px] text-muted-foreground">Recency</div>
                <div className="font-bold">{traceItem.recency_factor}</div>
              </div>
              <div className="bg-background p-2 rounded text-center">
                <div className="text-[10px] text-muted-foreground">IP Trust</div>
                <div className="font-bold text-amber-500">{traceItem.ip_trust_factor}</div>
              </div>
            </div>
            <div className="mt-3"><span className="text-xs text-muted-foreground">Evidence:</span> <span className="text-sm block">{traceItem.evidence}</span></div>
          </CardContent>
        </Card>
      )}

      {catalogueItem && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Derived Variable</h4>
              <p className="mt-1 font-medium text-emerald-500">{catalogueItem.derived_variable}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Parent Data Field</h4>
              <Badge variant="outline" className="mt-1">{catalogueItem.parent_field}</Badge>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-muted-foreground border-b pb-1 mb-2">Category</h4>
            <p className="text-sm">{catalogueItem.category}</p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-muted-foreground border-b pb-1 mb-2">Description / Math</h4>
            <p className="text-sm leading-relaxed p-3 bg-muted rounded-md font-mono text-xs">
              {catalogueItem.description}
            </p>
          </div>
        </>
      )}

      {deepDiveText && (
        <div className="mt-8 pt-6 border-t">
          <h4 className="text-sm font-bold text-emerald-500 mb-3 uppercase tracking-wider flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Forensic Deep Dive
          </h4>
          <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4 shadow-inner">
            <MarkdownText text={deepDiveText} />
          </div>
        </div>
      )}
    </div>
  );
};
