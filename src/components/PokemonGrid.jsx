import React, {useState, useEffect} from "react";
import PokemonCard from "../components/PokemonCard";

export default function PokemonGrid({viewMode, searchQuery}){
    const [pokemonList, setPokemonList] = useState([]);
    const [offset, setOffset] = useState(0);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    // Set the limit of how many pokemon is initially displayed
    const LIMIT = 20;

    // Fetch the list
    const fetchPokemon = async () => {
        if (loading || !hasMore) return;
        setLoading(true);

        try{
            const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${LIMIT}&offset=${offset}`);
            const data = await res.json();
            setPokemonList((prev) => [...prev, ...data.results]);
            setOffset((prev) => prev + LIMIT);
            if (!data.next) setHasMore(false);
        } catch (err){
            console.log("Failed to fetch pokemon details", err);
        } finally {
            setLoading(false);
        } 
    }

    useEffect(() => {
        fetchPokemon();
    }, []);

    // Scroll Listener
    useEffect(() => {
        const handleScroll = () => {
            if (
                window.innerHeight + document.documentElement.scrollTop + 200 >=
                document.documentElement.offsetHeight
            ) {
                fetchPokemon();
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [offset, loading ,hasMore])

    return(
        <div className={viewMode === "grid" ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6" : "flex flex-col gap-3 mt-6"}>
            {pokemonList.map((pokemon) => (
                <PokemonCard key={pokemon.name} pokemon={pokemon} viewMode={viewMode} />
            ))}

            {loading && (
                <div className="col-span-full text-center py-6 text-text-muted">
                    Loading PokéAPI data...
                </div>
            )}
        </div>
    );

    
}