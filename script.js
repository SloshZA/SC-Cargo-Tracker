import Tesseract from 'tesseract.js';
import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import Select from 'react-select';
import TestFeatures from './components/TestFeatures';
import './styles.css';
import Portal from './components/Portal';
import './styles/Header.css';
import './styles/Tabs.css';
import './styles/Content.css';
import './styles/HaulingMissions.css';
import './styles/Table.css';
import './styles/Preferences.css';
import './styles/History.css';
console.log('Script is running');
const crypto = require('crypto');
const nonce = crypto.randomBytes(16).toString('base64');
//Presets
//'--City--',
//'--Distribution Center--',
//'--Stations--',
//'--Lagrange Stations--',
//'--Outpost--',
//'--Scrapyard--',
//'--Farming Outpost--',
const data = {
    planets: ['Arccorp', 'Crusader', 'Hurston', 'Microtech'],
    stations: [
        '--Stations--',
        'Grimm Hex',
        'Everus Harbor',
        'Baijini Point',
        'Seraphim Station',
        'Port Tressler',
        'Pyro Gateway',
        'Magnus Gateway',
        '--Lagrange Stations--',
        'ARC-L1 Wide Forest Station',
        'ARC-L2 Lively Pathway Station',
        'ARC-L3 Modern Express Station',
        'ARC-L4 Faint Glen Station',
        'ARC-L5 Yellow Core Station',
        'CRU-L1 Ambitious Dream Station',
        'CRU-L4 Shallow Fields Station',
        'CRU-L5 Beautiful Glen Station',
        'HUR-L1 Green Glade Station',
        'HUR-L2 Faithful Dream Station',
        'HUR-L3 Thundering Express Station',
        'HUR-L4 Melodic Fields Station',
        'HUR-L5 High Course Station',
        'MIC-L1 Shallow Frontier Station',
        'MIC-L2 Long Forest Station',
        'MIC-L3 Endless Odyssey Station',
        'MIC-L4 Red Crossroads Station',
        'MIC-L5 Modern Icarus Station',
    ],
    Dropoffpoints: {
        Arccorp: ['--City--','Area 18'],
        Crusader: ['--City--','Orison'],
        Hurston: [
            '--City--',//
            'Lorville',
            '--Distribution Center--',//
            'Covalex Distribution Centre S1DC06',
            'Greycat Stanton 1 Production Complex-B',
            'HDPC-Cassillo',
            'HDPC-Farnesway',
            'Sakura Sun Magnolia Workcenter'
        ],
        Microtech: [
            '--City--',
            'NB Int Spaceport',
            '--Distribution Center--',
            'Covalex Distribution Center S4DC05',
            'Greycat Stanton IV Production Complex-A',
            'Sakura Sun Goldenrod Workcenter',
            'microTech Logistics Depot S4LD01',
            'microTech Logistics Depot S4LD13',
            'Shubin Mining Facility SM0-10',
            'Shubin Mining Facility SM0-13',
            'Shubin Mining Facility SM0-18',
            'Shubin Mining Facility SM0-22'
        ]
    },
    moons: {
        Arccorp: {
            Lyria: [
                '--Outpost--',
                'Humboldt Mine',
                'Loveridge Mineral Reserve',
                'Shubin Mining Facility SAL-2',
                'Shubin Mining Facility SAL-5'
            ],
            Wala: [
                '--Outpost--',
                'ArcCorp Mining Area 045',
                'ArcCorp Mining Area 048',
                'ArcCorp Mining Area 056',
                'ArcCorp Mining Area 061',
                '--Scrapyard--',
                'Samson & Sons Salvage Center',
                '--Farming Outpost--',
                'Shady Glen Farms'
            ]
        },
        Crusader: {
            Cellin: [
                '--Outpost--',
                'Gallee Family Farms',
                'Hickes Research Outpost',
                'Terra Mills Hydrofarm',
                'Tram & Myers Mining'
            ],
            Daymar: [
                '--Outpost--',
                'ArcCorp Mining Area 141',
                'Bountiful Harvest Hydroponics',
                'Kudre Ore',
                'Shubin Mining Facility SCD-1',
                'Brios Breaker Yard'
            ],
            Yela: [
                '--Outpost--',
                'ArcCorp Mining Area 157',
                'Benson Mining Outpost',
                'Deakins Research Outpost'
            ]
        },
        Hurston: {
            Arial: [
                '--Outpost--',
                'HDMS-Bezdek',
                'HDMS-Lathan'
            ],
            Aberdeen: [
                '--Outpost--',
                'HDMS-Anderson',
                'HDMS-Norgaard'
            ],
            Ita: [
                '--Outpost--',
                'HDMS-Ryder',
                'HDMS-Woodruff'
            ],
            Magda: [
                '--Outpost--',
                'HDMS-Hahn',
                'HDMS-Perlman'
            ]
        },
        Microtech: {
            Calliope: [
                '--Outpost--',
                'Rayari Anvik Research Outpost',
                'Rayari Kaltag Research Outpost',
                'Shubin Mining Facility SMCa-6',
                'Shubin Mining Facility SMCa-8'
            ],
            Clio: [
                '--Outpost--',
                'Rayari Cantwell Research Outpost',
                'Rayari McGrath Research Outpost'
            ],
            Euterpe: [
                '--Outpost--',
                'Devlin Scrap & Salvage'
            ]
        }
    },
    commodities: [
        'Aluminum',
        'Carbon',
        'Corundum',
        'Processed Food',
        'Pressurized ice',
        'Agricultural Supplies',
        'Quartz',
        'Silicon',
        'Stims',
        'Tin',
        'Titanium',
        'Tungsten',
        'Hydrogen Fuel',
        'Quantum Fuel',
        'Ship Ammunition',
        'Scrap',
        'Waste',
        'Ship Ammunition',
        'Quantum Fuel',
        'Corundum (Raw)',
        'Quartz (Raw)',
        'Silicon (Raw)',
        'Tin (Raw)',
        'Titanium (Raw)',
        'Tungsten (Raw)'
    ],
    pickupPoints: [
        '--City--',
        'Lorville',
        'NB Int Spaceport',
        'Area 18',
        'Orison',
        '--Station--',
        'Grimm Hex',
        'Everus Harbor',
        'Baijini Point',
        'Seraphim Station',
        'Port Tressler',
        'Pyro Gateway',
        'Magnus Gateway',
        '--Lagrange Stations--',
        'ARC-L1 Wide Forest Station',
        'ARC-L2 Lively Pathway Station',
        'ARC-L3 Modern Express Station',
        'ARC-L4 Faint Glen Station',
        'ARC-L5 Yellow Core Station',
        'CRU-L1 Ambitious Dream Station',
        'CRU-L4 Shallow Fields Station',
        'CRU-L5 Beautiful Glen Station',
        'HUR-L1 Green Glade Station',
        'HUR-L2 Faithful Dream Station',
        'HUR-L3 Thundering Express Station',
        'HUR-L4 Melodic Fields Station',
        'HUR-L5 High Course Station',
        'MIC-L1 Shallow Frontier Station',
        'MIC-L2 Long Forest Station',
        'MIC-L3 Endless Odyssey Station',
        'MIC-L4 Red Crossroads Station',
        'MIC-L5 Modern Icarus Station',        'MIC-L5',
        '--Distribution Center--',
        'Covalex Distribution Center S4DC05',
        'Greycat Stanton IV Production Complex-A',
        'Sakura Sun Goldenrod Workcenter',
        'microTech Logistics Depot S4LD01',
        'microTech Logistics Depot S4LD13',
        'Shubin Mining Facility SM0-10',
        'Shubin Mining Facility SM0-13',
        'Shubin Mining Facility SM0-18',
        'Shubin Mining Facility SM0-22',
        'Covalex Distribution Centre S1DC06',
        'Greycat Stanton I Production Complex-B',
        'HDPC-Cassillo',
        'HDPC-Farnesway',
        'Sakura Sun Magnolia Workcenter',
        '--Outpost--',
        'Humboldt Mine',
        'Loveridge Mineral Reserve',
        'Shubin Mining Facility SAL-2',
        'Shubin Mining Facility SAL-5',
        'ArcCorp Mining Area 045',
        'ArcCorp Mining Area 048',
        'ArcCorp Mining Area 056',
        'ArcCorp Mining Area 061',
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
        'Deakins Research Outpost',
        'HDMS-Bezdek',
        'HDMS-Lathan',
        'HDMS-Anderson',
        'HDMS-Norgaard',
        'HDMS-Ryder',
        'HDMS-Woodruff',
        'HDMS-Hahn',
        'HDMS-Perlman',
        'Rayari Anvik Research Outpost',
        'Rayari Kaltag Research Outpost',
        'Shubin Mining Facility SMCa-6',
        'Shubin Mining Facility SMCa-8',
        'Rayari Cantwell Research Outpost',
        'Rayari McGrath Research Outpost',
        'Devlin Scrap & Salvage',
        '--Scrapyard--',
        '--Farming Outpost--'
    ],
    quickLookup: [
        '--City--',
        'Lorville',
        'NB Int Spaceport',
        'Area 18',
        'Orison',
        '--Station--',
        'Grimm Hex',
        'Everus Harbor',
        'Baijini Point',
        'Seraphim Station',
        'Port Tressler',
        'Pyro Gateway',
        'Magnus Gateway',
        '--Lagrange Stations--',
        'ARC-L1 Wide Forest Station',
        'ARC-L2 Lively Pathway Station',
        'ARC-L3 Modern Express Station',
        'ARC-L4 Faint Glen Station',
        'ARC-L5 Yellow Core Station',
        'CRU-L1 Ambitious Dream Station',
        'CRU-L4 Shallow Fields Station',
        'CRU-L5 Beautiful Glen Station',
        'HUR-L1 Green Glade Station',
        'HUR-L2 Faithful Dream Station',
        'HUR-L3 Thundering Express Station',
        'HUR-L4 Melodic Fields Station',
        'HUR-L5 High Course Station',
        'MIC-L1 Shallow Frontier Station',
        'MIC-L2 Long Forest Station',
        'MIC-L3 Endless Odyssey Station',
        'MIC-L4 Red Crossroads Station',
        'MIC-L5 Modern Icarus Station',        'MIC-L5',
        '--Distribution Center--',
        'Covalex Distribution Center S4DC05',
        'Greycat Stanton IV Production Complex-A',
        'Sakura Sun Goldenrod Workcenter',
        'microTech Logistics Depot S4LD01',
        'microTech Logistics Depot S4LD13',
        'Shubin Mining Facility SM0-10',
        'Shubin Mining Facility SM0-13',
        'Shubin Mining Facility SM0-18',
        'Shubin Mining Facility SM0-22',
        'Covalex Distribution Centre S1DC06',
        'Greycat Stanton 1 Production Complex-B',
        'HDPC-Cassillo',
        'HDPC-Farnesway',
        'Sakura Sun Magnolia Workcenter',
        '--Outpost--',
        'Humboldt Mine',
        'Loveridge Mineral Reserve',
        'Shubin Mining Facility SAL-2',
        'Shubin Mining Facility SAL-5',
        'ArcCorp Mining Area 045',
        'ArcCorp Mining Area 048',
        'ArcCorp Mining Area 056',
        'ArcCorp Mining Area 061',
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
        'Deakins Research Outpost',
        'HDMS-Bezdek',
        'HDMS-Lathan',
        'HDMS-Anderson',
        'HDMS-Norgaard',
        'HDMS-Ryder',
        'HDMS-Woodruff',
        'HDMS-Hahn',
        'HDMS-Perlman',
        'Rayari Anvik Research Outpost',
        'Rayari Kaltag Research Outpost',
        'Shubin Mining Facility SMCa-6',
        'Shubin Mining Facility SMCa-8',
        'Rayari Cantwell Research Outpost',
        'Rayari McGrath Research Outpost',
        'Devlin Scrap & Salvage',
        '--Scrapyard--',
        '--Farming Outpost--'
    ]
};

const customStyles = {
    control: (provided) => ({
        ...provided,
        backgroundColor: '#333',
        border: '1px solid #333',
        borderRadius: '5px',
        padding: '5px',
        fontFamily: 'Orbitron, sans-serif',
        color: 'var(--dropdown-text-color)',
        fontSize: '14px' // Add text size
    }),
    menu: (provided) => ({
        ...provided,
        backgroundColor: '#333',
        color: 'var(--dropdown-text-color)',
        fontSize: '14px',
        minWidth: '300px', // Make dropdown wider than input
        maxHeight: '400px', // Add scroll for long lists
        padding: '8px',
        marginTop: '4px',
        borderRadius: '4px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
    }),
    option: (provided, state) => {
        const isUnselectable = state.data.value.startsWith('--');
        return {
            ...provided,
            backgroundColor: state.isFocused && !isUnselectable ? '#444' : '#333',
            color: isUnselectable ? 'white' : 'var(--dropdown-text-color)',
            fontSize: '14px', // Add text size
            fontWeight: isUnselectable ? 'bold' : 'normal', // Bold for unselectable options
            fontStyle: isUnselectable ? 'italic' : 'normal', // Italic for unselectable options
            cursor: isUnselectable ? 'not-allowed' : 'default', // Not-allowed cursor for unselectable options
            pointerEvents: isUnselectable ? 'none' : 'auto' // Disable pointer events for unselectable options
        };
    },
    singleValue: (provided) => ({
        ...provided,
        color: 'var(--dropdown-text-color)',
        fontSize: '14px' // Add text size
    }),
};

