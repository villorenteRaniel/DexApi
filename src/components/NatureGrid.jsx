import React from "react";
import NatureCard from "./NatureCard";

export default function NatureGrid({ natures, onSelectNature }) {
  if (!natures || natures.length === 0) {
    return (
      <div className="p-12 text-center text-text-subtle font-medium">
        No natures found.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {natures.map((nature) => (
        <NatureCard
          key={nature.id}
          nature={nature}
          onClick={onSelectNature}
        />
      ))}
    </div>
  );
}