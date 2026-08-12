import React from "react";
import { typeCardBg, typeBadge } from "../data/typeStyles";


export default function PokemonCard({ pokemon, viewMode }) {
  const primaryType = pokemon.types[0] || "normal";
  const bgStyle = typeCardBg[primaryType] || "bg-bg-surface border-border-main";
  const paddedId = `#${String(pokemon.id).padStart(3, "0")}`;
  const capitalizedName = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);

  // GRID VIEW (Inspired Horizontal Split Card)
  if (viewMode === "grid") {
    return (
      <div className={`group flex justify-between items-center p-4 rounded-2xl border transition-all hover:-translate-y-1 hover:shadow-md cursor-pointer ${bgStyle}`}>
        {/* Left Info Column */}
        <div className="flex flex-col justify-between h-full py-1">
          <div>
            <span className="text-xs font-bold text-text-muted tracking-wider">{paddedId}</span>
            <h3 className="text-lg font-bold text-text-main mt-0.5">{capitalizedName}</h3>
          </div>

          <div className="flex flex-col gap-1.5 mt-4">
            {pokemon.types.map((type) => (
              <span
                key={type}
                className={`${typeBadge[type] || "bg-slate-700"} text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full w-max capitalize tracking-wide shadow-xs`}
              >
                {type}
              </span>
            ))}
          </div>
        </div>

        {/* Right Sprite Container */}
        <div className="w-24 h-24 shrink-0 flex items-center justify-center p-1 relative">
          <img
            src={pokemon.sprite}
            alt={capitalizedName}
            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300 drop-shadow-sm"
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
          <img src={pokemon.sprite} alt={capitalizedName} className="h-full object-contain group-hover:scale-110 transition-transform duration-300" />
        </div>
        
        <div className="flex flex-col min-w-0">
          <span className="text-[11px] font-bold text-text-muted">{paddedId}</span>
          <h3 className="text-base font-bold text-text-main truncate">{capitalizedName}</h3>
        </div>
      </div>

      <div className="flex gap-1.5 shrink-0">
        {pokemon.types.map((type) => (
          <span key={type} className={`${typeBadge[type] || "bg-slate-700"} text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full capitalize`}>
            {type}
          </span>
        ))}
      </div>
    </div>
  );
}