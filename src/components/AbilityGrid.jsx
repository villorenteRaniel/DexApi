import React, { useState, useEffect } from "react";
import AbilityCard from "./AbilityCard";
import { getAllAbilitiesAlphabetical } from "../services/pokemonService";

export default function AbilityGrid({ searchQuery, onSelectAbility }) {
  const [allAbilities, setAllAbilities] = useState([]);
  const [visibleCount, setVisibleCount] = useState(24);
  const [loading, setLoading] = useState(true);

  // Initial fetch: Load all abilities A-Z once
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getAllAbilitiesAlphabetical();
        setAllAbilities(data);
      } catch (err) {
        console.error("Failed to load abilities:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Infinite scroll listener to reveal 24 more from local state
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop + 200 >=
        document.documentElement.offsetHeight
      ) {
        setVisibleCount((prev) => Math.min(prev + 24, allAbilities.length));
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [allAbilities.length]);

  // Filter A-Z list by search query
  const filteredList = allAbilities.filter(
    (a) =>
      a.name.toLowerCase().includes((searchQuery || "").toLowerCase()) ||
      String(a.id).includes(searchQuery || "")
  );

  // Slice for virtual pagination
  const visibleList = filteredList.slice(0, visibleCount);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
      {visibleList.map((ability) => (
        <AbilityCard
          key={ability.id}
          ability={ability}
          onClick={(selected) => onSelectAbility && onSelectAbility(selected)}
        />
      ))}

      {loading && (
        <div className="col-span-full text-center py-8 text-text-muted font-medium">
          Loading Abilities...
        </div>
      )}
    </div>
  );
}