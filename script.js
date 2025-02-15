import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import Select from 'react-select';
import * as XLSX from 'xlsx';

import './styles.css';
import Portal from './components/Portal';
import './styles/Header.css';
import './styles/Tabs.css';
import './styles/Content.css';
import './styles/HaulingMissions.css';
import './styles/Table.css';
import './styles/Preferences.css';
import './styles/History.css';
import { Tabs } from './scripts/Tabs/Tabs';
import { HaulingSubTabPayouts } from './scripts/Tabs/1) Hauling/Payouts Tab/PayoutsSubTabHauling';
import { HistorySubTabHauling } from './scripts/Tabs/1) Hauling/History Tab/HistorySubTabHauling';
import { PreferencesTab } from './scripts/Tabs/5) Preferences/Preferences';
import { ChangelogTab } from './scripts/Tabs/6) Changelog/Changelog';
import CaptureSubTabHauling from './scripts/Tabs/1) Hauling/Capture Tab/CaptureSubTabHauling';
import { MissionSubTabHauling } from './scripts/Tabs/1) Hauling/Hauling Mission Tab/MissionSubTabHauling';
import { DebugOptions } from './scripts/Tabs/7) Debug Options/DebugOptions';
import { DebugLogs, shouldLog } from './scripts/Tabs/7) Debug Options/DebugConsoleLogs';
import { TooltipPopup } from './scripts/Tooltips/TooltipPopup';
import { useTooltip } from './scripts/Tooltips/useTooltip';
import StantonSystemData, { generateLocationLists } from './Location Data/Stanton System/Location Data/Const Data Stanton.js';
import { locationCorrections } from './scripts/Tabs/1) Hauling/Capture Tab/LocationCorrections';
import { contextMenu } from './scripts/utils/ContextMenu.js';
const crypto = require('crypto');
const nonce = crypto.randomBytes(16).toString('base64');
const { pickupPoints, quickLookup } = generateLocationLists();

