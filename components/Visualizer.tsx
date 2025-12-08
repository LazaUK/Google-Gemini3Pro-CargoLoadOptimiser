import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Grid, Center, Text } from '@react-three/drei';
import * as THREE from 'three';
import { PackingResult, CONTAINER, PlacedItem } from '../types';

interface Props {
  result: PackingResult;
}

// Draw the container boundaries
const ContainerFrame = () => {
  const { x, y, z } = CONTAINER;
  
  // Create a wireframe box
  // Three.js BoxGeometry(width, height, depth) -> x, y, z
  // We need to match our logical coordinates to visual ones.
  // Logical: X=Length(3), Y=Height(1.9), Z=Width(1.8)
  // Visual: X=3, Y=1.9, Z=1.8
  
  const vertices = useMemo(() => {
    const points = [];
    
    // Bottom rect
    points.push(new THREE.Vector3(0, 0, 0));
    points.push(new THREE.Vector3(x, 0, 0));
    points.push(new THREE.Vector3(x, 0, z));
    points.push(new THREE.Vector3(0, 0, z));
    points.push(new THREE.Vector3(0, 0, 0));

    // Top rect
    points.push(new THREE.Vector3(0, y, 0));
    points.push(new THREE.Vector3(x, y, 0));
    points.push(new THREE.Vector3(x, y, z));
    points.push(new THREE.Vector3(0, y, z));
    points.push(new THREE.Vector3(0, y, 0));
    
    // Connectors (already connected 0-0, need others)
    // We'll use LineSegments for a cleaner wireframe manually or just use edges
    return points;
  }, [x, y, z]);

  return (
    <group>
      {/* Wireframe Helper */}
      <mesh position={[x/2, y/2, z/2]}>
        <boxGeometry args={[x, y, z]} />
        <meshBasicMaterial color="#94a3b8" wireframe transparent opacity={0.3} />
      </mesh>
      
      {/* Floor */}
      <mesh position={[x/2, 0, z/2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[x, z]} />
        <meshBasicMaterial color="#e2e8f0" transparent opacity={0.5} side={THREE.DoubleSide} />
      </mesh>

       {/* Dimensions Labels */}
       <Text position={[x/2, -0.2, z + 0.2]} fontSize={0.15} color="#64748b" rotation={[-Math.PI/2,0,0]}>
          Length: 3.0m
       </Text>
       <Text position={[-0.2, y/2, z + 0.2]} fontSize={0.15} color="#64748b" rotation={[0,0,Math.PI/2]}>
          Height: 1.9m
       </Text>
       <Text position={[x + 0.2, 0, z/2]} fontSize={0.15} color="#64748b" rotation={[-Math.PI/2,0,-Math.PI/2]}>
          Width: 1.8m
       </Text>

    </group>
  );
};

const ParcelMesh: React.FC<{ item: PlacedItem }> = ({ item }) => {
  // item.position is [x, y, z] (bottom-left corner)
  // item.dimensions is [w, h, d]
  // Three.js mesh position is at the CENTER of the geometry
  
  const [x, y, z] = item.position;
  const [w, h, d] = item.dimensions;
  
  const centerX = x + w / 2;
  const centerY = y + h / 2;
  const centerZ = z + d / 2;

  return (
    <group position={[centerX, centerY, centerZ]}>
        <mesh>
            <boxGeometry args={[w - 0.01, h - 0.01, d - 0.01]} />
            <meshStandardMaterial color={item.color} roughness={0.6} metalness={0.1} />
        </mesh>
        {/* Outline for better visibility */}
        <lineSegments>
            <edgesGeometry args={[new THREE.BoxGeometry(w, h, d)]} />
            <lineBasicMaterial color="black" transparent opacity={0.2} />
        </lineSegments>
    </group>
  );
};

export const Visualizer: React.FC<Props> = ({ result }) => {
  return (
    <Canvas shadows dpr={[1, 2]}>
      <PerspectiveCamera makeDefault position={[5, 4, 5]} fov={50} />
      <OrbitControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 2} target={[1.5, 1, 1]} />
      
      <ambientLight intensity={0.6} />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={1} 
        castShadow 
      />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />

      <group position={[0, 0, 0]}>
         <ContainerFrame />
         {result.placedItems.map((item) => (
             <ParcelMesh key={item.id} item={item} />
         ))}
      </group>
      
      <Grid 
        position={[0, -0.01, 0]} 
        args={[10, 10]} 
        cellSize={0.5} 
        cellThickness={0.5} 
        cellColor="#e2e8f0" 
        sectionSize={1} 
        sectionThickness={1}
        sectionColor="#cbd5e1" 
        fadeDistance={20} 
      />
    </Canvas>
  );
};