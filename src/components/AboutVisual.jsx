import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

function MedicalCross() {
    const groupRef = useRef();

    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, state.pointer.x * 0.3, 0.05);
            groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, state.pointer.y * 0.3, 0.05);
            // Slight continuous Y rotation
            groupRef.current.rotation.y += 0.002;
        }
    });

    return (
        <group ref={groupRef}>
            <Float speed={2} rotationIntensity={0.5} floatIntensity={1.5}>
                {/* Vertical Bar */}
                <mesh position={[0, 0, 0]} castShadow>
                    <boxGeometry args={[0.8, 3.2, 0.8]} />
                    <meshPhysicalMaterial
                        color="#ffffff"
                        clearcoat={1}
                        clearcoatRoughness={0.1}
                        roughness={0.05}
                        metalness={0.1}
                        transmission={0.9}
                        thickness={2}
                    />
                </mesh>
                {/* Horizontal Bar */}
                <mesh position={[0, 0, 0]} castShadow>
                    <boxGeometry args={[3.2, 0.8, 0.8]} />
                    <meshPhysicalMaterial
                        color="#ffffff"
                        clearcoat={1}
                        clearcoatRoughness={0.1}
                        roughness={0.05}
                        metalness={0.1}
                        transmission={0.9}
                        thickness={2}
                    />
                </mesh>

                {/* Inner glowing core vertical */}
                <mesh position={[0, 0, 0]} scale={0.9}>
                    <boxGeometry args={[0.4, 2.8, 0.4]} />
                    <meshStandardMaterial color="#2563eb" emissive="#2563eb" emissiveIntensity={0.8} />
                </mesh>
                {/* Inner glowing core horizontal */}
                <mesh position={[0, 0, 0]} scale={0.9}>
                    <boxGeometry args={[2.8, 0.4, 0.4]} />
                    <meshStandardMaterial color="#2563eb" emissive="#2563eb" emissiveIntensity={0.8} />
                </mesh>

                {/* Floating particles */}
                <mesh position={[2, 1.5, -1]} scale={0.25}>
                    <sphereGeometry args={[1, 32, 32]} />
                    <meshPhysicalMaterial color="#8b5cf6" clearcoat={1} transmission={0.8} roughness={0.1} />
                </mesh>
                <mesh position={[-2, -2, 1]} scale={0.35}>
                    <sphereGeometry args={[1, 32, 32]} />
                    <meshPhysicalMaterial color="#38bdf8" clearcoat={1} transmission={0.8} roughness={0.1} />
                </mesh>
            </Float>

            {/* Premium Lighting */}
            <ambientLight intensity={0.8} />
            <directionalLight position={[10, 10, 5]} intensity={2.5} color="#ffffff" castShadow />
            <directionalLight position={[-10, -10, -5]} intensity={1.5} color="#38bdf8" />

            <Environment preset="city" />
            <ContactShadows position={[0, -3.5, 0]} opacity={0.3} scale={10} blur={2.5} far={4} color="#000000" />
        </group>
    );
}

export default function AboutVisual() {
    return (
        <div className="relative w-full h-[400px] max-w-md mx-auto group">
            {/* Ambient glow blending with background */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                <div className="w-[350px] h-[350px] rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.15)_0%,rgba(0,0,0,0)_70%)] blur-[40px]" />
                <div className="absolute w-[250px] h-[250px] rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.1)_0%,rgba(0,0,0,0)_70%)] blur-[40px] translate-x-10 translate-y-10" />
            </div>

            <div className="relative z-10 w-full h-full opacity-90 transition-opacity duration-700 hover:opacity-100 cursor-default">
                <Suspense fallback={
                    <div className="flex items-center justify-center h-full w-full">
                        <div className="w-12 h-12 border-4 border-violet-400 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                }>
                    <Canvas camera={{ position: [0, 0, 7], fov: 45 }} className="w-full h-full">
                        <MedicalCross />
                    </Canvas>
                </Suspense>
            </div>
        </div>
    );
}
