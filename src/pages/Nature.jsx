import React, { useState, useEffect } from "react";
import { getAllNatures } from "../services/pokemonService";
import NatureGrid from "../components/NatureGrid";
import { CiSearch } from "react-icons/ci";

export default function Nature() {
  const [natures, setNatures] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    getAllNatures()
      .then((data) => {
        if (isMounted) setNatures(data);
      })
      .catch((err) => console.error(err))
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredNatures = natures.filter((nature) =>
    nature.name.toLowerCase().includes(search.toLowerCase().trim())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-text-main">Natures</h1>
          <p className="text-sm font-medium text-text-subtle mt-1">
            Browse stat multipliers and flavor preferences for all 25 Pokémon natures.
          </p>
        </div>

        <div className="relative w-full md:w-80">
          <CiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xl text-text-subtle" />
          <input
            type="text"
            placeholder="Search nature..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-bg-surface border border-border-main rounded-xl text-sm font-medium text-text-main focus:outline-none focus:border-accent transition-colors"
          />
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-text-subtle font-medium">
          Loading natures...
        </div>
      ) : (
        <NatureGrid natures={filteredNatures} />
      )}
    </div>
  );
}