const BASE_URL = "https://pokeapi.co/api/v2";

// Cache store to avoid re-fetching identical data
const cache = new Map();

/**
 * Utility: Limit concurrent promises to prevent network spikes / 429 errors
 */
const fetchInBatches = async (items, batchSize, fn) => {
  const results = [];
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(fn));
    results.push(...batchResults);
  }
  return results;
};

/**
 * Helper: Safely construct reliable sprite URLs bypassing raw.githubusercontent limits
 */
const getReliableSprite = (id) => {
  return `https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/pokemon/other/official-artwork/${id}.png`;
};

/* Fetch pokemon batch */
export const getPokemonBatch = async (limit = 20, offset = 0) => {
  try {
    const res = await fetch(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);
    if (!res.ok) throw new Error("Failed to fetch Pokémon list");
    const data = await res.json();

    // Fetch details in small concurrent batches (10 at a time)
    const parsedBatch = await fetchInBatches(data.results, 10, async (item) => {
      const detailRes = await fetch(item.url);
      if (!detailRes.ok) throw new Error(`Failed to fetch details for ${item.name}`);
      const raw = await detailRes.json();

      return {
        id: raw.id,
        name: raw.name,
        sprite: getReliableSprite(raw.id),
        types: raw.types.map((t) => t.type.name),
      };
    });

    return {
      results: parsedBatch,
      hasMore: Boolean(data.next),
    };
  } catch (error) {
    console.error("pokemonService error:", error);
    throw error;
  }
};

/* Fetch all abilities alphabetical */
export const getAllAbilitiesAlphabetical = async () => {
  if (cache.has("allAbilities")) {
    return cache.get("allAbilities");
  }

  try {
    const res = await fetch(`${BASE_URL}/ability?limit=400&offset=0`);
    if (!res.ok) throw new Error("Failed to fetch abilities");
    const data = await res.json();

    const formatGeneration = (genName) => {
      if (!genName) return "Gen I";
      const parts = genName.split("-");
      return parts.length < 2 ? genName : `Gen ${parts[1].toUpperCase()}`;
    };

    // Process 20 abilities at a time instead of 400 at once
    const detailedResults = await fetchInBatches(data.results, 20, async (item) => {
      try {
        const detailRes = await fetch(item.url);
        const raw = await detailRes.json();
        return {
          id: raw.id,
          name: raw.name,
          generation: formatGeneration(raw.generation?.name),
          url: item.url,
        };
      } catch {
        return {
          id: item.url.split("/").slice(-2, -1)[0],
          name: item.name,
          generation: "Unknown",
          url: item.url,
        };
      }
    });

    const sorted = detailedResults.sort((a, b) => a.name.localeCompare(b.name));
    cache.set("allAbilities", sorted);
    return sorted;
  } catch (error) {
    console.error("getAllAbilitiesAlphabetical error:", error);
    throw error;
  }
};

/**
 * Fetches full ability details including descriptions and associated Pokémon.
 */
export const getAbilityDetails = async (idOrName) => {
  const cacheKey = `ability_${idOrName}`;
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  try {
    const res = await fetch(`${BASE_URL}/ability/${idOrName}`);
    if (!res.ok) throw new Error("Failed to fetch ability details");
    const data = await res.json();

    const englishEffect = data.effect_entries.find((e) => e.language.name === "en");
    const englishFlavor = data.flavor_text_entries.find((f) => f.language.name === "en");

    const effectText = englishEffect?.short_effect || englishFlavor?.flavor_text || "No summary available.";
    const inDepthEffectText = englishEffect?.effect || englishFlavor?.flavor_text || "No detailed description available.";

    // Fetch Pokémon details in batches of 10
    const resolvedPokemon = await fetchInBatches(data.pokemon, 10, async (p) => {
      try {
        const detailRes = await fetch(p.pokemon.url);
        if (!detailRes.ok) return null;
        const raw = await detailRes.json();

        return {
          is_hidden: p.is_hidden,
          pokemon: {
            id: raw.id,
            name: raw.name,
            sprite: getReliableSprite(raw.id),
            types: raw.types.map((t) => t.type.name),
          },
        };
      } catch {
        return null;
      }
    });

    const validPokemon = resolvedPokemon.filter(Boolean);

    const result = {
      id: data.id,
      name: data.name,
      generation: data.generation?.name ? data.generation.name.replace("generation-", "Gen ").toUpperCase() : "GEN I",
      effect: effectText,
      inDepthEffect: inDepthEffectText,
      normalPokemon: validPokemon.filter((p) => !p.is_hidden).map((p) => p.pokemon),
      hiddenPokemon: validPokemon.filter((p) => p.is_hidden).map((p) => p.pokemon),
    };

    cache.set(cacheKey, result);
    return result;
  } catch (error) {
    console.error("getAbilityDetails error:", error);
    throw error;
  }
};

