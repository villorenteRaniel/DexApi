import React from "react";
import { typeBadge } from "../data/typeStyles";

// Utility styling for damage categories
const damageClassStyles = {
  physical: "bg-orange-600 text-white",
  special: "bg-blue-600 text-white",
  status: "bg-slate-500 text-white",
};

export default function MoveCard({ move, onClick }) {
  const formattedName = move.name
    .replaceAll("-", " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <div
      onClick={() => onClick && onClick(move)}
      className="group flex items-center justify-between p-4 bg-bg-surface border border-border-main rounded-2xl hover:border-accent hover:-translate-y-0.5 hover:shadow-md transition-all cursor-pointer"
    >
      <div className="flex flex-col min-w-0">
        <h3 className="text-base font-bold text-text-main truncate group-hover:text-accent transition-colors">
          {formattedName}
        </h3>
        <span className="text-xs font-semibold text-text-subtle">
          #{String(move.id).padStart(3, "0")}
        </span>
      </div>

      {/* Badges for Type and Category */}
      <div className="flex items-center gap-1.5 shrink-0">
        {move.type && (
          <span
            className={`${
              typeBadge[move.type] || "bg-slate-700"
            } text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full capitalize shadow-2xs`}
          >
            {move.type}
          </span>
        )}
        {move.damageClass && (
          <span
            className={`${
              damageClassStyles[move.damageClass] || "bg-slate-600"
            } text-[10px] font-bold px-2 py-0.5 rounded-md capitalize tracking-wide`}
          >
            {move.damageClass}
          </span>
        )}
      </div>
    </div>
  );
}