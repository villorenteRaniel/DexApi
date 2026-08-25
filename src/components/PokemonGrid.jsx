import React, { useState, useEffect, useRef, useCallback } from "react";
import PokemonCard from "./PokemonCard";
import PokemonDetailModal from "./PokemonDetailModal"; // 1. Import Modal
import { getPokemonBatch } from "../services/pokemonService";

export default function PokemonGrid({ viewMode, searchQuery }) {
    const [pokemonList, setPokemonList] = useState([]);
    const [offset, setOffset] = useState(0);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    
    // 2. Add state to hold the selected Pokémon for the modal
    const [selectedPokemon, setSelectedPokemon] = useState(null);

    const isFetchingRef = useRef(false);
    const LIMIT = 20;

    const fetchPokemonBatch = useCallback(async () => {
        if (isFetchingRef.current || !hasMore) return;
        isFetchingRef.current = true;
        setLoading(true);

        try {
            const { results, hasMore: nextExists } = await getPokemonBatch(LIMIT, offset);

            setPokemonList((prev) => {
                const existingIds = new Set(prev.map((p) => p.id));
                const uniqueNew = results.filter((p) => !existingIds.has(p.id));
                return [...prev, ...uniqueNew];
            });

            setOffset((prev) => prev + LIMIT);
            setHasMore(nextExists);
        } catch (err) {
            console.error("Failed to fetch Pokémon batch:", err);
        } finally {
            setLoading(false);
            isFetchingRef.current = false;
        }
    }, [offset, hasMore]);

    useEffect(() => {
        if (offset === 0) {
            fetchPokemonBatch();
        }
    }, [offset, fetchPokemonBatch]);

    useEffect(() => {
        const handleScroll = () => {
            if (
                window.innerHeight + document.documentElement.scrollTop + 200 >=
                document.documentElement.offsetHeight
            ) {
                fetchPokemonBatch();
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [fetchPokemonBatch]);

    const filteredList = pokemonList.filter(
        (p) =>
            p.name.toLowerCase().includes((searchQuery || "").toLowerCase()) ||
            String(p.id).includes(searchQuery || "")
    );

    return (
        <>
            <div className={ viewMode === "grid" ? "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 mt-6" : "flex flex-col gap-3 mt-6"}>
                {filteredList.map((pokemon) => (
                    <PokemonCard 
                        key={pokemon.id} 
                        pokemon={pokemon} 
                        viewMode={viewMode}
                        onClick={() => setSelectedPokemon(pokemon)} // 3. Set selected Pokémon on card click
                    />
                ))}

                {loading && (
                    <div className="col-span-full text-center py-8 text-text-muted font-medium">
                        Loading PokéAPI data...
                    </div>
                )}
            </div>

            {/* 4. Render modal conditionally */}
            {selectedPokemon && (
                <PokemonDetailModal 
                    isOpen={Boolean(selectedPokemon)}
                    pokemon={selectedPokemon} 
                    onClose={() => setSelectedPokemon(null)} 
                />
            )}
        </>
    );
}