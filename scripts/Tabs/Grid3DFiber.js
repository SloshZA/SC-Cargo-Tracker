import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import ShipList from '../utils/Ships/ShipList';
import { useShipContext } from '../utils/Ships/ShipContext';

// Create a Block component
const Block = ({ size, position, color, rotation, onClick }) => {
  const texture = useTexture('/textures/cargo_box.png');
  const normalMap = useTexture('/textures/cargo_normal.png');
  const roughnessMap = useTexture('/textures/cargo_roughness.png');

  const dimensions = {
    '1SCU': [1, 1, 1],
    '2SCU': [1, 1, 2],
    '4SCU': [2, 1, 2],
    '8SCU': [2, 2, 2],
    '16SCU': [2, 2, 4],
    '32SCU': [2, 2, 8],
  }[size];

  return (
    <mesh
      position={position}
      rotation={[0, rotation, 0]}
      onClick={onClick}
      castShadow
      receiveShadow
    >
      <boxGeometry args={dimensions} />
      <meshStandardMaterial
        map={texture}
        normalMap={normalMap}
        roughnessMap={roughnessMap}
        color={color}
      />
    </mesh>
  );
};

// Create a Grid component
const Grid = ({ width, length, position }) => {
  const gridRef = useRef();
  const gridOffset = 0.01; // Small offset to prevent z-fighting

  // Create grid lines
  const xLines = useMemo(() => {
    const points = [];
    const halfWidth = width / 2;
    for (let x = -halfWidth; x <= halfWidth; x++) {
      points.push(new THREE.Vector3(x, gridOffset, -length/2));
      points.push(new THREE.Vector3(x, gridOffset, length/2));
    }
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [width, length]);

  const zLines = useMemo(() => {
    const points = [];
    const halfLength = length / 2;
    for (let z = -halfLength; z <= halfLength; z++) {
      points.push(new THREE.Vector3(-width/2, gridOffset, z));
      points.push(new THREE.Vector3(width/2, gridOffset, z));
    }
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [width, length]);

  return (
    <group ref={gridRef} position={position}>
      <lineSegments geometry={xLines}>
        <lineBasicMaterial 
          color={0xffffff} 
          linewidth={2}
          depthTest={true}
          depthWrite={false}
        />
      </lineSegments>
      <lineSegments geometry={zLines}>
        <lineBasicMaterial 
          color={0xffffff} 
          linewidth={2}
          depthTest={true}
          depthWrite={false}
        />
      </lineSegments>
    </group>
  );
};

// Main 3D Scene component
const Scene = ({ blocks, addBlock, selectedBlock, setSelectedBlock }) => {
  const { camera, scene } = useThree();
  
  // Set up initial camera position
  useEffect(() => {
    camera.position.set(10, 10, 0);
    camera.lookAt(0, 0, 0);
    scene.background = new THREE.Color(0x1e1e1e); // Set background color
  }, [camera, scene]);

  return (
    <>
      <ambientLight intensity={0.8} />
      <pointLight position={[0, 10, 0]} intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <directionalLight position={[-5, 5, -5]} intensity={0.6} />
      
      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.11, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color={0x333333} />
      </mesh>
      
      {/* Render all blocks */}
      {blocks.map((block, index) => (
        <Block
          key={index}
          size={block.size}
          position={block.position}
          color={block.color}
          rotation={block.rotation}
          onClick={() => setSelectedBlock(index)}
        />
      ))}
      
      {/* Improved Grid */}
      <Grid width={10} length={10} position={[0, 0, 0]} />
      
      {/* OrbitControls for camera movement */}
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
      />
    </>
  );
};

// Main Grid3DFiber component
const Grid3DFiber = () => {
  const [blocks, setBlocks] = useState([]);
  const [selectedBlock, setSelectedBlock] = useState(null);

  const addBlock = (size = '4SCU', color) => {
    const newBlock = {
      size,
      position: [0, 0, 0],
      color: color || 0xff00ff,
      rotation: 0
    };
    setBlocks([...blocks, newBlock]);
  };

  return (
    <div style={{ display: 'flex', width: '100%', height: '100%' }}>
      <Canvas
        style={{ width: '80%', height: '100%' }}
        shadows
        camera={{ fov: 75, near: 0.1, far: 1000 }}
      >
        <Scene
          blocks={blocks}
          addBlock={addBlock}
          selectedBlock={selectedBlock}
          setSelectedBlock={setSelectedBlock}
        />
      </Canvas>
      
      {/* Sidebar (same as before) */}
      <div style={{ width: '20%', backgroundColor: '#1e1e1e', padding: '10px' }}>
        {/* Add your sidebar controls here */}
      </div>
    </div>
  );
};

export default Grid3DFiber; 