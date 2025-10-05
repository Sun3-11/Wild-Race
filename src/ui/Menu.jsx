import { useGameStore } from "../stores/gameStore";
import Button from "./Button";

export default function Menu() {
  const phase = useGameStore((s) => s.phase);
  const selection = useGameStore((s) => s.selection);
  const setSelection = useGameStore((s) => s.setSelection);
  const startCountdown = useGameStore((s) => s.startCountdown);
  const difficulty = useGameStore((s) => s.difficulty);
  const setDifficulty = useGameStore((s) => s.setDifficulty);

  if (phase !== "menu") return null;

  return (
    <div className="menu">
      <h1 className="title">🌲Wild Race🌲</h1>
      <p className="subtitle">Choose your character and difficulty</p>

      {/* CHARACTER */}
      <div className="cards">
        <div
          className={`card ${selection === "timon" ? "active" : ""}`}
          onClick={() => setSelection("timon")}
        >
          <img src="/Pic/R.png" alt="Timon" className="ball-img" />
          <h3>Timon</h3>
          <p>⚡ Fast and Stable</p>
        </div>

        <div
          className={`card ${selection === "pumbaa" ? "active" : ""}`}
          onClick={() => setSelection("pumbaa")}
        >
          <img src="/Pic/P.jpg" alt="Pumbaa" className="ball-img" />
          <h3>Pumbaa</h3>
          <p>💪 Strong and Mysterious </p>
        </div>
      </div>

      {/*  DIFFICULTY  */}
      <h3 className="difficulty-title">🎚️ Enemy Difficulty</h3>
      <div className="difficulty-row">
        <button
          onClick={() => setDifficulty("easy")}
          className={`diff-btn easy ${difficulty === "easy" ? "active" : ""}`}
        >
          🟢 Easy
        </button>
        <button
          onClick={() => setDifficulty("medium")}
          className={`diff-btn medium ${
            difficulty === "medium" ? "active" : ""
          }`}
        >
          🟡 Medium
        </button>
        <button
          onClick={() => setDifficulty("hard")}
          className={`diff-btn hard ${difficulty === "hard" ? "active" : ""}`}
        >
          🔴 Hard
        </button>
      </div>

      {/*   START RACE  */}
      <div className="row">
        {/* <button
          onClick={startCountdown}
          disabled={!selection}
          className={`start-btn ${!selection ? "disabled" : ""}`}
        >
          <span className="text">🚀 Start The Race</span>
          <span className="shine"></span>
          <span className="pulse"></span>
        </button> */}
        <button
          onClick={() => {
            if (!selection) setSelection("pumbaa");
            startCountdown();
          }}
          className="start-btn"
        >
          <span className="text">🚀 Start The Race</span>
          <span className="shine"></span>
          <span className="pulse"></span>
        </button>
      </div>
    </div>
  );
}
