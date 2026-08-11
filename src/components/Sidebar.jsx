import React from "react";
import { TbPokeball } from "react-icons/tb";
import { navLinks } from "../data/navLinks";

export default function Sidebar() {
  return (
    <aside className="fixed top-0 left-0 h-screen w-16 lg:w-64 bg-sidebar-bg border-r border-border-main hidden md:flex flex-col justify-between transition-all duration-300 z-50 shadow-sm">
      
      {/* TOP CONTAINER */}
      <div className="flex flex-col items-center lg:items-start w-full">
        
        {/* BRAND LOGO HEADER (Matches Topbar Height h-16 & Red Color) */}
        <div className="h-16 w-full bg-sidebar-header flex items-center justify-center lg:justify-start px-4 lg:px-6 shrink-0">
          
          {/* Expanded Desktop View */}
          <h1 className="font-pixel text-lg font-bold tracking-wider hidden lg:flex items-center gap-2 text-white">
            <TbPokeball className="text-2xl text-white animate-spin-slow" />
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
              <a 
                key={item.id} 
                href={item.href} 
                className="group flex items-center justify-center lg:justify-start gap-3 w-full px-3 lg:px-4 py-3 rounded-xl text-sidebar-text hover:text-sidebar-hover-text hover:bg-sidebar-hover-bg transition-all duration-200 font-medium"
              >
                <Icon className="text-xl text-text-muted group-hover:text-accent transition-colors shrink-0" />
                <span className="hidden lg:inline text-sm font-medium tracking-wide">
                  {item.name}
                </span>
              </a>
            );
          })}
        </nav>

      </div>

    </aside>
  );
}