import React, { useState } from 'react';
import './Ships.css';
import { useShipContext } from '../../../utils/Ships/ShipContext'; // Assuming you have a ShipContext

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
    const { ships, addShip, updateShip, deleteShip } = useShipContext();
    const [formData, setFormData] = useState({
        name: '',
        model: '',
        cargoCapacity: '',
        currentLoad: '',
        status: 'available'
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        addShip(formData);
        setFormData({
            name: '',
            model: '',
            cargoCapacity: '',
            currentLoad: '',
            status: 'available'
        });
    };

    const handleQuickAdd = (ship) => {
        addShip(ship);
    };

    return (
        <div className="ships-container">
            <h2>Ships Management</h2>
            
            {/* Quick Add Section */}
            <div className="quick-add-section">
                <h3>Quick Add Ships</h3>
                <div className="ship-options">
                    {SHIP_OPTIONS.map((ship, index) => (
                        <div key={index} className="ship-option">
                            <h4>{ship.name}</h4>
                            <p>Model: {ship.model}</p>
                            <p>Capacity: {ship.cargoCapacity} SCU</p>
                            <button 
                                className="quick-add-btn"
                                onClick={() => handleQuickAdd(ship)}
                            >
                                Add {ship.name}
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Ship Form */}
            <div className="ship-form">
                <h3>Add/Edit Ship</h3>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Ship Name:</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Model:</label>
                        <input
                            type="text"
                            name="model"
                            value={formData.model}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Cargo Capacity (SCU):</label>
                        <input
                            type="number"
                            name="cargoCapacity"
                            value={formData.cargoCapacity}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Current Load (SCU):</label>
                        <input
                            type="number"
                            name="currentLoad"
                            value={formData.currentLoad}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Status:</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleInputChange}
                        >
                            <option value="available">Available</option>
                            <option value="in-use">In Use</option>
                            <option value="maintenance">Maintenance</option>
                        </select>
                    </div>
                    
                    <button type="submit" className="submit-btn">
                        Add Ship
                    </button>
                </form>
            </div>

            {/* Ships List */}
            <div className="ships-list">
                <h3>Your Fleet</h3>
                {ships.length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Model</th>
                                <th>Capacity</th>
                                <th>Current Load</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ships.map(ship => (
                                <tr key={ship.id}>
                                    <td>{ship.name}</td>
                                    <td>{ship.model}</td>
                                    <td>{ship.cargoCapacity} SCU</td>
                                    <td>{ship.currentLoad} SCU</td>
                                    <td>{ship.status}</td>
                                    <td>
                                        <button onClick={() => updateShip(ship.id)}>Edit</button>
                                        <button onClick={() => deleteShip(ship.id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No ships added yet.</p>
                )}
            </div>
        </div>
    );
};

export default Ships; 