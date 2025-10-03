import React from "react";
import { useGameStore } from "../stores/gameStore";

export default function JumpButton() {
  const jump = useGameStore((s) => s.jump);

  return (
    <button
      onTouchStart={jump}
      style={{
        position: "absolute",
        right: "50px",
        bottom: "170px",
        width: "90px",
        height: "90px",
        borderRadius: "50%",
        background: "rgba(255,255,255,0.7)",
        border: "2px solid black",
        fontSize: "20px",
        fontWeight: "bold",
        zIndex: 10,
      }}
    >
      Jump
    </button>
  );
}
