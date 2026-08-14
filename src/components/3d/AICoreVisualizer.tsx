import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Float, Points, PointMaterial, Torus, Box } from '@react-three/drei';
import * as THREE from 'three';

interface AICoreProps {
  state?: 'idle' | 'research' | 'thinking' | 'speaking' | 'listening' | 'interview';
  size?: number;
  interactive?: boolean;
}

function ParticleClouds({ count = 120 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null!);
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 6;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 6;
    }
    return pos;
  }, [count]);

  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.03;
      pointsRef.current.rotation.x += delta * 0.015;
    }
  });

  return (
    <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#FBBF24"
        size={0.07}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.5}
      />
    </Points>
  );
}

function MonolithArchGateway() {
  const pillarRef = useRef<THREE.Group>(null!);

  useFrame((_, delta) => {
    if (pillarRef.current) {
      pillarRef.current.rotation.y += delta * 0.02;
    }
  });

  return (
    <group ref={pillarRef} position={[0.6, 0.2, -0.5]}>
      {/* Left Pillar */}
      <Box args={[0.3, 3.8, 0.4]} position={[-0.9, 0, 0]}>
        <meshStandardMaterial color="#1E293B" roughness={0.3} metalness={0.8} />
      </Box>

      {/* Right Pillar */}
      <Box args={[0.3, 3.8, 0.4]} position={[0.9, 0, 0]}>
        <meshStandardMaterial color="#1E293B" roughness={0.3} metalness={0.8} />
      </Box>

      {/* Top Header Monolith Arch */}
      <Box args={[2.1, 0.5, 0.4]} position={[0, 1.8, 0]}>
        <meshStandardMaterial color="#334155" roughness={0.2} metalness={0.9} />
      </Box>
    </group>
  );
}

// Use a ref-based mousePos to avoid re-rendering the scene on every mousemove
function EOSOrbCore({ state = 'idle', mousePosRef }: { state: string; mousePosRef: React.MutableRefObject<{ x: number; y: number }> }) {
  const orbRef = useRef<THREE.Mesh>(null!);
  const ringRef = useRef<THREE.Mesh>(null!);

  useFrame((_, delta) => {
    if (!orbRef.current) return;
    const speed = state === 'research' ? 2.5 : state === 'thinking' ? 2.0 : 1.0;
    
    orbRef.current.rotation.y += delta * speed * 0.3;

    if (ringRef.current) {
      ringRef.current.rotation.x = Math.PI / 3.2;
      ringRef.current.rotation.z += delta * speed * 0.2;
    }

    // Parallax mouse lerp — read from ref (no React re-render)
    const mp = mousePosRef.current;
    orbRef.current.position.x = THREE.MathUtils.lerp(orbRef.current.position.x, mp.x * 0.3, 0.05);
    orbRef.current.position.y = THREE.MathUtils.lerp(orbRef.current.position.y, mp.y * 0.3, 0.05);
  });

  const getColors = () => {
    switch (state) {
      case 'research':
        return { color: '#06B6D4', emissive: '#0891B2', ringColor: '#38BDF8' };
      case 'thinking':
        return { color: '#F59E0B', emissive: '#D97706', ringColor: '#FBBF24' };
      default:
        return { color: '#FBBF24', emissive: '#B45309', ringColor: '#F59E0B' };
    }
  };

  const { color, emissive, ringColor } = getColors();

  return (
    <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.6}>
      <group>
        {/* Central Planet / Sphere */}
        <Sphere ref={orbRef} args={[1, 64, 64]} scale={1.25} position={[-0.2, 0.1, 0.2]}>
          <MeshDistortMaterial
            color={color}
            emissive={emissive}
            emissiveIntensity={0.6}
            roughness={0.2}
            metalness={0.8}
            distort={0.25}
            speed={2}
          />
        </Sphere>

        {/* Planet Saturn Ring */}
        <Torus ref={ringRef} args={[2.0, 0.02, 16, 100]} position={[-0.2, 0.1, 0.2]}>
          <meshStandardMaterial
            color={ringColor}
            emissive={ringColor}
            emissiveIntensity={0.7}
            roughness={0.1}
            metalness={0.9}
          />
        </Torus>
      </group>
    </Float>
  );
}

// Memoized Three.js scene — only re-renders when `state` prop actually changes
const AICoreScene = React.memo(({ state, mousePosRef }: { state: string; mousePosRef: React.MutableRefObject<{ x: number; y: number }> }) => {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 45 }}
      gl={{ antialias: true, alpha: true, failIfMajorPerformanceCaveat: false }}
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={0.9} />
      <pointLight position={[10, 10, 10]} intensity={2.2} color="#FBBF24" />
      <pointLight position={[-10, -10, -10]} intensity={1.5} color="#06B6D4" />
      <pointLight position={[0, 5, 5]} intensity={1.2} color="#FFFFFF" />
      
      <ParticleClouds count={110} />
      <MonolithArchGateway />
      <EOSOrbCore state={state} mousePosRef={mousePosRef} />
    </Canvas>
  );
});

export const AICoreVisualizer: React.FC<AICoreProps> = React.memo(({ state = 'idle', size = 320, interactive = true }) => {
  const [webglSupported, setWebglSupported] = useState(true);
  // Use ref instead of state for mouse position — avoids re-rendering Canvas on every mousemove
  const mousePosRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) setWebglSupported(false);
    } catch {
      setWebglSupported(false);
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setWebglSupported(false);
    }
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    // Write to ref — no React re-render, Three.js reads it in useFrame
    mousePosRef.current = { x, y };
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      style={{ width: size, height: size }}
      className="relative flex items-center justify-center pointer-events-auto select-none"
    >
      {/* EOS AI Golden Warm Ambient Atmosphere */}
      <div className="absolute inset-0 bg-amber-500/12 blur-3xl rounded-full animate-pulse-glow" />
      <div className="absolute inset-6 bg-cyan-500/10 blur-2xl rounded-full" />

      {webglSupported ? (
        <AICoreScene state={state} mousePosRef={mousePosRef} />
      ) : (
        /* CSS Animated Fallback */
        <div className="w-3/4 h-3/4 rounded-full bg-gradient-to-tr from-amber-600 via-amber-400 to-cyan-400 p-1 animate-spin-slow shadow-2xl shadow-amber-500/30 flex items-center justify-center relative">
          <div className="w-full h-full rounded-full bg-dark-900/90 backdrop-blur-md flex items-center justify-center overflow-hidden">
            <div className="w-1/2 h-1/2 rounded-full bg-amber-400/30 blur-xl animate-pulse" />
          </div>
        </div>
      )}
    </div>
  );
});
