import { useMemo, useRef, useEffect, useState, Suspense } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useGameStore } from "../stores/gameStore";
import { useGLTF } from "@react-three/drei";
import { CharacterModel } from "./CharacterMode";

useGLTF.preload("/models/TimonwithAnimation.glb");
useGLTF.preload("/models/PumbaawithAnimation3.glb");

export default function EnemyBall({
  start = [2.5, 0.5, -140],
  baseSpeed = 6.6,
  zigzagAmp = 2.2,
  trackWidth = 10,
  finishZ = 140,
  onMovingChange,
}) {
  const selection = useGameStore((s) => s.selection);
  const finish = useGameStore((s) => s.finish);
  const phase = useGameStore((s) => s.phase);
  const addEnemyScore = useGameStore((s) => s.addEnemyScore);
  const difficulty = useGameStore((s) => s.difficulty);

  const enemySelection = selection === "timon" ? "pumbaa" : "timon";

  const ref = useRef();
  const dir = useMemo(() => new THREE.Vector3(0, 0, 1), []);
  const prevZ = useRef(start[2]);

  const [isMoving, setIsMoving] = useState(false);
  const [jumping, setJumping] = useState(false);

  const timon = useGLTF("/models/TimonwithAnimation.glb");
  const pumbaa = useGLTF("/models/PumbaawithAnimation3.glb");
  const model = enemySelection === "timon" ? timon : pumbaa;

  const settings = {
    easy: { speedFactor: 0.7, insectRange: 1.5, jumpDelay: 800 },
    medium: { speedFactor: 1.0, insectRange: 2.5, jumpDelay: 400 },
    hard: { speedFactor: 1.3, insectRange: 4.0, jumpDelay: 100 },
  };

  const cfg = settings[difficulty] || settings.medium;

  const avoidObstacles = (pos, scene) => {
    const lookAhead = 2.2;
    const test = pos.clone().addScaledVector(dir, lookAhead);
    let danger = false;
    scene.traverse((o) => {
      if (o.name?.startsWith("obstacle-")) {
        const b = new THREE.Box3().setFromObject(o);
        if (b.containsPoint(test)) danger = true;
      }
    });
    return danger;
  };

  const findNearbyInsects = (pos, scene) => {
    let target = null;
    let minDist = Infinity;
    scene.traverse((o) => {
      if (o.parent?.name === "insects" && o.visible) {
        const p = o.getWorldPosition(new THREE.Vector3());
        const d = pos.distanceTo(p);
        if (d < cfg.insectRange && d < minDist) {
          minDist = d;
          target = p;
        }
      }
    });
    return target;
  };

  useFrame((state, dt) => {
    if (phase !== "playing") return;
    if (dt > 0.05) dt = 0.05;

    const t = state.clock.elapsedTime;
    const insect = findNearbyInsects(ref.current.position, state.scene);

    let desiredX = insect ? insect.x : Math.sin(t * 0.6) * zigzagAmp;
    let x = THREE.MathUtils.damp(ref.current.position.x, desiredX, 4, dt);

    const danger = avoidObstacles(ref.current.position, state.scene);
    if (danger && !jumping) {
      setJumping(true);
      setTimeout(() => setJumping(false), cfg.jumpDelay);
    }

    const sideNudge = danger ? (Math.random() > 0.5 ? 1 : -1) * 3.0 : 0;
    const half = trackWidth / 2 - 0.6;
    const nx = THREE.MathUtils.clamp(x + sideNudge * dt, -half, half);

    const speed = baseSpeed * cfg.speedFactor * (danger ? 0.85 : 1.05);
    const jumpY = jumping ? Math.sin(t * 6) * 1.2 + 0.5 : 0.5;

    ref.current.position.set(nx, jumpY, ref.current.position.z + speed * dt);

    // insect collection
    if (insect && ref.current.position.distanceTo(insect) < 1.2) {
      state.scene.traverse((o) => {
        if (o.parent?.name === "insects") {
          const p = o.getWorldPosition(new THREE.Vector3());
          if (p.distanceTo(ref.current.position) < 1.2 && o.visible) {
            o.visible = false;
            addEnemyScore(1);
          }
        }
      });
    }

    if (ref.current.position.z >= finishZ) {
      finish("enemy");
    }

    const dz = ref.current.position.z - prevZ.current;
    prevZ.current = ref.current.position.z;
    const movingNow = Math.abs(dz) > 0.001;
    if (isMoving !== movingNow) {
      setIsMoving(movingNow);
    }
  });

  useEffect(() => {
    if (onMovingChange) onMovingChange(isMoving);
  }, [isMoving, onMovingChange]);

  return (
    <group ref={ref} position={start} castShadow>
      <Suspense fallback={null}>
        <CharacterModel
          key={enemySelection}
          scene={model.scene}
          animations={model.animations}
          selection={enemySelection}
          playing={isMoving}
        />
      </Suspense>
    </group>
  );
}
