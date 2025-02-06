export const calculateTotalSCU = (entries) => {
    return entries.reduce((total, entry) => total + parseFloat(entry.currentAmount), 0);
};

export const processOrders = (entries, setEntries, historyEntries, setHistoryEntries) => {
    // ... process orders logic
};

export const handleImport = (event, setEntries, setMissionEntries, setHistoryEntries, setCollapsed, setCollapsedMissions) => {
    // ... import logic
};

export const handleExport = (historyEntries) => {
    // ... export logic
}; 