import { HiOutlineHome } from "react-icons/hi2";
import { TbPokeball, TbBolt, TbSwords, TbDna } from "react-icons/tb";

export const navLinks = [
  {
    id: "home",
    name: "Home",
    icon: HiOutlineHome,
    href: "/",
  },
  {
    id: "pokedex",
    name: "Pokédex",
    icon: TbPokeball,
    href: "/pokedex",
  },
  {
    id: "ability",
    name: "Ability",
    icon: TbDna, // DNA or Zap icon works great for innate traits/abilities
    href: "/ability",
  },
  {
    id: "type",
    name: "Type",
    icon: TbBolt, // Elemental bolt for Type matchups
    href: "/type",
  },
  {
    id: "nature",
    name: "Nature",
    icon: TbSwords, // Swords for stat modifiers / battle natures
    href: "/nature",
  },
];