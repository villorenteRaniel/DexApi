import { HiOutlineHome } from "react-icons/hi2";
import { TbPokeball, TbBolt, TbSwords, TbDna } from "react-icons/tb";

export const navLinks = [
  { id: "home", name: "Home", icon: HiOutlineHome, href: "/" },
  { id: "pokedex", name: "Pokédex", icon: TbPokeball, href: "/pokedex" },
  { id: "ability", name: "Ability", icon: TbDna, href: "/ability" },
  { id: "move", name: "Move", icon: TbSwords, href: "/move" },
  { id: "type", name: "Type", icon: TbBolt, href: "/type" },
  { id: "nature", name: "Nature", icon: TbSwords, href: "/nature" },
];