import React from "react";
import PokemonCard from "../PokemonCard";

export default function MovePokemonList({ pokemonList = [] }) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold uppercase tracking-wider text-text-subtle">
          Learned By Pokémon
        </span>
        <span className="text-xs font-bold text-accent">
          {pokemonList.length} Total
        </span>
      </div>

      {/* Scrollable Pokémon Cards */}
      <div className="flex flex-col gap-3 max-h-95 overflow-y-auto pr-1">
        {pokemonList.length > 0 ? (
          pokemonList.map((pkmn) => (
            <PokemonCard
              key={pkmn.id || pkmn.name}
              pokemon={pkmn}
              viewMode="list"
            />
          ))
        ) : (
          <div className="text-center py-8 text-sm text-text-muted font-medium">
            No Pokémon learn this move directly.
          </div>
        )}
      </div>
    </div>
  );
}