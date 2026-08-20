import React, { useState, useEffect } from "react";
import { typeBadge } from "../data/typeStyles";
import { getMoveHeaderDetails } from "../services/pokemonService";

const damageClassStyles = {
  physical: "bg-orange-600 text-white",
  special: "bg-blue-600 text-white",
  status: "bg-slate-500 text-white",
};

export default function MoveCard({ move, onClick }) {
  const [meta, setMeta] = useState({ type: move.type, damageClass: move.damageClass });

  useEffect(() => {
    // Only fetch if missing
    if (!meta.type || !meta.damageClass) {
      let isMounted = true;
      getMoveHeaderDetails(move.id || move.name).then((data) => {
        if (data && isMounted) {
          setMeta(data);
        }
      });
      return () => {
        isMounted = false;
      };
    }
  }, [move]);

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
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        {meta.type && (
          <span
            className={`${
              typeBadge[meta.type] || "bg-slate-700"
            } text-white text-[10px] font-bold px-2.5 py-0.5 rounded-md capitalize shadow-2xs`}
          >
            {meta.type}
          </span>
        )}
        {meta.damageClass && (
          <span
            className={`${
              damageClassStyles[meta.damageClass] || "bg-slate-600"
            } text-[10px] font-bold px-2 py-0.5 rounded-md capitalize tracking-wide`}
          >
            {meta.damageClass}
          </span>
        )}
      </div>
    </div>
  );
}