import React, { useState, useEffect } from "react";
import { getMoveDetails } from "../../services/pokemonService";
import MoveInfoSection from "./MoveInfoSection";
import MovePokemonList from "./MovePokemonList";

export default function MoveDetailModal({ move, onClose }) {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!move) return;

    let isMounted = true;
    setLoading(true);

    getMoveDetails(move.id || move.name)
      .then((data) => {
        if (isMounted) setDetails(data);
      })
      .catch((err) => console.error(err))
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [move]);

  if (!move) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Container */}
      <div className="relative z-10 w-full max-w-5xl max-h-[90vh] bg-bg-surface border border-border-main rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-main bg-bg-muted/30">
          <div>
            <span className="text-xs font-bold text-text-subtle uppercase tracking-wider">
              Move Overview
            </span>
            <h2 className="text-2xl font-black text-text-main capitalize">
              {move.name.replaceAll("-", " ")}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-text-subtle hover:bg-bg-muted hover:text-text-main transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        {loading ? (
          <div className="p-12 text-center text-text-muted font-medium">
            Loading move stats and details...
          </div>
        ) : (
          <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-y-auto">
            <MoveInfoSection details={details} />
            <MovePokemonList pokemonList={details?.learnedBy} />
          </div>
        )}

      </div>
    </div>
  );
}