export const TYPES = [
  "normal", "fire", "water", "grass", "electric", "ice",
  "fighting", "poison", "ground", "flying", "psychic", "bug",
  "rock", "ghost", "dragon", "dark", "steel", "fairy"
];

// Defensive multipliers for a SINGLE type
// Format: [type]: { attackerType: multiplier }
export const TYPE_CHART = {
  normal: { fighting: 2, ghost: 0 },
  fire: { water: 2, ground: 2, rock: 2, fire: 0.5, grass: 0.5, ice: 0.5, bug: 0.5, steel: 0.5, fairy: 0.5 },
  water: { grass: 2, electric: 2, fire: 0.5, water: 0.5, ice: 0.5, steel: 0.5 },
  grass: { fire: 2, ice: 2, poison: 2, flying: 2, bug: 2, water: 0.5, grass: 0.5, electric: 0.5, ground: 0.5 },
  electric: { ground: 2, electric: 0.5, flying: 0.5, steel: 0.5 },
  ice: { fire: 2, fighting: 2, rock: 2, steel: 2, ice: 0.5 },
  fighting: { flying: 2, psychic: 2, fairy: 2, bug: 0.5, rock: 0.5, dark: 0.5 },
  poison: { ground: 2, psychic: 2, grass: 0.5, fighting: 0.5, poison: 0.5, bug: 0.5, fairy: 0.5 },
  ground: { water: 2, grass: 2, ice: 2, electric: 0, poison: 0.5, rock: 0.5 },
  flying: { electric: 2, ice: 2, rock: 2, ground: 0, grass: 0.5, fighting: 0.5, bug: 0.5 },
  psychic: { bug: 2, ghost: 2, dark: 2, fighting: 0.5, psychic: 0.5 },
  bug: { fire: 2, flying: 2, rock: 2, grass: 0.5, fighting: 0.5, ground: 0.5 },
  rock: { water: 2, grass: 2, fighting: 2, ground: 2, steel: 2, normal: 0.5, fire: 0.5, poison: 0.5, flying: 0.5 },
  ghost: { ghost: 2, dark: 2, normal: 0, fighting: 0, poison: 0.5, bug: 0.5 },
  dragon: { ice: 2, dragon: 2, fairy: 2, fire: 0.5, water: 0.5, grass: 0.5, electric: 0.5 },
  dark: { fighting: 2, bug: 2, fairy: 2, psychic: 0, ghost: 0.5, dark: 0.5 },
  steel: { fire: 2, fighting: 2, ground: 2, poison: 0, normal: 0.5, grass: 0.5, ice: 0.5, flying: 0.5, psychic: 0.5, bug: 0.5, rock: 0.5, dragon: 0.5, steel: 0.5, fairy: 0.5 },
  fairy: { poison: 2, steel: 2, dragon: 0, fighting: 0.5, bug: 0.5, dark: 0.5 },
};

/**
 * Calculates dual-type defensive multipliers
 * @param {string} type1 
 * @param {string|null} type2 
 * @returns {Object} { "4x": [], "2x": [], "0.5x": [], "0.25x": [], "0x": [] }
 */
export const calculateDefensiveMatchups = (type1, type2 = null) => {
  const multipliers = {};

  TYPES.forEach((attacker) => {
    const mult1 = TYPE_CHART[type1]?.[attacker] ?? 1;
    const mult2 = type2 && type2 !== type1 ? (TYPE_CHART[type2]?.[attacker] ?? 1) : 1;
    multipliers[attacker] = mult1 * mult2;
  });

  const grouped = {
    quadWeak: [],    // 4x
    doubleWeak: [],  // 2x
    doubleResist: [],// 0.5x
    quadResist: [],  // 0.25x
    immune: [],      // 0x
  };

  Object.entries(multipliers).forEach(([type, mult]) => {
    if (mult === 4) grouped.quadWeak.push(type);
    else if (mult === 2) grouped.doubleWeak.push(type);
    else if (mult === 0.5) grouped.doubleResist.push(type);
    else if (mult === 0.25) grouped.quadResist.push(type);
    else if (mult === 0) grouped.immune.push(type);
  });

  return grouped;
};