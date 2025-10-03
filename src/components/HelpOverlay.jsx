import { useState, useEffect, useRef } from "react";
import { useGameStore } from "../stores/gameStore";

const HelpOverlay = () => {
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(null);
  const phase = useGameStore((s) => s.phase);
  const musicOn = useGameStore((s) => s.musicOn);

  useEffect(() => {
    audioRef.current = new Audio("/sounds/background.m4a");
    audioRef.current.loop = true;
    audioRef.current.volume = 0.5;

    return () => {
      audioRef.current.pause();
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!audioRef.current) return;

    if (phase === "playing" && musicOn && !isMuted) {
      audioRef.current
        .play()
        .catch((err) => console.log("blocked autoplay:", err));
    } else {
      audioRef.current.pause();
    }
  }, [phase, musicOn, isMuted]);

  const toggleMute = () => {
    if (!audioRef.current) return;

    if (isMuted) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
    setIsMuted(!isMuted);
  };

  return (
    <button
      onClick={toggleMute}
      style={{
        position: "absolute",
        top: "20px",
        right: "20px",
        color: "#000",
        border: "none",
        fontSize: "30px",
        cursor: "pointer",
        zIndex: 1000,
      }}
    >
      {isMuted ? "🔇" : "🔊"}
    </button>
  );
};

export default HelpOverlay;
