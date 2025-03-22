import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useTexture, Html, Text } from '@react-three/drei';
import * as THREE from 'three';

// Enhanced Block component using R3F hooks
function Block({ size, position, rotation, color, commodity, missionIndex, onClick, onHover }) {
  const meshRef = useRef();
  const texture = useTexture('/textures/cargo_box.png');
  const normalMap = useTexture('/textures/cargo_normal.png');
  const roughnessMap = useTexture('/textures/cargo_roughness.png');
  const { width, height, depth } = getDimensions(size);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.material.emissiveIntensity = meshRef.current.userData.hovered ? 0.5 : 0;
    }
  });

  return (
    <mesh 
      ref={meshRef}
      position={position}
      rotation={[0, rotation, 0]}
      onClick={onClick}
      onPointerOver={(e) => {
        e.stopPropagation();
        meshRef.current.userData.hovered = true;
        onHover(true);
      }}
      onPointerOut={() => {
        meshRef.current.userData.hovered = false;
        onHover(false);
      }}
    >
      <boxGeometry args={[width, height, depth]} />
      <meshStandardMaterial 
        map={texture}
        normalMap={normalMap}
        roughnessMap={roughnessMap}
        color={color}
        emissive={0xffffff}
      />
    </mesh>
  );
}

// Modern Grid component using R3F primitives
function Grid({ width, length, color = 0xffffff }) {
  const cellSize = 1;
  const xMin = -Math.floor(width / 2);
  const xMax = Math.ceil(width / 2);
  const zMin = -Math.floor(length / 2);
  const zMax = Math.ceil(length / 2);

  return (
    <group>
      {/* Grid plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[width, length]} />
        <meshBasicMaterial color={0x1a1a1a} transparent opacity={0.5} />
      </mesh>

      {/* Grid lines */}
      {Array.from({ length: xMax - xMin + 1 }).map((_, i) => {
        const x = xMin + i;
        return (
          <line key={`x-${i}`}>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                array={new Float32Array([
                  x, 0, zMin,
                  x, 0, zMax
                ])}
                itemSize={3}
                count={2}
              />
            </bufferGeometry>
            <lineBasicMaterial color={color} transparent opacity={0.3} />
          </line>
        );
      })}
      
      {Array.from({ length: zMax - zMin + 1 }).map((_, i) => {
        const z = zMin + i;
        return (
          <line key={`z-${i}`}>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                array={new Float32Array([
                  xMin, 0, z,
                  xMax, 0, z
                ])}
                itemSize={3}
                count={2}
              />
            </bufferGeometry>
            <lineBasicMaterial color={color} transparent opacity={0.3} />
          </line>
        );
      })}
    </group>
  );
}

// Main Grid3D component with modern R3F patterns
export default function Grid3D() {
  const [blocks, setBlocks] = useState([]);
  const [grids, setGrids] = useState({
    'Grid 1': { width: 1, length: 1, height: 5 },
    'Grid 2': { width: 1, length: 1, height: 8 },
    'Grid 3': { width: 1, length: 1, height: 10 },
    'Grid 4': { width: 1, length: 1, height: 12 }
  });
  const [hoveredBlock, setHoveredBlock] = useState(null);

  const addBlock = (size = '4SCU', color, missionIndex, commodity) => {
    const newBlock = {
      size,
      position: [0, 0, 0],
      rotation: 0,
      color: color || getDefaultColor(size),
      commodity,
      missionIndex
    };
    setBlocks(prev => [...prev, newBlock]);
  };

  const handleBlockClick = (block) => {
    console.log('Block clicked:', block);
    // Add your block click logic here
  };

  return (
    <Canvas 
      camera={{ position: [10, 10, 0], fov: 75 }}
      shadows
      gl={{ antialias: true }}
    >
      <ambientLight intensity={0.8} />
      <pointLight position={[0, 10, 0]} intensity={0.8} castShadow />
      <directionalLight 
        position={[5, 5, 5]} 
        intensity={0.8} 
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <hemisphereLight intensity={0.6} />
      
      {/* Render grids */}
      {Object.entries(grids).map(([name, dimensions]) => (
        <Grid key={name} width={dimensions.width} length={dimensions.length} />
      ))}

      {/* Render blocks */}
      {blocks.map((block, i) => (
        <Block 
          key={i} 
          {...block}
          onClick={() => handleBlockClick(block)}
          onHover={(hovered) => setHoveredBlock(hovered ? block : null)}
        />
      ))}

      {/* Hover info */}
      {hoveredBlock && (
        <Html position={hoveredBlock.position}>
          <div style={{
            background: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            padding: '8px',
            borderRadius: '4px',
            whiteSpace: 'nowrap'
          }}>
            <div>Size: {hoveredBlock.size}</div>
            {hoveredBlock.commodity && <div>Commodity: {hoveredBlock.commodity}</div>}
          </div>
        </Html>
      )}

      <OrbitControls 
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={5}
        maxDistance={100}
      />
    </Canvas>
  );
}

// Helper functions
function getDimensions(size) {
  switch (size) {
    case '1SCU': return { width: 1, height: 1, depth: 1 };
    case '2SCU': return { width: 1, height: 1, depth: 2 };
    case '4SCU': return { width: 2, height: 1, depth: 2 };
    case '8SCU': return { width: 2, height: 2, depth: 2 };
    case '16SCU': return { width: 2, height: 2, depth: 4 };
    case '32SCU': return { width: 2, height: 2, depth: 8 };
    default: return { width: 1, height: 1, depth: 1 };
  }
}

function getDefaultColor(size) {
  const sizeColors = {
    '1SCU': 0x00ff00,
    '2SCU': 0x0000ff,
    '4SCU': 0xff00ff,
    '8SCU': 0xffa500,
    '16SCU': 0x800080,
    '32SCU': 0xff0000
  };
  return sizeColors[size] || 0xffffff;
} 