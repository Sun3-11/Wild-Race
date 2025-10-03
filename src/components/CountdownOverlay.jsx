import { useEffect, useState } from "react";
import { useGameStore } from "../stores/gameStore";

export default function CountdownOverlay() {
  const phase = useGameStore((s) => s.phase);
  const startRace = useGameStore((s) => s.startRace);

  const [count, setCount] = useState(3);

  useEffect(() => {
    if (phase === "countdown") {
      setCount(3);
    }
  }, [phase]);

  useEffect(() => {
    if (phase !== "countdown") return;

    if (count === 0) {
      startRace();
    } else {
      const timer = setTimeout(() => setCount(count - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [count, phase]);

  if (phase !== "countdown") return null;

  return (
    <div className="countdown-overlay">
      <h1 className="countdown-text">{count === 0 ? "GO!" : count}</h1>
    </div>
  );
}
