import React, {useState} from "react";
import { VscSearch, VscSettings } from "react-icons/vsc";
import AbilityGrid from "../components/AbilityGrid";

export default function Ability(){
    const [searchQuery, setSearchQuery] = useState("");
    return(
        <section className="px-6 py-8 w-full">
            {/* Page Header */}
            <div className="flex flex-col gap-1 mb-8">
                <h1 className="text-3xl font-extrabold text-text-main font-display tracking-tight">
                    Ability
                </h1>
                <p className="text-text-subtle text-sm md:text-base">
                    Explore and search Pokémon abilities. View detailed short effects, game descriptions, and see which Pokémon possess each ability in battle.
                </p>
            </div>

            {/* Control Bar */}
            <div className="flex items-center">
                {/* Search Input & Filter Button */}
                <div className="flex items-center gap-2 flex-1 max-w-md">
                    <div className="relative w-full">
                        <VscSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted text-lg pointer-events-none" />
                        <input
                            type="text"
                            placeholder="Search abilities by name or ID..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-bg-muted/50 border border-border-main rounded-xl text-text-main placeholder:text-text-muted text-sm focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
                        />
                    </div>
            
                    <button 
                    title="Filter Settings"
                    className="p-2.5 bg-accent hover:bg-accent-hover text-white rounded-xl transition-colors shrink-0 shadow-xs cursor-pointer"
                    >
                    <VscSettings className="text-xl" />
                    </button>
                </div>           
            </div>

            <AbilityGrid searchQuery={searchQuery}/>
        </section>
    );
}