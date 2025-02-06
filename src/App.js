import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Tabs from './components/Tabs';
import HaulingMissions from './components/HaulingMissions';
import Preferences from './components/Preferences';
import History from './components/History';
import TestFeatures from './components/TestFeatures';
import './styles.css';

const App = () => {
    const [darkMode, setDarkMode] = useState(false);
    const [activeTab, setActiveTab] = useState('Hauling Missions');

    const renderActiveTab = () => {
        switch (activeTab) {
            case 'Hauling Missions':
                return <HaulingMissions />;
            case 'Preferences':
                return <Preferences />;
            case 'History':
                return <History />;
            case 'Test Features':
                return <TestFeatures />;
            default:
                return <HaulingMissions />;
        }
    };

    return (
        <div className={darkMode ? 'dark-mode' : ''}>
            <Header darkMode={darkMode} setDarkMode={setDarkMode} />
            <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
            <div className="content">
                {renderActiveTab()}
            </div>
        </div>
    );
};

export default App;
