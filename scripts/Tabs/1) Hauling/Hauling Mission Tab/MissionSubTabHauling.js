import React, { useState, useRef, useEffect, useCallback } from 'react';
import Select from 'react-select';
import { logAddEntry, logProcessOrders, logMissionGrouping, logStatusChange } from '../../7) Debug Options/HaulingDebugLogs';
import crypto from 'crypto';
import { generateLocationLists as generateStantonLocations } from '../../../../Location data/Stanton System/Location Data/Const Data Stanton.js';
import StantonSystemData from '../../../../Location data/Stanton System/Location Data/Const Data Stanton.js';
import { PyroSystemData } from '../../../../Location data/Pyro System/Location Data/Const Data Pyro.js';

// Add system data mapping
const systemDataMap = {
    'Stanton': StantonSystemData,
    'Pyro': PyroSystemData
};

// Update the pickup point options generation
const pickupPointOptions = (selectedSystem) => {
    const systemData = systemDataMap[selectedSystem] || StantonSystemData;
    return systemData.FullList
        .filter(location => !location.startsWith('--') && !location.endsWith('--'))
        .map(location => ({
            value: location,
            label: location
        }));
};

// Update the quick lookup options generation
const quickLookupOptions = (selectedSystem) => {
    const systemData = systemDataMap[selectedSystem] || StantonSystemData;
    return systemData.FullList
        .filter(location => !location.startsWith('--') && !location.endsWith('--'))
        .map(location => ({
            value: location,
            label: location
        }));
};

// Add this function near the top of the file, after the systemDataMap declaration
const validatePickupPoint = (location, selectedSystem) => {
    const systemData = systemDataMap[selectedSystem] || StantonSystemData;
    
    // Check if the location exists in the system's FullList
    const isValid = systemData.FullList.includes(location) && 
                   !location.startsWith('--') && 
                   !location.endsWith('--');
    
    return {
        isValid,
        message: isValid ? '' : `Warning: "${location}" is not a recognized location in the ${selectedSystem} system`
    };
};

