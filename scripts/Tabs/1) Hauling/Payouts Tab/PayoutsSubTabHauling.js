import React, { useState } from 'react';

export const HaulingSubTabPayouts = ({ entries, setEntries }) => {
    const [collapsedMissions, setCollapsedMissions] = useState({});

    const toggleMissionCollapse = (missionId) => {
        setCollapsedMissions(prev => ({
            ...prev,
            [missionId]: !prev[missionId]
        }));
    };

    // First group by date, then by mission ID
    const entriesByDateAndMission = entries.reduce((acc, entry) => {
        const date = new Date(entry.date || Date.now()).toLocaleDateString();
        if (!acc[date]) {
            acc[date] = {};
        }
        if (!acc[date][entry.missionId]) {
            acc[date][entry.missionId] = [];
        }
        acc[date][entry.missionId].push(entry);
        return acc;
    }, {});

    // Create a map of mission indices per date
    const missionIndices = {};
    Object.entries(entriesByDateAndMission).forEach(([date, missionGroups]) => {
        missionIndices[date] = 0;
        Object.values(missionGroups).forEach(missionEntries => {
            missionEntries.forEach(entry => {
                entry.missionIndex = missionIndices[date];
            });
            missionIndices[date]++;
        });
    });

    // Calculate total reward for a group of entries
    const calculateTotalReward = (entries) => {
        // Get unique missions by taking only the first entry of each mission group
        const uniqueMissions = entries.reduce((acc, entry) => {
            if (!acc.some(e => e.missionId === entry.missionId)) {
                acc.push(entry);
            }
            return acc;
        }, []);

        return uniqueMissions.reduce((total, entry) => {
            const reward = entry?.reward ? parseInt(entry.reward.replace(/,/g, '')) : 0;
            return total + reward;
        }, 0);
    };

    const calculatePercentage = (currentAmount, originalAmount) => {
        if (!originalAmount) return 'N/A';
        const current = parseFloat(currentAmount) || 0;
        const original = parseFloat(originalAmount);
        const percentage = ((current / original) * 100).toFixed(2);
        return `${percentage}%`;
    };

    const calculatePercentageColor = (currentAmount, originalAmount) => {
        const percentage = parseFloat(calculatePercentage(currentAmount, originalAmount));
        return percentage < 55 ? 'red' : 'inherit';
    };

    const formatAmount = (current, original) => {
        if (!original) return null;
        
        const currentNum = Number(current) || 0;
        const originalNum = Number(original);
        
        return `${currentNum}/${originalNum}`;
    };

    return (
        <div className="payouts-container">
            {/* Table Label */}
            <div style={{ width: '100%', textAlign: 'center', marginBottom: '15px' }}>
                <h2 style={{ 
                    color: 'var(--title-color)', 
                    margin: '2px auto',
                    padding: '0 10px 2px',
                    display: 'inline-block',
                    borderBottom: '2px solid var(--title-color)'
                }}>
                    Payouts
                </h2>
            </div>

            {Object.entries(entriesByDateAndMission).map(([date, missionGroups]) => (
                <div key={date} className="date-group">
                    <h3>{date}</h3>
                    <div className="missions-container">
                        {Object.entries(missionGroups).map(([missionId, missionEntries]) => (
                            <div key={missionId} className="mission-entry">
                                <div 
                                    className="mission-header"
                                    onClick={() => toggleMissionCollapse(missionId)}
                                >
                                    <h4>Mission {missionEntries[0].missionIndex + 1}</h4>
                                    <div className="mission-summary">
                                        <span>Reward: {(missionEntries[0]?.reward ? parseInt(missionEntries[0].reward.replace(/,/g, '')) : 0).toLocaleString()} aUEC</span>
                                        <span>{missionEntries[0]?.status || ''}</span>
                                    </div>
                                </div>
                                {!collapsedMissions[missionId] && (
                                    <div className="mission-details">
                                        <table style={{ backgroundColor: 'var(--background-color)' }}>
                                            <thead>
                                                <tr>
                                                    <th style={{ width: '27%' }}>Pickup</th>
                                                    <th style={{ width: '27%' }}>Drop Off</th>
                                                    <th style={{ width: '16%' }}>Commodity</th>
                                                    <th style={{ width: '10%' }}>QTY</th>
                                                    <th style={{ width: '5%' }}>%</th>
                                                    <th style={{ display: 'none' }}>Current Amount</th>
                                                    <th style={{ display: 'none' }}>Original Amount</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {missionEntries.map(entry => (
                                                    <tr key={entry.id}>
                                                        <td>{entry.pickup}</td>
                                                        <td>{entry.dropOffPoint}</td>
                                                        <td>{entry.commodity}</td>
                                                        <td style={{ width: '10%' }}>{entry.amount}</td>
                                                        <td style={{ color: calculatePercentageColor(entry.currentAmount, entry.originalAmount) }}>{calculatePercentage(entry.currentAmount, entry.originalAmount)}</td>
                                                        <td style={{ display: 'none' }}>{entry.currentAmount}</td>
                                                        <td style={{ display: 'none' }}>{entry.originalAmount}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        ))}
                        <div className="date-total">
                            Total Rewards: {calculateTotalReward(Object.values(missionGroups).flat()).toLocaleString()} aUEC
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}; 