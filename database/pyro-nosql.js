// Pyro System Data - NoSQL Document Structure
import { commodities } from './commodities.js';

export const PyroSystemData = {
    id: 'pyro',
    name: 'Pyro System',
    security: 'low',
    
    planets: {
        pyro1: {
            id: 'pyro1',
            name: 'Pyro 1',
            type: 'planet',
            atmosphere: 'toxic',
            locations: {
                outposts: ['Stags Rut'],
                salvage: ['Rsutville']
            }
        },
        
        monox: {
            id: 'monox',
            name: 'Monox',
            type: 'planet',
            atmosphere: 'toxic',
            locations: {
                outposts: ['Arid Reach', 'Jacksons Swap'],
                mining: ['Yangs Place', 'Ostlers Claim', 'Last Ditch'],
                salvage: ['Sunset Mesa']
            }
        },
        
        bloom: {
            id: 'bloom',
            name: 'Bloom',
            type: 'planet',
            atmosphere: 'toxic',
            locations: {
                outposts: ['Narenas Rest', 'The Golden Riviera', 'Frigid Knot', 'ShadowFall'],
                salvage: ['Windfall'],
                farming: ['The Yard', 'Shepherds Rest'],
                mining: ['Cravers Ridge', 'Bueno Ravine']
            }
        },
        
        pyro4: {
            id: 'pyro4',
            name: 'Pyro IV',
            type: 'planet',
            atmosphere: 'toxic',
            locations: {
                outposts: ['Fallow Field', 'Goners Deal', 'Sacrens Plot'],
                salvage: ['Chawlas Breach']
            }
        },
        
        terminus: {
            id: 'terminus',
            name: 'Terminus',
            type: 'planet',
            atmosphere: 'toxic',
            locations: {
                outposts: ['Rough Landing', 'Blackrock Exchange', 'Canard View', 'Stonetree'],
                farming: ['Scrapers Turn', 'Bullocks Reach', 'Kinder Plots'],
                salvage: ['Last Landings']
            }
        },
        
        pyro5: {
            id: 'pyro5',
            name: 'Pyro V',
            type: 'planet',
            atmosphere: 'toxic',
            moons: {
                ignis: {
                    id: 'ignis',
                    name: 'Ignis',
                    locations: {
                        outposts: ['Ashland', 'Kabirs Post']
                    }
                },
                vatra: {
                    id: 'vatra',
                    name: 'Vatra',
                    locations: {
                        salvage: ['Seers Canyon']
                    }
                },
                adir: {
                    id: 'adir',
                    name: 'Adir',
                    locations: {
                        outposts: ['Prophets Peak']
                    }
                }
            }
        }
    },
    
    stations: [
        'Ruin Station',
        'Orbituary',
        'Patch City',
        'Starlight Service Station',
        'Checkmate',
        'Rods Fuel N Supplies',
        'Endgame',
        'Dudley & Daughters',
        'Rats Net',
        'Megumi Refueling',
        'Gaslight',
        'Stanton Gateway'
    ],
    
    commodities: commodities
};

// NoSQL Query Functions for Pyro
export const PyroQueries = {
    // Get all locations in Pyro system
    getAllLocations: () => {
        const locations = [];
        
        // Add stations
        PyroSystemData.stations.forEach(station => {
            locations.push({
                name: station,
                type: 'station',
                category: 'station',
                planet: null,
                planetId: null
            });
        });
        
        // Add planet locations
        Object.values(PyroSystemData.planets).forEach(planet => {
            // Handle planets with moons (like Pyro V)
            if (planet.moons) {
                Object.values(planet.moons).forEach(moon => {
                    Object.entries(moon.locations).forEach(([category, locationList]) => {
                        locationList.forEach(locationName => {
                            locations.push({
                                name: locationName,
                                type: category,
                                category: category,
                                planet: planet.name,
                                planetId: planet.id,
                                moon: moon.name,
                                moonId: moon.id
                            });
                        });
                    });
                });
            } else {
                // Handle regular planets
                Object.entries(planet.locations).forEach(([category, locationList]) => {
                    locationList.forEach(locationName => {
                        locations.push({
                            name: locationName,
                            type: category,
                            category: category,
                            planet: planet.name,
                            planetId: planet.id
                        });
                    });
                });
            }
        });
        
        return locations;
    },
    
    // Get pickup points (all valid pickup locations)
    getPickupPoints: () => {
        return PyroQueries.getAllLocations();
    },
    
    // Get locations by planet
    getLocationsByPlanet: (planetId) => {
        const planet = PyroSystemData.planets[planetId];
        if (!planet) return [];
        
        const locations = [];
        
        // Handle planets with moons
        if (planet.moons) {
            Object.values(planet.moons).forEach(moon => {
                Object.entries(moon.locations).forEach(([category, locationList]) => {
                    locationList.forEach(locationName => {
                        locations.push({
                            name: locationName,
                            type: category,
                            category: category,
                            planet: planet.name,
                            planetId: planet.id,
                            moon: moon.name,
                            moonId: moon.id
                        });
                    });
                });
            });
        } else {
            // Handle regular planets
            Object.entries(planet.locations).forEach(([category, locationList]) => {
                locationList.forEach(locationName => {
                    locations.push({
                        name: locationName,
                        type: category,
                        category: category,
                        planet: planet.name,
                        planetId: planet.id
                    });
                });
            });
        }
        
        return locations;
    },
    
    // Get locations by type/category
    getLocationsByType: (type) => {
        const allLocations = PyroQueries.getAllLocations();
        return allLocations.filter(location => location.type === type);
    },
    
    // Get planets
    getPlanets: () => {
        return Object.values(PyroSystemData.planets);
    },
    
    // Get stations
    getStations: () => {
        return PyroSystemData.stations.map(station => ({
            name: station,
            type: 'station',
            category: 'station',
            planet: null,
            planetId: null
        }));
    },
    
    // Search locations by name
    searchLocations: (searchTerm) => {
        const allLocations = PyroQueries.getAllLocations();
        return allLocations.filter(location => 
            location.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    },
    
    // Get commodities
    getCommodities: () => {
        return PyroSystemData.commodities;
    }
};

export default PyroSystemData;