export const MissionSubTabHauling = ({
    data,
    entries,
    setEntries,
    selectedMissions,
    setSelectedMissions,
    missionEntries,
    setMissionEntries,
    selectedDropOffPoint,
    selectedCommodity,
    firstDropdownValue,
    secondDropdownValue,
    selectedPlanet,
    selectedMoon,
    showBannerMessage,
    // Add missing props
    STATUS_OPTIONS,
    customStyles,
    handleCommoditySelectChange,
    handleSelectChange,
    handleAmountKeyPress,
    handleTopAmountKeyPress,
    toggleCollapse,
    clearLog,
    handlePlanetSelectChange,
    collapsed,
    isAlternateTable,
    setIsAlternateTable,
    collapsedMissions,
    setCollapsedMissions,
    missionRewards,
    setMissionRewards,
    locationType,
    setLocationType,
    setSelectedPlanet,
    setSelectedMoon,
    setSelectedDropOffPoint,
    setFirstDropdownValue,
    setSecondDropdownValue,
    planetOptions,
    stationOptions,
    commodityOptions,
    handleLocationTypeChange,
    handleMoonSelectChange,
    handleStationSelectChange,
    handleDropOffSelectChange,
    handlePickupPointChange,
    handleQuickLookupChange,
    updateCargo,
    removeCargo,
    moveDropOffPoint,
    markAsDelivered,
    debugFlags,
    setPayoutEntries,
    calculateTotalSCU,
    amountInputRef,
    setHistoryEntries,
    addOCRToManifest,
    selectedSystem = 'Stanton', // Add default value
    currentSystem,
    handleSystemChange,
    lockedMissionIndex, // Add this
}) => {
    // Local state
    const [needsClearConfirmation, setNeedsClearConfirmation] = useState(false);
    const [autoMissionAllocation, setAutoMissionAllocation] = useState(() => {
        const saved = localStorage.getItem('autoMissionAllocation');
        return saved !== null ? JSON.parse(saved) : true;
    });
    const [isSettingKey, setIsSettingKey] = useState(false);

    const [nextMissionHotkey, setNextMissionHotkey] = useState(() => {
        const savedHotkey = localStorage.getItem('nextMissionHotkey');
        return savedHotkey || 'N'; // Default to 'n'
    });

    // Add state for popup visibility
    const [showRoutePlanner, setShowRoutePlanner] = useState(false);

    // Add new state for route planner
    const [routePresets, setRoutePresets] = useState(() => {
        const savedPresets = localStorage.getItem('routePresets');
        return savedPresets ? JSON.parse(savedPresets) : [];
    });
    const [selectedPreset, setSelectedPreset] = useState(() => {
        const savedPreset = localStorage.getItem('selectedPreset');
        return savedPreset ? JSON.parse(savedPreset) : null;
    });
    const [showSavePresetPopup, setShowSavePresetPopup] = useState(false);
    const [presetName, setPresetName] = useState('');
    const [showLoadConfirmation, setShowLoadConfirmation] = useState(false);

    // Add new state for active route
    const [activeRoute, setActiveRoute] = useState(() => {
        const savedActiveRoute = localStorage.getItem('activeRoute');
        return savedActiveRoute ? JSON.parse(savedActiveRoute) : null;
    });

    // Add new state for delete confirmation
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

    // Add new state for advanced view
    const [showAdvancedView, setShowAdvancedView] = useState(false);

    // Add new state for search term
    const [searchTerm, setSearchTerm] = useState('');

    // Add new state to track the active route checkbox state
    const [savedActiveRouteState, setSavedActiveRouteState] = useState(null);

    // Add new state for advanced view entries
    const [advancedViewEntries, setAdvancedViewEntries] = useState([]);

    // Add new state for advanced view save popup
    const [showAdvancedSavePopup, setShowAdvancedSavePopup] = useState(false);

    // Add new state variables
    const [basicSelectedPreset, setBasicSelectedPreset] = useState(null);
    const [advancedSelectedPreset, setAdvancedSelectedPreset] = useState(null);

    // Add this state near the other state declarations
    const [showClearConfirmation, setShowClearConfirmation] = useState(false);

    // Add new state for selected system in advanced view
    const [advancedSelectedSystem, setAdvancedSelectedSystem] = useState('Stanton');

    // Add effect to save state changes
    useEffect(() => {
        localStorage.setItem('autoMissionAllocation', JSON.stringify(autoMissionAllocation));
    }, [autoMissionAllocation]);

    useEffect(() => {
        localStorage.setItem('nextMissionHotkey', nextMissionHotkey);
    }, [nextMissionHotkey]);

    // Add effect to save route presets to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('routePresets', JSON.stringify(routePresets));
    }, [routePresets]);

    // Add effects to save selected preset and active route to localStorage
    useEffect(() => {
        if (selectedPreset) {
            localStorage.setItem('selectedPreset', JSON.stringify(selectedPreset));
        } else {
            localStorage.removeItem('selectedPreset');
        }
    }, [selectedPreset]);

    useEffect(() => {
        if (activeRoute) {
            localStorage.setItem('activeRoute', JSON.stringify(activeRoute));
        } else {
            localStorage.removeItem('activeRoute');
        }
    }, [activeRoute]);

    // Update the useEffect hook that handles active route ordering
    useEffect(() => {
        if (activeRoute) {
            // Create a map of existing entries by drop-off point
            const entriesByDropOff = entries.reduce((acc, entry) => {
                if (!acc[entry.dropOffPoint]) {
                    acc[entry.dropOffPoint] = [];
                }
                acc[entry.dropOffPoint].push(entry);
                return acc;
            }, {});

            // Reorder entries based on the saved order, preserving existing entries
            const orderedEntries = activeRoute.dropOffOrder.flatMap(dropOffPoint => {
                if (entriesByDropOff[dropOffPoint]) {
                    return entriesByDropOff[dropOffPoint];
                }
                return [];
            });

            // Add any remaining drop-off points that weren't in the preset
            const remainingDropOffs = Object.keys(entriesByDropOff).filter(
                dropOffPoint => !activeRoute.dropOffOrder.includes(dropOffPoint)
            );

            const remainingEntries = remainingDropOffs.flatMap(dropOffPoint => 
                entriesByDropOff[dropOffPoint]
            );

            // Combine the ordered entries with the remaining entries
            const finalEntries = [...orderedEntries, ...remainingEntries];

            // Only update if the order has actually changed
            if (JSON.stringify(finalEntries) !== JSON.stringify(entries)) {
                setEntries(finalEntries);
                localStorage.setItem('entries', JSON.stringify(finalEntries));
            }
        }
    }, [entries, activeRoute]);

    // Add this useEffect hook near the other useEffect hooks
    useEffect(() => {
        // Check basic selected preset
        if (basicSelectedPreset && !routePresets.some(preset => preset.value === basicSelectedPreset.value)) {
            setBasicSelectedPreset(null);
        }
        
        // Check advanced selected preset
        if (advancedSelectedPreset && !routePresets.some(preset => preset.value === advancedSelectedPreset.value)) {
            setAdvancedSelectedPreset(null);
        }
        
        // Check active route
        if (activeRoute && !routePresets.some(preset => preset.value === activeRoute.value)) {
            setActiveRoute(null);
        }
    }, [routePresets, basicSelectedPreset, advancedSelectedPreset, activeRoute]);

    const handleCheckboxChange = (index) => {
        setSelectedMissions(prev => {
            // Create a new array with all checkboxes unselected
            const updated = Array(prev.length).fill(false);
            // Set only the clicked checkbox to true
            updated[index] = !prev[index];
            localStorage.setItem('selectedMissions', JSON.stringify(updated));
            return updated;
        });
    };

    const addEntry = () => {
        logAddEntry(debugFlags, 'Adding new entry', {
            commodity: selectedCommodity,
            amount: document.querySelector('.amount-input').value,
            dropOffPoint: selectedDropOffPoint
        });
        const amountValue = document.querySelector('.amount-input').value;
        if (!selectedDropOffPoint) {
            showBannerMessage('Please select a drop-off point or station.');
            return;
        }
        if (!amountValue || amountValue <= 0) {
            showBannerMessage('Please enter a valid amount greater than 0.');
            return;
        }

        let selectedMissionIndex = null;
        let isMissionEntry = false;

        if (autoMissionAllocation) {
            // Use lockedMissionIndex if available, otherwise find next available
            if (lockedMissionIndex.current !== null) {
                selectedMissionIndex = lockedMissionIndex.current;
            } else {
                selectedMissionIndex = missionEntries.findIndex(mission => !mission || mission.length === 0);
            }

            // If no available missions, create a new one (up to a limit)
            if (selectedMissionIndex === -1 && missionEntries.length < 20) {
                selectedMissionIndex = missionEntries.length;
            }

            if (selectedMissionIndex === -1) {
                showBannerMessage('No available missions. Please clear a mission or disable automatic allocation.');
                return;
            }
            isMissionEntry = true;

            // If a new mission is being used, lock it
            if (lockedMissionIndex.current === null) {
                lockedMissionIndex.current = selectedMissionIndex;
            }
        } else {
            // Manual mode: Only set as mission entry if a checkbox is selected
            selectedMissionIndex = selectedMissions.findIndex(mission => mission);
            isMissionEntry = selectedMissionIndex !== -1;
        }

        const newEntry = {
            id: `entry_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            missionIndex: isMissionEntry ? selectedMissionIndex : null,
            dropOffPoint: selectedDropOffPoint,
            commodity: selectedCommodity,
            originalAmount: amountValue,
            currentAmount: amountValue,
            status: STATUS_OPTIONS[0],
            pickupPoint: firstDropdownValue,
            pickup: firstDropdownValue,
            planet: selectedPlanet,
            moon: selectedMoon,
            isMissionEntry,
            timestamp: Date.now()
        };

        // If active route is checked, reorder the entries first
        if (activeRoute) {
            // Create a map of existing entries by drop-off point
            const entriesByDropOff = entries.reduce((acc, entry) => {
                if (!acc[entry.dropOffPoint]) {
                    acc[entry.dropOffPoint] = [];
                }
                acc[entry.dropOffPoint].push(entry);
                return acc;
            }, {});

            // Add the new entry to its drop-off point group
            if (!entriesByDropOff[selectedDropOffPoint]) {
                entriesByDropOff[selectedDropOffPoint] = [];
            }
            entriesByDropOff[selectedDropOffPoint].push(newEntry);

            // Reorder entries based on the saved order, preserving existing entries
            const orderedEntries = activeRoute.dropOffOrder.flatMap(dropOffPoint => {
                if (entriesByDropOff[dropOffPoint]) {
                    return entriesByDropOff[dropOffPoint];
                }
                return [];
            });

            // Add any remaining drop-off points that weren't in the preset
            const remainingDropOffs = Object.keys(entriesByDropOff).filter(
                dropOffPoint => !activeRoute.dropOffOrder.includes(dropOffPoint)
            );

            const remainingEntries = remainingDropOffs.flatMap(dropOffPoint => 
                entriesByDropOff[dropOffPoint]
            );

            // Combine the ordered entries with the remaining entries
            const finalEntries = [...orderedEntries, ...remainingEntries];

            // Update the entries with the new order
            setEntries(finalEntries);
            localStorage.setItem('entries', JSON.stringify(finalEntries));
        } else {
            // If no active route, just add the new entry
            setEntries(prevEntries => {
                const updatedEntries = [...prevEntries, newEntry];
                localStorage.setItem('entries', JSON.stringify(updatedEntries));
                return updatedEntries;
            });
        }

        if (isMissionEntry) {
            setMissionEntries(prev => {
                const updated = [...prev];
                if (!updated[selectedMissionIndex]) {
                    updated[selectedMissionIndex] = [];
                }
                updated[selectedMissionIndex] = [...updated[selectedMissionIndex], { ...newEntry }];
                localStorage.setItem('missionEntries', JSON.stringify(updated));
                return updated;
            });
        }

        if (amountInputRef.current) {
            amountInputRef.current.focus();
            amountInputRef.current.select();
        }
    };

    // Helper function to find the next available mission index
    const getNextAvailableMissionIndex = () => {
        const nextIndex = missionEntries.findIndex(mission => !mission || mission.length === 0);
         // If all missions are full, but we haven't reached the limit, return the next index
        if (nextIndex === -1 && missionEntries.length < 20) {
            return missionEntries.length;
        }
        return nextIndex; // Return -1 if all missions are full AND we reached the limit
    };

    // Function to unlock the mission
    const unlockMission = () => {
        lockedMissionIndex.current = null;
        forceUpdate();
    };

    const toggleMissionCollapse = (index) => {
        setCollapsedMissions(prev => {
            const updated = [...prev];
            updated[index] = !updated[index];
            localStorage.setItem('collapsedMissions', JSON.stringify(updated));
            return updated;
        });
    };

    const handleRewardChange = (missionId, value) => {
        const numericValue = value.replace(/\D/g, '');
        const formattedValue = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        
        setMissionRewards(prev => {
            const updated = {
                ...prev,
                [missionId]: formattedValue
            };
            localStorage.setItem('missionRewards', JSON.stringify(updated));
            return updated;
        });
    };

    const getMissionPreview = (missionIndex) => {
        const missionEntriesForIndex = missionEntries[missionIndex];
        
        if (!missionEntriesForIndex) return null;

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

    const formatAmount = (current, original) => {
        if (!original) return null;
        
        const currentNum = Number(current) || 0;
        const originalNum = Number(original);
        
        return `${currentNum}/${originalNum}`;
    };

    // --- New: Simulate "Next Mission" Click ---
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key.toUpperCase() === nextMissionHotkey.toUpperCase() && autoMissionAllocation) {
                unlockMission();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [nextMissionHotkey, autoMissionAllocation]);

    const handleHotkeyChange = (event) => {
        setNextMissionHotkey(event.target.value);
    };
    // --- End New ---

    const handleSetKeyClick = () => {
        setIsSettingKey(true);
        const handleKeyDown = (event) => {
            event.preventDefault(); // Prevent the default action
            const newHotkey = event.key;
            localStorage.setItem('nextMissionHotkey', newHotkey);
            setNextMissionHotkey(newHotkey);
            setIsSettingKey(false);
            window.removeEventListener('keydown', handleKeyDown);
        };

        window.addEventListener('keydown', handleKeyDown, { once: true });
    };

    // Modify the handleClearLog function
    const handleClearLog = () => {
        setShowClearConfirmation(true);
    };

    // Function to force a re-render of the component
    const [, updateState] = useState();
    const forceUpdate = useCallback(() => updateState({}), []);

    const addToHistoryFromManifest = () => {
        // Get all delivered entries from manifest, only check delivery status
        const deliveredEntries = entries.filter(entry => 
            entry.status === 'Delivered'
        );

        console.log('All entries:', entries);
        console.log('Delivered entries:', deliveredEntries);
        console.log('Entry statuses:', entries.map(e => ({
            status: e.status,
            id: e.id
        })));

        if (deliveredEntries.length === 0) {
            showBannerMessage('No delivered entries to process');
            return;
        }

        // Format entries for history, ensuring status is properly set
        const historyEntries = deliveredEntries.map(entry => {
            // Calculate delivery percentage
            const current = Number(entry.currentAmount) || 0;
            const original = Number(entry.originalAmount) || 0;
            const deliveryPercentage = original > 0 ? (current / original) * 100 : 0;

            // Determine status based on delivery percentage
            const status = deliveryPercentage < 49 ? 'Failed' : 'Delivered';

            return {
                pickup: entry.pickup || entry.pickupPoint,
                commodity: entry.commodity,
                currentAmount: entry.currentAmount,
                originalAmount: entry.originalAmount,
                dropOffPoint: entry.dropOffPoint,
                status: status,
                date: new Date().toISOString(),
                planet: entry.planet,
                moon: entry.moon
            };
        });

        // Get existing history entries
        const existingHistory = JSON.parse(localStorage.getItem('historyEntries')) || [];
        
        // Combine with new entries
        const updatedHistory = [...existingHistory, ...historyEntries];
        
        // Update history state and localStorage
        setHistoryEntries(updatedHistory);
        localStorage.setItem('historyEntries', JSON.stringify(updatedHistory));

        // Remove processed entries from manifest, only check delivery status
        const remainingEntries = entries.filter(entry => 
            entry.status !== 'Delivered'
        );
        setEntries(remainingEntries);
        localStorage.setItem('entries', JSON.stringify(remainingEntries));

        showBannerMessage('Entries processed to history successfully');

        // After processing manifest entries, call the mission processing function
        addMissionEntriesToPayouts();
    };

    const generateUUID = () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };

    const addMissionEntriesToPayouts = () => {
        // Get all delivered mission entries
        const deliveredMissionEntries = entries.filter(entry => 
            entry.status === 'Delivered' && entry.isMissionEntry
        );

        if (deliveredMissionEntries.length === 0) {
            console.log('No mission entries to process');
            return;
        }

        // Group entries by mission index
        const entriesByMission = deliveredMissionEntries.reduce((acc, entry) => {
            const missionIndex = entry.missionIndex;
            if (!acc[missionIndex]) {
                acc[missionIndex] = [];
            }
            acc[missionIndex].push(entry);
            return acc;
        }, {});

        console.log('Grouped Mission Entries:', entriesByMission);

        // Format entries for payouts
        const formattedPayoutEntries = Object.entries(entriesByMission).map(([missionIndex, missionEntries]) => {
            // Generate a single missionId for the entire group
            const missionId = generateUUID();
            return missionEntries.map(entry => {
                // Calculate delivery percentage
                const current = Number(entry.currentAmount) || 0;
                const original = Number(entry.originalAmount) || 0;
                const deliveryPercentage = original > 0 ? ((current / original) * 100).toFixed(2) : '0';

                return {
                    id: generateUUID(),
                    missionId: missionId, // Use the same missionId for all entries in this group
                    commodity: entry.commodity,
                    amount: `${entry.currentAmount}/${entry.originalAmount}`,
                    pickup: entry.pickup || entry.pickupPoint,
                    dropOffPoint: entry.dropOffPoint,
                    status: 'Completed',
                    date: new Date().toISOString(),
                    reward: missionRewards[`mission_${entry.missionIndex}`] || '0',
                    missionIndex: entry.missionIndex,
                    originalAmount: entry.originalAmount,
                    currentAmount: entry.currentAmount,
                    percentage: deliveryPercentage // Add percentage to payout entry
                };
            });
        }).flat();

        console.log('Formatted Payout Entries:', formattedPayoutEntries);

        // Get existing payouts
        const existingPayouts = JSON.parse(localStorage.getItem('payoutEntries')) || [];
        console.log('Existing Payouts:', existingPayouts);
        
        // Combine with new entries
        const updatedPayouts = [...existingPayouts, ...formattedPayoutEntries];
        console.log('Updated Payouts:', updatedPayouts);
        
        // Ensure unique mission names
        const uniquePayouts = updatedPayouts.map((entry, index, array) => {
            let missionName = `Mission ${entry.missionIndex + 1}`;
            let count = 1;
            while (array.some(e => e !== entry && e.missionId === entry.missionId && e.missionName === missionName)) {
                missionName = `Mission ${entry.missionIndex + 1} (${count++})`
            }
            return { ...entry, missionName };
        });

        // Update both localStorage AND state
        localStorage.setItem('payoutEntries', JSON.stringify(uniquePayouts));
        setPayoutEntries(uniquePayouts); // Update state

        // Update mission entries state
        setMissionEntries(prevMissionEntries => {
            const updatedMissionEntries = prevMissionEntries.map(mission => {
                if (!mission) return mission;
                return mission.filter(entry => !deliveredMissionEntries.find(de => de.id === entry.id));
            });
            localStorage.setItem('missionEntries', JSON.stringify(updatedMissionEntries));
            return updatedMissionEntries;
        });

        // Clear rewards for processed missions
        const updatedRewards = { ...missionRewards };
        Object.keys(entriesByMission).forEach(missionIndex => {
            delete updatedRewards[`mission_${missionIndex}`];
        });
        setMissionRewards(updatedRewards);
        localStorage.setItem('missionRewards', JSON.stringify(updatedRewards));

        showBannerMessage('Mission entries processed to payouts successfully');
    };

    // Update the useEffect hook that handles active route ordering
    useEffect(() => {
        if (activeRoute) {
            // Create a map of existing entries by drop-off point
            const entriesByDropOff = entries.reduce((acc, entry) => {
                if (!acc[entry.dropOffPoint]) {
                    acc[entry.dropOffPoint] = [];
                }
                acc[entry.dropOffPoint].push(entry);
                return acc;
            }, {});

            // Reorder entries based on the saved order, preserving existing entries
            const orderedEntries = activeRoute.dropOffOrder.flatMap(dropOffPoint => {
                if (entriesByDropOff[dropOffPoint]) {
                    return entriesByDropOff[dropOffPoint];
                }
                return [];
            });

            // Add any remaining drop-off points that weren't in the preset
            const remainingDropOffs = Object.keys(entriesByDropOff).filter(
                dropOffPoint => !activeRoute.dropOffOrder.includes(dropOffPoint)
            );

            const remainingEntries = remainingDropOffs.flatMap(dropOffPoint => 
                entriesByDropOff[dropOffPoint]
            );

            // Combine the ordered entries with the remaining entries
            const finalEntries = [...orderedEntries, ...remainingEntries];

            // Only update if the order has actually changed
            if (JSON.stringify(finalEntries) !== JSON.stringify(entries)) {
                setEntries(finalEntries);
                localStorage.setItem('entries', JSON.stringify(finalEntries));
            }
        }
    }, [entries, activeRoute]);

    // Update the loadPreset function
    const loadPreset = () => {
        const preset = routePresets.find(p => p.value === selectedPreset.value);
        if (!preset) return;
        
        // Create a map of existing entries by drop-off point
        const entriesByDropOff = entries.reduce((acc, entry) => {
            if (!acc[entry.dropOffPoint]) {
                acc[entry.dropOffPoint] = [];
            }
            acc[entry.dropOffPoint].push(entry);
            return acc;
        }, {});
        
        // Reorder entries based on the saved order, preserving existing entries
        const orderedEntries = preset.dropOffOrder.flatMap(dropOffPoint => {
            if (entriesByDropOff[dropOffPoint]) {
                return entriesByDropOff[dropOffPoint];
            }
            return []; // Skip if drop-off point doesn't exist
        });
        
        // Add any remaining drop-off points that weren't in the preset
        const remainingDropOffs = Object.keys(entriesByDropOff).filter(
            dropOffPoint => !preset.dropOffOrder.includes(dropOffPoint)
        );
        
        const remainingEntries = remainingDropOffs.flatMap(dropOffPoint => 
            entriesByDropOff[dropOffPoint]
        );
        
        // Combine the ordered entries with the remaining entries
        const finalEntries = [...orderedEntries, ...remainingEntries];
        
        // Update the entries with the new order
        setEntries(finalEntries);
        localStorage.setItem('entries', JSON.stringify(finalEntries));
        
        setShowLoadConfirmation(false);
    };

    // Add this function back in, right before the handleSavePreset function
    const handleLoadPreset = () => {
        if (!selectedPreset) {
            showBannerMessage('Please select a preset to load');
            return;
        }
        setShowLoadConfirmation(true);
    };

    // Keep the existing handleSavePreset function
    const handleSavePreset = () => {
        if (presetName.trim() === '') {
            showBannerMessage('Please enter a name for the preset');
            return;
        }

        // Check if we're overwriting an existing preset
        const existingPreset = routePresets.find(preset => preset.label.toLowerCase() === presetName.toLowerCase());
        if (existingPreset) {
            if (!window.confirm(`A preset with this name already exists. Do you want to overwrite it?`)) {
                return;
            }
        }

        // Get current order of drop-off points
        const dropOffOrder = entries.reduce((acc, entry) => {
            if (!acc.includes(entry.dropOffPoint)) {
                acc.push(entry.dropOffPoint);
            }
            return acc;
        }, []);
        
        const newPreset = {
            value: presetName.toLowerCase().replace(/\s+/g, '-'),
            label: presetName,
            dropOffOrder: dropOffOrder,
            timestamp: Date.now()
        };
        
        setRoutePresets(prev => {
            // If overwriting, remove the old preset first
            const updated = prev.filter(preset => preset.label.toLowerCase() !== presetName.toLowerCase());
            return [...updated, newPreset];
        });
        
        // Set the newly saved preset as active
        setBasicSelectedPreset(newPreset);
        setSelectedPreset(newPreset);
        if (activeRoute) {
            setActiveRoute(newPreset);
        }
        
        setShowSavePresetPopup(false);
        setPresetName('');
    };

    // Update the preset selection handler
    const handlePresetSelect = (selected, isAdvancedView) => {
        // Verify the selected preset still exists
        const presetExists = routePresets.some(preset => preset.value === selected?.value);
        
        if (isAdvancedView) {
            setAdvancedSelectedPreset(presetExists ? selected : null);
            
            // Update advanced view entries based on the selected preset
            if (presetExists && selected) {
                const newEntries = selected.dropOffOrder.map(dropOffPoint => ({
                    id: `entry_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                    dropOffPoint,
                    commodity: selectedCommodity,
                    originalAmount: 1,
                    currentAmount: 1,
                    status: STATUS_OPTIONS[0],
                    isMissionEntry: false,
                    timestamp: Date.now()
                }));
                setAdvancedViewEntries(newEntries);
            }
        } else {
            // Store the current active route state
            const wasActiveRoute = !!activeRoute;
            
            // Temporarily disable active route
            if (wasActiveRoute) {
                setActiveRoute(null);
            }
            
            // Update the selected preset
            setBasicSelectedPreset(presetExists ? selected : null);
            setSelectedPreset(presetExists ? selected : null);
            
            // If active route was previously enabled, re-enable it after a short delay
            if (wasActiveRoute && selected) {
                setTimeout(() => {
                    setActiveRoute(selected);
                    
                    // Reorder entries based on the new preset
        const entriesByDropOff = entries.reduce((acc, entry) => {
            if (!acc[entry.dropOffPoint]) {
                acc[entry.dropOffPoint] = [];
            }
            acc[entry.dropOffPoint].push(entry);
            return acc;
        }, {});
        
                    const orderedEntries = selected.dropOffOrder.flatMap(dropOffPoint => {
            if (entriesByDropOff[dropOffPoint]) {
                return entriesByDropOff[dropOffPoint];
            }
                        return [];
        });
        
        const remainingDropOffs = Object.keys(entriesByDropOff).filter(
                        dropOffPoint => !selected.dropOffOrder.includes(dropOffPoint)
        );
        
        const remainingEntries = remainingDropOffs.flatMap(dropOffPoint => 
            entriesByDropOff[dropOffPoint]
        );
        
        const finalEntries = [...orderedEntries, ...remainingEntries];
        
        setEntries(finalEntries);
        localStorage.setItem('entries', JSON.stringify(finalEntries));
                }, 100); // Short delay to ensure state updates properly
            }
        }
    };

    // Update the active route checkbox handler
    const handleActiveRouteChange = (e) => {
        if (e.target.checked) {
            setActiveRoute(selectedPreset);
        } else {
            setActiveRoute(null);
        }
    };

    // Modify the handleDeletePreset function
    const handleDeletePreset = () => {
        const presetToDelete = showAdvancedView ? advancedSelectedPreset : basicSelectedPreset;
        if (!presetToDelete) {
            showBannerMessage('Please select a preset to delete');
            return;
        }
        setShowDeleteConfirmation(true);
    };

    const confirmDeletePreset = () => {
        const presetToDelete = showAdvancedView ? advancedSelectedPreset : basicSelectedPreset;
        if (!presetToDelete) return;

        setRoutePresets(prev => prev.filter(preset => preset.value !== presetToDelete.value));
        
        if (activeRoute?.value === presetToDelete.value) {
            setActiveRoute(null);
        }

        if (showAdvancedView) {
            setAdvancedSelectedPreset(null);
            setAdvancedViewEntries([]);
        } else {
            setBasicSelectedPreset(null);
        }
        
        setShowDeleteConfirmation(false);
    };

    // Modify the handleAddDropOffPoint function to handle deletion of advanced view entries
    const handleAddDropOffPoint = (dropOffPoint, planet, moon) => {
        if (showAdvancedView) {
            const existingEntryIndex = advancedViewEntries.findIndex(entry => entry.dropOffPoint === dropOffPoint);
            
            if (existingEntryIndex !== -1) {
                // Remove the entry if it already exists
                setAdvancedViewEntries(prevEntries => 
                    prevEntries.filter((_, index) => index !== existingEntryIndex)
                );
            } else {
                // Add new entry if it doesn't exist
                const newEntry = {
                    id: `entry_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                    missionIndex: null,
                    dropOffPoint: dropOffPoint,
                    commodity: selectedCommodity,
                    originalAmount: 1,
                    currentAmount: 1,
                    status: STATUS_OPTIONS[0],
                    pickupPoint: firstDropdownValue,
                    pickup: firstDropdownValue,
                    planet: planet,
                    moon: moon,
                    isMissionEntry: false,
                    timestamp: Date.now()
                };

                setAdvancedViewEntries(prevEntries => [...prevEntries, newEntry]);
            }
        } else {
            // Existing code for main manifest entries
            const existingEntryIndex = entries.findIndex(entry => entry.dropOffPoint === dropOffPoint);
            
            if (existingEntryIndex !== -1) {
                setEntries(prevEntries => {
                    const updatedEntries = prevEntries.filter((_, index) => index !== existingEntryIndex);
                    localStorage.setItem('entries', JSON.stringify(updatedEntries));
                    return updatedEntries;
                });
            } else {
                const newEntry = {
                    id: `entry_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                    missionIndex: null,
                    dropOffPoint: dropOffPoint,
                    commodity: selectedCommodity,
                    originalAmount: 1,
                    currentAmount: 1,
                    status: STATUS_OPTIONS[0],
                    pickupPoint: firstDropdownValue,
                    pickup: firstDropdownValue,
                    planet: planet,
                    moon: moon,
                    isMissionEntry: false,
                    timestamp: Date.now()
                };

                setEntries(prevEntries => {
                    const updatedEntries = [...prevEntries, newEntry];
                    localStorage.setItem('entries', JSON.stringify(updatedEntries));
                    return updatedEntries;
                });
            }
        }
    };

    // Add this near the other button handlers
    const handleAdvancedSave = () => {
        if (presetName.trim() === '') {
            showBannerMessage('Please enter a name for the preset');
            return;
        }

        // Get current order of drop-off points from advanced view
        const dropOffOrder = advancedViewEntries.reduce((acc, entry) => {
            if (!acc.includes(entry.dropOffPoint)) {
                acc.push(entry.dropOffPoint);
            }
            return acc;
        }, []);

        const newPreset = {
            value: presetName.toLowerCase().replace(/\s+/g, '-'),
            label: presetName,
            dropOffOrder: dropOffOrder,
            timestamp: Date.now()
        };

        setRoutePresets(prev => {
            // If overwriting, remove the old preset first
            const updated = prev.filter(preset => preset.label.toLowerCase() !== presetName.toLowerCase());
            return [...updated, newPreset];
        });

        // Set the newly saved preset as active
        setAdvancedSelectedPreset(newPreset);
        setSelectedPreset(newPreset);
        if (activeRoute) {
            setActiveRoute(newPreset);
        }

        setShowAdvancedSavePopup(false);
        setPresetName('');
    };

    // Update the search logic in the left panel component:

    // First, add a function to determine location type
    const getLocationType = (location, planet, moon) => {
        // Existing Stanton location type detection...
        return 'Other';
    };

    // Then update the search filter logic
    <div style={{ marginTop: '10px' }}>
        {StantonSystemData.FullList
            .filter(location => {
                // Skip separators when searching
                if (location.startsWith('--') && location.endsWith('--')) {
                    return true;
                }

                // Get location type
                const locationType = getLocationType(location);
                const typeString = locationType === 'Station' ? 'Space Station' : 
                                  locationType === 'Distribution' ? 'Distribution Center' : 
                                  locationType === 'Outpost' ? 'Mining Outpost' : 
                                  locationType;

                // Check if search term matches location name or type
                return location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       typeString.toLowerCase().includes(searchTerm.toLowerCase());
            })
            .map((location, index) => {
                if (location.startsWith('--') && location.endsWith('--')) {
                    // Only show separator if there are visible items after it
                    const nextItem = StantonSystemData.FullList[index + 1];
                    if (!nextItem || !nextItem.toLowerCase().includes(searchTerm.toLowerCase())) {
                        return null;
                    }

                    // Render separator
                    return (
                        <div key={index} style={{
                            padding: '5px',
                            margin: '10px 0',
                            backgroundColor: 'var(--background-secondary-color)',
                            color: 'var(--text-secondary-color)',
                            fontWeight: 'bold',
                            textAlign: 'center'
                        }}>
                            {location.replace(/--/g, '')}
                        </div>
                    );
                }

                // Get location details
                const locationType = getLocationType(location);
                const planet = Object.keys(StantonSystemData.Dropoffpoints).find(planet => 
                    StantonSystemData.Dropoffpoints[planet].includes(location)
                ) || Object.keys(StantonSystemData.moons).find(planet => 
                    Object.values(StantonSystemData.moons[planet]).flat().includes(location)
                );

                const moon = planet ? Object.keys(StantonSystemData.moons[planet]).find(moon => 
                    StantonSystemData.moons[planet][moon].includes(location)
                ) : null;

                const isInAdvancedView = advancedViewEntries.some(entry => entry.dropOffPoint === location);
                const isInManifest = entries.some(entry => entry.dropOffPoint === location);

                return (
                    <div 
                        key={location} 
                        style={{
                            padding: '10px',
                            marginBottom: '10px',
                            backgroundColor: isInAdvancedView ? 'var(--table-row-color)' : 'var(--background-secondary-color)',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            border: `1px solid ${isInAdvancedView ? 'var(--border-color)' : '#ccc'}`,
                            opacity: isInAdvancedView ? 1 : 0.7,
                            ':hover': {
                                backgroundColor: 'var(--button-color)'
                            }
                        }}
                        onClick={() => {
                            if (showAdvancedView) {
                                handleAddDropOffPoint(location, planet, moon);
                            } else if (!isInManifest) {
                                handleAddDropOffPoint(location, planet, moon);
                            }
                        }}
                    >
                        <div>
                            <div style={{ fontWeight: 'bold' }}>{location}</div>
                            <div style={{ fontSize: '0.8em', color: 'var(--text-secondary-color)' }}>
                                {locationType === 'Station' ? 'Space Station' : 
                                 locationType === 'Distribution' ? 'Distribution Center' : 
                                 locationType === 'Outpost' ? `${planet} ${moon ? `- ${moon}` : ''} (Outpost)` : 
                                 `${planet} ${moon ? `- ${moon}` : ''} (${locationType})`}
                            </div>
                            {isInManifest && (
                                <div style={{ fontSize: '0.8em', color: '#ff4444', marginTop: '5px' }}>
                                    (In Hauling Manifest)
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
    </div>

    // Add fallback to Stanton if selectedSystem is invalid
    const currentSystemData = systemDataMap[selectedSystem] || StantonSystemData;

    useEffect(() => {
        if (currentSystem === 'Pyro') {
            showBannerMessage('Pyro system locations are not currently supported for quick lookup and pickup points');
        }
    }, [currentSystem]);

    return (
        <div className="hauling-missions">
        <div className="system-switcher-container">
            <div className="system-switch-group">
                <label className="system-switch-label">
                    <input 
                        className="system-switch-radio"
                        type="radio"
                        name="system"
                        checked={currentSystem === 'Stanton'}
                        onChange={() => handleSystemChange('Stanton')}
                    />
                    <span className="system-switch-text">Stanton System</span>
                </label>
                <label className="system-switch-label">
                    <input 
                        className="system-switch-radio"
                        type="radio"
                        name="system"
                        checked={currentSystem === 'Pyro'}
                        onChange={() => handleSystemChange('Pyro')}
                    />
                    <span className="system-switch-text">Pyro System</span>
                </label>
            </div>
            <div className="route-planner-container">
                <button 
                    className="route-planner-button with-icon"
                    onClick={() => setShowRoutePlanner(true)}
                >
                    Route Planner
                </button>
            </div>
        </div>

            {/* Basic View Popup */}
            {showRoutePlanner && !showAdvancedView && (
                <div style={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '90%',
                    maxWidth: '1200px',
                    height: '90%',
                    maxHeight: '800px',
                        backgroundColor: 'var(--background-color)',
                        padding: '20px',
                        borderRadius: '8px',
                    zIndex: 1000,
                        overflowY: 'auto',
                    fontFamily: 'var(--font-family)',
                    fontSize: 'var(--font-size)',
                    color: 'var(--text-color)',
                    boxShadow: '0 0 20px rgba(0,0,0,0.3)',
                    border: '3px solid var(--table-outline-color)' // Changed to match border color
                    }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '20px'
                        }}>
                            <h2>Route Planner</h2>
                            <div style={{ display: 'flex', gap: '10px' }}>
                            <button 
                                onClick={() => {
                                    // Save the current active route state
                                    setSavedActiveRouteState(!!activeRoute);
                                    setShowAdvancedView(true);
                                    setActiveRoute(null); // Disable active route in advanced view
                                }}
                                style={{
                                    padding: '8px 16px',
                                    backgroundColor: 'var(--button-color)',
                                    color: 'black',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
                            >
                                Advanced Route Planning
                            </button>
                                <button 
                                    onClick={() => {
                                        const tooltip = document.getElementById('route-planner-tooltip');
                                        tooltip.style.display = tooltip.style.display === 'block' ? 'none' : 'block';
                                    }}
                                    style={{
                                        padding: '8px 16px',
                                        backgroundColor: 'var(--button-color)',
                                        color: 'black',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Help
                                </button>
                                <button 
                                    onClick={() => setShowRoutePlanner(false)}
                                    style={{
                                        padding: '8px 16px',
                                        backgroundColor: 'var(--button-color)',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Close
                                </button>
                            </div>
                        </div>

                        {/* Help Tooltip */}
                        <div id="route-planner-tooltip" style={{
                            display: 'none',
                            position: 'absolute',
                            right: '20px',
                            top: '70px',
                            backgroundColor: 'var(--background-color)',
                        border: '3px solid var(--table-outline-color)',
                            padding: '20px',
                            borderRadius: '8px',
                            width: '400px',
                            zIndex: 1002,
                            boxShadow: '0 0 10px rgba(0,0,0,0.1)'
                        }}>
                            <h3>Route Planner Guide</h3>
                            <h4>First Time Use</h4>
                            <ol style={{ marginLeft: '20px', marginBottom: '15px' }}>
                                <li>Load entries into manifest table</li>
                                <li>Open route planner</li>
                                <li>Order your drop off points in the normal view or in this table</li>
                                <li>Click save and give it a unique name</li>
                                <li>Click load to auto sort the list based on your list</li>
                                <li>Use Active Route checkbox to dynamically update the list when entries are added</li>
                            </ol>
                            <h4>Notes:</h4>
                            <ul style={{ marginLeft: '20px' }}>
                                <li>If you have a route set and then you load and there is a route that is not part of the preset it will automatically be moved to the bottom of the list.</li>
                                <li>With active route enabled, moving entries around and then clicking add entry will update the list to your preset.</li>
                            </ul>
                            <button 
                                onClick={() => {
                                    document.getElementById('route-planner-tooltip').style.display = 'none';
                                }}
                                style={{
                                    marginTop: '10px',
                                    padding: '8px 16px',
                                    backgroundColor: 'var(--button-color)',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    width: '100%'
                                }}
                            >
                                Close Help
                            </button>
                        </div>

                        {/* Add Route Preset Controls */}
                        <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <div style={{ flex: 1 }}>
                                <Select
                                    options={routePresets}
                                value={basicSelectedPreset}
                                onChange={(selected) => handlePresetSelect(selected, false)}
                                    placeholder="Select a route preset"
                                    styles={customStyles}
                                    components={{ 
                                        DropdownIndicator: null, 
                                        IndicatorSeparator: null 
                                    }}
                                    className="first-dropdown-select"
                                    classNamePrefix="react-select"
                                />
                            </div>
                        {!showAdvancedView && (
                            <label style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--dropdown-label-color)' }}>
                                <input
                                    type="checkbox"
                                    checked={!!activeRoute}
                                    onChange={handleActiveRouteChange}
                                    disabled={!selectedPreset}
                                />
                                Active Route
                            </label>
                        )}
                            <button 
                                onClick={() => setShowSavePresetPopup(true)}
                                style={{
                                    padding: '8px 16px',
                                    backgroundColor: 'var(--button-color)',
                                    color: 'black',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
                            >
                                Save
                            </button>
                            <button 
                                onClick={handleLoadPreset}
                                style={{
                                    padding: '8px 16px',
                                    backgroundColor: 'var(--button-color)',
                                
                                    color: 'black',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
                            >
                                Load
                            </button>
                        <button 
                            onClick={handleDeletePreset}
                            style={{
                                padding: '8px 16px',
                                backgroundColor: '#ff4444',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            Delete
                        </button>
                        {showAdvancedView && (
                            <button 
                                onClick={() => {
                                    setAdvancedViewEntries([]);
                                    setAdvancedSelectedPreset(null);
                                }}
                                style={{
                                    padding: '8px 16px',
                                    backgroundColor: '#ff4444',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    whiteSpace: 'nowrap' // Add this line
                                }}
                            >
                                Clear View
                            </button>
                        )}
                        </div>

                        {/* Save Preset Popup */}
                        {showSavePresetPopup && (
                            <div style={{
                                position: 'fixed',
                                top: '0',
                                left: '0',
                                width: '100%',
                                height: '100%',
                                backgroundColor: 'rgba(0,0,0,0.5)',
                            border: '3px solid var(--table-outline-color)',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                zIndex: 1001
                            }}>
                                <div style={{
                                    backgroundColor: 'var(--background-color)',
                                    padding: '20px',
                                    borderRadius: '8px',
                                    width: '400px'
                                }}>
                                    <h3>Save Route Preset</h3>
                                    <input
                                        type="text"
                                        value={presetName}
                                        onChange={(e) => setPresetName(e.target.value)}
                                        placeholder="Enter preset name"
                                        style={{
                                            width: '100%',
                                            padding: '8px',
                                            marginBottom: '10px',
                                            borderRadius: '4px',
                                            border: '1px solid #ccc',
                                            color: 'var(--dropdown-label-color)'
                                        }}
                                    />
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <button 
                                            onClick={handleSavePreset}
                                            style={{
                                                padding: '8px 16px',
                                                backgroundColor: 'var(--button-color)',
                                                color: 'black',
                                                border: 'none',
                                                borderRadius: '4px',
                                                cursor: 'pointer',
                                                flex: 1
                                            }}
                                        >
                                            {routePresets.some(p => p.label.toLowerCase() === presetName.toLowerCase()) 
                                                ? 'Overwrite' 
                                                : 'Save'}
                                        </button>
                                        <button 
                                            onClick={() => setShowSavePresetPopup(false)}
                                            style={{
                                                padding: '8px 16px',
                                                backgroundColor: '#ccc',
                                                color: 'black',
                                                border: 'none',
                                                borderRadius: '4px',
                                                cursor: 'pointer',
                                                flex: 1
                                            }}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Load Confirmation Popup */}
                        {showLoadConfirmation && (
                            <div style={{
                                position: 'fixed',
                                top: '0',
                                left: '0',
                                width: '100%',
                                height: '100%',
                                backgroundColor: 'rgba(0,0,0,0.5)',
                            border: '3px solid var(--table-outline-color)',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                zIndex: 1001
                            }}>
                                <div style={{
                                    backgroundColor: 'var(--background-color)',
                                    padding: '20px',
                                    borderRadius: '8px',
                                    width: '400px'
                                }}>
                                    <h3>Load Route Preset</h3>
                                    <p>Are you sure you want to load this preset?</p>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <button 
                                            onClick={loadPreset}
                                            style={{
                                                padding: '8px 16px',
                                                backgroundColor: 'var(--button-color)',
                                                color: 'black',
                                                border: 'none',
                                                borderRadius: '4px',
                                                cursor: 'pointer',
                                                flex: 1
                                            }}
                                        >
                                            Yes
                                        </button>
                                        <button 
                                            onClick={() => setShowLoadConfirmation(false)}
                                            style={{
                                                padding: '8px 16px',
                                                backgroundColor: '#ccc',
                                                color: 'black',
                                                border: 'none',
                                                borderRadius: '4px',
                                                cursor: 'pointer',
                                                flex: 1
                                            }}
                                        >
                                            No
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                    {/* Delete Confirmation Popup */}
                    {showDeleteConfirmation && (
                        <div style={{
                            position: 'fixed',
                            top: '0',
                            left: '0',
                            width: '100%',
                            height: '100%',
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            border: '3px solid var(--table-outline-color)',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            zIndex: 1001
                        }}>
                            <div style={{
                                backgroundColor: 'var(--background-color)',
                                padding: '20px',
                                borderRadius: '8px',
                                width: '400px'
                            }}>
                                <h3>Delete Route Preset</h3>
                                <p>Are you sure you want to delete the preset "{
                                    showAdvancedView ? 
                                        (advancedSelectedPreset ? advancedSelectedPreset.label : '') : 
                                        (basicSelectedPreset ? basicSelectedPreset.label : '')
                                }"?</p>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button 
                                        onClick={() => {
                                            const presetToDelete = showAdvancedView ? advancedSelectedPreset : basicSelectedPreset;
                                            if (presetToDelete) {
                                                setRoutePresets(prev => prev.filter(preset => preset.value !== presetToDelete.value));
                                                
                                                if (showAdvancedView) {
                                                    setAdvancedSelectedPreset(null);
                                                    setAdvancedViewEntries([]);
                                                } else {
                                                    setBasicSelectedPreset(null);
                                                }
                                                
                                                if (activeRoute?.value === presetToDelete.value) {
                                                    setActiveRoute(null);
                                                }
                                            }
                                            setShowDeleteConfirmation(false);
                                        }}
                                        style={{
                                            padding: '8px 16px',
                                            backgroundColor: '#ff4444',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            flex: 1
                                        }}
                                    >
                                        Delete
                                    </button>
                                    <button 
                                        onClick={() => setShowDeleteConfirmation(false)}
                                        style={{
                                            padding: '8px 16px',
                                            backgroundColor: '#ccc',
                                            color: 'black',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            flex: 1
                                        }}
                                    >
                                        Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Display drop-off headers */}
                    {(showAdvancedView ? 
                        advancedViewEntries.reduce((acc, entry) => {
                            if (entry && entry.dropOffPoint) {
                            acc[entry.dropOffPoint] = true;
                            }
                            return acc;
                        }, {}) 
                        : 
                        entries.reduce((acc, entry) => {
                            if (entry && entry.dropOffPoint) {
                                acc[entry.dropOffPoint] = true;
                            }
                            return acc;
                        }, {})
                    ) ? Object.keys(showAdvancedView ? 
                        advancedViewEntries.reduce((acc, entry) => {
                            if (entry && entry.dropOffPoint) {
                                acc[entry.dropOffPoint] = true;
                            }
                            return acc;
                        }, {}) 
                        : 
                        entries.reduce((acc, entry) => {
                            if (entry && entry.dropOffPoint) {
                                acc[entry.dropOffPoint] = true;
                            }
                            return acc;
                        }, {})
                    ).map(dropOffPoint => (
                            <div key={dropOffPoint} style={{
                                padding: '10px',
                                marginBottom: '10px',
                                backgroundColor: 'var(--table-row-color)',
                                borderRadius: '4px'
                            }}>
                            <div className="drop-off-header" style={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center',
                                padding: '5px', // Reduce padding
                                margin: '2px 0' // Reduce margin
                            }}>
                                    <div className="left-box">
                                        <span>{dropOffPoint}</span>
                                        <span style={{ fontSize: 'small', marginLeft: '10px' }}>
                                        {advancedViewEntries.find(entry => entry.dropOffPoint === dropOffPoint)?.planet} - 
                                        {advancedViewEntries.find(entry => entry.dropOffPoint === dropOffPoint)?.moon}
                                        </span>
                                    </div>
                                <div style={{ display: 'flex', gap: '2px' }}> {/* Reduce gap between buttons */}
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                            // Move entry up in advancedViewEntries
                                            setAdvancedViewEntries(prev => {
                                                const index = prev.findIndex(entry => entry.dropOffPoint === dropOffPoint);
                                                if (index > 0) {
                                                    const newEntries = [...prev];
                                                    [newEntries[index - 1], newEntries[index]] = [newEntries[index], newEntries[index - 1]];
                                                    return newEntries;
                                                }
                                                return prev;
                                            });
                                        }}
                                        style={{
                                            padding: '4px 8px', // Reduce padding
                                            backgroundColor: 'var(--button-color)',
                                            color: 'black',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        ▲
                                    </button>
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            // Move entry down in advancedViewEntries
                                            setAdvancedViewEntries(prev => {
                                                const index = prev.findIndex(entry => entry.dropOffPoint === dropOffPoint);
                                                if (index < prev.length - 1) {
                                                    const newEntries = [...prev];
                                                    [newEntries[index], newEntries[index + 1]] = [newEntries[index + 1], newEntries[index]];
                                                    return newEntries;
                                                }
                                                return prev;
                                            });
                                        }}
                                        style={{
                                            padding: '4px 8px', // Reduce padding
                                            backgroundColor: 'var(--button-color)',
                                            color: 'black',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        ▼
                                    </button>
                                </div>
                            </div>
                        </div>
                    )) : null}
                </div>
            )}

            {/* Advanced Route Planning Popup */}
            {showAdvancedView && (
                <div style={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '90%',
                    maxWidth: '1300px',
                    height: '90%',
                    minHeight: '600px', // Add minimum height to prevent it from getting too small
                    backgroundColor: 'var(--background-color)',
                    display: 'flex',
                    zIndex: 1000,
                    fontFamily: 'var(--font-family)',
                    fontSize: 'var(--font-size)',
                    color: 'var(--text-color)',
                    borderRadius: '8px',
                    boxShadow: '0 0 20px rgba(0,0,0,0.3)',
                    overflow: 'hidden',
                    border: '3px solid var(--table-outline-color)' // Changed to match border color
                }}>
                    {/* Left Panel (20%) */}
                    <div style={{ 
                        width: '30%', 
                        padding: '20px', 
                        borderRight: '2px solid var(--border-color)', 
                        overflowY: 'auto', 
                        backgroundColor: 'var(--background-secondary-color)'
                    }}>
                        <h3>Route Tools</h3>
                        
                        {/* System Tabs */}
                        <div style={{
                            display: 'flex',
                            gap: '10px',
                            marginBottom: '20px'
                        }}>
                            <button
                                style={{
                                    flex: 1,
                                    padding: '8px',
                                    backgroundColor: advancedSelectedSystem === 'Stanton' ? 'var(--button-color)' : 'var(--background-color)',
                                    color: advancedSelectedSystem === 'Stanton' ? 'black' : 'var(--text-color)',
                                    border: `1px solid ${advancedSelectedSystem === 'Stanton' ? 'var(--button-color)' : 'var(--border-color)'}`,
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
                                onClick={() => setAdvancedSelectedSystem('Stanton')}
                            >
                                Stanton
                            </button>
                            <button
                                style={{
                                    flex: 1,
                                    padding: '8px',
                                    backgroundColor: advancedSelectedSystem === 'Pyro' ? 'var(--button-color)' : 'var(--background-color)',
                                    color: advancedSelectedSystem === 'Pyro' ? 'black' : 'var(--text-color)',
                                    border: `1px solid ${advancedSelectedSystem === 'Pyro' ? 'var(--button-color)' : 'var(--border-color)'}`,
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
                                onClick={() => setAdvancedSelectedSystem('Pyro')}
                            >
                                Pyro
                            </button>
                        </div>
                        
                        {/* Search Bar */}
                        <input
                            type="text"
                            placeholder="Search drop-off points..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '8px',
                                marginBottom: '20px',
                                borderRadius: '4px',
                                border: '1px solid var(--border-color)',
                                backgroundColor: 'var(--background-color)',
                                color: 'var(--text-color)'
                            }}
                        />
                        
                        {/* Drop-off Points List */}
                        <div style={{ marginTop: '10px' }}>
                            {(advancedSelectedSystem === 'Stanton' ? StantonSystemData : PyroSystemData).FullList
                                .filter(location => {
                                    // Skip separators when searching
                                    if (location.startsWith('--') && location.endsWith('--')) {
                                        return true;
                                    }

                                    // Get location type
                                    const locationType = getLocationType(location);
                                    const typeString = locationType === 'Station' ? 'Space Station' : 
                                                      locationType === 'Distribution' ? 'Distribution Center' : 
                                                      locationType === 'Outpost' ? 'Mining Outpost' : 
                                                      locationType;

                                    // Check if search term matches location name or type
                                    return location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                           typeString.toLowerCase().includes(searchTerm.toLowerCase());
                                })
                                .map((location, index) => {
                                    if (location.startsWith('--') && location.endsWith('--')) {
                                        // Only show separator if there are visible items after it
                                        const nextItem = StantonSystemData.FullList[index + 1];
                                        if (!nextItem || !nextItem.toLowerCase().includes(searchTerm.toLowerCase())) {
                                            return null;
                                        }

                                        // Render separator
                                        return (
                                            <div key={index} style={{
                                                padding: '5px',
                                                margin: '10px 0',
                                                backgroundColor: 'var(--background-secondary-color)',
                                                color: 'var(--text-secondary-color)',
                                                fontWeight: 'bold',
                                                textAlign: 'center'
                                            }}>
                                                {location.replace(/--/g, '')}
                                            </div>
                                        );
                                    }

                                    // Get location details
                                    const locationType = getLocationType(location);
                                    const planet = Object.keys(StantonSystemData.Dropoffpoints).find(planet => 
                                        StantonSystemData.Dropoffpoints[planet].includes(location)
                                    ) || Object.keys(StantonSystemData.moons).find(planet => 
                                        Object.values(StantonSystemData.moons[planet]).flat().includes(location)
                                    );

                                    const moon = planet ? Object.keys(StantonSystemData.moons[planet]).find(moon => 
                                        StantonSystemData.moons[planet][moon].includes(location)
                                    ) : null;

                                    const isInAdvancedView = advancedViewEntries.some(entry => entry.dropOffPoint === location);
                                    const isInManifest = entries.some(entry => entry.dropOffPoint === location);

                                    return (
                                        <div 
                                            key={location} 
                                            style={{
                                                padding: '10px',
                                                marginBottom: '10px',
                                                backgroundColor: isInAdvancedView ? 'var(--table-row-color)' : 'var(--background-secondary-color)',
                                                borderRadius: '4px',
                                                cursor: 'pointer',
                                                border: `1px solid ${isInAdvancedView ? 'var(--border-color)' : '#ccc'}`,
                                                opacity: isInAdvancedView ? 1 : 0.7,
                                                ':hover': {
                                                    backgroundColor: 'var(--button-color)'
                                                }
                                            }}
                                            onClick={() => {
                                                if (showAdvancedView) {
                                                    handleAddDropOffPoint(location, planet, moon);
                                                } else if (!isInManifest) {
                                                    handleAddDropOffPoint(location, planet, moon);
                                                }
                                            }}
                                        >
                                            <div>
                                                <div style={{ fontWeight: 'bold' }}>{location}</div>
                                                <div style={{ fontSize: '0.8em', color: 'var(--text-secondary-color)' }}>
                                                    {locationType === 'Station' ? 'Space Station' : 
                                                     locationType === 'Distribution' ? 'Distribution Center' : 
                                                     locationType === 'Outpost' ? `${planet} ${moon ? `- ${moon}` : ''} (Outpost)` : 
                                                     `${planet} ${moon ? `- ${moon}` : ''} (${locationType})`}
                                                </div>
                                                {isInManifest && (
                                                    <div style={{ fontSize: '0.8em', color: '#ff4444', marginTop: '5px' }}>
                                                        (In Hauling Manifest)
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                    </div>

                    {/* Right Panel (80%) */}
                    <div style={{
                        width: '70%',
                        padding: '20px',
                        overflowY: 'auto',
                        backgroundColor: 'var(--background-color)'
                    }}>
                        {/* Copy the existing route planner content here */}
                        <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center', 
                            marginBottom: '20px'
                        }}>
                            <h2>Advanced Route Planning</h2>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button 
                                    onClick={() => {
                                        setShowAdvancedView(false);
                                        // Restore the saved active route state
                                        setActiveRoute(savedActiveRouteState ? selectedPreset : null);
                                    }}
                                    style={{
                                        padding: '8px 16px',
                                        backgroundColor: 'var(--button-color)',
                                        color: 'black',
                                        border: '2px solid var(--border-color)',
                                        borderRadius: '4px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Basic View
                                </button>
                                <button 
                                    onClick={() => {
                                        const tooltip = document.getElementById('advanced-route-planner-tooltip');
                                        tooltip.style.display = tooltip.style.display === 'block' ? 'none' : 'block';
                                    }}
                                    style={{
                                        padding: '8px 16px',
                                        backgroundColor: 'var(--button-color)',
                                        color: 'black',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Help
                                </button>
                                <button 
                                    onClick={() => {
                                        setShowRoutePlanner(false);
                                        setShowAdvancedView(false);
                                        // Restore the saved active route state
                                        setActiveRoute(savedActiveRouteState ? selectedPreset : null);
                                    }}
                                    style={{
                                        padding: '8px 16px',
                                        backgroundColor: 'var(--button-color)',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Close
                                </button>
                            </div>
                        </div>

                        {/* Rest of the route planner content */}
                        <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <div style={{ flex: 1 }}>
                                <Select
                                    options={routePresets}
                                    value={advancedSelectedPreset}
                                    onChange={(selected) => handlePresetSelect(selected, true)}
                                    placeholder="Select a route preset"
                                    styles={customStyles}
                                    components={{ 
                                        DropdownIndicator: null, 
                                        IndicatorSeparator: null 
                                    }}
                                    className="first-dropdown-select"
                                    classNamePrefix="react-select"
                                />
                            </div>
                            <button 
                                onClick={() => setShowAdvancedSavePopup(true)}
                                style={{
                                    padding: '8px 16px',
                                    backgroundColor: 'var(--button-color)',
                                    color: 'black',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
                            >
                                Save
                            </button>
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                <button 
                                    onClick={() => {
                                        setAdvancedViewEntries([]);
                                        setAdvancedSelectedPreset(null);
                                    }}
                                    style={{
                                        padding: '8px 16px',
                                        backgroundColor: '#ff4444',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        whiteSpace: 'nowrap' // Add this line
                                    }}
                                >
                                    Clear View
                                </button>
                                <button 
                                    onClick={() => {
                                        if (!advancedSelectedPreset) {
                                            showBannerMessage('Please select a preset to delete');
                                            return;
                                        }
                                        setShowDeleteConfirmation(true);
                                    }}
                                    style={{
                                        padding: '8px 16px',
                                        backgroundColor: '#ff4444',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        whiteSpace: 'nowrap' // Add this line
                                    }}
                                >
                                    Delete Preset
                                </button>
                            </div>
                        </div>

                        {/* Display drop-off headers */}
                        {advancedViewEntries.reduce((acc, entry) => {
                            if (entry && entry.dropOffPoint) {
                                acc[entry.dropOffPoint] = true;
                            }
                            return acc;
                        }, {}) ? Object.keys(advancedViewEntries.reduce((acc, entry) => {
                            if (entry && entry.dropOffPoint) {
                                acc[entry.dropOffPoint] = true;
                            }
                            return acc;
                        }, {})).map((dropOffPoint, index) => {
                            const handleOrderChange = (e) => {
                                const newPosition = parseInt(e.target.value) - 1;
                                if (isNaN(newPosition) || newPosition < 0 || newPosition >= advancedViewEntries.length) {
                                    return;
                                }

                                setAdvancedViewEntries(prev => {
                                    const currentIndex = prev.findIndex(entry => entry.dropOffPoint === dropOffPoint);
                                    if (currentIndex === -1) return prev;

                                    const newEntries = [...prev];
                                    const [movedEntry] = newEntries.splice(currentIndex, 1);
                                    newEntries.splice(newPosition, 0, movedEntry);
                                    return newEntries;
                                });
                            };

                            return (
                                <div key={dropOffPoint} style={{
                                    padding: '10px',
                                    marginBottom: '10px',
                                    backgroundColor: 'var(--table-row-color)',
                                    borderRadius: '4px'
                                }}>
                                    <div className="drop-off-header" style={{ 
                                        display: 'flex', 
                                        justifyContent: 'space-between', 
                                        alignItems: 'center',
                                        padding: '5px',
                                        margin: '-8px 0'
                                    }}>
                                        <div className="left-box">
                                            <span>{dropOffPoint}</span>
                                            <span style={{ fontSize: 'small', marginLeft: '10px' }}>
                                                {advancedViewEntries.find(entry => entry.dropOffPoint === dropOffPoint)?.planet} - 
                                                {advancedViewEntries.find(entry => entry.dropOffPoint === dropOffPoint)?.moon}
                                            </span>
                                        </div>
                                        <div style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
                                            <input
                                                type="number"
                                                value={index + 1}
                                                onChange={handleOrderChange}
                                                min={1}
                                                max={advancedViewEntries.length}
                                                style={{
                                                    width: '40px',
                                                    marginRight: '5px',
                                                    fontWeight: 'bold',
                                                    color: 'var(--button-color)',
                                                    backgroundColor: 'transparent',
                                                    border: 'none',
                                                    fontSize: '14px',
                                                    WebkitAppearance: 'none',
                                                    MozAppearance: 'textfield',
                                                    textAlign: 'center'
                                                }}
                                                onFocus={(e) => e.target.select()}
                                            />
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setAdvancedViewEntries(prev => {
                                                        const index = prev.findIndex(entry => entry.dropOffPoint === dropOffPoint);
                                                        if (index > 0) {
                                                            const newEntries = [...prev];
                                                            [newEntries[index - 1], newEntries[index]] = [newEntries[index], newEntries[index - 1]];
                                                            return newEntries;
                                                        }
                                                        return prev;
                                                    });
                                            }}
                                            style={{
                                                padding: '4px 8px',
                                                backgroundColor: 'var(--button-color)',
                                                color: 'black',
                                                border: 'none',
                                                borderRadius: '4px',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            ▲
                                        </button>
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                    setAdvancedViewEntries(prev => {
                                                        const index = prev.findIndex(entry => entry.dropOffPoint === dropOffPoint);
                                                        if (index < prev.length - 1) {
                                                            const newEntries = [...prev];
                                                            [newEntries[index], newEntries[index + 1]] = [newEntries[index + 1], newEntries[index]];
                                                            return newEntries;
                                                        }
                                                        return prev;
                                                    });
                                            }}
                                            style={{
                                                padding: '4px 8px',
                                                backgroundColor: 'var(--button-color)',
                                                color: 'black',
                                                border: 'none',
                                                borderRadius: '4px',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            ▼
                                        </button>
                                    </div>
                                </div>
                            </div>
                            );
                        }) : null}

                        {/* Move the delete confirmation popup here */}
                        {showDeleteConfirmation && (
                            <div style={{
                                position: 'fixed',
                                top: '0',
                                left: '0',
                                width: '100%',
                                height: '100%',
                                backgroundColor: 'rgba(0,0,0,0.5)',
                                border: '3px solid var(--table-outline-color)',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                zIndex: 1001
                            }}>
                                <div style={{
                                    backgroundColor: 'var(--background-color)',
                                    padding: '20px',
                                    borderRadius: '8px',
                                    width: '400px'
                                }}>
                                    <h3>Delete Route Preset</h3>
                                    <p>Are you sure you want to delete the preset "{advancedSelectedPreset ? advancedSelectedPreset.label : ''}"?</p>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <button 
                                            onClick={() => {
                                                if (advancedSelectedPreset) {
                                                    setRoutePresets(prev => prev.filter(preset => preset.value !== advancedSelectedPreset.value));
                                                    setAdvancedSelectedPreset(null);
                                                    setAdvancedViewEntries([]);
                                                }
                                                setShowDeleteConfirmation(false);
                                            }}
                                            style={{
                                                padding: '8px 16px',
                                                backgroundColor: '#ff4444',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '4px',
                                                cursor: 'pointer',
                                                flex: 1
                                            }}
                                        >
                                            Delete
                                        </button>
                                        <button 
                                            onClick={() => setShowDeleteConfirmation(false)}
                                            style={{
                                                padding: '8px 16px',
                                                backgroundColor: '#ccc',
                                                color: 'black',
                                                border: 'none',
                                                borderRadius: '4px',
                                                cursor: 'pointer',
                                                flex: 1
                                            }}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Advanced Route Planner Help Tooltip */}
            <div id="advanced-route-planner-tooltip" style={{
                display: 'none',
                position: 'absolute',
                right: '20px',
                top: '70px',
                backgroundColor: 'var(--background-color)',
                border: '3px solid var(--table-outline-color)',
                padding: '20px',
                borderRadius: '8px',
                width: '400px',
                zIndex: 1002,
                boxShadow: '0 0 10px rgba(0,0,0,0.1)'
            }}>
                <h3>Advanced Route Planner Guide</h3>
                <p>This works a bit different as you won't see the hauling manifest list in this window. You need to manually add locations from the list on the left - clicking the name will add or remove it from the right side list.</p>
                <ol style={{ marginLeft: '20px', marginBottom: '15px' }}>
                    <li>Add locations for your preferred route</li>
                    <li>A number is visible that tells you which order it is in - clicking it allows you to quickly send it to that point in the order</li>
                    <li>Clicking save works the same as basic - set a new name or type the same name to overwrite</li>
                </ol>
                <h4>Note:</h4>
                <ul style={{ marginLeft: '20px' }}>
                    <li>This order will not affect your current order until you select it in the basic view/Route Planner</li>
                    <li>Clear view will take away all entries and unselect currently selected preset</li>
                    <li>!!This will not delete the preset!!</li>
                </ul>
                <button 
                    onClick={() => {
                        document.getElementById('advanced-route-planner-tooltip').style.display = 'none';
                    }}
                    style={{
                        marginTop: '10px',
                        padding: '8px 16px',
                        backgroundColor: 'var(--button-color)',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        width: '100%'
                    }}
                >
                    Close Help
                </button>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label>Pickup Point</label>
                    <Select
                        components={{ DropdownIndicator: null, IndicatorSeparator: null }}
                        options={currentSystem === 'Pyro' ? [] : currentSystemData.FullList.map(location => {
                            if (location.startsWith('--') && location.endsWith('--')) {
                                return {
                                    value: location,
                                    label: `-- ${location.replace(/--/g, '')} --`,
                                    isDisabled: true,
                                    className: 'dropdown-separator'
                                };
                            }
                            return {
                                value: location,
                                label: location
                            };
                        })}
                        value={currentSystem === 'Pyro' ? null : pickupPointOptions(selectedSystem).find(option => option.value === firstDropdownValue)}
                        onChange={(option) => {
                            if (!option.isDisabled) {
                                handlePickupPointChange(option);
                                if (amountInputRef.current) {
                                    amountInputRef.current.focus();
                                }
                            }
                        }}
                        isDisabled={currentSystem === 'Pyro'}
                        className="first-dropdown-select"
                        classNamePrefix="react-select"
                        styles={{
                            ...customStyles,
                            option: (provided, state) => ({
                                ...provided,
                                backgroundColor: state.isDisabled ? 'var(--background-secondary-color)' : 
                                              state.isSelected ? 'var(--button-color)' : 
                                              state.isFocused ? 'var(--background-color)' : 'transparent',
                                color: state.isDisabled ? '#ffffff' : 'var(--text-color)',
                                fontWeight: state.isDisabled ? 'normal' : 'normal',
                                fontStyle: state.isDisabled ? 'italic' : 'normal',
                                cursor: state.isDisabled ? 'default' : 'pointer',
                                paddingLeft: '8px',
                                paddingRight: '8px',
                                ':active': {
                                    backgroundColor: state.isDisabled ? 'var(--background-secondary-color)' : 'var(--button-color)'
                                }
                            })
                        }}
                        placeholder={currentSystem === 'Pyro' ? 'Pyro system not supported' : 'Search Pickup Point'}
                    />
                </div>
                <div className="form-group">
                    <label>Quick Lookup</label>
                    <Select
                        components={{ DropdownIndicator: null, IndicatorSeparator: null }}
                        options={currentSystem === 'Pyro' ? [] : currentSystemData.FullList.map(location => {
                            if (location.startsWith('--') && location.endsWith('--')) {
                                return {
                                    value: location,
                                    label: `-- ${location.replace(/--/g, '')} --`,
                                    isDisabled: true,
                                    className: 'dropdown-separator'
                                };
                            }
                            return {
                                value: location,
                                label: location
                            };
                        })}
                        value={currentSystem === 'Pyro' ? null : quickLookupOptions(selectedSystem).find(option => option.value === secondDropdownValue)}
                        onChange={(option) => {
                            if (!option.isDisabled) {
                                handleQuickLookupChange(option);
                                if (amountInputRef.current) {
                                    amountInputRef.current.focus();
                                }
                            }
                        }}
                        isDisabled={currentSystem === 'Pyro'}
                        className="second-dropdown-select"
                        classNamePrefix="react-select"
                        styles={{
                            ...customStyles,
                            option: (provided, state) => ({
                                ...provided,
                                backgroundColor: state.isDisabled ? 'var(--background-secondary-color)' : 
                                              state.isSelected ? 'var(--button-color)' : 
                                              state.isFocused ? 'var(--background-color)' : 'transparent',
                                color: state.isDisabled ? '#ffffff' : 'var(--text-color)',
                                fontWeight: state.isDisabled ? 'normal' : 'normal',
                                fontStyle: state.isDisabled ? 'italic' : 'normal',
                                cursor: state.isDisabled ? 'default' : 'pointer',
                                paddingLeft: '8px',
                                paddingRight: '8px',
                                ':active': {
                                    backgroundColor: state.isDisabled ? 'var(--background-secondary-color)' : 'var(--button-color)'
                                }
                            })
                        }}
                        placeholder={currentSystem === 'Pyro' ? 'Pyro system not supported' : 'Search Quick Lookup'}
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
                {locationType === 'planet' ? (
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
                                options={selectedPlanet && data.moons[selectedPlanet] ? 
                                    Object.keys(data.moons[selectedPlanet]).map(moon => ({ value: moon, label: moon })) : 
                                    []}
                                value={selectedMoon ? { value: selectedMoon, label: selectedMoon } : null}
                                onChange={handleMoonSelectChange}
                                className="moon-select"
                                classNamePrefix="react-select"
                                styles={customStyles}
                            />
                        </div>
                    </>
                ) : (
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
                )}
                <div className="form-group">
                    <label>Drop off points</label>
                    <Select
                        components={{ DropdownIndicator: null, IndicatorSeparator: null }}
                        options={selectedMoon && data.moons[selectedPlanet][selectedMoon] ? 
                            data.moons[selectedPlanet][selectedMoon].map(station => ({ value: station, label: station })) : 
                            (() => {
                                const dropOffPoints = data.Dropoffpoints[selectedPlanet];
                                if (Array.isArray(dropOffPoints)) {
                                    return dropOffPoints.map(station => ({ value: station, label: station }));
                                } else if (typeof dropOffPoints === 'object' && dropOffPoints !== null) {
                                    // Handle object case (like Pyro V)
                                    return Object.entries(dropOffPoints).flatMap(([moon, locations]) => 
                                        locations.map(location => ({ 
                                            value: location, 
                                            label: `${moon} - ${location}` 
                                        }))
                                    );
                                }
                                return [];
                            })()
                        }
                        value={selectedDropOffPoint ? { value: selectedDropOffPoint, label: selectedDropOffPoint } : null}
                        onChange={handleDropOffSelectChange}
                        className="drop-off-select"
                        classNamePrefix="react-select"
                        styles={customStyles}
                    />
                </div>
            </div>

            {/* Mission Selection Area */}
            <div className="mission-checkbox" style={{ 
                minHeight: '140px',
                fontFamily: 'Arial, sans-serif !important'
            }}>
                <div style={{
                    marginBottom: '10px',
                    textAlign: 'center',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontFamily: 'Arial, sans-serif'
                }}>
                    <label
                        className="automatic-mission-label"
                        style={{
                            cursor: 'pointer',
                            color: autoMissionAllocation ? 'green' : 'var(--mission-text-color)',
                            userSelect: 'none',
                            textDecoration: 'underline',
                            fontSize: '1.2em',
                            fontWeight: 'bold',
                            fontFamily: 'Arial, sans-serif'
                        }}
                        onClick={() => setAutoMissionAllocation(!autoMissionAllocation)}
                    >
                        Automatic Mission Allocation
                    </label>
                </div>

                {/* Conditionally render based on autoMissionAllocation */}
                {autoMissionAllocation ? (
                    // Auto Mode: Only first 5 checkboxes + Unlock Button
                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        minHeight: '130px',
                        fontFamily: 'Arial, sans-serif'
                    }}>
                        <div className="column" style={{ 
                            flex: 1,
                            fontFamily: 'Arial, sans-serif'
                        }}>
                            {/* Display only one mission checkbox in auto mode */}
                            {Array.from({ length: 1 }, (_, index) => {
                                // Correct Mission Number Calculation:
                                let missionNumber;
                                if (lockedMissionIndex.current !== null) {
                                    missionNumber = lockedMissionIndex.current + 1; // Always show locked mission number
                                } else {
                                     missionNumber = getNextAvailableMissionIndex() + index + 1;
                                        // Prevent displaying a number greater than 15
                                        if (missionNumber > 15) {
                                             missionNumber = Math.min(getNextAvailableMissionIndex() + index + 1, 15); // Cap at 15
                                        }
                                 }
                                const isLockedMission = lockedMissionIndex.current !== null && (lockedMissionIndex.current % 5) === index;

                                return (
                                    <label key={index} style={{ 
                                        display: 'flex', 
                                        flexDirection: 'column', 
                                        alignItems: 'center',
                                        fontFamily: 'Arial, sans-serif'
                                    }}>
                                        <span style={{ 
                                            textDecoration: 'underline', 
                                            marginBottom: '5px', 
                                            textAlign: 'center',
                                            fontFamily: 'Arial, sans-serif'
                                        }}>Current Mission</span>
                                        <input
                                            type="checkbox"
                                            checked={isLockedMission}
                                            onChange={() => {
                                                if (!isLockedMission) {
                                                    handleCheckboxChange(index);
                                                }
                                            }}
                                            style={{ display: 'none' }}
                                        />
                                        Mission {missionNumber}
                                        {getMissionPreview(lockedMissionIndex.current !== null ? lockedMissionIndex.current : (getNextAvailableMissionIndex() + index))}
                                    </label>
                                );
                            })}
                        </div>
                        <div style={{ 
                            display: 'flex', 
                            flexDirection: 'column', 
                            alignItems: 'flex-end', 
                            flex: 0, 
                            minWidth: '120px',
                            fontFamily: 'Arial, sans-serif'
                        }}>
                            <button onClick={unlockMission} className="unlock-mission-button" style={{
                                marginBottom: '10px', 
                                whiteSpace: 'nowrap',
                                fontFamily: 'Arial, sans-serif'
                            }}>
                                Next Mission
                            </button>
                            <button 
                                onClick={handleSetKeyClick} 
                                className="set-key-button" 
                                style={{
                                    marginBottom: '10px', 
                                    whiteSpace: 'nowrap',
                                    marginLeft: 'auto',
                                    marginRight: 'auto',
                                    display: 'block',
                                    fontFamily: 'Arial, sans-serif'
                                }}
                                disabled={isSettingKey}
                            >
                                {isSettingKey ? 'Press Key...' : `Set Key: ${nextMissionHotkey.toUpperCase()}`}
                            </button>
                        </div>
                    </div>
                ) : (
                    // Manual Mode: All checkboxes
                    <>
                        <div className="column" style={{ 
                            display: 'flex', 
                            flexDirection: 'column', 
                            alignItems: 'flex-end', 
                            marginRight: '10px', 
                            minHeight: '130px',
                            fontFamily: 'Arial, sans-serif'
                        }}>
                            {Array.from({ length: 5 }, (_, index) => {
                                const missionNumber = index + 1;
                                return (
                                    <label 
                                        key={index} 
                                        style={{ 
                                            marginBottom: '0px',
                                            textDecoration: selectedMissions[index] ? 'underline' : 'none',
                                            textShadow: selectedMissions[index] ? '0 0 5px var(--button-color)' : 'none',
                                            cursor: 'pointer',
                                            textAlign: 'center',
                                            display: 'flex',
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent: 'flex-end',
                                            fontFamily: 'Arial, sans-serif'
                                        }}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedMissions[index]}
                                            style={{
                                                display: autoMissionAllocation ? 'none' : 'block',
                                                marginRight: '5px'
                                            }}
                                            onChange={() => handleCheckboxChange(index)}
                                        />
                                        <span style={{ 
                                            color: autoMissionAllocation ? 'grey' : 'var(--mission-text-color)',
                                            fontFamily: 'Arial, sans-serif'
                                        }}>
                                            Mission {index + 1}
                                        </span>
                                        {getMissionPreview(index)}
                                    </label>
                                );
                            })}
                        </div>
                        <div className="column" style={{ 
                            display: 'flex', 
                            flexDirection: 'column', 
                            alignItems: 'flex-end', 
                            marginRight: '10px', 
                            minHeight: '130px',
                            fontFamily: 'Arial, sans-serif'
                        }}>
                            {Array.from({ length: 5 }, (_, index) => {
                                const missionNumber = index + 6;
                                return (
                                    <label 
                                        key={index + 5} 
                                        style={{ 
                                            marginBottom: '0px',
                                            textDecoration: selectedMissions[index + 5] ? 'underline' : 'none',
                                            textShadow: selectedMissions[index + 5] ? '0 0 5px var(--button-color)' : 'none',
                                            cursor: 'pointer',
                                            textAlign: 'center',
                                            display: 'flex',
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent: 'flex-end',
                                            fontFamily: 'Arial, sans-serif'
                                        }}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedMissions[index + 5]}
                                            style={{
                                                display: autoMissionAllocation ? 'none' : 'block',
                                                marginRight: '5px'
                                            }}
                                            onChange={() => handleCheckboxChange(index + 5)}
                                        />
                                        <span style={{ 
                                            color: autoMissionAllocation ? 'grey' : 'var(--mission-text-color)',
                                            fontFamily: 'Arial, sans-serif'
                                        }}>
                                            Mission {index + 6}
                                        </span>
                                        {getMissionPreview(index + 5)}
                                    </label>
                                );
                            })}
                        </div>
                        <div className="column" style={{ 
                            display: 'flex', 
                            flexDirection: 'column', 
                            alignItems: 'flex-end', 
                            marginRight: '10px', 
                            minHeight: '130px',
                            fontFamily: 'Arial, sans-serif'
                        }}>
                            {Array.from({ length: 5 }, (_, index) => {
                                const missionNumber = index + 11;
                                return (
                                    <label 
                                        key={index + 10} 
                                        style={{ 
                                            marginBottom: '0px',
                                            textDecoration: selectedMissions[index + 10] ? 'underline' : 'none',
                                            textShadow: selectedMissions[index + 10] ? '0 0 5px var(--button-color)' : 'none',
                                            cursor: 'pointer',
                                            textAlign: 'center',
                                            display: 'flex',
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent: 'flex-end',
                                            fontFamily: 'Arial, sans-serif'
                                        }}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedMissions[index + 10]}
                                            style={{
                                                display: autoMissionAllocation ? 'none' : 'block',
                                                marginRight: '5px'
                                            }}
                                            onChange={() => handleCheckboxChange(index + 10)}
                                        />
                                        <span style={{ 
                                            color: autoMissionAllocation ? 'grey' : 'var(--mission-text-color)',
                                            fontFamily: 'Arial, sans-serif'
                                        }}>
                                            Mission {index + 11}
                                        </span>
                                        {getMissionPreview(index + 10)}
                                    </label>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>

            {/* Commodity and Amount Form */}
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
                    <input
                        type="text"
                        className="amount-input"
                        ref={amountInputRef}
                        onKeyDown={(e) => {
                            if (e.key.toUpperCase() === nextMissionHotkey.toUpperCase() && autoMissionAllocation) {
                                unlockMission();
                            }
                        }}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                addEntry();
                            }
                            // Only allow numbers and prevent other characters
                            if (!/^\d$/.test(e.key)) {
                                e.preventDefault();
                            }
                        }}
                    />
                </div>
                <div className="form-group button-group">
                    <button className="add-entry-button" onClick={addEntry}>Add Entry</button>
                    <button className="table-view-button" onClick={toggleTableView}>
                        {isAlternateTable ? 'Manifest' : 'Missions'}
                    </button>
                    <button className="process-orders-button" onClick={addToHistoryFromManifest}>Process Order</button>
                    <form onSubmit={(e) => e.preventDefault()}>
                        <button
                            type="button"
                            className="clear-log-button"
                            onClick={handleClearLog}
                        >
                            Clear Log
                        </button>
                    </form>
                    <label htmlFor="scuTotal">Total SCU:</label>
                    <input
                        id="scuTotal"
                        type="text"
                        value={calculateTotalSCU()}
                        readOnly
                        className="scu-total-input"
                    />
                </div>
            </div>

            {/* Table Label */}
            <div style={{ width: '100%', textAlign: 'center' }}>
                <h2 style={{ 
                    color: 'var(--title-color)', 
                    margin: '2px auto',
                    padding: '0 10px 2px',
                    display: 'inline-block',
                    borderBottom: '2px solid var(--title-color)'
                }}>
                    {isAlternateTable ? 'Missions Manifest' : 'Hauling Manifest'}
                </h2>
            </div>

            {/* Table Container */}
            <div className="table-container">
                {isAlternateTable ? (
                    // Mission View
                    (() => {
                        const maxMissionIndex = Math.max(
                            ...missionEntries.map((_, index) => index),
                            ...Object.keys(missionRewards)
                                .map(key => parseInt(key.replace('mission_', '')))
                                .filter(num => !isNaN(num))
                        );
                        
                        return Array.from({ length: Math.max(maxMissionIndex + 2, 1) }, (_, missionIndex) => {
                            // Only show mission if it has entries or a reward
                            const hasMissionEntries = missionEntries[missionIndex]?.length > 0;
                            const hasReward = missionRewards[`mission_${missionIndex}`];
                            
                            if (!hasMissionEntries && hasReward) {
                                // Clear the reward if the mission has no entries
                                setMissionRewards(prev => {
                                    const updated = { ...prev };
                                    delete updated[`mission_${missionIndex}`];
                                    localStorage.setItem('missionRewards', JSON.stringify(updated));
                                    return updated;
                                });
                            }

                            if (!hasMissionEntries && !hasReward) return null;

                            return (
                                <div key={missionIndex}>
                                    <div className="drop-off-header" onClick={() => toggleMissionCollapse(missionIndex)}>
                                        <div className="left-box">
                                            <span>Mission {missionIndex + 1}</span>
                                        </div>
                                        <div className="right-box">
                                            <div className="reward-input-container">
                                                <input
                                                    type="text"
                                                    className="mission-reward-mission-table"
                                                    placeholder="Enter reward"
                                                    value={hasMissionEntries ? 
                                                        (missionRewards[`mission_${missionIndex}`] || '').replace(/\B(?=(\d{3})+(?!\d))/g, ',') : 
                                                        ''}
                                                    onChange={(e) => handleRewardChange(`mission_${missionIndex}`, e.target.value)}
                                                    onClick={(e) => e.stopPropagation()}
                                                />
                                                <span className="currency-label">aUEC</span>
                                            </div>
                                            <span className="collapse-arrow">{collapsedMissions[missionIndex] ? '▲' : '▼'}</span>
                                        </div>
                                    </div>
                                    {!collapsedMissions[missionIndex] && (
                                        <table className="hauling-mission-table">
                                            <thead>
                                                <tr>
                                                    <th>Drop off points</th>
                                                    <th>Commodity</th>
                                                    <th style={{ width: `${Math.max(50, ...missionEntries[missionIndex]?.map(entry => entry.currentAmount.length * 8) || [50])}px` }}>QTY</th>
                                                    <th>Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {missionEntries[missionIndex]?.map((entry, index) => (
                                                    <tr key={index}>
                                                        <td>{entry.dropOffPoint}</td>
                                                        <td>{entry.commodity}</td>
                                                        <td style={{ width: `${Math.max(50, entry.currentAmount.length * 8)}px` }}>
                                                            {formatAmount(entry.currentAmount, entry.originalAmount)}
                                                        </td>
                                                        <td className="status">
                                                            <span 
                                                                onClick={() => {
                                                                    const newStatus = entry.status === 'Pending' ? 'Delivered' : 'Pending';
                                                                    setEntries(prevEntries => {
                                                                        const updatedEntries = [...prevEntries];
                                                                        const entryIndex = updatedEntries.findIndex(e => e.id === entry.id);
                                                                        if (entryIndex !== -1) {
                                                                            updatedEntries[entryIndex].status = newStatus;
                                                                        }
                                                                        return updatedEntries;
                                                                    });

                                                                    setMissionEntries(prevMissionEntries => {
                                                                        const updatedMissionEntries = [...prevMissionEntries];
                                                                        updatedMissionEntries.forEach((mission, missionIndex) => {
                                                                            if (mission) {
                                                                                const missionEntryIndex = mission.findIndex(e => e.id === entry.id);
                                                                                if (missionEntryIndex !== -1) {
                                                                                    updatedMissionEntries[missionIndex][missionEntryIndex].status = newStatus;
                                                                                }
                                                                            }
                                                                        });
                                                                        return updatedMissionEntries;
                                                                    });
                                                                }}
                                                                style={{ 
                                                                    cursor: 'pointer',
                                                                    color: entry.status === 'Delivered' ? 'green' : 'inherit',
                                                                    textDecoration: entry.status === 'Delivered' ? 'underline' : 'none'
                                                                }}
                                                            >
                                                                {entry.status}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    )}
                                </div>
                            );
                        });
                    })()
                ) : (
                    // Manifest View
                    Object.keys(entries.reduce((acc, entry) => {
                        acc[entry.dropOffPoint] = true;
                        return acc;
                    }, {})).map(dropOffPoint => (
                        <div key={dropOffPoint}>
                            <div className="drop-off-header" onClick={() => toggleCollapse(dropOffPoint)}>
                                <div className="left-box">
                                    <div className="sort-buttons">
                                        <button 
                                            className="sort-button" 
                                            onClick={(e) => {
                                                e.stopPropagation(); // Prevent the header click from firing
                                                moveDropOffPoint(dropOffPoint, -1); // Move up
                                            }}
                                            style={{
                                                padding: '4px 8px',
                                                backgroundColor: 'var(--button-color)',
                                                color: 'black',
                                                border: 'none',
                                                borderRadius: '4px',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            ▲
                                        </button>
                                        <button 
                                            className="sort-button" 
                                            onClick={(e) => {
                                                e.stopPropagation(); // Prevent the header click from firing
                                                moveDropOffPoint(dropOffPoint, 1); // Move down
                                            }}
                                            style={{
                                                padding: '4px 8px',
                                                backgroundColor: 'var(--button-color)',
                                                color: 'black',
                                                border: 'none',
                                                borderRadius: '4px',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            ▼
                                        </button>
                                    </div>
                                    <span>{dropOffPoint}</span>
                                    <span style={{ fontSize: 'small', marginLeft: '10px' }}>
                                        ({entries.find(entry => entry.dropOffPoint === dropOffPoint)?.planet} - 
                                        {entries.find(entry => entry.dropOffPoint === dropOffPoint)?.moon})
                                    </span>
                                </div>
                                <div className="right-box">
                                    <span>{collapsed[dropOffPoint] ? '▲' : '▼'}</span>
                                    <button onClick={(e) => { 
                                        e.stopPropagation(); 
                                        markAsDelivered(dropOffPoint, entries.filter(entry => entry.dropOffPoint === dropOffPoint).map(entry => entry.id)); 
                                    }}>
                                        Cargo Delivered
                                    </button>
                                </div>
                            </div>
                            {!collapsed[dropOffPoint] && (
                                <table className="hauling-manifest-table">
                                    <thead>
                                        <tr>
                                            <th className="pickup">Pickup</th>
                                            <th className="commodity">Commodity</th>
                                            <th className="amount" style={{ 
                                                width: `${Math.max(50, ...entries
                                                    .filter(entry => entry.dropOffPoint === dropOffPoint)
                                                    .map(entry => {
                                                        // Handle both amount and currentAmount
                                                        const value = entry.currentAmount || entry.amount || '';
                                                        return value.toString().length * 8;
                                                    })
                                                )}px`
                                            }}>QTY</th>
                                            <th className="actions">Actions</th>
                                            <th className="status">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {entries.filter(entry => entry.dropOffPoint === dropOffPoint).map((entry, index) => {
                                            // Calculate the absolute index in the entries array
                                            const absoluteIndex = entries.findIndex(e => e.id === entry.id);
                                            
                                            return (
                                            <tr key={index}>
                                                <td className="pickup">{entry.pickup}</td>
                                                <td className="commodity">{entry.commodity}</td>
                                                <td className="amount">
                                                    {formatAmount(entry.currentAmount, entry.originalAmount)}
                                                </td>
                                                <td className="actions">
                                                    <input
                                                        type="text"
                                                        defaultValue={entry.currentAmount}
                                                        size="10"
                                                        onChange={(e) => {
                                                            updateCargo(absoluteIndex, e.target.value);
                                                        }}
                                                        onKeyPress={(e) => handleAmountKeyPress(e, absoluteIndex)}
                                                    />
                                                    <button onClick={() => updateCargo(absoluteIndex, entry.currentAmount)}>Update Cargo</button>
                                                    <button className="remove-cargo-button" onClick={() => removeCargo(absoluteIndex)}>Remove Cargo</button>
                                                </td>
                                                <td className="status">
                                                    <span 
                                                        onClick={() => {
                                                            const newStatus = entry.status === 'Pending' ? 'Delivered' : 'Pending';
                                                            setEntries(prevEntries => {
                                                                const updatedEntries = [...prevEntries];
                                                                const entryIndex = updatedEntries.findIndex(e => e.id === entry.id);
                                                                if (entryIndex !== -1) {
                                                                    updatedEntries[entryIndex].status = newStatus;
                                                                }
                                                                return updatedEntries;
                                                            });

                                                            setMissionEntries(prevMissionEntries => {
                                                                const updatedMissionEntries = [...prevMissionEntries];
                                                                updatedMissionEntries.forEach((mission, missionIndex) => {
                                                                    if (mission) {
                                                                        const missionEntryIndex = mission.findIndex(e => e.id === entry.id);
                                                                        if (missionEntryIndex !== -1) {
                                                                            updatedMissionEntries[missionIndex][missionEntryIndex].status = newStatus;
                                                                        }
                                                                    }
                                                                });
                                                                return updatedMissionEntries;
                                                            });
                                                        }}
                                                        style={{ 
                                                            cursor: 'pointer',
                                                            color: entry.status === 'Delivered' ? 'green' : 'inherit',
                                                            textDecoration: entry.status === 'Delivered' ? 'underline' : 'none'
                                                        }}
                                                    >
                                                        {entry.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        );})}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* Advanced View Save Popup */}
            {showAdvancedSavePopup && (
                <div style={{
                    position: 'fixed',
                    top: '0',
                    left: '0',
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1001
                }}>
                    <div style={{
                        backgroundColor: 'var(--background-color)',
                        padding: '20px',
                        borderRadius: '8px',
                        width: '400px'
                    }}>
                        <h3>Save Route Preset</h3>
                        <input
                            type="text"
                            value={presetName}
                            onChange={(e) => setPresetName(e.target.value)}
                            placeholder="Enter preset name"
                            style={{
                                width: '100%',
                                padding: '8px',
                                marginBottom: '10px',
                                borderRadius: '4px',
                                border: '1px solid #ccc',
                                color: 'var(--dropdown-label-color)'
                            }}
                        />
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button 
                                onClick={handleAdvancedSave}
                                style={{
                                    padding: '8px 16px',
                                    backgroundColor: 'var(--button-color)',
                                    color: 'black',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    flex: 1
                                }}
                            >
                                {routePresets.some(p => p.label.toLowerCase() === presetName.toLowerCase()) 
                                    ? 'Overwrite' 
                                    : 'Save'}
                            </button>
                            <button 
                                onClick={() => setShowAdvancedSavePopup(false)}
                                style={{
                                    padding: '8px 16px',
                                    backgroundColor: '#ccc',
                                    color: 'black',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    flex: 1
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showClearConfirmation && (
                <div style={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: 'var(--background-color)',
                    padding: '20px',
                    borderRadius: '8px',
                    width: '400px',
                    zIndex: 1001,
                    boxShadow: '0 0 20px rgba(0,0,0,0.3)',
                    border: '3px solid var(--table-outline-color)'
                }}>
                    <h3>Clear Log Confirmation</h3>
                    <p>Are you sure you want to clear the log? This action cannot be undone.</p>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button 
                            onClick={() => {
                                logProcessOrders(debugFlags, 'Clearing log');
                                setEntries([]);
                                setMissionEntries(Array(20).fill(null));
                                setMissionRewards({});
                                localStorage.removeItem('entries');
                                localStorage.removeItem('missionEntries');
                                localStorage.removeItem('missionRewards');
                                lockedMissionIndex.current = null;
                                forceUpdate();
                                setShowClearConfirmation(false);
                            }}
                            style={{
                                padding: '8px 16px',
                                backgroundColor: '#ff4444',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                flex: 1
                            }}
                        >
                            Yes, Clear Log
                        </button>
                        <button 
                            onClick={() => setShowClearConfirmation(false)}
                            style={{
                                padding: '8px 16px',
                                backgroundColor: '#ccc',
                                color: 'black',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                flex: 1
                            }}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
};

const handleSystemChange = (system) => {
    // Update the current system state
    setCurrentSystem(system);
    
    // Clear dropdown values if switching to Pyro
    if (system === 'Pyro') {
        setFirstDropdownValue(null);
        setSecondDropdownValue(null);
    }
    
    // Update any other necessary state based on the system change
    setSelectedPlanet(null);
    setSelectedMoon(null);
    setSelectedDropOffPoint(null);
    
    // You might also want to clear some other state here
    setEntries([]);
    setMissionEntries([]);
    
    // Save the selected system to localStorage if needed
    localStorage.setItem('selectedSystem', system);
};

const handleQuickLookupChange = (option) => {
    if (!option || !option.value) return;

    try {
        // Check if the location exists in Stanton system data
        const isStantonLocation = StantonSystemData.FullList.includes(option.value);
        
        // Check if the location exists in Pyro system data
        const isPyroLocation = PyroSystemData.FullList.includes(option.value);

        // Update system state based on location
        if (isStantonLocation) {
            handleSystemChange('Stanton');
        } else if (isPyroLocation) {
            handleSystemChange('Pyro');
        }

        // Get the current system data based on the selected system
        const currentSystemData = isStantonLocation ? StantonSystemData : PyroSystemData;

        // Now set the location type and planet/moon
        let found = false;
        
        // First check stations
        if (Array.isArray(currentSystemData.stations) && 
            currentSystemData.stations.includes(option.value)) {
            setLocationType('station');
            setSelectedPlanet(null);
            setSelectedMoon(null);
            found = true;
        }
        
        // Then check planets
        if (!found && currentSystemData.Dropoffpoints) {
            for (const planet in currentSystemData.Dropoffpoints) {
                const dropOffPoints = currentSystemData.Dropoffpoints[planet];
                
                // Handle both array and object cases
                if (Array.isArray(dropOffPoints)) {
                    if (dropOffPoints.includes(option.value)) {
                        setLocationType('planet');
                        setSelectedPlanet(planet);
                        setSelectedMoon(null);
                        found = true;
                        break;
                    }
                } else if (typeof dropOffPoints === 'object' && dropOffPoints !== null) {
                    // Handle object case (like in Pyro V)
                    for (const moon in dropOffPoints) {
                        if (Array.isArray(dropOffPoints[moon]) && 
                            dropOffPoints[moon].includes(option.value)) {
                            setLocationType('planet');
                            setSelectedPlanet(planet);
                            setSelectedMoon(moon);
                            found = true;
                            break;
                        }
                    }
                    if (found) break;
                }
            }
        }

        // Update the selected location
        setSecondDropdownValue(option.value);
        
        // Focus on the amount input
        if (amountInputRef.current) {
            amountInputRef.current.focus();
        }
    } catch (error) {
        console.error('Error in handleQuickLookupChange:', error);
        showBannerMessage('Error processing location selection');
    }
};

// Find the removeCargo function and modify it to handle mission entries
const removeCargo = (index) => {
    const entryToRemove = entries[index];
    
    // Create a map of entries by drop-off point
    const entriesByDropOff = entries.reduce((acc, entry) => {
        if (!acc[entry.dropOffPoint]) {
            acc[entry.dropOffPoint] = [];
        }
        acc[entry.dropOffPoint].push(entry);
        return acc;
    }, {});

    // Remove the specific entry from its drop-off point group
    if (entriesByDropOff[entryToRemove.dropOffPoint]) {
        entriesByDropOff[entryToRemove.dropOffPoint] = entriesByDropOff[entryToRemove.dropOffPoint]
            .filter(entry => entry.id !== entryToRemove.id);
    }

    // Rebuild the entries array while maintaining drop-off point order
    const updatedEntries = Object.keys(entriesByDropOff).flatMap(dropOffPoint => 
        entriesByDropOff[dropOffPoint]
    );

    // Update the entries state
    setEntries(updatedEntries);
    localStorage.setItem('entries', JSON.stringify(updatedEntries));

    // Handle mission entries differently for capture tab missions
    if (entryToRemove?.missionIndex !== null && entryToRemove?.missionIndex !== undefined) {
        setMissionEntries(prevMissionEntries => {
            const updatedMissionEntries = [...prevMissionEntries];
            
            // Special handling for capture tab missions
            if (entryToRemove.isCaptureMission) {
                // Find the mission group
                const missionGroup = updatedMissionEntries[entryToRemove.missionIndex];
                if (missionGroup) {
                    // Remove the specific entry from the mission group
                    updatedMissionEntries[entryToRemove.missionIndex] = missionGroup
                        .filter(missionEntry => missionEntry.id !== entryToRemove.id);
                    
                    // If the mission group is now empty, set it to null
                    if (updatedMissionEntries[entryToRemove.missionIndex].length === 0) {
                        updatedMissionEntries[entryToRemove.missionIndex] = null;
                        
                        // Unlock if this was the locked mission
                        if (lockedMissionIndex.current === entryToRemove.missionIndex) {
                            lockedMissionIndex.current = null;
                        }
                    }
                }
            } else {
                // Handle regular mission entries
                if (updatedMissionEntries[entryToRemove.missionIndex]?.length > 0) {
                    updatedMissionEntries[entryToRemove.missionIndex] = updatedMissionEntries[entryToRemove.missionIndex]
                        .filter(missionEntry => missionEntry.id !== entryToRemove.id);
                    
                    if (updatedMissionEntries[entryToRemove.missionIndex].length === 0) {
                        updatedMissionEntries[entryToRemove.missionIndex] = null;
                        
                        if (lockedMissionIndex.current === entryToRemove.missionIndex) {
                            lockedMissionIndex.current = null;
                        }
                    }
                }
            }
            
            localStorage.setItem('missionEntries', JSON.stringify(updatedMissionEntries));
            return updatedMissionEntries;
        });
    }
};

// Update the handlePickupPointChange function
const handlePickupPointChange = (option) => {
    if (!option || !option.value) return;

    const location = option.value;
    console.log('Pickup point selected:', location);
    
    // Only validate if there's a location value
    if (location && location.trim() !== '') {
        const validation = validatePickupPoint(location, selectedSystem);
        
        if (!validation.isValid) {
            showBannerMessage(validation.message, false);
        }
    }

    setFirstDropdownValue(location);
    
    // Focus on the amount input
    if (amountInputRef.current) {
        amountInputRef.current.focus();
    }
};