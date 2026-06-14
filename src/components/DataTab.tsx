"use client";

import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { LayoutGrid, List, Database, Activity } from 'lucide-react';

interface DataTabProps {
  title: string;
  bannerDescription: string;
  excelSheetName: string;
  catalogueData: any[];
  traceData: any[] | null; // Null if no trace loaded
  catalogueColumns: { key: string; label: string; tooltip?: string; isBadge?: boolean; customBadge?: (val: any) => { text: string; className: string } }[];
  traceColumns: { key: string; label: string; tooltip?: string; isBadge?: boolean; customBadge?: (val: any) => { text: string; className: string } }[];
  renderDetailPanel: (item: any, isTrace: boolean) => React.ReactNode;
}

export function DataTab({ 
  title, 
  bannerDescription, 
  excelSheetName, 
  catalogueData, 
  traceData, 
  catalogueColumns,
  traceColumns, 
  renderDetailPanel 
}: DataTabProps) {
  const [mode, setMode] = useState<'catalogue' | 'trace'>('catalogue');
  const [view, setView] = useState<'table' | 'card'>('table');
  const [selectedItem, setSelectedItem] = useState<any | null>(null);

  const displayData = mode === 'catalogue' ? catalogueData : traceData;
  const currentColumns = mode === 'catalogue' ? catalogueColumns : traceColumns;

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Banner */}
      <div className="bg-primary/10 border border-primary/20 p-4 rounded-lg flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-primary flex items-center gap-2">
            {title}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">{bannerDescription}</p>
          <div className="mt-2 text-xs font-mono text-primary/70 bg-primary/10 px-2 py-1 rounded inline-block">
            Excel Mapping: {excelSheetName}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex bg-muted p-1 rounded-md">
            <Button 
              variant={mode === 'catalogue' ? 'default' : 'ghost'} 
              size="sm" 
              onClick={() => setMode('catalogue')}
              className="h-7 text-xs"
            >
              <Database className="w-3 h-3 mr-1" /> Catalogue ({catalogueData.length})
            </Button>
            <Button 
              variant={mode === 'trace' ? 'default' : 'ghost'} 
              size="sm" 
              onClick={() => setMode('trace')}
              className="h-7 text-xs"
            >
              <Activity className="w-3 h-3 mr-1" /> This Trace {traceData ? `(${traceData.length})` : ''}
            </Button>
          </div>
          <div className="flex bg-muted p-1 rounded-md self-end">
            <Button 
              variant={view === 'table' ? 'default' : 'ghost'} 
              size="sm" 
              onClick={() => setView('table')}
              className="h-7 px-2"
            >
              <List className="w-3 h-3" />
            </Button>
            <Button 
              variant={view === 'card' ? 'default' : 'ghost'} 
              size="sm" 
              onClick={() => setView('card')}
              className="h-7 px-2"
            >
              <LayoutGrid className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto bg-card border rounded-lg">
        {mode === 'trace' && !traceData ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground space-y-3">
            <Activity className="w-12 h-12 opacity-20" />
            <p>No trace loaded — go to Overview and load a demo case.</p>
          </div>
        ) : view === 'table' ? (
          <Table>
            <TableHeader className="bg-muted/50 sticky top-0 z-10">
              <TableRow>
                {currentColumns.map(col => (
                  <TableHead key={col.key}>
                    <div className="flex items-center gap-1">
                      {col.label}
                      {col.tooltip && (
                        <span title={col.tooltip} className="cursor-help text-muted-foreground hover:text-foreground text-[10px]">
                          ⓘ
                        </span>
                      )}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {(displayData || []).map((row, idx) => (
                <TableRow 
                  key={idx} 
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => setSelectedItem(row)}
                >
                  {currentColumns.map(col => {
                    const val = row[col.key];
                    const displayVal = val === undefined || val === null || val === '' ? '-' : val;
                    if (col.customBadge && val) {
                      const badge = col.customBadge(val);
                      return (
                        <TableCell key={col.key}>
                          <Badge variant="outline" className={badge.className}>{badge.text}</Badge>
                        </TableCell>
                      );
                    }
                    return (
                      <TableCell key={col.key}>
                        {col.isBadge ? (
                          <Badge variant="outline">{displayVal}</Badge>
                        ) : (
                          <span className="whitespace-normal break-words inline-block text-sm max-w-sm">{displayVal}</span>
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {(displayData || []).map((row, idx) => (
              <Card 
                key={idx} 
                className="cursor-pointer hover:border-primary transition-colors bg-muted/20"
                onClick={() => setSelectedItem(row)}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-base truncate">{row[currentColumns[0].key] || '-'}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  {currentColumns.slice(1).map(col => {
                    const val = row[col.key];
                    const displayVal = val === undefined || val === null || val === '' ? '-' : val;
                    return (
                      <div key={col.key} className="flex justify-between items-center gap-2">
                        <span className="opacity-70 truncate">{col.label}:</span>
                        {col.customBadge && val ? (
                          <Badge variant="outline" className={`text-[10px] ${col.customBadge(val).className}`}>
                            {col.customBadge(val).text}
                          </Badge>
                        ) : col.isBadge ? (
                          <Badge variant="outline" className="text-[10px]">{displayVal}</Badge>
                        ) : (
                          <span className="truncate max-w-[150px] font-medium text-foreground">{displayVal}</span>
                        )}
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Slide-over Detail Panel */}
      <Sheet open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
        <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
          <SheetHeader className="mb-6">
            <SheetTitle className="text-2xl text-primary">
              {selectedItem && selectedItem[currentColumns[0].key]}
            </SheetTitle>
            <p className="text-sm text-muted-foreground">
              Deep inspection of this data element
            </p>
          </SheetHeader>
          <div className="space-y-6">
            {selectedItem && renderDetailPanel(selectedItem, mode === 'trace')}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
