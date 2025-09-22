// Refactored Stanton System Data - NoSQL Document Structure
import { commodities } from './commodities.js';

export const StantonSystemData = {
    id: 'stanton',
    name: 'Stanton System',
    security: 'high',
    
    planets: {
        arccorp: {
            id: 'arccorp',
            name: 'Arccorp',
            type: 'planet',
            atmosphere: 'breathable',
            locations: {
                cities: ['Area 18'],
                stations: ['Grimm Hex'],
                lagrange: [
                    'ARC-L1 Wide Forest Station',
                    'ARC-L2 Lively Pathway Station',
                    'ARC-L3 Modern Express Station',
                    'ARC-L4 Faint Glen Station',
                    'ARC-L5 Yellow Core Station'
                ],
                distribution: [
                    'Covalex Distribution Centre S1DC06',
                    'Greycat Stanton 1 Production Complex-B',
                    'HDPC-Cassillo',
                    'HDPC-Farnesway',
                    'Sakura Sun Magnolia Workcenter'
                ],
                outposts: [
                    'Humboldt Mine',
                    'Loveridge Mineral Reserve',
                    'Shubin Mining Facility SAL-2',
                    'Shubin Mining Facility SAL-5'
                ]
            },
            planetLocations: {
                cities: ['Area 18'],
                distribution: [
                    'Covalex Distribution Centre S1DC06',
                    'Greycat Stanton 1 Production Complex-B',
                    'HDPC-Cassillo',
                    'HDPC-Farnesway',
                    'Sakura Sun Magnolia Workcenter'
                ],
                outposts: [
                    'Humboldt Mine',
                    'Loveridge Mineral Reserve',
                    'Shubin Mining Facility SAL-2',
                    'Shubin Mining Facility SAL-5'
                ]
            },
            spaceLocations: {
                stations: ['Grimm Hex'],
                lagrange: [
                    'ARC-L1 Wide Forest Station',
                    'ARC-L2 Lively Pathway Station',
                    'ARC-L3 Modern Express Station',
                    'ARC-L4 Faint Glen Station',
                    'ARC-L5 Yellow Core Station'
                ]
            },
            moons: {
                lyria: {
                    id: 'lyria',
                    name: 'Lyria',
                    locations: {
                        outposts: [
                            'Humboldt Mine',
                            'Loveridge Mineral Reserve',
                            'Shubin Mining Facility SAL-2',
                            'Shubin Mining Facility SAL-5'
                        ]
                    }
                },
                wala: {
                    id: 'wala',
                    name: 'Wala',
                    locations: {
                        outposts: [
                            'ArcCorp Mining Area 045',
                            'ArcCorp Mining Area 048',
                            'ArcCorp Mining Area 056',
                            'ArcCorp Mining Area 061'
                        ],
                        salvage: [
                            'Samson & Sons Salvage Center'
                        ],
                        farming: [
                            'Shady Glen Farms'
                        ]
                    }
                }
            }
        },
        
        crusader: {
            id: 'crusader',
            name: 'Crusader',
            type: 'gas_giant',
            atmosphere: 'toxic',
            locations: {
                cities: ['Orison'],
                stations: ['Everus Harbor'],
                lagrange: [
                    'CRU-L1 Ambitious Dream Station',
                    'CRU-L4 Shallow Fields Station',
                    'CRU-L5 Beautiful Glen Station'
                ],
                distribution: [],
                outposts: [
                    'Gallee Family Farms',
                    'Hickes Research Outpost',
                    'Terra Mills Hydrofarm',
                    'Tram & Myers Mining',
                    'ArcCorp Mining Area 141',
                    'Bountiful Harvest Hydroponics',
                    'Kudre Ore',
                    'Shubin Mining Facility SCD-1',
                    'Brios Breaker Yard',
                    'ArcCorp Mining Area 157',
                    'Benson Mining Outpost',
                    'Deakins Research Outpost'
                ]
            },
            planetLocations: {
                cities: ['Orison'],
                distribution: [],
                outposts: [
                    'Gallee Family Farms',
                    'Hickes Research Outpost',
                    'Terra Mills Hydrofarm',
                    'Tram & Myers Mining',
                    'ArcCorp Mining Area 141',
                    'Bountiful Harvest Hydroponics',
                    'Kudre Ore',
                    'Shubin Mining Facility SCD-1',
                    'Brios Breaker Yard',
                    'ArcCorp Mining Area 157',
                    'Benson Mining Outpost',
                    'Deakins Research Outpost'
                ]
            },
            spaceLocations: {
                stations: ['Everus Harbor'],
                lagrange: [
                    'CRU-L1 Ambitious Dream Station',
                    'CRU-L4 Shallow Fields Station',
                    'CRU-L5 Beautiful Glen Station'
                ]
            },
            moons: {
                cellin: {
                    id: 'cellin',
                    name: 'Cellin',
                    locations: {
                        outposts: [
                            'Gallee Family Farms',
                            'Hickes Research Outpost',
                            'Terra Mills Hydrofarm',
                            'Tram & Myers Mining'
                        ]
                    }
                },
                daymar: {
                    id: 'daymar',
                    name: 'Daymar',
                    locations: {
                        outposts: [
                            'ArcCorp Mining Area 141',
                            'Bountiful Harvest Hydroponics',
                            'Kudre Ore',
                            'Shubin Mining Facility SCD-1',
                            'Brios Breaker Yard'
                        ]
                    }
                },
                yela: {
                    id: 'yela',
                    name: 'Yela',
                    locations: {
                        outposts: [
                            'ArcCorp Mining Area 157',
                            'Benson Mining Outpost',
                            'Deakins Research Outpost'
                        ]
                    }
                }
            }
        },
        
        hurston: {
            id: 'hurston',
            name: 'Hurston',
            type: 'planet',
            atmosphere: 'breathable',
            locations: {
                cities: ['Lorville', 'Riker Memorial Spaceport'],
                stations: ['Baijini Point'],
                lagrange: [
                    'HUR-L1 Green Glade Station',
                    'HUR-L2 Faithful Dream Station',
                    'HUR-L3 Thundering Express Station',
                    'HUR-L4 Melodic Fields Station',
                    'HUR-L5 High Course Station'
                ],
                distribution: [],
                outposts: [
                    'HDMS-Bezdek',
                    'HDMS-Lathan',
                    'HDMS-Anderson',
                    'HDMS-Norgaard',
                    'HDMS-Ryder',
                    'HDMS-Woodruff',
                    'HDMS-Hahn',
                    'HDMS-Perlman',
                    'HDMS-Oparei',
                    'HDMS-Edmond',
                    'HDMS-Hadley',
                    'HDMS-Thedus',
                    'HDMS-Stanhope',
                    'HDMS-Pinewood'
                ]
            },
            planetLocations: {
                cities: ['Lorville', 'Riker Memorial Spaceport'],
                distribution: [],
                outposts: [
                    'HDMS-Bezdek',
                    'HDMS-Lathan',
                    'HDMS-Anderson',
                    'HDMS-Norgaard',
                    'HDMS-Ryder',
                    'HDMS-Woodruff',
                    'HDMS-Hahn',
                    'HDMS-Perlman',
                    'HDMS-Oparei',
                    'HDMS-Edmond',
                    'HDMS-Hadley',
                    'HDMS-Thedus',
                    'HDMS-Stanhope',
                    'HDMS-Pinewood'
                ]
            },
            spaceLocations: {
                stations: ['Baijini Point'],
                lagrange: [
                    'HUR-L1 Green Glade Station',
                    'HUR-L2 Faithful Dream Station',
                    'HUR-L3 Thundering Express Station',
                    'HUR-L4 Melodic Fields Station',
                    'HUR-L5 High Course Station'
                ]
            },
            moons: {
                arial: {
                    id: 'arial',
                    name: 'Arial',
                    locations: {
                        outposts: [
                            'HDMS-Bezdek',
                            'HDMS-Lathan'
                        ]
                    }
                },
                aberdeen: {
                    id: 'aberdeen',
                    name: 'Aberdeen',
                    locations: {
                        outposts: [
                            'HDMS-Anderson',
                            'HDMS-Norgaard'
                        ]
                    }
                },
                ita: {
                    id: 'ita',
                    name: 'Ita',
                    locations: {
                        outposts: [
                            'HDMS-Ryder',
                            'HDMS-Woodruff'
                        ]
                    }
                },
                magda: {
                    id: 'magda',
                    name: 'Magda',
                    locations: {
                        outposts: [
                            'HDMS-Hahn',
                            'HDMS-Perlman'
                        ]
                    }
                }
            }
        },
        
        microtech: {
            id: 'microtech',
            name: 'Microtech',
            type: 'planet',
            atmosphere: 'breathable',
            locations: {
                cities: ['New Babbage', 'NB Int Spaceport'],
                stations: ['Seraphim Station', 'Port Tressler'],
                lagrange: [
                    'MIC-L1 Shallow Frontier Station',
                    'MIC-L2 Long Forest Station',
                    'MIC-L3 Endless Odyssey Station',
                    'MIC-L4 Red Crossroads Station',
                    'MIC-L5 Modern Icarus Station'
                ],
                distribution: [
                    'Covalex Distribution Center S4DC05',
                    'Greycat Stanton IV Production Complex-A',
                    'Sakura Sun Goldenrod Workcenter',
                    'microTech Logistics Depot S4LD01',
                    'microTech Logistics Depot S4LD13',
                    'Shubin Mining Facility SM0-10',
                    'Shubin Mining Facility SM0-13',
                    'Shubin Mining Facility SM0-18',
                    'Shubin Mining Facility SM0-22'
                ],
                outposts: [
                    'Rayari Deltana Research Outpost',
                    'Rayari Anvik Research Outpost',
                    'Rayari Kaltag Research Outpost',
                    'Shubin Mining Facility SMCa-6',
                    'Shubin Mining Facility SMCa-8',
                    'Rayari Cantwell Research Outpost',
                    'Rayari McGrath Research Outpost',
                    'Devlin Scrap & Salvage'
                ]
            },
            planetLocations: {
                cities: ['New Babbage', 'NB Int Spaceport'],
                distribution: [
                    'Covalex Distribution Center S4DC05',
                    'Greycat Stanton IV Production Complex-A',
                    'Sakura Sun Goldenrod Workcenter',
                    'microTech Logistics Depot S4LD01',
                    'microTech Logistics Depot S4LD13',
                    'Shubin Mining Facility SM0-10',
                    'Shubin Mining Facility SM0-13',
                    'Shubin Mining Facility SM0-18',
                    'Shubin Mining Facility SM0-22'
                ],
                outposts: [
                    'Rayari Deltana Research Outpost',
                    'Rayari Anvik Research Outpost',
                    'Rayari Kaltag Research Outpost',
                    'Shubin Mining Facility SMCa-6',
                    'Shubin Mining Facility SMCa-8',
                    'Rayari Cantwell Research Outpost',
                    'Rayari McGrath Research Outpost',
                    'Devlin Scrap & Salvage'
                ]
            },
            spaceLocations: {
                stations: ['Seraphim Station', 'Port Tressler'],
                lagrange: [
                    'MIC-L1 Shallow Frontier Station',
                    'MIC-L2 Long Forest Station',
                    'MIC-L3 Endless Odyssey Station',
                    'MIC-L4 Red Crossroads Station',
                    'MIC-L5 Modern Icarus Station'
                ]
            },
            moons: {
                calliope: {
                    id: 'calliope',
                    name: 'Calliope',
                    locations: {
                        outposts: [
                            'Rayari Anvik Research Outpost',
                            'Rayari Kaltag Research Outpost',
                            'Shubin Mining Facility SMCa-6',
                            'Shubin Mining Facility SMCa-8'
                        ]
                    }
                },
                clio: {
                    id: 'clio',
                    name: 'Clio',
                    locations: {
                        outposts: [
                            'Rayari Cantwell Research Outpost',
                            'Rayari McGrath Research Outpost'
                        ]
                    }
                },
                euterpe: {
                    id: 'euterpe',
                    name: 'Euterpe',
                    locations: {
                        salvage: [
                            'Devlin Scrap & Salvage'
                        ]
                    }
                }
            }
        }
    },
    
    gateways: [
        'Pyro Gateway',
        'Magnus Gateway',
        'Terra Gateway'
    ],
    
    commodities: commodities
};

