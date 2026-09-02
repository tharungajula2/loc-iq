"use client";

import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, PlusCircle, AlertCircle, MapPin, Fingerprint } from "lucide-react";
import { InputState } from "../types";

interface NewInvestigationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewInvestigationModal: React.FC<NewInvestigationModalProps> = ({ isOpen, onClose }) => {
  const { runCustomTrace } = useAppContext();

  const [formData, setFormData] = useState<InputState>({
    declared_pincode: "560001",
    pan: "ABCDE1234F",
    mobile_number: "9845012345",
    aadhaar_number: "123456789012",
    email_id: "applicant@company.com",
    customer_key: "CUST-BLR-01",
    case_id: "CASE-2026-SYNTHETIC"
  });

  const [profile, setProfile] = useState<'baseline' | 'proxy_risk' | 'physical_conflict'>('baseline');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    runCustomTrace(formData, profile);
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-[450px] sm:w-[540px] overflow-y-auto bg-card p-6 border-l border-border select-none">
        <SheetHeader className="mb-6 pb-4 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded bg-primary/10 border border-primary/30 text-primary">
              <PlusCircle className="w-5 h-5 text-primary" />
            </div>
            <div>
              <SheetTitle className="text-lg font-bold tracking-tight font-mono text-foreground">
                Run Synthetic Case Investigation
              </SheetTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                Constructs a deterministic synthetic evidence trace & runtime graph.
              </p>
            </div>
          </div>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Explicit Notice Banner */}
          <div className="p-3 bg-muted/30 border border-border/60 rounded-md text-xs text-muted-foreground flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <span>
              Synthetic inputs generate deterministic evidence traces locally. Zero external API calls or real personal data lookup.
            </span>
          </div>

          {/* Profile Selector */}
          <div className="space-y-2">
            <Label className="text-xs font-mono font-bold uppercase tracking-wider text-foreground">
              Simulation Scenario Profile
            </Label>
            <div className="grid grid-cols-3 gap-2">
              <Button
                type="button"
                variant={profile === 'baseline' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setProfile('baseline')}
                className="text-xs h-16 flex flex-col justify-center items-center gap-1 font-mono"
              >
                <Shield className="w-4 h-4 text-emerald-400" />
                <span>Baseline</span>
                <span className="text-[9px] font-normal text-muted-foreground opacity-80">Coherent Trace</span>
              </Button>

              <Button
                type="button"
                variant={profile === 'proxy_risk' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setProfile('proxy_risk')}
                className="text-xs h-16 flex flex-col justify-center items-center gap-1 font-mono"
              >
                <AlertCircle className="w-4 h-4 text-purple-400" />
                <span>Proxy Risk</span>
                <span className="text-[9px] font-normal text-muted-foreground opacity-80">VPN Observation</span>
              </Button>

              <Button
                type="button"
                variant={profile === 'physical_conflict' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setProfile('physical_conflict')}
                className="text-xs h-16 flex flex-col justify-center items-center gap-1 font-mono"
              >
                <MapPin className="w-4 h-4 text-red-400" />
                <span>Conflict</span>
                <span className="text-[9px] font-normal text-muted-foreground opacity-80">Bureau Mismatch</span>
              </Button>
            </div>
          </div>

          {/* Seed Input Fields */}
          <div className="space-y-4 font-mono text-xs">
            <div className="space-y-1.5">
              <Label htmlFor="declared_pincode" className="text-primary font-bold flex items-center justify-between">
                <span>Declared Pincode (Objective Target)</span>
                <Badge variant="outline" className="text-[9px] border-primary/40 text-primary">Required</Badge>
              </Label>
              <Input
                id="declared_pincode"
                name="declared_pincode"
                value={formData.declared_pincode}
                onChange={handleInputChange}
                placeholder="e.g. 560001, 110001, 400001"
                className="font-mono text-xs h-9 border-primary/40 bg-primary/5 focus-visible:ring-primary"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="pan">PAN</Label>
                <Input
                  id="pan"
                  name="pan"
                  value={formData.pan}
                  onChange={handleInputChange}
                  placeholder="ABCDE1234F"
                  className="font-mono text-xs h-8"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="mobile_number">Mobile Number</Label>
                <Input
                  id="mobile_number"
                  name="mobile_number"
                  value={formData.mobile_number}
                  onChange={handleInputChange}
                  placeholder="9845012345"
                  className="font-mono text-xs h-8"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="aadhaar_number">Aadhaar Number</Label>
                <Input
                  id="aadhaar_number"
                  name="aadhaar_number"
                  value={formData.aadhaar_number}
                  onChange={handleInputChange}
                  placeholder="123456789012"
                  className="font-mono text-xs h-8"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email_id">Email ID</Label>
                <Input
                  id="email_id"
                  name="email_id"
                  value={formData.email_id}
                  onChange={handleInputChange}
                  placeholder="name@domain.com"
                  className="font-mono text-xs h-8"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="customer_key">Customer Key</Label>
                <Input
                  id="customer_key"
                  name="customer_key"
                  value={formData.customer_key}
                  onChange={handleInputChange}
                  placeholder="CUST-1234"
                  className="font-mono text-xs h-8"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="case_id">Case ID</Label>
                <Input
                  id="case_id"
                  name="case_id"
                  value={formData.case_id}
                  onChange={handleInputChange}
                  placeholder="CASE-1234"
                  className="font-mono text-xs h-8"
                />
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full h-10 text-xs font-mono font-bold uppercase tracking-wider">
            <Fingerprint className="w-4 h-4 mr-2" /> Initiate Canonical Graph Investigation
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
};
