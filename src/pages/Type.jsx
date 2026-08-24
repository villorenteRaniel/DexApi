import React from "react";
import TypeMatchupCalculator from "../components/TypeMatchupCalculator";
import { TYPES } from "../data/typeChart";
import { typeBadge } from "../data/typeStyles";

export default function Type() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-black text-text-main">Pokémon Types</h1>
        <p className="text-sm font-medium text-text-subtle mt-1">
          Explore single and dual-type matchups, defensive multipliers, and battle coverage.
        </p>
      </div>

      {/* Interactive Matchup Calculator */}
      <TypeMatchupCalculator />

      {/* All Types Grid */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-text-main">All Elemental Types</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {TYPES.map((t) => (
            <div
              key={t}
              className={`${typeBadge[t]} text-white p-3.5 rounded-2xl flex items-center justify-between font-bold capitalize shadow-sm hover:-translate-y-0.5 transition-transform cursor-pointer`}
            >
              <span className="text-sm">{t}</span>
              <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-md uppercase tracking-wider">
                Type
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}