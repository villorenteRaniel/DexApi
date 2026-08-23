import React from "react";
import { typeBadge } from "../../data/typeStyles";

const damageClassStyles = {
  physical: "bg-orange-600 text-white",
  special: "bg-blue-600 text-white",
  status: "bg-slate-500 text-white",
};

export default function MoveInfoSection({ details }) {
  return (
    <div className="space-y-4">
      {/* Move Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-bg-muted/30 border border-border-main/50 rounded-2xl p-3 text-center">
          <span className="text-[10px] font-bold uppercase tracking-wider text-text-subtle">Type</span>
          <div className="mt-1 flex justify-center">
            <span className={`${typeBadge[details?.type] || "bg-slate-700"} text-white text-xs font-bold px-2.5 py-0.5 rounded-full capitalize`}>
              {details?.type}
            </span>
          </div>
        </div>

        <div className="bg-bg-muted/30 border border-border-main/50 rounded-2xl p-3 text-center">
          <span className="text-[10px] font-bold uppercase tracking-wider text-text-subtle">Category</span>
          <div className="mt-1 flex justify-center">
            <span className={`${damageClassStyles[details?.damageClass] || "bg-slate-600"} text-white text-xs font-bold px-2.5 py-0.5 rounded-md capitalize`}>
              {details?.damageClass}
            </span>
          </div>
        </div>

        <div className="bg-bg-muted/30 border border-border-main/50 rounded-2xl p-3 text-center">
          <span className="text-[10px] font-bold uppercase tracking-wider text-text-subtle">Power</span>
          <p className="text-base font-black text-text-main mt-0.5">{details?.power}</p>
        </div>

        <div className="bg-bg-muted/30 border border-border-main/50 rounded-2xl p-3 text-center">
          <span className="text-[10px] font-bold uppercase tracking-wider text-text-subtle">Accuracy</span>
          <p className="text-base font-black text-text-main mt-0.5">{details?.accuracy}{typeof details?.accuracy === "number" ? "%" : ""}</p>
        </div>
      </div>

      {/* Extra Badges: PP & Priority */}
      <div className="flex gap-3">
        <div className="flex-1 bg-bg-muted/30 border border-border-main/50 rounded-2xl p-3 text-center">
          <span className="text-[10px] font-bold uppercase tracking-wider text-text-subtle">Base PP</span>
          <p className="text-sm font-bold text-text-main mt-0.5">{details?.pp}</p>
        </div>
        <div className="flex-1 bg-bg-muted/30 border border-border-main/50 rounded-2xl p-3 text-center">
          <span className="text-[10px] font-bold uppercase tracking-wider text-text-subtle">Priority</span>
          <p className="text-sm font-bold text-text-main mt-0.5">{details?.priority > 0 ? `+${details?.priority}` : details?.priority}</p>
        </div>
      </div>

      {/* Effects */}
      <div className="bg-bg-muted/30 border border-border-main/50 rounded-2xl p-4">
        <span className="text-xs font-bold uppercase tracking-wider text-accent">Short Effect</span>
        <p className="text-sm text-text-main mt-1 leading-relaxed">{details?.effect}</p>
      </div>

      <div className="bg-bg-muted/30 border border-border-main/50 rounded-2xl p-4">
        <span className="text-xs font-bold uppercase tracking-wider text-accent">In-Depth Details</span>
        <p className="text-sm text-text-muted mt-1 leading-relaxed">{details?.inDepthEffect}</p>
      </div>
    </div>
  );
}