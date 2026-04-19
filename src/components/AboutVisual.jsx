import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Float, ContactShadows } from '@react-three/drei';

function EnhancedDNAHelix() {
    const dnaRef = useRef();
    const numPoints = 60;
    const radius = 1.3;
    const height = 18;

    useFrame((state) => {
        if (dnaRef.current) {
            // Constant auto-rotation Y-axis
            dnaRef.current.rotation.y += 0.003;
        }
    });

    return (
        <group ref={dnaRef}>
            <Float speed={1} rotationIntensity={0.1} floatIntensity={0.5}>
                {Array.from({ length: numPoints }).map((_, i) => {
                    const angle = (i / numPoints) * Math.PI * 8; // 4 full twists
                    const y = (i / numPoints) * height - height / 2;

                    const x1 = Math.cos(angle) * radius;
                    const z1 = Math.sin(angle) * radius;

                    const x2 = Math.cos(angle + Math.PI) * radius;
                    const z2 = Math.sin(angle + Math.PI) * radius;

                    return (
                        <group key={i} position={[0, y, 0]}>
                            {/* Bright Cyan Strand */}
                            <mesh position={[x1, 0, z1]}>
                                <sphereGeometry args={[0.22, 32, 32]} />
                                <meshStandardMaterial color="#38bdf8" roughness={0.3} metalness={0.1} />
                            </mesh>

                            {/* Deep Lavender Strand */}
                            <mesh position={[x2, 0, z2]}>
                                <sphereGeometry args={[0.22, 32, 32]} />
                                <meshStandardMaterial color="#8b5cf6" roughness={0.3} metalness={0.1} />
                            </mesh>

                            {/* Thin, low-opacity white/transparent Connectors */}
                            <mesh rotation={[0, -angle, 0]} position={[0, 0, 0]}>
                                <cylinderGeometry args={[0.02, 0.02, radius * 2, 8]} />
                                <meshStandardMaterial color="#ffffff" transparent opacity={0.3} roughness={0.8} />
                            </mesh>
                        </group>
                    );
                })}
            </Float>
            <ambientLight intensity={0.9} />
            <pointLight position={[5, 10, 5]} intensity={1.5} color="#ffffff" />
            <Environment preset="city" />

            {/* ContactShadows far below */}
            <ContactShadows position={[0, -10, 0]} opacity={0.3} scale={25} blur={2.5} far={12} />
        </group>
    );
}

export default function AboutVisual() {
    return (
        <div className="relative w-full h-[750px] max-w-md mx-auto group perspective-1000">
            {/* Ambient glow blending with background */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                <div className="w-[350px] h-[350px] rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.15)_0%,rgba(0,0,0,0)_70%)] blur-[40px] transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute w-[250px] h-[250px] rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.1)_0%,rgba(0,0,0,0)_70%)] blur-[40px] translate-x-10 translate-y-10 transition-transform duration-700 group-hover:scale-110" />
            </div>

            <Canvas camera={{ position: [0, 0, 16], fov: 30 }} shadows className="z-10 relative">
                <OrbitControls enableZoom={false} enablePan={false} minPolarAngle={Math.PI / 3} maxPolarAngle={Math.PI / 1.5} />
                <Suspense fallback={null}>
                    <EnhancedDNAHelix />
                </Suspense>
            </Canvas>
        </div>
    );
}
