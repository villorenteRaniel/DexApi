import React, { useState } from "react";
import { VscSearch, VscSettings } from "react-icons/vsc";
import { IoMdList } from "react-icons/io";
import { PiSquaresFourBold } from "react-icons/pi";
import PokemonGrid from "../components/PokemonGrid";

export default function Pokedex() {
  const [viewMode, setViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <section className="px-6 py-8 w-full">
      {/* Page Header */}
      <div className="flex flex-col gap-1 mb-8">
        <h1 className="text-3xl font-extrabold text-text-main font-display tracking-tight">
          Pokédex
        </h1>
        <p className="text-text-subtle text-sm md:text-base">
          Browse and search through the complete database of Pokémon. Filter by generation, view base stats, abilities, and type matchups in real-time.
        </p>
      </div>

      {/* Control Bar */}
      <div className="flex items-center justify-between gap-4">
        {/* Search Input & Filter Button */}
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative w-full">
            <VscSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted text-lg pointer-events-none" />
            <input
              type="text"
              placeholder="Search Pokémon by name or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-bg-muted/50 border border-border-main rounded-xl text-text-main placeholder:text-text-muted text-sm focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
            />
          </div>

          <button 
            title="Filter Settings"
            className="p-2.5 bg-accent hover:bg-accent-hover text-white rounded-xl transition-colors shrink-0 shadow-xs cursor-pointer"
          >
            <VscSettings className="text-xl" />
          </button>
        </div>

        {/* View Layout Toggle (Grid vs List) */}
        <div className="flex items-center gap-1 bg-bg-muted p-1 rounded-xl border border-border-main shrink-0">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-lg text-lg transition-all cursor-pointer ${
              viewMode === "grid"
                ? "bg-bg-surface text-accent shadow-xs font-bold"
                : "text-text-muted hover:text-text-main"
            }`}
            title="Grid View"
          >
            <PiSquaresFourBold />
          </button>
          
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-lg text-lg transition-all cursor-pointer ${
              viewMode === "list"
                ? "bg-bg-surface text-accent shadow-xs font-bold"
                : "text-text-muted hover:text-text-main"
            }`}
            title="List View"
          >
            <IoMdList />
          </button>
        </div>
      </div>
      
      {/* Pokemon Grid - Directly render without a constrained wrapper */}
      <PokemonGrid viewMode={viewMode} searchQuery={searchQuery} />
    </section>
  );
}