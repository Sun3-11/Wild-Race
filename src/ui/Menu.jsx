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
      {/* <div className="row">
        <Button onClick={startCountdown} disabled={!selection}>
          🚀 Start The Race
        </Button>
      </div>

      <style>{` */}
      {/*   START RACE  */}
      <div className="row">
        <button
          onClick={startCountdown}
          disabled={!selection}
          className={`start-btn ${!selection ? "disabled" : ""}`}
        >
          <span className="text">🚀 Start The Race</span>
          <span className="shine"></span>
          <span className="pulse"></span>
        </button>
      </div>

      <style>{`
  .start-btn {
    position: relative;
    padding: 1rem 2.5rem;
    border: none;
    border-radius: 2rem;
    font-size: 1.3rem;
    font-weight: bold;
    color: white;
    background: linear-gradient(90deg, #ff7b00, #ffb300, #ff7b00);
    cursor: pointer;
    overflow: hidden;
    transition: transform 0.15s ease, box-shadow 0.3s ease;
    text-transform: uppercase;
    box-shadow: 0 0 25px rgba(255, 166, 0, 0.4);
    animation: pulseGlow 2.5s infinite;
  }

  .start-btn:hover {
    transform: scale(1.07);
    box-shadow: 0 0 40px rgba(255, 180, 0, 0.8), 0 0 80px rgba(255, 100, 0, 0.5);
  }

  .start-btn:active {
    transform: scale(0.95);
    box-shadow: 0 0 20px rgba(255, 150, 0, 0.8);
  }

  // .start-btn.disabled {
  //   background: #777;
  //   cursor: not-allowed;
  //   box-shadow: none;
  //   animation: none;
  // }

  .start-btn .text {
    position: relative;
    z-index: 2;
  }

  /* 💥 حركة لمعان تمر على الزر */
  .start-btn .shine {
    position: absolute;
    top: 0;
    left: -100%;
    width: 50%;
    height: 100%;
    background: linear-gradient(
      120deg,
      transparent,
      rgba(255, 255, 255, 0.5),
      transparent
    );
    transform: skewX(-20deg);
    animation: shineAnim 2.5s infinite;
  }

  @keyframes shineAnim {
    0% { left: -100%; }
    50% { left: 120%; }
    100% { left: 120%; }
  }

  /* ✨ نبض نيون خفيف */
  .start-btn .pulse {
    position: absolute;
    inset: 0;
    border-radius: 2rem;
    box-shadow: 0 0 15px rgba(255, 150, 0, 0.7);
    animation: pulseWave 2s infinite ease-in-out;
    z-index: 1;
  }

  @keyframes pulseWave {
    0% { opacity: 0.7; transform: scale(1); }
    50% { opacity: 0.3; transform: scale(1.05); }
    100% { opacity: 0.7; transform: scale(1); }
  }

  @keyframes pulseGlow {
    0%, 100% {
      box-shadow: 0 0 25px rgba(255, 180, 0, 0.4), 0 0 40px rgba(255, 100, 0, 0.2);
    }
    50% {
      box-shadow: 0 0 45px rgba(255, 220, 0, 0.8), 0 0 80px rgba(255, 150, 0, 0.5);
    }
  }

  @media (max-width: 768px) {
    .start-btn {
      padding: 0.8rem 2rem;
      font-size: 1.1rem;
    }
  }
  .menu {
    text-align: center;
    padding: 1.5rem;
    color: white;
    font-family: "Comic Sans MS", sans-serif;
  }

  @media (orientation: landscape) {
    .menu {
      max-height: 100%;           
      overflow-y: auto;            
      overflow-x: hidden;          
      -webkit-overflow-scrolling: touch; 
      overscroll-behavior: contain; 
      bottom: 2rem;
      
    }

    .menu::-webkit-scrollbar {
      display: none;
    }
    .menu {
      -ms-overflow-style: none;  /* IE & Edge */
      scrollbar-width: none;     /* Firefox */
    }
  }

  .title {
    font-size: 2rem;
    margin-bottom: 0.5rem;
    text-shadow: 2px 2px 8px black;
  }

  .subtitle {
    font-size: 1rem;
    margin-bottom: 1.5rem;
    color: #ddd;
  }

  .cards,
  .difficulty-row {
    display: flex;
    gap: 1rem;
    justify-content: center;
    margin-bottom: 1.5rem;
    flex-wrap: nowrap; 
  }

  .card {
    background: rgba(0, 0, 0, 0.6);
    padding: 1rem;
    border-radius: 1rem;
    width: 150px;
    cursor: pointer;
    transition: transform 0.3s, box-shadow 0.3s;
  }

  .card img {
    width: 100px;
    height: 100px;
    object-fit: cover;
    margin-bottom: 0.5rem;
    border-radius: 50%;
    border: 3px solid #fff;
  }

  .card:hover {
    transform: scale(1.05);
    box-shadow: 0 0 20px #fff;
  }

  .card.active {
    border: 2px solid gold;
    box-shadow: 0 0 20px gold;
  }

  .difficulty-title {
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
  }

  .diff-btn {
    padding: 0.7rem 1.2rem;
    border: none;
    border-radius: 0.8rem;
    font-size: 1rem;
    font-weight: bold;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
    min-width: 100px;
  }

  .diff-btn.easy {
    background: #2ecc71;
    color: white;
  }
  .diff-btn.medium {
    background: #f1c40f;
    color: black;
  }
  .diff-btn.hard {
    background: #e74c3c;
    color: white;
  }

  .diff-btn.active {
    border: 3px solid white;
    box-shadow: 0 0 15px white;
  }

  @media (max-width: 768px) {
    .title {
      font-size: 1.5rem;
    }

    .subtitle {
      font-size: 0.9rem;
    }

    .card {
      width: 110px; 
      padding: 0.7rem;
    }

    .card img {
      width: 70px;
      height: 70px;
    }

    .diff-btn {
      font-size: 0.85rem;
      padding: 0.5rem 0.8rem;
      min-width: 80px;
    }

    .row button {
      font-size: 1rem;
      padding: 0.8rem 1.2rem;
    }
  }
`}</style>
    </div>
  );
}
