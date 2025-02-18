import React, { useRef, useEffect, useState } from 'react';
import Select from 'react-select';
import { ChromePicker } from 'react-color';
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import '../../../styles/sidebar.css';
import * as XLSX from 'xlsx';

const fontOptions = [
    { value: 'Orbitron', label: 'Orbitron' },
    { value: 'Arial', label: 'Arial' },
    { value: 'Helvetica', label: 'Helvetica' },
    { value: 'Times New Roman', label: 'Times New Roman' },
    { value: 'Courier New', label: 'Courier New' }
];

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
    menu: (provided, state) => ({
        ...provided,
        backgroundColor: '#333',
        color: 'var(--dropdown-text-color)',
        fontSize: '14px',
        minWidth: '300px', 
        maxHeight: '400px', 
        padding: '8px',
        marginTop: '4px',
        borderRadius: '4px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        position: 'absolute',
        width: '100%',
        zIndex: 999
    }),
    menuPortal: (base) => ({
        ...base,
        zIndex: 9999
    }),
    option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isFocused ? '#444' : '#333',
        color: 'var(--dropdown-text-color)',
        fontSize: '14px',
        fontFamily: state.data.value
    }),
    singleValue: (provided) => ({
        ...provided,
        color: 'var(--dropdown-text-color)',
        fontSize: '14px'
    }),
};

const FONT_OPTIONS = [
    { value: 'Orbitron', label: 'Orbitron' },
    { value: 'Arial', label: 'Arial' },
    { value: 'Verdana', label: 'Verdana' },
    { value: 'Helvetica', label: 'Helvetica' },
    { value: 'Courier New', label: 'Courier New' },
    { value: 'Georgia', label: 'Georgia' },
    { value: 'Times New Roman', label: 'Times New Roman' },
    { value: 'Trebuchet MS', label: 'Trebuchet MS' },
    { value: 'Impact', label: 'Impact' }
];

