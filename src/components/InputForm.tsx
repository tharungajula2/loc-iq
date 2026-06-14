"use client";

import React from "react";
import { useAppContext } from "../context/AppContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

export const InputForm: React.FC = () => {
  const { inputState, setInputState, loadDemoCase, isAnalyzing } = useAppContext();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputState(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputState.pan === 'CLEAN1111A') {
       loadDemoCase('clean');
    } else if (inputState.pan === 'FRAUD9999X') {
       loadDemoCase('fraud');
    } else {
       alert("Manual entry without backend logic isn't supported in this demo. Please use the Demo Loaders above.");
    }
  };

  const loadCleanCase = () => setInputState({
    mobile_number: '9876543210',
    pan: 'CLEAN1111A',
    aadhaar_number: '123456789012',
    email_id: 'clean@demo.com',
    customer_key: 'CUST-CL-01',
    case_id: 'CASE-2026-001',
    declared_pincode: '560001'
  });

  const loadFraudCase = () => setInputState({
    mobile_number: '9191919191',
    pan: 'FRAUD9999X',
    aadhaar_number: '999988887777',
    email_id: 'suspect@anon.to',
    customer_key: 'CUST-FR-99',
    case_id: 'CASE-2026-999',
    declared_pincode: '110001'
  });

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Primary Identifiers</h2>
          <p className="text-muted-foreground">Enter seed data to initiate the location intelligence trace.</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs uppercase tracking-widest font-semibold text-muted-foreground mr-2">Demo Loaders:</span>
          <Button variant="outline" size="sm" onClick={loadCleanCase} className="border-green-500/30 text-green-500 hover:bg-green-500/10">
            Clean Case
          </Button>
          <Button variant="outline" size="sm" onClick={loadFraudCase} className="border-red-500/30 text-red-500 hover:bg-red-500/10">
            Fraud Case
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Trace Inputs</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="case_id">Case ID</Label>
                <Input id="case_id" name="case_id" value={inputState.case_id} onChange={handleInputChange} placeholder="e.g. CASE-1234" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customer_key">Customer Key</Label>
                <Input id="customer_key" name="customer_key" value={inputState.customer_key} onChange={handleInputChange} placeholder="e.g. CUST-5678" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pan">PAN</Label>
                <Input id="pan" name="pan" value={inputState.pan} onChange={handleInputChange} placeholder="e.g. ABCDE1234F" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="aadhaar_number">Aadhaar Number</Label>
                <Input id="aadhaar_number" name="aadhaar_number" value={inputState.aadhaar_number} onChange={handleInputChange} placeholder="12-digit Aadhaar" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mobile_number">Mobile Number</Label>
                <Input id="mobile_number" name="mobile_number" value={inputState.mobile_number} onChange={handleInputChange} placeholder="10-digit mobile" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email_id">Email ID</Label>
                <Input id="email_id" name="email_id" value={inputState.email_id} onChange={handleInputChange} type="email" placeholder="name@domain.com" />
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="declared_pincode" className="text-primary font-bold">Declared Pincode (Objective Target)</Label>
                <Input id="declared_pincode" name="declared_pincode" value={inputState.declared_pincode} onChange={handleInputChange} placeholder="6-digit pincode" className="border-primary/50 focus-visible:ring-primary" />
              </div>
            </div>

            <Button type="submit" disabled={isAnalyzing} className="w-full h-12 text-lg">
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Initiating Trace...
                </>
              ) : (
                "Initiate Network Trace"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
