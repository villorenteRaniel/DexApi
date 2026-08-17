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



export const getAllAbilitiesAlphabetical = async () => {
  try {
    // 1. Fetch the base list (~300 abilities)
    const res = await fetch(`${BASE_URL}/ability?limit=400&offset=0`);
    if (!res.ok) throw new Error("Failed to fetch abilities");
    const data = await res.json();

    const formatGeneration = (genName) => {
      if (!genName) return "Unknown";
      const parts = genName.split("-");
      if (parts.length < 2) return genName;
      return `Gen ${parts[1].toUpperCase()}`;
    };

    // 2. Fetch full details for each ability to get its generation data
    const detailedResults = await Promise.all(
      data.results.map(async (item) => {
        const detailRes = await fetch(item.url);
        const raw = await detailRes.json();

        return {
          id: raw.id,
          name: raw.name,
          generation: formatGeneration(raw.generation?.name),
          url: item.url,
        };
      })
    );

    // 3. Sort globally A-Z
    return detailedResults.sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    console.error("getAllAbilitiesAlphabetical error:", error);
    throw error;
  }
};

// src/services/pokemonService.js

export const getAbilityDetail = async (idOrName) => {
  const res = await fetch(`https://pokeapi.co/api/v2/ability/${idOrName}`);
  const raw = await res.json();

  const englishEffect = raw.effect_entries?.find((e) => e.language.name === "en");
  const englishFlavorText = raw.flavor_text_entries?.find((f) => f.language.name === "en");

  // Separate normal vs hidden ability holders
  const normalPokemon = [];
  const hiddenPokemon = [];

  raw.pokemon.forEach((p) => {
    const pData = {
      name: p.pokemon.name,
      url: p.pokemon.url, // Contains ID to fetch sprites if needed
    };

    if (p.is_hidden) {
      hiddenPokemon.push(pData);
    } else {
      normalPokemon.push(pData);
    }
  });

  return {
    id: raw.id,
    name: raw.name,
    generation: raw.generation.name,
    effect: englishEffect?.short_effect || "No description available.",
    flavorText: englishFlavorText?.flavor_text || "",
    pokemonLists: {
      normal: normalPokemon,
      hidden: hiddenPokemon,
    },
  };
};

/**
 * Fetches full ability details including descriptions and associated Pokémon.
 */
export const getAbilityDetails = async (idOrName) => {
  try {
    const res = await fetch(`${BASE_URL}/ability/${idOrName}`);
    if (!res.ok) throw new Error("Failed to fetch ability details");
    const data = await res.json();

    // 1. Extract English effect entries
    const englishEffect = data.effect_entries.find((e) => e.language.name === "en");
    const englishFlavor = data.flavor_text_entries.find((f) => f.language.name === "en");

    const effectText = englishEffect?.short_effect || englishFlavor?.flavor_text || "No summary available.";
    const inDepthEffectText = englishEffect?.effect || englishFlavor?.flavor_text || "No detailed description available.";

    // 2. Fetch details for all associated Pokémon in parallel
    const pokemonPromises = data.pokemon.map(async (p) => {
      const detailRes = await fetch(p.pokemon.url);
      if (!detailRes.ok) return null;
      const raw = await detailRes.json();

      return {
        is_hidden: p.is_hidden,
        pokemon: {
          id: raw.id,
          name: raw.name,
          sprite: raw.sprites.other["official-artwork"].front_default || raw.sprites.front_default,
          types: raw.types.map((t) => t.type.name),
        },
      };
    });

    const resolvedPokemon = (await Promise.all(pokemonPromises)).filter(Boolean);

    return {
      id: data.id,
      name: data.name,
      generation: data.generation.name.replace("generation-", "Gen ").toUpperCase(),
      effect: effectText,
      inDepthEffect: inDepthEffectText,
      normalPokemon: resolvedPokemon.filter((p) => !p.is_hidden).map((p) => p.pokemon),
      hiddenPokemon: resolvedPokemon.filter((p) => p.is_hidden).map((p) => p.pokemon),
    };
  } catch (error) {
    console.error("getAbilityDetails error:", error);
    throw error;
  }
};

// Placeholders for future pages/features:
// export const getPokemonByIdOrName = async (idOrName) => { ... }
// export const  = async () => { ... }
// export const getTypeMatchups = async () => { ... }