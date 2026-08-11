import React from "react";
import { TbPokeball } from "react-icons/tb";
import { navLinks } from "../data/navLinks";
import pokeball from "../assets/icons/pokeball.svg"
import { NavLink } from 'react-router-dom';

export default function Sidebar() {
  return (
    <aside className="fixed top-0 left-0 h-screen w-16 lg:w-64 bg-sidebar-bg  hidden md:flex flex-col justify-between transition-all duration-300 z-50">
      
      {/* TOP CONTAINER */}
      <div className="flex flex-col items-center lg:items-start w-full">
        
        {/* BRAND LOGO HEADER (Matches Topbar Height h-16 & Red Color) */}
        <div className="h-16 w-full bg-sidebar-header flex items-center justify-center px-4 shrink-0">
          
          {/* Expanded Desktop View */}
          <h1 className="font-pixel text-lg font-bold tracking-wider hidden lg:flex items-center gap-2 text-white">
            <img src={pokeball} className="w-8 h-8" alt="" />
            <span>Dex<span className="text-slate-900">API</span></span>
          </h1>

          {/* Collapsed View */}
          <span className="text-2xl font-bold text-white lg:hidden">
            <TbPokeball />
          </span>
        </div>

        {/* NAVIGATION LINKS */}
        <nav className="flex flex-col w-full gap-1 p-2 lg:p-3">
          {navLinks.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.id}
                to={item.href}
                className={({ isActive }) =>
                  `group flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all ${
                    isActive
                      ? "bg-accent-subtle text-accent font-semibold"
                      : "text-sidebar-text hover:bg-sidebar-hover-bg hover:text-sidebar-hover-text"
                  }`
                }
              >
                <Icon className="text-xl shrink-0" />
                <span className="hidden lg:inline text-sm">{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

      </div>

    </aside>
  );
}