import React from "react";
import { TbPokeball } from "react-icons/tb";
import { navLinks } from "../data/navLinks";

export default function Sidebar() {
  return (
    <aside className="fixed top-0 left-0 h-screen w-16 lg:w-64 bg-accent hidden md:flex flex-col justify-between py-6 transition-all duration-300 z-50 shadow-md">
      
      {/* Top Section */}
      <div className="flex flex-col items-center lg:items-start w-full">
        
        {/* Brand Logo */}
        <div className="flex items-center justify-center lg:justify-start w-full px-6 pb-8">
          {/* Expanded Desktop View */}
          <h1 className="font-pixel text-xl font-extrabold tracking-wide hidden lg:flex items-center gap-2 text-white">
            <TbPokeball className="text-3xl text-white animate-spin-slow" />
            <span>Dex<span className="text-slate-900">API</span></span>
          </h1>

          {/* Collapsed Mobile/Tablet Icon */}
          <span className="font-display text-2xl font-extrabold text-white lg:hidden">
            <TbPokeball />
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col w-full gap-2">
          {navLinks.map((item) => {
            const Icon = item.icon; // Assign component reference to capitalized variable
            
            return (
              <a 
                key={item.id} 
                href={item.href} 
                className="group flex items-center justify-center lg:justify-start gap-4 w-full px-6 py-3.5 text-white/90 hover:text-accent hover:bg-white transition-all duration-200 font-medium"
              >
                <Icon className="text-2xl text-white group-hover:text-accent transition-colors shrink-0" />
                <span className="hidden lg:inline text-sm tracking-wide">{item.name}</span>
              </a>
            );
          })}
        </nav>
        
      </div>

    </aside>
  );
}