export const PreferencesTab = ({
    dropdownLabelColor,
    dropdownTextColor,
    buttonColor,
    titleColor,
    dropOffHeaderTextColor,
    rowTextColor,
    tableHeaderTextColor,
    missionTextColor,
    tableOutlineColor,
    selectedFont,
    debugMode,
    setDropdownLabelColor,
    setDropdownTextColor,
    setButtonColor,
    setTitleColor,
    setDropOffHeaderTextColor,
    setRowTextColor,
    setTableHeaderTextColor,
    setMissionTextColor,
    setTableOutlineColor,
    setSelectedFont,
    handleDebugMode,
    handleImport,
    handleExport,
    handleFontChange,
    exportHistoryToXLS,
    exportPayoutsToXLS,
    setHistoryEntries,
    setPayoutEntries,
    setPayouts,
    setMissionEntries,
    setMissionRewards,
    showBannerMessage
}) => {
    const portalRef = useRef(null);
    const [showWelcomePopup, setShowWelcomePopup] = useState(false);
    const [showDropdownLabelColorPicker, setShowDropdownLabelColorPicker] = useState(false);
    const [showDropdownTextColorPicker, setShowDropdownTextColorPicker] = useState(false);
    const [showButtonColorPicker, setShowButtonColorPicker] = useState(false);
    const [showTitleColorPicker, setShowTitleColorPicker] = useState(false);
    const [showDropOffHeaderTextColorPicker, setShowDropOffHeaderTextColorPicker] = useState(false);
    const [showRowTextColorPicker, setShowRowTextColorPicker] = useState(false);
    const [showTableHeaderTextColorPicker, setShowTableHeaderTextColorPicker] = useState(false);
    const [showMissionTextColorPicker, setShowMissionTextColorPicker] = useState(false);
    const [showTableOutlineColorPicker, setShowTableOutlineColorPicker] = useState(false);
    const [showClearHistoryPopup, setShowClearHistoryPopup] = useState(false);
    const [showDeleteStoragePopup, setShowDeleteStoragePopup] = useState(false);
    const [showExportTablesPopup, setShowExportTablesPopup] = useState(false);
    const [showExportFormatPopup, setShowExportFormatPopup] = useState(false);
    const [selectedExportType, setSelectedExportType] = useState(null); // 'history', 'payouts', or 'both'
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [activeSection, setActiveSection] = useState('color-font');
    const [showExportLocalStoragePopup, setShowExportLocalStoragePopup] = useState(false);
    const [showExportRoutesPopup, setShowExportRoutesPopup] = useState(false);
    const [showClearRoutesPopup, setShowClearRoutesPopup] = useState(false);

    useEffect(() => {
        const hasShownPopup = localStorage.getItem('hasShownWelcomePopup');
        if (!hasShownPopup) {
            setShowWelcomePopup(true);
            localStorage.setItem('hasShownWelcomePopup', 'true');
        }
        portalRef.current = document.body;
    }, []);

    const handleCloseWelcomePopup = () => {
        setShowWelcomePopup(false);
    };

    const handleResetWelcomePopup = () => {
        setShowWelcomePopup(true);
    };

    const handleExportLocalStorage = () => {
        const localStorageData = {};
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            localStorageData[key] = localStorage.getItem(key);
        }

        const json = JSON.stringify(localStorageData, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'local_storage_data.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleColorChange = (color, setColor) => {
        setColor(color.hex);
    };

    const toggleColorPicker = (setter) => {
        setter(prev => !prev);
    };

    const handleExportTables = () => {
        const historyEntries = JSON.parse(localStorage.getItem('historyEntries')) || [];
        const payoutEntries = JSON.parse(localStorage.getItem('payoutEntries')) || [];

        const data = {
            historyEntries: historyEntries,
            payoutEntries: payoutEntries
        };

        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'tables_data.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleImportTables = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                if (file.name.endsWith('.json')) {
                    const data = JSON.parse(e.target.result);
                    if (data.historyEntries && data.payoutEntries) {
                        // Get existing data from local storage
                        const existingHistoryEntries = JSON.parse(localStorage.getItem('historyEntries')) || [];
                        const existingPayoutEntries = JSON.parse(localStorage.getItem('payoutEntries')) || [];

                        // Generate a unique mission number prefix based on the current date and time
                        const now = new Date();
                        const missionNumberPrefix = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;

                        // Update mission numbers for imported history entries
                        const updatedHistoryEntries = data.historyEntries.map((entry, index) => ({
                            ...entry,
                            missionNumber: `${missionNumberPrefix}${String(index + 1).padStart(4, '0')}` // Ensure unique mission numbers
                        }));

                        // Concatenate the imported data with the existing data
                        const updatedHistoryEntriesCombined = [...existingHistoryEntries, ...updatedHistoryEntries];
                        const updatedPayoutEntriesCombined = [...existingPayoutEntries, ...data.payoutEntries];

                        // Save the updated data back to local storage
                        localStorage.setItem('historyEntries', JSON.stringify(updatedHistoryEntriesCombined));
                        localStorage.setItem('payoutEntries', JSON.stringify(updatedPayoutEntriesCombined));

                        alert('Tables imported and merged successfully!');
                        window.location.reload(); // Refresh the page to reflect the changes
                    } else {
                        alert('Invalid JSON file format. The file must contain historyEntries and payoutEntries.');
                    }
                } else if (file.name.endsWith('.xls')) {
                    // Add your XLS import logic here
                    // You'll need to parse the Excel file and convert it to the expected format
                    alert('XLS import functionality is not yet implemented.');
                } else {
                    alert('Unsupported file format. Please use .json or .xls files.');
                }
            } catch (error) {
                alert('Error importing tables: ' + error.message);
            }
        };
        reader.onerror = () => {
            alert('Error reading file.');
        };
        reader.readAsBinaryString(file);
    };

    const handleDeleteLocalStorage = () => {
        if (window.confirm('Are you sure you want to delete all local storage data? This action cannot be undone.')) {
            localStorage.clear();
            alert('Local storage data deleted successfully.');
            window.location.reload(); // Refresh the page to reflect the changes
        }
    };

    const handleClearHistoryConfirmation = (confirmed) => {
        setShowClearHistoryPopup(false);
        if (confirmed) {
            // Clear state first
            if (typeof setHistoryEntries === 'function') {
                setHistoryEntries([]);
            }
            if (typeof setPayoutEntries === 'function') {
                setPayoutEntries([]);
            }
            if (typeof setPayouts === 'function') {
                setPayouts([]);
            }
            if (typeof setMissionEntries === 'function') {
                setMissionEntries(Array(10).fill([]));
            }
            if (typeof setMissionRewards === 'function') {
                setMissionRewards({});
            }

            // Then clear local storage
            localStorage.removeItem('historyEntries');
            localStorage.removeItem('payoutEntries');
            localStorage.removeItem('payouts');
            localStorage.removeItem('missionEntries');
            localStorage.removeItem('missionRewards');

            // Force update of dependent components
            if (typeof showBannerMessage === 'function') {
                showBannerMessage('History and payouts cleared successfully', true);
            } else {
                alert('History and payouts cleared successfully');
            }

            // Force a state update to trigger re-render
            if (typeof setHistoryEntries === 'function') {
                setHistoryEntries(prev => [...prev]);
            }
            if (typeof setPayoutEntries === 'function') {
                setPayoutEntries(prev => [...prev]);
            }

            // Refresh the page to ensure all components update
            window.location.reload();
        }
    };

    const handleDeleteStorageConfirmation = (confirmed) => {
        setShowDeleteStoragePopup(false);
        if (confirmed) {
            handleDeleteLocalStorage();
        }
    };

    const handleExportTablesOption = (type) => {
        setShowExportTablesPopup(false);
        setSelectedExportType(type);
        setShowExportFormatPopup(true);
    };

    const handleExportFormat = (format) => {
        setShowExportFormatPopup(false);
        if (format === 'json') {
            const data = {};
            
            if (selectedExportType === 'history') {
                data.historyEntries = JSON.parse(localStorage.getItem('historyEntries')) || [];
            }
            
            if (selectedExportType === 'payouts') {
                data.payoutEntries = JSON.parse(localStorage.getItem('payoutEntries')) || [];
            }

            const json = JSON.stringify(data, null, 2);
            const blob = new Blob([json], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = selectedExportType === 'history' ? 'history_entries.json' : 'payout_entries.json';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } else if (format === 'excel') {
            if (selectedExportType === 'history') {
                exportHistoryToXLS();
            }
            if (selectedExportType === 'payouts') {
                exportPayoutsToXLS();
            }
        }
    };

    const handleImportLocalStorage = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                if (typeof data === 'object' && data !== null) {
                    // Clear existing local storage
                    localStorage.clear();
                    
                    // Import new data
                    for (const [key, value] of Object.entries(data)) {
                        localStorage.setItem(key, value);
                    }
                    
                    alert('Local storage imported successfully!');
                    window.location.reload(); // Refresh to apply changes
                } else {
                    alert('Invalid JSON file format. The file must contain a valid JSON object.');
                }
            } catch (error) {
                alert('Error importing local storage: ' + error.message);
            }
        };
        reader.onerror = () => {
            alert('Error reading file.');
        };
        reader.readAsText(file);
    };

    const handleExportLocalStorageOption = (format) => {
        setShowExportLocalStoragePopup(false);
        if (format === 'json') {
            handleExportLocalStorage();
        } else if (format === 'excel') {
            exportLocalStorageToExcel();
        }
    };

    const handleExportRoutesOption = (format) => {
        setShowExportRoutesPopup(false);
        if (format === 'json') {
            exportRoutesToJSON();
        } else if (format === 'excel') {
            exportRoutesToExcel();
        }
    };

    const exportHistoryToJSON = () => {
        const historyEntries = JSON.parse(localStorage.getItem('historyEntries')) || [];
        const formattedEntries = historyEntries.map(entry => ({
            missionNumber: entry.missionNumber,
            date: entry.date,
            time: entry.time,
            location: entry.location,
            commodity: entry.commodity,
            quantity: entry.quantity,
            price: entry.price,
            total: entry.total,
            notes: entry.notes,
            status: entry.status
        }));
        const json = JSON.stringify(formattedEntries, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'history_entries.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const exportPayoutsToJSON = () => {
        const payoutEntries = JSON.parse(localStorage.getItem('payoutEntries')) || [];
        const formattedEntries = payoutEntries.map(entry => ({
            missionNumber: entry.missionNumber,
            date: entry.date,
            time: entry.time,
            location: entry.location,
            commodity: entry.commodity,
            quantity: entry.quantity,
            price: entry.price,
            total: entry.total,
            notes: entry.notes,
            status: entry.status,
            payoutDate: entry.payoutDate,
            payoutAmount: entry.payoutAmount,
            payoutStatus: entry.payoutStatus
        }));
        const json = JSON.stringify(formattedEntries, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'payout_entries.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const exportRoutesToJSON = () => {
        const routePresets = JSON.parse(localStorage.getItem('routePresets')) || [];
        const json = JSON.stringify(routePresets, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'route_presets.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const exportRoutesToExcel = () => {
        const routePresets = JSON.parse(localStorage.getItem('routePresets')) || [];
        
        // Format the data for Excel export
        const formattedData = routePresets.map(preset => ({
            'Route Name': preset.name,
            'Start Location': preset.startLocation,
            'End Location': preset.endLocation,
            'Commodity': preset.commodity,
            'Distance': preset.distance,
            'Estimated Time': preset.estimatedTime,
            'Difficulty': preset.difficulty,
            'Notes': preset.notes,
            'Created At': preset.createdAt,
            'Last Used': preset.lastUsed
        }));

        const worksheet = XLSX.utils.json_to_sheet(formattedData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'RoutePresets');

        // Add styling
        const range = XLSX.utils.decode_range(worksheet['!ref']);
        for (let R = range.s.r; R <= range.e.r; ++R) {
            for (let C = range.s.c; C <= range.e.c; ++C) {
                const cell_address = { c: C, r: R };
                const cell_ref = XLSX.utils.encode_cell(cell_address);
                if (!worksheet[cell_ref]) continue;
                
                worksheet[cell_ref].s = {
                    font: { name: 'Arial', sz: 12 },
                    alignment: { wrapText: true, vertical: 'top' },
                    border: {
                        top: { style: 'thin', color: { rgb: '000000' } },
                        bottom: { style: 'thin', color: { rgb: '000000' } },
                        left: { style: 'thin', color: { rgb: '000000' } },
                        right: { style: 'thin', color: { rgb: '000000' } }
                    }
                };
            }
        }

        // Set column widths
        worksheet['!cols'] = [
            { wch: 20 }, // Route Name
            { wch: 20 }, // Start Location
            { wch: 20 }, // End Location
            { wch: 15 }, // Commodity
            { wch: 10 }, // Distance
            { wch: 15 }, // Estimated Time
            { wch: 10 }, // Difficulty
            { wch: 30 }, // Notes
            { wch: 20 }, // Created At
            { wch: 20 }  // Last Used
        ];

        XLSX.writeFile(workbook, 'route_presets.xlsx');
    };

    const handleImportRoutes = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                if (file.name.endsWith('.json')) {
                    const data = JSON.parse(e.target.result);
                    if (Array.isArray(data)) {
                        const existingRoutes = JSON.parse(localStorage.getItem('routePresets')) || [];
                        const updatedRoutes = [...existingRoutes, ...data];
                        localStorage.setItem('routePresets', JSON.stringify(updatedRoutes));
                        alert('Routes imported successfully!');
                        window.location.reload();
                    } else {
                        alert('Invalid JSON file format. The file must contain an array of route presets.');
                    }
                } else if (file.name.endsWith('.xls')) {
                    // Add XLS import logic here
                    alert('XLS import for routes is not yet implemented.');
                } else {
                    alert('Unsupported file format. Please use .json or .xls files.');
                }
            } catch (error) {
                alert('Error importing routes: ' + error.message);
            }
        };
        reader.onerror = () => {
            alert('Error reading file.');
        };
        reader.readAsBinaryString(file);
    };

    const exportLocalStorageToExcel = () => {
        const data = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            const value = localStorage.getItem(key);
            try {
                const parsedValue = JSON.parse(value);
                data.push({ Key: key, Value: JSON.stringify(parsedValue, null, 2) });
            } catch {
                data.push({ Key: key, Value: value });
            }
        }

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'LocalStorage');
        
        // Add some basic styling
        const range = XLSX.utils.decode_range(worksheet['!ref']);
        for (let R = range.s.r; R <= range.e.r; ++R) {
            for (let C = range.s.c; C <= range.e.c; ++C) {
                const cell_address = { c: C, r: R };
                const cell_ref = XLSX.utils.encode_cell(cell_address);
                if (!worksheet[cell_ref]) continue;
                
                // Add styling
                worksheet[cell_ref].s = {
                    font: { name: 'Arial', sz: 12 },
                    alignment: { wrapText: true, vertical: 'top' },
                    border: {
                        top: { style: 'thin', color: { rgb: '000000' } },
                        bottom: { style: 'thin', color: { rgb: '000000' } },
                        left: { style: 'thin', color: { rgb: '000000' } },
                        right: { style: 'thin', color: { rgb: '000000' } }
                    }
                };
            }
        }

        // Set column widths
        worksheet['!cols'] = [
            { wch: 30 }, // Key column width
            { wch: 100 } // Value column width
        ];

        XLSX.writeFile(workbook, 'local_storage.xlsx');
    };

    // Add these new functions for handling user settings
    const exportUserSettings = () => {
        const userSettings = {
            dropdownLabelColor: localStorage.getItem('dropdownLabelColor'),
            dropdownTextColor: localStorage.getItem('dropdownTextColor'),
            buttonColor: localStorage.getItem('buttonColor'),
            titleColor: localStorage.getItem('titleColor'),
            dropOffHeaderTextColor: localStorage.getItem('dropOffHeaderTextColor'),
            rowTextColor: localStorage.getItem('rowTextColor'),
            tableHeaderTextColor: localStorage.getItem('tableHeaderTextColor'),
            missionTextColor: localStorage.getItem('missionTextColor'),
            tableOutlineColor: localStorage.getItem('tableOutlineColor'),
            selectedFont: localStorage.getItem('selectedFont')
        };

        const json = JSON.stringify(userSettings, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'user_settings.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleImportUserSettings = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                if (typeof data === 'object' && data !== null) {
                    // Import and set each setting
                    if (data.dropdownLabelColor) localStorage.setItem('dropdownLabelColor', data.dropdownLabelColor);
                    if (data.dropdownTextColor) localStorage.setItem('dropdownTextColor', data.dropdownTextColor);
                    if (data.buttonColor) localStorage.setItem('buttonColor', data.buttonColor);
                    if (data.titleColor) localStorage.setItem('titleColor', data.titleColor);
                    if (data.dropOffHeaderTextColor) localStorage.setItem('dropOffHeaderTextColor', data.dropOffHeaderTextColor);
                    if (data.rowTextColor) localStorage.setItem('rowTextColor', data.rowTextColor);
                    if (data.tableHeaderTextColor) localStorage.setItem('tableHeaderTextColor', data.tableHeaderTextColor);
                    if (data.missionTextColor) localStorage.setItem('missionTextColor', data.missionTextColor);
                    if (data.tableOutlineColor) localStorage.setItem('tableOutlineColor', data.tableOutlineColor);
                    if (data.selectedFont) localStorage.setItem('selectedFont', data.selectedFont);

                    alert('User settings imported successfully!');
                    window.location.reload(); // Refresh to apply changes
                } else {
                    alert('Invalid JSON file format. The file must contain valid user settings.');
                }
            } catch (error) {
                alert('Error importing user settings: ' + error.message);
            }
        };
        reader.onerror = () => {
            alert('Error reading file.');
        };
        reader.readAsText(file);
    };

    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            <Sidebar 
                collapsed={sidebarCollapsed}
                onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
                <div className="sidebar-header">
                    <div style={{ padding: '20px', textAlign: 'center' }}>
                        <h3>Settings</h3>
                    </div>
                </div>
                <div className="sidebar-content">
                    <Menu iconShape="square">
                        <MenuItem 
                            onClick={() => setActiveSection('color-font')}
                            className={activeSection === 'color-font' ? 'active' : ''}
                        >
                            Color & Font
                        </MenuItem>
                        <MenuItem 
                            onClick={() => setActiveSection('data')}
                            className={activeSection === 'data' ? 'active' : ''}
                        >
                            Data Management
                        </MenuItem>
                        <MenuItem 
                            onClick={() => setActiveSection('debug')}
                            className={activeSection === 'debug' ? 'active' : ''}
                        >
                            Debug Options
                        </MenuItem>
                    </Menu>
                </div>
            </Sidebar>

            <div className="preferences" style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
                {activeSection === 'color-font' && (
                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
                        gap: '10px'
                    }}>
                        <div className="preferences-box location-box">
                            <h3>Color & Font Settings</h3>
                            <div className="form-group" style={{ marginBottom: '15px' }}>
                                <label>Dropdown Label Color</label>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <input 
                                        type="color" 
                                        value={dropdownLabelColor} 
                                        onChange={(e) => setDropdownLabelColor(e.target.value)} 
                                    />
                                    <button onClick={() => setDropdownLabelColor('#00ffcc')} style={{ marginLeft: '10px' }}>Reset</button>
                                </div>
                            </div>
                            <div className="form-group" style={{ marginBottom: '15px' }}>
                                <label>Dropdown Text Color</label>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <input 
                                        type="color" 
                                        value={dropdownTextColor} 
                                        onChange={(e) => setDropdownTextColor(e.target.value)} 
                                    />
                                    <button onClick={() => setDropdownTextColor('#00ffcc')} style={{ marginLeft: '10px' }}>Reset</button>
                                </div>
                            </div>
                            <div className="form-group" style={{ marginBottom: '15px' }}>
                                <label>Button Color</label>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <input 
                                        type="color" 
                                        value={buttonColor} 
                                        onChange={(e) => setButtonColor(e.target.value)} 
                                    />
                                    <button onClick={() => setButtonColor('#00ffcc')} style={{ marginLeft: '10px' }}>Reset</button>
                                </div>
                            </div>
                            <div className="form-group" style={{ marginBottom: '15px' }}>
                                <label>Title Color</label>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <input 
                                        type="color" 
                                        value={titleColor} 
                                        onChange={(e) => setTitleColor(e.target.value)} 
                                    />
                                    <button onClick={() => setTitleColor('#00ffcc')} style={{ marginLeft: '10px' }}>Reset</button>
                                </div>
                            </div>
                            <div className="form-group" style={{ marginBottom: '15px' }}>
                                <label>Font</label>
                                <Select
                                    options={FONT_OPTIONS}
                                    value={FONT_OPTIONS.find(option => option.value === selectedFont)}
                                    onChange={(selectedOption) => handleFontChange(selectedOption.value)}
                                    className="font-select"
                                    classNamePrefix="react-select"
                                    styles={customStyles}
                                    menuPortalTarget={portalRef.current}
                                    menuPosition="fixed"
                                    menuPlacement="auto"
                                />
                            </div>
                        </div>
                        
                        <div className="preferences-box cargo-manifest-box">
                            <h3>Table Colors</h3>
                            <div className="form-group" style={{ marginBottom: '15px' }}>
                                <label>Drop-off Point Header Text Color</label>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <input 
                                        type="color" 
                                        value={dropOffHeaderTextColor} 
                                        onChange={(e) => setDropOffHeaderTextColor(e.target.value)} 
                                    />
                                    <button onClick={() => setDropOffHeaderTextColor('#00ffcc')} style={{ marginLeft: '10px' }}>Reset</button>
                                </div>
                            </div>
                            <div className="form-group" style={{ marginBottom: '15px' }}>
                                <label>Row Text Color</label>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <input 
                                        type="color" 
                                        value={rowTextColor} 
                                        onChange={(e) => setRowTextColor(e.target.value)} 
                                    />
                                    <button onClick={() => setRowTextColor('#00ffcc')} style={{ marginLeft: '10px' }}>Reset</button>
                                </div>
                            </div>
                            <div className="form-group" style={{ marginBottom: '15px' }}>
                                <label>Table Header Text Color</label>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <input 
                                        type="color" 
                                        value={tableHeaderTextColor} 
                                        onChange={(e) => setTableHeaderTextColor(e.target.value)} 
                                    />
                                    <button onClick={() => setTableHeaderTextColor('#00ffcc')} style={{ marginLeft: '10px' }}>Reset</button>
                                </div>
                            </div>
                            <div className="form-group" style={{ marginBottom: '15px' }}>
                                <label>Mission Text Color</label>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <input 
                                        type="color" 
                                        value={missionTextColor} 
                                        onChange={(e) => setMissionTextColor(e.target.value)} 
                                    />
                                    <button onClick={() => setMissionTextColor('#00ffcc')} style={{ marginLeft: '10px' }}>Reset</button>
                                </div>
                            </div>
                            <div className="form-group" style={{ marginBottom: '15px' }}>
                                <label>Table Outline Color</label>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <input 
                                        type="color" 
                                        value={tableOutlineColor} 
                                        onChange={(e) => setTableOutlineColor(e.target.value)} 
                                    />
                                    <button onClick={() => setTableOutlineColor('#00ffcc')} style={{ marginLeft: '10px' }}>Reset</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                
                {activeSection === 'data' && (
                    <div className="preferences-box data-main" style={{ 
                        width: '100%',
                        height: 'auto',
                        padding: '20px',
                        boxSizing: 'border-box',
                        overflowY: 'auto'
                    }}>
                        <h3>Data Management</h3>
                        <div style={{ 
                            display: 'grid', 
                            gridTemplateColumns: 'repeat(3, 1fr)',
                            gap: '20px',
                            width: '100%',
                            height: 'auto',
                            maxWidth: '1200px',
                            marginRight: '0px',
                            paddingRight: '0px',
                            paddingBottom: '20px'
                        }}>
                            {/* History/Payouts Box */}
                            <div className="preferences-box Data-group">
                                <h4><u>History/Payouts</u></h4>
                                <button
                                    className="export-tables-button"
                                    onClick={() => setShowExportTablesPopup(true)}
                                    style={{ display: 'block', marginTop: '10px' }}
                                >
                                    Export Tables
                                </button>
                                <input
                                    type="file"
                                    id="import-tables-file"
                                    accept=".json, .xls"
                                    onChange={handleImportTables}
                                    style={{ display: 'none' }}
                                />
                                <button
                                    className="import-tables-button"
                                    onClick={() => document.getElementById('import-tables-file').click()}
                                    style={{ display: 'block', marginTop: '10px' }}
                                >
                                    Import Tables
                                </button>
                                <button 
                                    className="clear-history-log-button" 
                                    onClick={() => setShowClearHistoryPopup(true)} 
                                    style={{ 
                                        display: 'block', 
                                        marginTop: '10px',
                                        backgroundColor: '#ff6666'
                                    }}
                                >
                                    Clear History Log
                                </button>
                            </div>

                            {/* Local Storage Box */}
                            <div className="preferences-box Data-group">
                                <h4><u>Local Storage</u></h4>
                                <button
                                    className="export-local-storage-button"
                                    onClick={() => setShowExportLocalStoragePopup(true)}
                                    style={{ display: 'block', marginTop: '10px' }}
                                >
                                    Export Local Storage
                                </button>
                                <input
                                    type="file"
                                    id="import-local-storage-file"
                                    accept=".json"
                                    onChange={handleImportLocalStorage}
                                    style={{ display: 'none' }}
                                />
                                <button
                                    className="import-local-storage-button"
                                    onClick={() => document.getElementById('import-local-storage-file').click()}
                                    style={{ display: 'block', marginTop: '10px' }}
                                >
                                    Import Local Storage
                                </button>
                                <button
                                    className="delete-local-storage-button"
                                    onClick={() => setShowDeleteStoragePopup(true)}
                                    style={{ 
                                        display: 'block', 
                                        marginTop: '10px',
                                        backgroundColor: '#ff3333'
                                    }}
                                >
                                    Delete Local Storage
                                </button>
                            </div>

                            {/* Route Presets Box */}
                            <div className="preferences-box Data-group">
                                <h4><u>Route Presets</u></h4>
                                <button
                                    className="export-routes-button"
                                    onClick={() => setShowExportRoutesPopup(true)}
                                    style={{ display: 'block', marginTop: '10px' }}
                                >
                                    Export Route Presets
                                </button>
                                <input
                                    type="file"
                                    id="import-routes-file"
                                    accept=".json, .xls"
                                    onChange={handleImportRoutes}
                                    style={{ display: 'none' }}
                                />
                                <button
                                    className="import-routes-button"
                                    onClick={() => document.getElementById('import-routes-file').click()}
                                    style={{ display: 'block', marginTop: '10px' }}
                                >
                                    Import Route Presets
                                </button>
                                <button
                                    style={{ 
                                        display: 'block', 
                                        marginTop: '10px',
                                        backgroundColor: '#ff3333'
                                    }}
                                    onClick={() => setShowClearRoutesPopup(true)}
                                >
                                    Clear Route Presets
                                </button>
                            </div>

                            {/* User Settings Box */}
                            <div className="preferences-box Data-group">
                                <h4>
                                    <u>User Settings</u>
                                    <span className="tooltip">?
                                        <span className="tooltiptext">
                                            Export/Import color and font settings
                                        </span>
                                    </span>
                                </h4>
                                <button
                                    className="export-user-settings-button"
                                    onClick={exportUserSettings}
                                    style={{ display: 'block', marginTop: '10px' }}
                                >
                                    Export User Settings
                                </button>
                                <input
                                    type="file"
                                    id="import-user-settings-file"
                                    accept=".json"
                                    onChange={handleImportUserSettings}
                                    style={{ display: 'none' }}
                                />
                                <button
                                    className="import-user-settings-button"
                                    onClick={() => document.getElementById('import-user-settings-file').click()}
                                    style={{ display: 'block', marginTop: '10px' }}
                                >
                                    Import User Settings
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {activeSection === 'debug' && (
                    <div className="preferences-box debug-options-container" style={{ width: '800px', maxWidth: '90%', margin: '20px auto 0' }}>
                        <h3>Debug Options</h3>
                        <div className="form-group" style={{ marginBottom: '15px' }}>
                            <div className="checkbox-wrapper">
                                <label className="checkbox-label">
                                    <input 
                                        type="checkbox"
                                        checked={debugMode}
                                        onChange={handleDebugMode}
                                    />
                                    Enable Debug Mode
                                </label>
                                <span className="checkbox-description">
                                    Shows additional information during OCR capture process
                                </span>
                            </div>
                        </div>

                        {debugMode && (
                            <div style={{ 
                                display: 'grid', 
                                gridTemplateColumns: 'repeat(3, 1fr)', 
                                gap: '20px',
                                width: '100%',
                                maxWidth: '1200px',
                                margin: '0 auto'
                            }}>
                                {/* OCR Processing Group */}
                                <div className="preferences-box debug-group">
                                    <h4><u>OCR Processing</u></h4>
                                    <div className="form-group">
                                        <label>
                                            <input type="checkbox" />
                                            OCR Logging
                                        </label>
                                    </div>
                                    <div className="form-group">
                                        <label>
                                            <input type="checkbox" />
                                            OCR Processing
                                        </label>
                                    </div>
                                    <div className="form-group">
                                        <label>
                                            <input type="checkbox" />
                                            Data Validation
                                        </label>
                                    </div>
                                    <div className="form-group">
                                        <label>
                                            <input type="checkbox" />
                                            Location Correction
                                        </label>
                                    </div>
                                </div>

                                {/* Mission Tracking Group */}
                                <div className="preferences-box debug-group">
                                    <h4><u>Mission Tracking</u></h4>
                                    <div className="form-group">
                                        <label>
                                            <input type="checkbox" />
                                            Hauling Missions
                                        </label>
                                    </div>
                                    <div className="form-group">
                                        <label>
                                            <input type="checkbox" />
                                            Mission Grouping
                                        </label>
                                    </div>
                                    <div className="form-group">
                                        <label>
                                            <input type="checkbox" />
                                            Mission Tracking
                                        </label>
                                    </div>
                                    <div className="form-group">
                                        <label>
                                            <input type="checkbox" />
                                            Reward Calculations
                                        </label>
                                    </div>
                                </div>

                                {/* Data Management Group */}
                                <div className="preferences-box debug-group">
                                    <h4><u>Data Management</u></h4>
                                    <div className="form-group">
                                        <label>
                                            <input type="checkbox" />
                                            Add Entry
                                        </label>
                                    </div>
                                    <div className="form-group">
                                        <label>
                                            <input type="checkbox" />
                                            Process Orders
                                        </label>
                                    </div>
                                    <div className="form-group">
                                        <label>
                                            <input type="checkbox" />
                                            Entry Grouping
                                        </label>
                                    </div>
                                    <div className="form-group">
                                        <label>
                                            <input type="checkbox" />
                                            Data Loading
                                        </label>
                                    </div>
                                </div>

                                {/* History & Payouts Group */}
                                <div className="preferences-box debug-group">
                                    <h4><u>History & Payouts</u></h4>
                                    <div className="form-group">
                                        <label>
                                            <input type="checkbox" />
                                            History
                                        </label>
                                    </div>
                                    <div className="form-group">
                                        <label>
                                            <input type="checkbox" />
                                            Payouts
                                        </label>
                                    </div>
                                    <div className="form-group">
                                        <label>
                                            <input type="checkbox" />
                                            Rewards
                                        </label>
                                    </div>
                                    <div className="form-group">
                                        <label>
                                            <input type="checkbox" />
                                            Status Changes
                                        </label>
                                    </div>
                                </div>

                                {/* System Operations Group */}
                                <div className="preferences-box debug-group">
                                    <h4><u>System Operations</u></h4>
                                    <div className="form-group">
                                        <label>
                                            <input type="checkbox" />
                                            Local Storage
                                        </label>
                                    </div>
                                    <div className="form-group">
                                        <label>
                                            <input type="checkbox" />
                                            Saving
                                        </label>
                                    </div>
                                    <div className="form-group">
                                        <label>
                                            <input type="checkbox" />
                                            Loading
                                        </label>
                                    </div>
                                    <div className="form-group">
                                        <label>
                                            <input type="checkbox" />
                                            State Changes
                                        </label>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Export Tables Popup */}
            {showExportTablesPopup && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <h3>Export Tables</h3>
                        <p>What would you like to export?</p>
                        <div className="popup-buttons">
                            <button onClick={() => handleExportTablesOption('history')}>History</button>
                            <button onClick={() => handleExportTablesOption('payouts')}>Payouts</button>
                            <button onClick={() => setShowExportTablesPopup(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Export Format Popup */}
            {showExportFormatPopup && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <h3>Export Format</h3>
                        <p>Choose export format for {selectedExportType}:</p>
                        <div className="popup-buttons">
                            <button onClick={() => handleExportFormat('json')}>Export .JSON</button>
                            <button onClick={() => handleExportFormat('excel')}>Export Excel</button>
                            <button onClick={() => setShowExportFormatPopup(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Export Local Storage Popup */}
            {showExportLocalStoragePopup && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <h3>Export Local Storage</h3>
                        <p>Choose export format:</p>
                        <div className="popup-buttons">
                            <button onClick={() => handleExportLocalStorageOption('json')}>Export .JSON</button>
                            <button onClick={() => handleExportLocalStorageOption('excel')}>Export Excel</button>
                            <button onClick={() => setShowExportLocalStoragePopup(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Export Routes Popup */}
            {showExportRoutesPopup && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <h3>Export Routes</h3>
                        <p>Choose export format:</p>
                        <div className="popup-buttons">
                            <button onClick={() => handleExportRoutesOption('json')}>Export .JSON</button>
                            <button onClick={() => handleExportRoutesOption('excel')}>Export Excel</button>
                            <button onClick={() => setShowExportRoutesPopup(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Clear History Log Popup */}
            {showClearHistoryPopup && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <h3>Clear History Log</h3>
                        <p>Are you sure you want to clear all history and payouts?</p>
                        <div className="popup-buttons">
                            <button 
                                onClick={() => {
                                    setShowClearHistoryPopup(false);
                                    handleClearHistoryConfirmation(true);
                                }}
                                style={{ backgroundColor: '#ff3333' }}
                            >
                                Confirm Clear
                            </button>
                            <button onClick={() => setShowClearHistoryPopup(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Local Storage Popup */}
            {showDeleteStoragePopup && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <h3>Delete Local Storage</h3>
                        <p>Are you sure you want to delete all local storage data? This cannot be undone.</p>
                        <div className="popup-buttons">
                            <button 
                                onClick={() => {
                                    setShowDeleteStoragePopup(false);
                                    handleDeleteLocalStorage();
                                }}
                                style={{ backgroundColor: '#ff3333' }}
                            >
                                Confirm Delete
                            </button>
                            <button onClick={() => setShowDeleteStoragePopup(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Clear Route Presets Popup */}
            {showClearRoutesPopup && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <h3>Clear Route Presets</h3>
                        <p>Are you sure you want to clear all route presets?</p>
                        <div className="popup-buttons">
                            <button 
                                onClick={() => {
                                    setShowClearRoutesPopup(false);
                                    localStorage.removeItem('routePresets');
                                    alert('Route presets cleared successfully!');
                                    window.location.reload();
                                }}
                                style={{ backgroundColor: '#ff3333' }}
                            >
                                Confirm Clear
                            </button>
                            <button onClick={() => setShowClearRoutesPopup(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};