import React, { useState, useEffect } from 'react';
import { contextMenu } from '../../../utils/ContextMenu.js';

export const HistorySubTabHauling = ({
    historyEntries,
    collapsed,
    toggleCollapse
}) => {
    // Add state for collapsed dates
    const [collapsedDates, setCollapsedDates] = useState({});

    // Add toggle function for dates
    const toggleDateCollapse = (date) => {
        setCollapsedDates(prev => ({
            ...prev,
            [date]: !prev[date]
        }));
    };

    // Add useEffect to log historyEntries
    useEffect(() => {
        console.log("History Entries in HistorySubTabHauling:", historyEntries);
    }, [historyEntries]);

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

    // Group entries by date and then by drop-off point
    const entriesByDateAndPoint = historyEntries.reduce((acc, entry) => {
        const date = new Date(entry.date || Date.now()).toLocaleDateString();
        if (!acc[date]) {
            acc[date] = {};
        }
        if (!acc[date][entry.dropOffPoint]) {
            acc[date][entry.dropOffPoint] = [];
        }
        acc[date][entry.dropOffPoint].push(entry);
        return acc;
    }, {});

    // Add this to your initialization code
    const historyRows = document.querySelectorAll('.history-entry');
    historyRows.forEach(row => {
        row.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            contextMenu.show([
                {
                    label: 'Copy Details',
                    action: () => {
                        // Add copy logic
                    }
                },
                {
                    label: 'Export Entry',
                    action: () => {
                        // Add export logic
                    }
                }
            ], e.clientX, e.clientY);
        });
    });

    return (
        <div className="history-tab">
            {/* Table Label */}
            <div style={{ width: '100%', textAlign: 'center', marginBottom: '15px' }}>
                <h2 style={{ 
                    color: 'var(--title-color)', 
                    margin: '2px auto',
                    padding: '0 10px 2px',
                    display: 'inline-block',
                    borderBottom: '2px solid var(--title-color)'
                }}>
                    History
                </h2>
            </div>

            {Object.entries(entriesByDateAndPoint).map(([date, dropOffPoints]) => (
                <div key={date} className="history-date-group">
                    <div 
                        className="history-date-header"
                        onClick={() => toggleDateCollapse(date)}
                        style={{ cursor: 'pointer' }}
                    >
                        <span>{date}</span>
                        <span className="collapse-arrow">
                            {collapsedDates[date] ? '▼' : '▲'}
                        </span>
                    </div>
                    {!collapsedDates[date] && Object.entries(dropOffPoints).map(([dropOffPoint, entries]) => (
                        <div key={`${date}-${dropOffPoint}`} className="history-entry">
                            <div 
                                className="drop-off-header" 
                                onClick={() => toggleCollapse(dropOffPoint)}
                            >
                                <div className="left-box">
                                    <span>{dropOffPoint}</span>
                                    <span style={{ fontSize: 'small', marginLeft: '10px' }}>
                                        ({entries[0].planet} - {entries[0].moon})
                                    </span>
                                </div>
                                <div className="right-box">
                                    <span>{collapsed[dropOffPoint] ? '▲' : '▼'}</span>
                                </div>
                            </div>
                            {!collapsed[dropOffPoint] && (
                                <table className="hauling-manifest-table">
                                    <thead>
                                        <tr>
                                            <th style={{ width: '25%' }}>Pickup</th>
                                            <th style={{ width: '15%' }}>Commodity</th>
                                            <th style={{ width: '10%' }}>QTY</th>
                                            <th style={{ width: '5%' }}>%</th>
                                            <th style={{ width: '10%' }}>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {entries.map((entry, index) => {
                                            const percentage = parseFloat(calculatePercentage(entry.currentAmount, entry.originalAmount));
                                            const status = percentage < 49 ? 'Failed' : entry.status;
                                            return (
                                                <tr key={index}>
                                                    <td>{entry.pickup}</td>
                                                    <td>{entry.commodity}</td>
                                                    <td>{`${entry.currentAmount}/${entry.originalAmount}`}</td>
                                                    <td style={{ color: calculatePercentageColor(entry.currentAmount, entry.originalAmount) }}>
                                                        {calculatePercentage(entry.currentAmount, entry.originalAmount)}
                                                    </td>
                                                    <td style={{ color: status === 'Delivered' ? 'green' : status === 'Failed' ? 'red' : 'inherit' }}>
                                                        {status}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}; 