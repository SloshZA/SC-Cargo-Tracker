import React from 'react';
import { SubTabs } from './SubTabs';

// Tooltips descriptions for each tab
const TAB_DESCRIPTIONS = {
    'Capture': 'OCR tool to automatically capture mission details from screenshots or screen capture\n How to use\n Step 1- Click Capture Application window\n Step 2- Allow the browser to stream your application or screen\n Step 3- Open contract manager and select your mission\n Step 4- After video shows up drag a box over the area where the mission details and rewards, and make sure they are all in the box\n Step 5- Change mission in game and then use Capture key to speed up the process\n Step 6- Repeat until all missions are added\n Step 6- Clicking Add to Manifest button tab to submit all entries to Hauling Missions tab\n Important Info\n -When drawing the box you can include the primary objective text\n -If OCR reads the amount text wrong you can edit it manually to update to the correct amount\n -When scanning, each scan will be grouped under 1 missions to make it easier for users to access missions',
    'Hauling Missions': 'Track and manage your cargo hauling missions and deliveries\n -Drop down boxes allow for manual entry and has search functionality\n -Mission Checkboxes on the right will allow you to add multiple entries to a single mission when dealing with multiple locations\n - Buttons -\n -Add entry- will take above details and will place them in the table below\n -Process Orders - All entries marked as Delivered will be sent to History and Payouts Tab\n -Missions/Manifest - Switch between Cargo Manifest and Mission manifest table view\n -Clear Log - Click to clear both Cargo and Mission Manifest\n -SCU TOTAL - Will dispaly total SCU from all Cargo manifest entries\n -Tables-\n -Groups by drop off points and has collapse functionality\n -QTY coloumn will display 2 values Left value is for current amount and Right value is for Original amount added\n -Action Buttons - Allows a bit of fine control with your entries\n - Status displays if a entry is Pending or Delivered, the user can click on it to change the status and will sync with mission its linked to in the missions table',
    'History': 'View completed deliveries and mission history grouped by date then drop off points',
    'Payouts': 'Track mission rewards and payment history grouped by date and then mission ID',
    'Route Planner': 'Plan and optimize your hauling routes between locations\n -Coming Soon-\n -Route optimization\n -Distance calculation\n -Fuel consumption estimation\n -Multiple waypoint planning\n -Route saving and sharing',
    'Inventory': 'Track and manage your personal inventory items\n -Coming Soon-\n -Personal inventory tracking\n -Item categorization\n -Search and filter functionality\n -Quantity tracking\n -Value estimation',
    'Ships': 'Manage your ship cargo holds and loadouts\n -Coming Soon-\n -Ship cargo capacity tracking\n -Multiple ship management\n -Loadout configurations\n -Cargo distribution optimization\n -Quick cargo transfer between ships',
    'Storage': 'Track items across various storage locations\n -Coming Soon-\n -Multiple storage location tracking\n -Storage capacity management\n -Item location finder\n -Storage space optimization\n -Transfer history logging'
};


const haulingSubTabs = [
    'Hauling Missions',
    'Capture',
    'History',
    'Payouts'
];

export const Tabs = ({ 
    mainTab, 
    haulingSubTab, 
    cargoHoldSubTab, 
    handleMainTabChange, 
    handleTabChange, 
    handleCargoHoldTabChange,
    handleTooltipClick 
}) => {
    return (
        <>
            {/* Main Tabs */}
            <div className="main-tabs">
                {['Hauling', 'Cargo Hold', 'Mining', 'Trading', 'Preferences', 'Changelog'].map(tab => (
                    <div 
                        key={tab} 
                        className={`main-tab ${mainTab === tab ? 'active-main-tab' : ''}`} 
                        onClick={() => handleMainTabChange(tab)}
                    >
                        {tab}
                    </div>
                ))}
            </div>
            
            {/* Sub Tabs */}
            <SubTabs
                mainTab={mainTab}
                haulingSubTab={haulingSubTab}
                cargoHoldSubTab={cargoHoldSubTab}
                handleTabChange={handleTabChange}
                handleCargoHoldTabChange={handleCargoHoldTabChange}
                handleTooltipClick={handleTooltipClick}
                TAB_DESCRIPTIONS={TAB_DESCRIPTIONS}
            />
        </>
    );
}; 