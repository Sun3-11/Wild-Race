import { useMemo, useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function Obstacles({
  rockCount = 10,
  branchCount = 6,
  length = 300,
  width = 10,
  seed = 99,
  showCollisionBoxes = true,
}) {
  const groupRocks = useRef();
  const groupBranches = useRef();

  const rng = (n) => {
    let x = Math.sin(n * 9301 + seed * 49297) * 233280;
    return x - Math.floor(x);
  };

  // Rocks data
  const rocks = useMemo(() => {
    return new Array(rockCount).fill(0).map((_, i) => {
      const z = -length / 2 + (i + 1) * (length / (rockCount + 1));
      const x = (rng(i + 1) * 2 - 1) * (width / 2 - 1.5);
      const s = 1 + rng(i + 2) * 1.5;

      return {
        id: i,
        baseX: x,
        pos: [x, s / 2, z],
        size: s,
        speed: 0.5 + rng(i + 3) * 1.5,
        amplitude: 1 + rng(i + 4) * 2,
        phase: rng(i + 5) * Math.PI * 2,
        rotX: rng(i + 6) * 0.01 + 0.005,
        rotY: rng(i + 4) * 0.01 + 0.005,
      };
    });
  }, [rockCount, length, width, seed]);

  // Branches data
  const branches = useMemo(() => {
    return new Array(branchCount).fill(0).map((_, i) => {
      const z = -length / 2 + (i + 1) * (length / (branchCount + 1));
      const y = 1 + rng(i + 12) * 1.5;
      const w = 5 + rng(i + 21) * 5;
      const r = 0.25 + rng(i + 22) * 0.2;

      const modes = ["static", "updown", "swing"];
      const mode = modes[Math.floor(rng(i + 23) * modes.length)];

      return {
        id: i,
        baseX: 0,
        baseY: y,
        pos: [0, y, z],
        width: w,
        radius: r,
        speed: 0.8 + rng(i + 25) * 1.5,
        amplitude: 0.5 + rng(i + 26) * 1.5,
        phase: rng(i + 27) * Math.PI * 2,
        mode,
      };
    });
  }, [branchCount, length, seed]);

  // Animation loop
  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // Rocks Animation
    if (groupRocks.current) {
      groupRocks.current.children.forEach((mesh, i) => {
        const { baseX, speed, amplitude, phase, rotY, rotX } = rocks[i];
        mesh.position.x = baseX + Math.sin(t * speed + phase) * amplitude * 0.8;
        mesh.rotation.x += rotY;
        mesh.rotation.x += rotX;
      });
    }

    // Branches Animation
    if (groupBranches.current) {
      groupBranches.current.children.forEach((mesh, i) => {
        const { baseX, baseY, speed, amplitude, phase, mode } = branches[i];
        if (mode === "static") {
          mesh.position.set(baseX, baseY, mesh.position.z);
        } else if (mode === "updown") {
          mesh.position.set(
            baseX,
            baseY + Math.sin(t * speed + phase) * amplitude,
            mesh.position.z
          );
        } else if (mode === "swing") {
          mesh.rotation.z = Math.sin(t * speed + phase) * 0.4;
          mesh.position.set(baseX, baseY, mesh.position.z);
        }
      });
    }
  });

  // RockGeometry
  const createRockGeometry = (size) => {
    const geo = new THREE.DodecahedronGeometry(size, 1);
    const pos = geo.attributes.position;
    const vertex = new THREE.Vector3();

    for (let i = 0; i < pos.count; i++) {
      vertex.fromBufferAttribute(pos, i);
      const noise = (Math.sin(vertex.x * 2) + Math.cos(vertex.y * 2)) * 0.3;
      vertex.addScaledVector(vertex.clone().normalize(), noise);
      pos.setXYZ(i, vertex.x, vertex.y, vertex.z);
    }

    geo.computeVertexNormals();
    return geo;
  };

  // wireframes
  // const addCollisionBox = (mesh, color = 0xff0000) => {
  //   const box = new THREE.Box3().setFromObject(mesh);
  //   const size = new THREE.Vector3();
  //   const center = new THREE.Vector3();
  //   box.getSize(size);
  //   box.getCenter(center);

  //   const boxMesh = new THREE.Mesh(
  //     new THREE.BoxGeometry(size.x, size.y, size.z),
  //     new THREE.MeshBasicMaterial({
  //       color,
  //       wireframe: true,
  //       transparent: true,
  //       opacity: 0.4,
  //     })
  //   );

  //   boxMesh.position.copy(center);
  //   mesh.add(boxMesh);
  // };

  // //boxes
  // useEffect(() => {
  //   if (!showCollisionBoxes) return;

  //   groupRocks.current?.children.forEach((rockGroup) => {
  //     const mesh = rockGroup.children[0];
  //     addCollisionBox(mesh, 0xff0000);
  //   });

  //   groupBranches.current?.children.forEach((branchGroup) => {
  //     const mesh = branchGroup.children[0];
  //     addCollisionBox(mesh, 0x00ff00);
  //   });
  // }, [showCollisionBoxes]);
  // Glow
  const GlowRock = ({ scale = 3.0, color = "red", intensity = 0.16 }) => (
    <mesh scale={scale}>
      <sphereGeometry args={[1, 16, 16]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={intensity}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
  const GlowBranch = ({ scale = 1.5, color = "red", intensity = 0.3 }) => (
    <mesh scale={scale}>
      <boxGeometry args={[10, 1, 1]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={intensity}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
  return (
    <group>
      {/* Rocks */}
      <group ref={groupRocks}>
        {rocks.map(({ id, pos, size }) => (
          <group
            key={`rock-${id}`}
            name={`obstacle-rock-${id}`}
            position={pos}
            scale={[size, size, size]}
          >
            <mesh geometry={createRockGeometry(1)} castShadow receiveShadow>
              <meshStandardMaterial
                color={["#4e342e", "#6d4c41", "#3e2723"][id % 3]}
                roughness={0.9}
                metalness={0.1}
              />
            </mesh>
            {/*  Glow Rocks */}
            {/* <GlowRock scale={1.0} color="red" intensity={0.16} /> */}
          </group>
        ))}
      </group>

      {/*Branche */}
      <group ref={groupBranches}>
        {branches.map(({ id, pos, width, radius }) => (
          <group
            key={`branch-${id}`}
            name={`obstacle-branch-${id}`}
            position={pos}
          >
            <mesh castShadow receiveShadow>
              <boxGeometry args={[width, radius, 0.5]} />
              <meshStandardMaterial
                color={["#2e7d32", "#1b5e20", "#33691e"][id % 3]}
                roughness={0.8}
                metalness={0.05}
              />
              {/*  Glow Branch */}
              {/* <GlowBranch scale={1.0} color="red" intensity={0.16} /> */}
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}
