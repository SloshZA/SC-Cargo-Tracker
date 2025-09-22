// Unified Star Citizen NoSQL Database
import { StantonSystemData, StantonQueries } from './stanton-nosql.js';
import { PyroSystemData, PyroQueries } from './pyro-nosql.js';
import { commodities, illegalCommodities } from './commodities.js';

export const StarCitizenDatabase = {
    systems: {
        stanton: StantonSystemData,
        pyro: PyroSystemData
    },
    
    commodities: {
        all: commodities,
        illegal: illegalCommodities
    }
};

// Unified Query Functions
export const DatabaseQueries = {
    // Get all systems
    getSystems: () => {
        return Object.values(StarCitizenDatabase.systems);
    },
    
    // Get system by ID
    getSystem: (systemId) => {
        return StarCitizenDatabase.systems[systemId];
    },
    
    // Get all locations in a system
    getSystemLocations: (systemId) => {
        switch (systemId.toLowerCase()) {
            case 'stanton':
                return StantonQueries.getAllLocations();
            case 'pyro':
                return PyroQueries.getAllLocations();
            default:
                return [];
        }
    },
    
    // Get pickup points for a system
    getPickupPoints: (systemId) => {
        return DatabaseQueries.getSystemLocations(systemId);
    },
    
    // Get locations by planet in a system
    getLocationsByPlanet: (systemId, planetId) => {
        switch (systemId.toLowerCase()) {
            case 'stanton':
                return StantonQueries.getLocationsByPlanet(planetId);
            case 'pyro':
                return PyroQueries.getLocationsByPlanet(planetId);
            default:
                return [];
        }
    },
    
    // Get locations by type in a system
    getLocationsByType: (systemId, type) => {
        switch (systemId.toLowerCase()) {
            case 'stanton':
                return StantonQueries.getLocationsByType(type);
            case 'pyro':
                return PyroQueries.getLocationsByType(type);
            default:
                return [];
        }
    },
    
    // Get planets in a system
    getPlanets: (systemId) => {
        switch (systemId.toLowerCase()) {
            case 'stanton':
                return StantonQueries.getPlanets();
            case 'pyro':
                return PyroQueries.getPlanets();
            default:
                return [];
        }
    },
    
    // Search locations across all systems
    searchAllLocations: (searchTerm) => {
        const allLocations = [];
        
        Object.keys(StarCitizenDatabase.systems).forEach(systemId => {
            const systemLocations = DatabaseQueries.getSystemLocations(systemId);
            systemLocations.forEach(location => {
                allLocations.push({
                    ...location,
                    system: systemId
                });
            });
        });
        
        return allLocations.filter(location => 
            location.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    },
    
    // Search locations in a specific system
    searchLocations: (systemId, searchTerm) => {
        const systemLocations = DatabaseQueries.getSystemLocations(systemId);
        return systemLocations.filter(location => 
            location.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    },
    
    // Get all commodities
    getCommodities: () => {
        return StarCitizenDatabase.commodities.all;
    },
    
    // Get illegal commodities
    getIllegalCommodities: () => {
        return StarCitizenDatabase.commodities.illegal;
    },
    
    // Validate location exists in system
    validateLocation: (systemId, locationName) => {
        const systemLocations = DatabaseQueries.getSystemLocations(systemId);
        return systemLocations.some(location => location.name === locationName);
    },
    
    // Get location details
    getLocationDetails: (systemId, locationName) => {
        const systemLocations = DatabaseQueries.getSystemLocations(systemId);
        return systemLocations.find(location => location.name === locationName);
    },
    
    // Get all gateway stations
    getGateways: () => {
        const stantonLocations = StantonQueries.getAllLocations();
        return stantonLocations.filter(location => location.type === 'gateway');
    },
    
    // Get all stations in a system
    getStations: (systemId) => {
        switch (systemId.toLowerCase()) {
            case 'stanton':
                return StantonQueries.getStations();
            case 'pyro':
                return PyroQueries.getStations();
            default:
                return [];
        }
    },
    
    // Get all cities in a system
    getCities: (systemId) => {
        return DatabaseQueries.getLocationsByType(systemId, 'cities');
    },
    
    // Get all outposts in a system
    getOutposts: (systemId) => {
        return DatabaseQueries.getLocationsByType(systemId, 'outposts');
    },
    
    // Get all distribution centers in a system
    getDistributionCenters: (systemId) => {
        return DatabaseQueries.getLocationsByType(systemId, 'distribution');
    },
    
    // Get all Lagrange stations in a system
    getLagrangeStations: (systemId) => {
        return DatabaseQueries.getLocationsByType(systemId, 'lagrange');
    }
};

// Export the database and queries
export default StarCitizenDatabase;
