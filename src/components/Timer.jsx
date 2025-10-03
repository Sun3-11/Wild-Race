import { useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useGameStore } from "../stores/gameStore";

export default function Timer() {
  const tick = useGameStore((s) => s.tick);
  const phase = useGameStore((s) => s.phase);

  useFrame(() => {
    if (phase === "playing") tick();
  });

  return null;
}
