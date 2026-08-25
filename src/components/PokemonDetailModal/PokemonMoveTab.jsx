import React, { useState } from "react";
import { typeBadge } from "../../data/typeStyles";

export default function PokemonMoveTab({ details }) {
  const [subTab, setSubTab] = useState("levelUp"); // "levelUp" | "machine" | "egg" | "tutor"

  if (!details?.moves) {
    return (
      <div className="p-8 text-center text-text-subtle font-medium">
        No move data available for this Pokémon.
      </div>
    );
  }

  const { moves } = details;

  const subTabConfigs = [
    { id: "levelUp", label: "Level Up", count: moves.levelUp?.length || 0 },
    { id: "machine", label: "TM / HM", count: moves.machine?.length || 0 },
    { id: "egg", label: "Egg Moves", count: moves.egg?.length || 0 },
    { id: "tutor", label: "Tutor", count: moves.tutor?.length || 0 },
  ];

  const currentMoveList = moves[subTab] || [];

  // Category Color Map (Physical, Special, Status)
  const categoryBadge = {
    physical: "bg-amber-600 text-white/90",
    special: "bg-indigo-600 text-white/90",
    status: "bg-slate-500 text-white/90",
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Sub-tab Navigation Pills */}
      <div className="flex items-center justify-center gap-2 flex-wrap">
        {subTabConfigs.map(({ id, label, count }) => {
          const isActive = subTab === id;
          return (
            <button
              key={id}
              onClick={() => setSubTab(id)}
              className={`flex items-center gap-2 px-4 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer border ${
                isActive
                  ? "bg-bg-surface text-text-main border-border-main shadow-2xs scale-[1.02]"
                  : "bg-black/5 text-text-subtle border-transparent hover:bg-black/10 hover:text-text-main"
              }`}
            >
              <span>{label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                  isActive ? "bg-black/10 text-text-main" : "bg-black/10 text-text-subtle"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Move Table */}
      {currentMoveList.length === 0 ? (
        <div className="p-8 text-center text-text-subtle text-xs font-semibold bg-bg-surface/60 rounded-2xl border border-border-main/50">
          No moves learned via this method.
        </div>
      ) : (
        <div className="bg-bg-surface/90 rounded-2xl border border-border-main/60 overflow-hidden shadow-xs">
          <div className="max-h-95 overflow-y-auto">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-bg-surface border-b border-border-main/60 z-10">
                <tr className="text-[10px] font-black uppercase text-text-subtle">
                  <th className="py-3 px-3 text-center w-12">
                    {subTab === "levelUp" ? "Lvl" : "#"}
                  </th>
                  <th className="py-3 px-3">Move</th>
                  <th className="py-3 px-3 text-center">Type</th>
                  <th className="py-3 px-3 text-center">Category</th>
                  <th className="py-3 px-3 text-center">PWR</th>
                  <th className="py-3 px-3 text-center">ACC</th>
                  <th className="py-3 px-3 text-center">PP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-main/30 text-xs font-bold text-text-main">
                {currentMoveList.map((m, idx) => (
                  <tr
                    key={`${m.name}-${idx}`}
                    className="hover:bg-black/5 transition-colors"
                  >
                    {/* Level or Index Column */}
                    <td className="py-2.5 px-3 text-center font-black text-text-subtle">
                      {subTab === "levelUp"
                        ? m.levelLearned === 0
                          ? "—"
                          : m.levelLearned
                        : idx + 1}
                    </td>

                    {/* Move Name */}
                    <td className="py-2.5 px-3 capitalize font-bold">
                      {m.name.replaceAll("-", " ")}
                    </td>

                    {/* Move Type Badge */}
                    <td className="py-2.5 px-3 text-center">
                      <span
                        className={`${
                          typeBadge[m.type] || "bg-slate-600 text-white/90"
                        } text-[9px] text-white/90 px-2 py-0.5 rounded-full uppercase tracking-wider font-light shadow-2xs inline-block`}
                      >
                        {m.type}
                      </span>
                    </td>

                    {/* Category (Physical / Special / Status) */}
                    <td className="py-2.5 px-3 text-center">
                      <span
                        className={`${
                          categoryBadge[m.category] || "bg-slate-500 text-white/90"
                        } text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider font-light shadow-2xs inline-block`}
                      >
                        {m.category}
                      </span>
                    </td>

                    {/* Power */}
                    <td className="py-2.5 px-3 text-center text-text-main font-black">
                      {m.power ?? "—"}
                    </td>

                    {/* Accuracy */}
                    <td className="py-2.5 px-3 text-center text-text-main font-black">
                      {m.accuracy ? `${m.accuracy}%` : "—"}
                    </td>

                    {/* PP */}
                    <td className="py-2.5 px-3 text-center text-text-subtle font-black">
                      {m.pp ?? "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}