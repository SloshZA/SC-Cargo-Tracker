import React, { createContext, useState } from 'react';

export const ShipContext = createContext();

export const ShipProvider = ({ children }) => {
    const [ships, setShips] = useState([]);

    const addShip = (ship) => {
        setShips(prev => [...prev, { ...ship, id: Date.now() }]);
    };

    const updateShip = (id, updatedShip) => {
        setShips(prev => prev.map(ship => 
            ship.id === id ? { ...ship, ...updatedShip } : ship
        ));
    };

    const deleteShip = (id) => {
        setShips(prev => prev.filter(ship => ship.id !== id));
    };

    return (
        <ShipContext.Provider value={{ ships, addShip, updateShip, deleteShip }}>
            {children}
        </ShipContext.Provider>
    );
}; 