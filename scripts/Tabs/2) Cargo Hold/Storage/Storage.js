import React, { useState, useEffect } from 'react';
import allCommodities from '../../../utils/Commodities/AllCommodities.js';
import allCommoditiesCodes from '../../../utils/Commodities/AllCommoditiesCodes.js';
import illegalCommodities from '../../../utils/Commodities/IillegalCommodities.js';
import '../../../../styles/Storage.css'; // Corrected import path
import Select from 'react-select';
import { useShipContext } from '../../../utils/Ships/ShipContext';

const Storage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCommodities, setSelectedCommodities] = useState(() => {
        const savedCommodities = localStorage.getItem('cargoCommodities');
        return savedCommodities ? JSON.parse(savedCommodities) : [];
    });
    const [expandedPanels, setExpandedPanels] = useState({});
    const [showCommodities, setShowCommodities] = useState(true);
    const [showIllegalCommodities, setShowIllegalCommodities] = useState(true);
    const [selectedOption, setSelectedOption] = useState(() => {
        const savedOption = localStorage.getItem('selectedStorageOption');
        return savedOption ? JSON.parse(savedOption) : { 
            value: 'general-storage', 
            label: 'General Storage' 
        };
    });
    const [quickDeleteEnabled, setQuickDeleteEnabled] = useState(false);
    const [isManifestView, setIsManifestView] = useState(false);
    const { ships, cargoData, updateCargo } = useShipContext();

    useEffect(() => {
        localStorage.setItem('cargoCommodities', JSON.stringify(selectedCommodities));
    }, [selectedCommodities]);

    useEffect(() => {
        localStorage.setItem('selectedStorageOption', JSON.stringify(selectedOption));
    }, [selectedOption]);

    const shipOptions = [
        {
            value: 'general-storage',
            label: 'General Storage'
        },
        ...ships.reduce((acc, ship) => {
            // Count how many times this ship name appears
            const count = ships.filter(s => s.name === ship.name).length;
            
            // Only add numbering if there are duplicates
            if (count > 1) {
                // Find how many times this ship name has already been added
                const existingCount = acc.filter(opt => opt.label.startsWith(ship.name)).length;
                acc.push({
                    value: ship.id,
                    label: `${ship.name} (${existingCount + 1}) (${ship.cargoCapacity} SCU)`
                });
            } else {
                acc.push({
                    value: ship.id,
                    label: `${ship.name} (${ship.cargoCapacity} SCU)`
                });
            }
            return acc;
        }, [])
    ];

    const currentShipCargo = selectedOption?.value ? 
        (selectedOption.value === 'general-storage' ? 
            cargoData['general-storage'] || [] : 
            cargoData[selectedOption.value] || []) : 
        [];

    const handleCommodityClick = (commodity, index) => {
        if (!selectedOption?.value) return; // Don't allow adding if no ship is selected
        
        const targetState = isManifestView ? selectedCommodities : currentShipCargo;
        const exists = targetState.some(item => item.name === commodity);
        if (!exists) {
            const initialSCU = {
                scu1: 0,
                scu2: 0,
                scu4: 0,
                scu8: 0,
                scu16: 0,
                scu32: 0,
                scu: 0
            };
            const newCommodity = { 
                name: commodity,
                code: allCommoditiesCodes[index],
                ...initialSCU,
                id: Date.now()
            };
            
            if (isManifestView) {
                setSelectedCommodities(prev => [...prev, newCommodity]);
            } else {
                updateCargo(selectedOption.value, [...(cargoData[selectedOption.value] || []), newCommodity]);
            }
        }
    };

    const handleSCUChange = (id, scuValue, isRightClick = false) => {
        if (!selectedOption?.value) return;
        
        const updateFunction = (prevCommodities) => 
            prevCommodities.map(item => {
                if (item.id === id) {
                    const currentCount = item[`scu${scuValue}`] || 0;
                    const updatedCount = isRightClick 
                        ? Math.max(0, currentCount - 1)
                        : currentCount + 1;
                    
                    const totalSCU = [1, 2, 4, 8, 16, 32].reduce((total, scuType) => {
                        const count = scuType === scuValue ? updatedCount : (item[`scu${scuType}`] || 0);
                        return total + (count * scuType);
                    }, 0);

                    return { 
                        ...item, 
                        [`scu${scuValue}`]: updatedCount,
                        scu: totalSCU
                    };
                }
                return item;
            });
        
        if (isManifestView) {
            setSelectedCommodities(updateFunction);
        } else {
            updateCargo(selectedOption.value, updateFunction(cargoData[selectedOption.value] || []));
        }
    };

    const handleRemoveCommodity = (id) => {
        if (!selectedOption?.value) return;
        
        if (!quickDeleteEnabled) {
            const confirmRemove = window.confirm('Are you sure you want to remove this commodity?');
            if (!confirmRemove) return;
        }

        if (isManifestView) {
            setSelectedCommodities(prev => prev.filter(item => item.id !== id));
        } else {
            updateCargo(selectedOption.value, (cargoData[selectedOption.value] || []).filter(item => item.id !== id));
        }
    };

    const togglePanel = (id) => {
        if (isManifestView) {
            setExpandedPanels(prev => {
                const isCurrentlyOpen = prev[id];
                const clickedCommodity = (isManifestView ? selectedCommodities : currentShipCargo)
                    .find(item => item.id === id);
                
                console.log('Manifest View - Panel Clicked:', {
                    clickedCommodity: clickedCommodity?.name || 'Unknown',
                    clickedId: id,
                    action: isCurrentlyOpen ? 'Closing' : 'Opening',
                    currentlyOpenPanels: Object.keys(prev).map(key => {
                        const c = (isManifestView ? selectedCommodities : currentShipCargo)
                            .find(item => item.id === key);
                        return c ? `${c.name} (${key})` : 'Unknown';
                    })
                });

                // Toggle the clicked panel while keeping others open
                return {
                    ...prev,
                    [id]: !isCurrentlyOpen
                };
            });
        } else {
            // Cargo view logic remains the same
            setExpandedPanels(prev => ({
                ...prev,
                [id]: !prev[id]
            }));
        }
    };

    const filteredCommodities = allCommodities.filter(commodity =>
        commodity.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredIllegalCommodities = illegalCommodities.filter(commodity =>
        commodity.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleManifestViewToggle = () => {
        if (!isManifestView) {
            // Load manifest data when switching to manifest view
            const entries = localStorage.getItem('entries');
            
            if (!entries) {
                alert('Please open the Hauling Missions tab first to load the manifest data.');
                return;
            }

            try {
                const parsedData = JSON.parse(entries);
                
                if (!Array.isArray(parsedData)) {
                    alert('Mission entries data is not in the expected format. Please refresh the Hauling Missions tab.');
                    return;
                }

                // Process manifest data
                const manifestCommodities = parsedData.flat()
                    .filter(entry => entry.commodity && entry.currentAmount)
                    .map(entry => ({
                        name: entry.commodity,
                        quantity: parseInt(entry.currentAmount, 10) || 0
                    }));

                // Combine duplicate commodities
                const combinedCommodities = manifestCommodities.reduce((acc, curr) => {
                    const existing = acc.find(item => item.name === curr.name);
                    if (existing) {
                        existing.quantity += curr.quantity;
                    } else {
                        acc.push({...curr});
                    }
                    return acc;
                }, []);

                // Convert to selected commodities format
                const newCommodities = combinedCommodities.map((commodity, index) => {
                    const commodityIndex = allCommodities.indexOf(commodity.name);
                    const code = commodityIndex !== -1 ? allCommoditiesCodes[commodityIndex] : '';
                    
                    // Distribute quantity across SCU units
                    let remainingQuantity = commodity.quantity;
                    const scuCounts = { scu1: 0, scu2: 0, scu4: 0, scu8: 0, scu16: 0, scu32: 0 };
                    
                    [32, 16, 8, 4, 2, 1].forEach(scu => {
                        scuCounts[`scu${scu}`] = Math.floor(remainingQuantity / scu);
                        remainingQuantity = remainingQuantity % scu;
                    });

                    return {
                        name: commodity.name,
                        code,
                        ...scuCounts,
                        scu: commodity.quantity,
                        id: Date.now() + index
                    };
                });

                // Set selected commodities to manifest data
                setSelectedCommodities(newCommodities);
            } catch (error) {
                console.error('Error processing hauling data:', error);
                alert('Error processing hauling data. Please refresh the Hauling Missions tab.');
                return;
            }
        } else {
            // When switching to Cargo View, restore saved cargo entries
            setSelectedCommodities(currentShipCargo);
        }
        setIsManifestView(!isManifestView);
    };

    const currentCommodities = isManifestView ? selectedCommodities : currentShipCargo;

    const handleClearStorage = () => {
        if (!selectedOption?.value) return;
        
        if (!quickDeleteEnabled) {
            const confirmClear = window.confirm('Are you sure you want to clear all commodities?');
            if (!confirmClear) return;
        }

        if (isManifestView) {
            setSelectedCommodities([]);
        } else {
            updateCargo(selectedOption.value, []);
        }
    };

    // Calculate SCU used and available
    const totalSCUUsed = currentCommodities.reduce((sum, item) => sum + (item.scu || 0), 0);
    const selectedShip = ships.find(ship => ship.id === selectedOption?.value);
    const scuAvailable = selectedShip ? selectedShip.cargoCapacity - totalSCUUsed : 0;

    // Add this to handle ship deletion
    const handleShipDeletion = (shipId) => {
        updateCargo(shipId, []);
    };

    // Update cargo using context
    const setCargoViewEntries = (newCargo) => {
        updateCargo(selectedOption.value, newCargo);
    };

    return (
        <div className="storage-container">
            <div className="storage-top-container">
                <div className="ship-select-container">
                    <Select
                        className="storage-select"
                        classNamePrefix="select"
                        value={selectedOption}
                        onChange={setSelectedOption}
                        options={shipOptions}
                        placeholder="Select a ship..."
                        isClearable={true}
                        isSearchable={true}
                    />
                    {selectedShip && (
                        <div className="scu-indicators">
                            <div className="scu-indicator">
                                <span className="scu-label">SCU Used:</span>
                                <span className="scu-value">{totalSCUUsed}</span>
                            </div>
                            <div className="scu-indicator">
                                <span className="scu-label">SCU Available:</span>
                                <span className="scu-value">{scuAvailable}</span>
                            </div>
                        </div>
                    )}
                </div>
                <div className="top-buttons-container">
                    <button 
                        className="top-button"
                        onClick={handleManifestViewToggle}
                    >
                        {isManifestView ? 'Manifest View' : 'Cargo View'}
                    </button>
                    <button 
                        className={`top-button ${quickDeleteEnabled ? 'quick-delete-enabled' : 'quick-delete-disabled'}`}
                        onClick={() => setQuickDeleteEnabled(!quickDeleteEnabled)}
                    >
                        Quick Delete {quickDeleteEnabled ? '✓' : '✗'}
                    </button>
                </div>
            </div>
            <div className="storage-main-content">
                {/* Left Container (40%) */}
                <div className={`storage-left ${isManifestView ? 'manifest-view-disabled' : ''}`}>
                    <div className="search-container">
                        <input
                            type="text"
                            placeholder="Search commodities..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                    </div>
                    <div 
                        className="commodity-grid-title" 
                        style={{ cursor: 'pointer' }}
                    >
                        Commodities {showCommodities ? '▼' : '▶'}
                    </div>

                    {showCommodities && (
                        <div className="commodity-grid">
                            {filteredCommodities.map((commodity, index) => {
                                const isSelected = currentCommodities.some(item => item.name === commodity);
                                return (
                                    <div 
                                        key={`${commodity}-${index}`}
                                        className={`commodity-block ${isSelected ? 'selected' : ''} ${isManifestView ? 'manifest-view-disabled-block' : ''}`}
                                        onClick={!isManifestView ? () => handleCommodityClick(commodity, index) : undefined}
                                        style={{ cursor: isManifestView ? 'default' : 'pointer' }}
                                    >
                                        <span className="commodity-name">{commodity}</span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                    <div 
                        className="illegal-commodity-grid-title" 
                        style={{ cursor: 'pointer' }}
                    >
                        Illegal Commodities {showIllegalCommodities ? '▼' : '▶'}
                    </div>

                    {showIllegalCommodities && (
                        <div className="commodity-grid">
                            {filteredIllegalCommodities.map((commodity, index) => {
                                const isSelected = currentCommodities.some(item => item.name === commodity);
                                return (
                                    <div 
                                        key={`${commodity}-${index}`}
                                        className={`commodity-block ${isSelected ? 'selected' : ''} ${isManifestView ? 'manifest-view-disabled-block' : ''}`}
                                        onClick={!isManifestView ? () => handleCommodityClick(commodity, index) : undefined}
                                        style={{ cursor: isManifestView ? 'default' : 'pointer' }}
                                    >
                                        <span className="commodity-name">{commodity}</span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
                
                {/* Right Container (60%) */}
                {isManifestView ? (
                    <div className="storage-right">
                        <div className="storage-header">
                            <h2>Hauling Manifest</h2>
                            <div className="header-buttons">
                                <div className="total-summary">
                                    <span>Total SCU:</span>
                                    <span className="total-value">
                                        {currentCommodities.reduce((sum, item) => sum + (item.scu || 0), 0)}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="commodity-list">
                            {currentCommodities.length > 0 ? (
                                currentCommodities.map((commodity) => (
                                    <div key={`${commodity.id}-${commodity.name}`} className="commodity-panel">
                                        <div 
                                            className="panel-header" 
                                            onClick={() => {
                                                console.log('Panel Header Clicked - Commodity:', commodity.name, 'ID:', commodity.id);
                                                togglePanel(commodity.id);
                                            }}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <span className="commodity-name">{commodity.name}</span>
                                            <div className="panel-header-right">
                                                <div className="commodity-total">
                                                    <span>Total:</span>
                                                    <span className="total-value">{commodity.scu} SCU</span>
                                                </div>
                                                <button 
                                                    className="close-button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (!quickDeleteEnabled && !window.confirm('Are you sure you want to remove this commodity?')) {
                                                            return;
                                                        }
                                                        handleRemoveCommodity(commodity.id);
                                                    }}
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        </div>
                                        {expandedPanels[commodity.id] && (
                                            <div className="scu-control-panel">
                                                {isManifestView ? (
                                                    <>
                                                        <div className="manifest-scu-totals">
                                                            {[1, 2, 4, 8, 16, 32].map(scu => (
                                                                <div key={`total-${scu}`} className="manifest-scu-total">
                                                                    <div className="manifest-scu-total-label">{scu} SCU</div>
                                                                    <div className="manifest-scu-total-value">
                                                                        {commodity[`scu${scu}`] || 0}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div className="scu-grid">
                                                        {[1, 2, 4, 8, 16, 32].map(scu => (
                                                            <div key={`${commodity.id}-${scu}`} className="scu-unit">
                                                                <div className="scu-controls">
                                                                    <button
                                                                        className="scu-button"
                                                                        onClick={(e) => {
                                                                            e.preventDefault();
                                                                            handleSCUChange(commodity.id, scu);
                                                                        }}
                                                                        onContextMenu={(e) => {
                                                                            e.preventDefault();
                                                                            handleSCUChange(commodity.id, scu, true);
                                                                        }}
                                                                    >
                                                                        {scu} SCU
                                                                    </button>
                                                                </div>
                                                                <div className="scu-count">
                                                                    <span>{commodity[`scu${scu}`] || 0}</span>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="no-commodities-message">
                                    No commodities selected. Add some from the left panel.
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="storage-right">
                        <div className="storage-header">
                            <h2>Selected Commodities</h2>
                            <button 
                                className="clear-commodity-storage"
                                onClick={handleClearStorage}
                            >
                                Clear Storage Table
                            </button>
                            <div className="header-buttons">
                                <div className="total-summary">
                                    <span>Total SCU:</span>
                                    <span className="total-value">
                                        {currentCommodities.reduce((sum, item) => sum + (item.scu || 0), 0)}
                                    </span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="commodity-list">
                            {currentCommodities.length > 0 ? (
                                currentCommodities.map((commodity) => (
                                    <div key={`${commodity.id}-${commodity.name}`} className="commodity-panel">
                                        <div 
                                            className="panel-header" 
                                            onClick={() => {
                                                console.log('Panel Header Clicked - Commodity:', commodity.name, 'ID:', commodity.id);
                                                togglePanel(commodity.id);
                                            }}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <span className="commodity-name">{commodity.name}</span>
                                            <div className="panel-header-right">
                                                <div className="commodity-total">
                                                    <span>Total:</span>
                                                    <span className="total-value">{commodity.scu} SCU</span>
                                                </div>
                                                <button 
                                                    className="close-button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (!quickDeleteEnabled && !window.confirm('Are you sure you want to remove this commodity?')) {
                                                            return;
                                                        }
                                                        handleRemoveCommodity(commodity.id);
                                                    }}
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        </div>
                                        {expandedPanels[commodity.id] && (
                                            <div className="scu-control-panel">
                                                {isManifestView ? (
                                                    <div className="manifest-scu-grid">
                                                        {[1, 2, 4, 8, 16, 32].map(scu => (
                                                            <div key={`${commodity.id}-${scu}`} className="manifest-scu-unit">
                                                                <div className="manifest-scu-display-box">
                                                                    <span>{commodity[`scu${scu}`] || 0} x {scu} SCU</span>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="scu-grid">
                                                        {[1, 2, 4, 8, 16, 32].map(scu => (
                                                            <div key={`${commodity.id}-${scu}`} className="scu-unit">
                                                                <div className="scu-controls">
                                                                    <button
                                                                        className="scu-button"
                                                                        onClick={(e) => {
                                                                            e.preventDefault();
                                                                            handleSCUChange(commodity.id, scu);
                                                                        }}
                                                                        onContextMenu={(e) => {
                                                                            e.preventDefault();
                                                                            handleSCUChange(commodity.id, scu, true);
                                                                        }}
                                                                    >
                                                                        {scu} SCU
                                                                    </button>
                                                                </div>
                                                                <div className="scu-count">
                                                                    <span>{commodity[`scu${scu}`] || 0}</span>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="no-commodities-message">
                                    No commodities selected. Add some from the left panel.
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Storage; 