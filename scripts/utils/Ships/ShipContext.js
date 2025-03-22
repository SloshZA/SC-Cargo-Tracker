import React, { createContext, useState, useEffect } from 'react';

export const ShipContext = createContext();

export const ShipProvider = ({ children }) => {
    const [ships, setShips] = useState([]);
    const [cargoData, setCargoData] = useState(() => {
        const savedCargo = localStorage.getItem('cargoData');
        return savedCargo ? JSON.parse(savedCargo) : {};
    });

    // Load initial data
    useEffect(() => {
        const savedShips = localStorage.getItem('ships');
        if (savedShips) {
            try {
                setShips(JSON.parse(savedShips));
            } catch (error) {
                console.error('Error loading ships:', error);
            }
        }
    }, []);

    // Save ships when they change
    useEffect(() => {
        localStorage.setItem('ships', JSON.stringify(ships));
    }, [ships]);

    useEffect(() => {
        localStorage.setItem('cargoData', JSON.stringify(cargoData));
    }, [cargoData]);

    const addShip = (ship) => {
        const array = new Uint8Array(16);
        crypto.getRandomValues(array);
        const id = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
        
        const newShip = {
            ...ship,
            id: id
        };
        setShips(prev => [...prev, newShip]);
    };

    const updateShip = (id, updatedData) => {
        setShips(prev => 
            prev.map(ship => 
                ship.id === id ? { ...ship, ...updatedData } : ship
            )
        );
    };

    const deleteShip = (id) => {
        setShips(prev => prev.filter(ship => ship.id !== id));
    };

    const updateCargo = (shipId, cargo) => {
        setCargoData(prev => ({
            ...prev,
            [shipId]: cargo
        }));
    };

    const deleteCargo = (shipId) => {
        setCargoData(prev => {
            const updated = { ...prev };
            delete updated[shipId];
            return updated;
        });
    };

    return (
        <ShipContext.Provider value={{ 
            ships,
            addShip,
            updateShip,
            deleteShip,
            setShips,
            cargoData,
            setCargoData,
            updateCargo,
            deleteCargo
        }}>
            {children}
        </ShipContext.Provider>
    );
};

export const useShipContext = () => React.useContext(ShipContext); 