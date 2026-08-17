import React, { useState, useEffect } from "react";
import PokemonCard from "../PokemonCard";
import { getAbilityDetails } from "../../services/pokemonService";

export default function AbilityDetailModal({ ability, onClose }) {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("normal"); // "normal" | "hidden"

  useEffect(() => {
    if (!ability) return;

    let isMounted = true;
    setLoading(true);

    getAbilityDetails(ability.id || ability.name)
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
  }, [ability]);

  if (!ability) return null;

  const currentPokemonList =
    activeTab === "normal"
      ? details?.normalPokemon || []
      : details?.hiddenPokemon || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      {/* Backdrop click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative z-10 w-full max-w-5xl max-h-[90vh] bg-bg-surface border border-border-main rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-main bg-bg-muted/30">
          <div>
            <span className="text-xs font-bold text-text-subtle uppercase tracking-wider">
              Ability Overview
            </span>
            <h2 className="text-2xl font-black text-text-main capitalize">
              {ability.name.replaceAll("-", " ")}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-text-subtle hover:bg-bg-muted hover:text-text-main transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        {loading ? (
          <div className="p-12 text-center text-text-muted font-medium">
            Loading ability details...
          </div>
        ) : (
          <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-y-auto">
            
            {/* Left Column: Ability Info */}
            <div className="space-y-4">
              <div className="bg-bg-muted/30 border border-border-main/50 rounded-2xl p-4">
                <span className="text-xs font-bold uppercase tracking-wider text-accent">
                  Effect
                </span>
                <p className="text-sm text-text-main mt-1 leading-relaxed">
                  {details?.effect}
                </p>
              </div>

              <div className="bg-bg-muted/30 border border-border-main/50 rounded-2xl p-4">
                <span className="text-xs font-bold uppercase tracking-wider text-accent">
                  In-Depth Effect
                </span>
                <p className="text-sm text-text-muted mt-1 leading-relaxed">
                  {details?.inDepthEffect}
                </p>
              </div>
            </div>

            {/* Right Column: Tabbed Pokémon List */}
            <div className="flex flex-col h-full">
              <span className="text-xs font-bold uppercase tracking-wider text-text-subtle mb-3">
                Pokémon With This Ability
              </span>

              {/* Nav Tabs */}
              <div className="flex gap-2 p-1 bg-bg-muted/50 rounded-xl border border-border-main/40 mb-4">
                <button
                  onClick={() => setActiveTab("normal")}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    activeTab === "normal"
                      ? "bg-accent text-white shadow-xs"
                      : "text-text-subtle hover:text-text-main"
                  }`}
                >
                  Normal ({details?.normalPokemon.length || 0})
                </button>
                <button
                  onClick={() => setActiveTab("hidden")}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    activeTab === "hidden"
                      ? "bg-accent text-white shadow-xs"
                      : "text-text-subtle hover:text-text-main"
                  }`}
                >
                  Hidden ({details?.hiddenPokemon.length || 0})
                </button>
              </div>

              {/* Scrollable Pokémon Cards List */}
              <div className="flex flex-col gap-3 max-h-95 overflow-y-auto pr-1">
                {currentPokemonList.length > 0 ? (
                  currentPokemonList.map((pkmn) => (
                    <PokemonCard
                      key={pkmn.id}
                      pokemon={pkmn}
                      viewMode="list"
                    />
                  ))
                ) : (
                  <div className="text-center py-8 text-sm text-text-muted font-medium">
                    No Pokémon found with this as a {activeTab} ability.
                  </div>
                )}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}