// NoSQL Query Functions for Stanton
export const StantonQueries = {
    // Get all locations in Stanton system
    getAllLocations: () => {
        const locations = [];
        
        // Add gateways
        StantonSystemData.gateways.forEach(gateway => {
            locations.push({
                name: gateway,
                type: 'gateway',
                category: 'gateway',
                planet: null,
                planetId: null
            });
        });
        
        // Add planet locations
        Object.values(StantonSystemData.planets).forEach(planet => {
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
            
            // Add moon locations
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
            }
        });
        
        return locations;
    },
    
    // Get pickup points (all valid pickup locations)
    getPickupPoints: () => {
        return StantonQueries.getAllLocations();
    },
    
    // Get locations by planet
    getLocationsByPlanet: (planetId) => {
        const planet = StantonSystemData.planets[planetId];
        if (!planet) return [];
        
        const locations = [];
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
        
        return locations;
    },
    
    // Get locations by type/category
    getLocationsByType: (type) => {
        const allLocations = StantonQueries.getAllLocations();
        return allLocations.filter(location => location.type === type);
    },
    
    // Get planet locations (cities, distribution, outposts)
    getPlanetLocations: (planetId) => {
        const planet = StantonSystemData.planets[planetId];
        if (!planet) return [];
        
        const locations = [];
        Object.entries(planet.planetLocations).forEach(([category, locationList]) => {
            locationList.forEach(locationName => {
                locations.push({
                    name: locationName,
                    type: category,
                    category: category,
                    planet: planet.name,
                    planetId: planet.id,
                    locationType: 'planet'
                });
            });
        });
        
        return locations;
    },
    
    // Get space locations (stations, lagrange)
    getSpaceLocations: (planetId) => {
        const planet = StantonSystemData.planets[planetId];
        if (!planet) return [];
        
        const locations = [];
        Object.entries(planet.spaceLocations).forEach(([category, locationList]) => {
            locationList.forEach(locationName => {
                locations.push({
                    name: locationName,
                    type: category,
                    category: category,
                    planet: planet.name,
                    planetId: planet.id,
                    locationType: 'space'
                });
            });
        });
        
        return locations;
    },
    
    // Get all planet locations in system
    getAllPlanetLocations: () => {
        const locations = [];
        Object.values(StantonSystemData.planets).forEach(planet => {
            Object.entries(planet.planetLocations).forEach(([category, locationList]) => {
                locationList.forEach(locationName => {
                    locations.push({
                        name: locationName,
                        type: category,
                        category: category,
                        planet: planet.name,
                        planetId: planet.id,
                        locationType: 'planet'
                    });
                });
            });
        });
        return locations;
    },
    
    // Get all space locations in system
    getAllSpaceLocations: () => {
        const locations = [];
        Object.values(StantonSystemData.planets).forEach(planet => {
            Object.entries(planet.spaceLocations).forEach(([category, locationList]) => {
                locationList.forEach(locationName => {
                    locations.push({
                        name: locationName,
                        type: category,
                        category: category,
                        planet: planet.name,
                        planetId: planet.id,
                        locationType: 'space'
                    });
                });
            });
        });
        return locations;
    },
    
    // Get planets
    getPlanets: () => {
        return Object.values(StantonSystemData.planets);
    },
    
    // Get stations
    getStations: () => {
        return StantonQueries.getLocationsByType('stations');
    },
    
    // Search locations by name
    searchLocations: (searchTerm) => {
        const allLocations = StantonQueries.getAllLocations();
        return allLocations.filter(location => 
            location.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    },
    
    // Get commodities
    getCommodities: () => {
        return StantonSystemData.commodities;
    }
};

export default StantonSystemData;
