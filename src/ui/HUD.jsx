import { useGameStore } from "../stores/gameStore";
import JoystickControl from "./JoystickControl";
import JumpButton from "./JumpButton";
import { useState, useEffect } from "react";

export default function HUD() {
  const phase = useGameStore((s) => s.phase);
  const elapsed = useGameStore((s) => s.elapsed);
  const totalInsects = useGameStore((s) => s.totalInsects);
  const difficulty = useGameStore((s) => s.difficulty);
  const scorePlayer = useGameStore((s) => s.scorePlayer);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const isPhone = /Mobi|Android|iPhone|iPad|iPod/i.test(
        navigator.userAgent
      );
      setIsMobile(isPhone);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (phase !== "playing") return null;

  const difficultyColors = {
    easy: "limegreen",
    medium: "gold",
    hard: "red",
  };

  return (
    <>
      <div className="hud">
        <div className="card">
          <span className="icon">⏱️</span>
          <span className="value">{elapsed.toFixed(1)}s</span>
        </div>
        <div className="card">
          <span className="icon">🪲</span>
          <span className="value">
            {scorePlayer} / {totalInsects}
          </span>
        </div>
        <div className="card">
          <span className="icon">🤖</span>
          <span
            className="value"
            style={{
              color: difficultyColors[difficulty] || "white",
              fontWeight: "bold",
            }}
          >
            {difficulty.toUpperCase()}
          </span>
        </div>
      </div>

      {isMobile && (
        <>
          <JoystickControl />
          <JumpButton />
        </>
      )}

      <style>{`
        .hud {
          position: absolute;
          top: 10px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 1rem;
          z-index: 100;
          flex-wrap: nowrap;
        }

        .card {
          background: rgba(0, 0, 0, 0.55);
          padding: 0.6rem 1rem;
          border-radius: 0.8rem;
          display: flex;
          align-items: center;
          gap: 0.4rem;
          color: white;
          font-size: 1rem;
          font-weight: bold;
          min-width: 85px;
          justify-content: center;
          box-shadow: 0 0 6px rgba(0,0,0,0.6);
          white-space: nowrap;
        }

        .icon {
          font-size: 1.2rem;
        }

        .value {
          font-size: 0.95rem;
        }

        @media (max-width: 768px) {
          .hud {
            top: 5px;
            gap: 0.4rem;
            left: 25%;
            display: grid;
          }

          .card {
            padding: 0.3rem 0.5rem;
            font-size: 0.7rem;
            min-width: auto;
            border-radius: 0.5rem;
          }

          .icon {
            font-size: 0.9rem;
          }

          .value {
            font-size: 0.75rem;
          }
        }
      `}</style>
    </>
  );
}
