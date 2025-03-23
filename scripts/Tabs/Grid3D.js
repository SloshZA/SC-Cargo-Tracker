import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import ShipList from '../utils/Ships/ShipList';
import { useShipContext } from '../utils/Ships/ShipContext';

// Modify createBlock function to use Standard material with texture
const createBlock = (size, color) => {
    // Determine dimensions and offsets based on size
    let width, height, depth;
    let xOffset = 0, yOffset = 0, zOffset = 0;
    
    switch (size) {
        case '1SCU':
            width = 1; height = 1; depth = 1;
            xOffset = 0.5; zOffset = 0;
            break;
        case '2SCU':
            width = 1; height = 1; depth = 2;
            xOffset = 0.5; zOffset = 1.5;
            break;
        case '4SCU':
            width = 2; height = 1; depth = 2;
            xOffset = 1; zOffset = 1.5;
            break;
        case '8SCU':
            width = 2; height = 2; depth = 2;
            xOffset = 1; zOffset = 1.5;
            break;
        case '16SCU':
            width = 2; height = 2; depth = 4;
            xOffset = 1; zOffset = 2.5;
            break;
        case '32SCU':
            width = 2; height = 2; depth = 8;
            xOffset = 1; zOffset = 4.5;
            break;
        default:
            width = 1; height = 1; depth = 1;
            xOffset = 0; zOffset = 0;
    }

    // Create the box geometry
    const geometry = new THREE.BoxGeometry(width, height, depth);
    
    // Load textures with fallbacks
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load('/textures/cargo_box.png');
    const normalMap = textureLoader.load('/textures/cargo_normal.png');
    const roughnessMap = textureLoader.load('/textures/cargo_roughness.png');

    // Create custom shader material
    const material = new THREE.ShaderMaterial({
        uniforms: {
            uTexture: { value: texture },
            uColor: { value: new THREE.Color(color) },
            uNormalMap: { value: normalMap },
            uRoughnessMap: { value: roughnessMap },
            uEdgeColor: { value: new THREE.Color(0xffffff) },
            uEdgeWidth: { value: 0.02 },
            uOpacity: { value: 1.0 } // Add this uniform for opacity control
        },
        vertexShader: `
            varying vec2 vUv;
            varying vec3 vNormal;
            varying vec3 vPosition;
            void main() {
                vUv = uv;
                vNormal = normal;
                vPosition = position;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform sampler2D uTexture;
            uniform sampler2D uNormalMap;
            uniform sampler2D uRoughnessMap;
            uniform vec3 uColor;
            uniform vec3 uEdgeColor;
            uniform float uEdgeWidth;
            uniform float uOpacity; // Add this uniform
            varying vec2 vUv;
            varying vec3 vNormal;
            varying vec3 vPosition;
            
            float edgeLine(vec2 uv, float width) {
                vec2 d = fwidth(uv);
                vec2 grid = smoothstep(0.0, width, uv) * 
                           smoothstep(1.0, 1.0 - width, uv);
                return 1.0 - min(grid.x, grid.y);
            }
            
            void main() {
                // Base color with fallback if texture fails
                vec4 texColor = texture2D(uTexture, vUv);
                vec3 baseColor = texColor.a > 0.0 ? texColor.rgb * uColor : uColor;
                
                // Edge detection
                float edge = edgeLine(vUv, uEdgeWidth);
                
                // Blend base color with edge color using the edge value as alpha
                vec3 finalColor = mix(baseColor, uEdgeColor, edge);
                
                // Normal and roughness
                vec3 normal = texture2D(uNormalMap, vUv).rgb * 2.0 - 1.0;
                float roughness = texture2D(uRoughnessMap, vUv).r;
                
                // Apply opacity
                gl_FragColor = vec4(finalColor, uOpacity); // Use uOpacity here
            }
        `,
        transparent: true, // Enable transparency
        side: THREE.DoubleSide
    });
    
    // Create the mesh
    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.userData = {
        originalColor: color,
        size: size,
        offsets: { x: xOffset, y: yOffset, z: zOffset }
    };
    return mesh;
};

// Create a fixed background grid
const createBackgroundGrid = () => {
    const gridGroup = new THREE.Group();
    const gridSize = 50;
    const gridColor = 0x000000;

    // Create X-axis lines
    for (let x = -gridSize; x <= gridSize; x++) {
        const geometry = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(x, -0.5, -gridSize),
            new THREE.Vector3(x, -0.5, gridSize)
        ]);
        const material = new THREE.LineBasicMaterial({ 
            color: gridColor,
            transparent: true,
            opacity: 0 // Make lines completely transparent
        });
        const line = new THREE.Line(geometry, material);
        gridGroup.add(line);
    }

    // Create Z-axis lines
    for (let z = -gridSize; z <= gridSize; z++) {
        const geometry = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(-gridSize, -0.5, z),
            new THREE.Vector3(gridSize, -0.5, z)
        ]);
        const material = new THREE.LineBasicMaterial({ 
            color: gridColor,
            transparent: true,
            opacity: 0 // Make lines completely transparent
        });
        const line = new THREE.Line(geometry, material);
        gridGroup.add(line);
    }

    return gridGroup;
};

// Update the createGrid function for SCU grids
const createGrid = (width, length, color = 0xffffff) => {
    const gridGroup = new THREE.Group();
    const cellSize = 1;

    // Calculate grid boundaries
    const xMin = -Math.floor(width / 2);
    const xMax = Math.ceil(width / 2);
    const zMin = -Math.floor(length / 2);
    const zMax = Math.ceil(length / 2);

    // Create X-axis lines
    for (let x = xMin; x <= xMax; x++) {
        const geometry = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(x, 0, zMin),
            new THREE.Vector3(x, 0, zMax)
        ]);
        const material = new THREE.LineBasicMaterial({ color });
        const line = new THREE.Line(geometry, material);
        gridGroup.add(line);
    }

    // Create Z-axis lines
    for (let z = zMin; z <= zMax; z++) {
        const geometry = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(xMin, 0, z),
            new THREE.Vector3(xMax, 0, z)
        ]);
        const material = new THREE.LineBasicMaterial({ color });
        const line = new THREE.Line(geometry, material);
        gridGroup.add(line);
    }

    return gridGroup;
};

