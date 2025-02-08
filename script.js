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
            '--City--',
            'Lorville',
            '--Distribution Center--',
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
            'Rayari Deltana Research Outpost',
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
        'Pressurized Ice',
        'Agricultural Supplies',
        'Quartz',
        'Silicon',
        'Stims',
        'Tin',
        'Titanium',
        'Tungsten',
        'Hydrogen',
        'Hydrogen Fuel',
        'Quantum Fuel',
        'Ship Ammunition',
        'Scrap',
        'Waste',
        'Ship Ammunition',
        'Quantum Fuel',
        'Corundum Raw',
        'Quartz Raw',
        'Silicon Raw',
        'Tin Raw',
        'Titanium Raw',
        'Tungsten Raw'
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
        'MIC-L5 Modern Icarus Station',
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
        'Rayari Deltana Research Outpost',
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
        'MIC-L5 Modern Icarus Station',
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
        'Rayari Deltana Research Outpost',
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
        fontSize: '14px'
    }),
    menu: (provided) => ({
        ...provided,
        backgroundColor: '#333',
        color: 'var(--dropdown-text-color)',
        fontSize: '14px',
        minWidth: '300px', 
        maxHeight: '400px', 
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
            fontSize: '14px', 
            fontWeight: isUnselectable ? 'bold' : 'normal', 
            fontStyle: isUnselectable ? 'italic' : 'normal', 
            cursor: isUnselectable ? 'not-allowed' : 'default', 
            pointerEvents: isUnselectable ? 'none' : 'auto' 
        };
    },
    singleValue: (provided) => ({
        ...provided,
        color: 'var(--dropdown-text-color)',
        fontSize: '14px'
    }),
};

const STATUS_OPTIONS = ['Pending', 'In Progress', 'Delivered', 'Failed'];

function findClosestMatch(input, options) {
    if (!input || !options || options.length === 0) return null;

    // Convert input to lowercase for case-insensitive comparison, only remove [] and {} brackets
    const cleanInput = input.replace(/[[\]{}]/g, '').toLowerCase();
    
    let bestMatch = null;
    let bestScore = -Infinity;

    options.forEach(option => {
        // Convert option to lowercase for comparison, only remove [] and {} brackets
        const cleanOption = option.replace(/[[\]{}]/g, '').toLowerCase();
        
        let score = 0;
        const inputWords = cleanInput.split(' ');
        const optionWords = cleanOption.split(' ');
        
        inputWords.forEach(word => {
            if (optionWords.includes(word)) {
                score += word.length * 2;
            } else {
                optionWords.forEach(optionWord => {
                    if (optionWord.includes(word) || word.includes(optionWord)) {
                        score += Math.min(word.length, optionWord.length);
                    }
                });
            }
        });

        // If exact match (ignoring case), give highest score
        if (cleanInput === cleanOption) {
            score = Infinity;
        }

        if (score > bestScore || (score === bestScore && cleanOption.length < bestMatch.length)) {
            bestScore = score;
            // Use the original option with proper casing
            bestMatch = option;
        }
    });

    // Only return a match if the score is good enough or it's an exact match
    return bestScore === Infinity || bestScore >= cleanInput.length * 0.5 ? bestMatch : null;
}

