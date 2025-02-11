import React, { useRef, useEffect, useState } from 'react';
import Select from 'react-select';
import { ChromePicker } from 'react-color';

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
    captureDebugMode,
    needsHistoryClearConfirmation,
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
    handleCaptureDebugMode,
    handleImport,
    handleExport,
    clearHistoryLogDebug,
    handleFontChange,
    exportHistoryToXLS,
    exportPayoutsToXLS
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
                    alert('Invalid file format. The file must contain historyEntries and payoutEntries.');
                }
            } catch (error) {
                alert('Error importing tables: ' + error.message);
            }
        };
        reader.onerror = () => {
            alert('Error reading file.');
        };
        reader.readAsText(file);
    };

    return (
        <div className="preferences">
            {showWelcomePopup && (
                <div className="welcome-popup">
                    <div className="welcome-popup-content">
                        <h2>Welcome Please Take Note</h2>
                        <div className="welcome-message-underline"></div>
                        <p>
                            History and payouts tab might experience issues your side since the restructure of files for this project required quite a lot of remake for some tables.
                            This type of issue should not happen in the future sorry for the inconvenience.
                        </p>
                        <p>
                            If your history/payouts table is currently messed up because of the restructure, use the "Export Local Storage" button to download a file containing all your data.
                        </p>
                        <p>
                            This is for users who want to keep all their data. I will add a button soon that pushes the raw content into the correct tables.
                        </p>
                        <br />
                        <p>This is a one time message to see it again hit the show Important note button</p>
                        <button onClick={handleCloseWelcomePopup}>Close</button>
                    </div>
                </div>
            )}
            <div className="preferences-container">
                <div className="preferences-box cargo-manifest-box">
                    <h3>Tables</h3>
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

                <div className="preferences-box location-box">
                    <h3>General</h3>
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

                <div className="preferences-box new-group-box">
                    <h3>Data Management</h3>
                    <div className="form-group" style={{ marginBottom: '15px' }}>
                        <div className="checkbox-wrapper">
                            <label className="checkbox-label">
                                <input 
                                    type="checkbox"
                                    checked={captureDebugMode}
                                    onChange={handleCaptureDebugMode}
                                />
                                Capture Debug Mode
                            </label>
                            <span className="checkbox-description">
                                Shows additional information during OCR capture process
                            </span>
                        </div>
                        <button
                            className="export-tables-button"
                            onClick={handleExportTables}
                            style={{ display: 'block', marginTop: '10px' }}
                        >
                            Export Tables
                        </button>
                        <input
                            type="file"
                            id="import-tables-file"
                            accept=".json"
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
                            className="export-local-storage-button"
                            onClick={handleExportLocalStorage}
                            style={{ display: 'block', marginTop: '10px' }}
                        >
                            Export Local Storage
                        </button>
                        <button
                            className="reset-welcome-button"
                            onClick={handleResetWelcomePopup}
                            style={{ display: 'block', marginTop: '10px' }}
                        >
                            Show Important Note
                        </button>
                        <button 
                            className="clear-history-log-button" 
                            onClick={clearHistoryLogDebug} 
                            style={{ 
                                display: 'block', 
                                marginTop: '10px',
                                backgroundColor: needsHistoryClearConfirmation ? '#ff3333' : '#ff6666'
                            }}
                        >
                            {needsHistoryClearConfirmation ? 'Confirm Clear' : 'Clear History Log'}
                        </button>
                    </div>
                </div>
            </div>

            <div className="discord-info">
                <span
                    style={{
                        fontSize: '2em !important',
                        color: 'lightblue !important',
                        verticalAlign: 'bottom',
                        cursor: 'pointer',
                    }}
                    data-tooltip="For any issues or help with Project contact me using this username"
                >
                    Discord: sloshbank
                </span>
            </div>
        </div>
    );
};
