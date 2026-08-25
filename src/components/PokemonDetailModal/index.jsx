import React, { useState, useEffect } from "react";
import { typeModalBg,  typeBadge } from "../../data/typeStyles";
import { getPokemonDetails } from "../../services/pokemonService";
import { TbInfoCircle, TbSword, TbPlus } from "react-icons/tb";
import PokemonInfoTab from "./PokemonInfoTab";
import PokemonMoveTab from "./PokemonMoveTab";
import PokemonMoreTab from "./PokemonMoreTab";

export default function PokemonDetailModal({ pokemon, onClose }) {
  const [activeTab, setActiveTab] = useState("info");
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const primaryType = pokemon?.types?.[0] || "normal";
  const typeBgStyle = typeModalBg[primaryType] || "bg-bg-surface";
  const paddedId = `#${String(pokemon?.id || 0).padStart(3, "0")}`;

  const formattedName = (pokemon?.name || "Unknown")
    .replaceAll("-", " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  useEffect(() => {
    if (!pokemon) return;

    let isMounted = true;
    setLoading(true);

    getPokemonDetails(pokemon.id || pokemon.name)
      .then((data) => {
        if (isMounted) setDetails(data);
      })
      .catch((err) => console.error(err))
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [pokemon]);

  if (!pokemon) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Main Modal Shell - Full Type Color Background */}
      <div className={`relative z-10 w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-border-main/50 ${typeBgStyle}`}>
        
        {/* Header */}
        <div className="flex flex-col border-b border-border-main/30 bg-black/5">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-text-subtle">{paddedId}</span>
              <h2 className="text-2xl font-black text-text-main capitalize">
                {formattedName}
              </h2>
              <div className="flex items-center gap-1.5 ml-2">
                {pokemon?.types?.map((type) => (
                  <span
                    key={type}
                    className={`${typeBadge[type] || "bg-slate-700"} text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full capitalize shadow-2xs`}
                  >
                    {type}
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full text-text-subtle hover:bg-black/10 hover:text-text-main transition-colors cursor-pointer"
              title="Close"
            >
              ✕
            </button>
          </div>

            {/* Tab Navigation Row */}
            <div className="flex items-center justify-center px-6 py-3 border-t border-black/10 bg-black/5">
                <div className="flex items-center gap-1.5 p-1 bg-black/10 rounded-2xl">
                    {[
                    { id: "info", label: "Info", icon: TbInfoCircle },
                    { id: "moves", label: "Moves", icon: TbSword },
                    { id: "more", label: "More", icon: TbPlus },
                    ].map(({ id, label, icon: Icon }) => {
                    const isActive = activeTab === id;
                    return (
                        <button
                        key={id}
                        onClick={() => setActiveTab(id)}
                        className={`flex items-center gap-2 px-5 py-1.5 text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                            isActive
                            ? "bg-bg-surface text-text-main shadow-xs scale-[1.02]"
                            : "text-text-subtle hover:text-text-main hover:bg-black/5"
                        }`}
                        >
                        <Icon className="w-4 h-4" />
                        <span>{label}</span>
                        </button>
                    );
                    })}
                </div>
            </div>
        </div>

        {/* Modal Body */}
        {loading ? (
          <div className="p-12 text-center text-text-muted font-medium">
            Loading Pokémon stats and details...
          </div>
        ) : (
          <div className="p-6 overflow-y-auto flex-1">
            {activeTab === "info" && <PokemonInfoTab pokemon={pokemon} details={details} />}
            {activeTab === "moves" && <PokemonMoveTab pokemon={pokemon} details={details} />}
            {activeTab === "more" && <PokemonMoreTab pokemon={pokemon} details={details} />}
          </div>
        )}

      </div>
    </div>
  );
}