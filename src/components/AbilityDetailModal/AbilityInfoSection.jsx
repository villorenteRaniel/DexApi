import React from "react";

export default function AbilityInfoSection({ details }) {
  return (
    <div className="space-y-4">
      <div className="bg-bg-muted/30 border border-border-main/50 rounded-2xl p-4">
        <span className="text-xs font-bold uppercase tracking-wider text-accent">
          Effect
        </span>
        <p className="text-sm text-text-main mt-1 leading-relaxed">
          {details?.effect}
        </p>
      </div>

      <div className="bg-bg-muted/30 border border-border-main/50 rounded-2xl p-4">
        <span className="text-xs font-bold uppercase tracking-wider text-accent">
          In-Depth Effect
        </span>
        <p className="text-sm text-text-muted mt-1 leading-relaxed">
          {details?.inDepthEffect}
        </p>
      </div>
    </div>
  );
}