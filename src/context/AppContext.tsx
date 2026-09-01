"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { 
  InputState, GraphNode, GraphEdge, CurrentTrace,
  PrimaryIdentifierDef, DataFieldDef, ApiUniverseDef, DemoCaseDef
} from '../types';

import primaryIdentifiersRaw from '../data/data_primary_identifiers.json';
import dataFieldsRaw from '../data/data_fetched_data_fields.json';
import apiUniverseRaw from '../data/data_api_universe.json';
import demoCasesRaw from '../data/data_demo_cases.json';
import { computeOutputFromSignals, resolveCustomTrace } from '../lib/resolver';

export const primaryIdentifiers = primaryIdentifiersRaw as PrimaryIdentifierDef[];
export const dataFields = dataFieldsRaw as DataFieldDef[];
export const apiUniverse = apiUniverseRaw as ApiUniverseDef[];
export const demoCases = {
  clean: demoCasesRaw.clean as DemoCaseDef,
  fraud: demoCasesRaw.fraud as DemoCaseDef,
  maximum: demoCasesRaw.maximum as DemoCaseDef
};

interface AppContextType {
  inputState: InputState;
  setInputState: React.Dispatch<React.SetStateAction<InputState>>;
  isAnalyzing: boolean;
  currentTrace: CurrentTrace | null;
  logs: string[];
  loadDemoCase: (caseType: 'clean' | 'fraud' | 'maximum') => Promise<void>;
  runCustomTrace: (customInput?: InputState) => Promise<void>;
  clearTrace: () => void;
  // Expose catalogues globally for easy access
  catalogue: {
    identifiers: PrimaryIdentifierDef[];
    fields: DataFieldDef[];
    apis: ApiUniverseDef[];
  };
}

const defaultInputState: InputState = {
  mobile_number: '',
  pan: '',
  aadhaar_number: '',
  email_id: '',
  customer_key: '',
  case_id: '',
  declared_pincode: '',
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [inputState, setInputState] = useState<InputState>(defaultInputState);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [currentTrace, setCurrentTrace] = useState<CurrentTrace | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (msg: string) => setLogs(prev => [...prev, `[${new Date().toISOString().split('T')[1].slice(0,-1)}] ${msg}`]);

  const clearTrace = () => {
    setCurrentTrace(null);
    setInputState(defaultInputState);
    setLogs([]);
  };

  const loadDemoCase = async (caseType: 'clean' | 'fraud' | 'maximum') => {
    setIsAnalyzing(true);
    setLogs([]);
    
    const demo = demoCases[caseType];
    setInputState(demo.identifiers);
    
    // Resolve confidence scores & truth flags dynamically from graph signals at runtime
    const expected_output = computeOutputFromSignals(demo.signals, demo.identifiers.declared_pincode);

    setCurrentTrace({
      case_label: demo.case_label,
      input: demo.identifiers,
      fetchedFields: demo.fetched_fields,
      signals: demo.signals,
      expected_output
    });

    try {
      addLog("[SYS] INITIATING TRACE...");
      await new Promise(r => setTimeout(r, 300));
      addLog(`[NET] FETCHING IDENTIFIERS FOR CASE: ${demo.identifiers.case_id}...`);
      await new Promise(r => setTimeout(r, 400));
      addLog("[GEO] RESOLVING APIS & DATA FIELDS...");
      await new Promise(r => setTimeout(r, 400));
      addLog("[SYS] PAYLOAD HYDRATED. CONSTRUCTING GRAPH...");
      await new Promise(r => setTimeout(r, 400));
      addLog("[SYS] RESOLVING GRAPH EDGE WEIGHTS AND COMPUTING CONFIDENCE...");
      await new Promise(r => setTimeout(r, 300));
      addLog("[SYS] ANALYSIS COMPLETE.");
    } catch (error) {
      console.error("Enrichment failed", error);
      addLog("[ERR] ENRICHMENT FAILED.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const runCustomTrace = async (customInput?: InputState) => {
    setIsAnalyzing(true);
    setLogs([]);
    
    const input = customInput || inputState;
    const resolvedTrace = resolveCustomTrace(input);
    
    setInputState(resolvedTrace.input);
    setCurrentTrace(resolvedTrace);

    try {
      addLog("[SYS] INITIATING CUSTOM TRACE...");
      await new Promise(r => setTimeout(r, 300));
      addLog(`[NET] PROCESSING IDENTIFIERS FOR PAN: ${resolvedTrace.input.pan}...`);
      await new Promise(r => setTimeout(r, 400));
      addLog("[GEO] RESOLVING APIS & DATA FIELDS...");
      await new Promise(r => setTimeout(r, 400));
      addLog("[SYS] CONSTRUCTING GRAPH & RESOLVING EDGE WEIGHTS...");
      await new Promise(r => setTimeout(r, 400));
      addLog("[SYS] DYNAMIC SCORE RESOLUTION COMPLETE.");
    } catch (error) {
      console.error("Custom trace failed", error);
      addLog("[ERR] CUSTOM TRACE FAILED.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <AppContext.Provider value={{ 
      inputState, 
      setInputState, 
      isAnalyzing, 
      currentTrace, 
      logs,
      loadDemoCase,
      runCustomTrace,
      clearTrace,
      catalogue: {
        identifiers: primaryIdentifiers,
        fields: dataFields,
        apis: apiUniverse
      }
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
