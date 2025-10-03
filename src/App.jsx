import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import RaceScene from "./scenes/RaceScene";
import Menu from "./ui/Menu";
import HUD from "./ui/HUD";
import "./App.css";
import GameOver from "./ui/GameOver";
import HelpOverlay from "./components/HelpOverlay";
import { Suspense } from "react";
import LoadingScreen from "./components/LoadingScreen";
import CountdownOverlay from "./components/CountdownOverlay";

export default function App() {
  return (
    <div className="app">
      <HelpOverlay />
      <Canvas
        className="webgl"
        shadows
        camera={{ fov: 75, position: [0, 6, -12], near: 0.1, far: 1000 }}
      >
        <color attach="background" args={["rgba(144, 164, 189, 1)"]} />
        <fog attach="fog" args={["rgba(144, 164, 189, 1)", 10, 90]} />
        <Suspense fallback={<LoadingScreen />}>
          <RaceScene />
        </Suspense>{" "}
      </Canvas>

      {/* UI 2D */}
      <Menu />
      <HUD />
      <GameOver />
      <CountdownOverlay />
    </div>
  );
}
