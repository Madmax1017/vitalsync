import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

export default function ThreeDModel() {
    const groupRef = useRef();

    useFrame((state) => {
        // Subtle tilt based on mouse position
        if (groupRef.current) {
            groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, state.pointer.y * 0.2, 0.05);
            groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, state.pointer.x * 0.2, 0.05);
        }
    });

    return (
        <group ref={groupRef}>
            <Float speed={2.5} rotationIntensity={1} floatIntensity={1.5}>
                {/* Main Classy Medicine Capsule */}
                <mesh rotation={[0.5, 0.3, 0.4]} scale={1.2}>
                    <capsuleGeometry args={[0.8, 1.4, 16, 32]} />
                    <meshPhysicalMaterial
                        color="#ffffff"
                        clearcoat={1}
                        clearcoatRoughness={0.1}
                        roughness={0.05}
                        metalness={0.1}
                        transmission={0.9}
                        thickness={2}
                        envMapIntensity={2}
                    />
                </mesh>

                {/* Inner glowing core of the medicine */}
                <mesh rotation={[0.5, 0.3, 0.4]} scale={1.15}>
                    <capsuleGeometry args={[0.5, 1.0, 16, 32]} />
                    <meshStandardMaterial
                        color="#2563eb"
                        emissive="#2563eb"
                        emissiveIntensity={0.8}
                    />
                </mesh>

                {/* Floating secondary smaller pill (Sage Green) */}
                <mesh position={[-2.2, -1.2, -1]} rotation={[-0.3, 0.6, 0.2]} scale={0.7}>
                    <capsuleGeometry args={[0.5, 1.0, 32, 64]} />
                    <meshPhysicalMaterial
                        color="#87A98D"
                        clearcoat={1}
                        clearcoatRoughness={0.1}
                        roughness={0.15}
                        metalness={0.2}
                    />
                </mesh>

                {/* Second Floating pill (Blue) */}
                <mesh position={[2.0, 1.8, -0.5]} rotation={[0.4, -0.2, 0.1]} scale={0.4}>
                    <capsuleGeometry args={[0.5, 1.0, 32, 64]} />
                    <meshPhysicalMaterial
                        color="#2563eb"
                        clearcoat={1}
                        clearcoatRoughness={0.2}
                        roughness={0.2}
                        metalness={0.3}
                    />
                </mesh>
            </Float>

            {/* Premium Lighting */}
            <ambientLight intensity={0.8} />
            <directionalLight position={[10, 10, 5]} intensity={2.5} color="#ffffff" castShadow />
            <directionalLight position={[-10, -10, -5]} intensity={1.5} color="#38bdf8" />

            <Environment preset="city" />
            <ContactShadows position={[0, -3.5, 0]} opacity={0.5} scale={12} blur={2.5} far={4.5} />
        </group>
    );
}
