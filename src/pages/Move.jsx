import React, { useState, useEffect } from "react";
import { getAllMovesAlphabetical } from "../services/pokemonService";
import MoveCard from "../components/MoveCard";
import { CiSearch } from "react-icons/ci";

export default function Move() {
  const [moves, setMoves] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedMove, setSelectedMove] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    getAllMovesAlphabetical()
      .then((data) => {
        if (isMounted) setMoves(data);
      })
      .catch((err) => console.error(err))
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredMoves = moves.filter((move) =>
    move.name.toLowerCase().includes(search.toLowerCase().trim())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Header & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-text-main">Moves</h1>
          <p className="text-sm font-medium text-text-subtle mt-1">
            Browse through all Pokémon attacks and technical machines.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <CiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xl text-text-subtle" />
          <input
            type="text"
            placeholder="Search move..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-bg-surface border border-border-main rounded-xl text-sm font-medium text-text-main focus:outline-none focus:border-accent transition-colors"
          />
        </div>
      </div>

      {/* Main Grid */}
      {loading ? (
        <div className="p-12 text-center text-text-subtle font-medium">
          Loading moves index...
        </div>
      ) : filteredMoves.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMoves.map((move) => (
            <MoveCard
              key={move.id}
              move={move}
              onClick={(m) => setSelectedMove(m)}
            />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center text-text-subtle font-medium">
          No moves found matching "{search}".
        </div>
      )}

      {/* TODO: Place MoveDetailModal here once built */}
    </div>
  );
}