"use client";

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, PointMaterial } from '@react-three/drei';
import * as random from 'maath/random/dist/maath-random.esm';

function Particles(props) {
  const ref = useRef();
  
  // Generate random points in a sphere
  const sphere = useMemo(() => {
    // Generate 1500 points (reduced for performance)
    return random.inSphere(new Float32Array(1500 * 3), { radius: 1.5 });
  }, []);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 10;
      ref.current.rotation.y -= delta / 15;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <points ref={ref}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={sphere.length / 3}
            array={sphere}
            itemSize={3}
          />
        </bufferGeometry>
        <PointMaterial
          transparent
          color="#7c3aed"
          size={0.015}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </points>
    </group>
  );
}

function CoreSphere() {
  const meshRef = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.position.y = Math.sin(time) * 0.1;
      meshRef.current.rotation.y += 0.01;
      meshRef.current.rotation.x += 0.005;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial
        color="#06b6d4"
        wireframe={true}
        transparent
        opacity={0.15}
        emissive="#06b6d4"
        emissiveIntensity={0.5}
      />
    </mesh>
  );
}

export default function Canvas3D() {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1, pointerEvents: 'none' }}>
      <Canvas camera={{ position: [0, 0, 3] }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 10]} intensity={1} color="#7c3aed" />
        <directionalLight position={[-10, -10, -10]} intensity={0.5} color="#06b6d4" />
        
        <Particles />
        <CoreSphere />
        
        {/* Optional: We can add orbit controls if we want it to be interactive, 
            but for the background, pointerEvents='none' prevents interception */}
      </Canvas>
    </div>
  );
}
