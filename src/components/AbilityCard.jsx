import React from "react";

export default function AbilityCard({ ability, onClick }) {
  return (
    <div
      onClick={() => onClick(ability)}
      className="bg-bg-surface border border-border-main rounded-2xl p-4 shadow-xs hover:border-accent/50 hover:shadow-md transition-all cursor-pointer flex items-center justify-between group"
    >
      <div className="flex items-center gap-3">
        <h3 className="text-base font-bold text-text-main capitalize group-hover:text-accent transition-colors">
          {ability.name.replaceAll("-", " ")}
        </h3>
      </div>

      <span className="text-xs font-semibold text-text-subtle bg-bg-muted/40 px-2.5 py-1 rounded-md border border-border-main/40">
        {ability.generation}
      </span>
    </div>
  );
}