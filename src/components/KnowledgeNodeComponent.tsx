"use client";

import React, { memo } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { Fingerprint, Database, Activity, ShieldCheck, BookOpen, CheckCircle2 } from "lucide-react";
import { KnowledgeNodeType } from "../types";

export interface KnowledgeNodeData extends Record<string, unknown> {
  label: string;
  type: KnowledgeNodeType;
  catalogueId: string;
  category?: string;
  accessMode?: string;
  sitsIn?: string | null;
  isActiveInCase?: boolean;
  isDimmed?: boolean;
  isSelected?: boolean;
}

const nodeTypeStyles: Record<string, { border: string; bg: string; text: string; icon: React.FC<{ className?: string }> }> = {
  IDENTIFIER: {
    border: "border-purple-500/50 hover:border-purple-400",
    bg: "bg-purple-950/30",
    text: "text-purple-400",
    icon: Fingerprint
  },
  DATA_SOURCE: {
    border: "border-sky-500/50 hover:border-sky-400",
    bg: "bg-sky-950/30",
    text: "text-sky-400",
    icon: Database
  },
  FETCHED_FIELD: {
    border: "border-emerald-500/50 hover:border-emerald-400",
    bg: "bg-emerald-950/30",
    text: "text-emerald-400",
    icon: Activity
  },
  DERIVED_SIGNAL: {
    border: "border-amber-500/50 hover:border-amber-400",
    bg: "bg-amber-950/30",
    text: "text-amber-400",
    icon: ShieldCheck
  },
  KNOWLEDGE_TOPIC: {
    border: "border-red-500/50 hover:border-red-400",
    bg: "bg-red-950/30",
    text: "text-red-400",
    icon: BookOpen
  }
};

export const KnowledgeNodeComponent = memo(({ data, selected }: NodeProps) => {
  const nodeData = data as unknown as KnowledgeNodeData;
  const style = nodeTypeStyles[nodeData.type] || nodeTypeStyles.FETCHED_FIELD;
  const Icon = style.icon;

  const isDimmed = nodeData.isDimmed;
  const isSelected = selected || nodeData.isSelected;

  return (
    <div
      className={`relative px-3 py-2 rounded-md border text-xs font-mono transition-all select-none shadow-md ${style.bg} ${style.border} ${
        isSelected ? "ring-2 ring-primary ring-offset-1 ring-offset-background scale-105" : ""
      } ${isDimmed ? "opacity-30 filter grayscale" : "opacity-100"}`}
      style={{ minWidth: "160px", maxWidth: "240px" }}
    >
      <Handle type="target" position={Position.Left} className="w-2 h-2 bg-primary border-background" />

      <div className="flex items-center justify-between gap-2 border-b border-border/40 pb-1 mb-1.5">
        <div className="flex items-center gap-1.5 overflow-hidden">
          <Icon className={`w-3.5 h-3.5 shrink-0 ${style.text}`} />
          <span className={`text-[10px] font-bold uppercase tracking-wider ${style.text} truncate`}>
            {String(nodeData.type || "").replace("_", " ")}
          </span>
        </div>

        {nodeData.isActiveInCase && (
          <span className="inline-flex items-center gap-0.5 px-1 py-0.2 text-[8px] font-mono bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 rounded shrink-0">
            <CheckCircle2 className="w-2.5 h-2.5" /> ACTIVE
          </span>
        )}
      </div>

      <div className="font-bold text-foreground truncate text-xs font-mono">{nodeData.label}</div>

      {Boolean(nodeData.accessMode) && (
        <div className="mt-1 text-[9px] text-muted-foreground/80 truncate">
          {String(nodeData.accessMode)}
        </div>
      )}

      {Boolean(nodeData.category) && !nodeData.accessMode && (
        <div className="mt-1 text-[9px] text-muted-foreground/80 truncate">
          {String(nodeData.category)}
        </div>
      )}

      <Handle type="source" position={Position.Right} className="w-2 h-2 bg-primary border-background" />
    </div>
  );
});

KnowledgeNodeComponent.displayName = "KnowledgeNodeComponent";
