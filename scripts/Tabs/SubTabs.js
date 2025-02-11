import React from 'react';

export const SubTabs = ({ 
    mainTab,
    haulingSubTab,
    cargoHoldSubTab,
    handleTabChange,
    handleCargoHoldTabChange,
    handleTooltipClick,
    TAB_DESCRIPTIONS
}) => {
    return (
        <>
            {/* Sub Tabs - Show for Hauling and Cargo Hold */}
            {(mainTab === 'Hauling' || mainTab === 'Cargo Hold') && (
                <div className="tabs">
                    {mainTab === 'Hauling' && (
                        ['Capture', 'Hauling Missions', 'History', 'Payouts'].map(tab => (
                            <div key={tab} className="tab-container">
                                <div 
                                    className={`tab ${haulingSubTab === tab ? 'active-tab' : ''}`} 
                                    onClick={() => handleTabChange(tab)}
                                >
                                    {tab}
                                    <span 
                                        className="tab-info-icon" 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleTooltipClick(e, TAB_DESCRIPTIONS[tab]);
                                        }}
                                        title="!Click me for a Guide on how to use this!"
                                    >
                                        ⓘ
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                    {mainTab === 'Cargo Hold' && (
                        ['Inventory', 'Ships', 'Storage'].map(tab => (
                            <div key={tab} className="tab-container">
                                <div 
                                    className={`tab ${cargoHoldSubTab === tab ? 'active-tab' : ''}`} 
                                    onClick={() => handleCargoHoldTabChange(tab)}
                                >
                                    {tab}
                                    <span 
                                        className="tab-info-icon" 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleTooltipClick(e, TAB_DESCRIPTIONS[tab]);
                                        }}
                                        title="!Click me for a Guide on how to use this!"
                                    >
                                        ⓘ
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </>
    );
}; 