const STATUS_OPTIONS = ['Pending', 'In Progress', 'Delivered', 'Failed'];

// Add this function at the top of the file
function findClosestMatch(input, options) {
    if (!input || !options || options.length === 0) return null;

    // Remove special characters and normalize case
    const cleanInput = input.replace(/[^a-zA-Z0-9\s]/g, '').toLowerCase();
    
    let bestMatch = null;
    let bestScore = -Infinity;

    options.forEach(option => {
        const cleanOption = option.replace(/[^a-zA-Z0-9\s]/g, '').toLowerCase();
        
        // Calculate similarity score
        let score = 0;
        const inputWords = cleanInput.split(' ');
        const optionWords = cleanOption.split(' ');
        
        // Compare word by word
        inputWords.forEach(word => {
            if (optionWords.includes(word)) {
                score += word.length * 2; // Higher weight for exact word matches
            } else {
                // Check for partial matches
                optionWords.forEach(optionWord => {
                    if (optionWord.includes(word) || word.includes(optionWord)) {
                        score += Math.min(word.length, optionWord.length);
                    }
                });
            }
        });

        // Prefer shorter matches when scores are equal
        if (score > bestScore || (score === bestScore && cleanOption.length < bestMatch.length)) {
            bestScore = score;
            bestMatch = option;
        }
    });

    // Only return a match if it meets a minimum threshold
    return bestScore >= cleanInput.length * 0.5 ? bestMatch : null;
}

