import React from "react";

const statLabels = {
  attack: "Atk",
  defense: "Def",
  "special-attack": "Sp. Atk",
  "special-defense": "Sp. Def",
  speed: "Speed",
};

export default function NatureCard({ nature, onClick }) {
  const isNeutral = !nature.increasedStat || nature.increasedStat === nature.decreasedStat;

  const formattedName = nature.name.charAt(0).toUpperCase() + nature.name.slice(1);

  return (
    <div
      onClick={() => onClick && onClick(nature)}
      className="group flex items-center justify-between p-4 bg-bg-surface border border-border-main rounded-2xl hover:border-accent hover:-translate-y-0.5 hover:shadow-md transition-all cursor-pointer"
    >
      <div className="flex flex-col min-w-0">
        <h3 className="text-base font-bold text-text-main truncate group-hover:text-accent transition-colors">
          {formattedName}
        </h3>
        <p className="text-xs font-medium text-text-subtle mt-0.5">
          {isNeutral
            ? "No stat modifications"
            : `+10% ${statLabels[nature.increasedStat]} / -10% ${statLabels[nature.decreasedStat]}`}
        </p>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        {isNeutral ? (
          <span className="bg-slate-500/10 text-slate-400 border border-slate-500/20 text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
            Neutral
          </span>
        ) : (
          <>
            <span className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[10px] font-extrabold px-2 py-0.5 rounded-md">
              +{statLabels[nature.increasedStat]}
            </span>
            <span className="bg-rose-500/10 text-rose-500 border border-rose-500/20 text-[10px] font-extrabold px-2 py-0.5 rounded-md">
              -{statLabels[nature.decreasedStat]}
            </span>
          </>
        )}
      </div>
    </div>
  );
}