// Add this before the Grid3D component
const ShipCard = ({ ship, addBlock }) => {
    const { cargoData, setCargoData } = useShipContext();
    const [isCollapsed, setIsCollapsed] = useState(false);

    // Use cargo data directly from context
    const shipCargo = cargoData[ship.id] || [];

    useEffect(() => {
        // Load cargo data when component mounts
        const savedCargo = localStorage.getItem('cargoData');
        if (savedCargo) {
            try {
                const cargoEntries = JSON.parse(savedCargo);
                setCargoData(prev => ({
                    ...prev,
                    [ship.id]: cargoEntries[ship.id] || []
                }));
            } catch (error) {
                console.error('Error loading cargo data:', error);
                setCargoData(prev => ({
                    ...prev,
                    [ship.id]: []
                }));
            }
        } else {
            setCargoData(prev => ({
                ...prev,
                [ship.id]: []
            }));
        }
    }, [ship.id, setCargoData]);

    // Calculate current load
    const currentLoad = shipCargo.reduce((sum, item) => sum + (item.scu || 0), 0);
    
    // Group cargo by SCU size
    const scuCounts = {
        '1SCU': 0,
        '2SCU': 0,
        '4SCU': 0,
        '8SCU': 0,
        '16SCU': 0,
        '32SCU': 0
    };
    
    shipCargo.forEach(item => {
        // Check all possible SCU sizes for the item
        [1, 2, 4, 8, 16, 32].forEach(scuSize => {
            const count = item[`scu${scuSize}`] || 0;
            if (count > 0) {
                const sizeKey = `${scuSize}SCU`;
                if (scuCounts.hasOwnProperty(sizeKey)) {
                    scuCounts[sizeKey] += count;
                }
            }
        });
    });
    
    // Get unique commodities
    const commodities = [...new Set(shipCargo
        .filter(item => item.name) // Ensure we only include items with a name
        .map(item => item.name)    // Get the commodity name
        .filter(name => name)      // Filter out any undefined or empty names
    )];

    // Display commodities section only if there are commodities
    const hasCommodities = commodities.length > 0;

    const handleAddToGrid = () => {
        const validSCUSizes = [1, 2, 4, 8, 16, 32];
        
        shipCargo.forEach(item => {
            validSCUSizes.forEach(scuSize => {
                const count = item[`scu${scuSize}`] || 0;
                if (count > 0) {
                    const size = `${scuSize}SCU`;
                    const commodity = item.name;
                    
                    // Add multiple blocks if count > 1
                    for (let i = 0; i < count; i++) {
                        addBlock(size, undefined, undefined, commodity);
                    }
                }
            });
        });
    };

    return (
        <div style={{ marginBottom: '20px' }}>
            <div style={{
                padding: '10px',
                backgroundColor: '#444',
                color: 'white',
                borderRadius: '4px',
                cursor: 'pointer'
            }}
            onClick={() => setIsCollapsed(!isCollapsed)}
            >
                <div style={{ 
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <h4 style={{ 
                        margin: '0',
                        fontSize: '1.1em',
                        fontWeight: 'bold'
                    }}>
                        {ship.name}
                    </h4>
                    <span style={{ fontSize: '0.8em' }}>
                        {isCollapsed ? '▼' : '▲'}
                    </span>
                </div>
                {!isCollapsed && (
                    <>
                        <div style={{ 
                            fontSize: '12px', 
                            color: '#aaa',
                            marginBottom: '10px'
                        }}>
                            Capacity: {ship.cargoCapacity} SCU<br />
                            Current Load: {currentLoad} SCU
                        </div>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(6, 1fr)',
                            gap: '4px',
                            marginBottom: '10px'
                        }}>
                            {['1SCU', '2SCU', '4SCU', '8SCU', '16SCU', '32SCU'].map((size, i) => (
                                <div key={i} style={{
                                    padding: '6px',
                                    backgroundColor: '#555',
                                    borderRadius: '4px',
                                    textAlign: 'center',
                                    fontSize: '10px'
                                }}>
                                    {size}: {scuCounts[size]}
                                </div>
                            ))}
                        </div>
                        {hasCommodities && (
                            <div style={{ 
                                fontSize: '12px', 
                                color: '#aaa',
                                marginTop: '10px'
                            }}>
                                Commodities: {commodities.join(', ')}
                            </div>
                        )}
                        
                        <button 
                            onClick={handleAddToGrid}
                            style={{
                                width: '100%',
                                padding: '8px',
                                backgroundColor: '#666',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                marginTop: '10px'
                            }}
                        >
                            Add Cargo to Grid
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

// Add this function to create axis indicators
const createAxisIndicator = () => {
    const axisGroup = new THREE.Group();
    
    // Create X axis (red)
    const xAxis = new THREE.ArrowHelper(
        new THREE.Vector3(1, 0, 0),
        new THREE.Vector3(0, 0, 0),
        5,
        0xff0000,
        0.5,
        0.3
    );
    axisGroup.add(xAxis);

    // Create Y axis (green)
    const yAxis = new THREE.ArrowHelper(
        new THREE.Vector3(0, 1, 0),
        new THREE.Vector3(0, 0, 0),
        5,
        0x00ff00,
        0.5,
        0.3
    );
    axisGroup.add(yAxis);

    // Create Z axis (blue)
    const zAxis = new THREE.ArrowHelper(
        new THREE.Vector3(0, 0, 1),
        new THREE.Vector3(0, 0, 0),
        5,
        0x0000ff,
        0.5,
        0.3
    );
    axisGroup.add(zAxis);

    // Add labels
    const createAxisLabel = (text, color, position) => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        context.font = 'Bold 20px Arial';
        context.fillStyle = color;
        context.fillText(text, 0, 20);
        
        const texture = new THREE.CanvasTexture(canvas);
        const material = new THREE.SpriteMaterial({ map: texture });
        const sprite = new THREE.Sprite(material);
        sprite.scale.set(1, 0.5, 1);
        sprite.position.copy(position);
        return sprite;
    };

    axisGroup.add(createAxisLabel('X', '#ff0000', new THREE.Vector3(6, 0, 0)));
    axisGroup.add(createAxisLabel('Y', '#00ff00', new THREE.Vector3(0, 6, 0)));
    axisGroup.add(createAxisLabel('Z', '#0000ff', new THREE.Vector3(0, 0, 6)));

    return axisGroup;
};

const Grid3D = () => {
    const mountRef = useRef(null);
    const selectedObject = useRef(null);
    const blocks = useRef([]);
    const cameraRef = useRef(null);
    const sceneRef = useRef(null);
    const dimensionsRef = useRef(null);
    const bannerRef = useRef(null);
    const rendererRef = useRef(null); // Add this line
    const [blockDetails, setBlockDetails] = useState(null);
    const [activeTab, setActiveTab] = useState('Playground');
    const [missionEntries, setMissionEntries] = useState([]);
    const [collapsedMissions, setCollapsedMissions] = useState({});
    const [activeGridTab, setActiveGridTab] = useState('Grid 1');
    const [missionsWithBlocks, setMissionsWithBlocks] = useState([]);
    const [highlightedMission, setHighlightedMission] = useState(null);
    const [showCommodities, setShowCommodities] = useState(true); // Changed from false to true
    const [highlightedCommodity, setHighlightedCommodity] = useState(null);
    const [commodityEntries, setCommodityEntries] = useState({});
    const [expandedCommodity, setExpandedCommodity] = useState(null);
    const [shipSubTab, setShipSubTab] = useState('Template');
    
    // Get ships from context
    const { ships } = useShipContext();

    // Update the grids state initialization
    const [grids, setGrids] = useState(() => {
        const savedGrids = localStorage.getItem('gridSettings');
        if (savedGrids) {
            return JSON.parse(savedGrids);
        }
        return {
            'Grid 1': {
                width: 1,
                length: 1,
                height: 20 // Set default height to 20
            },
            'Grid 2': {
                width: 1,
                length: 1,
                height: 20 // Set default height to 20
            },
            'Grid 3': {
                width: 1,
                length: 1,
                height: 20 // Set default height to 20
            },
            'Grid 4': {
                width: 1,
                length: 1,
                height: 20 // Set default height to 20
            }
        };
    });

    // Add these variables at the top of the component
    const isRotating = useRef(false);
    const lastMousePosition = useRef({ x: 0, y: 0 });
    const cameraVelocity = useRef(new THREE.Vector3());
    const movementSpeed = 0.5;
    const dampingFactor = 0.95;

    // Add these at the top of the component
    const deletedBlocks = useRef([]);

    // Add these constants at the top of the component
    const CAMERA_MOVE_SPEED = 0.1;
    const CAMERA_ROTATE_SPEED = 0.005;

    // Add this at the top of the component
    const FOCUS_POINT = new THREE.Vector3(0, 0, 0);
    const MIN_DISTANCE = 5;
    const MAX_DISTANCE = 100;

    // Update the camera speed state and ref
    const [cameraMoveSpeed, setCameraMoveSpeed] = useState(0.5);
    const cameraMoveSpeedRef = useRef(0.5);

    // Add these refs at the top of the component
    const gridWidthRef = useRef(grids['Grid 1'].width);
    const gridLengthRef = useRef(grids['Grid 1'].length);
    const gridHeightRef = useRef(grids['Grid 1'].height);

    // Add these refs at the top of the component
    const cameraPositionRef = useRef(new THREE.Vector3(5, 5, 5));
    const cameraRotationRef = useRef(new THREE.Quaternion());

    // Add these variables at the top of the component
    const keysPressed = useRef({});

    // Add this state at the top of the component
    const DEFAULT_MISSION_INDEX = -1; // Use -1 for the default mission

    // Update the renderer size state initialization
    const [rendererSize, setRendererSize] = useState(() => {
        const savedSize = localStorage.getItem('rendererSize');
        if (savedSize) {
            return JSON.parse(savedSize);
        }
        return { width: 1500, height: 800 }; // Set default size to 1500x800
    });

    // Update the input change handlers
    const updateGridSettings = (gridName, newSettings) => {
        setGrids(prev => {
            const updatedGrids = {
                ...prev,
                [gridName]: {
                    ...prev[gridName],
                    ...newSettings
                }
            };
            // Save to localStorage
            localStorage.setItem('gridSettings', JSON.stringify(updatedGrids));
            return updatedGrids;
        });
    };

    const handleWidthChange = (e) => {
        const value = e.target.value;
        if (value === '') return;
        const newValue = Math.min(Math.max(parseInt(value), 1), 20);
        updateGridSettings(activeGridTab, { width: newValue });
        setSelectedShipTemplate(null); // Clear the selected template
    };

    const handleLengthChange = (e) => {
        const value = e.target.value;
        if (value === '') return;
        const newValue = Math.min(Math.max(parseInt(value), 1), 20);
        updateGridSettings(activeGridTab, { length: newValue });
        setSelectedShipTemplate(null); // Clear the selected template
    };

    const handleHeightChange = (e) => {
        const value = e.target.value;
        if (value === '') return;
        const newValue = Math.min(Math.max(parseInt(value), 1), 20);
        
        // Update the grid settings
        updateGridSettings(activeGridTab, { height: newValue });
        
        // Update the height reference
        gridHeightRef.current = newValue;
        
        // Get the scene
        if (sceneRef && sceneRef.current) {
            const scene = sceneRef.current;
            
            // Remove existing grid
            const existingGrid = scene.getObjectByName(activeGridTab);
            if (existingGrid) {
                scene.remove(existingGrid);
            }
            
            // Remove existing background
            const existingBackground = scene.getObjectByName(`${activeGridTab}-background`);
            if (existingBackground) {
                scene.remove(existingBackground);
            }
            
            // Find the createDedicatedGrids function from the component context and call it
            // This should recreate the grid with the updated height
            const gridData = {
                ...grids[activeGridTab],
                height: newValue
            };
            
            // Recreate the grid with new dimensions
            const newGrid = createGrid(
                gridData.width,
                gridData.length,
                0xffffff
            );
            newGrid.name = activeGridTab;
            newGrid.userData = { ...gridData, maxHeight: newValue };
            scene.add(newGrid);
            
            // Recreate background grid
            const backgroundGrid = createBackgroundGrid();
            backgroundGrid.name = `${activeGridTab}-background`;
            
            // Position the background grid according to the grid dimensions
            backgroundGrid.position.set(
                gridData.width / 2,
                gridData.height, // Use the new height
                gridData.length / 2
            );
            scene.add(backgroundGrid);
        }
        
        // Force re-render by updating a state
        setGrids(prev => {
            return { ...prev };
        });
        
        setSelectedShipTemplate(null);
    };

    // Helper function to snap to grid
    const snapToGrid = (value, gridSize) => {
        return Math.round(value / gridSize) * gridSize;
    };

    // Update the updateDimension function
    const updateDimension = (type, value, gridName) => {
        const newValue = parseInt(value);
        if (!isNaN(newValue) && newValue >= 1 && newValue <= 20) {
            // Update the refs
            if (type === 'width') gridWidthRef.current = newValue;
            if (type === 'length') gridLengthRef.current = newValue;
            if (type === 'height') gridHeightRef.current = newValue;

            // Update the scene directly
            const scene = sceneRef.current;
            const grid = scene.getObjectByName(gridName);
            if (grid) {
                // Remove all existing lines from the grid
                while (grid.children.length > 0) {
                    const child = grid.children[0];
                    child.geometry.dispose();
                    grid.remove(child);
                }

                // Create new grid lines with updated dimensions
                const cellSize = 1;
                const xMin = -Math.floor(gridWidthRef.current / 2);
                const xMax = Math.ceil(gridWidthRef.current / 2);
                const zMin = -Math.floor(gridLengthRef.current / 2);
                const zMax = Math.ceil(gridLengthRef.current / 2);

                // Create X-axis lines (width)
                for (let x = xMin; x <= xMax; x += cellSize) {
                    const geometry = new THREE.BufferGeometry().setFromPoints([
                        new THREE.Vector3(x, 0, zMin),
                        new THREE.Vector3(x, 0, zMax)
                    ]);
                    const material = new THREE.LineBasicMaterial({ color: 0xffffff });
                    const line = new THREE.Line(geometry, material);
                    grid.add(line);
                }

                // Create Z-axis lines (length)
                for (let z = zMin; z <= zMax; z += cellSize) {
                    const geometry = new THREE.BufferGeometry().setFromPoints([
                        new THREE.Vector3(xMin, 0, z),
                        new THREE.Vector3(xMax, 0, z)
                    ]);
                    const material = new THREE.LineBasicMaterial({ color: 0xffffff });
                    const line = new THREE.Line(geometry, material);
                    grid.add(line);
                }
            }

            // Update the UI display without state
            if (dimensionsRef.current) {
                dimensionsRef.current.innerHTML = `
                    Grid Stats:<br>
                    Width: ${gridWidthRef.current} blocks<br>
                    Length: ${gridLengthRef.current} blocks<br>
                    Height: ${gridHeightRef.current} blocks<br>
                    Total Cells: ${gridWidthRef.current * gridLengthRef.current}
                `;
            }
        }
    };

    // Update the saveBlocksToLocalStorage function
    const saveBlocksToLocalStorage = () => {
        const blocksToSave = blocks.current
            .filter(block => {
                // Check if block is on any of the grids
                const grid = sceneRef.current.children.find(
                    obj => obj.userData && 
                           obj.userData.size === getBlockSize(block)
                );
                return grid !== undefined;
            })
            .map(block => {
                // Ensure we have a valid color value
                let colorValue;
                if (block.userData.originalColor instanceof THREE.Color) {
                    colorValue = block.userData.originalColor.getHex();
                } else if (typeof block.userData.originalColor === 'number') {
                    colorValue = block.userData.originalColor;
                } else {
                    // Fallback to default color based on size
                    const sizeColors = {
                        '1SCU': 0x00ff00,
                        '2SCU': 0x0000ff,
                        '4SCU': 0xff00ff,
                        '8SCU': 0xffa500,
                        '16SCU': 0x800080,
                        '32SCU': 0xff0000
                    };
                    colorValue = sizeColors[getBlockSize(block)] || 0xffffff;
                }

                return {
                    size: getBlockSize(block),
                    position: {
                        x: block.position.x,
                        y: block.position.y,
                        z: block.position.z
                    },
                    rotation: block.rotation.y,
                    missionIndex: block.userData.missionIndex,
                    commodity: block.userData.commodity,
                    color: colorValue
                };
            });
        
        localStorage.setItem('savedBlocks', JSON.stringify(blocksToSave));
    };

    // Update the addBlock function
    const addBlock = (size = '4SCU', color, missionIndex, commodity) => {
        const scene = sceneRef.current;
        if (!scene) return null;

        // Define default colors for each SCU size
        const sizeColors = {
            '1SCU': 0x00ff00, // Green
            '2SCU': 0x0000ff, // Blue
            '4SCU': 0xff00ff, // Magenta
            '8SCU': 0xffa500, // Orange
            '16SCU': 0x800080, // Purple
            '32SCU': 0xff0000 // Red
        };

        // Use the passed color if provided, otherwise use the default for the size
        const blockColor = color || sizeColors[size];

        const newBlock = createBlock(size, blockColor);
        const blockHeight = newBlock.geometry.parameters.height;

        // Find the dedicated grid for this size
        const dedicatedGrid = scene.children.find(
            obj => obj.userData && obj.userData.size === size
        );

        if (!dedicatedGrid) {
            console.error(`No dedicated grid found for size ${size}`);
            return null;
        }

        // Get grid cell size from userData
        const cellSize = dedicatedGrid.userData.cellSize || 1;
        const gridSize = dedicatedGrid.userData.size === '32SCU' ? 16 : 
                        dedicatedGrid.userData.size === '16SCU' ? 8 : 
                        dedicatedGrid.userData.size === '2SCU' ? 6 : 
                        dedicatedGrid.userData.size === '4SCU' ? 8 : 
                        dedicatedGrid.userData.size === '8SCU' ? 8 : 5;

        // Calculate number of blocks per row and column based on size
        const blocksPerRow = Math.floor(gridSize / (newBlock.geometry.parameters.width * cellSize));
        const blocksPerColumn = Math.floor(gridSize / (newBlock.geometry.parameters.depth * cellSize));

        // Find all existing blocks in this grid
        const gridBlocks = blocks.current.filter(block => {
            const blockGrid = scene.children.find(
                obj => obj.userData && 
                       obj.userData.size === getBlockSize(block) &&
                       obj === dedicatedGrid
            );
            return blockGrid !== undefined;
        });

        // Find the first available position in the grid
        let foundPosition = false;
        let col = 0, row = 0;
        let newPosition = new THREE.Vector3();

        for (row = 0; row < blocksPerColumn && !foundPosition; row++) {
            for (col = 0; col < blocksPerRow && !foundPosition; col++) {
                // Calculate position for this cell
                const xPos = dedicatedGrid.position.x - (gridSize / 2) + (col * newBlock.geometry.parameters.width) + (newBlock.geometry.parameters.width / 2);
                const zPos = dedicatedGrid.position.z + (gridSize / 2) - (row * newBlock.geometry.parameters.depth) - (newBlock.geometry.parameters.depth / 2);

                // Check if this position is occupied
                const blocksAtPosition = gridBlocks.filter(block => 
                    Math.abs(block.position.x - xPos) < 0.1 &&
                    Math.abs(block.position.z - zPos) < 0.1
                );

                // If position is empty, place at bottom
                if (blocksAtPosition.length === 0) {
                    newPosition.set(xPos, newBlock.geometry.parameters.height / 2, zPos);
                    foundPosition = true;
                }
            }
        }

        // If no empty positions found, stack on top of existing blocks
        if (!foundPosition) {
            // Find the first position with the lowest stack
            let minStackHeight = Infinity;
            let stackPosition = new THREE.Vector3();
            
            for (row = 0; row < blocksPerColumn; row++) {
                for (col = 0; col < blocksPerRow; col++) {
                    const xPos = dedicatedGrid.position.x - (gridSize / 2) + (col * newBlock.geometry.parameters.width) + (newBlock.geometry.parameters.width / 2);
                    const zPos = dedicatedGrid.position.z + (gridSize / 2) - (row * newBlock.geometry.parameters.depth) - (newBlock.geometry.parameters.depth / 2);

                    const blocksAtPosition = gridBlocks.filter(block => 
                        Math.abs(block.position.x - xPos) < 0.1 &&
                        Math.abs(block.position.z - zPos) < 0.1
                    );

                    const stackHeight = blocksAtPosition.reduce((sum, block) => 
                        sum + block.geometry.parameters.height, 0
                    );

                    if (stackHeight < minStackHeight) {
                        minStackHeight = stackHeight;
                        stackPosition.set(xPos, stackHeight + (newBlock.geometry.parameters.height / 2), zPos);
                    }
                }
            }
            
            newPosition.copy(stackPosition);
            foundPosition = true;
        }

        if (!foundPosition) {
            console.warn('No available position found in grid');
            return null;
        }

        // Skip collision check for all SCU sizes when using Add button
        newBlock.position.copy(newPosition);

        // Add mission and commodity data to the block
        if (missionIndex !== undefined) {
            newBlock.userData.missionIndex = missionIndex;
            newBlock.userData.commodity = commodity;
        } else if (commodity !== undefined) {
            // If no mission is selected but commodity is provided
            newBlock.userData.commodity = commodity;
            // Use default color for the SCU size
            newBlock.userData.originalColor = new THREE.Color(blockColor);
        } else {
            // If no mission or commodity is selected, use the default color for the SCU size
            newBlock.userData.originalColor = new THREE.Color(blockColor);
        }

        scene.add(newBlock);
        blocks.current.push(newBlock);

        // Update missions with blocks
        updateMissionsWithBlocks();

        // Log block creation and position
        console.log(`Added ${size} block for ${commodity} at position:`, newBlock.position);

        // Save blocks after adding
        saveBlocksToLocalStorage();

        return newBlock;
    };

    // Move checkCollision inside the component
    const checkCollision = (movingBlock, newPosition, blocks, gridName, bannerRef) => {
        const gridHeight = grids[gridName].height;
        
        // Get the block's dimensions
        const width = movingBlock.geometry.parameters.width;
        const height = movingBlock.geometry.parameters.height;
        const depth = movingBlock.geometry.parameters.depth;

        // Create a box that accounts for rotation
        const movingBox = new THREE.Box3(
            new THREE.Vector3(-width / 2, -height / 2, -depth / 2),
            new THREE.Vector3(width / 2, height / 2, depth / 2)
        );

        // Apply rotation
        const rotationMatrix = new THREE.Matrix4().makeRotationY(movingBlock.rotation.y);
        movingBox.applyMatrix4(rotationMatrix);

        // Translate to new position
        movingBox.translate(newPosition);

        let highestY = 0;
        let collisionDetected = false;

        for (const block of blocks) {
            if (block !== movingBlock) {
                // Get the other block's dimensions
                const otherWidth = block.geometry.parameters.width;
                const otherHeight = block.geometry.parameters.height;
                const otherDepth = block.geometry.parameters.depth;

                // Create a box for the other block
                const blockBox = new THREE.Box3(
                    new THREE.Vector3(-otherWidth / 2, -otherHeight / 2, -otherDepth / 2),
                    new THREE.Vector3(otherWidth / 2, otherHeight / 2, otherDepth / 2)
                );

                // Apply rotation to the other block
                const otherRotationMatrix = new THREE.Matrix4().makeRotationY(block.rotation.y);
                blockBox.applyMatrix4(otherRotationMatrix);

                // Translate to the block's position
                blockBox.translate(block.position);

                // Check for collision
                const xOverlap = movingBox.min.x < blockBox.max.x &&
                                movingBox.max.x > blockBox.min.x;
                const zOverlap = movingBox.min.z < blockBox.max.z &&
                                movingBox.max.z > blockBox.min.z;
                
                if (xOverlap && zOverlap) {
                    collisionDetected = true;
                    highestY = Math.max(highestY, blockBox.max.y);
                }
            }
        }

        const newY = highestY + (height / 2);
        const maxAllowedY = gridHeight - (height / 2);

        if (newY > maxAllowedY) {
            if (bannerRef && bannerRef.current) {
                bannerRef.current.textContent = `Cannot place block: would exceed grid height (${newY} > ${maxAllowedY})`;
                bannerRef.current.style.display = 'block';
                setTimeout(() => {
                    if (bannerRef.current) {
                        bannerRef.current.style.display = 'none';
                    }
                }, 3000);
            }
            return { 
                position: movingBlock.position,
                collision: true
            };
        }

        return { 
            position: new THREE.Vector3(
                newPosition.x,
                newY,
                newPosition.z
            ),
            collision: collisionDetected
        };
    };

    // Update the getMissionColor function
    const getMissionColor = (missionIndex) => {
        // Use more diverse and vibrant colors
        const missionColors = [
            0xFF5733, // Vibrant Orange
            0x33FF57, // Lime Green
            0x3357FF, // Bright Blue
            0xFF33A1, // Hot Pink
            0x33FFF5, // Cyan
            0xF5FF33, // Yellow
            0x8E33FF, // Purple
            0xFF3333, // Red
            0x33FF8E, // Mint Green
            0x338EFF, // Sky Blue
            0xFF8E33, // Orange
            0x33FF33, // Neon Green
            0x5733FF, // Royal Blue
            0xFF33F5, // Magenta
            0x33F5FF  // Aqua
        ];
        return missionColors[missionIndex % missionColors.length];
    };

    // Update the createDedicatedGrids function
    const createDedicatedGrids = (scene) => {
        const gridPositions = {
            '1SCU': { x: -20, z: -20.5, size: 5, height: 5, cellSize: 1 },
            '2SCU': { x: -20, z: 0.5, size: 6, height: 6, cellSize: 1 },
            '4SCU': { x: -20, z: 20.5, size: 8, height: 8, cellSize: 1 },
            '8SCU': { x: -40, z: -20.5, size: 8, height: 10, cellSize: 1 },
            '16SCU': { x: -40, z: 0.5, size: 8, height: 12, cellSize: 1 },
            '32SCU': { x: -40, z: 20.5, size: 16, height: 15, cellSize: 1 },
        };

        Object.entries(gridPositions).forEach(([size, position]) => {
            const grid = createGrid(position.size, position.size);
            
            // Calculate grid position based on cell size
            const gridWidth = position.size * position.cellSize;
            const gridLength = position.size * position.cellSize;
            
            // Adjust position to center the grid
            grid.position.set(
                position.x,
                0,
                position.z
            );
            
            grid.userData = { 
                size: size, 
                maxHeight: position.height,
                cellSize: position.cellSize
            };
            scene.add(grid);
        });
    };

    // Update the createGrids function to position grids separately
    const createGrids = (scene, grids) => {
        const gridPositions = {
            'Grid 1': { 
                x: 0, 
                z: 37.5,
                rotation: 0
            },
            'Grid 2': { 
                x: 0, 
                z: 16.5,
                rotation: 0
            },
            'Grid 3': { 
                x: 0, 
                z: -4.5,
                rotation: 0
            },
            'Grid 4': { 
                x: 0, 
                z: -25.5,
                rotation: 0
            }
        };

        Object.entries(gridPositions).forEach(([name, position]) => {
            // Create new grid if it doesn't exist
            let grid = scene.getObjectByName(name);
            if (!grid) {
                grid = createGrid(grids[name].width, grids[name].length);
                grid.name = name;
                scene.add(grid);
            }

            // Set position and rotation
            grid.position.set(position.x, 0, position.z);
            grid.rotation.y = position.rotation;

            // Update grid geometry if width or length changed
            if (grid.geometry) {
                const newGeometry = new THREE.BoxGeometry(grids[name].width, 1, grids[name].length);
                grid.geometry.dispose();
                grid.geometry = newGeometry;
            }

            // Hide grid if it's 1x1, show if larger
            grid.visible = !(grids[name].width === 1 && grids[name].length === 1);
        });
    };

    // Update the createBackgroundPlanes function to match new grid positions
    const createBackgroundPlanes = (scene, grids) => {
        const gridPositions = {
            'Grid 1': { x: -20, z: -20 },
            'Grid 2': { x: 20, z: -20 },
            'Grid 3': { x: -20, z: 20 },
            'Grid 4': { x: 20, z: 20 }
        };

        Object.entries(gridPositions).forEach(([name, position]) => {
            const planeGeometry = new THREE.PlaneGeometry(grids[name].width, grids[name].length);
            const planeMaterial = new THREE.MeshBasicMaterial({ 
                color: 0x1a1a1a,
                side: THREE.DoubleSide
            });
            const plane = new THREE.Mesh(planeGeometry, planeMaterial);
            plane.rotation.x = Math.PI / 2;
            plane.position.set(position.x, -1.01, position.z);
            scene.add(plane);
        });
    };

    useEffect(() => {
        // Scene setup
        const scene = new THREE.Scene();
        sceneRef.current = scene;
        
        // Set background color
        scene.background = new THREE.Color(0x1a1a1a);
        
        // Add axis indicator
        const axisIndicator = createAxisIndicator();
        axisIndicator.position.set(-45, 0, -45);
        scene.add(axisIndicator);

        // Remove the duplicate grid creation code from here
        // Only call createDedicatedGrids once
        createDedicatedGrids(scene);

        // Enhanced lighting setup
        const ambientLight = new THREE.AmbientLight(0x404040, 0.8);
        scene.add(ambientLight);
        
        // Add multiple directional lights from different angles
        const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight1.position.set(5, 5, 5).normalize();
        scene.add(directionalLight1);

        const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.6);
        directionalLight2.position.set(-5, 5, -5).normalize();
        scene.add(directionalLight2);

        const directionalLight3 = new THREE.DirectionalLight(0xffffff, 0.6);
        directionalLight3.position.set(-5, 5, 5).normalize();
        scene.add(directionalLight3);

        const directionalLight4 = new THREE.DirectionalLight(0xffffff, 0.6);
        directionalLight4.position.set(5, 5, -5).normalize();
        scene.add(directionalLight4);

        // Add a point light for additional depth
        const pointLight = new THREE.PointLight(0xffffff, 0.8, 20);
        pointLight.position.set(0, 10, 0);
        scene.add(pointLight);

        // Add a hemisphere light for more natural lighting
        const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.6);
        scene.add(hemisphereLight);

        const camera = new THREE.PerspectiveCamera(
            75, 
            window.innerWidth / window.innerHeight, 
            0.1, 
            1000
        );

        // Set default position and rotation - increase the Y and Z values to zoom out
        camera.position.set(20, 30, 20); // Changed from (10, 10, 0) to (20, 30, 20)
        const euler = new THREE.Euler(
            THREE.MathUtils.degToRad(-89.61),
            THREE.MathUtils.degToRad(36.25),
            THREE.MathUtils.degToRad(89.34)
        );
        camera.quaternion.setFromEuler(euler);

        cameraRef.current = camera;
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(rendererSize.width, rendererSize.height);
        mountRef.current.appendChild(renderer.domElement);
        rendererRef.current = renderer; // Store the renderer in the ref

        // Create the grids
        createGrids(scene, grids);

        // Add white background planes for each grid
        createBackgroundPlanes(scene, grids);

        // Force an initial render after scene setup
        renderer.render(scene, camera);

        // Simulate mouse movement after a short delay
        setTimeout(() => {
            if (mountRef.current) {
                const rect = mountRef.current.getBoundingClientRect();
                
                // Create a simulated mouse event
                const simulateMouseMove = (clientX, clientY) => {
                    const event = new MouseEvent('mousemove', {
                        clientX: clientX,
                        clientY: clientY,
                        bubbles: true
                    });
                    mountRef.current.dispatchEvent(event);
                };

                // Get center of the canvas
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;

                // Simulate movement to the right
                simulateMouseMove(centerX + 50, centerY);
                
                // Wait a bit then simulate movement back to the left
                setTimeout(() => {
                    simulateMouseMove(centerX - 50, centerY);
                }, 100);
            }
        }, 100); // Delay to ensure everything is initialized

        // Initialize empty blocks array
        blocks.current = [];

        // Click handling
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        // Drag handling
        const onMouseDown = (event) => {
            // Get the canvas's bounding rectangle
            const rect = renderer.domElement.getBoundingClientRect();
            
            // Calculate mouse position in normalized device coordinates
            mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

            // Update the picking ray with the camera and mouse position
            raycaster.setFromCamera(mouse, camera);

            // Calculate objects intersecting the picking ray
            const intersects = raycaster.intersectObjects(blocks.current);

            if (blockCellMode && !intersects.length) {
                // If in block cell mode and clicking empty space
                const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
                const intersection = new THREE.Vector3();
                raycaster.ray.intersectPlane(plane, intersection);

                // Snap to grid
                const snappedX = Math.round(intersection.x);
                const snappedZ = Math.round(intersection.z);

                // Toggle cell block state
                handleCellBlock(activeGridTab, snappedX, snappedZ);
            } else if (intersects.length > 0) {
                // Left click - select block
                if (event.button === 0) { // 0 = left click
                const clickedBlock = intersects[0].object;
                
                // Only update if clicking a different block
                if (!selectedObject.current || selectedObject.current !== clickedBlock) {
                    // Deselect previous block if any
                    if (selectedObject.current) {
                            // Restore original color
                            selectedObject.current.material.uniforms.uColor.value.set(
                                selectedObject.current.userData.originalColor
                            );
                    }
                    
                    selectedObject.current = clickedBlock;
                    // Change color to yellow when selected
                        selectedObject.current.material.uniforms.uColor.value.set(0xffff00);
                    
                    // Update block details
                    const block = selectedObject.current;
                    const size = getBlockSize(block);
                    setBlockDetails({
                        size: size,
                        position: {
                            x: block.position.x.toFixed(2),
                            y: block.position.y.toFixed(2),
                            z: block.position.z.toFixed(2)
                        },
                        dimensions: {
                            width: block.geometry.parameters.width,
                            height: block.geometry.parameters.height,
                            depth: block.geometry.parameters.depth
                        }
                    });
                }
                }
                // Right click - start rotating
                else if (event.button === 2) { // 2 = right click
                    isRotating.current = true;
                    lastMousePosition.current = {
                        x: event.clientX,
                        y: event.clientY
                    };
                }
            } else {
                // Clicked empty space - start rotating
                isRotating.current = true;
                lastMousePosition.current = {
                    x: event.clientX,
                    y: event.clientY
                };
            }
        };

        const onMouseMove = (event) => {
            if (isRotating.current) {
                // Calculate mouse movement (inverted)
                const deltaX = lastMousePosition.current.x - event.clientX;
                const deltaY = lastMousePosition.current.y - event.clientY;
                
                // Get current camera position relative to focus point
                const camera = cameraRef.current;
                const offset = new THREE.Vector3()
                    .subVectors(camera.position, FOCUS_POINT);
                
                // Calculate horizontal rotation (around Y-axis)
                const horizontalAngle = deltaX * CAMERA_ROTATE_SPEED;
                const horizontalRotation = new THREE.Quaternion()
                    .setFromAxisAngle(new THREE.Vector3(0, 1, 0), horizontalAngle);
                
                // Calculate vertical rotation (around camera's right vector)
                const verticalAngle = deltaY * CAMERA_ROTATE_SPEED;
                const cameraRight = new THREE.Vector3()
                    .crossVectors(new THREE.Vector3(0, 1, 0), offset)
                    .normalize();
                
                // Limit vertical rotation to prevent flipping
                const currentVerticalAngle = Math.asin(cameraRight.y);
                const maxVerticalAngle = Math.PI / 2 - 0.1; // 90 degrees minus a small buffer
                const minVerticalAngle = -Math.PI / 2 + 0.1; // -90 degrees plus a small buffer
                
                if (currentVerticalAngle + verticalAngle > maxVerticalAngle) {
                    verticalAngle = maxVerticalAngle - currentVerticalAngle;
                } else if (currentVerticalAngle + verticalAngle < minVerticalAngle) {
                    verticalAngle = minVerticalAngle - currentVerticalAngle;
                }
                
                const verticalRotation = new THREE.Quaternion()
                    .setFromAxisAngle(cameraRight, verticalAngle);
                
                // Combine rotations
                const combinedRotation = horizontalRotation.multiply(verticalRotation);
                
                // Apply rotation to camera position
                offset.applyQuaternion(combinedRotation);
                
                // Update camera position
                camera.position.copy(FOCUS_POINT).add(offset);
                
                // Prevent camera from going below the grid
                const minY = 5; // Set this to the minimum Y value you want
                if (camera.position.y < minY) {
                    camera.position.y = minY;
                }
                
                // Update camera to look at focus point
                camera.lookAt(FOCUS_POINT);
                
                // Update last mouse position
                lastMousePosition.current = {
                    x: event.clientX,
                    y: event.clientY
                };
            } else if (selectedObject.current) {
                // Get the canvas's bounding rectangle
                const rect = renderer.domElement.getBoundingClientRect();
                
                // Calculate mouse position in normalized device coordinates
                mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
                mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

                // Update the picking ray with the camera and mouse position
                raycaster.setFromCamera(mouse, camera);

                // Create a plane at the block's current height
                const blockHeight = selectedObject.current.geometry.parameters.height;
                const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -blockHeight / 2);
                const intersection = new THREE.Vector3();
                raycaster.ray.intersectPlane(plane, intersection);

                // Get block dimensions
                const blockWidth = selectedObject.current.geometry.parameters.width;
                const blockDepth = selectedObject.current.geometry.parameters.depth;

                // Get block dimensions and offsets
                const { x: xOffset, z: zOffset } = selectedObject.current.userData.offsets;

                // Calculate snapped positions with offsets
                let snappedX = Math.round(intersection.x - xOffset) + xOffset;
                let snappedZ = Math.round(intersection.z - zOffset) + zOffset;

                // Update the block depth snapping logic
                if (blockDepth === 1) {
                    snappedZ = Math.floor(intersection.z - zOffset) + zOffset;
                } else if (blockDepth === 2) {
                    snappedZ = Math.round(intersection.z - zOffset) + zOffset;
                } else if (blockDepth === 4) {
                    snappedZ = Math.round(intersection.z - zOffset) + zOffset;
                } else if (blockDepth === 8) {
                    snappedZ = Math.round(intersection.z - zOffset) + zOffset;
                }

                // Find all blocks at this position to calculate stack height
                const blocksAtPosition = blocks.current.filter(block => 
                    Math.abs(block.position.x - snappedX) < 0.1 &&
                    Math.abs(block.position.z - snappedZ) < 0.1 &&
                    block !== selectedObject.current
                );

                // Calculate stack height
                const stackHeight = blocksAtPosition.reduce((sum, block) => 
                    sum + block.geometry.parameters.height, 0
                );

                // Create new position vector with correct Y position
                const newPosition = new THREE.Vector3(
                    snappedX,
                    stackHeight + (blockHeight / 2),
                    snappedZ
                );

                // Check for collision and get new position
                const { position: finalPosition, collision } = checkCollision(
                    selectedObject.current, 
                    newPosition, 
                    blocks.current, 
                    activeGridTab,  // Pass the active grid tab name
                    bannerRef
                );

                // Update block position
                selectedObject.current.position.copy(finalPosition);

                // Maintain highlight color if in commodity view
                if (showCommodities && selectedObject.current.userData.commodity) {
                    const commodityColor = new THREE.Color(
                        Math.abs(hashCode(selectedObject.current.userData.commodity) % 0xffffff)
                    );
                    if (highlightedCommodity === selectedObject.current.userData.commodity) {
                        const highlightColor = commodityColor.multiplyScalar(1.5);
                        selectedObject.current.material.uniforms.uColor.value.copy(highlightColor);
                    } else {
                        selectedObject.current.material.uniforms.uColor.value.copy(commodityColor);
                    }
                }

                // Log block movement
                console.log(`Moving block to position:`, finalPosition);
            }
        };

        const onMouseUp = () => {
            if (selectedObject.current) {
                // If in commodity view and block has a commodity
                if (showCommodities && selectedObject.current.userData.commodity) {
                    const commodityColor = new THREE.Color(
                        Math.abs(hashCode(selectedObject.current.userData.commodity) % 0xffffff)
                    );
                    
                    // If this commodity is highlighted, maintain the glow
                    if (highlightedCommodity === selectedObject.current.userData.commodity) {
                        const highlightColor = commodityColor.multiplyScalar(1.5);
                        selectedObject.current.material.uniforms.uColor.value.copy(highlightColor);
                    } 
                    // Otherwise, apply normal commodity color (not dimmed)
                    else {
                        selectedObject.current.material.uniforms.uColor.value.copy(commodityColor);
                    }
                }
                // If not in commodity view, restore original color
                else {
                    selectedObject.current.material.uniforms.uColor.value.set(
                        selectedObject.current.userData.originalColor
                    );
                }
                
                selectedObject.current = null;
                // Save blocks after moving
                saveBlocksToLocalStorage();
            }
            isRotating.current = false;
        };

        const onMouseLeave = () => {
            if (selectedObject.current) {
                // If in commodity view and block has a commodity
                if (showCommodities && selectedObject.current.userData.commodity) {
                    const commodityColor = new THREE.Color(
                        Math.abs(hashCode(selectedObject.current.userData.commodity) % 0xffffff)
                    );
                    
                    // If this commodity is highlighted, maintain the glow
                    if (highlightedCommodity === selectedObject.current.userData.commodity) {
                        const highlightColor = commodityColor.multiplyScalar(1.5);
                        selectedObject.current.material.uniforms.uColor.value.copy(highlightColor);
                    } 
                    // Otherwise, apply normal commodity color (not dimmed)
                    else {
                        selectedObject.current.material.uniforms.uColor.value.copy(commodityColor);
                    }
                }
                // If not in commodity view, restore original color
                else {
                    selectedObject.current.material.uniforms.uColor.value.set(
                        selectedObject.current.userData.originalColor
                    );
                }
                
                selectedObject.current = null;
            }
            isRotating.current = false;
        };

        mountRef.current.addEventListener('mousedown', onMouseDown);
        mountRef.current.addEventListener('mousemove', onMouseMove);
        mountRef.current.addEventListener('mouseup', onMouseUp);
        mountRef.current.addEventListener('mouseleave', onMouseLeave); // Add this line

        let animationFrameId;
        const animate = () => {
            // Apply camera movement
            if (cameraRef.current) {
                const forward = new THREE.Vector3(0, 0, -1);
                forward.applyQuaternion(cameraRef.current.quaternion);
                forward.y = 0; // Keep movement on the XZ plane
                forward.normalize();

                const right = new THREE.Vector3(1, 0, 0);
                right.applyQuaternion(cameraRef.current.quaternion);
                right.y = 0; // Keep movement on the XZ plane
                right.normalize();

                const movement = new THREE.Vector3();

                if (keysPressed.current['w']) {
                    movement.addScaledVector(forward, movementSpeed);
                }
                if (keysPressed.current['s']) {
                    movement.addScaledVector(forward, -movementSpeed);
                }
                if (keysPressed.current['a']) {
                    movement.addScaledVector(right, -movementSpeed);
                }
                if (keysPressed.current['d']) {
                    movement.addScaledVector(right, movementSpeed);
                }

                // Update camera position
                cameraRef.current.position.add(movement);
                FOCUS_POINT.add(movement);
                cameraRef.current.lookAt(FOCUS_POINT);
            }

            renderer.render(scene, camera);
            animationFrameId = requestAnimationFrame(animate);
        };
        animate();

        // Update the onKeyDown function
        const onKeyDown = (event) => {
            if ((event.key === 'r' || event.key === 'R') && selectedObject.current) {
                const block = selectedObject.current;
                
                // Rotate the block 90 degrees around the Y axis
                block.rotation.y += Math.PI / 2;
                
                // Normalize the rotation to keep it between 0 and 2π
                if (block.rotation.y >= Math.PI * 2) {
                    block.rotation.y = 0;
                }
                
                // Calculate new position based on rotation
                const { width, depth } = block.geometry.parameters;
                const { x, z } = block.position;
                
                // Special handling for 16SCU blocks
                if (getBlockSize(block) === '16SCU') {
                    // For 16SCU blocks, we need to snap to 2-block increments
                    let snappedX, snappedZ;
                    const isRotated = Math.abs(block.rotation.y % (Math.PI / 2)) > 0.01;
                    
                    if (!isRotated) {
                        // 0 or 180 degrees - use original width/depth
                        snappedX = Math.floor(x / 2) * 2;
                        snappedZ = Math.floor(z / 4) * 4;
                        
                        // Adjust position to center the block
                        snappedX += (x >= 0) ? 1 : -1; // Center in width
                        snappedZ += (z >= 0) ? 2 : -2; // Center in depth
                    } else {
                        // 90 or 270 degrees - swap width and depth
                        snappedX = Math.floor(x / 4) * 4;
                        snappedZ = Math.floor(z / 2) * 2;
                        
                        // Adjust position to center the block
                        snappedX += (x >= 0) ? 2 : -2; // Center in depth
                        snappedZ += (z >= 0) ? 1 : -1; // Center in width
                    }
                    
                    block.position.set(snappedX, block.position.y, snappedZ);
                } else {
                    // Default snapping for other block sizes
                    let snappedX, snappedZ;
                    if (Math.abs(block.rotation.y % Math.PI) < 0.01) {
                        // 0 or 180 degrees - use original width/depth
                        snappedX = Math.round(x / width) * width;
                        snappedZ = Math.round(z / depth) * depth;
                    } else {
                        // 90 or 270 degrees - swap width and depth
                        snappedX = Math.round(x / depth) * depth;
                        snappedZ = Math.round(z / width) * width;
                    }
                    
                    block.position.set(snappedX, block.position.y, snappedZ);
                }
                
                // Update block details if needed
                if (blockDetails) {
                    setBlockDetails(prev => ({
                        ...prev,
                        rotation: block.rotation.y * (180 / Math.PI) // Convert to degrees
                    }));
                }
                
                // Save blocks after rotation
                saveBlocksToLocalStorage();
            }
            // Handle Delete key
            else if (event.key === 'Delete' && selectedObject.current) {
                // Remove the selected block
                const blockToRemove = selectedObject.current;
                scene.remove(blockToRemove);
                blocks.current = blocks.current.filter(block => block !== blockToRemove);
                // Store the deleted block for undo
                deletedBlocks.current.push({
                    block: blockToRemove,
                    position: blockToRemove.position.clone()
                });
                selectedObject.current = null;
                setBlockDetails(null);
                
                // Save blocks after deletion
                saveBlocksToLocalStorage();
            }
            // Handle Undo (Ctrl+Z or Cmd+Z)
            else if ((event.ctrlKey || event.metaKey) && event.key === 'z') {
                // Undo last deletion
                const lastDeleted = deletedBlocks.current.pop();
                if (lastDeleted) {
                    scene.add(lastDeleted.block);
                    blocks.current.push(lastDeleted.block);
                    // Restore position
                    lastDeleted.block.position.copy(lastDeleted.position);
                }
                
                // Save blocks after undo
                saveBlocksToLocalStorage();
            }
        };

        window.addEventListener('keydown', onKeyDown);

        // Enable shadows in the renderer
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // Add this inside the useEffect hook where the event listeners are set up
        const handleWheel = (e) => {
            if (!cameraRef.current) return;
            
            const zoomSpeed = 0.01 * cameraMoveSpeedRef.current; // Use the current speed
            const direction = new THREE.Vector3()
                .subVectors(cameraRef.current.position, FOCUS_POINT)
                .normalize();
            
            // Move camera along its view direction
            cameraRef.current.position.addScaledVector(direction, e.deltaY * zoomSpeed);
            
            // Clamp zoom between reasonable limits
            const distance = cameraRef.current.position.distanceTo(FOCUS_POINT);
            const clampedDistance = Math.min(
                Math.max(distance, MIN_DISTANCE),
                MAX_DISTANCE
            );
            
            // Adjust position to maintain focus on FOCUS_POINT
            cameraRef.current.position.sub(FOCUS_POINT)
                .normalize()
                .multiplyScalar(clampedDistance)
                .add(FOCUS_POINT);
            
            // Ensure camera looks at FOCUS_POINT
            cameraRef.current.lookAt(FOCUS_POINT);
        };

        const mount = mountRef.current;
        mount.addEventListener('wheel', handleWheel);

        // Add this function to handle keydown events
        const handleKeyDown = (event) => {
            keysPressed.current[event.key.toLowerCase()] = true;
        };

        // Add this new function to handle key up events
        const handleKeyUp = (event) => {
            keysPressed.current[event.key.toLowerCase()] = false;
        };

        // Add event listeners for keyboard controls
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        // Cleanup function
        return () => {
            // Dispose of the renderer and scene
            if (renderer) {
                renderer.dispose();
            }
            if (scene) {
                while(scene.children.length > 0) {
                    const obj = scene.children[0];
                    if (obj.geometry) obj.geometry.dispose();
                    if (obj.material) {
                        if (Array.isArray(obj.material)) {
                            obj.material.forEach(m => m.dispose());
                        } else {
                            obj.material.dispose();
                        }
                    }
                    scene.remove(obj);
                }
            }

            // Cancel animation frame
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }

            // Remove event listeners
            if (mountRef.current) {
                mountRef.current.removeChild(renderer.domElement);
                mountRef.current.removeEventListener('mousedown', onMouseDown);
                mountRef.current.removeEventListener('mousemove', onMouseMove);
                mountRef.current.removeEventListener('mouseup', onMouseUp);
                mountRef.current.removeEventListener('mouseleave', onMouseLeave); // Add this line
            }
            window.removeEventListener('keydown', onKeyDown);
            mount.removeEventListener('wheel', handleWheel);
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []); // Empty dependency array - runs only once on mount

    // Add this inside the useEffect hook or component initialization
    useEffect(() => {
        // Check if missionEntries exists in localStorage
        const storedEntries = localStorage.getItem('missionEntries');
        if (!storedEntries || storedEntries === '[]') {
            // Initialize with sample data
            const sampleData = [
                {
                    missionIndex: 0,
                    commodity: 'Agricultural Supplies',
                    originalAmount: 100,
                    currentAmount: 100,
                    status: 'Pending',
                    pickupPoint: 'Location A',
                    dropOffPoint: 'Location B',
                    planet: 'Earth',
                    moon: 'Luna',
                    isMissionEntry: true,
                    timestamp: Date.now()
                },
                {
                    missionIndex: 0,
                    commodity: 'Medical Supplies',
                    originalAmount: 50,
                    currentAmount: 50,
                    status: 'Pending',
                    pickupPoint: 'Location C',
                    dropOffPoint: 'Location D',
                    planet: 'Mars',
                    moon: 'Phobos',
                    isMissionEntry: true,
                    timestamp: Date.now()
                }
            ];
            localStorage.setItem('missionEntries', JSON.stringify(sampleData));
        }
    }, []);

    // Add helper function to get block size
    const getBlockSize = (block) => {
        const width = block.geometry.parameters.width;
        const height = block.geometry.parameters.height;
        const depth = block.geometry.parameters.depth;
        
        if (width === 1 && height === 1 && depth === 1) return '1SCU';
        if (width === 1 && height === 1 && depth === 2) return '2SCU';
        if (width === 2 && height === 1 && depth === 2) return '4SCU';
        if (width === 2 && height === 2 && depth === 2) return '8SCU';
        if (width === 2 && height === 2 && depth === 4) return '16SCU';
        if (width === 2 && height === 2 && depth === 8) return '32SCU';
        return 'Unknown';
    };

    // Add this state near the top of the component
    const [selectedShipTemplate, setSelectedShipTemplate] = useState(null);

    // Modify the handleShipClick function
    const handleShipClick = (ship) => {
        if (ship.grids) {
            setSelectedShipTemplate(ship.name); // Store the selected ship name
            
            // Create a new grids object with default 1x1 values
            const newGrids = {
                'Grid 1': { width: 1, length: 1, height: 5 },
                'Grid 2': { width: 1, length: 1, height: 8 },
                'Grid 3': { width: 1, length: 1, height: 10 },
                'Grid 4': { width: 1, length: 1, height: 12 }
            };

            // Update with ship-specific grid dimensions, ignoring height
            Object.entries(ship.grids).forEach(([gridName, dimensions]) => {
                if (newGrids[gridName]) {
                    newGrids[gridName] = {
                        width: dimensions.W || 1,
                        length: dimensions.L || 1,
                        height: newGrids[gridName].height // Keep the default height
                    };
                }
            });

            // Update the state with the new grid dimensions
            setGrids(newGrids);
            
            // Update localStorage
            Object.entries(newGrids).forEach(([gridName, dimensions]) => {
                localStorage.setItem(`${gridName.toLowerCase()}Width`, dimensions.width);
                localStorage.setItem(`${gridName.toLowerCase()}Length`, dimensions.length);
                localStorage.setItem(`${gridName.toLowerCase()}Height`, dimensions.height);
            });
        }
    };

    // Update the handleSpeedChange function
    const handleSpeedChange = (e) => {
        const newSpeed = parseFloat(e.target.value);
        if (!isNaN(newSpeed) && newSpeed >= 0.01 && newSpeed <= 1.0) {
            setCameraMoveSpeed(newSpeed);
            cameraMoveSpeedRef.current = newSpeed;
        }
    };

    // Update the useEffect hook to handle grid changes
    useEffect(() => {
        const updateSceneGrids = () => {
            const scene = sceneRef.current;
            if (scene) {
                // Remove existing grids
                scene.children
                    .filter(obj => obj.name && obj.name.startsWith('Grid'))
                    .forEach(grid => scene.remove(grid));

                // Create new grids with updated dimensions
                createGrids(scene, grids);
            }
        };

        updateSceneGrids();
    }, [grids]);

    // Update the updateMissionsWithBlocks function
    const updateMissionsWithBlocks = () => {
        const missionMap = new Map();
        blocks.current.forEach(block => {
            if (block.userData && block.userData.missionIndex !== undefined) {
                const missionIndex = block.userData.missionIndex;
                if (!missionMap.has(missionIndex)) {
                    missionMap.set(missionIndex, {
                        missionIndex,
                        blockCount: 0,
                        color: getMissionColor(missionIndex)
                    });
                }
                missionMap.get(missionIndex).blockCount++;
            }
        });
        setMissionsWithBlocks(Array.from(missionMap.values()));
    };

    // Update the handleMissionClick function
    const handleMissionClick = (missionIndex) => {
        if (highlightedMission === missionIndex) {
            // If clicking the same mission again, reset to default
            setHighlightedMission(DEFAULT_MISSION_INDEX);
            highlightAllBlocks();
        } else {
            // If clicking a different mission, highlight its blocks
            setHighlightedMission(missionIndex);
            highlightMissionBlocks(missionIndex);
        }
    };

    // Add this helper function to highlight all blocks
    const highlightAllBlocks = () => {
        const scene = sceneRef.current;
        if (!scene) return;

        blocks.current.forEach(block => {
            // Store original color if not already stored
            if (!block.userData.originalColor) {
                block.userData.originalColor = block.material.uniforms.uColor.value.clone();
            }
            // Brighten all blocks
            const highlightColor = new THREE.Color(block.userData.originalColor).multiplyScalar(1.2);
            block.material.uniforms.uColor.value.copy(highlightColor);
        });
    };

    // Update the highlightMissionBlocks function
    const highlightMissionBlocks = (missionIndex) => {
        const scene = sceneRef.current;
        if (!scene) return;

        blocks.current.forEach(block => {
            // Store original color if not already stored
            if (!block.userData.originalColor) {
                block.userData.originalColor = block.material.uniforms.uColor.value.clone();
            }

            // Highlight mission blocks and dim others
            if (block.userData && block.userData.missionIndex === missionIndex) {
                // Brighten mission blocks
                const highlightColor = new THREE.Color(block.userData.originalColor).multiplyScalar(1.5);
                block.material.uniforms.uColor.value.copy(highlightColor);
            } else {
                // Dim non-mission blocks
                const dimColor = new THREE.Color(block.userData.originalColor).multiplyScalar(0.3);
                block.material.uniforms.uColor.value.copy(dimColor);
            }
        });
    };

    // Add this helper function at the top of the component
    const hashCode = (str) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        return hash;
    };

    // Update the handleCommodityViewToggle function
    const handleCommodityViewToggle = (show) => {
        setShowCommodities(show);
        setHighlightedCommodity(null); // Reset commodity highlight when switching views
        setHighlightedMission(null); // Reset mission highlight when switching views
        
        const scene = sceneRef.current;
        if (!scene) return;

        if (show) {
            // When switching to commodity view
            blocks.current.forEach(block => {
                if (block.userData.commodity) {
                    // Generate a consistent color for the commodity
                    const commodityColor = new THREE.Color(
                        Math.abs(hashCode(block.userData.commodity) % 0xffffff)
                    );
                    block.material.uniforms.uColor.value.copy(commodityColor);
                }
            });
        } else {
            // When switching back to mission view
            blocks.current.forEach(block => {
                if (block.userData.missionIndex !== undefined) {
                    // Restore the mission color
                    const missionColor = getMissionColor(block.userData.missionIndex);
                    block.material.uniforms.uColor.value.copy(missionColor);
                }
            });
        }
    };

    // Add this function to handle commodity clicks
    const handleCommodityClick = (commodity) => {
        if (highlightedCommodity === commodity) {
            // If clicking the same commodity again, reset to default
            setHighlightedCommodity(null);
            highlightAllCommodities();
        } else {
            // If clicking a different commodity, highlight its blocks
            setHighlightedCommodity(commodity);
            highlightCommodityBlocks(commodity);
            
            // Calculate SCU sizes for the commodity
            const scuSizes = calculateSCUSizes(commodity);
            
            // Show SCU sizes in a banner
            if (bannerRef.current) {
                bannerRef.current.textContent = `Commodity: ${commodity} | ` +
                    `1SCU: ${scuSizes['1SCU']} | ` +
                    `2SCU: ${scuSizes['2SCU']} | ` +
                    `4SCU: ${scuSizes['4SCU']} | ` +
                    `8SCU: ${scuSizes['8SCU']} | ` +
                    `16SCU: ${scuSizes['16SCU']} | ` +
                    `32SCU: ${scuSizes['32SCU']}`;
                bannerRef.current.style.display = 'block';
            }
        }
    };

    // Add this helper function to highlight all commodities
    const highlightAllCommodities = () => {
        const scene = sceneRef.current;
        if (!scene) return;

        blocks.current.forEach(block => {
            if (block.userData.commodity) {
                const commodityColor = new THREE.Color(
                    Math.abs(hashCode(block.userData.commodity) % 0xffffff)
                );
                block.material.uniforms.uColor.value.copy(commodityColor);
            }
        });
    };

    // Add this helper function to highlight specific commodity blocks
    const highlightCommodityBlocks = (commodity) => {
        const scene = sceneRef.current;
        if (!scene) return;

        blocks.current.forEach(block => {
            if (block.userData.commodity) {
                const baseColor = new THREE.Color(
                    Math.abs(hashCode(block.userData.commodity) % 0xffffff)
                );
                
                if (block.userData.commodity === commodity) {
                    // Brighten the selected commodity
                    const highlightColor = baseColor.multiplyScalar(1.5);
                    block.material.uniforms.uColor.value.copy(highlightColor);
                } else {
                    // Dim other commodities
                    const dimColor = baseColor.multiplyScalar(0.3);
                    block.material.uniforms.uColor.value.copy(dimColor);
                }
            }
        });
    };

    // Add this function to calculate SCU sizes for a commodity
    const calculateSCUSizes = (commodity) => {
        const scuSizes = {
            '1SCU': 0,
            '2SCU': 0,
            '4SCU': 0,
            '8SCU': 0,
            '16SCU': 0,
            '32SCU': 0
        };

        blocks.current.forEach(block => {
            if (block.userData.commodity === commodity) {
                const size = getBlockSize(block);
                if (scuSizes.hasOwnProperty(size)) {
                    scuSizes[size]++;
                }
            }
        });

        return scuSizes;
    };

    function initRenderWindow() {
        const renderWindow = document.createElement('div');
        renderWindow.className = 'render-window';
        document.body.appendChild(renderWindow);
        document.body.style.margin = '0';
        document.body.style.padding = '0';
    }

    function initWebGL(canvas) {
        const gl = canvas.getContext('webgl');
        if (!gl) {
            console.error('WebGL not supported, falling back on experimental-webgl');
            gl = canvas.getContext('experimental-webgl');
        }
        if (!gl) {
            alert('Your browser does not support WebGL');
            return null;
        }

        // Ensure canvas size matches its display size
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;

        // Set the viewport to match the canvas size
        gl.viewport(0, 0, canvas.width, canvas.height);

        return gl;
    }

    function handleResize(canvas, gl) {
        window.addEventListener('resize', () => {
            canvas.width = canvas.clientWidth;
            canvas.height = canvas.clientHeight;
            gl.viewport(0, 0, canvas.width, canvas.height);
            // Trigger a re-render if necessary
            render(gl);
        });
    }

    // Add the loadBlocksFromLocalStorage function before the useEffect hook
    const loadBlocksFromLocalStorage = () => {
        const savedBlocks = localStorage.getItem('savedBlocks');
        if (savedBlocks) {
            try {
                const blocksData = JSON.parse(savedBlocks);
                blocksData.forEach(blockData => {
                    const newBlock = addBlock(
                        blockData.size,
                        new THREE.Color(blockData.color),
                        blockData.missionIndex,
                        blockData.commodity
                    );
                    if (newBlock) {
                        newBlock.position.set(
                            blockData.position.x,
                            blockData.position.y,
                            blockData.position.z
                        );
                        newBlock.rotation.y = blockData.rotation;
                        // Ensure originalColor is set correctly
                        newBlock.userData.originalColor = new THREE.Color(blockData.color);
                    }
                });
            } catch (error) {
                console.error('Error loading blocks:', error);
            }
        }
    };

    // Add this useEffect to load blocks on mount
    useEffect(() => {
        loadBlocksFromLocalStorage();
    }, []);

    // Add this state near the top of the component
    const [blockCellMode, setBlockCellMode] = useState(false);
    const [blockedCells, setBlockedCells] = useState({});

    // Add this function to handle cell blocking
    const handleCellBlock = (gridName, x, z) => {
        const cellKey = `${gridName}-${x}-${z}`;
        setBlockedCells(prev => ({
            ...prev,
            [cellKey]: !prev[cellKey] // Toggle blocked state
        }));
    };

    // Add this useEffect to update the grid colors when blocked cells change
    useEffect(() => {
        const scene = sceneRef.current;
        if (!scene) return;

        // Get the active grid
        const grid = scene.getObjectByName(activeGridTab);
        if (!grid) return;

        // Update grid line colors based on blocked cells
        grid.children.forEach(line => {
            // Get the cell position from the line
            const x = Math.round(line.geometry.attributes.position.array[0]);
            const z = Math.round(line.geometry.attributes.position.array[2]);

            const cellKey = `${activeGridTab}-${x}-${z}`;
            if (blockedCells[cellKey]) {
                // If cell is blocked, set color to red
                line.material.color.set(0xff0000);
            } else {
                // If cell is not blocked, set color to white
                line.material.color.set(0xffffff);
            }
        });
    }, [blockedCells, activeGridTab]);

    // Add this state for controlling the modal visibility
    const [showControlsModal, setShowControlsModal] = useState(false);

    // Add this function to render the controls modal
    const renderControlsModal = () => {
        if (!showControlsModal) return null;

        return (
            <div style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                backgroundColor: 'rgba(30, 30, 30, 0.95)',
                padding: '20px',
                borderRadius: '8px',
                zIndex: 1000,
                width: '400px',
                maxWidth: '90%',
                color: 'white',
                boxShadow: '0 0 20px rgba(0,0,0,0.5)'
            }}>
                <h3 style={{ marginTop: 0, textAlign: 'center' }}>Controls</h3>
                <div style={{ lineHeight: '1.6' }}>
                    <p><strong>Left Click:</strong> Select and move blocks</p>
                    <p><strong>Right Click + Drag:</strong> Rotate camera</p>
                    <p><strong>WASD:</strong> Move camera</p>
                    <p><strong>Mouse Wheel:</strong> Zoom in/out</p>
                    <p><strong>R Key:</strong> Rotate selected block</p>
                    <p><strong>Delete Key:</strong> Delete selected block</p>
                    <p><strong>Ctrl+Z:</strong> Undo last deletion</p>
                </div>
                <button 
                    onClick={() => setShowControlsModal(false)}
                    style={{
                        display: 'block',
                        margin: '20px auto 0',
                        padding: '8px 16px',
                        backgroundColor: '#444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    Close
                </button>
            </div>
        );
    };

    const [opacity, setOpacity] = useState(1.0);

    useEffect(() => {
        if (blocks.current) {
            blocks.current.forEach(block => {
                block.material.uniforms.uOpacity.value = opacity;
            });
        }
    }, [opacity]);

    // Add a state variable for visibility
    const [showFirstSlider, setShowFirstSlider] = useState(false);

    // Conditionally render the first slider
    {showFirstSlider && (
        <div style={{ marginBottom: '10px' }}>
            <label style={{ color: 'white', display: 'block', marginBottom: '5px' }}>Opacity</label>
            <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={opacity}
                onChange={(e) => setOpacity(parseFloat(e.target.value))}
                style={{ width: '95%' }}
            />
        </div>
    )}

    return (
        <div style={{ 
            display: 'flex', 
            width: '100%', 
            height: '100%',
            position: 'relative'
        }}>
            {/* 3D Window - always visible */}
            <div ref={mountRef} style={{ 
                width: '80%', 
                height: '100%'
            }} />
            
            {/* Sidebar */}
            <div style={{
                width: '36%',
                height: '100%',
                backgroundColor: '#1e1e1e',
                padding: '10px',
                boxSizing: 'border-box',
                display: 'flex',
                marginLeft: '-20px',
                flexDirection: 'column',
            }}>
                {/* Tab Navigation */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '10px'
                }}>
                    <button 
                        onClick={() => setActiveTab('Manifest')}
                        style={{
                            flex: 1,
                            padding: '8px',
                            backgroundColor: activeTab === 'Manifest' ? '#444' : '#333',
                            color: 'white',
                            border: 'none',
                            borderRight: '1px solid #555',
                            cursor: 'pointer',
                            borderRadius: '4px 0 0 4px'
                        }}
                    >
                        Manifest
                    </button>
                    <button 
                        onClick={() => setActiveTab('Ship')}
                        style={{
                            flex: 1,
                            padding: '8px',
                            backgroundColor: activeTab === 'Ship' ? '#444' : '#333',
                            color: 'white',
                            border: 'none',
                            borderRight: '1px solid #555',
                            cursor: 'pointer'
                        }}
                    >
                        Ship
                    </button>
                    <button 
                        onClick={() => setActiveTab('Playground')}
                        style={{
                            flex: 1,
                            padding: '8px',
                            backgroundColor: activeTab === 'Playground' ? '#444' : '#333',
                            color: 'white',
                            border: 'none',
                            cursor: 'pointer',
                            borderRadius: '0 4px 4px 0'
                        }}
                    >
                        Playground
                    </button>
                </div>

                {/* Tab Content */}
                {activeTab === 'Manifest' && (
                    <div style={{
                        flex: 1,
                        backgroundColor: '#2a2a2a',
                        padding: '10px',
                        borderRadius: '4px',
                        overflowY: 'auto',
                        maxHeight: '680px',
                        position: 'relative'
                    }}>
                        {/* Main Header */}
                        <h3 style={{ 
                            color: 'white', 
                            marginBottom: '20px',
                            textAlign: 'center',
                            textDecoration: 'underline',
                            paddingBottom: '5px'
                        }}>Manifest View</h3>
                        
                        {(function() {
                            try {
                                const storedData = localStorage.getItem('missionEntries');
                                
                                const missionEntries = JSON.parse(storedData || '[]');

                                if (!Array.isArray(missionEntries)) {
                                    return <div style={{ color: 'white', textAlign: 'center' }}>No mission entries found</div>;
                                }

                                // Flatten the array and filter out null entries
                                const validEntries = missionEntries
                                    .flat() // Flatten nested arrays
                                    .filter(entry => entry !== null && typeof entry === 'object')
                                    .map(entry => {
                                        return {
                                            ...entry,
                                            missionIndex: entry.missionIndex || 0,
                                            commodity: entry.commodity || 'Unknown Commodity',
                                            originalAmount: Number(entry.originalAmount) || 0
                                        };
                                    });

                                if (validEntries.length === 0) {
                                    return <div style={{ color: 'white', textAlign: 'center' }}>No mission entries available</div>;
                                }

                                // Group entries by missionIndex
                                const missions = {};
                                validEntries.forEach(entry => {
                                    const missionIndex = entry.missionIndex;
                                    if (!missions[missionIndex]) {
                                        missions[missionIndex] = [];
                                    }
                                    missions[missionIndex].push(entry);
                                });
                                
                                return Object.entries(missions).map(([missionIndex, entries]) => {
                                    const isCollapsed = collapsedMissions[missionIndex];
                                    return (
                                        <div key={missionIndex} style={{ marginBottom: '20px' }}>
                                            {/* Mission Header */}
                                            <div 
                                                style={{
                                                    color: 'white',
                                                    fontSize: '1.1em',
                                                    fontWeight: 'bold',
                                                    marginBottom: '10px',
                                                    padding: '5px',
                                                    backgroundColor: '#333',
                                                    borderRadius: '4px',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between'
                                                }}
                                                onClick={() => setCollapsedMissions(prev => ({
                                                    ...prev,
                                                    [missionIndex]: !prev[missionIndex]
                                                }))}
                                            >
                                                <span style={{ flex: 1 }}>
                                                    Mission {parseInt(missionIndex) + 1}
                                                </span>
                                                <div>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            // Add SCU boxes starting from largest to smallest
                                                            const scuSizes = ['32SCU', '16SCU', '8SCU', '4SCU', '2SCU', '1SCU'];
                                                            let remainingAmount = entries.reduce((sum, entry) => sum + entry.originalAmount, 0);
                                                            
                                                            // Get mission color based on missionIndex
                                                            const missionColor = getMissionColor(missionIndex);
                                                            
                                                            // Add blocks for each commodity in the mission
                                                            entries.forEach(entry => {
                                                                let commodityAmount = entry.originalAmount;
                                                                scuSizes.forEach(size => {
                                                                    const sizeValue = parseInt(size.replace('SCU', ''));
                                                                    while (commodityAmount >= sizeValue) {
                                                                        const newBlock = addBlock(size, missionColor, missionIndex, entry.commodity);
                                                                        commodityAmount -= sizeValue;
                                                                    }
                                                                });
                                                            });
                                                        }}
                                                        style={{
                                                            marginLeft: '10px',
                                                            padding: '4px 8px',
                                                            backgroundColor: '#444',
                                                            color: 'white',
                                                            border: 'none',
                                                            borderRadius: '4px',
                                                            cursor: 'pointer',
                                                            fontSize: '0.8em'
                                                        }}
                                                    >
                                                        Add
                                                    </button>
                                                    <span style={{ fontSize: '0.8em', marginLeft: '10px' }}>
                                                        {isCollapsed ? '▼' : '▲'}
                                                    </span>
                                                </div>
                                            </div>
                                            {!isCollapsed && (
                                                <div style={{
                                                    display: 'grid',
                                                    gridTemplateColumns: 'repeat(2, 1fr)',
                                                    gap: '10px',
                                                    marginBottom: '10px',
                                                    padding: '10px',
                                                    backgroundColor: '#333',
                                                    borderRadius: '4px'
                                                }}>
                                                    <div style={{ 
                                                        color: 'white', 
                                                        fontWeight: 'bold',
                                                        textDecoration: 'underline'
                                                    }}>Commodity</div>
                                                    <div style={{ 
                                                        color: 'white', 
                                                        fontWeight: 'bold', 
                                                        textAlign: 'right',
                                                        textDecoration: 'underline'
                                                    }}>QTY</div>
                                                </div>
                                            )}
                                            {!isCollapsed && entries.map((entry, entryIndex) => (
                                                <div key={entryIndex} style={{
                                                    display: 'grid',
                                                    gridTemplateColumns: 'repeat(2, 1fr)',
                                                    gap: '10px',
                                                    padding: '10px',
                                                    backgroundColor: entryIndex % 2 === 0 ? '#2a2a2a' : '#333',
                                                    borderRadius: '4px'
                                                }}>
                                                    <div style={{ color: 'white' }}>{entry.commodity}</div>
                                                    <div style={{ color: 'white', textAlign: 'right' }}>{entry.originalAmount}</div>
                                                </div>
                                            ))}
                                        </div>
                                    );
                                });
                            } catch (error) {
                                return <div style={{ color: 'white', textAlign: 'center' }}>Error loading mission entries</div>;
                            }
                        })()}
                    </div>
                )}

                {activeTab === 'Ship' && (
                    <div style={{
                        flex: 1,
                        backgroundColor: '#2a2a2a',
                        padding: '10px',
                        borderRadius: '4px',
                        overflowY: 'auto'
                    }}>
                        {/* Add new tabs */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginBottom: '10px'
                        }}>
                            <button 
                                style={{
                                    flex: 1,
                                    padding: '8px',
                                    backgroundColor: shipSubTab === 'Template' ? '#666' : '#444',
                                    color: 'white',
                                    border: 'none',
                                    borderRight: '1px solid #555',
                                    cursor: 'pointer',
                                    borderRadius: '4px 0 0 4px'
                                }}
                                onClick={() => setShipSubTab('Template')}
                            >
                                Template
                            </button>
                            <button 
                                style={{
                                    flex: 1,
                                    padding: '8px',
                                    backgroundColor: shipSubTab === 'Cargo Hold' ? '#666' : '#444',
                                    color: 'white',
                                    border: 'none',
                                    cursor: 'pointer',
                                    borderRadius: '0 4px 4px 0'
                                }}
                                onClick={() => setShipSubTab('Cargo Hold')}
                            >
                                Cargo Hold
                            </button>
                        </div>

                        <h3 style={{ color: 'white', marginBottom: '10px' }}>Ship Template Layout</h3>

                        <div style={{
                            marginTop: '20px',
                            paddingTop: '10px',
                            borderTop: '1px solid #444'
                        }}>
                            {shipSubTab === 'Template' ? (
                                // Show template ships
                                ShipList.filter(ship => ship.grids).map((ship, index) => (
                                    <div key={index} style={{ marginBottom: '10px' }}>
                                        <button 
                                            onClick={() => handleShipClick(ship)}
                                            style={{
                                                width: '100%',
                                                padding: '8px',
                                                backgroundColor: '#444',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '4px',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            {ship.name}
                                        </button>
                                        <div style={{ 
                                            marginTop: '5px', 
                                            color: '#aaa', 
                                            fontSize: '12px',
                                            paddingLeft: '8px'
                                        }}>
                                            {Object.entries(ship.grids).map(([gridName, dimensions]) => (
                                                <div key={gridName}>
                                                    {gridName}: {dimensions.W}x{dimensions.L}x{dimensions.H}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                // Show fleet ships
                                ships.map((ship, index) => (
                                    <ShipCard 
                                        key={index} 
                                        ship={ship} 
                                        addBlock={addBlock} // Pass the addBlock function as a prop
                                    />
                                ))
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'Playground' && (
                    <div style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px'
                    }}>
                        {/* Existing SCU buttons */}
                        <button 
                            onClick={() => addBlock('1SCU')}
                            style={{
                                padding: '8px 16px',
                                backgroundColor: '#00ff00',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            Add 1SCU
                        </button>
                        <button 
                            onClick={() => addBlock('2SCU')}
                            style={{
                                padding: '8px 16px',
                                backgroundColor: '#0000ff',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            Add 2SCU
                        </button>
                        <button 
                            onClick={() => addBlock('4SCU')}
                            style={{
                                padding: '8px 16px',
                                backgroundColor: '#ff00ff',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            Add 4SCU
                        </button>
                        <button 
                            onClick={() => addBlock('8SCU')}
                            style={{
                                padding: '8px 16px',
                                backgroundColor: '#ffa500',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            Add 8SCU
                        </button>
                        <button 
                            onClick={() => addBlock('16SCU')}
                            style={{
                                padding: '8px 16px',
                                backgroundColor: '#800080',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            Add 16SCU
                        </button>
                        <button 
                            onClick={() => addBlock('32SCU')}
                            style={{
                                padding: '8px 16px',
                                backgroundColor: '#ff0000',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            Add 32SCU
                        </button>

                        {/* Add Clear Boxes button */}
                        <button 
                            onClick={() => {
                                const scene = sceneRef.current;
                                if (scene) {
                                    // Remove all blocks from the scene
                                    blocks.current.forEach(block => scene.remove(block));
                                    blocks.current = [];
                                    // Clear local storage
                                    localStorage.removeItem('savedBlocks');
                                }
                            }}
                            style={{
                                padding: '8px 16px',
                                backgroundColor: '#ff4444',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                marginTop: '20px'
                            }}
                        >
                            Clear All Boxes
                        </button>

                        {/* Grid Control Section */}
                        <div style={{
                            marginTop: '20px',
                            paddingTop: '10px',
                            borderTop: '1px solid #444'
                        }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                marginBottom: '10px'
                            }}>
                                {['Grid 1', 'Grid 2', 'Grid 3', 'Grid 4'].map(tab => (
                                    <button 
                                        key={tab}
                                        onClick={() => setActiveGridTab(tab)}
                                        style={{
                                            flex: 1,
                                            padding: '8px',
                                            backgroundColor: activeGridTab === tab ? '#444' : '#333',
                                            color: 'white',
                                            border: 'none',
                                            borderRight: '1px solid #555',
                                            cursor: 'pointer',
                                            borderRadius: tab === 'Grid 1' ? '4px 0 0 4px' : 
                                                       tab === 'Grid 4' ? '0 4px 4px 0' : '0'
                                        }}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>

                            <h3 style={{
                                color: 'white',
                                marginBottom: '10px',
                                textAlign: 'center'
                            }}>
                                {activeGridTab} Control
                            </h3>
                            
                            {/* Edit Width */}
                            <div style={{ marginBottom: '10px' }}>
                                <label style={{ color: 'white', display: 'block', marginBottom: '5px' }}>Edit Width</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="20"
                                    value={grids[activeGridTab].width}
                                    onChange={handleWidthChange}
                                    style={{
                                        width: '95%',
                                        padding: '5px',
                                        borderRadius: '4px',
                                        border: '1px solid #444'
                                    }}
                                />
                            </div>

                            {/* Edit Length */}
                            <div style={{ marginBottom: '10px' }}>
                                <label style={{ color: 'white', display: 'block', marginBottom: '5px' }}>Edit Length</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="20"
                                    value={grids[activeGridTab].length}
                                    onChange={handleLengthChange}
                                    style={{
                                        width: '95%',
                                        padding: '5px',
                                        borderRadius: '4px',
                                        border: '1px solid #444'
                                    }}
                                />
                            </div>
                        </div>

                        {/* Add controls in the Playground tab */}
                        <div style={{ marginTop: '20px' }}>
                            <h3 style={{ color: 'white' }}>Renderer Size</h3>
                            <div style={{ marginBottom: '10px' }}>
                                <label style={{ color: 'white', display: 'block', marginBottom: '5px' }}>Width</label>
                                <input
                                    type="number"
                                    value={rendererSize.width}
                                    onChange={(e) => {
                                        const newWidth = parseInt(e.target.value);
                                        if (!isNaN(newWidth) && newWidth > 0) {
                                            const newSize = { ...rendererSize, width: newWidth };
                                            setRendererSize(newSize);
                                            localStorage.setItem('rendererSize', JSON.stringify(newSize));
                                        }
                                    }}
                                    style={{ width: '95%', padding: '5px', borderRadius: '4px', border: '1px solid #444' }}
                                />
                            </div>
                            <div style={{ marginBottom: '10px' }}>
                                <label style={{ color: 'white', display: 'block', marginBottom: '5px' }}>Height</label>
                                <input
                                    type="number"
                                    value={rendererSize.height}
                                    onChange={(e) => {
                                        const newHeight = parseInt(e.target.value);
                                        if (!isNaN(newHeight) && newHeight > 0) {
                                            const newSize = { ...rendererSize, height: newHeight };
                                            setRendererSize(newSize);
                                            localStorage.setItem('rendererSize', JSON.stringify(newSize));
                                        }
                                    }}
                                    style={{ width: '95%', padding: '5px', borderRadius: '4px', border: '1px solid #444' }}
                                />
                            </div>
                            <button 
                                onClick={() => {
                                    rendererRef.current.setSize(rendererSize.width, rendererSize.height);
                                    localStorage.setItem('rendererSize', JSON.stringify(rendererSize));
                                }}
                                style={{
                                    padding: '8px 16px',
                                    backgroundColor: '#444',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
                            >
                                Apply Size
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Floating panel for missions with blocks */}
            <div style={{
                position: 'absolute',
                top: '10px',
                left: '10px',
                backgroundColor: 'rgba(30, 30, 30, 0.9)',
                padding: '10px',
                borderRadius: '4px',
                zIndex: 1,
                width: '300px',
                height: 'auto',
                maxHeight: '80vh',
                overflowY: 'auto',
                pointerEvents: 'all'
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '10px'
                }}>
                    <h3 style={{ 
                        color: 'white',
                        margin: 0,
                        textAlign: 'center'
                    }}>
                        {showCommodities ? 'Commodities' : 'Active Missions'}
                    </h3>
                    <button
                        style={{
                            padding: '4px 8px',
                            backgroundColor: '#444',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.8em'
                        }}
                        onClick={() => handleCommodityViewToggle(!showCommodities)}
                    >
                        {showCommodities ? 'Missions' : 'Commodities'}
                    </button>
                </div>
                
                {showCommodities ? (
                    // Show commodities list
                    <div>
                        {Object.entries(
                            blocks.current
                                .filter(block => block.userData.commodity)
                                .reduce((acc, block) => {
                                    const commodity = block.userData.commodity;
                                    if (!acc[commodity]) {
                                        const commodityColor = new THREE.Color(
                                            Math.abs(hashCode(commodity) % 0xffffff)
                                        );
                                        acc[commodity] = {
                                            count: 0,
                                            size: getBlockSize(block),
                                            color: commodityColor,
                                            missionIndex: block.userData.missionIndex,
                                            expanded: commodityEntries[commodity]?.expanded || false,
                                            scuSizes: calculateSCUSizes(commodity)
                                        };
                                    }
                                    acc[commodity].count += 1;
                                    return acc;
                                }, {})
                        ).map(([commodity, details], index) => {
                            const { count, size, color, expanded, scuSizes } = details;
                            const isHighlighted = highlightedCommodity === commodity;
                            
                            return (
                                <div key={index} style={{
                                    marginBottom: '5px',
                                    backgroundColor: isHighlighted ? '#444' : '#2a2a2a',
                                    borderRadius: '4px',
                                    border: isHighlighted ? '1px solid #fff' : '1px solid transparent'
                                }}>
                                    <div 
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            padding: '5px',
                                            cursor: 'pointer'
                                        }}
                                        onClick={() => {
                                            if (expandedCommodity === commodity) {
                                                setExpandedCommodity(null);
                                            } else {
                                                setExpandedCommodity(commodity);
                                            }
                                            handleCommodityClick(commodity);
                                        }}
                                    >
                                        <div style={{ 
                                            width: '10px',
                                            height: '10px',
                                            backgroundColor: `#${color.getHexString()}`,
                                            marginRight: '8px',
                                            borderRadius: '2px'
                                        }} />
                                        <div style={{ color: 'white', flex: 1 }}>
                                            {commodity}
                                        </div>
                                        <div style={{ 
                                            color: 'white',
                                            backgroundColor: '#666',
                                            padding: '2px 6px',
                                            borderRadius: '4px',
                                            fontSize: '0.8em'
                                        }}>
                                            {count} blocks
                                        </div>
                                    </div>
                                    
                                    {expandedCommodity === commodity && (
                                        <div style={{
                                            padding: '10px',
                                            backgroundColor: '#333',
                                            borderTop: '1px solid #444',
                                            borderBottomLeftRadius: '4px',
                                            borderBottomRightRadius: '4px'
                                        }}>
                                            <div style={{
                                                display: 'grid',
                                                gridTemplateColumns: 'repeat(3, 1fr)',
                                                gap: '6px'
                                            }}>
                                                {Object.entries(scuSizes).map(([scuSize, count]) => (
                                                    <div key={scuSize} style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '4px',
                                                        padding: '4px 6px',
                                                        backgroundColor: '#444',
                                                        borderRadius: '4px',
                                                        justifyContent: 'center'
                                                    }}>
                                                        <div style={{ 
                                                            color: '#ccc', 
                                                            fontSize: '0.8em'
                                                        }}>
                                                            {scuSize}
                                                        </div>
                                                        <div style={{ 
                                                            color: 'white',
                                                            backgroundColor: '#555',
                                                            padding: '2px 6px',
                                                            borderRadius: '4px',
                                                            fontSize: '0.8em'
                                                        }}>
                                                            {count}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    // Show missions list
                    missionsWithBlocks.map((mission, index) => {
                        const missionNumber = index + 1;
                        const formattedMissionNumber = String(missionNumber).padStart(2, '0');
                        const isHighlighted = highlightedMission === mission.missionIndex;

                        return (
                            <div 
                                key={index} 
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    marginBottom: '5px',
                                    padding: '5px',
                                    backgroundColor: isHighlighted ? '#444' : '#2a2a2a',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    border: isHighlighted ? '1px solid #fff' : '1px solid transparent'
                                }}
                                onClick={() => handleMissionClick(mission.missionIndex)}
                            >
                                <div style={{
                                    width: '10px',
                                    height: '10px',
                                    backgroundColor: `#${mission.color.toString(16)}`,
                                    marginRight: '8px',
                                    borderRadius: '2px'
                                }} />
                                <div style={{ color: 'white', flex: 1 }}>
                                    Mission {formattedMissionNumber}
                                </div>
                                <div style={{ 
                                    color: 'white',
                                    backgroundColor: '#666',
                                    padding: '2px 6px',
                                    borderRadius: '4px',
                                    fontSize: '0.8em'
                                }}>
                                    {mission.blockCount} blocks
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {selectedShipTemplate && (
                <div style={{
                    position: 'absolute',
                    top: '10px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: 'rgba(30, 30, 30, 0.9)',
                    padding: '8px 16px',
                    borderRadius: '4px',
                    zIndex: 1,
                    color: 'white',
                    fontSize: '14px',
                    pointerEvents: 'none'
                }}>
                    Current Template: {selectedShipTemplate}
                </div>
            )}

            {/* Separate Controls button */}
            <button
                onClick={() => setShowControlsModal(true)}
                style={{
                    position: 'absolute',
                    top: '30px',
                    left: '350px',
                    padding: '8px 16px',
                    backgroundColor: 'rgba(30, 30, 30, 0.9)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    zIndex: 100
                }}
            >
                Controls
            </button>

            {/* Add the modal */}
            {renderControlsModal()}

            {/* Add this near the Controls button */}
            <div style={{
                position: 'absolute',
                top: '30px', // Align with the Controls button
                left: '450px', // Position to the right of the Controls button
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                zIndex: 100
            }}>
                <label style={{ color: 'white', fontSize: '14px' }}>Opacity:</label>
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={opacity}
                    onChange={(e) => setOpacity(parseFloat(e.target.value))}
                    style={{ width: '100px' }}
                />
            </div>
        </div>
    );
};

export default Grid3D; 