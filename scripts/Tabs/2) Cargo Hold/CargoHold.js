import React from 'react';
import { ShipProvider } from '../../utils/Ships/ShipContext';
import Ships from './Ships/Ships';
import Storage from './Storage/Storage';

const CargoHold = () => {
    return (
        <ShipProvider>
            <div className="cargo-hold">
                <Ships />
                <Storage />
            </div>
        </ShipProvider>
    );
};

export default CargoHold; 