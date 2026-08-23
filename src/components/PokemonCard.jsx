import React from "react";
import { typeCardBg, typeBadge } from "../data/typeStyles";
import { CiHeart } from "react-icons/ci";

export default function PokemonCard({ pokemon, viewMode }) {
  const primaryType = pokemon?.types?.[0] || "normal";
  const bgStyle = typeCardBg[primaryType] || "bg-bg-surface border-border-main";
  const paddedId = `#${String(pokemon?.id || 0).padStart(3, "0")}`;

  // Replace hyphens with spaces and capitalize each word
  const formattedName = (pokemon?.name || "Unknown")
    .replaceAll("-", " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const typesList = pokemon?.types || [];

  // GRID VIEW (Inspired Horizontal Split Card)
  if (viewMode === "grid") {
    return (
      <div className={`group flex items-center justify-between px-3.5 py-5 rounded-2xl border transition-all hover:-translate-y-0.5 hover:shadow-md cursor-pointer gap-3 ${bgStyle}`}>
        {/* Pokemon Details */}
        <div className="flex flex-col justify-between flex-1 min-w-0 h-full gap-2.5">
          {/* Header: ID, Name, Favorite */}
          <div className="flex items-center justify-between gap-1 w-full">
            <div className="flex items-center gap-3 min-w-0">
              <span className="text-[11px] font-bold text-text-muted shrink-0">{paddedId}</span>
              <h3 className="text-sm font-bold text-text-main truncate">{formattedName}</h3>
            </div>
            <button 
              type="button" 
              className="text-text-muted hover:text-rose-500 transition-colors shrink-0 p-0.5 cursor-pointer"
              title="Favorite"
            >
              <CiHeart className="text-base" />
            </button>
          </div>

          {/* Pokemon Type/s Badges */}
          <div className="flex items-center gap-1.5 w-full">
            {typesList.map((type) => (
              <span
                key={type}
                className={`${typeBadge[type] || "bg-slate-700"} text-white text-[10px] font-bold py-1 px-2 rounded-full capitalize text-center tracking-wide shadow-2xs ${
                  typesList.length === 1 ? "w-full" : "flex-1 min-w-0 truncate"
                }`}
              >
                {type}
              </span>
            ))}
          </div>
        </div>

        {/* Pokemon Sprite */}
        <div className="w-14 h-14 shrink-0 flex items-center justify-center p-0.5">
          <img 
            src={pokemon?.sprite} 
            alt={formattedName} 
            loading="lazy"
            className="h-full w-full object-contain group-hover:scale-110 transition-transform duration-300 drop-shadow-xs" 
          />
        </div>
      </div>
    );
  }

  // LIST VIEW (Clean Compact Row)
  return (
    <div className={`group flex items-center justify-between p-3 rounded-xl border transition-all hover:shadow-sm cursor-pointer gap-4 w-full ${bgStyle}`}>
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-12 h-12 shrink-0 flex items-center justify-center">
          <img src={pokemon?.sprite} alt={formattedName} className="h-full object-contain group-hover:scale-110 transition-transform duration-300" />
        </div>
        
        <div className="flex flex-col min-w-0">
          <span className="text-[11px] font-bold text-text-muted">{paddedId}</span>
          <h3 className="text-base font-bold text-text-main truncate">{formattedName}</h3>
        </div>
      </div>

      <div className="flex gap-1.5 shrink-0">
        {typesList.map((type) => (
          <span key={type} className={`${typeBadge[type] || "bg-slate-700"} text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full capitalize`}>
            {type}
          </span>
        ))}
      </div>
    </div>
  );
}