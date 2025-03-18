import React, { useState, useEffect } from 'react';
import './Ships.css';
import { useShipContext } from '../../../utils/Ships/ShipContext'; // Assuming you have a ShipContext
import ShipList from '../../../utils/Ships/ShipList'; // Import the ShipList

// Predefined ship options
const SHIP_OPTIONS = [
    {
        name: 'Caterpillar',
        model: 'Drake Caterpillar',
        cargoCapacity: 576,
        currentLoad: 0,
        status: 'available'
    },
    {
        name: 'C2 Hercules',
        model: 'Crusader C2 Hercules',
        cargoCapacity: 696,
        currentLoad: 0,
        status: 'available'
    },
    {
        name: 'Freelancer MAX',
        model: 'MISC Freelancer MAX',
        cargoCapacity: 120,
        currentLoad: 0,
        status: 'available'
    }
];

const Ships = () => {
    const { ships, addShip, updateShip, deleteShip, setShips, cargoData } = useShipContext();
    const [formData, setFormData] = useState({
        name: '',
        model: '',
        cargoCapacity: '',
        currentLoad: '',
        status: 'available'
    });

    // Add search term state
    const [searchTerm, setSearchTerm] = useState('');

    // Filter ships based on search term
    const filteredShips = ShipList.filter(ship =>
        ship.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Save ships to localStorage whenever they change
    useEffect(() => {
        if (ships.length > 0) {  // Only save if there are ships
            console.log('Saving fleet to localStorage:', ships);
            localStorage.setItem('savedFleet', JSON.stringify(ships));
        } else {
            console.log('No ships to save');
        }
    }, [ships]);

    // Load saved ships on component mount
    useEffect(() => {
        console.log('Attempting to load fleet from localStorage...');
        const savedFleet = localStorage.getItem('savedFleet');
        if (savedFleet && savedFleet !== '[]') {  // Check if savedFleet is not empty
            console.log('Found saved fleet:', savedFleet);
            try {
                const parsedFleet = JSON.parse(savedFleet);
                console.log('Parsed fleet:', parsedFleet);
                if (parsedFleet.length > 0) {  // Only set ships if parsedFleet has items
                    setShips(parsedFleet);
                }
            } catch (error) {
                console.error('Error parsing saved fleet:', error);
            }
        } else {
            console.log('No saved fleet found in localStorage');
        }
    }, []);

    // Get current load using context cargo data
    const getCurrentLoad = (shipId) => {
        const shipCargo = cargoData[shipId] || [];
        return shipCargo.reduce((sum, item) => sum + (item.scu || 0), 0);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleQuickAdd = (ship) => {
        addShip(ship);
    };

    // Function to get ship display name with numbering
    const getShipDisplayName = (ship, index) => {
        const count = ships.filter(s => s.name === ship.name).length;
        if (count > 1) {
            const shipIndex = ships.slice(0, index + 1).filter(s => s.name === ship.name).length;
            return `${ship.name} (${shipIndex})`;
        }
        return ship.name;
    };

    // Add state for popup
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [shipToDelete, setShipToDelete] = useState(null);
    const [shipCargoAmount, setShipCargoAmount] = useState(0);

    const handleDeleteShip = (shipId) => {
        const currentLoad = getCurrentLoad(shipId);
        if (currentLoad > 0) {
            setShipToDelete(shipId);
            setShipCargoAmount(currentLoad);
            setShowDeletePopup(true);
        } else {
            deleteShip(shipId);
            // Update localStorage after direct deletion
            const updatedShips = ships.filter(ship => ship.id !== shipId);
            if (updatedShips.length > 0) {
                localStorage.setItem('savedFleet', JSON.stringify(updatedShips));
            } else {
                localStorage.removeItem('savedFleet');
            }
        }
    };

    const confirmDelete = () => {
        deleteShip(shipToDelete);
        // Update localStorage after deletion
        const updatedShips = ships.filter(ship => ship.id !== shipToDelete);
        if (updatedShips.length > 0) {
            localStorage.setItem('savedFleet', JSON.stringify(updatedShips));
        } else {
            // If no ships left, remove the savedFleet entry
            localStorage.removeItem('savedFleet');
        }
        setShowDeletePopup(false);
    };

    const cancelDelete = () => {
        setShowDeletePopup(false);
    };

    useEffect(() => {
        // Load cargo data from localStorage
        const savedCargo = localStorage.getItem('cargoViewEntries');
        if (savedCargo) {
            try {
                const cargoData = JSON.parse(savedCargo);
                // Update state or context with cargo data if needed
            } catch (error) {
                console.error('Error parsing cargo data:', error);
            }
        }
    }, []);

    return (
        <div className="ships-container">
            <h2>Ships Management</h2>
            
            {/* Your Fleet Section - Moved to top */}
            <div className="your-fleet-section">
                <h3>Your Fleet</h3>
                {ships.length > 0 ? (
                    <div className="fleet-grid">
                        {ships.map((ship, index) => {
                            const displayName = getShipDisplayName(ship, index);
                            const currentLoad = getCurrentLoad(ship.id);
                            return (
                                <div key={index} className="fleet-card">
                                    <h4>{displayName}</h4>
                                    <div className="ship-details">
                                        <p>Model: {ship.model}</p>
                                        <p>Capacity: {ship.cargoCapacity} SCU</p>
                                        <p>Current Load: {currentLoad} SCU</p>
                                        <p>Status: {ship.status}</p>
                                    </div>
                                    <div className="fleet-actions">
                                        <button onClick={() => updateShip(ship.id)}>Edit</button>
                                        <button onClick={() => handleDeleteShip(ship.id)}>Delete</button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <p>No ships in your fleet yet. Add some ships to get started!</p>
                )}
            </div>

            {/* Ship List Section */}
            <div className="ship-list-section">
                <h3>Available Ships</h3>
                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Search ships..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>
                <div className="ship-grid">
                    {filteredShips.map((ship, index) => (
                        <div key={index} className="ship-card">
                            <h4>{ship.name}</h4>
                            <div className="ship-details">
                                <p><strong>Size:</strong> {ship.size}</p>
                                <p><strong>SCU Capacity:</strong> {ship.scu}</p>
                            </div>
                            <button 
                                className="add-ship-btn"
                                onClick={() => handleQuickAdd({
                                    name: ship.name,
                                    model: ship.name,
                                    cargoCapacity: ship.scu,
                                    currentLoad: 0,
                                    status: 'available'
                                })}
                            >
                                Add to Fleet
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Delete Confirmation Popup */}
            {showDeletePopup && (
                <div className="popup-overlay">
                    <div className="delete-popup">
                        <h3>Confirm Deletion</h3>
                        <p>This ship has {shipCargoAmount} SCU of cargo. Are you sure you want to remove it?</p>
                        <div className="popup-buttons">
                            <button className="confirm-btn" onClick={confirmDelete}>
                                Yes, Delete
                            </button>
                            <button className="cancel-btn" onClick={cancelDelete}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Ships; 