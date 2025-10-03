import { useEffect, useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function Camera({
  playerRef,
  offset = new THREE.Vector3(0, 5, -8),
}) {
  const { camera } = useThree();
  const smooth = useRef(new THREE.Vector3());

  useEffect(() => {
    camera.position.set(0, 6, -12);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  useFrame((_, dt) => {
    if (!playerRef?.current) return;
    const targetPos = playerRef.current.position.clone().add(offset);
    smooth.current.lerp(targetPos, 1 - Math.pow(0.0001, dt));
    camera.position.copy(smooth.current);
    camera.lookAt(playerRef.current.position);
  });

  return null;
}
