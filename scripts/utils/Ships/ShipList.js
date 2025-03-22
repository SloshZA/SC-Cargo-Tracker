import React, { useState } from 'react';

const ShipList = [
    { name: "MISC Hull C", size: "Large", scu: 4608 },
    { name: "Crusader C2 Hercules Starlifter", size: "Large", scu: 696, grids: { 'Grid 1': { W: 8, L: 15, H: 4 }, 'Grid 2': { W: 6, L: 9, H: 4 } } },
    { name: "Drake Caterpillar", size: "Large", scu: 576 },
    { name: "RSI Polaris", size: "Capital", scu: 576 },
    { name: "Crusader M2 Hercules Starlifter", size: "Large", scu: 522, grids: { 'Grid 1': { W: 8, L: 15, H: 4 }, 'Grid 2': { W: 6, L: 9, H: 3 } } },
    { name: "Anvil Carrack", size: "Large", scu: 456, grids: { 'Grid 1': { W: 14, L: 14, H: 4 } } },
    { name: "Aegis Reclaimer", size: "Capital", scu: 420 },
    { name: "Origin 890 Jump", size: "Capital", scu: 388 },
    { name: "MISC Starfarer", size: "Large", scu: 291 },
    { name: "MISC Starfarer Gemini", size: "Large", scu: 291 },
    { name: "MISC Starlancer Max", size: "Large", scu: 224 },
    { name: "Crusader A2 Hercules Starlifter", size: "Large", scu: 216, grids: { 'Grid 1': { W: 6, L: 18, H: 2 } } },
    { name: "RSI Constellation Taurus", size: "Large", scu: 174 },
    { name: "RSI Zeus Mk II CL", size: "Medium", scu: 128 },
    { name: "MISC Freelancer MAX", size: "Medium", scu: 120 },
    { name: "Crusader Mercury Star Runner", size: "Large", scu: 114, grids: { 'Grid 1': { W: 6, L: 6, H: 3 }, 'Grid 2': { W: 1, L: 3, H: 2 } } },
    { name: "Argo MOLE", size: "Medium", scu: 96 },
    { name: "Argo RAFT", size: "Medium", scu: 96, grids: { 'Grid 1': { W: 2, L: 8, H: 2 }, 'Grid 2': { W: 2, L: 8, H: 2 }, 'Grid 3': { W: 2, L: 8, H: 2 } } },
    { name: "RSI Constellation Andromeda", size: "Large", scu: 96 },
    { name: "RSI Constellation Aquila", size: "Large", scu: 96 },
    { name: "RSI Constellation Phoenix", size: "Large", scu: 80 },
    { name: "Drake Corsair", size: "Large", scu: 72 },
    { name: "MISC Freelancer", size: "Medium", scu: 66 },
    { name: "Crusader C1 Spirit", size: "Medium", scu: 64, grids: { 'Grid 1': { W: 2, L: 8, H: 2 }, 'Grid 2': { W: 2, L: 8, H: 2 } } },
    { name: "MISC Hull A", size: "Small", scu: 64 },
    { name: "Drake Cutlass Black", size: "Medium", scu: 46 },
    { name: "Origin 600i", size: "Large", scu: 44 },
    { name: "Origin 400i", size: "Large", scu: 42 },
    { name: "Aegis Hammerhead", size: "Large", scu: 40, grids: { 'Grid 1': { W: 4, L: 5, H: 2 } } },
    { name: "MISC Freelancer DUR", size: "Medium", scu: 36 },
    { name: "MISC Freelancer MIS", size: "Medium", scu: 36 },
    { name: "MISC Prospector", size: "Small", scu: 32 },
    { name: "RSI Zeus Mk II ES", size: "Medium", scu: 32 },
    { name: "Anvil Valkyrie", size: "Large", scu: 30, grids: { 'Grid 1': { W: 5, L: 6, H: 1 } } },
    { name: "C.O. Nomad", size: "Small", scu: 24 },
    { name: "Origin 600i Touring", size: "Large", scu: 20 },
    { name: "Argo MPUV Tractor", size: "Snub", scu: 16 },
    { name: "MISC Fortune", size: "Small", scu: 16 },
    { name: "Argo SRV", size: "Medium", scu: 12 },
    { name: "Drake Cutlass Blue", size: "Medium", scu: 12 },
    { name: "Drake Cutlass Red", size: "Medium", scu: 12 },
    { name: "Drake Vulture", size: "Small", scu: 12 },
    { name: "Origin 315p", size: "Small", scu: 12 },
    { name: "Aegis Avenger Titan", size: "Small", scu: 8 },
    { name: "Aegis Avenger Titan Renegade", size: "Small", scu: 8 },
    { name: "Crusader Intrepid", size: "Small", scu: 8 },
    { name: "Origin 300i", size: "Small", scu: 8 }
];

export default ShipList;

export const useShips = () => {
    const [ships, setShips] = useState(() => {
        const savedShips = localStorage.getItem('ships');
        return savedShips ? JSON.parse(savedShips) : [];
    });

    return { ships };
};
