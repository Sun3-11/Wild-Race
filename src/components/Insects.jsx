import { useMemo, useRef } from "react";
import { useGameStore } from "../stores/gameStore";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function Insects({ count = 12, length = 300, width = 10 }) {
  const group = useRef();
  const addScore = useGameStore((s) => s.addScore);
  const addBoost = useGameStore((s) => s.addBoost);

  const items = useMemo(() => {
    return new Array(count).fill(0).map((_, i) => {
      const z = -length / 2 + (i + 0.5) * (length / count);
      const x = (i % 2 === 0 ? -1 : 1) * (width * 0.2);

      const y = 0.5 + Math.random() * (2.5 - 0.5);

      return { id: i, pos: [x, y, z] };
    });
  }, [count, length, width]);

  useFrame((state, delta) => {
    if (!group.current) return;
    group.current.children.forEach((m, i) => {
      const t = state.clock.elapsedTime + i;

      m.position.y = m.position.y + Math.sin(t * 2) * 0.01;

      m.rotation.y += delta * 2;
    });
  });

  const api = {
    collectNear: (worldPos, radius = 1) => {
      if (!group.current) return;
      group.current.children.forEach((m) => {
        if (!m.visible) return;
        const p = m.getWorldPosition(new THREE.Vector3());
        const d = p.distanceTo(worldPos);
        if (d <= radius) {
          m.visible = false;
          addScore(1);
          addBoost(2, 5000);
        }
      });
    },
    reset: () => {
      if (!group.current) return;
      group.current.children.forEach((m) => {
        m.visible = true;
      });
    },
  };

  if (group.current) group.current.userData.api = api;

  return (
    <group ref={group} name="insects">
      {items.map(({ id, pos }) => (
        <mesh key={id} position={pos} castShadow>
          <sphereGeometry args={[0.35, 16, 16]} />
          <meshStandardMaterial
            color="#8bc34a"
            emissive="#ffee58"
            emissiveIntensity={0.5}
          />
        </mesh>
      ))}
    </group>
  );
}
