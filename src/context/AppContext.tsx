"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { 
  InputState, CurrentTrace,
  PrimaryIdentifierDef, DataFieldDef, ApiUniverseDef, DemoCaseDef
} from '../types';

import primaryIdentifiersRaw from '../data/data_primary_identifiers.json';
import dataFieldsRaw from '../data/data_fetched_data_fields.json';
import apiUniverseRaw from '../data/data_api_universe.json';
import demoCasesRaw from '../data/data_demo_cases.json';
import { resolveCanonicalGraph, resolveCustomTrace } from '../lib/resolver';

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
  runCustomTrace: (customInput?: InputState, profile?: 'baseline' | 'proxy_risk' | 'physical_conflict') => Promise<void>;
  clearTrace: () => void;
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
    
    addLog(`[GRAPH] INITIATING CANONICAL INVESTIGATION: ${demo.case_label.toUpperCase()}`);
    addLog(`[GRAPH] HYDRATING FIXTURE EVIDENCE OBSERVATIONS (${demo.fetched_fields.length} fields)`);
    addLog(`[ENGINE] RESOLVING GRAPH EDGES & EFFECTIVE CONTRIBUTIONS (${demo.signals.length} signals)`);

    const resolvedTrace = resolveCanonicalGraph(
      demo.identifiers,
      demo.fetched_fields,
      demo.signals,
      demo.case_label
    );

    setCurrentTrace(resolvedTrace);
    addLog(`[OUTPUT] INVESTIGATION RESOLVED. TOP CANDIDATE: ${resolvedTrace.graph.topCandidate} (${resolvedTrace.graph.addressConsistency})`);
    setIsAnalyzing(false);
  };

  const runCustomTrace = async (
    customInput?: InputState, 
    profile: 'baseline' | 'proxy_risk' | 'physical_conflict' = 'baseline'
  ) => {
    setIsAnalyzing(true);
    setLogs([]);
    
    const input = customInput || inputState;
    addLog(`[GRAPH] SYNTHESIZING CUSTOM INVESTIGATION FOR PAN: ${input.pan || 'CUSTOM'}`);
    addLog(`[ENGINE] GENERATING DETERMINISTIC EVIDENCE OBSERVED FOR PIN: ${input.declared_pincode || '560001'} (Profile: ${profile})`);

    const resolvedTrace = resolveCustomTrace(input, profile);
    
    setInputState(resolvedTrace.input);
    setCurrentTrace(resolvedTrace);

    addLog(`[OUTPUT] INVESTIGATION RESOLVED. TOP CANDIDATE: ${resolvedTrace.graph.topCandidate} (${resolvedTrace.graph.addressConsistency})`);
    setIsAnalyzing(false);
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
