import { useGLTF } from "@react-three/drei";

export default function Track({
  length = 300,
  segmentLength = 500,
  modelPath = "/models/road.glb",
}) {
  const { scene } = useGLTF(modelPath);
  const repeats = Math.ceil(length / segmentLength);

  return (
    <group>
      {Array.from({ length: repeats }).map((_, i) => (
        <primitive
          key={i}
          object={scene.clone()}
          scale={[0.7, 0.5, 0.5]}
          position={[0, 0, -length / 2 + i * segmentLength]}
        />
      ))}

      <ambientLight intensity={0.6} />
      <directionalLight
        position={[15, 30, 10]}
        intensity={1.2}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
    </group>
  );
}