const App = () => {
    const [darkMode, setDarkMode] = useState(false);
    const [activeTab, setActiveTab] = useState('Hauling Missions');
    const [isAutoScaling, setIsAutoScaling] = useState(true);
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
    });
    const amountInputRef = useRef(null);

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
        const numericValue = value.replace(/\D/g, '');
        
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
        document.body.style.transform = isAutoScaling ? 'scale(1)' : '';
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
        document.documentElement.style.setProperty('--mission-text-color', missionTextColor);
        document.documentElement.style.setProperty('--table-outline-color', tableOutlineColor);
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
        setSecondDropdownValue('');
    };

    const handleMoonSelectChange = (selectedOption) => {
        setSelectedMoon(selectedOption ? selectedOption.value : '');
        setSelectedDropOffPoint('');
        setSecondDropdownValue('');
    };

    const handleDropOffSelectChange = (selectedOption) => {
        setSelectedDropOffPoint(selectedOption ? selectedOption.value : '');
        handleSelectChange();
        setSecondDropdownValue('');
    };

    const handleCommoditySelectChange = (selectedOption) => {
        if (!selectedOption || selectedOption.value.startsWith('--')) return;
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
            event.target.blur();
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

    const showBannerMessage = (message, isSuccess = true) => {
        const banner = document.createElement('div');
        banner.className = 'banner-message';
        banner.textContent = message;
        banner.style.backgroundColor = isSuccess ? '#4CAF50' : '#F44336';
        banner.style.padding = '20px';
        banner.style.fontSize = '1.2em';
        banner.style.width = '100%';
        banner.style.textAlign = 'center';
        banner.style.position = 'fixed';
        banner.style.top = '0';
        banner.style.left = '0';
        banner.style.zIndex = '1000';
        banner.style.transition = 'opacity 0.5s';

        document.body.appendChild(banner);

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

        // Generate a unique ID for this entry
        const entryId = `entry_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        // Get the selected mission index
        const selectedMissionIndex = selectedMissions.findIndex(mission => mission);
        const isMissionEntry = selectedMissionIndex !== -1;
        
        const newEntry = {
            id: entryId,
            missionIndex: isMissionEntry ? selectedMissionIndex : null,
            dropOffPoint: selectedDropOffPoint,
            commodity: selectedCommodity,
            originalAmount: amountValue,
            currentAmount: amountValue,
            status: STATUS_OPTIONS[0],
            pickupPoint: firstDropdownValue,
            planet: selectedPlanet,
            moon: selectedMoon,
            isMissionEntry
        };
        
        // Add to main entries
        setEntries(prevEntries => {
            const updatedEntries = [...prevEntries, newEntry];
            localStorage.setItem('entries', JSON.stringify(updatedEntries));
            return updatedEntries;
        });

        // Only add to mission entries if it's a mission entry
        if (isMissionEntry) {
            const updatedMissionEntries = [...missionEntries];
            updatedMissionEntries[selectedMissionIndex] = [
                ...updatedMissionEntries[selectedMissionIndex], 
                { ...newEntry }
            ];
            setMissionEntries(updatedMissionEntries);
            localStorage.setItem('missionEntries', JSON.stringify(updatedMissionEntries));
        }

        if (amountInputRef.current) {
            amountInputRef.current.focus();
            amountInputRef.current.select();
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
            // Changed from 3000 to 2000 milliseconds and added explicit reset
            setTimeout(() => {
                setNeedsClearConfirmation(false);
            }, 2000);
        }
    };

    const processOrders = () => {
        console.log('Starting processOrders');
        console.log('Current entries:', entries);
        console.log('Current mission entries:', missionEntries);
        
        const deliveredEntries = entries.filter(entry => entry.status === 'Delivered');
        console.log('Delivered entries:', deliveredEntries);
        
        if (deliveredEntries.length > 0) {
            // First, group entries by mission
            const groupedByMission = deliveredEntries.reduce((acc, entry) => {
                // Ensure we have a valid mission index for mission entries
                const missionKey = entry.isMissionEntry && entry.missionIndex !== undefined ? 
                    `mission_${entry.missionIndex}` : 'regular';
                
                if (!acc[missionKey]) {
                    acc[missionKey] = {
                        entries: [],
                        missionIndex: entry.missionIndex,
                        isMissionEntry: entry.isMissionEntry,
                        timestamp: new Date().toISOString()
                    };
                }
                acc[missionKey].entries.push({
                    ...entry,
                    status: 'Delivered'
                });
                return acc;
            }, {});

            // Create history entries - one entry per mission, containing all drop-off points
            const newHistoryEntries = Object.entries(groupedByMission).map(([missionKey, missionGroup]) => {
                // Only create a single history entry per mission
                return {
                    dropOffPoint: missionGroup.entries[0].dropOffPoint, // Use first drop-off point as main reference
                    entries: missionGroup.entries, // Keep all entries together
                    timestamp: missionGroup.timestamp,
                    isMissionEntry: missionGroup.isMissionEntry,
                    missionIndex: missionGroup.missionIndex,
                    missionKey
                };
            });

            // Update history entries
            const updatedHistory = [...historyEntries, ...newHistoryEntries];
            console.log('Updated history:', updatedHistory);
            setHistoryEntries(updatedHistory);
            localStorage.setItem('historyEntries', JSON.stringify(updatedHistory));

            // Update mission entries - maintain empty arrays for all 10 slots
            const updatedMissionEntries = Array(10).fill().map((_, index) => {
                const currentMission = missionEntries[index] || [];
                return currentMission.filter(entry => 
                    !deliveredEntries.some(delivered => 
                        delivered.id === entry.id && 
                        delivered.missionIndex === index
                    )
                );
            });
            
            console.log('Updated mission entries:', updatedMissionEntries);
            setMissionEntries(updatedMissionEntries);
            localStorage.setItem('missionEntries', JSON.stringify(updatedMissionEntries));

            // Update main entries
            const updatedEntries = entries.filter(entry => 
                !deliveredEntries.some(delivered => delivered.id === entry.id)
            );
            
            console.log('Updated main entries:', updatedEntries);
            setEntries(updatedEntries);
            localStorage.setItem('entries', JSON.stringify(updatedEntries));

            showBannerMessage(`${deliveredEntries.length} orders processed and moved to history.`, true);
        } else {
            console.log('No delivered orders to process');
            showBannerMessage('No delivered orders to process.', false);
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
        // Update all entries for this dropoff point
        const updatedEntries = entries.map(entry => {
            if (entry.dropOffPoint === dropOffPoint) {
                return { ...entry, status: STATUS_OPTIONS[2] }; // Delivered
            }
            return entry;
        });
        setEntries(updatedEntries);
        localStorage.setItem('entries', JSON.stringify(updatedEntries));

        // Update all mission entries for this dropoff point
        const updatedMissionEntries = missionEntries.map(missionGroup =>
            missionGroup.map(entry => {
                if (entry.dropOffPoint === dropOffPoint) {
                    return { ...entry, status: STATUS_OPTIONS[2] };
                }
                return entry;
            })
        );

        setMissionEntries(updatedMissionEntries);
        localStorage.setItem('missionEntries', JSON.stringify(updatedMissionEntries));

        // Update history entries
        const updatedHistory = historyEntries.map(historyGroup => ({
            ...historyGroup,
            entries: historyGroup.entries.map(entry => {
                if (entry.dropOffPoint === dropOffPoint) {
                    return { ...entry, status: STATUS_OPTIONS[2] };
                }
                return entry;
            })
        }));

        setHistoryEntries(updatedHistory);
        localStorage.setItem('historyEntries', JSON.stringify(updatedHistory));
    };

    const handleFirstDropdownChange = (selectedOption) => {
        setFirstDropdownValue(selectedOption ? selectedOption.value : '');
        const searchText = selectedOption ? selectedOption.value.toLowerCase() : '';
        const filteredOptions = data.planets.filter(option => option.toLowerCase().includes(searchText));
        setFirstDropdownOptions(filteredOptions);
    };

    const handleSecondDropdownChange = (selectedOption) => {
        setSecondDropdownValue(selectedOption ? selectedOption.value : '');
        const searchText = selectedOption ? selectedOption.value.toLowerCase() : '';
        const filteredOptions = data.stations.filter(option => option.toLowerCase().includes(searchText));
        setSecondDropdownOptions(filteredOptions);
    };

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
        // Return early if pickup is empty or undefined
        if (!pickup || pickup.trim() === '') {
            return {
                pickup: '',
                isValid: false,
                message: 'Empty pickup point provided'
            };
        }

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
            // Only validate if there's a location value
            if (location && location.trim() !== '') {
                const validation = validatePickupPoint(location);
                
                if (!validation.isValid) {
                    showBannerMessage(`Warning: "${location}" is not a recognized location. Please check your spelling.`, false);
                }
                setFirstDropdownValue(location);
            }
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
        setTimeout(() => {
            setSecondDropdownValue('');
        }, 100);
    };

    const handlePlanetSelectChange = (selectedOption) => {
        setSelectedPlanet(selectedOption ? selectedOption.value : '');
        setSelectedMoon('');
        setSelectedDropOffPoint('');
        setSecondDropdownValue('');
    };

    const handleImport = (event, type) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const content = e.target.result;
                const parser = new DOMParser();
                const doc = parser.parseFromString(content, 'text/html');
                const table = doc.querySelector('table');
                
                if (!table) {
                    throw new Error('No table found in the imported file');
                }

                const rows = table.getElementsByTagName('tr');
                const importedEntries = [];
                let currentGroup = null;

                // Skip header row
                for (let i = 1; i < rows.length; i++) {
                    const cells = rows[i].getElementsByTagName('td');
                    
                    if (type === 'history') {
                        if (cells.length < 7) continue;

                        const tableIdentifier = cells[0].textContent.trim();
                        if (!tableIdentifier.startsWith('history_table_')) {
                            throw new Error('Invalid file format: Not a history table export');
                        }

                        const date = cells[1].textContent.trim();
                        const dropOffPoint = cells[2].textContent.trim();
                        const commodity = cells[3].textContent.trim();
                        const currentAmount = cells[4].textContent.trim();
                        const originalAmount = cells[5].textContent.trim();
                        const status = cells[6].textContent.trim();

                        const entry = {
                            timestamp: new Date(date).toISOString(),
                            dropOffPoint,
                            entries: [{
                                commodity,
                                currentAmount,
                                originalAmount,
                                status,
                                pickupPoint: '',
                                isMissionEntry: false
                            }]
                        };
                        importedEntries.push(entry);
                    } else if (type === 'payouts') {
                        if (cells.length < 5) continue;

                        const tableIdentifier = cells[0].textContent.trim();
                        if (!tableIdentifier.startsWith('payouts_table_')) {
                            throw new Error('Invalid file format: Not a payouts table export');
                        }

                        const date = cells[1].textContent.trim();
                        const dropOffPoint = cells[2].textContent.trim();
                        const cargoItems = parseInt(cells[3].textContent.trim(), 10);
                        const reward = cells[4].textContent.trim();

                        // Create a unique mission ID for the imported payout
                        const missionId = `${date}-${Math.floor(Math.random() * 1000)}`;

                        // Get the mission entries from the payouts table
                        const missionEntries = [];
                        let i = 1;
                        while (i < rows.length && missionEntries.length < cargoItems) {
                            const detailCells = rows[i].getElementsByTagName('td');
                            if (detailCells.length >= 4) { // Assuming format: Pickup, Drop Off, Commodity, QTY
                                missionEntries.push({
                                    commodity: detailCells[2].textContent.trim(),
                                    currentAmount: detailCells[3].textContent.trim(),
                                    originalAmount: detailCells[3].textContent.trim(),
                                    status: 'Delivered',
                                    pickupPoint: detailCells[0].textContent.trim(),
                                    isMissionEntry: true
                                });
                            }
                            i++;
                        }

                        const entry = {
                            timestamp: new Date(date).toISOString(),
                            dropOffPoint,
                            entries: missionEntries.length > 0 ? missionEntries : Array(cargoItems).fill().map(() => ({
                                commodity: 'Mission Cargo',
                                currentAmount: '1',
                                originalAmount: '1',
                                status: 'Delivered',
                                pickupPoint: '',
                                isMissionEntry: true
                            })),
                            isMissionEntry: true
                        };

                        // Add the reward to missionRewards
                        setMissionRewards(prev => {
                            const updated = {
                                ...prev,
                                [missionId]: reward
                            };
                            localStorage.setItem('missionRewards', JSON.stringify(updated));
                            return updated;
                        });

                        importedEntries.push(entry);
                    }
                }

                if (importedEntries.length > 0) {
                    if (type === 'history') {
                        setHistoryEntries(prevHistory => {
                            const updatedHistory = [...prevHistory, ...importedEntries];
                            localStorage.setItem('historyEntries', JSON.stringify(updatedHistory));
                            return updatedHistory;
                        });
                    } else if (type === 'payouts') {
                        // Update both historyEntries and missionRewards
                        setHistoryEntries(prevHistory => {
                            const updatedHistory = [...prevHistory, ...importedEntries];
                            localStorage.setItem('historyEntries', JSON.stringify(updatedHistory));
                            return updatedHistory;
                        });

                        // Save mission rewards to localStorage
                        localStorage.setItem('missionRewards', JSON.stringify(missionRewards));
                    }
                    showBannerMessage(`Successfully imported ${importedEntries.length} entries to ${type}.`, true);
                } else {
                    showBannerMessage('No valid entries found in import file.', false);
                }

            } catch (error) {
                console.error('Import error:', error);
                showBannerMessage(error.message, false);
            }
        };

        reader.readAsText(file, 'windows-1252');
        event.target.value = '';
    };

    const handleExport = (type) => {
        if (type === 'history') {
            let htmlContent = `
                <html>
                <head>
                    <meta charset="UTF-8">
                    <style>
                        table { border-collapse: collapse; width: 100%; }
                        th { 
                            font-weight: bold;
                            border: 2px solid #000;
                            background-color: #f2f2f2;
                            padding: 8px;
                        }
                        td {
                            border: 1px solid #000;
                            padding: 8px;
                        }
                    </style>
                </head>
                <body>
                    <table>
                        <thead>
                            <tr>
                                <th style="display: none;">TableIdentifier</th>
                                <th>Date</th>
                                <th>Drop Off Point</th>
                                <th>Commodity</th>
                                <th>Amount</th>
                                <th>Original Amount</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
            `;
            
            historyEntries.forEach(entry => {
                const date = new Date(entry.timestamp).toLocaleDateString();
                entry.entries.forEach(item => {
                    htmlContent += `
                        <tr>
                            <td style="display: none;">history_table_${Date.now()}</td>
                            <td>${date}</td>
                            <td>${entry.dropOffPoint}</td>
                            <td>${item.commodity}</td>
                            <td>${item.currentAmount}</td>
                            <td>${item.originalAmount}</td>
                            <td>${item.status || 'Completed'}</td>
                        </tr>
                    `;
                });
            });

            htmlContent += `
                        </tbody>
                    </table>
                </body>
                </html>
            `;
            
            const blob = new Blob([htmlContent], { type: 'application/vnd.ms-excel' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `sc-cargo-tracker-history-${Date.now()}.xls`;
            a.click();
            URL.revokeObjectURL(url);
        } 
        else if (type === 'payouts') {
            let htmlContent = `
                <html>
                <head>
                    <meta charset="UTF-8">
                    <style>
                        table { border-collapse: collapse; width: 100%; }
                        th { 
                            font-weight: bold;
                            border: 2px solid #000;
                            background-color: #f2f2f2;
                            padding: 8px;
                        }
                        td {
                            border: 1px solid #000;
                            padding: 8px;
                        }
                    </style>
                </head>
                <body>
                    <table>
                        <thead>
                            <tr>
                                <th style="display: none;">TableIdentifier</th>
                                <th>Date</th>
                                <th>Drop Off Point</th>
                                <th>Total Cargo Items</th>
                                <th>Reward</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
            `;
            
            const deliveredEntries = historyEntries.filter(entry => 
                entry.entries.some(e => e.status === 'Delivered' && e.isMissionEntry)
            );

            deliveredEntries.forEach((entry, index) => {
                const date = new Date(entry.timestamp).toLocaleDateString();
                const missionId = `${date}-${index}`;
                htmlContent += `
                    <tr>
                        <td style="display: none;">payouts_table_${Date.now()}</td>
                        <td>${date}</td>
                        <td>${entry.dropOffPoint}</td>
                        <td>${entry.entries.length}</td>
                        <td>${missionRewards[missionId] || '0'}</td>
                        <td>Delivered</td>
                    </tr>
                `;
            });

            htmlContent += `
                        </tbody>
                    </table>
                </body>
                </html>
            `;
            
            const blob = new Blob([htmlContent], { type: 'application/vnd.ms-excel' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `sc-cargo-tracker-payouts-${Date.now()}.xls`;
            a.click();
            URL.revokeObjectURL(url);
        }
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
            // Add 2-second timer to reset confirmation state
            setTimeout(() => {
                setNeedsHistoryClearConfirmation(false);
            }, 2000);
        }
    };

    const [collapsedCommodities, setCollapsedCommodities] = useState({});

    const toggleCommodityCollapse = (date, commodity) => {
        setCollapsedCommodities({
            ...collapsedCommodities,
            [`${date}-${commodity}`]: !collapsedCommodities[`${date}-${commodity}`]
        });
    };

    function createPayoutsTab() {
        const payoutsTab = document.createElement('div');
        payoutsTab.id = 'payouts-tab';
        
        const header = document.createElement('div');
        header.className = 'payouts-header';
        header.innerHTML = `
            <span>Date</span>
            <span>Mission ID</span>
        `;
        payoutsTab.appendChild(header);

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
            </tbody>
        `;
        payoutsTab.appendChild(table);
    }

    function createHualingMissionsTab() {
        const tabContent = document.createElement('div');
        tabContent.id = 'hualing-missions';
        
        const captureButton = document.createElement('button');
        captureButton.id = 'capture-mode-btn';
        captureButton.textContent = 'Capture Mode';
        captureButton.classList.add('mission-button');
        captureButton.addEventListener('click', handleCaptureMode);
        
        tabContent.appendChild(captureButton);
        
        return tabContent;
    }

    function handleCaptureMode() {
        console.log('Capture Mode activated');
    }

    const captureTab = document.getElementById('capture-tab');

    const performOCR = async (image) => {
        try {
            if (!image || typeof image !== 'string' || !image.startsWith('data:image')) {
                showBannerMessage('Invalid image data', false);
                throw new Error('Invalid image data');
            }

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
            
            const cleanedText = text.replace(/[.,]/g, '');
            
            // Parse the text using existing parseOCRResults function
            const parsedResults = parseOCRResults(cleanedText);
            
            // Check if any valid entries were created after fuzzy matching
            const hasValidEntries = parsedResults.some(result => {
                const matchedCommodity = findClosestMatch(result.commodity, data.commodities);
                const matchedPickup = findClosestMatch(result.pickup, [
                    ...data.pickupPoints,
                    ...Object.values(data.Dropoffpoints).flat(),
                    ...Object.values(data.moons).flatMap(moon => Object.values(moon)).flat()
                ]);
                const matchedDropoff = findClosestMatch(result.dropoff, [
                    ...data.pickupPoints,
                    ...Object.values(data.Dropoffpoints).flat(),
                    ...Object.values(data.moons).flatMap(moon => Object.values(moon)).flat()
                ]);
                
                return matchedCommodity && matchedPickup && matchedDropoff;
            });

            if (hasValidEntries) {
                showBannerMessage('OCR capture successful!', true);
                return cleanedText;
            } else {
                showBannerMessage('No valid mission data detected', false);
                return '';
            }
        } catch (error) {
            console.error('OCR Error:', error);
            showBannerMessage('Error processing image. Please try again.', false);
            return '';
        }
    };

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

    const [ocrResults, setOcrResults] = useState([]);

    const [currentParsedResults, setCurrentParsedResults] = useState([]);

    const [editedQuantities, setEditedQuantities] = useState({});

    const handleQuantityEdit = (index, newValue) => {
        setEditedQuantities(prev => ({
            ...prev,
            [index]: newValue
        }));
    };

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

    function sharpenImage(imageData) {
        const width = imageData.width;
        const height = imageData.height;
        const data = imageData.data;
        
        const output = new ImageData(new Uint8ClampedArray(data), width, height);
        const outputData = output.data;
        
        const kernel = [
            0, -1, 0,
            -1, 5, -1,
            0, -1, 0
        ];
        
        for (let y = 1; y < height - 1; y++) {
            for (let x = 1; x < width - 1; x++) {
                const i = (y * width + x) * 4;
                let r = 0, g = 0, b = 0;
                
                for (let ky = -1; ky <= 1; ky++) {
                    for (let kx = -1; kx <= 1; kx++) {
                        const ki = ((y + ky) * width + (x + kx)) * 4;
                        const weight = kernel[(ky + 1) * 3 + (kx + 1)];
                        
                        r += data[ki] * weight;
                        g += data[ki + 1] * weight;
                        b += data[ki + 2] * weight;
                    }
                }
                
                outputData[i] = Math.min(255, Math.max(0, r));
                outputData[i + 1] = Math.min(255, Math.max(0, g));
                outputData[i + 2] = Math.min(255, Math.max(0, b));
            }
        }
        
        return output;
    }

    const [ocrCaptureHistory, setOcrCaptureHistory] = useState([]);

    const undoLastOcrCapture = () => {
        if (ocrCaptureHistory.length > 0) {
            // Get the last capture group
            const lastCapture = ocrCaptureHistory[ocrCaptureHistory.length - 1];
            
            // Remove the last capture from OCR results
            setOcrResults(prevResults => {
                const newResults = [...prevResults];
                return newResults.slice(0, newResults.length - lastCapture.length);
            });
            
            // Remove the last capture from mission groups
            setOcrMissionGroups(prev => prev.slice(0, -1));
            
            // Remove from capture history
            setOcrCaptureHistory(prev => prev.slice(0, -1));
            
            // Clear current parsed results if they match the last capture
            if (JSON.stringify(currentParsedResults) === JSON.stringify(lastCapture)) {
                setCurrentParsedResults([]);
            }
            
            showBannerMessage('Last OCR capture undone.', true);
        } else {
            showBannerMessage('No OCR captures to undo.', false);
        }
    };

    const handleMouseUp = async () => {
        try {
            if (!useVideoStream || !videoRef.current || !selectionBox) return;
            setIsDrawing(false);

            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            canvas.width = Math.abs(selectionBox.endX - selectionBox.startX);
            canvas.height = Math.abs(selectionBox.endY - selectionBox.startY);
            
            ctx.drawImage(
                videoRef.current,
                Math.min(selectionBox.startX, selectionBox.endX),
                Math.min(selectionBox.startY, selectionBox.endY),
                canvas.width,
                canvas.height,
                0, 0, canvas.width, canvas.height
            );
            
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const sharpenedImage = sharpenImage(imageData);
            ctx.putImageData(sharpenedImage, 0, 0);
            
            const image = canvas.toDataURL('image/png', 1.0);
            
            const rawOcrText = await performOCR(image);
            setOcrText(rawOcrText);
            
            if (!rawOcrText) {
                throw new Error('No text recognized');
            }
            
            const newResults = parseOCRResults(rawOcrText);
            
            if (newResults && newResults.length > 0) {
                // Add the new results to OCR capture history
                setOcrCaptureHistory(prev => [...prev, newResults]);
                
                setCurrentParsedResults(newResults);
                setOcrMissionGroups(prev => [...prev, newResults]);
                setOcrResults(prev => [...prev, ...newResults]);
                showBannerMessage('OCR capture successful! Mission group created.', true);
            } else {
                showBannerMessage('No valid mission data found in OCR text.', false);
            }

        } catch (error) {
            showBannerMessage('Error capturing text. Please check box size and location.', false);
        }
    };

    async function captureAndOCR() {
        try {
            const stream = await navigator.mediaDevices.getDisplayMedia({
                video: {
                    displaySurface: 'window',
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                },
                audio: false
            });

            const video = document.createElement('video');
            video.srcObject = stream;
            await video.play();
            
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            
            const image = canvas.toDataURL();
            
            const imgElement = document.createElement('img');
            imgElement.src = image;
            imgElement.style.maxWidth = '100%';
            imgElement.style.borderRadius = '5px';
            imgElement.style.marginTop = '20px';
            imgElement.draggable = false;
            imgElement.style.userSelect = 'none';
            imgElement.style.pointerEvents = 'none';
            
            const capturePreview = document.getElementById('capture-preview');
            capturePreview.innerHTML = '';
            capturePreview.appendChild(imgElement);
            
            if (selectionBox) {
                const tempCanvas = document.createElement('canvas');
                tempCanvas.width = selectionBox.width;
                tempCanvas.height = selectionBox.height;
                const tempCtx = tempCanvas.getContext('2d');
                
                tempCtx.drawImage(
                    canvas,
                    selectionBox.x, selectionBox.y, selectionBox.width, selectionBox.height,
                    0, 0, selectionBox.width, selectionBox.height
                );
                
                const croppedImage = tempCanvas.toDataURL();
                const ocrText = await performOCR(croppedImage);
                
                const ocrResults = document.getElementById('ocr-results');
                ocrResults.innerHTML = ocrText;
                
                tempCanvas.remove();
            } else {
                const ocrText = await performOCR(image);
            }
            
            // Clean up
            stream.getTracks().forEach(track => track.stop());
            video.remove();
            canvas.remove();
            
        } catch (error) {
        }
    }

    const parseOCRResults = (text) => {

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

        
        text = text.replace(/\$(\w+)/g, (match, word) => {
            // Remove the $ and check if the word starts with S
            return word.startsWith('S') ? word : `S${word}`;
        });

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
    }, [useVideoStream]);

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
        // Validate commodity
        const validCommodity = data.commodities.includes(entry.commodity);
        
        // Validate pickup point
        const validPickup = data.pickupPoints.includes(entry.pickup);
        
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
        
        const isValid = validCommodity && validPickup && validDropoff;
        return isValid;
    };

    const addOCRToManifest = () => {
        if (ocrMissionGroups.length === 0) {
            showBannerMessage('No missions to add to manifest.', false);
            return;
        }

        // Find the first available mission slot
        let currentMissionIndex = missionEntries.findIndex(mission => !mission || mission.length === 0);
        if (currentMissionIndex === -1) currentMissionIndex = 0;

        // Process each mission group
        ocrMissionGroups.forEach((missionGroup, groupIndex) => {
            const timestamp = Date.now() + groupIndex;
            const newEntries = missionGroup.map((result, index) => {
                // Get the fuzzy-matched values
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

                return {
                    id: `entry_${timestamp}_${index}_${Math.random().toString(36).substr(2, 9)}`,
                    dropOffPoint: matchedDropoff,  // Use matched value
                    commodity: matchedCommodity,    // Use matched value
                    originalAmount: result.quantity,
                    currentAmount: result.quantity,
                    status: STATUS_OPTIONS[0],
                    pickupPoint: matchedPickup,     // Use matched value
                    planet: '',
                    moon: '',
                    missionIndex: currentMissionIndex + groupIndex,
                    isMissionEntry: true
                };
            });

            // Update main entries
            setEntries(prevEntries => {
                const updatedEntries = [...prevEntries, ...newEntries];
                localStorage.setItem('entries', JSON.stringify(updatedEntries));
                return updatedEntries;
            });

            // Update mission entries
            setMissionEntries(prevMissionEntries => {
                const updatedMissionEntries = [...prevMissionEntries];
                const targetIndex = currentMissionIndex + groupIndex;
                
                if (!updatedMissionEntries[targetIndex]) {
                    updatedMissionEntries[targetIndex] = [];
                }
                
                updatedMissionEntries[targetIndex] = [
                    ...updatedMissionEntries[targetIndex],
                    ...newEntries
                ];
                
                localStorage.setItem('missionEntries', JSON.stringify(updatedMissionEntries));
                return updatedMissionEntries;
            });
        });

        // Clear all OCR-related states
        setOcrResults([]);
        setCurrentParsedResults([]);
        setOcrMissionGroups([]);
        
        showBannerMessage(`Added ${ocrMissionGroups.length} missions to manifest.`, true);
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

    // Add these new state variables at the top of the App component
    const [mainTab, setMainTab] = useState('Hauling');
    const [haulingSubTab, setHaulingSubTab] = useState('Hauling Missions');

    // Modify the handleTabChange function
    const handleTabChange = (tab) => {
        setHaulingSubTab(tab);
        // Uncheck capture application window when switching sub tabs
        setUseVideoStream(false);
    };

    // Add this new handler for main tabs
    const handleMainTabChange = (tab) => {
        setMainTab(tab);
        // Uncheck capture application window when switching main tabs
        setUseVideoStream(false);
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
                        const newTimer = captureIntervalDuration;
                        setCaptureTimer(newTimer);
                        const interval = setInterval(() => {
                            setCaptureTimer(prev => {
                                if (prev === 1) {
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

    // Update processEntry to include mission information
    function processEntry(entry) {
        // Create the processed entry with mission information
        return {
            dropOffPoint: entry.dropoff,
            commodity: correctOCRText(entry.commodity),
            originalAmount: entry.quantity,
            currentAmount: entry.quantity,
            pickupPoint: entry.pickup,
            status: 'Pending',
            // Always set as mission entry when coming from OCR
            isMissionEntry: true,
            // Default to first available mission slot or mission 0
            missionIndex: findFirstAvailableMissionSlot()
        };
    }

    // Add this new helper function to find the first available mission slot
    const findFirstAvailableMissionSlot = () => {
        // First try to find a selected mission
        const selectedIndex = selectedMissions.findIndex(mission => mission);
        if (selectedIndex !== -1) {
            return selectedIndex;
        }
        
        // If no mission is selected, find the first mission that has space
        const missionWithSpace = missionEntries.findIndex(mission => !mission || mission.length === 0);
        if (missionWithSpace !== -1) {
            return missionWithSpace;
        }
        
        // Default to mission 0 if no other option is found
        return 0;
    };

    const addToManifest = (entry) => {
        // Generate a unique ID for the entry
        const entryId = `entry_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        // Create the new entry with the ID
        const newEntry = {
            ...entry,
            id: entryId
        };

        // If coming from OCR, automatically select the mission
        if (newEntry.isMissionEntry) {
            setSelectedMissions(prev => {
                const updated = [...prev];
                updated[newEntry.missionIndex] = true;
                return updated;
            });
        }

        setEntries(prevEntries => {
            const newEntries = [...prevEntries, newEntry];
            localStorage.setItem('entries', JSON.stringify(newEntries));
            return newEntries;
        });

        // Add to mission entries
        if (newEntry.isMissionEntry) {
            setMissionEntries(prevMissionEntries => {
                const updatedMissionEntries = [...prevMissionEntries];
                if (!updatedMissionEntries[newEntry.missionIndex]) {
                    updatedMissionEntries[newEntry.missionIndex] = [];
                }
                updatedMissionEntries[newEntry.missionIndex].push(newEntry);
                localStorage.setItem('missionEntries', JSON.stringify(updatedMissionEntries));
                return updatedMissionEntries;
            });
        }
    };

    // Add this new function near your other handlers
    const toggleStatus = (index, dropOffPoint) => {
        // Find all entries for this specific drop-off point
        const entriesForDropOff = entries.filter(entry => entry.dropOffPoint === dropOffPoint);
        // Get the specific entry using the relative index within this drop-off point's entries
        const entryToUpdate = entriesForDropOff[index];
        
        if (!entryToUpdate) return; // Safety check

        // Find the absolute index in the main entries array
        const absoluteIndex = entries.findIndex(entry => 
            entry.id === entryToUpdate.id &&
            entry.dropOffPoint === entryToUpdate.dropOffPoint &&
            entry.commodity === entryToUpdate.commodity &&
            entry.originalAmount === entryToUpdate.originalAmount &&
            entry.currentAmount === entryToUpdate.currentAmount &&
            entry.pickupPoint === entryToUpdate.pickupPoint
        );

        if (absoluteIndex === -1) return; // Safety check

        const updatedEntries = [...entries];
        // Toggle between Pending and Delivered
        updatedEntries[absoluteIndex].status = updatedEntries[absoluteIndex].status === 'Pending' ? 'Delivered' : 'Pending';
        setEntries(updatedEntries);
        localStorage.setItem('entries', JSON.stringify(updatedEntries));

        // Update mission entry if applicable
        if (entryToUpdate.missionIndex !== null && entryToUpdate.id) {
            const updatedMissionEntries = [...missionEntries];
            const missionGroup = updatedMissionEntries[entryToUpdate.missionIndex];
            
            if (missionGroup) {
                const missionEntryIndex = missionGroup.findIndex(entry => 
                    entry.id === entryToUpdate.id &&
                    entry.dropOffPoint === entryToUpdate.dropOffPoint
                );

                if (missionEntryIndex !== -1) {
                    updatedMissionEntries[entryToUpdate.missionIndex][missionEntryIndex] = {
                        ...missionGroup[missionEntryIndex],
                        status: updatedEntries[absoluteIndex].status
                    };
                    
                    setMissionEntries(updatedMissionEntries);
                    localStorage.setItem('missionEntries', JSON.stringify(updatedMissionEntries));
                }
            }
        }
    };

    // Add this to your OCR text correction function or create a new one
    const correctOCRText = (text) => {
        if (!text) return text;
        
        // Convert to string and trim
        text = text.toString().trim();
        
        // Common OCR corrections
        const corrections = {
            'Wasta': 'Waste',
            'Wasts': 'Waste',
            // Add more corrections as needed
        };

        // Check if the text matches any known misreadings
        return corrections[text] || text;
    };

    // Add this state variable at the top of the App component
    const [ocrMissionGroups, setOcrMissionGroups] = useState([]);

    // Add this function to clear OCR mission groups
    const clearOCRMissions = () => {
        setOcrMissionGroups([]);
        setOcrResults([]);
        setCurrentParsedResults([]);
        showBannerMessage('OCR missions cleared.', true);
    };

    // Tooltips Here
    const TAB_DESCRIPTIONS = {
      'Capture': 'OCR tool to automatically capture mission details from screenshots or screen capture\n How to use\n Step 1- Click Capture Application window\n Step 2- Allow the browser to stream your application or screen\n Step 3- After video shows up drag a box over the area where the mission details are located\n Step 4- Change mission in game and then use Capture key to speed up the process\n Step 5- Repeat until all missions are added\n Step 6- Clicking Add to Manifest button tab to submit all entries to Hauling Missions tab\n Important Info\n -When drawing the box you can include the primary objective text\n -If OCR reads the amount text wrong you can edit it manually to update to the correct amount\n -When scanning, each scan will be grouped under 1 missions to make it easier for users to access missions',
      'Hauling Missions': 'Track and manage your cargo hauling missions and deliveries\n -Drop down boxes allow for manual entry and has search functionality\n -Mission Checkboxes on the right will allow you to add multiple entries to a single mission when dealing with multiple locations\n - Buttons -\n -Add entry- will take above details and will place them in the table below\n -Process Orders - All entries marked as Delivered will be sent to History and Payouts Tab\n -Missions/Manifest - Switch between Cargo Manifest and Mission manifest table view\n -Clear Log - Click to clear both Cargo and Mission Manifest\n -SCU TOTAL - Will dispaly total SCU from all Cargo manifest entries\n -Tables-\n -Groups by drop off points and has collapse functionality\n -QTY coloumn will display 2 values Left value is for current amount and Right value is for Original amount added\n -Action Buttons - Allows a bit of fine control with your entries\n - Status displays if a entry is Pending or Delivered, the user can click on it to change the status and will sync with mission its linked to in the missions table',
      'History': 'View completed deliveries and mission history grouped by date then drop off points',
      'Payouts': 'Track mission rewards and payment history grouped by date and then mission ID'
    };

    // Add this near your other state declarations in the App component
    const [captureDebugMode, setCaptureDebugMode] = useState(() => {
        const savedMode = localStorage.getItem('captureDebugMode');
        return savedMode ? JSON.parse(savedMode) : false;
    });

    // Add this with your other useEffect hooks
    useEffect(() => {
        localStorage.setItem('captureDebugMode', JSON.stringify(captureDebugMode));
    }, [captureDebugMode]);

    // Add this handler function
    const handleCaptureDebugMode = () => {
        setCaptureDebugMode(prev => !prev);
    };

    // Add this new handler function near your other handlers
    const showDebugInfo = () => {
        if (!captureDebugMode) return;
        setShowDebugPopup(true);
    };

    // Add these new state variables near your other state declarations
    const [showDebugPopup, setShowDebugPopup] = useState(false);
    const [debugPopupPosition, setDebugPopupPosition] = useState({ x: 100, y: 100 });
    const dragRef = useRef(null);

    // Add these new functions for drag functionality
    const handleDragStart = (e) => {
        const startX = e.clientX - debugPopupPosition.x;
        const startY = e.clientY - debugPopupPosition.y;

        const handleDrag = (e) => {
            setDebugPopupPosition({
                x: e.clientX - startX,
                y: e.clientY - startY
            });
        };

        const handleDragEnd = () => {
            document.removeEventListener('mousemove', handleDrag);
            document.removeEventListener('mouseup', handleDragEnd);
        };

        document.addEventListener('mousemove', handleDrag);
        document.addEventListener('mouseup', handleDragEnd);
    };

    // Add this with your other state declarations
    const [ocrText, setOcrText] = useState('');

    // Add these new state variables near your other state declarations
    const [showTooltipPopup, setShowTooltipPopup] = useState(false);
    const [tooltipPopupPosition, setTooltipPopupPosition] = useState({ x: 100, y: 100 });
    const [activeTooltipContent, setActiveTooltipContent] = useState('');
    const tooltipDragRef = useRef(null);

    // Add this new handler for tooltip drag
    const handleTooltipDragStart = (e) => {
        const startX = e.clientX - tooltipPopupPosition.x;
        const startY = e.clientY - tooltipPopupPosition.y;

        const handleDrag = (e) => {
            setTooltipPopupPosition({
                x: e.clientX - startX,
                y: e.clientY - startY
            });
        };

        const handleDragEnd = () => {
            document.removeEventListener('mousemove', handleDrag);
            document.removeEventListener('mouseup', handleDragEnd);
        };

        document.addEventListener('mousemove', handleDrag);
        document.addEventListener('mouseup', handleDragEnd);
    };

    // Add this handler for tooltip icon click
    const handleTooltipClick = (e, content) => {
        e.preventDefault(); // Prevent the default title tooltip
        e.stopPropagation(); // Add this line to stop event bubbling
        setActiveTooltipContent(content);
        setShowTooltipPopup(true);
        // Position popup near the click
        setTooltipPopupPosition({
            x: e.clientX + 10,
            y: e.clientY + 10
        });
    };

    // Add these new state variables near your other state declarations
    const [tooltipPopupSize, setTooltipPopupSize] = useState({ width: 400, height: 300 });
    const resizeRef = useRef(null);

    // Add this new handler for resizing
    const handleResizeStart = (e) => {
        e.preventDefault();
        const startX = e.clientX;
        const startY = e.clientY;
        const startWidth = tooltipPopupSize.width;
        const startHeight = tooltipPopupSize.height;

        const handleResize = (e) => {
            const newWidth = startWidth + (e.clientX - startX);
            const newHeight = startHeight + (e.clientY - startY);
            
            setTooltipPopupSize({
                width: Math.max(300, newWidth),  // Minimum width of 300px
                height: Math.max(200, newHeight)  // Minimum height of 200px
            });
        };

        const handleResizeEnd = () => {
            document.removeEventListener('mousemove', handleResize);
            document.removeEventListener('mouseup', handleResizeEnd);
        };

        document.addEventListener('mousemove', handleResize);
        document.addEventListener('mouseup', handleResizeEnd);
    };

    return (
        <div className={darkMode ? 'dark-mode' : ''}>
            <header>
                <h1 style={{ color: 'var(--title-color)' }}>SC Cargo Tracker</h1>
                <button onClick={toggleAutoScaling}>
                    {isAutoScaling ? 'Disable Auto Scaling' : 'Enable Auto Scaling'}
                </button>
            </header>
            {/* Main Tabs */}
            <div className="main-tabs">
                {['Hauling', 'Mining', 'Preferences', 'Changelog'].map(tab => (
                    <div 
                        key={tab} 
                        className={`main-tab ${mainTab === tab ? 'active-main-tab' : ''}`} 
                        onClick={() => handleMainTabChange(tab)}
                    >
                        {tab}
                    </div>
                ))}
            </div>
            {/* Sub Tabs - Only show for Hauling */}
            {mainTab === 'Hauling' && (
                <div className="tabs">
                    {['Capture', 'Hauling Missions', 'History', 'Payouts'].map(tab => (
                        <div key={tab} className="tab-container">
                            <div 
                                className={`tab ${haulingSubTab === tab ? 'active-tab' : ''}`} 
                                onClick={() => handleTabChange(tab)}
                            >
                                {tab}
                                <span 
                                    className="tab-info-icon" 
                                    onClick={(e) => {
                                        e.stopPropagation(); // Add this line
                                        handleTooltipClick(e, TAB_DESCRIPTIONS[tab]);
                                    }}
                                    title="!Click me for a Guide on how to use this!"
                                >
                                    ⓘ
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <div className="content">
                <h2 style={{ color: 'var(--title-color)' }}>{mainTab}</h2>
                {bannerMessage && (
                    <Portal>
                        <div className="banner">
                            {bannerMessage}
                        </div>
                    </Portal>
                )}
                {mainTab === 'Hauling' && (
                    <>
                        {haulingSubTab === 'Capture' && (
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
                                            Set Capture Key: {captureKey.toUpperCase()}
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
                                            Next capture in: {captureTimer} seconds
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
                                            disabled={ocrResults.length === 0}
                                        >
                                            Add to Manifest
                                        </button>
                                        <button 
                                            className="undo-ocr-button" 
                                            onClick={undoLastOcrCapture}
                                            disabled={ocrCaptureHistory.length === 0}
                                            style={{ 
                                                backgroundColor: '#ff6666',
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
                                        {captureDebugMode && (
                                            <button 
                                                className="debug-info-button" 
                                                onClick={showDebugInfo}
                                                style={{ 
                                                    backgroundColor: '#4a90e2',
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
                                                Debug Info
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <div id="process-log" className="process-log">
                                    {ocrResults.length > 0 && (
                                        <>
                                            <div className="ocr-counters">
                                                <div className="ocr-counter">
                                                    <strong>Total Missions:</strong> {ocrMissionGroups.length}
                                                </div>
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
                                            {ocrMissionGroups.map((missionGroup, missionIndex) => (
                                                <div key={missionIndex} className="mission-group">
                                                    <h5>Mission {missionIndex + 1}</h5>
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
                                                            {missionGroup.map((result, index) => {
                                                                // Check exact matches for each field
                                                                const exactCommodityMatch = data.commodities.includes(result.commodity);
                                                                const exactPickupMatch = data.pickupPoints.includes(result.pickup) || 
                                                                    Object.values(data.Dropoffpoints).flat().includes(result.pickup) ||
                                                                    Object.values(data.moons).flatMap(moon => Object.values(moon)).flat().includes(result.pickup);
                                                                const exactDropoffMatch = data.pickupPoints.includes(result.dropoff) || 
                                                                    Object.values(data.Dropoffpoints).flat().includes(result.dropoff) ||
                                                                    Object.values(data.moons).flatMap(moon => Object.values(moon)).flat().includes(result.dropoff);

                                                                // Find closest matches using existing fuzzy matching
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

                                                                return (
                                                                    <tr key={index}>
                                                                        <td style={{ 
                                                                            color: captureDebugMode && !exactCommodityMatch ? 'red' : 'inherit',
                                                                        }}>
                                                                            {captureDebugMode ? (
                                                                                <>
                                                                                    {result.commodity}
                                                                                    {!exactCommodityMatch && matchedCommodity !== result.commodity && (
                                                                                        <span style={{ 
                                                                                            color: 'green', 
                                                                                            marginLeft: '5px',
                                                                                            fontWeight: 'bold'
                                                                                        }}>
                                                                                            → {matchedCommodity}
                                                                                        </span>
                                                                                    )}
                                                                                </>
                                                                            ) : (
                                                                                matchedCommodity
                                                                            )}
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
                                                                        <td style={{ 
                                                                            color: captureDebugMode && !exactPickupMatch ? 'red' : 'inherit',
                                                                        }}>
                                                                            {captureDebugMode ? (
                                                                                <>
                                                                                    {result.pickup}
                                                                                    {!exactPickupMatch && matchedPickup !== result.pickup && (
                                                                                        <span style={{ 
                                                                                            color: 'green', 
                                                                                            marginLeft: '5px',
                                                                                            fontWeight: 'bold'
                                                                                        }}>
                                                                                            → {matchedPickup}
                                                                                        </span>
                                                                                    )}
                                                                                </>
                                                                            ) : (
                                                                                matchedPickup
                                                                            )}
                                                                        </td>
                                                                        <td style={{ 
                                                                            color: captureDebugMode && !exactDropoffMatch ? 'red' : 'inherit',
                                                                        }}>
                                                                            {captureDebugMode ? (
                                                                                <>
                                                                                    {result.dropoff}
                                                                                    {!exactDropoffMatch && matchedDropoff !== result.dropoff && (
                                                                                        <span style={{ 
                                                                                            color: 'green', 
                                                                                            marginLeft: '5px',
                                                                                            fontWeight: 'bold'
                                                                                        }}>
                                                                                            → {matchedDropoff}
                                                                                        </span>
                                                                                    )}
                                                                                </>
                                                                            ) : (
                                                                                matchedDropoff
                                                                            )}
                                                                        </td>
                                                                    </tr>
                                                                );
                                                            })}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            ))}
                                            <div className="ocr-actions">
                                                <button onClick={addOCRToManifest}>Add All Missions to Manifest</button>
                                                <button onClick={clearOCRMissions}>Clear OCR Missions</button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                        {haulingSubTab === 'Hauling Missions' && (
                            <div className="hauling-missions">
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Pickup Point</label>
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
                                        <label>Quick Lookup</label>
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
                                                                <tr key={index}>
                                                                    <td>{entry.dropOffPoint}</td>
                                                                    <td>{entry.commodity}</td>
                                                                    <td>{entry.currentAmount}/{entry.originalAmount}</td>
                                                                    <td style={{ color: entry.status === 'Delivered' ? 'green' : 'inherit' }}>
                                                                        {entry.status}
                                                                    </td>
                                                                </tr>
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
                                                                    <td className="status" 
                                                                        style={{ 
                                                                            color: entry.status === 'Delivered' ? 'green' : 'inherit',
                                                                            cursor: 'pointer'
                                                                        }}
                                                                        onClick={() => toggleStatus(
                                                                            entries.filter(e => e.dropOffPoint === entry.dropOffPoint)
                                                                                  .findIndex(e => e.id === entry.id),
                                                                            entry.dropOffPoint
                                                                        )}
                                                                    >
                                                                        {entry.status || 'Pending'}
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
                        {haulingSubTab === 'History' && (
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
                                                                            <th>Pickup</th>
                                                                            <th>Commodity</th>
                                                                            <th>QTY</th>
                                                                            <th style={{ width: '30px' }}>%</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {entries.map((entry, index) => (
                                                                            <tr key={index}>
                                                                                <td>{entry.pickupPoint}</td>
                                                                                <td>{entry.commodity}</td>
                                                                                <td>{entry.currentAmount}/{entry.originalAmount}</td>
                                                                                <td style={{ width: '30px' }}>{Math.round((entry.currentAmount / entry.originalAmount) * 100)}%</td>
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
                        {haulingSubTab === 'Payouts' && (
                            <div className="payouts-container">
                                <div className="payouts-group-box">
                                    {Object.keys(historyEntries
                                        .filter(entry => entry.isMissionEntry) // Only show mission entries
                                        .reduce((acc, entry) => {
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
                                                        .filter(entry => 
                                                            entry.isMissionEntry && // Only show mission entries
                                                            new Date(entry.timestamp).toLocaleDateString() === date
                                                        )
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
                    </>
                )}
                {mainTab === 'Mining' && (
                    <div>Mining functionality coming soon...</div>
                )}
                {mainTab === 'Preferences' && (
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
                                    <div className="checkbox-wrapper">
                                        <label className="checkbox-label">
                                            <input 
                                                type="checkbox"
                                                checked={captureDebugMode}
                                                onChange={handleCaptureDebugMode}
                                            />
                                            Capture Debug Mode
                                        </label>
                                        <span className="checkbox-description">
                                            Shows additional information during OCR capture process
                                        </span>
                                    </div>
                                    <input 
                                        id="history-file-upload" 
                                        type="file" 
                                        accept=".xls,.xlsx" 
                                        onChange={(e) => handleImport(e, 'history')} 
                                        style={{ display: 'none' }}
                                    />
                                    <button 
                                        onClick={() => document.getElementById('history-file-upload').click()}
                                        className="import-button"
                                        style={{ display: 'block', marginTop: '10px' }}
                                    >
                                        Import History
                                    </button>
                                    <button 
                                        className="export-data-button" 
                                        onClick={() => handleExport('history')} 
                                        style={{ display: 'block', marginTop: '10px' }}
                                    >
                                        Export History
                                    </button>
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
                {mainTab === 'Changelog' && (
                    <div className="changelog">
                        <div className="changelog-container">
                        <div className="changelog-entry">
                            <h3>Version 1.3 - Additions and fixes</h3>
                                <ul>
                                    <u>Debug Mode for OCR Capture</u>
                                    <li>New button called debug info under capture tab to see what the OCR is reading - can be turned on/off via the preferences tab under data management </li>
                                    <li>Turning Debug mode on also shows you the corrections made red being the Mispelled text and green being the Corrected text</li>
                                    <u>Tooltips</u>
                                    <li>Added tooltips to give general info and how to use it each tab</li>
                                    <li>Clicking on the "?" next to the tabs will display a popout you can adjust in size and postition to give a more indepth idea how that tab works</li>
                                    <u>Fixes</u>
                                    <li>Fixed Undo OCR mistake button not working</li>

                                </ul>
                            </div>

                            <div className="changelog-entry">
                            <h3>Version 1.2.1 - HotFix</h3>
                                <ul>
                                    <u>Fixes</u>
                                    <li>Mission entries being displayed as Separate mission when adding to payouts tab and having diffrent locations</li>
                                    <li>OCR no longer shows success message when no text is detected</li>
                                </ul>
                            </div>
                            <div className="changelog-entry">
                            <h3>Version 1.2.0 - FIxes and Temp Changes</h3>
                                <ul>
                                    <li>1AM fixes be like</li>
                                    <u>FIXES </u>
                                    <li>Forget to use my index on status toggling so if you have 2 drop off points the top drop off point was the only one being toggled</li>
                                    <li>Added green text to delviered status of missions in mission table</li>
                                    <li>Fixed entries added from OCR capture to allow individual status toggle synced with missions using ID</li>
                                    <li>Added to OCR resuslts table to track missions</li>
                                    <li>-Each scan is considered a mission - tracks mission in OCR results table aswell</li>
                                    <li>-No need to click on hauling tab and then come to capture tab to add entries to missions</li>
                                    <u>KNOWN BUGS</u>
                                    <li>when adding misison entries to payouts will ignore some tables looking into it</li>
                                    <u>TODO</u>
                                    <li>Turn missoin list into dynamic instead of fixed 10 slots</li>
                                    <li>Add capturing reward amount table for even less input required X_X</li>
                                </ul>
                            </div>

                        <div className="changelog-entry">
                                <h3>Version 1.1.0 - FIxes and Temp Changes</h3>
                                <ul>
                                    <u>ADDITIONAL TABS</u>
                                    <li>Mining(WIP) - huskerbolt1 - for giving me a new idea</li>
                                    <u>FIXES</u>
                                    <li>Non-missions being sent to payouts tab</li>
                                    <li>imports not be saved on refresh</li>
                                    <li>constant capture count down going from 3 to the users set time and  then going down</li>
                                    <li>Clicking Status changes between Pending and Delivered for both misison and cargo manifest by using unique ID to keep track - Ruadhan2300 for pointing out ease of use
                                    XES</li>
                                    <u>TEMPORARY REMOVAL</u>
                                    <li>Removed import/export payouts function.</li>

                                </ul>
                            </div>

                            <div className="changelog-entry">
                                <h3>Version 1.0.0 - Initial Release</h3>
                                <ul>
                                    <li>Added Hauling Mission tracking system</li>
                                    <li>Improved OCR accuracy</li>
                                    <li>Added mission management system</li>
                                    <li>Added history tracking</li>
                                    <li>Added customizable preferences</li>
                                    <li>Added import/export functionality</li>
                                </ul>
                            </div>
                            <div className="changelog-entry">
                                <h3>Version 0.9.0 - Beta</h3>
                                <ul>
                                    <li>Added constant capture mode</li>
                                    <li>Added customizable capture intervals</li>
                                    <li>Implemented OCR capture functionality</li>
                                    <li>Added status toggling for individual entries</li>
                                </ul>
                            </div>
                            <div className="changelog-entry">
                                <h3>Version 0.8.0 - Alpha</h3>
                                <ul>
                                    <li>Initial implementation of cargo tracking</li>
                                    <li>Basic mission system</li>
                                    <li>Basic UI and styling</li>
                                </ul>
                            </div>
                            <div className="changelog-entry">
                                <h3>Version 1.2.3 - HotFix</h3>
                                <ul>
                                    <u>Fixes</u>
                                    <li>OCR now only shows success if valid mission data is detected after fuzzy matching</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            {showDebugPopup && captureDebugMode && (
                <div 
                    className="debug-popup"
                    style={{
                        left: debugPopupPosition.x,
                        top: debugPopupPosition.y
                    }}
                >
                    <div 
                        className="debug-popup-header"
                        onMouseDown={handleDragStart}
                        ref={dragRef}
                    >
                        <span>OCR Text</span>
                        <button onClick={() => setShowDebugPopup(false)}>×</button>
                    </div>
                    <div className="debug-popup-content">
                        <div className="debug-section">
                            <h4>Raw OCR Text:</h4>
                            <pre>{ocrText || 'No text captured yet'}</pre>
                            {currentParsedResults && currentParsedResults.length > 0 && (
                                <>
                                    <h4>Parsed Results:</h4>
                                    <pre>{JSON.stringify(currentParsedResults, null, 2)}</pre>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
            {showTooltipPopup && (
                <div 
                    className="tooltip-popup"
                    style={{
                        left: tooltipPopupPosition.x,
                        top: tooltipPopupPosition.y,
                        width: tooltipPopupSize.width,
                        height: tooltipPopupSize.height
                    }}
                >
                    <div 
                        className="tooltip-popup-header"
                        onMouseDown={handleTooltipDragStart}
                        ref={tooltipDragRef}
                    >
                        <span>Info</span>
                        <button onClick={() => setShowTooltipPopup(false)}>×</button>
                    </div>
                    <div 
                        className="tooltip-popup-content"
                        style={{ height: tooltipPopupSize.height - 50 }} // Adjust for header height
                    >
                        {activeTooltipContent.split('\n').map((line, index) => (
                            <p key={index}>{line}</p>
                        ))}
                    </div>
                    <div 
                        className="tooltip-popup-resize-handle"
                        onMouseDown={handleResizeStart}
                        ref={resizeRef}
                    />
                </div>
            )}
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

// Remove any text glow effects being applied via JavaScript
document.querySelectorAll('*').forEach(element => {
    element.style.textShadow = 'none';
});