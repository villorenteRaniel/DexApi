import React, { useState } from "react";
import { TYPES, calculateDefensiveMatchups } from "../data/typeChart";
import { typeBadge } from "../data/typeStyles";

export default function TypeMatchupCalculator() {
  const [type1, setType1] = useState("water");
  const [type2, setType2] = useState("ground");

  const matchups = calculateDefensiveMatchups(type1, type2 === "none" ? null : type2);

  return (
    <div className="bg-bg-surface border border-border-main rounded-3xl p-6 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-main/60 pb-4">
        <div>
          <h2 className="text-xl font-black text-text-main">Type Matchup Calculator</h2>
          <p className="text-xs font-medium text-text-subtle mt-0.5">
            Select up to two types to inspect defensive weaknesses & resistances.
          </p>
        </div>

        {/* Dropdowns */}
        <div className="flex items-center gap-2">
          <select
            value={type1}
            onChange={(e) => setType1(e.target.value)}
            className="bg-bg-muted border border-border-main text-text-main text-xs font-bold px-3 py-2 rounded-xl capitalize focus:outline-none focus:border-accent"
          >
            {TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          <span className="text-text-subtle font-black text-xs">+</span>

          <select
            value={type2}
            onChange={(e) => setType2(e.target.value)}
            className="bg-bg-muted border border-border-main text-text-main text-xs font-bold px-3 py-2 rounded-xl capitalize focus:outline-none focus:border-accent"
          >
            <option value="none">None (Single Type)</option>
            {TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Multipliers Display Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* 4x Weaknesses */}
        {matchups.quadWeak.length > 0 && (
          <div className="bg-rose-500/5 border border-rose-500/20 rounded-2xl p-4">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-rose-500">
              4x Weakness
            </span>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {matchups.quadWeak.map((t) => (
                <span key={t} className={`${typeBadge[t]} text-white text-[10px] font-bold px-2.5 py-1 rounded-full capitalize shadow-2xs`}>
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 2x Weaknesses */}
        {matchups.doubleWeak.length > 0 && (
          <div className="bg-orange-500/5 border border-orange-500/20 rounded-2xl p-4">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-orange-500">
              2x Weakness
            </span>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {matchups.doubleWeak.map((t) => (
                <span key={t} className={`${typeBadge[t]} text-white text-[10px] font-bold px-2.5 py-1 rounded-full capitalize shadow-2xs`}>
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 0.5x Resistances */}
        {matchups.doubleResist.length > 0 && (
          <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-4">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-500">
              0.5x Resistance
            </span>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {matchups.doubleResist.map((t) => (
                <span key={t} className={`${typeBadge[t]} text-white text-[10px] font-bold px-2.5 py-1 rounded-full capitalize shadow-2xs`}>
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 0.25x Resistances */}
        {matchups.quadResist.length > 0 && (
          <div className="bg-teal-500/5 border border-teal-500/20 rounded-2xl p-4">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-teal-500">
              0.25x Resistance
            </span>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {matchups.quadResist.map((t) => (
                <span key={t} className={`${typeBadge[t]} text-white text-[10px] font-bold px-2.5 py-1 rounded-full capitalize shadow-2xs`}>
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Immunities */}
        {matchups.immune.length > 0 && (
          <div className="bg-slate-500/5 border border-slate-500/20 rounded-2xl p-4">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-text-subtle">
              0x Immunities
            </span>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {matchups.immune.map((t) => (
                <span key={t} className={`${typeBadge[t]} text-white text-[10px] font-bold px-2.5 py-1 rounded-full capitalize shadow-2xs`}>
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}