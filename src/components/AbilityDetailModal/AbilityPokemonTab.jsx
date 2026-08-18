import React, { useState } from "react";
import PokemonCard from "../PokemonCard";

export default function AbilityPokemonTab({ details }) {
  const [activeTab, setActiveTab] = useState("normal"); // "normal" | "hidden"

  const currentPokemonList =
    activeTab === "normal"
      ? details?.normalPokemon || []
      : details?.hiddenPokemon || [];

  return (
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
          Normal ({details?.normalPokemon?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab("hidden")}
          className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
            activeTab === "hidden"
              ? "bg-accent text-white shadow-xs"
              : "text-text-subtle hover:text-text-main"
          }`}
        >
          Hidden ({details?.hiddenPokemon?.length || 0})
        </button>
      </div>

      {/* Scrollable List */}
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
  );
}