const data = {
    ...StantonSystemData,
    pickupPoints,
    quickLookup
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
    // Group all state declarations together at the top
    const [mainTab, setMainTab] = useState('Hauling');
    const [haulingSubTab, setHaulingSubTab] = useState('Hauling Missions');
    const [cargoHoldSubTab, setCargoHoldSubTab] = useState('Inventory');
    const [darkMode, setDarkMode] = useState(false);
    const [isAutoScaling, setIsAutoScaling] = useState(true);
    const [hasEntries, setHasEntries] = useState(false);
    const [bannerMessage, setBannerMessage] = useState('');
    const [debugMode, setDebugMode] = useState(() => {
        // Ensure debug mode is off on page load
        localStorage.setItem('debugMode', 'false');
        return false;
    });
    const [payoutEntries, setPayoutEntries] = useState(() => {
        const saved = localStorage.getItem('payoutEntries');
        return saved ? JSON.parse(saved) : [];
    });

    // Group all refs together
    const amountInputRef = useRef(null);
    const dragRef = useRef(null);
    const tooltipDragRef = useRef(null);
    const resizeRef = useRef(null);

    // Group all handlers together
    const handleMainTabChange = (tab) => {
        setMainTab(tab);
    };

    const handleTabChange = (tab) => {
        setHaulingSubTab(tab);
    };

    const handleCargoHoldTabChange = (tab) => {
        setCargoHoldSubTab(tab);
    };

    // Add this useEffect for debugMode
    useEffect(() => {
        localStorage.setItem('debugMode', JSON.stringify(debugMode));
    }, [debugMode]);

    const [locationType, setLocationType] = useState('planet');
    const [selectedPlanet, setSelectedPlanet] = useState('');
    const [selectedMoon, setSelectedMoon] = useState('');
    const [selectedDropOffPoint, setSelectedDropOffPoint] = useState('');
    const [isMission, setIsMission] = useState(false);
    const [entries, setEntries] = useState(() => {
        const savedEntries = localStorage.getItem('entries');
        const parsedEntries = savedEntries ? JSON.parse(savedEntries) : [];
        console.log('Loaded entries from localStorage:', parsedEntries);
        return parsedEntries;
    });

    const [historyEntries, setHistoryEntries] = useState(() => {
        const savedHistory = localStorage.getItem('historyEntries');
        return savedHistory ? JSON.parse(savedHistory) : [];
    });
    const [collapsed, setCollapsed] = useState(() => {
        const savedCollapsed = localStorage.getItem('collapsed');
        return savedCollapsed ? JSON.parse(savedCollapsed) : {};
    });

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

    const pickupPointOptions = data.pickupPoints.map(point => ({ value: point, label: point }));
    const planetOptions = StantonSystemData.planets.map(planet => ({ value: planet, label: planet }));
    const stationOptions = data.stations.map(station => ({ value: station, label: station }));
    const commodityOptions = data.commodities.map(commodity => ({ value: commodity, label: commodity }));
    const [selectedCommodity, setSelectedCommodity] = useState(() => localStorage.getItem('selectedCommodity') || commodityOptions[0].value);

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
        if (autoMissionAllocation) {
            // If autoMissionAllocation is true, do nothing
            return;
        }
        const updatedSelectedMissions = [...selectedMissions];
        updatedSelectedMissions[index] = !updatedSelectedMissions[index];
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
        localStorage.setItem('payoutEntries', JSON.stringify(payoutEntries));
    }, [payoutEntries]);

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
        setLocationType(selectedOption.value);
        setSelectedPlanet('');
        setSelectedMoon('');
        setSelectedDropOffPoint('');
    };

    const handleMoonSelectChange = (selectedOption) => {
        setSelectedMoon(selectedOption ? selectedOption.value : '');
        setSelectedDropOffPoint('');
    };

    const handleStationSelectChange = (selectedOption) => {
        if (!selectedOption || selectedOption.value.startsWith('--')) return;
        setSelectedDropOffPoint(selectedOption.value);
    };

    const handleDropOffSelectChange = (selectedOption) => {
        if (!selectedOption || selectedOption.value.startsWith('--')) return;
        setSelectedDropOffPoint(selectedOption.value);
        if (amountInputRef.current) {
            amountInputRef.current.focus();
            amountInputRef.current.select();
        }
    };

    const handlePickupPointChange = (selectedOption) => {
        if (selectedOption) {
            const location = selectedOption.value;
            console.log('Pickup point selected:', location);
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

    const handleSelectChange = () => {
        if (amountInputRef.current) {
            amountInputRef.current.focus();
        }
    };

    const handleAmountChange = (index, newAmount) => {
        setEntries(prevEntries => {
            const updatedEntries = [...prevEntries];
            const entry = updatedEntries[index];
            
            // Convert to numbers for comparison
            const newAmountNum = Number(newAmount) || 0;
            const originalAmountNum = Number(entry.originalAmount);
            
            // Ensure new amount doesn't exceed original amount
            const validatedAmount = Math.min(newAmountNum, originalAmountNum);
            
            // Ensure amount is not negative
            const finalAmount = Math.max(0, validatedAmount);
            
            updatedEntries[index] = {
                ...entry,
                currentAmount: finalAmount.toString()
            };
            
            // If the amount was invalid, show a message
            if (newAmountNum > originalAmountNum) {
                showBannerMessage(`Amount cannot exceed original amount of ${originalAmountNum}`);
            }
            
            localStorage.setItem('entries', JSON.stringify(updatedEntries));
            return updatedEntries;
        });
    };

    const handleAmountKeyPress = (event, index) => {
        if (event.key === 'Enter' && document.activeElement.classList.contains('amount-input')) {
            event.preventDefault();
            addEntry();
            amountInputRef.current.focus();
            amountInputRef.current.select();
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

    const [needsClearConfirmation, setNeedsClearConfirmation] = useState(false);

    const clearLog = () => {
        setEntries([]);
        setMissionEntries(Array(10).fill([]));
        setMissionRewards({}); // Clear all mission rewards
        localStorage.removeItem('entries');
        localStorage.removeItem('missionEntries');
        localStorage.removeItem('missionRewards'); // Clear from localStorage too
        setHasEntries(false);
    };

    const [debugFlags, setDebugFlags] = useState(() => {
        const savedFlags = localStorage.getItem('debugFlags');
        return savedFlags ? JSON.parse(savedFlags) : {
            // Hauling tab
            haulingMissions: {
                addEntry: true,
                processOrders: true,
                missionGrouping: true,
                statusChanges: true
            },
            capture: {
                ocrProcessing: true,
                locationCorrection: true,
                dataValidation: true
            },
            history: {
                entryGrouping: true,
                dataLoading: true
            },
            payouts: {
                missionTracking: true,
                rewardCalculations: true
            },
            // General
            localStorage: {
                saving: true,
                loading: true
            },
            stateChanges: {
                entries: true,
                missions: true,
                rewards: true
            }
        };
    });

    const updateCargo = (index, newAmount) => {
        const updatedEntries = [...entries];
        const entry = updatedEntries[index];

        // Validate newAmount to be a number and not exceed originalAmount
        const newAmountNum = Number(newAmount);
        if (isNaN(newAmountNum)) {
            showBannerMessage('Invalid amount entered.');
            return;
        }

        const originalAmountNum = Number(entry.originalAmount);
        if (newAmountNum > originalAmountNum) {
            showBannerMessage(`Amount cannot exceed original amount of ${originalAmountNum}`);
            return;
        }

        // Update currentAmount with the validated newAmount
        updatedEntries[index].currentAmount = String(newAmountNum);
        setEntries(updatedEntries);
        localStorage.setItem('entries', JSON.stringify(updatedEntries));

        // Update mission entries if it's a mission entry
        if (entry.isMissionEntry && entry.missionIndex !== null) {
            const missionIndex = entry.missionIndex;
            const updatedMissionEntries = [...missionEntries];
            const missionEntryIndex = updatedMissionEntries[missionIndex].findIndex(missionEntry => missionEntry.id === entry.id);

            if (missionEntryIndex !== -1) {
                updatedMissionEntries[missionIndex][missionEntryIndex].currentAmount = String(newAmountNum);
                setMissionEntries(updatedMissionEntries);
                localStorage.setItem('missionEntries', JSON.stringify(updatedMissionEntries));
            }
        }
    };

    const removeCargo = (index) => {
        const entryToRemove = entries[index];
        const updatedEntries = entries.filter((_, i) => i !== index);
        setEntries(updatedEntries);

        const updatedMissionEntries = missionEntries.map(mission => 
            mission ? mission.filter(entry => entry !== entryToRemove) : []
        );
        setMissionEntries(updatedMissionEntries);
        localStorage.setItem('missionEntries', JSON.stringify(updatedMissionEntries));
    };

    const calculateTotalSCU = () => {
        // Update to handle both regular entries and mission entries
        const totalSCU = entries.reduce((total, entry) => {
            const amount = parseFloat(entry.currentAmount) || parseFloat(entry.amount) || 0;
            return total + amount;
        }, 0);
        return totalSCU.toFixed(0); // Format to 0 decimal places
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
        if (shouldLog(debugFlags, 'haulingMissions', 'statusChanges')) {
            console.log('🎯 Marking Delivered:', {
                dropOffPoint,
                affectedEntries: entries.filter(e => e.dropOffPoint === dropOffPoint)
                    .map(e => ({
                        id: e.id,
                        status: e.status,
                        isMissionEntry: e.isMissionEntry,
                        missionIndex: e.missionIndex
                    }))
            });
        }

        const updatedEntries = entries.map(entry => {
            if (entry.dropOffPoint === dropOffPoint) {
                // If this is a mission entry, update the mission entries as well
                if (entry.isMissionEntry && entry.missionIndex !== undefined) {
                    const newMissionEntries = [...missionEntries];
                    const missionGroup = newMissionEntries[entry.missionIndex];
                    
                    if (missionGroup) {
                        const missionEntry = missionGroup.find(e => e.id === entry.id);
                        if (missionEntry) {
                            missionEntry.status = 'Delivered';
                            if (shouldLog(debugFlags, 'haulingMissions', 'statusChanges')) {
                                console.log('✅ Updated Mission Entry:', {
                                    id: entry.id,
                                    missionIndex: entry.missionIndex,
                                    newStatus: 'Delivered'
                                });
                            }
                        } else if (shouldLog(debugFlags, 'haulingMissions', 'statusChanges')) {
                            console.log('❌ Mission Entry Not Found:', {
                                id: entry.id,
                                missionIndex: entry.missionIndex
                            });
                        }
                    }
                    setMissionEntries(newMissionEntries);
                    localStorage.setItem('missionEntries', JSON.stringify(newMissionEntries));
                }
                return { ...entry, status: 'Delivered' };
            }
            return entry;
        });

        setEntries(updatedEntries);
        localStorage.setItem('entries', JSON.stringify(updatedEntries));
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
        reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });

            // Assuming the first sheet contains the data
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });

            // Determine the table type based on the headers
            const headers = jsonData[0];
            if (headers.includes('commodity') && headers.includes('QTY') && headers.includes('pickup') && headers.includes('dropOffPoint')) {
                // It's likely a history or payouts table
                if (headers.includes('missionId')) {
                    // It's a payouts table
                    const payoutEntries = jsonData.slice(1).map(row => {
                        return {
                            id: row[0],
                            missionId: row[1],
                            commodity: row[2],
                            amount: row[3],
                            pickup: row[4],
                            dropOffPoint: row[5],
                            status: row[6],
                            date: row[7],
                            reward: row[8],
                            missionIndex: row[9],
                            originalAmount: row[10]
                        };
                    });
                    setPayoutEntries(payoutEntries);
                    localStorage.setItem('payoutEntries', JSON.stringify(payoutEntries));
                    showBannerMessage('Payouts data imported successfully', true);
                } else {
                    // It's a history table
                    const historyEntries = jsonData.slice(1).map((row, index) => {
                        try {
                            return {
                                pickup: row[0], // Pickup is at index 0
                                commodity: row[1], // Commodity is at index 1
                                amount: row[2], // Amount is at index 2
                                dropOffPoint: row[3],
                                status: row[4],
                                date: row[5],
                                reward: row[6],
                                originalAmount: row[7] // originalAmount is at index 7
                            };
                        } catch (error) {
                            console.error(`Error parsing row ${index + 1}:`, row, error);
                            return null; // Skip this row
                        }
                    }).filter(row => row !== null); // Remove skipped rows

                    setHistoryEntries(historyEntries);
                    localStorage.setItem('historyEntries', JSON.stringify(historyEntries));
                    showBannerMessage('History data imported successfully', true);
                }
            } else {
                showBannerMessage('Error importing data: Invalid file format', false);
            }
        };
        reader.readAsArrayBuffer(file);
    };

    const handleExport = () => {
        const data = {
            entries,
            historyEntries,
            missionEntries,
            missionRewards
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
        a.download = `sc_cargo_tracker_backup_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
            a.click();
        document.body.removeChild(a);
            URL.revokeObjectURL(url);
        showBannerMessage('Data exported successfully', true);
    };

    const [needsHistoryClearConfirmation, setNeedsHistoryClearConfirmation] = useState(false);

    const clearHistoryLogDebug = () => {
        if (!needsHistoryClearConfirmation) {
            setNeedsHistoryClearConfirmation(true);
            showBannerMessage('Click again to confirm clearing all history and payouts', false);
            setTimeout(() => {
                setNeedsHistoryClearConfirmation(false);
            }, 3000);
            return;
        }

        // Clear history entries
        setHistoryEntries([]);
        localStorage.removeItem('historyEntries');

        // Clear payout entries
        setPayoutEntries([]);
        localStorage.removeItem('payoutEntries');

        // Clear mission entries
        setMissionEntries(Array(10).fill([]));
        localStorage.removeItem('missionEntries');

        // Clear mission rewards
        setMissionRewards({});
        localStorage.removeItem('missionRewards');

        // Reset confirmation state
        setNeedsHistoryClearConfirmation(false);
        showBannerMessage('History and payouts cleared successfully', true);
    };

    const [collapsedCommodities, setCollapsedCommodities] = useState({});

    const toggleCommodityCollapse = (date, commodity) => {
        setCollapsedCommodities({
            ...collapsedCommodities,
            [`${date}-${commodity}`]: !collapsedCommodities[`${date}-${commodity}`]
        });
    };

    const captureTab = document.getElementById('capture-tab');

    const [showDebugPopup, setShowDebugPopup] = useState(false);
    const [debugPopupPosition, setDebugPopupPosition] = useState({ x: 100, y: 100 });

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

    // Add tooltip hook
    const tooltip = useTooltip();

    const toggleStatus = (index, dropOffPoint) => {
        const updatedEntries = [...entries];
        const entriesForDropOff = updatedEntries.filter(entry => entry.dropOffPoint === dropOffPoint);
        const entry = entriesForDropOff[index];
        
        if (!entry) {
            if (shouldLog(debugFlags, 'haulingMissions', 'statusChanges')) {
                console.log('❌ Toggle Status: Entry not found for index', index, 'and dropOffPoint', dropOffPoint);
            }
            return;
        }
        
        const absoluteIndex = updatedEntries.findIndex(e => e.id === entry.id);
        if (absoluteIndex === -1) {
            if (shouldLog(debugFlags, 'haulingMissions', 'statusChanges')) {
                console.log('❌ Toggle Status: Could not find absolute index for entry', entry);
            }
            return;
        }
        
        // Toggle the status
        const newStatus = updatedEntries[absoluteIndex].status === 'Pending' ? 'Delivered' : 'Pending';
        updatedEntries[absoluteIndex].status = newStatus;
        
        if (shouldLog(debugFlags, 'haulingMissions', 'statusChanges')) {
            console.log('✅ Main Entry Status Update:', {
                id: entry.id,
                from: entry.status,
                to: newStatus,
                isMissionEntry: !!entry.missionIndex
            });
        }
        
        // If this is a mission entry, update the mission entries as well
        if (entry.missionIndex !== undefined) {
            const newMissionEntries = [...missionEntries];
            const missionGroup = newMissionEntries[entry.missionIndex];
            
            if (missionGroup) {
                // Find the corresponding entry in the mission group by matching ID
                const missionEntryIndex = missionGroup.findIndex(e => e.id === entry.id);
                
                if (shouldLog(debugFlags, 'haulingMissions', 'statusChanges')) {
                    console.log('🔍 Mission Entry Search:', {
                        missionIndex: entry.missionIndex,
                        entryId: entry.id,
                        foundIndex: missionEntryIndex,
                        missionGroupSize: missionGroup.length
                    });
                }
                
                if (missionEntryIndex !== -1) {
                    newMissionEntries[entry.missionIndex][missionEntryIndex].status = newStatus;
                    setMissionEntries(newMissionEntries);
                    localStorage.setItem('missionEntries', JSON.stringify(newMissionEntries));
                    
                    if (shouldLog(debugFlags, 'haulingMissions', 'statusChanges')) {
                        console.log('✅ Mission Entry Status Update:', {
                            missionIndex: entry.missionIndex,
                            entryIndex: missionEntryIndex,
                            from: missionGroup[missionEntryIndex].status,
                            to: newStatus
                        });
                    }
                } else {
                    if (shouldLog(debugFlags, 'haulingMissions', 'statusChanges')) {
                        console.log('❌ Mission Entry Not Found:', {
                            missionIndex: entry.missionIndex,
                            entryId: entry.id,
                            missionGroupEntries: missionGroup.map(e => ({
                                id: e.id,
                                status: e.status,
                                dropOffPoint: e.dropOffPoint,
                                commodity: e.commodity
                            }))
                        });
                    }
                }
            } else {
                if (shouldLog(debugFlags, 'haulingMissions', 'statusChanges')) {
                    console.log('❌ Mission Group Not Found:', {
                        missionIndex: entry.missionIndex,
                        availableMissions: newMissionEntries.map((group, idx) => ({
                            index: idx,
                            size: group ? group.length : 0
                        }))
                    });
                }
            }
        }
        
        setEntries(updatedEntries);
        localStorage.setItem('entries', JSON.stringify(updatedEntries));
    };

    const addOCRToManifest = (entries, { missionIndex, reward, missionId } = {}) => {
        console.log('\n=== Starting OCR to Manifest Process ===');
        console.log('Input:', { entries, missionIndex, reward, missionId });
    
        if (!entries || entries.length === 0) {
            console.log('No valid entries to add');
            showBannerMessage('No valid entries to add', false);
            return;
        }
    
        // Check if this mission already exists
        const existingMissionGroup = missionEntries.find(group => 
            group && group.length > 0 && group[0].missionId === missionId
        );
    
        if (existingMissionGroup) {
            console.log('Mission already exists:', missionId);
            showBannerMessage('Mission already added to manifest', false);
            return;
        }
    
        // Format entries with rewards and mission ID
        const formatEntries = (entries, entryIds) => entries.map((entry, index) => {
            const entryReward = entry.reward || reward || '0';
            console.log('Formatting entry with reward:', { entry, entryReward });
            
            return {
                id: entryIds[index],
                commodity: entry.commodity,
                amount: entry.quantity,
                currentAmount: entry.quantity,
                originalAmount: entry.quantity,
                pickup: entry.pickup,
                dropOffPoint: entry.dropoff,
                status: 'Pending',
                isMissionEntry: true,
                missionIndex: missionIndex,
                missionId: missionId, // Add mission ID to each entry
                reward: entryReward
            };
        });
    
        // Create new mission entries
        const entryIds = entries.map(() => crypto.randomBytes(16).toString('hex'));
        const formattedManifestEntries = formatEntries(entries, entryIds);
    
        // Update mission entries
        setMissionEntries(prev => {
            const updated = [...prev];
            // Ensure array is long enough
            while (updated.length <= missionIndex) {
                updated.push(null);
            }
            updated[missionIndex] = formattedManifestEntries;
            console.log('Updated mission entries:', updated);
            localStorage.setItem('missionEntries', JSON.stringify(updated));
            return updated;
        });
    
        // Update main entries
        setEntries(prev => {
            const updated = [...prev, ...formattedManifestEntries];
            console.log('Updated manifest entries:', updated);
            localStorage.setItem('entries', JSON.stringify(updated));
            return updated;
        });
    
        // Update mission rewards
        if (reward) {
            setMissionRewards(prev => {
                const updated = {
                    ...prev,
                    [`mission_${missionIndex}`]: reward
                };
                console.log('Updated mission rewards:', updated);
                localStorage.setItem('missionRewards', JSON.stringify(updated));
                return updated;
            });
        }
    
        console.log('=== Finished OCR to Manifest Process ===\n');
        return missionIndex;
    };
    
    // Update process orders function
    const handleMoveToPayouts = (deliveredEntries) => {
        console.log('\n=== Starting Process Orders ===');
        console.log('Processing entries:', deliveredEntries);
    
        if (!deliveredEntries || deliveredEntries.length === 0) {
            console.log('No entries to process');
            showBannerMessage('No delivered entries to move', false);
            return;
        }
    
        // Group entries by mission
        const entriesByMission = deliveredEntries.reduce((acc, entry) => {
            if (entry.missionIndex !== undefined) {
                const missionKey = `mission_${entry.missionIndex}`;
                if (!acc[missionKey]) {
                    acc[missionKey] = {
                        entries: [],
                        reward: missionRewards[missionKey]
                    };
                }
                acc[missionKey].entries.push(entry);
            }
            return acc;
        }, {});
    
        console.log('Grouped entries by mission:', entriesByMission);
    
        // Format entries for payouts
        const formattedPayoutEntries = Object.entries(entriesByMission).flatMap(([missionKey, { entries, reward }]) => {
            const missionId = crypto.randomBytes(16).toString('hex');
            console.log(`Processing mission ${missionKey} with reward:`, reward);
    
            return entries.map(entry => ({
                id: crypto.randomBytes(16).toString('hex'),
                missionId: missionId,
                commodity: entry.commodity,
                amount: `${entry.currentAmount}/${entry.originalAmount}`,
                pickup: entry.pickup || entry.pickupPoint,
                dropOffPoint: entry.dropOffPoint,
                status: 'Completed',
                date: new Date().toISOString(),
                reward: reward || '0',
                missionIndex: entry.missionIndex,
                originalAmount: entry.originalAmount
            }));
        });
    
        console.log('Formatted payout entries:', formattedPayoutEntries);
    
        // Update payouts state and localStorage
        setPayoutEntries(prev => {
            const updated = [...prev, ...formattedPayoutEntries];
            console.log('Updated payouts:', updated);
            localStorage.setItem('payoutEntries', JSON.stringify(updated));
            return updated;
        });
    
        // Remove processed entries
        setEntries(prev => {
            const remaining = prev.filter(entry => entry.status !== 'Delivered');
            console.log('Remaining entries:', remaining);
            localStorage.setItem('entries', JSON.stringify(remaining));
            return remaining;
        });
    
        console.log('=== Finished Process Orders ===\n');
        showBannerMessage('Entries processed to payouts successfully', true);
    };
    
    // ...existing code...

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

    // Add this with the other state declarations at the top
    const [selectedFont, setSelectedFont] = useState(() => {
        return localStorage.getItem('selectedFont') || 'Orbitron';
    });

    // Add this useEffect to handle font changes
    useEffect(() => {
        document.documentElement.style.setProperty('--main-font', selectedFont);
        localStorage.setItem('selectedFont', selectedFont);
    }, [selectedFont]);

    // Update the handleFontChange function
    const handleFontChange = (font) => {
        setSelectedFont(font);
    };

    // Add with other handlers
    const handleDebugMode = () => {
        setDebugMode(prev => {
            const newValue = !prev;
            localStorage.setItem('debugMode', JSON.stringify(newValue));
            showBannerMessage(
                `Debug mode ${newValue ? 'enabled' : 'disabled'}`,
                true
            );
            return newValue;
        });
    };

    // Add this with the other handlers in the App component
    const handleCommoditySelectChange = (selectedOption) => {
        if (!selectedOption || selectedOption.value.startsWith('--')) return;
        setSelectedCommodity(selectedOption.value);
        localStorage.setItem('selectedCommodity', selectedOption.value);
        if (amountInputRef.current) {
            amountInputRef.current.focus();
            amountInputRef.current.select();
        }
    };

    const addEntry = () => {
        const amountValue = amountInputRef.current.value;

        // Check if amountValue is empty or zero
        if (!amountValue || amountValue <= 0) {
            showBannerMessage('Please enter a valid amount greater than 0.');
            return;
        }

        const newEntry = {
            id: crypto.randomBytes(16).toString('hex'),
            commodity: selectedCommodity,
            amount: amountValue,
            currentAmount: amountValue,
            pickupPoint: firstDropdownValue,
            dropOffPoint: selectedDropOffPoint,
            status: 'Pending',
            timestamp: Date.now()
        };

        console.log('New entry:', newEntry);

        // If a mission is selected, add the mission properties without confirmation
        const selectedMissionIndex = selectedMissions.findIndex(selected => selected);
        if (selectedMissionIndex !== -1) {
            newEntry.isMissionEntry = true;
            newEntry.missionIndex = selectedMissionIndex;
            
            // Update mission entries
            const updatedMissionEntries = [...missionEntries];
            if (!updatedMissionEntries[selectedMissionIndex]) {
                updatedMissionEntries[selectedMissionIndex] = [];
            }
            updatedMissionEntries[selectedMissionIndex].push({
                ...newEntry,
                originalAmount: newEntry.amount
            });
            setMissionEntries(updatedMissionEntries);
            localStorage.setItem('missionEntries', JSON.stringify(updatedMissionEntries));
        }

        const updatedEntries = [...entries, newEntry];
        setEntries(updatedEntries);
        console.log('Storing entries in localStorage:', updatedEntries);
        localStorage.setItem('entries', JSON.stringify(updatedEntries));

        // Reset input fields
        amountInputRef.current.focus();
        amountInputRef.current.select();
        setFirstDropdownValue('');
        setSecondDropdownValue('');
        setSelectedDropOffPoint('');
        setLocationType('planet');
        setSelectedPlanet('');
        setSelectedMoon('');
    };

    function createDateGroup(date) {
        const dateGroup = document.createElement('div');
        dateGroup.className = 'date-group';
        
        const header = document.createElement('h3');
        header.className = 'date-header';
        // Removing the date text content
        header.textContent = '';
        
        dateGroup.appendChild(header);
        return dateGroup;
    }

    // Add this near your event listeners setup
    function setupContextMenus() {
        // Prevent default context menu
        document.addEventListener('contextmenu', (e) => e.preventDefault());

        // Example: Add context menu to hauling mission rows
        document.querySelectorAll('.mission-row').forEach(row => {
            row.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                
                const missionId = row.dataset.missionId;
                contextMenu.show([
                    {
                        label: 'Copy Mission ID',
                        action: () => {
                            navigator.clipboard.writeText(missionId);
                        }
                    },
                    {
                        label: 'View Details',
                        action: () => {
                            // Add your view details logic here
                            showMissionDetails(missionId);
                        }
                    },
                    {
                        label: 'Mark Complete',
                        action: () => {
                            // Add your complete mission logic here
                            completeMission(missionId);
                        }
                    }
                ], e.clientX, e.clientY);
            });
        });
    }

    // Call this after your content is loaded
    setupContextMenus();

    // Function to export payouts to XLS
    function exportPayoutsToXLS() {
        const payoutsData = JSON.parse(localStorage.getItem('payoutEntries')) || [];
        if (payoutsData.length === 0) {
            alert('No payouts data to export.');
            return;
        }

        let xlsData, blob, link;

        xlsData = convertToXLS(payoutsData, 'Payouts');

        blob = new Blob([xlsData], { type: 'application/vnd.ms-excel' });

        link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'payouts.xls';

        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
    }

    // Function to export history to XLS
    function exportHistoryToXLS() {
        const historyData = JSON.parse(localStorage.getItem('historyEntries')) || [];
        if (historyData.length === 0) {
            alert('No history data to export.');
            return;
        }

        let xlsData, blob, link;

        xlsData = convertToXLS(historyData, 'History');

        blob = new Blob([xlsData], { type: 'application/vnd.ms-excel' });

        link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'history.xls';

        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
    }

    // Function to convert JSON data to XLS format
    function convertToXLS(jsonData, dataType) {
        let headers;
        if (dataType === 'Payouts') {
            headers = ['id', 'missionId', 'commodity', 'amount', 'pickup', 'dropOffPoint', 'status', 'date', 'reward', 'missionIndex', 'originalAmount'];
        } else if (dataType === 'History') {
            headers = ['pickup', 'commodity', 'amount', 'dropOffPoint', 'status', 'date', 'reward'];
        } else {
            headers = Object.keys(jsonData[0]);
        }

        const headerRow = headers.join('\t');

        const dataRows = jsonData.map(item => {
            return headers.map(header => {
                let value = item[header];
                if (typeof value === 'object') {
                    value = JSON.stringify(value);
                }
                return value;
            }).join('\t');
        });

        return headerRow + '\n' + dataRows.join('\n');
    }

    // Assuming this is the code that sends the entries from the manifest table to the history table
    const sendEntriesToHistory = (entries) => {
        const historyEntries = entries.map(entry => {
            const qtyString = `${entry.currentAmount}/${entry.originalAmount}`; // Create the combined string
            return {
                pickup: entry.pickup,
                commodity: entry.commodity,
                amount: qtyString, // Send the combined string as "amount"
                dropOffPoint: entry.dropOffPoint,
                status: entry.status,
                date: new Date().toLocaleDateString(),
                reward: entry.reward,
                originalAmount: entry.originalAmount // Keep originalAmount for other calculations if needed
            };
        });

        // Get existing history entries from local storage
        const existingHistoryEntries = JSON.parse(localStorage.getItem('historyEntries')) || [];

        // Add new history entries to existing entries
        const updatedHistoryEntries = [...existingHistoryEntries, ...historyEntries];

        // Save updated history entries to local storage
        localStorage.setItem('historyEntries', JSON.stringify(updatedHistoryEntries));

        // Update the history entries state
        setHistoryEntries(updatedHistoryEntries);
    };

    return (
        <div className={darkMode ? 'dark-mode' : ''}>
            <header>
                <h1 style={{ color: 'var(--title-color)' }}>SC Cargo Tracker</h1>
                <button onClick={toggleAutoScaling}>
                    {isAutoScaling ? 'Disable Auto Scaling' : 'Enable Auto Scaling'}
                </button>
            </header>
            <Tabs
                mainTab={mainTab}
                haulingSubTab={haulingSubTab}
                cargoHoldSubTab={cargoHoldSubTab}
                handleMainTabChange={handleMainTabChange}
                handleTabChange={handleTabChange}
                handleCargoHoldTabChange={handleCargoHoldTabChange}
                handleTooltipClick={tooltip.handleTooltipClick}
            />
            <div className="content">
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
                            <CaptureSubTabHauling 
                                data={data}
                                addOCRToManifest={addOCRToManifest}
                                showBannerMessage={showBannerMessage}
                                hasEntries={hasEntries}
                                setHasEntries={setHasEntries}
                                locationCorrections={locationCorrections}
                                debugMode={debugMode}
                                debugFlags={debugFlags}
                                missionEntries={missionEntries}        // Add these
                                setMissionEntries={setMissionEntries} // two props
                            />
                        )}
                        {haulingSubTab === 'Hauling Missions' && (
                            <MissionSubTabHauling
                                data={data}
                                entries={entries}
                                setEntries={setEntries}
                                selectedMissions={selectedMissions}
                                setSelectedMissions={setSelectedMissions}
                                missionEntries={missionEntries}
                                setMissionEntries={setMissionEntries}
                                selectedDropOffPoint={selectedDropOffPoint}
                                selectedCommodity={selectedCommodity}
                                firstDropdownValue={firstDropdownValue}
                                secondDropdownValue={secondDropdownValue}
                                selectedPlanet={selectedPlanet}
                                selectedMoon={selectedMoon}
                                showBannerMessage={showBannerMessage}
                                STATUS_OPTIONS={STATUS_OPTIONS}
                                customStyles={customStyles}
                                handleCommoditySelectChange={handleCommoditySelectChange}
                                handleSelectChange={handleSelectChange}
                                handleAmountChange={handleAmountChange}
                                handleAmountKeyPress={handleAmountKeyPress}
                                handleTopAmountKeyPress={handleTopAmountKeyPress}
                                toggleCollapse={toggleCollapse}
                                clearLog={clearLog}
                                handlePlanetSelectChange={handlePlanetSelectChange}
                                collapsed={collapsed}
                                isAlternateTable={isAlternateTable}
                                setIsAlternateTable={setIsAlternateTable}
                                collapsedMissions={collapsedMissions}
                                setCollapsedMissions={setCollapsedMissions}
                                missionRewards={missionRewards}
                                setMissionRewards={setMissionRewards}
                                locationType={locationType}
                                setLocationType={setLocationType}
                                setSelectedPlanet={setSelectedPlanet}
                                setSelectedMoon={setSelectedMoon}
                                setSelectedDropOffPoint={setSelectedDropOffPoint}
                                setFirstDropdownValue={setFirstDropdownValue}
                                setSecondDropdownValue={setSecondDropdownValue}
                                planetOptions={planetOptions}
                                stationOptions={stationOptions}
                                commodityOptions={commodityOptions}
                                pickupPointOptions={pickupPointOptions}
                                quickLookupOptions={quickLookupOptions}
                                handleLocationTypeChange={handleLocationTypeChange}
                                handleMoonSelectChange={handleMoonSelectChange}
                                handleStationSelectChange={handleStationSelectChange}
                                handleDropOffSelectChange={handleDropOffSelectChange}
                                handlePickupPointChange={handlePickupPointChange}
                                handleQuickLookupChange={handleQuickLookupChange}
                                updateCargo={updateCargo}
                                removeCargo={removeCargo}
                                moveDropOffPoint={moveDropOffPoint}
                                markAsDelivered={markAsDelivered}
                                toggleStatus={toggleStatus}
                                setPayoutEntries={setPayoutEntries}
                                handleMoveToPayouts={handleMoveToPayouts}
                                calculateTotalSCU={calculateTotalSCU}
                                amountInputRef={amountInputRef}
                                sendEntriesToHistory={sendEntriesToHistory}
                                setHistoryEntries={setHistoryEntries}
                            />
                        )}
                        {haulingSubTab === 'History' && (
                            <HistorySubTabHauling
                                historyEntries={historyEntries}
                                collapsed={collapsed}
                                toggleCollapse={toggleCollapse}
                            />
                        )}
                        {haulingSubTab === 'Payouts' && (
                            <HaulingSubTabPayouts
                                entries={payoutEntries}
                                setEntries={setPayoutEntries}
                            />
                        )}
                        {haulingSubTab === 'Route Planner' && (
                            <RoutePlannerSubTabHauling
                                data={data}
                                showBannerMessage={showBannerMessage}
                            />
                        )}
                    </>
                )}
                {mainTab === 'Mining' && (
                    <div>Mining functionality coming soon...</div>
                )}
                {mainTab === 'Preferences' && (
                    <PreferencesTab
                        dropdownLabelColor={dropdownLabelColor}
                        dropdownTextColor={dropdownTextColor}
                        buttonColor={buttonColor}
                        titleColor={titleColor}
                        dropOffHeaderTextColor={dropOffHeaderTextColor}
                        rowTextColor={rowTextColor}
                        tableHeaderTextColor={tableHeaderTextColor}
                        missionTextColor={missionTextColor}
                        tableOutlineColor={tableOutlineColor}
                        selectedFont={selectedFont}
                        debugMode={debugMode}
                        needsHistoryClearConfirmation={needsHistoryClearConfirmation}
                        setDropdownLabelColor={setDropdownLabelColor}
                        setDropdownTextColor={setDropdownTextColor}
                        setButtonColor={setButtonColor}
                        setTitleColor={setTitleColor}
                        setDropOffHeaderTextColor={setDropOffHeaderTextColor}
                        setRowTextColor={setRowTextColor}
                        setTableHeaderTextColor={setTableHeaderTextColor}
                        setMissionTextColor={setMissionTextColor}
                        setTableOutlineColor={setTableOutlineColor}
                        setSelectedFont={setSelectedFont}
                        handleDebugMode={handleDebugMode}
                        handleImport={handleImport}
                        handleExport={handleExport}
                        clearHistoryLogDebug={clearHistoryLogDebug}
                        handleFontChange={handleFontChange}
                        exportHistoryToXLS={exportHistoryToXLS}
                        exportPayoutsToXLS={exportPayoutsToXLS}
                    />
                )}
                {mainTab === 'Changelog' && (
                    <ChangelogTab />
                )}
                {mainTab === 'Cargo Hold' && (
                    <>
                        {cargoHoldSubTab === 'Inventory' && (
                            <div className="inventory-tab">
                                <h3>Inventory</h3>
                                {/* Add inventory content here */}
                                <div>Inventory functionality coming soon...</div>
                            </div>
                        )}
                        {cargoHoldSubTab === 'Ships' && (
                            <div className="ships-tab">
                                <h3>Ships</h3>
                                {/* Add ships content here */}
                                <div>Ships functionality coming soon...</div>
                            </div>
                        )}
                        {cargoHoldSubTab === 'Storage' && (
                            <div className="storage-tab">
                                <h3>Storage</h3>
                                {/* Add storage content here */}
                                <div>Storage functionality coming soon...</div>
                            </div>
                        )}
                    </>
                )}
                {mainTab === 'Debug Options' && debugMode && (
                    <DebugOptions 
                        debugFlags={debugFlags}
                        setDebugFlags={setDebugFlags}
                    />
                )}
            </div>
            {showDebugPopup && debugMode && (
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
            <TooltipPopup {...tooltip} />
            {debugMode && (
                <div className="debug-options-box">
                    <div className="tab" onClick={() => handleMainTabChange('Debug Options')}>
                        Debug Options
                    </div>
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