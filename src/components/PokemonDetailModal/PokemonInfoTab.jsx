import React from "react";

export default function PokemonInfoTab({ details }) {
  if (!details) return null;

  const { stats, bst, abilities, sprites, evolutionChain } = details;

  // Helper for Stat Colors & Max Value Ratios
  const getStatBarColor = (val) => {
    if (val >= 120) return "bg-emerald-500";
    if (val >= 90) return "bg-teal-500";
    if (val >= 60) return "bg-amber-500";
    return "bg-rose-500";
  };

  const statList = [
    { label: "HP", key: "hp", max: 255 },
    { label: "Attack", key: "attack", max: 190 },
    { label: "Defense", key: "defense", max: 230 },
    { label: "Sp. Atk", key: "special-attack", max: 194 },
    { label: "Sp. Def", key: "special-defense", max: 230 },
    { label: "Speed", key: "speed", max: 200 },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* 1. Base Stats Section */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black uppercase tracking-wider text-text-subtle">
            Base Stats
          </h3>
          <span className="text-xs font-black text-text-main">
            BST: <span className="text-accent">{bst}</span>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 bg-bg-surface/80 p-4 rounded-2xl border border-border-main/60 shadow-xs">
          {statList.map(({ label, key, max }) => {
            const val = stats?.[key] || 0;
            const percent = Math.min(Math.round((val / max) * 100), 100);

            return (
              <div key={key} className="flex items-center gap-3">
                <span className="w-16 text-xs font-bold text-text-subtle shrink-0">
                  {label}
                </span>
                <span className="w-8 text-xs font-black text-text-main text-right shrink-0">
                  {val}
                </span>
                <div className="flex-1 h-2 bg-black/10 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${getStatBarColor(val)}`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Abilities Section */}
      <div className="flex flex-col gap-3">
        <h3 className="text-xs font-black uppercase tracking-wider text-text-subtle">
          Abilities
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {abilities?.map((ability) => (
            <div
              key={ability.name}
              className="flex items-center justify-between p-3.5 rounded-xl border border-border-main/60 bg-bg-surface/90 shadow-xs"
            >
              <span className="text-sm font-bold text-text-main capitalize">
                {ability.name.replaceAll("-", " ")}
              </span>
              {ability.isHidden && (
                <span className="text-[10px] font-black text-amber-600 bg-amber-500/15 px-2 py-0.5 rounded-full uppercase tracking-wider border border-amber-500/30">
                  Hidden
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 3. Evolution Line Section */}
      {evolutionChain && evolutionChain.length > 0 && (
        <div className="flex flex-col gap-3">
          <h3 className="text-xs font-black uppercase tracking-wider text-text-subtle">
            Evolution Line
          </h3>
          <div className="flex flex-row items-center justify-around gap-3 lg:gap-4 p-1 lg:p-5 rounded-2xl border border-border-main/60 bg-bg-surface/80 shadow-xs">
            {evolutionChain.map((evo, idx) => (
              <React.Fragment key={evo.name}>
                <div className="flex flex-col items-center gap-2 group cursor-pointer">
                  <div className="w-20 h-20 rounded-2xl p-2 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <img
                      src={evo.sprite}
                      alt={evo.name}
                      className="w-full h-full object-contain drop-shadow-sm"
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-black text-text-main capitalize">
                      {evo.name.replaceAll("-", " ")}
                    </p>
                    {evo.minLevel && (
                      <span className="text-[10px] font-bold text-text-subtle">
                        Lv. {evo.minLevel}
                      </span>
                    )}
                  </div>
                </div>

                {/* Arrow connector between stages */}
                {idx < evolutionChain.length - 1 && (
                  <div className="text-text-subtle/60 text-sm lg:text-3xl font-bold">
                    →
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      {/* 4. Normal vs. Shiny Artwork Showcase */}
      <div className="flex flex-col gap-3">
        <h3 className="text-xs font-black uppercase tracking-wider text-text-subtle">
          Artwork Showcase
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col items-center justify-center p-4 rounded-2xl border border-border-main/60 bg-bg-surface/80 gap-2 shadow-xs">
            <span className="text-xs font-bold text-text-subtle">Normal</span>
            <img
              src={sprites?.normal}
              alt="Normal Sprite"
              className="w-32 h-32 object-contain drop-shadow-md hover:scale-105 transition-transform"
            />
          </div>
          <div className="flex flex-col items-center justify-center p-4 rounded-2xl border border-border-main/60 bg-bg-surface/80 gap-2 shadow-xs">
            <span className="text-xs font-bold text-amber-500">✨ Shiny</span>
            <img
              src={sprites?.shiny}
              alt="Shiny Sprite"
              className="w-32 h-32 object-contain drop-shadow-md hover:scale-105 transition-transform"
            />
          </div>
        </div>
      </div>
    </div>
  );
}