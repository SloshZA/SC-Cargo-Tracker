import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import Select from 'react-select';
import TestFeatures from './TestFeatures';
import './styles.css';
console.log('Script is running');
//Presets
//'--City--',
//'--Distribution Center--',
//'--Outpost--',
//'--Scrapyard--',
//'--Farming Outpost--',
const data = {
    planets: ['Arccorp', 'Crusader', 'Hurston', 'Microtech'],
    stations: [
        'Grimm Hex',
        'Everus Harbor',
        'Baijini Point',
        'Seraphim Station',
        'Port Tressler'
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
            'New Babbage',
            '--Distribution Center--',
            'Covalex Distribution Centre S4DC05',
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
        'Aluminium',
        'Carbon',
        'Corundum',
        'Processed Food',
        'Pressurized ice',
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
        'Waste'
    ],
    pickupPoints: [
        '--City--',
        'Lorville',
        'New Babbage',
        'Area 18',
        'Orison',
        '--Station--',
        'Grimm Hex',
        'Everus Harbor',
        'Baijini Point',
        'Seraphim Station',
        'Port Tressler',
        '--Lagrange Station--',
        'ARC-L1 Wide Forest Station',
        'ARC-L2',
        'ARC-L3',
        'ARC-L4',
        'ARC-L5',
        'CRU-L1 Shallow Frontier Station',
        'CRU-L2',
        'CRU-L3',
        'CRU-L4',
        'CRU-L5',
        'HUR-L1 Green Glade Station',
        'HUR-L2',
        'HUR-L3',
        'HUR-L4',
        'HUR-L5',
        'MIC-L1 Shallow Frontier Station',
        'MIC-L2',
        'MIC-L3',
        'MIC-L4',
        'MIC-L5',
        '--Distribution Center--',
        'Covalex Distribution Centre S4DC05',
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
    ],
    quickLookup: [
        '--City--',
        'Lorville',
        'New Babbage',
        'Area 18',
        'Orison',
        '--Station--',
        'Grimm Hex',
        'Everus Harbor',
        'Baijini Point',
        'Seraphim Station',
        'Port Tressler',
        '--Lagrange Station--',
        'ARC-L1 Wide Forest Station',
        'ARC-L2',
        'ARC-L3',
        'ARC-L4',
        'ARC-L5',
        'CRU-L1 Shallow Frontier Station',
        'CRU-L2',
        'CRU-L3',
        'CRU-L4',
        'CRU-L5',
        'HUR-L1 Green Glade Station',
        'HUR-L2',
        'HUR-L3',
        'HUR-L4',
        'HUR-L5',
        'MIC-L1 Shallow Frontier Station',
        'MIC-L2',
        'MIC-L3',
        'MIC-L4',
        'MIC-L5',
        '--Distribution Center--',
        'Covalex Distribution Centre S4DC05',
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
        fontSize: '14px' // Add text size
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

const App = () => {
    const [darkMode, setDarkMode] = useState(false);
    const [activeTab, setActiveTab] = useState('Hauling Missions');
    const [locationType, setLocationType] = useState('planet');
    const [selectedPlanet, setSelectedPlanet] = useState('');
    const [selectedMoon, setSelectedMoon] = useState('');
    const [selectedDropOffPoint, setSelectedDropOffPoint] = useState('');
    const [isMission, setIsMission] = useState(false);
    const [entries, setEntries] = useState(() => {
        const savedEntries = localStorage.getItem('entries');
        return savedEntries ? JSON.parse(savedEntries) : [];
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
        setSecondDropdownValue(''); // Clear quick lookup
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

    const showBannerMessage = (message) => {
        setBannerMessage(message);
        setTimeout(() => {
            setBannerMessage('');
        }, 2000);
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
            status: 'Pending',
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
        }
    };

    const clearLog = () => {
        setEntries([]);
        setMissionEntries(Array(10).fill([]));
        localStorage.removeItem('entries');
        localStorage.removeItem('missionEntries');
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
                return { ...entry, status: 'Delivered' };
            }
            return entry;
        });
        setEntries(updatedEntries);
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

    const handlePickupPointChange = (selectedOption) => {
        setFirstDropdownValue(selectedOption ? selectedOption.value : '');
    };

    const handleQuickLookupChange = (selectedOption) => {
        setSecondDropdownValue(selectedOption ? selectedOption.value : '');

        // Simulate user selection for locationType, planet, moon, and dropOffPoints
        if (selectedOption) {
            const value = selectedOption.value;
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
        }

        // Clear the quick lookup dropdown box
        setSecondDropdownValue('');
    };

    const handlePlanetSelectChange = (selectedOption) => {
        setSelectedPlanet(selectedOption ? selectedOption.value : '');
        setSelectedMoon('');
        setSelectedDropOffPoint('');
        setSecondDropdownValue(''); // Clear quick lookup
    };

    return (
        <div className={darkMode ? 'dark-mode' : ''}>
            <header>
                <h1 style={{ color: 'var(--title-color)' }}>SC Cargo Tracker</h1>
                <button onClick={toggleDarkMode}>
                    {darkMode ? 'Light Mode' : 'Dark Mode'}
                </button>
            </header>
            <div className="tabs">
                {['Hauling Missions', 'Cargo Delivery', 'Test Features', 'History', 'Payouts', 'Preferences'].map(tab => (
                    <div key={tab} className={`tab ${activeTab === tab ? 'active-tab' : ''}`} onClick={() => setActiveTab(tab)}>{tab}</div>
                ))}
            </div>
            <div className="content">
                <h2 style={{ color: 'var(--title-color)' }}>{activeTab}</h2>
                {bannerMessage && (
                    <div className="banner">
                        {bannerMessage}
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
                                <button className="clear-log-button" onClick={clearLog}>Clear Log</button>
                                <button className="table-view-button" onClick={toggleTableView}>Table View</button>
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
                                                            <td>{entry.status}</td>
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
                                                            <td className="pickup">{entry.pickupPoint}</td> {/* Display selected pickup point per commodity */}
                                                            <td className="commodity">{entry.commodity}</td>
                                                            <td className="amount">{entry.currentAmount}/{entry.originalAmount}</td>
                                                            <td className="actions">
                                                                <input type="text" defaultValue={entry.currentAmount} size="10" onBlur={(e) => handleAmountChange(index, e.target.value)} onKeyPress={(e) => handleAmountKeyPress(e, index)} />
                                                                <button onClick={() => updateCargo(index, entry.currentAmount)}>Update Cargo</button>
                                                                <button className="remove-cargo-button" onClick={() => removeCargo(index)} style={{ color: 'black' }}>Remove Cargo</button>
                                                            </td>
                                                            <td className="status" style={{ color: entry.status === 'Delivered' ? 'green' : 'inherit' }}>{entry.status}</td>
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
                                <h3>Location</h3>
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
                            </div>
                        </div>
                    </div>
                )}
                {activeTab === 'Test Features' && (
                    <div className="test-features">
                        <TestFeatures />
                    </div>
                )}
                {/* Add content for other tabs here */}
            </div>
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
