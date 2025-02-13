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
        '--Stations--',
        'Baijini Point','Everus Harbor','Grimm Hex','Magnus Gateway','Port Tressler','Pyro Gateway','Seraphim Station',
        '--Lagrange Stations--',
        'ARC-L1 Wide Forest Station','ARC-L2 Lively Pathway Station','ARC-L3 Modern Express Station','ARC-L4 Faint Glen Station','ARC-L5 Yellow Core Station',
        'CRU-L1 Ambitious Dream Station','CRU-L4 Shallow Fields Station','CRU-L5 Beautiful Glen Station',
        'HUR-L1 Green Glade Station','HUR-L2 Faithful Dream Station','HUR-L3 Thundering Express Station','HUR-L4 Melodic Fields Station','HUR-L5 High Course Station',
        'MIC-L1 Shallow Frontier Station','MIC-L2 Long Forest Station','MIC-L3 Endless Odyssey Station','MIC-L4 Red Crossroads Station','MIC-L5 Modern Icarus Station',
    ],
    Dropoffpoints: {
        Arccorp: ['--City--','Area 18'],
        Crusader: ['--City--','Orison'],
        Hurston: [
            '--City--',//
            'Lorville',
            '--Distribution Center--',
            'Covalex Distribution Centre S1DC06','Greycat Stanton 1 Production Complex-B','HDPC-Cassillo','HDPC-Farnesway','Sakura Sun Magnolia Workcenter'
        ],
        Microtech: [
            '--City--',
            'New Babbage',
            '--Distribution Center--',
            'Covalex Distribution Center S4DC05','Greycat Stanton IV Production Complex-A','Sakura Sun Goldenrod Workcenter','microTech Logistics Depot S4LD01','microTech Logistics Depot S4LD13',
            'Shubin Mining Facility SM0-10','Shubin Mining Facility SM0-13','Shubin Mining Facility SM0-18','Shubin Mining Facility SM0-22'
        ]
    },
    moons: {
        Arccorp: {
            Lyria: ['--Outpost--','Humboldt Mine','Loveridge Mineral Reserve','Shubin Mining Facility SAL-2','Shubin Mining Facility SAL-5'],
            Wala: [
                '--Outpost--',
                'ArcCorp Mining Area 045','ArcCorp Mining Area 048','ArcCorp Mining Area 056','ArcCorp Mining Area 061',
                '--Scrapyard--',
                'Samson & Sons Salvage Center',
                '--Farming Outpost--',
                'Shady Glen Farms'
            ]
        },
        Crusader: {
            Cellin: ['--Outpost--','Gallee Family Farms','Hickes Research Outpost','Terra Mills Hydrofarm','Tram & Myers Mining'],
            Daymar: ['--Outpost--','ArcCorp Mining Area 141','Bountiful Harvest Hydroponics','Kudre Ore','Shubin Mining Facility SCD-1','Brios Breaker Yard'],
            Yela: ['--Outpost--','ArcCorp Mining Area 157','Benson Mining Outpost','Deakins Research Outpost']
        },
        Hurston: {
            Arial: ['--Outpost--','HDMS-Bezdek','HDMS-Lathan'],
            Aberdeen: ['--Outpost--','HDMS-Anderson','HDMS-Norgaard' ],
            Ita: ['--Outpost--','HDMS-Ryder','HDMS-Woodruff'],
            Magda: ['--Outpost--','HDMS-Hahn','HDMS-Perlman']
        },
        Microtech: {
            Calliope: ['--Outpost--','Rayari Anvik Research Outpost','Rayari Kaltag Research Outpost','Shubin Mining Facility SMCa-6','Shubin Mining Facility SMCa-8'],
            Clio: ['--Outpost--','Rayari Cantwell Research Outpost','Rayari McGrath Research Outpost'],
            Euterpe: ['--Outpost--','Devlin Scrap & Salvage']
        }
    },
    commodities: [
        'Agricultural Supplies','Aluminum',
        'Carbon','Corundum (Raw)','Corundum',
        'Hydrogen Fuel',
        'Pressurized ice','Processed Food',
        'Quantum Fuel','Quartz (Raw)','Quartz',
        'Scrap',
        'Ship Ammunition',
        'Silicon (Raw)','Silicon','Stims',
        'Tin (Raw)','Tin',
        'Titanium (Raw)','Titanium',
        'Tungsten (Raw)','Tungsten',
        'Waste',
    ],
    pickupPoints: [
        '--City--',
        'Lorville','NB Int Spaceport','Area 18','Orison',
        '--Station--',
        'Grimm Hex','Everus Harbor','Baijini Point','Seraphim Station','Port Tressler','Pyro Gateway','Magnus Gateway',
        '--Lagrange Stations--',
        'ARC-L1 Wide Forest Station','ARC-L2 Lively Pathway Station','ARC-L3 Modern Express Station','ARC-L4 Faint Glen Station','ARC-L5 Yellow Core Station',
        'CRU-L1 Ambitious Dream Station','CRU-L4 Shallow Fields Station','CRU-L5 Beautiful Glen Station',
        'HUR-L1 Green Glade Station','HUR-L2 Faithful Dream Station','HUR-L3 Thundering Express Station','HUR-L4 Melodic Fields Station','HUR-L5 High Course Station',
        'MIC-L1 Shallow Frontier Station','MIC-L2 Long Forest Station','MIC-L3 Endless Odyssey Station','MIC-L4 Red Crossroads Station','MIC-L5 Modern Icarus Station',
        '--Distribution Center--',
        'Covalex Distribution Center S4DC05','Covalex Distribution Centre S1DC06','Greycat Stanton I Production Complex-B','Greycat Stanton IV Production Complex-A',
        'HDPC-Cassillo','HDPC-Farnesway','microTech Logistics Depot S4LD01','microTech Logistics Depot S4LD13','Sakura Sun Goldenrod Workcenter','Sakura Sun Magnolia Workcenter',
        'Shubin Mining Facility SM0-10','Shubin Mining Facility SM0-13','Shubin Mining Facility SM0-18','Shubin Mining Facility SM0-22',
        '--Outpost--',
        'ArcCorp Mining Area 045','ArcCorp Mining Area 048','ArcCorp Mining Area 056','ArcCorp Mining Area 061','ArcCorp Mining Area 141','ArcCorp Mining Area 157',
        'Benson Mining Outpost','Bountiful Harvest Hydroponics','Brios Breaker Yard',
        'Deakins Research Outpost','Devlin Scrap & Salvage',
        'Gallee Family Farms',
        'HDMS-Anderson','HDMS-Bezdek','HDMS-Hahn','HDMS-Lathan','HDMS-Norgaard','HDMS-Perlman','HDMS-Ryder','HDMS-Woodruff','Hickes Research Outpost','Humboldt Mine',
        'Kudre Ore',
        'Loveridge Mineral Reserve',
        'Rayari Anvik Research Outpost','Rayari Cantwell Research Outpost','Rayari Kaltag Research Outpost','Rayari McGrath Research Outpost',
        'Shubin Mining Facility SAL-2','Shubin Mining Facility SAL-5','Shubin Mining Facility SCD-1','Shubin Mining Facility SMCa-6','Shubin Mining Facility SMCa-8',
        'Terra Mills Hydrofarm','Tram & Myers Mining',
        '--Scrapyard--',
        '--Farming Outpost--'
    ],
    quickLookup: [
        '--City--',
        'Lorville','NB Int Spaceport','Area 18','Orison',
        '--Station--',
        'Grimm Hex','Everus Harbor','Baijini Point','Seraphim Station','Port Tressler','Pyro Gateway','Magnus Gateway',
        '--Lagrange Stations--',
        'ARC-L1 Wide Forest Station','ARC-L2 Lively Pathway Station','ARC-L3 Modern Express Station','ARC-L4 Faint Glen Station','ARC-L5 Yellow Core Station',
        'CRU-L1 Ambitious Dream Station','CRU-L4 Shallow Fields Station','CRU-L5 Beautiful Glen Station',
        'HUR-L1 Green Glade Station','HUR-L2 Faithful Dream Station','HUR-L3 Thundering Express Station','HUR-L4 Melodic Fields Station','HUR-L5 High Course Station',
        'MIC-L1 Shallow Frontier Station','MIC-L2 Long Forest Station','MIC-L3 Endless Odyssey Station','MIC-L4 Red Crossroads Station','MIC-L5 Modern Icarus Station',
        '--Distribution Center--',
        'Covalex Distribution Center S4DC05','Covalex Distribution Centre S1DC06','Greycat Stanton I Production Complex-B','Greycat Stanton IV Production Complex-A',
        'HDPC-Cassillo','HDPC-Farnesway','microTech Logistics Depot S4LD01','microTech Logistics Depot S4LD13','Sakura Sun Goldenrod Workcenter','Sakura Sun Magnolia Workcenter',
        'Shubin Mining Facility SM0-10','Shubin Mining Facility SM0-13','Shubin Mining Facility SM0-18','Shubin Mining Facility SM0-22',
        '--Outpost--',
        'ArcCorp Mining Area 045','ArcCorp Mining Area 048','ArcCorp Mining Area 056','ArcCorp Mining Area 061','ArcCorp Mining Area 141','ArcCorp Mining Area 157',
        'Benson Mining Outpost','Bountiful Harvest Hydroponics','Brios Breaker Yard',
        'Deakins Research Outpost','Devlin Scrap & Salvage',
        'Gallee Family Farms',
        'HDMS-Anderson','HDMS-Bezdek','HDMS-Hahn','HDMS-Lathan','HDMS-Norgaard','HDMS-Perlman','HDMS-Ryder','HDMS-Woodruff','Hickes Research Outpost','Humboldt Mine',
        'Kudre Ore',
        'Loveridge Mineral Reserve',
        'Rayari Anvik Research Outpost','Rayari Cantwell Research Outpost','Rayari Kaltag Research Outpost','Rayari McGrath Research Outpost',
        'Shubin Mining Facility SAL-2','Shubin Mining Facility SAL-5','Shubin Mining Facility SCD-1','Shubin Mining Facility SMCa-6','Shubin Mining Facility SMCa-8',
        'Terra Mills Hydrofarm','Tram & Myers Mining',
        '--Scrapyard--',
        '--Farming Outpost--'    ]
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
        setSecondDropdownValue('');
    };

    const handleImport = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        const fileExtension = file.name.split('.').pop().toLowerCase();

        reader.onload = (e) => {
            try {
                let importedData = {
                    entries: [],
                    missionEntries: Array(10).fill([]),
                    historyEntries: []
                };

                switch (fileExtension) {
                    case 'json':
                        importedData = JSON.parse(e.target.result);
                        break;

                    case 'csv':
                        const csvContent = e.target.result;
                        const lines = csvContent.split('\n');
                        const headers = lines[0].split(',');
                        
                        for (let i = 1; i < lines.length; i++) {
                            if (!lines[i].trim()) continue;
                            
                            const values = lines[i].split(',');
                            const entry = {
                                timestamp: new Date(values[0]).toISOString(),
                                dropOffPoint: values[1],
                                entries: [{
                                    commodity: values[2],
                                    currentAmount: values[3],
                                    originalAmount: values[4],
                                    status: values[5] || 'Completed'
                                }]
                            };
                            
                            importedData.historyEntries.push(entry);
                        }
                        break;

                    case 'xls':
                    case 'xlsx':
                        const htmlContent = e.target.result;
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(htmlContent, 'text/html');
                        const rows = doc.querySelectorAll('tr');
                        
                        for (let i = 1; i < rows.length; i++) {
                            const cells = rows[i].querySelectorAll('td');
                            if (cells.length < 6) continue;
                            
                            const entry = {
                                timestamp: new Date(cells[0].textContent).toISOString(),
                                dropOffPoint: cells[1].textContent,
                                entries: [{
                                    commodity: cells[2].textContent,
                                    currentAmount: cells[3].textContent,
                                    originalAmount: cells[4].textContent,
                                    status: cells[5].textContent || 'Completed'
                                }]
                            };
                            
                            importedData.historyEntries.push(entry);
                        }
                        break;

                    default:
                        throw new Error('Unsupported file format');
                }

                setEntries(prevEntries => [...prevEntries, ...(importedData.entries || [])]);
                setMissionEntries(prevMissionEntries => {
                    const newMissionEntries = [...prevMissionEntries];
                    (importedData.missionEntries || []).forEach((mission, index) => {
                        newMissionEntries[index] = [...newMissionEntries[index], ...mission];
                    });
                    return newMissionEntries;
                });
                setHistoryEntries(prevHistoryEntries => [...prevHistoryEntries, ...importedData.historyEntries]);
                
                showBannerMessage('Data imported successfully.', true);
            } catch (error) {
                console.error('Import error:', error);
                showBannerMessage('Error importing file. Please check the file format.', false);
            }
        };

        if (fileExtension === 'json') {
            reader.readAsText(file);
        } else if (fileExtension === 'csv') {
            reader.readAsText(file);
        } else if (['xls', 'xlsx'].includes(fileExtension)) {
            reader.readAsText(file);
        }
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
            a.download = 'sc-cargo-tracker-history.xls';
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
                                <th>Date</th>
                                <th>Drop Off Point</th>
                                <th>Total Cargo Items</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
            `;
            
            const deliveredEntries = historyEntries.filter(entry => 
                entry.entries.some(e => e.status === 'Delivered')
            );

            deliveredEntries.forEach(entry => {
                const date = new Date(entry.timestamp).toLocaleDateString();
                htmlContent += `
                    <tr>
                        <td>${date}</td>
                        <td>${entry.dropOffPoint}</td>
                        <td>${entry.entries.length}</td>
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
            a.download = 'sc-cargo-tracker-payouts.xls';
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
            setTimeout(() => {
                if (needsHistoryClearConfirmation) {
                    setNeedsHistoryClearConfirmation(false);
                }
            }, 3000);
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

    // Initialize Tesseract worker
    const [worker, setWorker] = useState(null);

    // Initialize Tesseract worker
    useEffect(() => {
        const initializeWorker = async () => {
            try {
                const newWorker = await Tesseract.createWorker({
                    logger: m => console.log(m)
                });
                
                await newWorker.loadLanguage('eng');
                await newWorker.initialize('eng');
                
                setWorker(newWorker);
            } catch (error) {
                console.error('Failed to initialize Tesseract worker:', error);
                showBannerMessage('Failed to initialize OCR system', false);
            }
        };

        initializeWorker();

        // Cleanup worker on unmount
        return () => {
            if (worker) {
                worker.terminate();
            }
        };
    }, []); // Empty dependency array means this runs once on mount

    // Update the OCR function to use the worker
    const performOCR = async (imageData) => {
        try {
            if (!imageData) {
                throw new Error('No image data provided');
            }
            
            if (!worker) {
                throw new Error('OCR system not initialized');
            }

            const { data: { text } } = await worker.recognize(imageData);
            
            if (!text || text.trim() === '') {
                throw new Error('No text recognized');
            }
            
            return text;
        } catch (error) {
            console.error('OCR Error:', error);
            showBannerMessage('OCR Error: ' + error.message, false);
            throw error;
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
            const lastCapture = ocrCaptureHistory[ocrCaptureHistory.length - 1];
            
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
            
            setOcrCaptureHistory(prev => prev.slice(0, -1));
            
            showBannerMessage('Last OCR capture undone.', true);
        } else {
            showBannerMessage('No OCR captures to undo.', false);
        }
    };

    const handleMouseUp = async () => {
        let canvas;
        
        try {
            if (!useVideoStream || !videoRef.current || !selectionBox) return;
            setIsDrawing(false);

            canvas = document.createElement('canvas');
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
            
            const ocrText = await performOCR(image);
            
            if (!ocrText) {
                throw new Error('No text recognized');
            }
            
            const newResults = parseOCRResults(ocrText);
            setCurrentParsedResults(newResults);
            
            setOcrCaptureHistory(prev => [...prev, newResults]);
            
            setOcrResults(prevResults => [...prevResults, ...newResults]);
            
            const processLog = document.getElementById('process-log');
            
            const parsedTable = processLog.querySelector('.parsed-table');
            if (parsedTable) {
                const tbody = parsedTable.querySelector('tbody');
                tbody.innerHTML = '';
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
            
            const resultsTbody = processLog.querySelector('.results-table tbody');
            if (resultsTbody) {
                resultsTbody.innerHTML = '';
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
            console.error('Capture Error:', error);
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
        
        // First apply fuzzy matching corrections to OCR results
        const correctedResults = ocrResults.map(result => ({
            ...result,
            commodity: findClosestMatch(result.commodity, data.commodities) || result.commodity,
            pickup: findClosestMatch(result.pickup, [
                ...data.pickupPoints,
                ...Object.values(data.Dropoffpoints).flat(),
                ...Object.values(data.moons).flatMap(moon => Object.values(moon)).flat()
            ]) || result.pickup,
            dropoff: findClosestMatch(result.dropoff, [
                ...data.pickupPoints,
                ...Object.values(data.Dropoffpoints).flat(),
                ...Object.values(data.moons).flatMap(moon => Object.values(moon)).flat()
            ]) || result.dropoff
        }));
        
        // Then validate the corrected entries
        const validEntries = correctedResults.filter(validateEntry);
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
