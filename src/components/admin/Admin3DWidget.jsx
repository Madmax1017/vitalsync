import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
    Float,
    MeshDistortMaterial,
    Sphere,
    Box,
    Environment,
    ContactShadows
} from '@react-three/drei';
import * as THREE from 'three';

const Bubble = ({ position, scale, speed, distort, color }) => {
    const meshRef = useRef();

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.x += 0.005;
            meshRef.current.rotation.y += 0.005;
        }
    });

    return (
        <Float speed={speed} rotationIntensity={1} floatIntensity={2} position={position}>
            <Sphere ref={meshRef} args={[1, 32, 32]} scale={scale}>
                <MeshDistortMaterial
                    color={color}
                    speed={speed * 2}
                    distort={distort}
                    radius={1}
                    metalness={0.4}
                    roughness={0.2}
                    transparent
                    opacity={0.6}
                    reflective
                />
            </Sphere>
        </Float>
    );
};

const MedicalCross = ({ position }) => {
    return (
        <Float speed={3} rotationIntensity={2} floatIntensity={1} position={position}>
            <group scale={0.4}>
                <Box args={[1, 0.3, 0.3]}>
                    <meshStandardMaterial color="#ffffff" emissive="#7c3aed" emissiveIntensity={0.5} />
                </Box>
                <Box args={[0.3, 1, 0.3]}>
                    <meshStandardMaterial color="#ffffff" emissive="#7c3aed" emissiveIntensity={0.5} />
                </Box>
            </group>
        </Float>
    );
};

const BubbleGroup = () => {
    const groupRef = useRef();

    // Mouse follow logic for the whole group
    useFrame((state) => {
        const { x, y } = state.mouse;
        if (groupRef.current) {
            groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, y * 0.2, 0.1);
            groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, x * 0.2, 0.1);
        }
    });

    const bubbles = useMemo(() => [
        { position: [-2, 1, 0], scale: 0.6, speed: 1.5, distort: 0.3, color: '#a78bfa' },
        { position: [2, -1.5, -1], scale: 0.8, speed: 2, distort: 0.4, color: '#818cf8' },
        { position: [0, 0, 0], scale: 1.2, speed: 1, distort: 0.2, color: '#7c3aed' },
        { position: [-1.5, -1.2, 1], scale: 0.4, speed: 2.5, distort: 0.5, color: '#c4b5fd' },
        { position: [1.8, 1.3, 0.5], scale: 0.5, speed: 1.8, distort: 0.3, color: '#ddd6fe' },
        { position: [0.5, -2, -0.5], scale: 0.3, speed: 3, distort: 0.6, color: '#a78bfa' },
    ], []);

    return (
        <group ref={groupRef}>
            {bubbles.map((b, i) => (
                <Bubble key={i} {...b} />
            ))}
            <MedicalCross position={[0, 0, 0]} />
        </group>
    );
};

export default function Admin3DWidget() {
    return (
        <div className="w-24 h-24 md:w-40 md:h-40 transition-all duration-700 hover:scale-105 pointer-events-auto">
            <Canvas camera={{ position: [0, 0, 6], fov: 45 }} alpha={true}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1.5} />
                <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />

                <BubbleGroup />

                <Environment preset="city" />
                <ContactShadows
                    position={[0, -3.5, 0]}
                    opacity={0.3}
                    scale={15}
                    blur={2.5}
                    far={5}
                />
            </Canvas>
        </div>
    );
}
