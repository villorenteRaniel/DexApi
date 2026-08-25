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

/* Fetch all natures */
export const getAllNatures = async () => {
  const cacheKey = "all_natures";
  if (cache.has(cacheKey)) return cache.get(cacheKey);

  try {
    const res = await fetch(`${BASE_URL}/nature?limit=100`);
    if (!res.ok) throw new Error("Failed to fetch natures");
    const data = await res.json();

    // Natures are lightweight (only 25 total), so fetch details directly
    const details = await Promise.all(
      data.results.map(async (n) => {
        const nRes = await fetch(n.url);
        const nData = await nRes.json();

        return {
          id: nData.id,
          name: nData.name,
          increasedStat: nData.increased_stat?.name || null,
          decreasedStat: nData.decreased_stat?.name || null,
          likesFlavor: nData.likes_flavor?.name || null,
          hatesFlavor: nData.hates_flavor?.name || null,
        };
      })
    );

    const sorted = details.sort((a, b) => a.name.localeCompare(b.name));
    cache.set(cacheKey, sorted);
    return sorted;
  } catch (error) {
    console.error("getAllNatures error:", error);
    throw error;
  }
};

/**
 * Helper to recursively parse PokeAPI's evolution chain structure
 */
const parseEvolutionChain = async (chainNode) => {
  const chain = [];

  let current = chainNode;
  while (current) {
    const speciesName = current.species.name;
    
    // Extract Pokémon ID from species URL (e.g., https://pokeapi.co/api/v2/pokemon-species/1/ -> "1")
    const urlParts = current.species.url.split("/").filter(Boolean);
    const speciesId = urlParts[urlParts.length - 1];

    // Grab evolution details (if available for stage 2/3)
    const evoDetails = current.evolution_details?.[0];
    const minLevel = evoDetails?.min_level || null;
    const trigger = evoDetails?.trigger?.name || null;
    const item = evoDetails?.item?.name || null;

    chain.push({
      id: Number(speciesId),
      name: speciesName,
      minLevel,
      trigger,
      item,
      // Official artwork URL generated directly using ID
      sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${speciesId}.png`,
    });

    // Move down the primary evolution branch
    current = current.evolves_to?.[0];
  }

  return chain;
};

/**
 * Fetches full details for a single Pokémon by name or ID
 */
export const getPokemonDetails = async (nameOrId) => {
  try {
    // 1. Fetch primary Pokémon data
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${String(nameOrId).toLowerCase()}`);
    if (!res.ok) throw new Error("Failed to fetch Pokémon details");
    const data = await res.json();

    // 2. Fetch Species data (for evolution chain URL, gender rate, egg groups, flavor text)
    const speciesRes = await fetch(data.species.url);
    const speciesData = await speciesRes.json();

    // 3. Fetch & Parse Evolution Chain
    let evolutionChain = [];
    if (speciesData.evolution_chain?.url) {
      try {
        const evoRes = await fetch(speciesData.evolution_chain.url);
        const evoData = await evoRes.json();
        evolutionChain = await parseEvolutionChain(evoData.chain);
      } catch (evoErr) {
        console.error("Failed to load evolution chain:", evoErr);
      }
    }

    // 4. Normalize Base Stats
    const stats = data.stats.reduce((acc, curr) => {
      acc[curr.stat.name] = curr.base_stat;
      return acc;
    }, {});

    // Calculate Total Base Stat (BST)
    const bst = data.stats.reduce((total, curr) => total + curr.base_stat, 0);

    // 5. Normalize Abilities
    const abilities = data.abilities.map((a) => ({
      name: a.ability.name,
      isHidden: a.is_hidden,
      slot: a.slot,
    }));

    // 6. Categorize Moves by Learn Method
    const moves = {
      levelUp: [],
      machine: [],
      egg: [],
      tutor: [],
    };

    data.moves.forEach((m) => {
      // Grab latest version group details
      const latestDetail = m.version_group_details[m.version_group_details.length - 1];
      if (!latestDetail) return;

      const moveObj = {
        name: m.move.name,
        levelLearned: latestDetail.level_learned_at,
        method: latestDetail.move_learn_method.name,
      };

      if (moveObj.method === "level-up") moves.levelUp.push(moveObj);
      else if (moveObj.method === "machine") moves.machine.push(moveObj);
      else if (moveObj.method === "egg") moves.egg.push(moveObj);
      else if (moveObj.method === "tutor") moves.tutor.push(moveObj);
    });

    // Sort level-up moves by level
    moves.levelUp.sort((a, b) => a.levelLearned - b.levelLearned);

    // 7. Return structured data
    return {
      id: data.id,
      name: data.name,
      types: data.types.map((t) => t.type.name),
      height: data.height / 10, // Convert to meters
      weight: data.weight / 10, // Convert to kg
      sprites: {
        normal: data.sprites.other["official-artwork"]?.front_default || data.sprites.front_default,
        shiny: data.sprites.other["official-artwork"]?.front_shiny || data.sprites.front_shiny,
        animated: data.sprites.versions?.["generation-v"]?.["black-white"]?.animated?.front_default,
      },
      stats,
      bst,
      abilities,
      moves,
      evolutionChain,
      // Species / Breeding / Extra Info
      species: {
        eggGroups: speciesData.egg_groups.map((e) => e.name),
        genderRate: speciesData.gender_rate, // -1: genderless, otherwise 0-8 (eighths female)
        hatchCounter: speciesData.hatch_counter,
        captureRate: speciesData.capture_rate,
        evolutionChainUrl: speciesData.evolution_chain?.url,
      },
    };
  } catch (err) {
    console.error("Error in getPokemonDetails:", err);
    throw err;
  }
};