/* Fetch all moves alphabetically */
export const getAllMovesAlphabetical = async () => {
  if (cache.has("allMoves")) {
    return cache.get("allMoves");
  }

  try {
    const res = await fetch(`${BASE_URL}/move?limit=1000&offset=0`);
    if (!res.ok) throw new Error("Failed to fetch moves");
    const data = await res.json();

    // Clean and sort the initial list alphabetically
    const formatted = data.results
      .map((item) => {
        // Extract ID from URL (e.g., https://pokeapi.co/api/v2/move/1/)
        const id = item.url.split("/").filter(Boolean).pop();
        return {
          id: Number(id),
          name: item.name,
          url: item.url,
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name));

    cache.set("allMoves", formatted);
    return formatted;
  } catch (error) {
    console.error("getAllMovesAlphabetical error:", error);
    throw error;
  }
};



// Add this helper function to pokemonService.js
export const getMoveHeaderDetails = async (idOrName) => {
  const cacheKey = `move_header_${idOrName}`;
  if (cache.has(cacheKey)) return cache.get(cacheKey);

  try {
    const res = await fetch(`${BASE_URL}/move/${idOrName}`);
    if (!res.ok) return null;
    const data = await res.json();

    const result = {
      type: data.type?.name || "normal",
      damageClass: data.damage_class?.name || "status",
    };

    cache.set(cacheKey, result);
    return result;
  } catch {
    return null;
  }
};

/* Fetch individual Move Details */
export const getMoveDetails = async (idOrName) => {
  const cacheKey = `move_${idOrName}`;
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  try {
    const res = await fetch(`${BASE_URL}/move/${idOrName}`);
    if (!res.ok) throw new Error("Failed to fetch move details");
    const data = await res.json();

    const englishEffect = data.effect_entries.find((e) => e.language.name === "en");
    const englishFlavor = data.flavor_text_entries.find((f) => f.language.name === "en");

    const rawPokemonList = data.learned_by_pokemon || [];

    // Fetch details in batches of 10 for ALL pokémon in the list
    const formattedLearnedBy = await fetchInBatches(rawPokemonList, 10, async (pkmn) => {
      const id = pkmn.url.split("/").filter(Boolean).pop();
      try {
        const pkmnRes = await fetch(`${BASE_URL}/pokemon/${id}`);
        if (!pkmnRes.ok) throw new Error();
        const pkmnData = await pkmnRes.json();

        const officialArtwork = pkmnData.sprites?.other?.["official-artwork"]?.front_default;
        const defaultSprite = pkmnData.sprites?.front_default;

        return {
          id: pkmnData.id,
          name: pkmnData.name,
          types: pkmnData.types.map((t) => t.type.name),
          sprite: officialArtwork || defaultSprite || `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
        };
      } catch {
        return {
          id: Number(id),
          name: pkmn.name,
          types: [],
          sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
        };
      }
    });

    const result = {
      id: data.id,
      name: data.name,
      accuracy: data.accuracy ?? "—",
      power: data.power ?? "—",
      pp: data.pp ?? "—",
      priority: data.priority,
      damageClass: data.damage_class?.name || "status",
      type: data.type?.name || "normal",
      effect: englishEffect?.short_effect || englishFlavor?.flavor_text || "No summary available.",
      inDepthEffect: englishEffect?.effect || englishFlavor?.flavor_text || "No detailed description available.",
      learnedBy: formattedLearnedBy,
    };

    cache.set(cacheKey, result);
    return result;
  } catch (error) {
    console.error("getMoveDetails error:", error);
    throw error;
  }
};