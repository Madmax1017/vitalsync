import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment } from '@react-three/drei';
import * as THREE from 'three';

function DNAHelix() {
    const groupRef = useRef();

    useFrame((state) => {
        if (groupRef.current) {
            // Slight continuous Y rotation
            groupRef.current.rotation.y += 0.005;
            // Mouse parallax mapping
            groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, state.pointer.x * 0.4 + groupRef.current.rotation.y, 0.05);
            groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, state.pointer.y * 0.2, 0.05);
        }
    });

    const numPairs = 24;
    const height = 6;
    const radius = 1.2;
    const twists = 2; // 2 full turns

    // Create base pair data
    const basePairs = useMemo(() => {
        const pairs = [];
        for (let i = 0; i < numPairs; i++) {
            const t = i / (numPairs - 1);
            const y = (t - 0.5) * height;
            const angle = t * Math.PI * 2 * twists;

            const px1 = Math.cos(angle) * radius;
            const pz1 = Math.sin(angle) * radius;

            const px2 = Math.cos(angle + Math.PI) * radius;
            const pz2 = Math.sin(angle + Math.PI) * radius;

            pairs.push({
                y, angle, p1: [px1, y, pz1], p2: [px2, y, pz2]
            });
        }
        return pairs;
    }, []);

    return (
        <group ref={groupRef}>
            <Float speed={2} rotationIntensity={0.2} floatIntensity={1.5}>
                {basePairs.map((pair, i) => (
                    <group key={i}>
                        {/* Sphere 1 */}
                        <mesh position={pair.p1}>
                            <sphereGeometry args={[0.18, 24, 24]} />
                            <meshPhysicalMaterial
                                color="#8b5cf6"
                                transmission={0.9}
                                opacity={1}
                                roughness={0.1}
                                clearcoat={1}
                            />
                        </mesh>

                        {/* Sphere 2 */}
                        <mesh position={pair.p2}>
                            <sphereGeometry args={[0.18, 24, 24]} />
                            <meshPhysicalMaterial
                                color="#38bdf8"
                                transmission={0.9}
                                opacity={1}
                                roughness={0.1}
                                clearcoat={1}
                            />
                        </mesh>

                        {/* Connecting rung */}
                        <group position={[0, pair.y, 0]} rotation={[0, -pair.angle, 0]}>
                            <mesh>
                                {/* A box extending along the X axis from -radius to radius, with slight thickness */}
                                <boxGeometry args={[radius * 2, 0.06, 0.06]} />
                                <meshPhysicalMaterial
                                    color="#ffffff"
                                    transparent
                                    opacity={0.4}
                                    transmission={0.5}
                                    roughness={0.2}
                                />
                            </mesh>
                        </group>
                    </group>
                ))}
            </Float>

            {/* Premium Lighting */}
            <ambientLight intensity={1.2} />
            <directionalLight position={[10, 10, 5]} intensity={3} color="#ffffff" castShadow />
            <directionalLight position={[-10, -10, -5]} intensity={1.5} color="#38bdf8" />

            <Environment preset="city" />
        </group>
    );
}

export default function AboutVisual() {
    return (
        <div className="relative w-full h-[400px] max-w-md mx-auto group perspective-1000">
            {/* Ambient glow blending with background */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                <div className="w-[350px] h-[350px] rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.15)_0%,rgba(0,0,0,0)_70%)] blur-[40px] transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute w-[250px] h-[250px] rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.1)_0%,rgba(0,0,0,0)_70%)] blur-[40px] translate-x-10 translate-y-10 transition-transform duration-700 group-hover:scale-110" />
            </div>

            <div className="relative z-10 w-full h-full opacity-90 transition-all duration-700 hover:opacity-100 cursor-default scale-100 group-hover:scale-[1.03]">
                <Suspense fallback={
                    <div className="flex items-center justify-center h-full w-full">
                        <div className="w-12 h-12 border-4 border-violet-400 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                }>
                    <Canvas camera={{ position: [0, 0, 8], fov: 45 }} className="w-full h-full pointer-events-none group-hover:pointer-events-auto">
                        <DNAHelix />
                    </Canvas>
                </Suspense>
            </div>
        </div>
    );
}