const App = () => {
    const [darkMode, setDarkMode] = useState(false);
    const [activeTab, setActiveTab] = useState('Hauling Missions');
    const [isAutoScaling, setIsAutoScaling] = useState(true); // Add state for auto-scaling
    const [locationType, setLocationType] = useState('planet');
    const [selectedPlanet, setSelectedPlanet] = useState('');
    const [selectedMoon, setSelectedMoon] = useState('');
    const [selectedDropOffPoint, setSelectedDropOffPoint] = useState('');
    const [isMission, setIsMission] = useState(false);
    const [entries, setEntries] = useState(() => {
        const savedEntries = localStorage.getItem('entries');
        return savedEntries ? JSON.parse(savedEntries) : [];
    });

    const [historyEntries, setHistoryEntries] = useState(() => {
        const savedHistory = localStorage.getItem('historyEntries');
        return savedHistory ? JSON.parse(savedHistory) : [];
    });
    const [collapsed, setCollapsed] = useState(() => {
        const savedCollapsed = localStorage.getItem('collapsed');
        return savedCollapsed ? JSON.parse(savedCollapsed) : {};
    }); // Define collapsed state
    const amountInputRef = useRef(null); // Reference for amount input

    const [dropdownLabelColor, setDropdownLabelColor] = useState(() => localStorage.getItem('dropdownLabelColor') || '#00ffcc');
    const [dropdownTextColor, setDropdownTextColor] = useState(() => localStorage.getItem('dropdownTextColor') || '#00ffcc');
    const [buttonColor, setButtonColor] = useState(() => localStorage.getItem('buttonColor') || '#00ffcc');
    const [titleColor, setTitleColor] = useState(() => localStorage.getItem('titleColor') || '#00ffcc');
    const [dropOffHeaderTextColor, setDropOffHeaderTextColor] = useState(() => localStorage.getItem('dropOffHeaderTextColor') || '#00ffcc');
    const [rowTextColor, setRowTextColor] = useState(() => localStorage.getItem('rowTextColor') || '#00ffcc');
    const [tableHeaderTextColor, setTableHeaderTextColor] = useState(() => localStorage.getItem('tableHeaderTextColor') || '#00ffcc');
    const [missionTextColor, setMissionTextColor] = useState(() => localStorage.getItem('missionTextColor') || '#00ffcc');
    const [tableOutlineColor, setTableOutlineColor] = useState(() => localStorage.getItem('tableOutlineColor') || '#00ffcc');

    const [isAlternateTable, setIsAlternateTable] = useState(false);
    const [collapsedMissions, setCollapsedMissions] = useState(() => {
        const savedCollapsedMissions = localStorage.getItem('collapsedMissions');
        return savedCollapsedMissions ? JSON.parse(savedCollapsedMissions) : Array(10).fill(true);
    });

    const [selectedMissions, setSelectedMissions] = useState(Array(10).fill(false));
    const [missionEntries, setMissionEntries] = useState(() => {
        const savedMissionEntries = localStorage.getItem('missionEntries');
        return savedMissionEntries ? JSON.parse(savedMissionEntries) : Array(10).fill([]);
    });

    const [firstDropdownValue, setFirstDropdownValue] = useState('');
    const [secondDropdownValue, setSecondDropdownValue] = useState('');
    const [firstDropdownOptions, setFirstDropdownOptions] = useState([]);
    const [secondDropdownOptions, setSecondDropdownOptions] = useState([]);
    const quickLookupOptions = data.quickLookup.map(option => ({ value: option, label: option }));

    const planetOptions = data.planets.map(planet => ({ value: planet, label: planet }));
    const stationOptions = data.stations.map(station => ({ value: station, label: station }));
    const commodityOptions = data.commodities.map(commodity => ({ value: commodity, label: commodity }));
    const [selectedCommodity, setSelectedCommodity] = useState(() => localStorage.getItem('selectedCommodity') || commodityOptions[0].value);
    const pickupPointOptions = data.pickupPoints.map(point => ({ value: point, label: point }));

    const [missionRewards, setMissionRewards] = useState(() => {
        const savedRewards = localStorage.getItem('missionRewards');
        return savedRewards ? JSON.parse(savedRewards) : {};
    });

    const handleRewardChange = (missionId, value) => {
        // Remove all non-digit characters
        const numericValue = value.replace(/\D/g, '');
        
        // Format with commas
        const formattedValue = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        
        const updatedRewards = {
            ...missionRewards,
            [missionId]: formattedValue
        };
        setMissionRewards(updatedRewards);
        localStorage.setItem('missionRewards', JSON.stringify(updatedRewards));
    };

    const handleCheckboxChange = (index) => {
        const updatedSelectedMissions = Array(10).fill(false);
        updatedSelectedMissions[index] = !selectedMissions[index];
        setSelectedMissions(updatedSelectedMissions);
    };

    const getMissionPreview = (missionIndex) => {
        const missionEntriesForIndex = missionEntries[missionIndex];

        return (
            <div className="tooltip">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Drop off points</th>
                            <th>Commodity</th>
                            <th>QTY</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {missionEntriesForIndex.map((entry, index) => (
                            <tr key={index}>
                                <td>{entry.dropOffPoint}</td>
                                <td>{entry.commodity}</td>
                                <td>{entry.currentAmount}/{entry.originalAmount}</td>
                                <td>{entry.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    const toggleTableView = () => {
        setIsAlternateTable(!isAlternateTable);
    };

    const toggleMissionCollapse = (index) => {
        const updatedCollapsedMissions = [...collapsedMissions];
        updatedCollapsedMissions[index] = !updatedCollapsedMissions[index];
        setCollapsedMissions(updatedCollapsedMissions);
        localStorage.setItem('collapsedMissions', JSON.stringify(updatedCollapsedMissions));
    };

    const toggleAutoScaling = () => {
        setIsAutoScaling(!isAutoScaling);
        document.body.style.transform = isAutoScaling ? 'scale(1)' : ''; // Toggle scaling
    };

    useEffect(() => {
        localStorage.setItem('entries', JSON.stringify(entries));
    }, [entries]);

    useEffect(() => {
        localStorage.setItem('collapsed', JSON.stringify(collapsed));
    }, [collapsed]);

    useEffect(() => {
        localStorage.setItem('missionEntries', JSON.stringify(missionEntries));
    }, [missionEntries]);

    useEffect(() => {
        document.documentElement.style.setProperty('--dropdown-label-color', dropdownLabelColor);
        document.documentElement.style.setProperty('--dropdown-text-color', dropdownTextColor);
        document.documentElement.style.setProperty('--button-color', buttonColor);
        document.documentElement.style.setProperty('--title-color', titleColor);
        document.documentElement.style.setProperty('--drop-off-header-text-color', dropOffHeaderTextColor);
        document.documentElement.style.setProperty('--row-text-color', rowTextColor);
        document.documentElement.style.setProperty('--table-header-text-color', tableHeaderTextColor);
        document.documentElement.style.setProperty('--mission-text-color', missionTextColor); // Add this line
        document.documentElement.style.setProperty('--table-outline-color', tableOutlineColor); // Add this line
    }, [dropdownLabelColor, dropdownTextColor, buttonColor, titleColor, dropOffHeaderTextColor, rowTextColor, tableHeaderTextColor, missionTextColor, tableOutlineColor]);

    useEffect(() => {
        localStorage.setItem('dropdownLabelColor', dropdownLabelColor);
    }, [dropdownLabelColor]);

    useEffect(() => {
        localStorage.setItem('dropdownTextColor', dropdownTextColor);
    }, [dropdownTextColor]);

    useEffect(() => {
        localStorage.setItem('buttonColor', buttonColor);
    }, [buttonColor]);

    useEffect(() => {
        localStorage.setItem('titleColor', titleColor);
    }, [titleColor]);

    useEffect(() => {
        localStorage.setItem('dropOffHeaderTextColor', dropOffHeaderTextColor);
    }, [dropOffHeaderTextColor]);

    useEffect(() => {
        localStorage.setItem('rowTextColor', rowTextColor);
    }, [rowTextColor]);

    useEffect(() => {
        localStorage.setItem('tableHeaderTextColor', tableHeaderTextColor);
    }, [tableHeaderTextColor]);

    useEffect(() => {
        localStorage.setItem('selectedCommodity', selectedCommodity);
    }, [selectedCommodity]);

    useEffect(() => {
        localStorage.setItem('tableOutlineColor', tableOutlineColor);
    }, [tableOutlineColor]);

    useEffect(() => {
        console.log('Entries updated:', entries);
    }, [entries]);

    const resetDropdownLabelColor = () => {
        setDropdownLabelColor('#00ffcc');
    };

    const resetDropdownTextColor = () => {
        setDropdownTextColor('#00ffcc');
    };

    const resetButtonColor = () => {
        setButtonColor('#00ffcc');
    };

    const resetTitleColor = () => {
        setTitleColor('#00ffcc');
    };

    const resetDropOffHeaderTextColor = () => {
        setDropOffHeaderTextColor('#00ffcc');
    };

    const resetRowTextColor = () => {
        setRowTextColor('#00ffcc');
    };

    const resetTableHeaderTextColor = () => {
        setTableHeaderTextColor('#00ffcc');
    };

    const resetMissionTextColor = () => {
        setMissionTextColor('#00ffcc');
    };

    const resetTableOutlineColor = () => {
        setTableOutlineColor('#00ffcc');
    };

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    const handleLocationTypeChange = (selectedOption) => {
        const newType = selectedOption ? selectedOption.value : 'planet';
        setLocationType(newType);
        setSelectedPlanet('');
        setSelectedMoon('');
        setSelectedDropOffPoint('');
        setSecondDropdownValue('');
        
        // Reset dropdown options based on new location type
        if (newType === 'planet') {
            setFirstDropdownOptions(planetOptions);
        } else if (newType === 'station') {
            setFirstDropdownOptions(stationOptions);
        }
    };

    const handleStationSelectChange = (selectedOption) => {
        setSelectedDropOffPoint(selectedOption ? selectedOption.value : '');
        setSelectedPlanet('');
        setSelectedMoon('');
        setSecondDropdownValue(''); // Clear quick lookup
    };

    const handleMoonSelectChange = (selectedOption) => {
        setSelectedMoon(selectedOption ? selectedOption.value : '');
        setSelectedDropOffPoint('');
        setSecondDropdownValue(''); // Clear quick lookup
    };

    const handleDropOffSelectChange = (selectedOption) => {
        setSelectedDropOffPoint(selectedOption ? selectedOption.value : '');
        handleSelectChange();
        setSecondDropdownValue(''); // Clear quick lookup
    };

    const handleCommoditySelectChange = (selectedOption) => {
        if (!selectedOption || selectedOption.value.startsWith('--')) return; // Prevent selection of unselectable options
        setSelectedCommodity(selectedOption.value);
    };

    const handleSelectChange = () => {
        if (amountInputRef.current) {
            amountInputRef.current.focus();
        }
    };

    const handleAmountChange = (index, value) => {
        const updatedEntries = [...entries];
        updatedEntries[index].currentAmount = value;
        setEntries(updatedEntries);
    };

    const handleAmountKeyPress = (event, index) => {
        if (event.key === 'Enter') {
            event.target.blur(); // Unfocus the input box
        }
    };

    const handleTopAmountKeyPress = (event) => {
        if (event.key === 'Enter' && document.activeElement === amountInputRef.current) {
            addEntry();
        }
    };

    const toggleCollapse = (dropOffPoint) => {
        setCollapsed({
            ...collapsed,
            [dropOffPoint]: !collapsed[dropOffPoint]
        });
    };

    const [bannerMessage, setBannerMessage] = useState('');

    // Modify the showBannerMessage function
    const showBannerMessage = (message, isSuccess = true) => {
        const banner = document.createElement('div');
        banner.className = 'banner-message';
        banner.textContent = message;
        banner.style.backgroundColor = isSuccess ? '#4CAF50' : '#F44336'; // Green for success, red for failure
        banner.style.padding = '20px'; // Increased padding
        banner.style.fontSize = '1.2em'; // Larger font size
        banner.style.width = '100%'; // Full width
        banner.style.textAlign = 'center'; // Centered text
        banner.style.position = 'fixed';
        banner.style.top = '0';
        banner.style.left = '0';
        banner.style.zIndex = '1000';
        banner.style.transition = 'opacity 0.5s';

        // Add the banner to the document
        document.body.appendChild(banner);

        // Remove the banner after 3 seconds
        setTimeout(() => {
            banner.style.opacity = '0';
            setTimeout(() => {
                banner.remove();
            }, 500);
        }, 3000);
    };

    const addEntry = () => {
        const amountValue = document.querySelector('.amount-input').value;
        if (!selectedDropOffPoint) {
            showBannerMessage('Please select a drop-off point or station.');
            return;
        }
        if (!amountValue || amountValue <= 0) {
            showBannerMessage('Please enter a valid amount greater than 0.');
            return;
        }
        const newEntry = {
            dropOffPoint: selectedDropOffPoint,
            commodity: selectedCommodity,
            originalAmount: amountValue,
            currentAmount: amountValue,
            status: STATUS_OPTIONS[0],
            pickupPoint: firstDropdownValue,
            planet: selectedPlanet,
            moon: selectedMoon
        };
        setEntries([...entries, newEntry]);

        const selectedMissionIndex = selectedMissions.findIndex(mission => mission);
        if (selectedMissionIndex !== -1) {
            const updatedMissionEntries = [...missionEntries];
            updatedMissionEntries[selectedMissionIndex] = [...updatedMissionEntries[selectedMissionIndex], newEntry];
            setMissionEntries(updatedMissionEntries);
            localStorage.setItem('missionEntries', JSON.stringify(updatedMissionEntries));

            // Update history entries if the status is 'Delivered'
            if (newEntry.status === STATUS_OPTIONS[2]) { // STATUS_OPTIONS[2] is 'Delivered'
                const updatedHistory = historyEntries.map(historyGroup => {
                    return {
                        ...historyGroup,
                        entries: historyGroup.entries.map(historyEntry => {
                            if (historyEntry.dropOffPoint === newEntry.dropOffPoint && 
                                historyEntry.commodity === newEntry.commodity) {
                                return {
                                    ...historyEntry,
                                    status: STATUS_OPTIONS[2]
                                };
                            }
                            return historyEntry;
                        })
                    };
                });
                
                setHistoryEntries(updatedHistory);
                localStorage.setItem('historyEntries', JSON.stringify(updatedHistory));
            }
        }
    };

    const [needsClearConfirmation, setNeedsClearConfirmation] = useState(false);

    const clearLog = () => {
        if (needsClearConfirmation) {
            setEntries([]);
            setMissionEntries(Array(10).fill([]));
            localStorage.removeItem('entries');
            localStorage.removeItem('missionEntries');
            setNeedsClearConfirmation(false);
        } else {
            setNeedsClearConfirmation(true);
            setTimeout(() => {
                if (needsClearConfirmation) {
                    setNeedsClearConfirmation(false);
                }
            }, 3000); // Reset after 3 seconds if not confirmed
        }
    };

    const processOrders = () => {
        const deliveredEntries = entries.filter(entry => entry.status === 'Delivered');
        const activeEntries = entries.filter(entry => entry.status !== 'Delivered');
        
        if (deliveredEntries.length > 0) {
            // Group delivered entries by drop-off point
            const groupedEntries = deliveredEntries.reduce((acc, entry) => {
                if (!acc[entry.dropOffPoint]) {
                    acc[entry.dropOffPoint] = [];
                }
                acc[entry.dropOffPoint].push({
                    ...entry,
                    timestamp: new Date().toISOString(),
                    status: 'Delivered'
                });
                return acc;
            }, {});

            // Convert grouped entries to array format
            const updatedHistory = [
                ...historyEntries,
                ...Object.entries(groupedEntries).map(([dropOffPoint, entries]) => ({
                    dropOffPoint,
                    entries,
                    timestamp: new Date().toISOString()
                }))
            ];
            
            // Remove delivered entries from missions
            const updatedMissionEntries = missionEntries.map(mission => 
                mission.filter(missionEntry => 
                    !deliveredEntries.some(deliveredEntry => 
                        deliveredEntry.dropOffPoint === missionEntry.dropOffPoint &&
                        deliveredEntry.commodity === missionEntry.commodity &&
                        deliveredEntry.originalAmount === missionEntry.originalAmount
                    )
                )
            );
            
            setHistoryEntries(updatedHistory);
            setEntries(activeEntries);
            setMissionEntries(updatedMissionEntries);
            
            localStorage.setItem('entries', JSON.stringify(activeEntries));
            localStorage.setItem('historyEntries', JSON.stringify(updatedHistory));
            localStorage.setItem('missionEntries', JSON.stringify(updatedMissionEntries));
            
            showBannerMessage(`${deliveredEntries.length} orders processed and moved to history.`);
        } else {
            showBannerMessage('No delivered orders to process.');
        }
    };

    const updateCargo = (index, newAmount) => {
        const updatedEntries = [...entries];
        updatedEntries[index].currentAmount = newAmount;
        setEntries(updatedEntries);
    };

    const removeCargo = (index) => {
        const entryToRemove = entries[index];
        const updatedEntries = entries.filter((_, i) => i !== index);
        setEntries(updatedEntries);

        const updatedMissionEntries = missionEntries.map(mission => 
            mission.filter(entry => entry !== entryToRemove)
        );
        setMissionEntries(updatedMissionEntries);
        localStorage.setItem('missionEntries', JSON.stringify(updatedMissionEntries));
    };

    const calculateTotalSCU = () => {
        return entries.reduce((total, entry) => total + parseFloat(entry.currentAmount), 0);
    };

    const moveDropOffPoint = (dropOffPoint, direction) => {
        const dropOffPoints = Object.keys(entries.reduce((acc, entry) => {
            acc[entry.dropOffPoint] = true;
            return acc;
        }, {}));
        const index = dropOffPoints.indexOf(dropOffPoint);
        if (index === -1) return;

        const newIndex = index + direction;
        if (newIndex < 0 || newIndex >= dropOffPoints.length) return;

        const updatedEntries = [...entries];
        const [movedDropOffPoint] = dropOffPoints.splice(index, 1);
        dropOffPoints.splice(newIndex, 0, movedDropOffPoint);

        const reorderedEntries = [];
        dropOffPoints.forEach(point => {
            reorderedEntries.push(...updatedEntries.filter(entry => entry.dropOffPoint === point));
        });

        setEntries(reorderedEntries);
    };

    const markAsDelivered = (dropOffPoint) => {
        const updatedEntries = entries.map(entry => {
            if (entry.dropOffPoint === dropOffPoint) {
                // Update history entries with delivered status
                const updatedHistory = historyEntries.map(historyGroup => {
                    return {
                        ...historyGroup,
                        entries: historyGroup.entries.map(historyEntry => {
                            if (historyEntry.dropOffPoint === dropOffPoint) {
                                return {
                                    ...historyEntry,
                                    status: STATUS_OPTIONS[2]
                                };
                            }
                            return historyEntry;
                        })
                    };
                });
                
                setHistoryEntries(updatedHistory);
                localStorage.setItem('historyEntries', JSON.stringify(updatedHistory));

                // Update mission entries with delivered status
                const updatedMissionEntries = missionEntries.map(mission => 
                    mission.map(missionEntry => {
                        if (missionEntry.dropOffPoint === dropOffPoint) {
                            return {
                                ...missionEntry,
                                status: STATUS_OPTIONS[2]
                            };
                        }
                        return missionEntry;
                    })
                );
                
                setMissionEntries(updatedMissionEntries);
                localStorage.setItem('missionEntries', JSON.stringify(updatedMissionEntries));
                
                return { ...entry, status: STATUS_OPTIONS[2] };
            }
            return entry;
        });
        setEntries(updatedEntries);
        localStorage.setItem('entries', JSON.stringify(updatedEntries));
    };

    const handleFirstDropdownChange = (selectedOption) => {
        setFirstDropdownValue(selectedOption ? selectedOption.value : '');
        // Update options based on search text
        const searchText = selectedOption ? selectedOption.value.toLowerCase() : '';
        const filteredOptions = data.planets.filter(option => option.toLowerCase().includes(searchText));
        setFirstDropdownOptions(filteredOptions);
    };

    const handleSecondDropdownChange = (selectedOption) => {
        setSecondDropdownValue(selectedOption ? selectedOption.value : '');
        // Update options based on search text
        const searchText = selectedOption ? selectedOption.value.toLowerCase() : '';
        const filteredOptions = data.stations.filter(option => option.toLowerCase().includes(searchText));
        setSecondDropdownOptions(filteredOptions);
    };

    // Add a list of valid locations
    const validLocations = new Set([
        'Everus Harbor', 'Area 18', 'Orison', 'Lorville', 'NB Int Spaceport',
        'Covalex Distribution Centre S1DC06', 'Greycat Stanton 1 Production Complex-B',
        'HDPC-Cassillo', 'HDPC-Farnesway', 'Sakura Sun Magnolia Workcenter',
        'Covalex Distribution Center S4DC05', 'Greycat Stanton IV Production Complex-A',
        'Sakura Sun Goldenrod Workcenter', 'microTech Logistics Depot S4LD01',
        'microTech Logistics Depot S4LD13', 'Shubin Mining Facility SM0-10',
        'Shubin Mining Facility SM0-13', 'Shubin Mining Facility SM0-18',
        'Shubin Mining Facility SM0-22'
    ]);

    const validatePickupPoint = (pickup) => {
        const validPickupPoints = [
            ...data.pickupPoints,
            ...Object.values(data.Dropoffpoints).flat(),
            ...Object.values(data.moons).flatMap(moon => Object.values(moon)).flat()
        ];

        const isValid = validPickupPoints.includes(pickup);
        return {
            pickup,
            isValid,
            message: isValid ? '' : `Invalid pickup point: ${pickup}`
        };
    };

    const handlePickupPointChange = (selectedOption) => {
        if (selectedOption) {
            const location = selectedOption.value;
            const validation = validatePickupPoint(location);
            
            if (!validation.isValid) {
                console.warn(validation);
                alert(`Warning: "${location}" is not a recognized location. Please check your spelling.`);
            }
            setFirstDropdownValue(location);
        } else {
            setFirstDropdownValue('');
        }
    };

    const handleQuickLookupChange = (selectedOption) => {
        if (selectedOption) {
            const value = selectedOption.value;
            setSecondDropdownValue(value);

            if (data.planets.includes(value)) {
                setLocationType('planet');
                setSelectedPlanet(value);
                setSelectedMoon('');
                setSelectedDropOffPoint('');
            } else if (data.stations.includes(value)) {
                setLocationType('station');
                setSelectedPlanet('');
                setSelectedMoon('');
                setSelectedDropOffPoint(value);
            } else {
                let found = false;
                for (const planet in data.moons) {
                    for (const moon in data.moons[planet]) {
                        if (data.moons[planet][moon].includes(value)) {
                            setLocationType('planet');
                            setSelectedPlanet(planet);
                            setSelectedMoon(moon);
                            setSelectedDropOffPoint(value);
                            found = true;
                            break;
                        }
                    }
                    if (found) break;
                }
                if (!found) {
                    for (const planet in data.Dropoffpoints) {
                        if (data.Dropoffpoints[planet].includes(value)) {
                            setLocationType('planet');
                            setSelectedPlanet(planet);
                            setSelectedMoon('');
                            setSelectedDropOffPoint(value);
                            break;
                        }
                    }
                }
            }
        } else {
            setSecondDropdownValue('');
            setLocationType('planet');
            setSelectedPlanet('');
            setSelectedMoon('');
            setSelectedDropOffPoint('');
        }
        // Clear selection after lookup
        setTimeout(() => {
            setSecondDropdownValue('');
        }, 100);
    };

    const handlePlanetSelectChange = (selectedOption) => {
        setSelectedPlanet(selectedOption ? selectedOption.value : '');
        setSelectedMoon('');
        setSelectedDropOffPoint('');
        setSecondDropdownValue(''); // Clear quick lookup
    };

    const handleImport = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const importedData = JSON.parse(e.target.result);
                setEntries(prevEntries => [...prevEntries, ...(importedData.entries || [])]);
                setMissionEntries(prevMissionEntries => {
                    const newMissionEntries = [...prevMissionEntries];
                    (importedData.missionEntries || []).forEach((mission, index) => {
                        newMissionEntries[index] = [...newMissionEntries[index], ...mission];
                    });
                    return newMissionEntries;
                });
                setHistoryEntries(prevHistoryEntries => [...prevHistoryEntries, ...(importedData.historyEntries || [])]);
                setCollapsed(prevCollapsed => ({ ...prevCollapsed, ...(importedData.collapsed || {}) }));
                setCollapsedMissions(prevCollapsedMissions => {
                    const newCollapsedMissions = [...prevCollapsedMissions];
                    (importedData.collapsedMissions || []).forEach((collapsed, index) => {
                        newCollapsedMissions[index] = collapsed;
                    });
                    return newCollapsedMissions;
                });
                showBannerMessage('Data imported successfully.', true);
            };
            reader.readAsText(file);
        }
    };

    const handleExport = (type) => {
        let dataToExport;
        let fileName;
        
        if (type === 'history') {
            dataToExport = {
                historyEntries
            };
            fileName = 'sc-cargo-tracker-history.json';
        } else if (type === 'payouts') {
            dataToExport = {
                payouts: historyEntries.filter(entry => 
                    entry.entries.some(e => e.status === 'Delivered')
                )
            };
            fileName = 'sc-cargo-tracker-payouts.json';
        }

        const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(url);
    };

    const [needsHistoryClearConfirmation, setNeedsHistoryClearConfirmation] = useState(false);

    const clearHistoryLogDebug = () => {
        if (needsHistoryClearConfirmation) {
            setHistoryEntries([]);
            localStorage.removeItem('historyEntries');
            setNeedsHistoryClearConfirmation(false);
            showBannerMessage('History log cleared.', true);
        } else {
            setNeedsHistoryClearConfirmation(true);
            setTimeout(() => {
                if (needsHistoryClearConfirmation) {
                    setNeedsHistoryClearConfirmation(false);
                }
            }, 3000); // Reset after 3 seconds if not confirmed
        }
    };

    const [collapsedCommodities, setCollapsedCommodities] = useState({}); // Add state for collapsed commodities

    const toggleCommodityCollapse = (date, commodity) => {
        setCollapsedCommodities({
            ...collapsedCommodities,
            [`${date}-${commodity}`]: !collapsedCommodities[`${date}-${commodity}`]
        });
    };

    function createPayoutsTab() {
        const payoutsTab = document.createElement('div');
        payoutsTab.id = 'payouts-tab';
        
        // Add header
        const header = document.createElement('div');
        header.className = 'payouts-header';
        header.innerHTML = `
            <span>Date</span>
            <span>Mission ID</span>
        `;
        payoutsTab.appendChild(header);

        // Add table
        const table = document.createElement('table');
        table.className = 'payouts-table';
        table.innerHTML = `
            <thead>
                <tr>
                    <th>Pickup</th>
                    <th>Drop Off</th>
                    <th>Commodity</th>
                    <th>QTY</th>
                </tr>
            </thead>
            <tbody>
                <!-- Table rows will be added dynamically -->
            </tbody>
        `;
        payoutsTab.appendChild(table);
    }

    function createHualingMissionsTab() {
        const tabContent = document.createElement('div');
        tabContent.id = 'hualing-missions';
        
        // Add Capture Mode button
        const captureButton = document.createElement('button');
        captureButton.id = 'capture-mode-btn';
        captureButton.textContent = 'Capture Mode';
        captureButton.classList.add('mission-button'); // Add existing button styling
        captureButton.addEventListener('click', handleCaptureMode);
        
        tabContent.appendChild(captureButton);
        
        // ... rest of the existing tab creation code ...
        
        return tabContent;
    }

    function handleCaptureMode() {
        // Add your capture mode logic here
        console.log('Capture Mode activated');
        // You can add functionality like:
        // - Toggling a capture state
        // - Changing UI elements
        // - Starting/stopping a capture process
    }

    const captureTab = document.getElementById('capture-tab');

    // Update the performOCR function with better error handling
    const performOCR = async (image) => {
        try {
            // First, verify the image data
            if (!image || typeof image !== 'string' || !image.startsWith('data:image')) {
                showBannerMessage('Invalid image data', false);
                throw new Error('Invalid image data');
            }

            // Perform OCR with Tesseract
            const { data: { text } } = await Tesseract.recognize(
                image,
                'eng',
                {
                    logger: m => console.log(m),
                    errorHandler: (err) => {
                        console.error('Tesseract Error:', err);
                        showBannerMessage('OCR processing error', false);
                        throw err;
                    }
                }
            );
            
            // Clean the OCR text - remove periods and commas
            const cleanedText = text.replace(/[.,]/g, '');
            showBannerMessage('OCR capture successful!', true);
            return cleanedText;
        } catch (error) {
            console.error('OCR Error:', error);
            showBannerMessage('Error processing image. Please try again.', false);
            return '';
        }
    };

    // Add these state variables at the top of your component
    const [isDrawing, setIsDrawing] = useState(false);
    const [selectionBox, setSelectionBox] = useState(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    const handleMouseDown = (e) => {
        if (!useVideoStream || !videoRef.current) return;
        setIsDrawing(true);
        const rect = e.currentTarget.getBoundingClientRect();
        const scaleX = videoRef.current.videoWidth / rect.width;
        const scaleY = videoRef.current.videoHeight / rect.height;
        
        const startX = (e.clientX - rect.left) * scaleX;
        const startY = (e.clientY - rect.top) * scaleY;
        
        setSelectionBox({
            startX: startX,
            startY: startY,
            endX: startX,
            endY: startY
        });
    };

    const handleMouseMove = (e) => {
        if (!isDrawing || !useVideoStream || !videoRef.current) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const scaleX = videoRef.current.videoWidth / rect.width;
        const scaleY = videoRef.current.videoHeight / rect.height;
        
        const currentX = (e.clientX - rect.left) * scaleX;
        const currentY = (e.clientY - rect.top) * scaleY;
        
        setSelectionBox(prev => ({
            ...prev,
            endX: currentX,
            endY: currentY
        }));
    };

    // Add this state variable to store OCR results
    const [ocrResults, setOcrResults] = useState([]);

    // Add a new state variable for the current parsed results
    const [currentParsedResults, setCurrentParsedResults] = useState([]);

    // Add this state variable to track edited quantities
    const [editedQuantities, setEditedQuantities] = useState({});

    // Add this function to handle quantity edits
    const handleQuantityEdit = (index, newValue) => {
        setEditedQuantities(prev => ({
            ...prev,
            [index]: newValue
        }));
    };

    // Add this function to save the edited quantity
    const saveQuantityEdit = (index) => {
        const updatedResults = [...ocrResults];
        updatedResults[index].quantity = editedQuantities[index];
        setOcrResults(updatedResults);
        setEditedQuantities(prev => {
            const newState = { ...prev };
            delete newState[index];
            return newState;
        });
    };

    // Add this function to apply sharpening to an image
    function sharpenImage(imageData) {
        const width = imageData.width;
        const height = imageData.height;
        const data = imageData.data;
        
        // Create a copy of the image data
        const output = new ImageData(new Uint8ClampedArray(data), width, height);
        const outputData = output.data;
        
        // Sharpening kernel
        const kernel = [
            0, -1, 0,
            -1, 5, -1,
            0, -1, 0
        ];
        
        // Apply the kernel to each pixel
        for (let y = 1; y < height - 1; y++) {
            for (let x = 1; x < width - 1; x++) {
                const i = (y * width + x) * 4;
                let r = 0, g = 0, b = 0;
                
                // Apply the kernel
                for (let ky = -1; ky <= 1; ky++) {
                    for (let kx = -1; kx <= 1; kx++) {
                        const ki = ((y + ky) * width + (x + kx)) * 4;
                        const weight = kernel[(ky + 1) * 3 + (kx + 1)];
                        
                        r += data[ki] * weight;
                        g += data[ki + 1] * weight;
                        b += data[ki + 2] * weight;
                    }
                }
                
                // Set the new pixel values
                outputData[i] = Math.min(255, Math.max(0, r));
                outputData[i + 1] = Math.min(255, Math.max(0, g));
                outputData[i + 2] = Math.min(255, Math.max(0, b));
            }
        }
        
        return output;
    }

    // Add this state to track OCR capture history
    const [ocrCaptureHistory, setOcrCaptureHistory] = useState([]);

    // Add this function to handle undoing the last OCR capture
    const undoLastOcrCapture = () => {
        if (ocrCaptureHistory.length > 0) {
            // Get the last capture's entries
            const lastCapture = ocrCaptureHistory[ocrCaptureHistory.length - 1];
            
            // Remove these entries from the main OCR results
            setOcrResults(prevResults => 
                prevResults.filter(result => 
                    !lastCapture.some(capture => 
                        capture.commodity === result.commodity &&
                        capture.quantity === result.quantity &&
                        capture.pickup === result.pickup &&
                        capture.dropoff === result.dropoff
                    )
                )
            );
            
            // Remove the last capture from history
            setOcrCaptureHistory(prev => prev.slice(0, -1));
            
            showBannerMessage('Last OCR capture undone.', true);
        } else {
            showBannerMessage('No OCR captures to undo.', false);
        }
    };

    // Modify the handleMouseUp function to track OCR captures
    const handleMouseUp = async () => {
        let canvas;
        
        try {
            if (!useVideoStream || !videoRef.current || !selectionBox) return;
            setIsDrawing(false);

            // Create canvas to capture the selected area
            canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // Set canvas dimensions
            canvas.width = Math.abs(selectionBox.endX - selectionBox.startX);
            canvas.height = Math.abs(selectionBox.endY - selectionBox.startY);
            
            // Draw the selected area
            ctx.drawImage(
                videoRef.current,
                Math.min(selectionBox.startX, selectionBox.endX),
                Math.min(selectionBox.startY, selectionBox.endY),
                canvas.width,
                canvas.height,
                0, 0, canvas.width, canvas.height
            );
            
            // Get the image data and apply sharpening
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const sharpenedImage = sharpenImage(imageData);
            ctx.putImageData(sharpenedImage, 0, 0);
            
            // Convert canvas to image
            const image = canvas.toDataURL('image/png', 1.0);
            
            // Perform OCR
            const ocrText = await performOCR(image);
            
            if (!ocrText) {
                throw new Error('No text recognized');
            }
            
            // Parse the OCR results
            const newResults = parseOCRResults(ocrText);
            setCurrentParsedResults(newResults);
            
            // Add the new results to capture history
            setOcrCaptureHistory(prev => [...prev, newResults]);
            
            // Update the OCR results
            setOcrResults(prevResults => [...prevResults, ...newResults]);
            
            // Update the process log
            const processLog = document.getElementById('process-log');
            
            // Update Parsed Results table
            const parsedTable = processLog.querySelector('.parsed-table');
            if (parsedTable) {
                const tbody = parsedTable.querySelector('tbody');
                tbody.innerHTML = ''; // Clear previous results
                newResults.forEach(result => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${result.commodity}</td>
                        <td>${result.quantity}</td>
                        <td>${result.pickup}</td>
                        <td>${result.dropoff}</td>
                    `;
                    tbody.appendChild(row);
                });
            }
            
            // Update Results Table with new entries
            const resultsTbody = processLog.querySelector('.results-table tbody');
            if (resultsTbody) {
                resultsTbody.innerHTML = ''; // Clear and rebuild
                ocrResults.concat(newResults).forEach(result => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${result.commodity}</td>
                        <td>${result.quantity}</td>
                        <td>${result.pickup}</td>
                        <td>${result.dropoff}</td>
                    `;
                    resultsTbody.appendChild(row);
                });
            }
        } catch (error) {
            console.error('Capture Error:', error);
            showBannerMessage('Error capturing image. Please try again.', false);
        } finally {
            if (canvas) {
                canvas.remove();
            }
        }
    };

    // Modify the captureAndOCR function to use the selection box
    async function captureAndOCR() {
        try {
            // Get screen capture stream
            const stream = await navigator.mediaDevices.getDisplayMedia({
                video: {
                    displaySurface: 'window', // or 'monitor'
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                },
                audio: false
            });

            // Create video element to capture frame
            const video = document.createElement('video');
            video.srcObject = stream;
            await video.play();
            
            // Create canvas to capture frame
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            
            // Convert canvas to image
            const image = canvas.toDataURL();
            
            // Create image element to display the captured picture
            const imgElement = document.createElement('img');
            imgElement.src = image;
            imgElement.style.maxWidth = '100%';
            imgElement.style.borderRadius = '5px';
            imgElement.style.marginTop = '20px';
            imgElement.draggable = false;
            imgElement.style.userSelect = 'none';
            imgElement.style.pointerEvents = 'none';
            
            // Display the captured image
            const capturePreview = document.getElementById('capture-preview');
            capturePreview.innerHTML = ''; // Clear previous content
            capturePreview.appendChild(imgElement);
            
            // If there's a selection box, crop the image
            if (selectionBox) {
                const tempCanvas = document.createElement('canvas');
                tempCanvas.width = selectionBox.width;
                tempCanvas.height = selectionBox.height;
                const tempCtx = tempCanvas.getContext('2d');
                
                // Draw the selected area to the new canvas
                tempCtx.drawImage(
                    canvas,
                    selectionBox.x, selectionBox.y, selectionBox.width, selectionBox.height,
                    0, 0, selectionBox.width, selectionBox.height
                );
                
                // Use the cropped image for OCR
                const croppedImage = tempCanvas.toDataURL();
                const ocrText = await performOCR(croppedImage);
                
                // Display OCR results
                const ocrResults = document.getElementById('ocr-results');
                ocrResults.innerHTML = ocrText;
                
                // Clean up
                tempCanvas.remove();
            } else {
                // Use the full image if no selection
                const ocrText = await performOCR(image);
            }
            
            // Clean up
            stream.getTracks().forEach(track => track.stop());
            video.remove();
            canvas.remove();
            
        } catch (error) {
            console.error('Capture Error:', error);
        }
    }

    // Move parseOCRResults outside of processSelectedArea
    const parseOCRResults = (text) => {
        //temp         text = text.replace(/S4DC0OS/g, 'S4DC05');

        // First, replace S4DCOS with S4DCO5 in the entire text
        text = text.replace(/S4DCOS/g, 'S4DC05');
        text = text.replace(/$4DC0S/g, 'S4DC05');
        text = text.replace(/S4DCOS/g, 'S4DC05');
        text = text.replace(/$4DC0S/g, 'S4DC05');
        text = text.replace(/S4DCO0S/g, 'S4DC05');
        text = text.replace(/S4DC00S/g, 'S4DC05');
        text = text.replace(/S4DC0OS/g, 'S4DC05');
        text = text.replace(/Covalex Distribution Center S4DC0S/g, 'Covalex Distribution Center S4DC05');
        text = text.replace(/Shubin Mining Facility SM0-10 I/g, 'Shubin Mining Facility SM0-10');
        text = text.replace(/Shubin Mining Facliity SM0-10 I/g, 'Shubin Mining Facility SM0-10');
        text = text.replace(/Shubin Mining Facliity SM0-10 I/g, 'Shubin Mining Facility SM0-10');

        
        // Handle $ symbol - remove it and add S if missing
        text = text.replace(/\$(\w+)/g, (match, word) => {
            // Remove the $ and check if the word starts with S
            return word.startsWith('S') ? word : `S${word}`;
        });

        // Remove all types of brackets, punctuation, and pipes
        text = text.replace(/[{}[\]()<>.,|]/g, '');

        const lines = text.split('\n').filter(line => line.trim() !== '');
        const results = [];
        let currentCommodity = null;
        let currentPickup = null;
        let currentDropoff = null;
        
        // Look for the word "Collect" and extract the immediately following word
        const collectPattern = /Collect\s+([\w\s]+?)\s+from/i; // Modified to capture multiple words
        // Look for the word "from" and extract the pickup location
        const pickupPattern = /from\s+(.+)/i;
        // Look for the word "To" and extract the drop-off location
        const dropoffPattern = /To\s+(.+)/i;
        // Look for the word "Deliver" and extract the quantity (numbers with optional slash)
        const deliverPattern = /Deliver\s+(\d+\s*\/\s*\d+)/i;
        // Special pattern for Ship and Quantum commodities
        const specialCommodityPattern = /(Ship|Quantum)\s+([\w\s]+?)\s+from/i;
        // Pattern for raw materials
        const rawMaterialPattern = /(Corundum|Quartz|Silicon|Tin|Titanium|Tungsten)\s+\(Raw\)/i;
                // Pattern to correct common OCR mistakes in location codes
                const locationCodeCorrections = {
                    //S4LD01 - Corrections
                    'S4LDO1': 'S4LD01',
                    'S4LD0I': 'S4LD01',
                    'S4LD0L': 'S4LD01',
                    'S4LD0l.': 'S4LD01', 
                    'S4LDOL.': 'S4LD01',
                    //S4DC05 - Corrections  
                    'S4DC0S' : 'S4DC05',
                    'S4DCOS' : 'S4DC05', 
                    '$S4DCOS' : 'S4DC05', 
                    'S4DCO0S': 'S4DC05',
                    '$S4DC0S' : 'S4DC05',
                    '$S4DC0S' : 'S4DC05',  
                    '$S40COS' : 'S4DC05',  
                    '$S40C0S' : 'S4DC05', 
                    '$S40DCO0S' : 'S4DC05',
                    '$S4DCO0S' : 'S4DC05',
                    '$S40CO0S' : 'S4DC05',
                    '$4DC0S' : 'S4DC05',
                    '$S4DC05' : 'S4DC05', 
                    '$40C0S' : 'S4DC05', 
                    '$$4DCOS' : 'S4DC05',
                    '$4DCOS' : 'S4DC05',
                    'SA4DCOS' : 'S4DC05',
                    'SS4DC05' : 'S4DC05',
                    'S4DC055' : 'S4DC05',
                    //S4LD13 - Corrections
                    'S4LD13': 'S4LD13',
                    'S4LD1B': 'S4LD13',
                    'S4LD1I': 'S4LD13',
                    //SM0-##
                    'SMO-18' : 'SM0-18',
                    'SMO-10' : 'SM0-10',
                    //large names
                    'Covalex Distribution Center i S4DC05' : 'Covalex Distribution Center S4DC05',
                    'Port Tressler I' : 'Port Tressler',
                    //City
                    'Baljini Point' : 'Baijini Point',
                    'Sakura Sun Goldenrod Workeenter': 'Sakura Sun Goldenrod Workcenter',
                    'Covalex Distribution Center S4DCOS': 'Covalex Distribution Center S4DC05',
                    'Greycat Stanton IV Production j Complex-A': 'Greycat Stanton IV Production Complex-A',
                    'Port Tressler J': 'Port Tressler',
                    'Shubin Mining Facility SM0-10 i': 'Shubin Mining Facility SM0-10',
                    'Covalex Distribution Center S4DCO5': 'Covalex Distribution Center S4DC05',
                    'Covalex Distribution Center SA4DCOS': 'Covalex Distribution Center S4DC05',
                    'Covalex Distribution Center SADCOS': 'Covalex Distribution Center S4DC05',
                    'Covalex Distribution Center S4D0C0S': 'Covalex Distribution Center S4DC05',
                    'Wasts': 'Waste',
                    'MIC-L2 Long Forest Station J': 'MIC-L2 Long Forest Station',
                    'NB Int Spaceport i': 'NB Int Spaceport',
                    'NB Int Spaceport il': 'NB Int Spaceport',
                    'Greycat Stanton IV Production i Complex-A': 'Greycat Stanton IV Production Complex-A',
                    'Covalex Distribution Center: S4DC05': 'Covalex Distribution Center S4DC05',
                    'MIC-L\'2 Long Forest Station i': 'MIC-L2 Long Forest Station',
                    'Fort Tressler i': 'Port Tressler',
                    'Covalex Distribution Center \'S4DC05': 'Covalex Distribution Center S4DC05',
                    'MIC-L2 Long Forest Station i': 'MIC-L2 Long Forest Station',
                    'Covalex Distribution Center S4DC0S': 'Covalex Distribution Center S4DC05',
                    'Processed Foad': 'Processed Food',
                    'Port Tressler i': 'Port Tressler',
                    'Greycat Stantan IV Production Complex-A': 'Greycat Stanton IV Production Complex-A',
                    'Sakura Sun Goldenrod Workcenter_': 'Sakura Sun Goldenrod Workcenter',
                    'Port Tressier- i': 'Port Tressler',
                    'Port Tressier': 'Port Tressler',
                    'Covalex Distribution Center S4DC0S': 'Covalex Distribution Center S4DC05',
                    'Part Tessier i': 'Port Tressler',
                    'Agricuitural Supplies': 'Agricultural Supplies',
                    'microTech Logistics Depot S4L001': 'microTech Logistics Depot S4LD01',
                    'Covalex Distribution Center S4DCoS': 'Covalex Distribution Center S4DC05',
                    'Covalex Distribution Center \'S4DC05': 'Covalex Distribution Center S4DC05',
                    'Shubin Mining Facility SMD-10': 'Shubin Mining Facility SM0-10',
                    'Covalex Distribution Center S4DC0S': 'Covalex Distribution Center S4DC05',
                };

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            
            // Check for special commodities first
            const specialCommodityMatch = line.match(specialCommodityPattern);
            if (specialCommodityMatch) {
                currentCommodity = `${specialCommodityMatch[1]} ${specialCommodityMatch[2].trim()}`;
            }
            // Check for raw materials
            else if (line.match(rawMaterialPattern)) {
                currentCommodity = line.match(rawMaterialPattern)[0];
            }
            // If no special commodity found, check for regular "Collect" pattern
            else {
            const collectMatch = line.match(collectPattern);
            if (collectMatch) {
                currentCommodity = collectMatch[1].trim();
                }
            }
            
            // Check for "from" to set the pickup location
            const pickupMatch = line.match(pickupPattern);
            if (pickupMatch) {
                currentPickup = pickupMatch[1].trim();
                // Remove any remaining punctuation
                currentPickup = currentPickup.replace(/[.,]/g, '');
                // Check if the next line contains more of the pickup point name
                if (i + 1 < lines.length && !lines[i + 1].match(/Collect|from|To|Deliver/i)) {
                    let nextLine = lines[i + 1].trim().replace(/[.,]/g, '');
                    currentPickup = currentPickup ? `${currentPickup} ${nextLine}` : nextLine;
                    i++; // Skip the next line since we've processed it
                }
                // Apply location code corrections
                currentPickup = Object.entries(locationCodeCorrections).reduce((acc, [wrong, correct]) => {
                    return acc.replace(wrong, correct);
                }, currentPickup);
            }
            
            // Check for "To" to set the drop-off location
            const dropoffMatch = line.match(dropoffPattern);
            if (dropoffMatch) {
                currentDropoff = dropoffMatch[1].trim();
                // Apply location code corrections
                currentDropoff = Object.entries(locationCodeCorrections).reduce((acc, [wrong, correct]) => {
                    return acc.replace(wrong, correct);
                }, currentDropoff);
            }
            
            // Check for "Deliver" to add quantity entries
            const deliverMatch = line.match(deliverPattern);
            if (deliverMatch && currentCommodity) {
                // Clean up the quantity by removing spaces around the slash
                let quantity = deliverMatch[1].replace(/\s*\/\s*/, '/').trim();
                // Only take the number on the right of the "/"
                quantity = quantity.split('/')[1];
                
                // Check if the next line contains more of the drop-off point name
                if (i + 1 < lines.length && !lines[i + 1].match(/Collect|from|To|Deliver/i)) {
                    currentDropoff = currentDropoff ? `${currentDropoff} ${lines[i + 1].trim()}` : lines[i + 1].trim();
                    i++; // Skip the next line since we've processed it
                }
                
                // Add a new row for each Deliver entry
                results.push({
                    commodity: currentCommodity,
                    quantity: quantity,
                    pickup: currentPickup || '',   // Use the pickup location if found
                    dropoff: currentDropoff || ''   // Use the drop-off location if found
                });
            }
        }

        return results;
    };

    const [useVideoStream, setUseVideoStream] = useState(false);

    const toggleVideoStream = () => {
        setUseVideoStream(!useVideoStream);
        if (!useVideoStream) {
            stopVideoStream();
            }
    };

    const startVideoStream = async () => {
        try {
            const stream = await navigator.mediaDevices.getDisplayMedia({
                video: {
                    displaySurface: 'application' // Capture application window
                }
            });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (error) {
            console.error('Error accessing screen stream:', error);
        }
    };

    const stopVideoStream = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            videoRef.current.srcObject.getTracks().forEach(track => track.stop());
        }
    };

    useEffect(() => {
        if (useVideoStream) {
            startVideoStream();
        }
        // Don't stop the stream when unmounting or tab changes
    }, [useVideoStream]);

    // Update the state initialization to load from localStorage
    const [captureKey, setCaptureKey] = useState(() => {
        const savedKey = localStorage.getItem('captureKey');
        return savedKey || 'Enter'; // Default to 'Enter' if no key is saved
    });

    // Add this useEffect to save the key choice
    useEffect(() => {
        localStorage.setItem('captureKey', captureKey);
    }, [captureKey]);

    // Add this useEffect to handle key presses
    useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.key === captureKey) {
                handleMouseUp();
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [captureKey, handleMouseUp]);

    // Modify the key change handler to ensure it captures all valid keys
    const handleKeyChange = (e) => {
        // Allow any key that can be reasonably used as a shortcut
        if (e.key.length === 1 || [
            'Enter', 'Escape', 'Backspace', 'Tab', 'Shift', 'Control', 'Alt', 
            'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
            'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12'
        ].includes(e.key)) {
            setCaptureKey(e.key);
            setShowKeyInput(false);
        }
    };

    const validateEntry = (entry) => {
        console.log('Validating entry:', entry);
        
        // Validate commodity
        const validCommodity = data.commodities.includes(entry.commodity);
        console.log('Commodity validation:', {
            commodity: entry.commodity,
            isValid: validCommodity,
            message: validCommodity ? 'Valid commodity' : 'Invalid commodity'
        });
        
        // Validate pickup point
        const validPickup = data.pickupPoints.includes(entry.pickup);
        console.log('Pickup point validation:', {
            pickup: entry.pickup,
            isValid: validPickup,
            message: validPickup ? 'Valid pickup point' : 'Invalid pickup point'
        });
        
        // Validate drop-off point
        let validDropoff = false;
        
        // Check planets
        for (const planet of data.planets) {
            if (data.Dropoffpoints[planet].includes(entry.dropoff)) {
                validDropoff = true;
                break;
            }
        }
        
        // Check stations
        if (!validDropoff) {
            validDropoff = data.stations.includes(entry.dropoff);
        }
        
        // Check moons
        if (!validDropoff) {
            for (const planet of data.planets) {
                for (const moon in data.moons[planet]) {
                    if (data.moons[planet][moon].includes(entry.dropoff)) {
                        validDropoff = true;
                        break;
                    }
                }
                if (validDropoff) break;
            }
        }
        
        console.log('Drop-off point validation:', {
            dropoff: entry.dropoff,
            isValid: validDropoff,
            message: validDropoff ? 'Valid drop-off point' : 'Invalid drop-off point'
        });
        
        const isValid = validCommodity && validPickup && validDropoff;
        console.log('Overall validation:', {
            isValid,
            message: isValid ? 'Entry is valid for transfer' : 'Entry is invalid for transfer'
        });
        
        return isValid;
    };

    const addOCRToManifest = () => {
        console.log('Starting addOCRToManifest');
        const validEntries = ocrResults.filter(validateEntry);
        console.log('Valid entries:', validEntries);
        
        if (validEntries.length === 0) {
            console.log('No valid entries found');
            showBannerMessage('No valid entries found in OCR results.', false);
            return;
        }
        
        const newEntries = validEntries.map(result => ({
            dropOffPoint: result.dropoff,
            commodity: result.commodity,
            originalAmount: result.quantity,
            currentAmount: result.quantity,
            status: STATUS_OPTIONS[0],
            pickupPoint: result.pickup,
            planet: '',
            moon: ''
        }));
        console.log('New entries to add:', newEntries);

        setEntries(prevEntries => {
            const updatedEntries = [...prevEntries, ...newEntries];
            console.log('Updated entries:', updatedEntries);
            return updatedEntries;
        });

        // Update mission entries if any missions are selected
        const selectedMissionIndex = selectedMissions.findIndex(mission => mission);
        if (selectedMissionIndex !== -1) {
            const updatedMissionEntries = [...missionEntries];
            updatedMissionEntries[selectedMissionIndex] = [
                ...updatedMissionEntries[selectedMissionIndex],
                ...newEntries
            ];
            setMissionEntries(updatedMissionEntries);
            localStorage.setItem('missionEntries', JSON.stringify(updatedMissionEntries));
        }

        // Clear the OCR results after adding to manifest
        setOcrResults([]);
        setCurrentParsedResults([]);
        
        // Update localStorage
        localStorage.setItem('entries', JSON.stringify([...entries, ...newEntries]));
        
        showBannerMessage(`${validEntries.length} valid entries added to manifest.`, true);
    };

    // Add this state variable at the top of the component
    const [parsedResults, setParsedResults] = useState([]);

    // Update the state initialization to load from localStorage
    const [selectedFont, setSelectedFont] = useState(() => {
        const savedFont = localStorage.getItem('selectedFont');
        return savedFont || 'Orbitron';
    });

    // Add this useEffect to save the font choice
    useEffect(() => {
        localStorage.setItem('selectedFont', selectedFont);
        document.body.style.fontFamily = selectedFont;
    }, [selectedFont]);

    // Update the font selection options to include more common fonts
    const fontOptions = [
        { value: 'Orbitron', label: 'Orbitron' },
        { value: 'Arial', label: 'Arial' },
        { value: 'Verdana', label: 'Verdana' },
        { value: 'Helvetica', label: 'Helvetica' },
        { value: 'Courier New', label: 'Courier New' },
        { value: 'Georgia', label: 'Georgia' },
        { value: 'Times New Roman', label: 'Times New Roman' },
        { value: 'Trebuchet MS', label: 'Trebuchet MS' },
        { value: 'Impact', label: 'Impact' },
        { value: 'Comic Sans MS', label: 'Comic Sans MS' }
    ];

    // Add this state variable at the top of the component
    const [showKeyInput, setShowKeyInput] = useState(false);

    // Modify the handleTabChange function
    const handleTabChange = (tab) => {
        setActiveTab(tab);
        
        // Only stop the video stream if explicitly toggled off
        if (!useVideoStream) {
            stopVideoStream();
        }
    };

    // Add these state variables at the top of the component
    const [isConstantCapture, setIsConstantCapture] = useState(false);
    const [captureTimer, setCaptureTimer] = useState(0);
    const [captureInterval, setCaptureInterval] = useState(null);

    // Add this state variable for capture interval duration
    const [captureIntervalDuration, setCaptureIntervalDuration] = useState(4);

    // Modify the handleConstantCapture function
    const handleConstantCapture = () => {
        if (isConstantCapture) {
            // Stop constant capture
            setIsConstantCapture(false);
            setCaptureTimer(0);
            clearInterval(captureInterval);
            showBannerMessage('Constant capture stopped.', true);
        } else {
            // Start 5-second initial countdown
            setIsConstantCapture(true);
            setCaptureTimer(5);
            
            const countdown = setInterval(() => {
                setCaptureTimer(prev => {
                    if (prev === 1) {
                        clearInterval(countdown);
                        // Start capturing with the current interval duration
                        handleMouseUp(); // First capture
                        
                        // Start the cycle with the current interval duration
                        setCaptureTimer(captureIntervalDuration);
                        const interval = setInterval(() => {
                            setCaptureTimer(prev => {
                                if (prev === 0) {
                                    handleMouseUp(); // Perform capture
                                    return captureIntervalDuration; // Reset countdown
                                }
                                return prev - 1;
                            });
                        }, 1000);
                        setCaptureInterval(interval);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
    };

    // Modify the handleSpeedAdjustment function
    const handleSpeedAdjustment = () => {
        const newSpeed = prompt('Enter capture interval in seconds (minimum 2):', captureIntervalDuration);
        if (newSpeed && !isNaN(newSpeed) && newSpeed >= 2) {
            setCaptureIntervalDuration(Number(newSpeed));
            showBannerMessage(`Capture interval set to ${newSpeed} seconds.`, true);
            
            // If constant capture is active, update the interval
            if (isConstantCapture) {
                clearInterval(captureInterval);
                setCaptureTimer(captureIntervalDuration);
                const interval = setInterval(() => {
                    setCaptureTimer(prev => {
                        if (prev === 0) {
                            handleMouseUp(); // Perform capture
                            return captureIntervalDuration; // Reset countdown
                        }
                        return prev - 1;
                    });
                }, 1000);
                setCaptureInterval(interval);
            }
        } else {
            showBannerMessage('Invalid interval. Must be a number greater than or equal to 2.', false);
        }
    };

    // Add this useEffect to clean up the interval when component unmounts
    useEffect(() => {
        return () => {
            if (captureInterval) {
                clearInterval(captureInterval);
            }
        };
    }, [captureInterval]);

    function addToHaulingManifest(ocrResults) {
        // Validate OCR results
        if (!ocrResults || !Array.isArray(ocrResults) || ocrResults.length === 0) {
            console.error('No valid entries found in OCR results');
            showErrorToUser('No valid items detected. Please ensure the image is clear and contains readable text.');
            return;
        }

        // Filter and process valid entries
        const validEntries = ocrResults.filter(entry => {
            return entry && 
                   entry.text && 
                   entry.text.trim() !== '' && 
                   isValidEntryFormat(entry.text);
        });

        if (validEntries.length === 0) {
            console.error('No valid entries found after filtering');
            showErrorToUser('No valid items detected. Please check the format of the items in the image.');
            return;
        }

        // Process valid entries
        validEntries.forEach(entry => {
            // Add to manifest logic here
            addToManifest(processEntry(entry));
        });

        showSuccessMessage(`${validEntries.length} items added to hauling manifest`);
    }

    function isValidEntryFormat(text) {
        // Add your specific validation logic here
        // Example: Check for item number, weight, or other required fields
        const itemPattern = /^[A-Z]{3}-\d{3}\s+\d+\.\d{2}kg$/; // Example pattern
        return itemPattern.test(text.trim());
    }

    function showErrorToUser(message) {
        // Update UI to show error message to user
        const errorElement = document.getElementById('ocr-error-message');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }

    function showSuccessMessage(message) {
        // Update UI to show success message
        const successElement = document.getElementById('ocr-success-message');
        if (successElement) {
            successElement.textContent = message;
            successElement.style.display = 'block';
        }
    }

    const addToManifest = (entry) => {
        console.log('Adding entry to manifest:', entry);
        setEntries(prevEntries => {
            const newEntries = [...prevEntries, entry];
            localStorage.setItem('entries', JSON.stringify(newEntries));
            return newEntries;
        });
    };

    return (
        <div className={darkMode ? 'dark-mode' : ''}>
            <header>
                <h1 style={{ color: 'var(--title-color)' }}>SC Cargo Tracker</h1>
                <button onClick={toggleAutoScaling}>
                    {isAutoScaling ? 'Disable Auto Scaling' : 'Enable Auto Scaling'}
                </button>
            </header>
            <div className="tabs">
                {['Capture', 'Hauling Missions', 'Cargo Delivery', 'Test Features', 'History', 'Payouts', 'Preferences'].map(tab => (
                    <div key={tab} className={`tab ${activeTab === tab ? 'active-tab' : ''}`} onClick={() => handleTabChange(tab)}>{tab}</div>
                ))}
            </div>
            <div className="content">
                <h2 style={{ color: 'var(--title-color)' }}>{activeTab}</h2>
                {bannerMessage && (
                    <Portal>
                        <div className="banner">
                            {bannerMessage}
                        </div>
                    </Portal>
                )}
                {activeTab === 'Capture' && (
                    <div className="capture-tab">
                        <h3>Capture Mode</h3>
                        <div className="capture-controls">
                            <div className="stream-toggle">
                                <label>
                                    <input 
                                        type="checkbox" 
                                        checked={useVideoStream} 
                                        onChange={toggleVideoStream} 
                                    />
                                    Capture Application Window
                                </label>
                                <div className="keybinding-control">
                                    {showKeyInput ? (
                                        <input
                                            type="text"
                                            className="key-input"
                                            onKeyDown={handleKeyChange}
                                            autoFocus
                                            maxLength={1}
                                            placeholder="Press any key"
                                        />
                                    ) : (
                                        <button 
                                            className="keybinding-button"
                                            onClick={() => setShowKeyInput(true)}
                                            style={{ 
                                                backgroundColor: 'var(--button-color)',
                                                color: '#0d0d0d',
                                                border: 'none',
                                                padding: '7px 20px',
                                                borderRadius: '5px',
                                                cursor: 'pointer',
                                                fontFamily: 'inherit',
                                                fontSize: '16px',
                                                transition: 'background-color 0.3s, color 0.3s',
                                                margin: '10px 0',
                                                display: 'inline-block',
                                                textAlign: 'center',
                                                textDecoration: 'none',
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            Set Key: {captureKey}
                                        </button>
                                    )}
                                </div>
                            </div>
                            {useVideoStream && (
                                <div 
                                    className="video-container"
                                    onMouseDown={handleMouseDown}
                                    onMouseMove={handleMouseMove}
                                    onMouseUp={handleMouseUp}
                                    style={{ position: 'relative', cursor: isDrawing ? 'crosshair' : 'default' }}
                                >
                                    <video 
                                        ref={videoRef} 
                                        autoPlay 
                                        playsInline 
                                        style={{ 
                                            width: '100%', 
                                            height: 'auto', 
                                            borderRadius: '5px',
                                            display: 'block'
                                        }}
                                    />
                                    {selectionBox && videoRef.current && (
                                        <div 
                                            style={{
                                                position: 'absolute',
                                                left: (Math.min(selectionBox.startX, selectionBox.endX) / videoRef.current.videoWidth) * 100 + '%',
                                                top: (Math.min(selectionBox.startY, selectionBox.endY) / videoRef.current.videoHeight) * 100 + '%',
                                                width: (Math.abs(selectionBox.endX - selectionBox.startX) / videoRef.current.videoWidth) * 100 + '%',
                                                height: (Math.abs(selectionBox.endY - selectionBox.startY) / videoRef.current.videoHeight) * 100 + '%',
                                                border: '2px dashed #00ffcc',
                                                backgroundColor: 'rgba(0, 255, 204, 0.1)',
                                                pointerEvents: 'none'
                                            }}
                                        />
                                    )}
                                </div>
                            )}
                            {isConstantCapture && (
                                <div className="capture-timer" style={{
                                    fontSize: '1.2em',
                                    fontWeight: 'bold',
                                    color: 'var(--title-color)',
                                    margin: '10px 0'
                                }}>
                                    Next capture in: {captureTimer > 0 ? captureTimer : 3} seconds
                                </div>
                            )}
                            <div className="capture-buttons">
                                <button 
                                    className="constant-capture-button" 
                                    onClick={handleConstantCapture}
                                    style={{ 
                                        backgroundColor: isConstantCapture ? '#f44336' : 'var(--button-color)',
                                        color: '#0d0d0d',
                                        border: 'none',
                                        padding: '7px 20px',
                                        borderRadius: '5px',
                                        cursor: 'pointer',
                                        fontFamily: 'inherit',
                                        fontSize: '16px',
                                        transition: 'background-color 0.3s, color 0.3s',
                                        margin: '10px 10px 10px 0',
                                        display: 'inline-block',
                                        textAlign: 'center',
                                        textDecoration: 'none',
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    {isConstantCapture ? 'Stop Constant Capture' : 'Start Constant Capture'}
                                </button>
                                <button 
                                    className="adjust-speed-button"
                                    onClick={handleSpeedAdjustment}
                                    style={{ 
                                        backgroundColor: 'var(--button-color)',
                                        color: '#0d0d0d',
                                        border: 'none',
                                        padding: '7px 20px',
                                        borderRadius: '5px',
                                        cursor: 'pointer',
                                        fontFamily: 'inherit',
                                        fontSize: '16px',
                                        transition: 'background-color 0.3s, color 0.3s',
                                        margin: '10px 10px 10px 0',
                                        display: 'inline-block',
                                        textAlign: 'center',
                                        textDecoration: 'none',
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    Adjust Speed
                                </button>
                            <button 
                                className="add-entry-button" 
                                style={{ marginTop: '10px' }}
                                onClick={addOCRToManifest}
                                disabled={ocrResults.length === 0} // Disable button if no results
                            >
                                Add to Manifest
                            </button>
                                <button 
                                    className="undo-ocr-button" 
                                    onClick={undoLastOcrCapture}
                                    disabled={ocrCaptureHistory.length === 0} // This line disables the button when there's no history
                                    style={{ 
                                        backgroundColor: 'var(--button-color)',
                                        color: '#0d0d0d',
                                        border: 'none',
                                        padding: '7px 20px',
                                        borderRadius: '5px',
                                        cursor: 'pointer',
                                        fontFamily: 'inherit',
                                        fontSize: '16px',
                                        transition: 'background-color 0.3s, color 0.3s',
                                        margin: '10px 0',
                                        display: 'inline-block',
                                        textAlign: 'center',
                                        textDecoration: 'none',
                                        whiteSpace: 'nowrap',
                                        marginLeft: '10px'
                                    }}
                                >
                                    Undo Mistake - OCR
                                </button>
                            </div>
                        </div>
                        <div id="process-log" className="process-log">
                            {ocrResults.length > 0 && (
                                <>
                                    <div className="ocr-counters">
                                        <div className="ocr-counter">
                                            <strong>Total Entries:</strong> {ocrResults.length}
                                        </div>
                                        <div className="ocr-counter">
                                            <strong>Total SCU:</strong> {ocrResults.reduce((total, result) => {
                                                const quantity = parseInt(result.quantity.split('/')[0], 10) || 0;
                                                return total + quantity;
                                            }, 0)}
                                        </div>
                                    </div>
                                    <h4>OCR Process Log:</h4>
                                    <h4>Results Table:</h4>
                                    <table className="ocr-table">
                                        <thead>
                                            <tr>
                                                <th>Commodity</th>
                                                <th>Quantity</th>
                                                <th>Pickup</th>
                                                <th>Drop Off</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {ocrResults.map((result, index) => {
                                                // Use fuzzy matching to find the closest matches
                                                const matchedCommodity = findClosestMatch(result.commodity, data.commodities) || result.commodity;
                                                const matchedPickup = findClosestMatch(result.pickup, [
                                                    ...data.pickupPoints,
                                                    ...Object.values(data.Dropoffpoints).flat(),
                                                    ...Object.values(data.moons).flatMap(moon => Object.values(moon)).flat()
                                                ]) || result.pickup;
                                                const matchedDropoff = findClosestMatch(result.dropoff, [
                                                    ...data.pickupPoints,
                                                    ...Object.values(data.Dropoffpoints).flat(),
                                                    ...Object.values(data.moons).flatMap(moon => Object.values(moon)).flat()
                                                ]) || result.dropoff;

                                                // Check if the matches are valid
                                                const isValidCommodity = data.commodities.includes(matchedCommodity);
                                                const isValidPickup = data.pickupPoints.includes(matchedPickup) || 
                                                    Object.values(data.Dropoffpoints).flat().includes(matchedPickup) ||
                                                    Object.values(data.moons).flatMap(moon => Object.values(moon)).flat().includes(matchedPickup);
                                                const isValidDropoff = data.pickupPoints.includes(matchedDropoff) || 
                                                    Object.values(data.Dropoffpoints).flat().includes(matchedDropoff) ||
                                                    Object.values(data.moons).flatMap(moon => Object.values(moon)).flat().includes(matchedDropoff);

                                                return (
                                                    <tr key={index}>
                                                        <td style={{ color: isValidCommodity ? 'inherit' : 'red' }}>
                                                            {matchedCommodity}
                                                        </td>
                                                        <td>
                                                            {editedQuantities[index] !== undefined ? (
                                                                <input
                                                                    type="text"
                                                                    value={editedQuantities[index]}
                                                                    onChange={(e) => handleQuantityEdit(index, e.target.value)}
                                                                    onKeyPress={(e) => {
                                                                        if (e.key === 'Enter') {
                                                                            saveQuantityEdit(index);
                                                                        }
                                                                    }}
                                                                    style={{ 
                                                                        width: '50px',
                                                                        border: '1px solid #ccc',
                                                                        padding: '2px',
                                                                        borderRadius: '3px'
                                                                    }}
                                                                    autoFocus
                                                                />
                                                            ) : (
                                                                <span 
                                                                    onClick={() => handleQuantityEdit(index, result.quantity)}
                                                                    style={{ 
                                                                        cursor: 'pointer', 
                                                                        textDecoration: 'underline',
                                                                        padding: '2px 5px'
                                                                    }}
                                                                >
                                                                    {result.quantity}
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td style={{ color: isValidPickup ? 'inherit' : 'red' }}>
                                                            {matchedPickup}
                                                        </td>
                                                        <td style={{ color: isValidDropoff ? 'inherit' : 'red' }}>
                                                            {matchedDropoff}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </>
                            )}
                        </div>
                    </div>
                )}
                {activeTab === 'Hauling Missions' && (
                    <div className="hauling-missions">
                        <div className="form-row">
                            <div className="form-group">
                                <label>Pickup Point</label> {/* Renamed from First Dropdown */}
                                <Select
                                    components={{ DropdownIndicator: null, IndicatorSeparator: null }}
                                    options={pickupPointOptions}
                                    value={pickupPointOptions.find(option => option.value === firstDropdownValue)}
                                    onChange={handlePickupPointChange}
                                    className="first-dropdown-select"
                                    classNamePrefix="react-select"
                                    styles={customStyles}
                                    placeholder="Search Pickup Point"
                                />
                            </div>
                            <div className="form-group">
                                <label>Quick Lookup</label> {/* Renamed from Second Dropdown */}
                                <Select
                                    components={{ DropdownIndicator: null, IndicatorSeparator: null }}
                                    options={quickLookupOptions}
                                    value={quickLookupOptions.find(option => option.value === secondDropdownValue)}
                                    onChange={handleQuickLookupChange}
                                    className="second-dropdown-select"
                                    classNamePrefix="react-select"
                                    styles={customStyles}
                                    placeholder="Search Quick Lookup"
                                />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Location Type</label>
                                <Select
                                    components={{ DropdownIndicator: null, IndicatorSeparator: null }}
                                    options={[
                                        { value: 'planet', label: 'Planet' },
                                        { value: 'station', label: 'Station' }
                                    ]}
                                    value={{ value: locationType, label: locationType.charAt(0).toUpperCase() + locationType.slice(1) }}
                                    onChange={handleLocationTypeChange}
                                    className="location-type-select"
                                    classNamePrefix="react-select"
                                    styles={customStyles}
                                />
                            </div>
                            {locationType === 'planet' && (
                                <>
                                    <div className="form-group">
                                        <label>Planet</label>
                                        <Select
                                            components={{ DropdownIndicator: null, IndicatorSeparator: null }}
                                            options={planetOptions}
                                            value={planetOptions.find(option => option.value === selectedPlanet)}
                                            onChange={handlePlanetSelectChange}
                                            className="planet-select"
                                            classNamePrefix="react-select"
                                            styles={customStyles}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Moon</label>
                                        <Select
                                            components={{ DropdownIndicator: null, IndicatorSeparator: null }}
                                            options={selectedPlanet && data.moons[selectedPlanet] ? Object.keys(data.moons[selectedPlanet]).map(moon => ({ value: moon, label: moon })) : []}
                                            value={selectedMoon ? { value: selectedMoon, label: selectedMoon } : null}
                                            onChange={handleMoonSelectChange}
                                            className="moon-select"
                                            classNamePrefix="react-select"
                                            styles={customStyles}
                                        />
                                    </div>
                                </>
                            )}
                            {locationType === 'station' && (
                                <>
                                    <div className="form-group">
                                        <label>Station</label>
                                        <Select
                                            components={{ DropdownIndicator: null, IndicatorSeparator: null }}
                                            options={stationOptions}
                                            value={stationOptions.find(option => option.value === selectedDropOffPoint)}
                                            onChange={handleStationSelectChange}
                                            className="station-select"
                                            classNamePrefix="react-select"
                                            styles={customStyles}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Moon</label>
                                        <Select
                                            components={{ DropdownIndicator: null, IndicatorSeparator: null }}
                                            options={selectedPlanet && data.moons[selectedPlanet] ? Object.keys(data.moons[selectedPlanet]).map(moon => ({ value: moon, label: moon })) : []}
                                            value={selectedMoon ? { value: selectedMoon, label: selectedMoon } : null}
                                            onChange={handleMoonSelectChange}
                                            className="moon-select"
                                            classNamePrefix="react-select"
                                            styles={customStyles}
                                        />
                                    </div>
                                </>
                            )}
                            <div className="form-group">
                                <label>Drop off points</label>
                                <Select
                                    components={{ DropdownIndicator: null, IndicatorSeparator: null }}
                                    options={selectedMoon && data.moons[selectedPlanet][selectedMoon] ? data.moons[selectedPlanet][selectedMoon].map(station => ({ value: station, label: station })) : (data.Dropoffpoints[selectedPlanet] || []).map(station => ({ value: station, label: station }))}
                                    value={selectedDropOffPoint ? { value: selectedDropOffPoint, label: selectedDropOffPoint } : null}
                                    onChange={handleDropOffSelectChange}
                                    className="drop-off-select"
                                    classNamePrefix="react-select"
                                    styles={customStyles}
                                    placeholder="Select Drop off"
                                />
                            </div>
                            <div className="checkbox-group">
                                <div className="column">
                                    {Array.from({ length: 5 }, (_, index) => (
                                        <label key={index}>
                                            <input
                                                type="checkbox"
                                                checked={selectedMissions[index]}
                                                onChange={() => handleCheckboxChange(index)}
                                            />
                                            Mission {index + 1}
                                            {getMissionPreview(index)}
                                        </label>
                                    ))}
                                </div>
                                <div className="column">
                                    {Array.from({ length: 5 }, (_, index) => (
                                        <label key={index + 5}>
                                            <input
                                                type="checkbox"
                                                checked={selectedMissions[index + 5]}
                                                onChange={() => handleCheckboxChange(index + 5)}
                                            />
                                            Mission {index + 6}
                                            {getMissionPreview(index + 5)}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Commodity</label>
                                <Select
                                    components={{ DropdownIndicator: null, IndicatorSeparator: null }}
                                    options={commodityOptions}
                                    value={commodityOptions.find(option => option.value === selectedCommodity)}
                                    onChange={handleCommoditySelectChange}
                                    className="commodity-select"
                                    classNamePrefix="react-select"
                                    styles={customStyles}
                                />
                            </div>
                            <div className="form-group">
                                <label>Amount</label>
                                <input type="text" className="amount-input" ref={amountInputRef} onKeyPress={handleTopAmountKeyPress} />
                            </div>
                            <div className="form-group button-group">
                                <button className="add-entry-button" onClick={addEntry}>Add Entry</button>
                                <button className="process-orders-button" onClick={processOrders}>Process Orders</button>
                                <button className="table-view-button" onClick={toggleTableView}>
                                    {isAlternateTable ? 'Manifest' : 'Missions'}
                                </button>
                                <button
                                    className="clear-log-button"
                                    onClick={clearLog}
                                    style={{ backgroundColor: needsClearConfirmation ? '#ff3333' : '#ff6666' }}
                                >
                                    {needsClearConfirmation ? 'Confirm Clear' : 'Clear Log'}
                                </button>
                                <div className="scu-container">
                                    <span className="scu-label">SCU<br/>TOTAL</span>
                                </div>
                                <div className="form-group scu-group">
                                    <input type="text" className="scu-input" value={calculateTotalSCU()} disabled />
                                </div>
                            </div>
                        </div>
                        <div className="table-container">
                            {isAlternateTable ? (
                                Array.from({ length: 10 }, (_, missionIndex) => (
                                    <div key={missionIndex}>
                                        <div className="drop-off-header" onClick={() => toggleMissionCollapse(missionIndex)}>
                                            <span>Mission {missionIndex + 1}</span>
                                            <span>{collapsedMissions[missionIndex] ? '▲' : '▼'}</span>
                                        </div>
                                        {!collapsedMissions[missionIndex] && (
                                            <table className="table">
                                                <thead>
                                                    <tr>
                                                        <th>Drop off points</th>
                                                        <th>Commodity</th>
                                                        <th>QTY</th>
                                                        <th>Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {missionEntries[missionIndex].map((entry, index) => (
                                                        <tr key={index}><td>{entry.dropOffPoint}</td><td>{entry.commodity}</td><td>{entry.currentAmount}/{entry.originalAmount}</td><td>{entry.status}</td></tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        )}
                                    </div>
                                ))
                            ) : (
                                Object.keys(entries.reduce((acc, entry) => {
                                    acc[entry.dropOffPoint] = true;
                                    return acc;
                                }, {})).map(dropOffPoint => (
                                    <div key={dropOffPoint}>
                                        <div className="drop-off-header" onClick={() => toggleCollapse(dropOffPoint)}>
                                            <div className="left-box">
                                                <button onClick={(e) => { e.stopPropagation(); moveDropOffPoint(dropOffPoint, -1); }}>▲</button>
                                                <button onClick={(e) => { e.stopPropagation(); moveDropOffPoint(dropOffPoint, 1); }}>▼</button>
                                                <span>{dropOffPoint}</span>
                                                <span style={{ fontSize: 'small', marginLeft: '10px' }}>({entries.find(entry => entry.dropOffPoint === dropOffPoint)?.planet} - {entries.find(entry => entry.dropOffPoint === dropOffPoint)?.moon})</span> {/* Display planet and moon */}
                                            </div>
                                            <div className="right-box">
                                                <span>{collapsed[dropOffPoint] ? '▲' : '▼'}</span>
                                                <button onClick={(e) => { e.stopPropagation(); markAsDelivered(dropOffPoint); }}>Cargo Delivered</button>
                                            </div>
                                        </div>
                                        {!collapsed[dropOffPoint] && (
                                            <table className="table">
                                                <thead>
                                                    <tr>
                                                        <th className="pickup">Pickup</th>
                                                        <th className="commodity">Commodity</th>
                                                        <th className="amount">QTY</th>
                                                        <th className="actions">Actions</th>
                                                        <th className="status">Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {entries.filter(entry => entry.dropOffPoint === dropOffPoint).map((entry, index) => (
                                                        <tr key={index}>
                                                            <td className="pickup">{entry.pickupPoint}</td>
                                                            <td className="commodity">{entry.commodity}</td>
                                                            <td className="amount">{entry.currentAmount}/{entry.originalAmount}</td>
                                                            <td className="actions">
                                                                <input type="text" defaultValue={entry.currentAmount} size="10" 
                                                                       onBlur={(e) => handleAmountChange(index, e.target.value)} 
                                                                       onKeyPress={(e) => handleAmountKeyPress(e, index)} />
                                                                <button onClick={() => updateCargo(index, entry.currentAmount)}>Update Cargo</button>
                                                                <button className="remove-cargo-button" onClick={() => removeCargo(index)}>Remove Cargo</button>
                                                            </td>
                                                            <td className="status" style={{ color: entry.status === 'Delivered' ? 'green' : 'inherit' }}>
                                                                {entry.status}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
                {activeTab === 'Preferences' && (
                    <div className="preferences">
                        <div className="preferences-container">
                            <div className="preferences-box cargo-manifest-box">
                                <h3>Cargo Manifest</h3>
                                <div className="form-group" style={{ marginBottom: '15px' }}>
                                    <label>Drop-off Point Header Text Color</label>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <input type="color" value={dropOffHeaderTextColor} onChange={(e) => setDropOffHeaderTextColor(e.target.value)} />
                                        <button onClick={resetDropOffHeaderTextColor} style={{ marginLeft: '10px' }}>Reset</button>
                                    </div>
                                </div>
                                <div className="form-group" style={{ marginBottom: '15px' }}>
                                    <label>Row Text Color</label>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <input type="color" value={rowTextColor} onChange={(e) => setRowTextColor(e.target.value)} />
                                        <button onClick={resetRowTextColor} style={{ marginLeft: '10px' }}>Reset</button>
                                    </div>
                                </div>
                                <div className="form-group" style={{ marginBottom: '15px' }}>
                                    <label>Table Header Text Color</label>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <input type="color" value={tableHeaderTextColor} onChange={(e) => setTableHeaderTextColor(e.target.value)} />
                                        <button onClick={resetTableHeaderTextColor} style={{ marginLeft: '10px' }}>Reset</button>
                                    </div>
                                </div>
                                <div className="form-group" style={{ marginBottom: '15px' }}>
                                    <label>Mission Text Color</label>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <input type="color" value={missionTextColor} onChange={(e) => setMissionTextColor(e.target.value)} />
                                        <button onClick={resetMissionTextColor} style={{ marginLeft: '10px' }}>Reset</button>
                                    </div>
                                </div>
                                <div className="form-group" style={{ marginBottom: '15px' }}>
                                    <label>Table Outline Color</label>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <input type="color" value={tableOutlineColor} onChange={(e) => setTableOutlineColor(e.target.value)} />
                                        <button onClick={resetTableOutlineColor} style={{ marginLeft: '10px' }}>Reset</button>
                                    </div>
                                </div>
                            </div>
                            <div className="preferences-box location-box">
                                <h3>General</h3>
                                <div className="form-group" style={{ marginBottom: '15px' }}>
                                    <label>Dropdown Label Color</label>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <input type="color" value={dropdownLabelColor} onChange={(e) => setDropdownLabelColor(e.target.value)} />
                                        <button onClick={resetDropdownLabelColor} style={{ marginLeft: '10px' }}>Reset</button>
                                    </div>
                                </div>
                                <div className="form-group" style={{ marginBottom: '15px' }}>
                                    <label>Dropdown Text Color</label>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <input type="color" value={dropdownTextColor} onChange={(e) => setDropdownTextColor(e.target.value)} />
                                        <button onClick={resetDropdownTextColor} style={{ marginLeft: '10px' }}>Reset</button>
                                    </div>
                                </div>
                                <div className="form-group" style={{ marginBottom: '15px' }}>
                                    <label>Button Color</label>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <input type="color" value={buttonColor} onChange={(e) => setButtonColor(e.target.value)} />
                                        <button onClick={resetButtonColor} style={{ marginLeft: '10px' }}>Reset</button>
                                    </div>
                                </div>
                                <div className="form-group" style={{ marginBottom: '15px' }}>
                                    <label>Title Color</label>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <input type="color" value={titleColor} onChange={(e) => setTitleColor(e.target.value)} />
                                        <button onClick={resetTitleColor} style={{ marginLeft: '10px' }}>Reset</button>
                                    </div>
                                </div>
                                <div className="form-group" style={{ marginBottom: '15px' }}>
                                    <label>Font</label>
                                    <Select
                                        options={fontOptions}
                                        value={fontOptions.find(option => option.value === selectedFont)}
                                        onChange={(selectedOption) => setSelectedFont(selectedOption.value)}
                                        className="font-select"
                                        classNamePrefix="react-select"
                                        styles={customStyles}
                                    />
                                </div>
                            </div>
                            <div className="preferences-box new-group-box">
                                <h3>Data Management</h3>
                                <div className="form-group" style={{ marginBottom: '15px' }}>
                                    <label htmlFor="file-upload">Import Data</label>
                                    <input id="file-upload" type="file" accept=".json" onChange={handleImport} />
                                </div>
                                <div className="form-group" style={{ marginBottom: '15px' }}>
                                    <button 
                                        className="export-data-button" 
                                        onClick={() => handleExport('history')} 
                                        style={{ display: 'block', marginTop: '10px' }}
                                    >
                                        Export History
                                    </button>
                                    <button 
                                        className="export-data-button" 
                                        onClick={() => handleExport('payouts')} 
                                        style={{ display: 'block', marginTop: '10px' }}
                                    >
                                        Export Payouts
                                    </button>
                                </div>
                                <div className="form-group" style={{ marginBottom: '15px' }}>
                                    <button 
                                        className="clear-history-log-button" 
                                        onClick={clearHistoryLogDebug} 
                                        style={{ 
                                            display: 'block', 
                                            marginTop: '10px',
                                            backgroundColor: needsHistoryClearConfirmation ? '#ff3333' : '#ff6666'
                                        }}
                                    >
                                        {needsHistoryClearConfirmation ? 'Confirm Clear' : 'Clear History Log'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {activeTab === 'Test Features' && (
                    <div className="test-features">
                        <TestFeatures />
                    </div>
                )}
                {activeTab === 'History' && (
                    <div className="history-container">
                        <div className="history-group-box">
                            {Object.keys(historyEntries.reduce((acc, entry) => {
                                const date = new Date(entry.timestamp).toLocaleDateString();
                                acc[date] = true;
                                return acc;
                            }, {})).map(date => (
                                <div key={date} className="history-date-group">
                                    <div
                                        className="history-date-header"
                                        onClick={() => toggleCollapse(date)}
                                    >
                                        <span>{date}</span>
                                        <span>{collapsed[date] ? '▲' : '▼'}</span>
                                    </div>
                                    {!collapsed[date] && (
                                        <div className="commodity-group">
                                            {Object.entries(
                                                historyEntries
                                                    .filter(entry => new Date(entry.timestamp).toLocaleDateString() === date)
                                                    .reduce((acc, group) => {
                                                        if (!acc[group.dropOffPoint]) {
                                                            acc[group.dropOffPoint] = [];
                                                        }
                                                        group.entries.forEach(entry => {
                                                            acc[group.dropOffPoint].push({
                                                                ...entry,
                                                                dropOffPoint: group.dropOffPoint
                                                            });
                                                        });
                                                        return acc;
                                                    }, {})
                                            ).map(([dropOffPoint, entries]) => (
                                                <div key={dropOffPoint} className="commodity-group">
                                                    <div 
                                                        className="commodity-header" 
                                                        onClick={() => toggleCollapse(dropOffPoint)}
                                                    >
                                                        <span>{dropOffPoint}</span>
                                                        <span>{collapsed[dropOffPoint] ? '▲' : '▼'}</span>
                                                    </div>
                                                    {!collapsed[dropOffPoint] && (
                                                        <table className="history-table">
                                                            <thead>
                                                                <tr>
                                                                    <th>Commodity</th>
                                                                    <th>QTY (Current/Original)</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {entries.map((entry, index) => (
                                                                    <tr key={index}>
                                                                        <td>{entry.commodity}</td>
                                                                        <td>{entry.currentAmount}/{entry.originalAmount}</td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {activeTab === 'Payouts' && (
                    <div className="payouts-container">
                        <div className="payouts-group-box">
                            {Object.keys(historyEntries.reduce((acc, entry) => {
                                const date = new Date(entry.timestamp).toLocaleDateString();
                                acc[date] = true;
                                return acc;
                            }, {})).map(date => (
                                <div key={date} className="payouts-date-group">
                                    <div
                                        className="payouts-date-header"
                                        onClick={() => toggleCollapse(date)}
                                    >
                                        <span>{date}</span>
                                        <span>{collapsed[date] ? '▲' : '▼'}</span>
                                    </div>
                                    {!collapsed[date] && (
                                        <>
                                            {historyEntries
                                                .filter(entry => new Date(entry.timestamp).toLocaleDateString() === date)
                                                .map((group, index) => (
                                                    <div key={index} className="payouts-mission-group">
                                                        <div
                                                            className="payouts-mission-header"
                                                            onClick={() => toggleCollapse(`${date}-${index}`)}
                                                        >
                                                            <span>Mission {index + 1}</span>
                                                            <input
                                                                type="text"
                                                                className="mission-reward-input"
                                                                placeholder="Enter reward"
                                                                value={missionRewards[`${date}-${index}`] || ''}
                                                                onChange={(e) => handleRewardChange(`${date}-${index}`, e.target.value)}
                                                                onClick={(e) => e.stopPropagation()}
                                                            />
                                                            <span>{collapsed[`${date}-${index}`] ? '▲' : '▼'}</span>
                                                        </div>
                                                        {!collapsed[`${date}-${index}`] && (
                                                            <table className="payouts-table">
                                                                <thead>
                                                                    <tr>
                                                                        <th>Pickup</th>
                                                                        <th>Drop Off</th>
                                                                        <th>Commodity</th>
                                                                        <th>QTY</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {group.entries.map((entry, idx) => (
                                                                        <tr key={idx}>
                                                                            <td>{entry.pickupPoint}</td>
                                                                            <td>{entry.dropOffPoint}</td>
                                                                            <td>{entry.commodity}</td>
                                                                            <td>{entry.currentAmount}/{entry.originalAmount}</td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        )}
                                                    </div>
                                                ))}
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

// Remove any text glow effects being applied via JavaScript
document.querySelectorAll('*').forEach(element => {
    element.style.textShadow = 'none';
});
