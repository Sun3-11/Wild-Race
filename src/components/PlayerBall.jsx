import {
  forwardRef,
  useEffect,
  useMemo,
  useRef,
  useState,
  Suspense,
} from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
import { useGameStore } from "../stores/gameStore";
import { CharacterModel } from "./CharacterMode";

useGLTF.preload("/models/TimonwithAnimation.glb");
useGLTF.preload("/models/PumbaawithAnimation3.glb");

const PlayerBall = forwardRef(function PlayerBall(
  {
    start = [-2.5, 0.5, -140],
    speedMax = 18,
    accel = 30,
    friction = 4,
    trackWidth = 10,
    finishZ = 140,
    minZ = -140,
    onMovingChange,
  },
  ref
) {
  const selection = useGameStore((s) => s.selection);
  const phase = useGameStore((s) => s.phase);
  const finish = useGameStore((s) => s.finish);
  const boost = useGameStore((s) => s.boost + 2);
  const addPlayerScore = useGameStore((s) => s.addPlayerScore);

  const mobileInput = useGameStore((s) => s.mobileInput);
  const resetJump = useGameStore((s) => s.resetJump);

  const localRef = useRef();
  const playerRef = ref || localRef;

  const vel = useMemo(() => new THREE.Vector3(), []);
  const keys = useMemo(
    () => ({
      ArrowUp: false,
      ArrowDown: false,
      ArrowLeft: false,
      ArrowRight: false,
      w: false,
      s: false,
      a: false,
      d: false,
      " ": false,
    }),
    []
  );

  const jumpVel = useRef(0);
  const isJumping = useRef(false);
  const gravity = -25;
  const jumpStrength = 12;

  const movingRef = useRef(false);
  const [isMoving, setIsMoving] = useState(false);

  const timon = useGLTF("/models/TimonwithAnimation.glb");
  const pumbaa = useGLTF("/models/PumbaawithAnimation3.glb");
  const model = selection === "timon" ? timon : pumbaa;

  useEffect(() => {
    const down = (e) => (keys[e.key] = true);
    const up = (e) => (keys[e.key] = false);
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, [keys]);

  const checkObstacles = (pos, scene) => {
    const box = new THREE.Box3().setFromCenterAndSize(
      pos,
      new THREE.Vector3(0.0, 0.0, 0.0)
    );
    let collided = false;
    scene.traverse((obj) => {
      if (obj.name?.startsWith("obstacle-")) {
        const obb = new THREE.Box3().setFromObject(obj);
        if (obb.intersectsBox(box)) collided = true;
      }
    });
    return collided;
  };

  useFrame((state, dt) => {
    if (dt > 0.05) dt = 0.05;
    if (phase !== "playing") return;

    const forwardKey =
      keys.ArrowUp || keys.w ? 1 : keys.ArrowDown || keys.s ? -1 : 0;
    const sideKey =
      keys.ArrowLeft || keys.a ? -1 : keys.ArrowRight || keys.d ? 1 : 0;

    //  Mobile Input
    const forward = forwardKey || mobileInput.forward;
    const side = sideKey || mobileInput.side;

    vel.z += forward * (accel + boost * 2) * dt;
    vel.x = THREE.MathUtils.damp(
      vel.x,
      -side * (speedMax + boost) * 0.6,
      6,
      dt
    );

    vel.multiplyScalar(1 - Math.min(friction * dt, 0.98));
    vel.clampLength(0, speedMax + boost);

    const p = playerRef.current.position.clone().addScaledVector(vel, dt);

    const half = trackWidth / 2 - 0.6;
    p.x = THREE.MathUtils.clamp(p.x, -half, half);
    p.z = Math.max(p.z, minZ);

    // jump
    if ((keys[" "] || mobileInput.jump) && !isJumping.current) {
      jumpVel.current = jumpStrength;
      isJumping.current = true;
      resetJump();
    }

    if (isJumping.current) {
      jumpVel.current += gravity * dt;
      p.y += jumpVel.current * dt;

      if (p.y <= 0.5) {
        p.y = 0.5;
        isJumping.current = false;
        jumpVel.current = 0;
      }
    }

    const collided = checkObstacles(
      new THREE.Vector3(p.x, p.y, p.z),
      state.scene
    );
    //انهاء اللعبة عند الاصطدام
    if (collided && !isJumping.current) {
      finish("obstacle");
      return;
    } else {
      playerRef.current.position.copy(p);
    }
    //او ارتداد للخلف عند الاصطدام
    // if (collided && !isJumping.current) {
    //   vel.z = -vel.z * 5; // ارتداد بسيط للخلف
    // } else {
    //   playerRef.current.position.copy(p);
    // }

    // insects collection
    state.scene.traverse((o) => {
      if (o.parent?.name === "insects" && o.visible) {
        const insectPos = o.getWorldPosition(new THREE.Vector3());
        if (insectPos.distanceTo(playerRef.current.position) < 1.2) {
          o.visible = false;
          addPlayerScore(1);
        }
      }
    });

    const movingNow = vel.length() > 0.1;
    movingRef.current = movingNow;

    if (isMoving !== movingNow) {
      setIsMoving(movingNow);
      if (onMovingChange) onMovingChange(movingNow);
    }

    if (playerRef.current.position.z >= finishZ) {
      finish("player");
    }
  });

  const jumping = isJumping.current;

  return (
    <group ref={playerRef} position={start}>
      <Suspense fallback={null}>
        <CharacterModel
          key={selection}
          scene={model.scene}
          animations={model.animations}
          selection={selection}
          playing={movingRef.current}
          jumping={jumping}
        />
      </Suspense>
    </group>
  );
});

export default PlayerBall;
