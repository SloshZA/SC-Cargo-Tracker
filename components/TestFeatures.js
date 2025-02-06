import React, { useRef, useEffect } from 'react';
import Select from 'react-select';
import * as THREE from 'three';
import './TestFeatures.css';

const shipOptions = [
  { value: 'ship1', label: 'Cargo Ship 1' },
  { value: 'ship2', label: 'Cargo Ship 2' },
  { value: 'ship3', label: 'Cargo Ship 3' }
];

const TestFeatures = () => {
  const mountRef = useRef(null);
  const sceneRef = useRef(new THREE.Scene());
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const cratesRef = useRef([]);
  const groupRef = useRef(new THREE.Group());
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Set up Three.js scene
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    // Camera
    cameraRef.current = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    cameraRef.current.position.z = 700;

    // Renderer
    rendererRef.current = new THREE.WebGLRenderer({ antialias: true });
    rendererRef.current.setSize(width, height);
    mountRef.current.appendChild(rendererRef.current.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040);
    sceneRef.current.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(1, 1, 1).normalize();
    sceneRef.current.add(directionalLight);

    // Create crates
    const crateGeometry = new THREE.BoxGeometry(30, 30, 30);
    const crateMaterial = new THREE.MeshStandardMaterial({
      color: 0x8B4513,
      metalness: 0.1,
      roughness: 0.8
    });

    // Create parent group for all crates
    const crateGroup = new THREE.Group();
    
    // Generate crate grid (12x12x5)
    for (let x = 0; x < 4; x++) {
      for (let y = 0; y < 3; y++) {
        for (let z = 0; z < 16; z++) {
          const crate = new THREE.Mesh(crateGeometry, crateMaterial);
          crate.position.set(
            x * 40,
            y * 40,
            z * 40
          );
          crateGroup.add(crate);
          cratesRef.current.push(crate);
        }
      }
    }
    
    // Create baseplate
    const baseplateGeometry = new THREE.PlaneGeometry(200, 200);
    const baseplateMaterial = new THREE.MeshStandardMaterial({
      color: 0x808080,
      metalness: 0.2,
      roughness: 0.7
    });
    const baseplate = new THREE.Mesh(baseplateGeometry, baseplateMaterial);
    baseplate.rotation.x = -Math.PI / 2;
    baseplate.position.y = -60;
    // Add baseplate to crate group
    crateGroup.add(baseplate);

    // Add group to scene
    sceneRef.current.add(crateGroup);
    groupRef.current = crateGroup;

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      rendererRef.current.render(sceneRef.current, cameraRef.current);
    };
    animate();

    // Handle window resize
    const handleResize = () => {
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      rendererRef.current.setSize(width, height);
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && rendererRef.current?.domElement) {
        mountRef.current.removeChild(rendererRef.current.domElement);
      }
    };
  }, []);

  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseRef = useRef(new THREE.Vector2());
  const selectedCrateRef = useRef(null);
  const originalPositionRef = useRef(new THREE.Vector3());

  const handleMouseDown = (e) => {
    // Convert mouse position to normalized device coordinates
    mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;

    // Update the raycaster
    raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);

    // Find intersected objects
    const intersects = raycasterRef.current.intersectObjects(cratesRef.current);
    
    if (intersects.length > 0) {
      selectedCrateRef.current = intersects[0].object;
      originalPositionRef.current.copy(selectedCrateRef.current.position);
      isDraggingRef.current = true;
    } else {
      // If no crate selected, handle grid rotation
      isDraggingRef.current = true;
      previousMousePositionRef.current = {
        x: e.clientX,
        y: e.clientY
      };
    }
  };

  const handleMouseMove = (e) => {
    if (isDraggingRef.current && selectedCrateRef.current) {
      // Convert mouse position to normalized device coordinates
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;

      // Update the raycaster
      raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);

      // Calculate new position in world space
      const vector = new THREE.Vector3(mouseRef.current.x, mouseRef.current.y, 0.5);
      vector.unproject(cameraRef.current);
      const dir = vector.sub(cameraRef.current.position).normalize();
      const distance = -cameraRef.current.position.z / dir.z;
      const newPos = cameraRef.current.position.clone().add(dir.multiplyScalar(distance));

      // Snap to grid
      const gridSize = 40;
      newPos.x = Math.round(newPos.x / gridSize) * gridSize;
      newPos.y = Math.round(newPos.y / gridSize) * gridSize;
      newPos.z = selectedCrateRef.current.position.z; // Maintain original z position

      // Check for collisions
      const tempPos = selectedCrateRef.current.position.clone();
      selectedCrateRef.current.position.copy(newPos);
      
      const colliding = cratesRef.current.some(crate => {
        return crate !== selectedCrateRef.current &&
               crate.position.distanceTo(selectedCrateRef.current.position) < gridSize * 0.9;
      });

      if (colliding) {
        selectedCrateRef.current.position.copy(tempPos);
      }
    } else if (isDraggingRef.current) {
      // Handle grid rotation
      const deltaX = e.clientX - previousMousePositionRef.current.x;
      const deltaY = e.clientY - previousMousePositionRef.current.y;

      groupRef.current.rotation.x += deltaY * 0.005;
      groupRef.current.rotation.y += deltaX * 0.005;

      previousMousePositionRef.current = {
        x: e.clientX,
        y: e.clientY
      };
    }
  };

  const handleMouseUp = () => {
    if (selectedCrateRef.current) {
      // Snap to final grid position
      const gridSize = 40;
      selectedCrateRef.current.position.x = Math.round(selectedCrateRef.current.position.x / gridSize) * gridSize;
      selectedCrateRef.current.position.y = Math.round(selectedCrateRef.current.position.y / gridSize) * gridSize;
      selectedCrateRef.current = null;
    }
    isDraggingRef.current = false;
  };

  const handleWheel = (e) => {
    const zoomSpeed = 0.1;
    cameraRef.current.position.z += e.deltaY * zoomSpeed;
    // Clamp zoom between reasonable limits
    cameraRef.current.position.z = Math.min(
      Math.max(cameraRef.current.position.z, 200),
      1000
    );
  };

  return (
    <div className="test-features-container">
      <div className="group-box" style={{ marginBottom: '40px', width: '400px' }}>
        <h2>Select Ship</h2>
        <Select
          options={shipOptions}
          placeholder="Select Ship"
        />
      </div>
      <div className="group-box">
        <h2>3D Grid Test</h2>
        <div
          ref={mountRef}
          className="grid-wrapper"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
          style={{ width: '800px', height: '600px' }}
        />
      </div>
    </div>
  );
};

export default TestFeatures;