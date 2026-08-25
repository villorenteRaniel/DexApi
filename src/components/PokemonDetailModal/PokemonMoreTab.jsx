import React from "react";
import { calculateDefensiveMatchups } from "../../data/typeChart";
import { typeBadge } from "../../data/typeStyles";

export default function PokemonMoreTab({ details }) {
  if (!details) return null;

  const { types, height, weight, species } = details;

  // Calculate defensive matchups based on dual or single types
  const matchups = calculateDefensiveMatchups(types?.[0], types?.[1]);

  // Calculate Gender Distribution from gender_rate (-1: genderless, otherwise eighths female)
  const getGenderRatio = (rate) => {
    if (rate === -1) return { male: 0, female: 0, isGenderless: true };
    const femalePercent = (rate / 8) * 100;
    const malePercent = 100 - femalePercent;
    return { male: malePercent, female: femalePercent, isGenderless: false };
  };

  const gender = getGenderRatio(species?.genderRate ?? -1);

  // Config for defensive matchup categories
  const matchupCategories = [
    { label: "4× Weakness", list: matchups.quadWeak, badgeStyle: "ring-2 ring-rose-500/50" },
    { label: "2× Weakness", list: matchups.doubleWeak, badgeStyle: "" },
    { label: "½× Resistance", list: matchups.doubleResist, badgeStyle: "" },
    { label: "¼× Resistance", list: matchups.quadResist, badgeStyle: "ring-2 ring-emerald-500/50" },
    { label: "Immune (0×)", list: matchups.immune, badgeStyle: "opacity-75" },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* 1. Type Interactions / Weaknesses & Resistances */}
      <div className="flex flex-col gap-3">
        <h3 className="text-xs font-black uppercase tracking-wider text-text-subtle">
          Type Defensive Matchups
        </h3>
        <div className="flex flex-col gap-3 p-4 rounded-2xl bg-bg-surface/80 border border-border-main/60 shadow-xs">
          {matchupCategories.map(
            ({ label, list, badgeStyle }) =>
              list?.length > 0 && (
                <div key={label} className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <span className="w-28 text-[11px] font-black text-text-subtle shrink-0">
                    {label}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {list.map((type) => (
                      <span
                        key={type}
                        className={`${
                          typeBadge[type] || "bg-slate-600 text-white"
                        } ${badgeStyle} text-[9px] font-black px-2 py-0.5 rounded-full capitalize shadow-2xs`}
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
              )
          )}
        </div>
      </div>

      {/* 2. Physical Characteristics & Capture Info */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Height */}
        <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-bg-surface/80 border border-border-main/60 shadow-xs">
          <span className="text-[10px] font-black uppercase tracking-wider text-text-subtle">
            Height
          </span>
          <span className="text-lg font-black text-text-main mt-1">
            {height} m
          </span>
          <span className="text-[10px] font-bold text-text-subtle">
            ({Math.round(height * 3.28084 * 10) / 10} ft)
          </span>
        </div>

        {/* Weight */}
        <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-bg-surface/80 border border-border-main/60 shadow-xs">
          <span className="text-[10px] font-black uppercase tracking-wider text-text-subtle">
            Weight
          </span>
          <span className="text-lg font-black text-text-main mt-1">
            {weight} kg
          </span>
          <span className="text-[10px] font-bold text-text-subtle">
            ({Math.round(weight * 2.20462 * 10) / 10} lbs)
          </span>
        </div>

        {/* Capture Rate */}
        <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-bg-surface/80 border border-border-main/60 shadow-xs">
          <span className="text-[10px] font-black uppercase tracking-wider text-text-subtle">
            Catch Rate
          </span>
          <span className="text-lg font-black text-text-main mt-1">
            {species?.captureRate ?? "—"}
          </span>
          <span className="text-[10px] font-bold text-text-subtle">
            {species?.captureRate
              ? `${Math.round((species.captureRate / 255) * 100)}% base chance`
              : "Unknown"}
          </span>
        </div>
      </div>

      {/* 3. Breeding & Reproduction */}
      <div className="flex flex-col gap-3">
        <h3 className="text-xs font-black uppercase tracking-wider text-text-subtle">
          Breeding & Hatching
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Egg Groups */}
          <div className="flex flex-col justify-between p-4 rounded-2xl bg-bg-surface/80 border border-border-main/60 shadow-xs gap-3">
            <span className="text-[10px] font-black uppercase tracking-wider text-text-subtle">
              Egg Groups
            </span>
            <div className="flex items-center gap-2 flex-wrap">
              {species?.eggGroups?.map((group) => (
                <span
                  key={group}
                  className="px-3 py-1 rounded-full text-xs font-bold capitalize bg-black/5 border border-border-main/40 text-text-main"
                >
                  {group.replaceAll("-", " ")}
                </span>
              )) || <span className="text-xs font-bold text-text-subtle">Unknown</span>}
            </div>
          </div>

          {/* Hatch Counter */}
          <div className="flex flex-col justify-between p-4 rounded-2xl bg-bg-surface/80 border border-border-main/60 shadow-xs gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-text-subtle">
              Hatch Time
            </span>
            <div>
              <p className="text-base font-black text-text-main">
                {species?.hatchCounter ?? "—"}{" "}
                <span className="text-xs font-bold text-text-subtle">cycles</span>
              </p>
              <p className="text-[10px] font-bold text-text-subtle">
                ~{species?.hatchCounter ? (species.hatchCounter + 1) * 256 : "—"} steps
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Gender Ratio */}
      <div className="flex flex-col gap-3">
        <h3 className="text-xs font-black uppercase tracking-wider text-text-subtle">
          Gender Ratio
        </h3>
        <div className="p-4 rounded-2xl bg-bg-surface/80 border border-border-main/60 shadow-xs flex flex-col gap-3">
          {gender.isGenderless ? (
            <div className="text-center text-xs font-black text-text-subtle py-1">
              Genderless
            </div>
          ) : (
            <>
              {/* Ratio Bar */}
              <div className="h-3 w-full rounded-full bg-black/10 overflow-hidden flex">
                <div
                  className="bg-sky-500 h-full transition-all duration-500"
                  style={{ width: `${gender.male}%` }}
                />
                <div
                  className="bg-rose-500 h-full transition-all duration-500"
                  style={{ width: `${gender.female}%` }}
                />
              </div>

              {/* Labels */}
              <div className="flex items-center justify-between text-xs font-black">
                <span className="text-sky-600 flex items-center gap-1">
                  ♂ {gender.male}% Male
                </span>
                <span className="text-rose-500 flex items-center gap-1">
                  ♀ {gender.female}% Female
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}