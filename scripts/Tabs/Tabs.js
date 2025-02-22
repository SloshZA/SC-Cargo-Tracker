import React from 'react';
import { SubTabs } from './SubTabs';
import './Tabs.css';

// Tooltips descriptions for each tab
const TAB_DESCRIPTIONS = {
    'Capture': 'OCR tool to automatically capture mission details from screenshots or screen capture\n How to use\n Step 1- Click Capture Application window\n Step 2- Allow the browser to stream your application or screen\n Step 3- Open contract manager and select your mission\n Step 4- After video shows up drag a box over the area where the mission details and rewards, and make sure they are all in the box\n Step 5- Change mission in game and then use Capture key to speed up the process\n Step 6- Repeat until all missions are added\n Step 6- Clicking Add to Manifest button tab to submit all entries to Hauling Missions tab\n Important Info\n -When drawing the box you can include the primary objective text\n -If OCR reads the amount text wrong you can edit it manually to update to the correct amount\n -When scanning, each scan will be grouped under 1 missions to make it easier for users to access missions',
    'Hauling Missions': 'Track and manage your cargo hauling missions and deliveries\n' +
    '-Drop down boxes allow for manual entry and has search functionality\n' +
    '-Mission Checkboxes on the right will allow you to add multiple entries to a single mission when dealing with multiple locations\n\n' +
    '- Buttons -\n' +
    '-Route Planner - Used to auto sort locations in prefered order\n' +
    '-Add entry- will take above details and will place them in the table below\n' +
    '-Process Orders - All entries marked as Delivered will be sent to History and Payouts Tab\n' +
    '-Missions/Manifest - Switch between Cargo Manifest and Mission manifest table view\n' +
    '-Clear Log - Click to clear both Cargo and Mission Manifest\n' +
    '-SCU TOTAL - Will dispaly total SCU from all Cargo manifest entries\n\n' +
    '-Tables-\n' +
    '-Groups by drop off points and has collapse functionality\n' +
    '-QTY coloumn will display 2 values Left value is for current amount and Right value is for Original amount added\n' +
    '-Action Buttons - Allows a bit of fine control with your entries\n' +
    '- Status displays if a entry is Pending or Delivered, the user can click on it to change the status and will sync with mission its linked to in the missions table',
    'History': 'View completed deliveries and mission history grouped by date then drop off points',
    'Payouts': 'Track mission rewards and payment history grouped by date and then mission ID',
    'Route Planner': 'Plan and optimize your hauling routes between locations\n -Coming Soon-\n -Route optimization\n -Distance calculation\n -Fuel consumption estimation\n -Multiple waypoint planning\n -Route saving and sharing',
    'Ships': 'Manage your ship cargo holds and loadouts\n -Coming Soon-\n -Ship cargo capacity tracking\n -Multiple ship management\n -Loadout configurations\n -Cargo distribution optimization\n -Quick cargo transfer between ships',
    'Storage': 'Track Items present in your ship from either manual entry or from the Hauling Manifest\n' +
    '-Ship Selection - (Coming Soon)\n' +
    '-Manifest View/Cargo\n' +
    '-Quick Delete Button - Toggle\n' +
    '--Toggling this on will NOT display a confirmation window\n\n' +
    '-Left Side Window-\n' +
    '- Displays all commodities and split between Commodities and Illegal Commodities with a collapsable tab\n' +
    '- Search Filter to quickly find the Commodity your looking for\n' +
    '- Clicking entries will send it to the list on the right.\n' +
    '-- Entries present in the table will have a border around them\n' +
    '-- Clicking the button again will NOT remove them\n\n' +
    '-Right Side Window-\n' +
    '- Displays all entries added or shows current cargo from Hauling Manifest\n' +
    '- Entries come pre collapased for better Visibility\n' +
    '- Total SCU tracks combined total of the present containers (No manual entry since cargo sizes can vary)\n' +
    '- Clear Storage Table will remove all entries on the right side\n' +
    '- There is a button for each Container Size number.\n' +
    '-- Left Click will +/add 1\n' +
    '-- Right Click will -/remove 1\n' +
    '-- Allows the number below to be edited\n\n' +
    'Note:\n' +
    '-Hauling Manifest View-\n' +
    'When this is enabled the user will not be able to interact with the following\n' +
    '- Ship Selection - (Coming Soon)\n' +
    '- Quick Delete\n' +
    '- Clear Storage Table\n' +
    '- X cross button and SCU buttons for the commodities'
};


const haulingSubTabs = [
    'Hauling Missions',
    'Capture',
    'History',
    'Payouts'
];

const Tabs = ({ 
    mainTab, 
    haulingSubTab, 
    cargoHoldSubTab, 
    handleMainTabChange, 
    handleTabChange, 
    handleCargoHoldTabChange,
    handleTooltipClick 
}) => {
    return (
        <div className="tabs-container">
            {/* Main Tabs */}
            <div className="main-tabs">
                {['Hauling', 'Cargo Hold', 'Trading', 'Preferences', 'Changelog'].map(tab => (
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
        </div>
    );
};

export default Tabs; 