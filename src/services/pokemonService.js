const BASE_URL = "https://pokeapi.co/api/v2";

/* Fetch pokemon list */

export const getPokemonBatch = async (limit = 20, offset = 0) => {
  try {
    const res = await fetch(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);
    if (!res.ok) throw new Error("Failed to fetch Pokémon list");
    const data = await res.json();

    const detailPromises = data.results.map(async (item) => {
      const detailRes = await fetch(item.url);
      if (!detailRes.ok) throw new Error(`Failed to fetch details for ${item.name}`);
      const raw = await detailRes.json();

      return {
        id: raw.id,
        name: raw.name,
        sprite: raw.sprites.other["official-artwork"].front_default || raw.sprites.front_default,
        types: raw.types.map((t) => t.type.name),
      };
    });

    const parsedBatch = await Promise.all(detailPromises);

    return {
      results: parsedBatch,
      hasMore: Boolean(data.next),
    };
  } catch (error) {
    console.error("pokemonService error:", error);
    throw error;
  }
};

// Placeholders for future pages/features:
// export const getPokemonByIdOrName = async (idOrName) => { ... }
// export const getAbilitiesList = async () => { ... }
// export const getTypeMatchups = async () => { ... }