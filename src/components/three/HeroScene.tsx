"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Component, useMemo, useRef } from "react";
import type { ReactNode } from "react";
import * as THREE from "three";

type SceneBoundaryProps = {
  children: ReactNode;
  onFailure: () => void;
};

class SceneBoundary extends Component<SceneBoundaryProps, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    this.props.onFailure();
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

function Dust() {
  const points = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const values = new Float32Array(90 * 3);
    for (let index = 0; index < 90; index += 1) {
      const angle = index * 2.39996;
      const radius = 1.8 + (index % 13) * 0.12;
      values[index * 3] = Math.cos(angle) * radius;
      values[index * 3 + 1] = ((index % 17) - 8) * 0.24;
      values[index * 3 + 2] = Math.sin(angle) * radius - 0.8;
    }
    return values;
  }, []);

  useFrame((state, delta) => {
    if (!points.current) return;
    points.current.rotation.y += delta * 0.025;
    points.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.08) * 0.08;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#8be9fd"
        size={0.026}
        transparent
        opacity={0.55}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

function Core() {
  const group = useRef<THREE.Group>(null);
  const ring = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (!group.current) return;

    const targetX = state.pointer.y * 0.12;
    const targetY = state.pointer.x * 0.2;
    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      targetX,
      1 - Math.exp(-delta * 3),
    );
    group.current.rotation.y = THREE.MathUtils.lerp(
      group.current.rotation.y,
      targetY,
      1 - Math.exp(-delta * 3),
    );
    group.current.position.y = Math.sin(state.clock.elapsedTime * 0.6) * 0.08;
    if (ring.current) ring.current.rotation.z += delta * 0.1;
  });

  return (
    <group ref={group} rotation={[0.08, -0.18, 0.03]}>
      <mesh>
        <boxGeometry args={[2.35, 2.85, 0.54, 2, 2, 2]} />
        <meshStandardMaterial
          color="#0c1726"
          metalness={0.84}
          roughness={0.24}
        />
      </mesh>

      <mesh position={[0, 0.15, 0.29]}>
        <boxGeometry args={[1.72, 1.72, 0.035]} />
        <meshStandardMaterial
          color="#04141e"
          emissive="#167f9b"
          emissiveIntensity={0.72}
          metalness={0.3}
          roughness={0.2}
        />
      </mesh>

      <mesh position={[0, 0.15, 0.325]}>
        <planeGeometry args={[1.4, 1.4]} />
        <meshBasicMaterial color="#59d8ff" transparent opacity={0.09} />
      </mesh>

      {[-0.62, -0.21, 0.21, 0.62].map((x, index) => (
        <mesh key={x} position={[x, -0.08 + index * 0.12, 0.35]}>
          <boxGeometry args={[0.08, 0.75 + index * 0.14, 0.03]} />
          <meshBasicMaterial color="#8be9fd" transparent opacity={0.75} />
        </mesh>
      ))}

      <mesh ref={ring} rotation={[Math.PI / 2.6, 0.3, 0]}>
        <torusGeometry args={[2.15, 0.012, 8, 120]} />
        <meshBasicMaterial color="#59d8ff" transparent opacity={0.42} />
      </mesh>

      <mesh rotation={[0.4, Math.PI / 2.2, 0.15]}>
        <torusGeometry args={[2.65, 0.008, 8, 120]} />
        <meshBasicMaterial color="#718cff" transparent opacity={0.24} />
      </mesh>

      <pointLight position={[1.5, 1.2, 2.4]} color="#59d8ff" intensity={9} distance={8} />
      <pointLight position={[-2, -1.4, 1]} color="#718cff" intensity={7} distance={7} />
    </group>
  );
}

type HeroSceneProps = {
  onFailure: () => void;
};

export function HeroScene({ onFailure }: HeroSceneProps) {
  return (
    <SceneBoundary onFailure={onFailure}>
      <Canvas
        className="hero-canvas"
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 6.7], fov: 37 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={0.38} color="#b9c9e8" />
        <Core />
        <Dust />
      </Canvas>
    </SceneBoundary>
  );
}

