import React from 'react';

const Tabs = ({ activeTab, setActiveTab }) => {
    const tabs = ['Hauling Missions', 'Cargo Delivery', 'Test Features', 'History', 'Payouts', 'Preferences'];

    return (
        <div className="tabs">
            {tabs.map(tab => (
                <div 
                    key={tab} 
                    className={`tab ${activeTab === tab ? 'active-tab' : ''}`} 
                    onClick={() => setActiveTab(tab)}
                >
                    {tab}
                </div>
            ))}
        </div>
    );
};

export default Tabs; 