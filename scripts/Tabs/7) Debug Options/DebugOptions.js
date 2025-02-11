import React, { useState, useEffect } from 'react';
import './DebugOptions.css';

export const DEBUG_FLAGS = {
    OCR_LOGGING: 'ocrLogging',
    STREAM_LOGGING: 'streamLogging',
    HAULING_MISSIONS: {
        ADD_ENTRY: 'haulingMissions.addEntry',
        PROCESS_ORDERS: 'haulingMissions.processOrders',
        MISSION_GROUPING: 'haulingMissions.missionGrouping',
        STATUS_CHANGES: 'haulingMissions.statusChanges'
    }
};

export const DebugOptions = () => {
    // Debug flags for different areas
    const [debugFlags, setDebugFlags] = useState(() => {
        const savedFlags = localStorage.getItem('debugFlags');
        return savedFlags ? JSON.parse(savedFlags) : {
            // OCR Debug Options
            ocrLogging: true,
            streamLogging: true,
            
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

    // Save debug flags to localStorage when they change
    useEffect(() => {
        localStorage.setItem('debugFlags', JSON.stringify(debugFlags));
    }, [debugFlags]);

    // Handle checkbox changes
    const handleFlagChange = (category, flag) => {
        setDebugFlags(prev => ({
            ...prev,
            [category]: {
                ...prev[category],
                [flag]: !prev[category][flag]
            }
        }));
    };

    // Modify renderCategory to handle both flat and nested flags
    const renderCategory = (categoryName, category) => {
        if (typeof category !== 'object' || category === null) {
            // Handle flat flags (like ocrLogging)
            return (
                <div className="debug-category">
                    <div className="debug-option">
                        <label>
                            <input
                                type="checkbox"
                                checked={category}
                                onChange={() => handleFlatFlagChange(categoryName)}
                            />
                            {/* Format the category name properly */}
                            {typeof categoryName === 'string' 
                                ? categoryName.replace(/([A-Z])/g, ' $1').toLowerCase()
                                : categoryName}
                        </label>
                    </div>
                </div>
            );
        }

        // Handle nested flags (existing structure)
        return (
            <div className="debug-category">
                <h3>{typeof categoryName === 'string' 
                    ? categoryName.replace(/([A-Z])/g, ' $1').toLowerCase()
                    : categoryName}</h3>
                {Object.entries(category).map(([flag, enabled]) => (
                    <div key={flag} className="debug-option">
                        <label>
                            <input
                                type="checkbox"
                                checked={enabled}
                                onChange={() => handleNestedFlagChange(categoryName, flag)}
                            />
                            {typeof flag === 'string' 
                                ? flag.replace(/([A-Z])/g, ' $1').toLowerCase()
                                : flag}
                        </label>
                    </div>
                ))}
            </div>
        );
    };

    // Add handler for flat flags
    const handleFlatFlagChange = (flag) => {
        setDebugFlags(prev => ({
            ...prev,
            [flag]: !prev[flag]
        }));
    };

    // Rename existing handler for nested flags
    const handleNestedFlagChange = (category, flag) => {
        setDebugFlags(prev => ({
            ...prev,
            [category]: {
                ...prev[category],
                [flag]: !prev[category][flag]
            }
        }));
    };

    return (
        <div className="debug-options-box">
            <h2>Debug Options</h2>
            <div className="debug-grid">
                {/* Render OCR Debug Options first */}
                <div className="debug-section">
                    <h3>OCR Debug Options</h3>
                    {Object.entries(DEBUG_FLAGS)
                        .filter(([key]) => typeof DEBUG_FLAGS[key] === 'string')
                        .map(([key, value]) => (
                            <div key={`ocr-${key}`}>
                                {renderCategory(value, debugFlags[value])}
                            </div>
                        ))}
                </div>
                
                {/* Render other debug options */}
                {Object.entries(debugFlags)
                    .filter(([key]) => !Object.values(DEBUG_FLAGS).includes(key))
                    .map(([category, flags]) => (
                        <div key={`category-${category}`} className="debug-section">
                            {renderCategory(category, flags)}
                        </div>
                    ))}
            </div>
            <div className="debug-actions">
                <button onClick={() => {
                    const allEnabled = {};
                    Object.keys(debugFlags).forEach(category => {
                        allEnabled[category] = {};
                        Object.keys(debugFlags[category]).forEach(flag => {
                            allEnabled[category][flag] = true;
                        });
                    });
                    setDebugFlags(allEnabled);
                }}>
                    Enable All
                </button>
                <button onClick={() => {
                    const allDisabled = {};
                    Object.keys(debugFlags).forEach(category => {
                        allDisabled[category] = {};
                        Object.keys(debugFlags[category]).forEach(flag => {
                            allDisabled[category][flag] = false;
                        });
                    });
                    setDebugFlags(allDisabled);
                }}>
                    Disable All
                </button>
            </div>
        </div>
    );
};

export const shouldLog = (debugFlags, flag) => {
    if (!debugFlags) return false;
    return debugFlags[flag] === true;
}; 