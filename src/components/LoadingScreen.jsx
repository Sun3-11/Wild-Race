import { Html, useProgress } from "@react-three/drei";
import { useEffect, useState } from "react";
import { ZeroCurvatureEnding } from "three";

export default function LoadingScreen() {
  const { progress } = useProgress();
  const [displayProgress, setDisplayProgress] = useState(0);

  useEffect(() => {
    setDisplayProgress(progress);
  }, [progress]);

  return (
    <Html fullscreen>
      <div
        style={{
          position: "rlative",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          background: "linear-gradient(135deg, #0f0f0f, #1e1e2f)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Arial, sans-serif",
          color: "white",
          userSelect: "none",
        }}
      >
        <h1
          style={{
            fontSize: "2.5rem",
            marginBottom: "40px",
            letterSpacing: "2px",
            textTransform: "uppercase",
            color: "#ff6600ff",
            textShadow: "0 0 10px rgba(251, 255, 0, 0.7)",
          }}
        >
          Loading Game
        </h1>

        <div
          style={{
            width: "60%",
            height: "20px",
            background: "rgba(255,255,255,0.1)",
            borderRadius: "10px",
            overflow: "hidden",
            boxShadow: "0 0 10px rgba(0,0,0,0.5) inset",
          }}
        >
          <div
            style={{
              width: `${displayProgress}%`,
              height: "100%",
              background: "linear-gradient(90deg, #ffbb00ff, #e5ff00ff)",
              transition: "width 0.3s ease-out",
            }}
          />
        </div>

        <p
          style={{
            marginTop: "15px",
            fontSize: "18px",
            color: "#ddd",
            textShadow: "0 0 5px black",
          }}
        >
          {displayProgress.toFixed(0)} %
        </p>
      </div>
    </Html>
  );
}
