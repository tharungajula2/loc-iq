"use client";

import React, { memo } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { 
  User, FileText, Fingerprint, Smartphone, 
  Globe, MapPin, Navigation, Landmark, Store, Activity, ShieldAlert
} from "lucide-react";
import { EntityNodeType } from "../types";

export interface EntityNodeData extends Record<string, unknown> {
  label: string;
  type: EntityNodeType;
  category: string;
  kgConceptId?: string;
  caseId?: string;
  isFocal?: boolean;
  isDimmed?: boolean;
  isSelected?: boolean;
  metadata?: Record<string, unknown>;
}

const nodeTypeStyles: Record<EntityNodeType, { border: string; bg: string; text: string; icon: React.FC<{ className?: string }> }> = {
  PERSON: {
    border: "border-purple-500/60 hover:border-purple-400",
    bg: "bg-purple-950/40",
    text: "text-purple-400",
    icon: User
  },
  APPLICATION: {
    border: "border-sky-500/60 hover:border-sky-400",
    bg: "bg-sky-950/40",
    text: "text-sky-400",
    icon: FileText
  },
  IDENTIFIER_VAL: {
    border: "border-indigo-500/60 hover:border-indigo-400",
    bg: "bg-indigo-950/40",
    text: "text-indigo-400",
    icon: Fingerprint
  },
  DEVICE: {
    border: "border-pink-500/60 hover:border-pink-400",
    bg: "bg-pink-950/40",
    text: "text-pink-400",
    icon: Smartphone
  },
  APP_INSTANCE: {
    border: "border-pink-800/40",
    bg: "bg-pink-950/20",
    text: "text-pink-300/70",
    icon: Smartphone
  },
  SESSION: {
    border: "border-amber-800/40",
    bg: "bg-amber-950/20",
    text: "text-amber-300/70",
    icon: Activity
  },
  NETWORK_ENDPOINT: {
    border: "border-amber-500/60 hover:border-amber-400",
    bg: "bg-amber-950/40",
    text: "text-amber-400",
    icon: Globe
  },
  ADDRESS: {
    border: "border-emerald-500/60 hover:border-emerald-400",
    bg: "bg-emerald-950/40",
    text: "text-emerald-400",
    icon: MapPin
  },
  LOCATION: {
    border: "border-teal-500/60 hover:border-teal-400",
    bg: "bg-teal-950/40",
    text: "text-teal-400",
    icon: Navigation
  },
  BRANCH: {
    border: "border-cyan-500/60 hover:border-cyan-400",
    bg: "bg-cyan-950/40",
    text: "text-cyan-400",
    icon: Landmark
  },
  MERCHANT: {
    border: "border-orange-500/60 hover:border-orange-400",
    bg: "bg-orange-950/40",
    text: "text-orange-400",
    icon: Store
  },
  BEHAVIOURAL_EVENT: {
    border: "border-rose-500/60 hover:border-rose-400",
    bg: "bg-rose-950/40",
    text: "text-rose-400",
    icon: ShieldAlert
  }
};

export const EntityNodeComponent = memo(({ data, selected }: NodeProps) => {
  const nodeData = data as unknown as EntityNodeData;
  const style = nodeTypeStyles[nodeData.type] || nodeTypeStyles.APPLICATION;
  const Icon = style.icon;

  const isDimmed = nodeData.isDimmed;
  const isSelected = selected || nodeData.isSelected;
  const isFocal = nodeData.isFocal;

  return (
    <div
      className={`relative px-3 py-2 rounded-md border text-xs font-mono transition-all select-none shadow-lg ${style.bg} ${style.border} ${
        isSelected ? "ring-2 ring-sky-400 ring-offset-1 ring-offset-background scale-105" : ""
      } ${isFocal ? "ring-2 ring-amber-400 shadow-amber-500/20" : ""} ${
        isDimmed ? "opacity-30 filter grayscale" : "opacity-100"
      }`}
      style={{ minWidth: "170px", maxWidth: "240px" }}
    >
      <Handle type="target" position={Position.Left} className="w-2 h-2 bg-sky-400 border-background" />

      <div className="flex items-center justify-between gap-2 border-b border-border/40 pb-1 mb-1.5">
        <div className="flex items-center gap-1.5 overflow-hidden">
          <Icon className={`w-3.5 h-3.5 shrink-0 ${style.text}`} />
          <span className={`text-[9px] font-bold uppercase tracking-wider ${style.text} truncate`}>
            {String(nodeData.type || "").replace("_", " ")}
          </span>
        </div>

        {Boolean(nodeData.caseId) && (
          <span className="inline-flex items-center px-1 py-0.2 text-[8px] font-mono bg-sky-950/80 text-sky-400 border border-sky-500/40 rounded shrink-0">
            CASE
          </span>
        )}

        {isFocal && !nodeData.caseId && (
          <span className="inline-flex items-center px-1 py-0.2 text-[8px] font-mono bg-amber-950/80 text-amber-400 border border-amber-500/40 rounded shrink-0">
            FOCAL
          </span>
        )}
      </div>

      <div className="font-bold text-foreground truncate text-xs font-mono">{nodeData.label}</div>

      <div className="mt-1 text-[9px] text-muted-foreground/80 truncate">
        {nodeData.category}
      </div>

      <Handle type="source" position={Position.Right} className="w-2 h-2 bg-sky-400 border-background" />
    </div>
  );
});

EntityNodeComponent.displayName = "EntityNodeComponent";
