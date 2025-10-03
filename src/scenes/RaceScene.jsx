import { useRef, useEffect } from "react";
import { useThree } from "@react-three/fiber";
import Track from "../components/Track";
import Obstacles from "../components/Obstacles";
import Insects from "../components/Insects";
import FinishLine from "../components/FinishLine";
import PlayerBall from "../components/PlayerBall";
import EnemyBall from "../components/EnemyBall";
import Timer from "../components/Timer";
import Camera from "../components/Camera";
import { useGameStore } from "../stores/gameStore";

export default function RaceScene() {
  const playerIsLeft = useGameStore((s) => s.selection) === "left";
  const playerRef = useRef();
  const phase = useGameStore((s) => s.phase);

  const { scene } = useThree();

  useEffect(() => {
    if (phase === "playing") {
      const insects = scene.getObjectByName("insects");
      if (insects?.userData?.api) insects.userData.api.reset();
    }
  }, [phase, scene]);

  return (
    <group>
      <Track />
      <Obstacles />
      <Insects />

      <FinishLine />

      {playerIsLeft ? (
        <>
          <PlayerBall ref={playerRef} start={[-2.5, 0.5, -140]} />
          <EnemyBall start={[2.5, 0.5, -140]} />
        </>
      ) : (
        <>
          <EnemyBall start={[-2.5, 0.5, -140]} />
          <PlayerBall ref={playerRef} start={[2.5, 0.5, -140]} />
        </>
      )}

      <Timer />
      <Camera playerRef={playerRef} />
    </group>
  );
}
