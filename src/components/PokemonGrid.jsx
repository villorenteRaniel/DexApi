import React, { useState, useEffect } from "react";
import PokemonCard from "./PokemonCard";

export default function PokemonGrid({ viewMode, searchQuery }) {
    const [pokemonList, setPokemonList] = useState([]);
    const [offset, setOffset] = useState(0);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const LIMIT = 20;

    const fetchPokemonBatch = async () => {
        if (loading || !hasMore) return;
        setLoading(true);

        try {
            const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${LIMIT}&offset=${offset}`);
            const data = await res.json();

            // Fetch and extract ONLY the 4 necessary properties
            const parsedBatchPromises = data.results.map(async (item) => {
            const detailRes = await fetch(item.url);
            const raw = await detailRes.json();

            return {
            id: raw.id,
            name: raw.name,
            sprite: raw.sprites.other["official-artwork"].front_default || raw.sprites.front_default,
            types: raw.types.map((t) => t.type.name),
            };
        });

        const parsedBatch = await Promise.all(parsedBatchPromises);

        setPokemonList((prev) => [...prev, ...parsedBatch]);
        setOffset((prev) => prev + LIMIT);
        if (!data.next) setHasMore(false);
        } catch (err) {
            console.error("Failed to fetch Pokémon batch:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPokemonBatch();
    }, []);

    // Simple infinite scroll listener
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
    }, [offset, loading, hasMore]);

    // Filter list by search query
    const filteredList = pokemonList.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(p.id).includes(searchQuery)
    );

    return (
        <div className={ viewMode === "grid" ? "grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5  gap-4 mt-6" : "flex flex-col gap-3 mt-6"}>
            {filteredList.map((pokemon) => (
                <PokemonCard key={pokemon.id} pokemon={pokemon} viewMode={viewMode} />
            ))}

            {loading && (
                <div className="col-span-full text-center py-8 text-text-muted font-medium">
                    Loading PokéAPI data...
                </div>
            )}
        </div>
    );
}