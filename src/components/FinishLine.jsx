export default function FinishLine({ z = 140, width = 10 }) {
  return (
    <group position={[0, 0.02, z]}>
      <mesh rotation-x={-Math.PI / 2}>
        <planeGeometry args={[width, 1]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
    </group>
  );
}
