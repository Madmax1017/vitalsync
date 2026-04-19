import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Float, Environment, ContactShadows, OrbitControls } from '@react-three/drei';

function MedicalCapsule() {
    const radius = 1;
    const bodyLength = 1.5;

    return (
        <group>
            <Float speed={1.5} rotationIntensity={0.5} floatIntensity={2}>
                <group rotation={[0, 0, -25 * (Math.PI / 180)]}>
                    {/* Top Half: Frosted Glass */}
                    <group position={[0, bodyLength / 4, 0]}>
                        <mesh position={[0, 0, 0]}>
                            <cylinderGeometry args={[radius, radius, bodyLength / 2, 32, 1, true]} />
                            <meshPhysicalMaterial
                                color="#ffffff"
                                transmission={0.95}
                                roughness={0.08}
                                thickness={1.5}
                                clearcoat={1}
                                clearcoatRoughness={0.1}
                                ior={1.4}
                            />
                        </mesh>
                        <mesh position={[0, bodyLength / 4, 0]}>
                            <sphereGeometry args={[radius, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
                            <meshPhysicalMaterial
                                color="#ffffff"
                                transmission={0.95}
                                roughness={0.08}
                                thickness={1.5}
                                clearcoat={1}
                                clearcoatRoughness={0.1}
                                ior={1.4}
                            />
                        </mesh>
                    </group>

                    {/* Bottom Half: Solid Medical White */}
                    <group position={[0, -bodyLength / 4, 0]}>
                        <mesh position={[0, 0, 0]}>
                            <cylinderGeometry args={[radius, radius, bodyLength / 2, 32, 1, true]} />
                            <meshStandardMaterial color="#f8fafc" roughness={0.3} metalness={0.1} />
                        </mesh>
                        <mesh position={[0, -bodyLength / 4, 0]}>
                            <sphereGeometry args={[radius, 32, 32, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
                            <meshStandardMaterial color="#f8fafc" roughness={0.3} metalness={0.1} />
                        </mesh>
                    </group>

                    {/* Internal Glowing Liquid Core */}
                    <mesh position={[0, bodyLength / 6, 0]}>
                        <capsuleGeometry args={[radius * 0.6, bodyLength * 0.4, 16, 32]} />
                        <meshStandardMaterial
                            color="#2563eb"
                            emissive="#2563eb"
                            emissiveIntensity={2}
                            roughness={0.2}
                        />
                    </mesh>
                </group>
            </Float>

            {/* Lighting & Environment */}
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={2} castShadow />
            <directionalLight position={[-10, 5, -5]} intensity={1.5} color="#38bdf8" />

            <Suspense fallback={null}>
                <Environment preset="studio" />
            </Suspense>

            {/* Soft floating shadow below */}
            <ContactShadows position={[0, -3.5, 0]} opacity={0.6} scale={12} blur={3} far={5} />
        </group>
    );
}

export default function ThreeDHero() {
    return (
        <div style={{ width: '100%', height: '100vh', background: 'transparent', overflow: 'visible' }}>
            <Canvas shadows camera={{ position: [0, 0, 8], fov: 40 }}>
                <OrbitControls enableZoom={false} makeDefault />
                <MedicalCapsule />
            </Canvas>
        </div>
    );
}