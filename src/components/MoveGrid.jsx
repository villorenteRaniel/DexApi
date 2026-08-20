import React from "react";
import MoveCard from "./MoveCard";

export default function MoveGrid({ moves, onSelectMove }) {
  if (!moves || moves.length === 0) {
    return (
      <div className="p-12 text-center text-text-subtle font-medium">
        No moves found.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {moves.map((move) => (
        <MoveCard
          key={move.id}
          move={move}
          onClick={onSelectMove}
        />
      ))}
    </div>
  );
}