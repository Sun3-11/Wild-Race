import { useGameStore } from "../stores/gameStore";
import { useEffect, useMemo } from "react";
import confetti from "canvas-confetti";

export default function GameOver() {
  const phase = useGameStore((s) => s.phase);
  const winner = useGameStore((s) => s.winner);
  const elapsed = useGameStore((s) => s.elapsed);
  const scorePlayer = useGameStore((s) => s.scorePlayer);

  const isWin = winner === "player";

  const winMessages = [
    "🎉!Awesome job ",
    "🚀!You’re unstoppable",
    "🏆!Champion energy",
    "🔥!Keep it up, legend",
    "👑!Victory is yours",
    "⭐!Epic performance",
  ];

  //Random message
  const randomMessage = useMemo(() => {
    if (isWin) {
      return winMessages[Math.floor(Math.random() * winMessages.length)];
    }
    return "";
  }, [isWin]);

  //  Confetti effect
  useEffect(() => {
    if (phase === "finished" && isWin) {
      const duration = 3 * 1000;
      const end = Date.now() + duration;

      (function frame() {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      })();
    }
  }, [phase, isWin]);

  if (phase !== "finished") return null;

  return (
    <div
      className={`gameover-screen ${isWin ? "win" : "lose"}`}
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.29)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
        fontFamily: "sans-serif",
      }}
    >
      {isWin ? (
        <div style={{ textAlign: "center", color: "gold" }}>
          <h1 style={{ fontSize: "3rem", marginBottom: "1rem" }}>
            🏆 !You Win 🏆
          </h1>

          {/*  Random message */}
          <p
            style={{
              fontSize: "1.5rem",
              marginBottom: "1rem",
              color: "#FFD700",
            }}
          >
            {randomMessage}
          </p>

          <p style={{ fontSize: "1.5rem" }}>
            Time⏱️: <b>{elapsed.toFixed(2)}s</b>
          </p>
          <p style={{ fontSize: "1.5rem", marginBottom: "1.5rem" }}>
            Insects collected🪲: <b>{scorePlayer}</b>
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: "0.8rem 2rem",
              fontSize: "1.3rem",
              borderRadius: "1rem",
              background: "linear-gradient(45deg,#FFD700,#FF8C00)",
              border: "none",
              color: "black",
              cursor: "pointer",
              fontWeight: "bold",
              boxShadow: "0 0 15px gold",
            }}
          >
            🔁 Play Again
          </button>
        </div>
      ) : (
        <div style={{ textAlign: "center", color: "white" }}>
          <h1
            style={{
              fontSize: "2.5rem",
              marginBottom: "1rem",
              color: "#e53935",
            }}
          >
            {winner === "obstacle"
              ? "!💥You lost by hitting an obstacle"
              : "!💀You Lost"}
          </h1>
          <p style={{ fontSize: "1.2rem" }}>
            Time⏱️: <b>{elapsed.toFixed(2)}s</b>
          </p>
          <p style={{ fontSize: "1.2rem", marginBottom: "1.5rem" }}>
            Insects collected🪲: <b>{scorePlayer}</b>
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: "0.8rem 2rem",
              fontSize: "1.2rem",
              borderRadius: "0.8rem",
              background: "#e53935",
              border: "none",
              color: "white",
              cursor: "pointer",
              fontWeight: "bold",
              boxShadow: "0 0 10px #e53935",
            }}
          >
            🔁 Try Again
          </button>
        </div>
      )}

      {/*  CSS Animation  */}
      <style>
        {`
          .lose {
            animation: shake 0.5s;
          }

          @keyframes shake {
            0% { transform: translate(0,0); }
            25% { transform: translate(-10px,0); }
            50% { transform: translate(10px,0); }
            75% { transform: translate(-10px,0); }
            100% { transform: translate(0,0); }
          }
        `}
      </style>
    </div>
  );
}
