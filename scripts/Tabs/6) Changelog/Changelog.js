import React from 'react';

export const ChangelogTab = () => {
    return (
        <div className="changelog">
            <div className="changelog-container">
                <div className="changelog-entry">
                    <h3>Version 1.6.1</h3>
                    <h4>Hotfix</h4>
                    <ul>
                        <li>UI issues when using certain fonts causing increased text size and pushing boxes off - fixed.</li>
                        <li>Payouts table not displaying amount - fixed.</li>
                        <li>Changed "amount" to "QTY" to match other table formats.</li>
                    </ul>
                    <h4>Note</h4>
                    <ul>
                        <li>Looks like most things are done on the hauling tab. I will be adding some features to the Cargo Hold, which is more just of spice of life features.</li>
                        <li>Inventory tab will just be for the users that want to keep track of the total of all boxes in the ship currently.
                            <ul>
                                <li>Mainly for users that want to track mining or salvaging or even bounty cargo they "Rightfully acquired" just a way to log it for immersion reasons.</li>
                                <li>WIP will take some time - 3D cargo grid for a select few ships for the start - will add drag function. End goal will be to have the tab allow auto sorting to give you an idea of more efficient packing (this will be later).</li>
                            </ul>
                        </li>
                        <li>Route Planner/Automation
                            <ul>
                                <li>This will be a tab for cargo hauling that lets the user set a custom route so when adding entries from either capture tab or manually will update the list and place them in the order you prefer.</li>
                                <li>Aimed at the users that like 1 specific set route.</li>
                            </ul>
                        </li>
                        <li>Ships / Brainstorming</li>
                        <li>Storage - not sure if it's needed.</li>
                        <li>Mining Tab - still thinking about this one as there are 2 sites with good mining apps already.</li>
                        <li>Trading - will see about getting an API key for UEX, I don't want to do what they do I just want a way to keep track of trading I've done how far I've flown money made etc etc.</li>
                    </ul>
                </div>
                <div className="changelog-entry">
                    <h3>Version 1.6.0</h3>
                    <h4>Important Note</h4>
                    <ul>
                        <li>Due to a significant file restructure, the History and Payouts tabs may experience some initial issues. I apologize for any inconvenience. This type of issue should be less likely in future updates. If you encounter problems, please export your local storage from the Preferences tab as a backup.</li>
                    </ul>
                    <h4>File Structure Overhaul</h4>
                    <ul>
                        <li>The project's file structure has been completely overhauled, splitting single CSS and JS files into respective files for faster loading and easier future maintenance.</li>
                    </ul>
                    <h4>UI Changes</h4>
                    <ul>
                        <li>The UI has been updated for better readability, necessitated by CSS issues resulting from the file restructure.</li>
                    </ul>
                    <h4>Capture Feature</h4>
                    <ul>
                        <li>The selection box used for the capture feature will now be saved and automatically reloaded (after a 1-second delay) for streamlined reusability.</li>
                        <li>OCR capture performance varies depending on system configuration. Enable debug mode (Preferences -&gt; F12 -&gt; Console) to monitor scan times. Background elements can significantly impact scan times.</li>
                    </ul>
                    <h4>Debug Options</h4>
                    <ul>
                        <li>Debug options have been added (and can be disabled in the Preferences menu). Disabling debug options will also hide all corrections on the OCR capture screen.</li>
                    </ul>
                    <h4>Automatic Mission Allocation</h4>
                    <ul>
                        <li>A new hotkey-driven automatic mission allocation feature has been implemented. Enable/disable by clicking the word above the mission checkboxes. Missions will be auto-added to the first empty mission slot. Use the hotkey (Default: M) to progress to the next mission.</li>
                        <li>The hotkey only functions when the amount input box is focused. Quick lookup, pickup point, drop-off points, and commodity dropdowns will now auto-focus the amount box.</li>
                        <li>The hover-to-display-mission-entries functionality has been retained.</li>
                    </ul>
                </div>
                <div className="changelog-entry">
                    <h3>Version 1.5.0</h3>
                    <h4>Capture Tab</h4>
                    <ul>
                        <li><strong>Improved:</strong> Tesseract capture method.</li>
                        <li><strong>Note:</strong> After ~28 entries, OCR may repeat old results. Cycle video off/on to resolve.</li>
                        <li><strong>Success Rate:</strong> Very high. 1 error in 25 missions.</li>
                        <li><strong>Disclaimer:</strong> Results vary based on screen size, resolution, render method, and sharpness.</li>
                        <li><strong>Fixed:</strong> OCR parsing issues due to unmatched text.</li>
                    </ul>
                </div>
                <div className="changelog-entry">
                    <h3>Version 1.4.0</h3>
                    <h4>New Features</h4>
                    <ul>
                        <li><strong>Cargo Hold Tab (WIP):</strong> On-board cargo tracking.</li>
                        <li><strong>Trading Tab (WIP):</strong> Placeholder for future trading features.</li>
                        <li><strong>Capture Tab:</strong>
                            <ul>
                                <li>OCR recognition for mission rewards.</li>
                                <li>Auto-population of table with mission details.</li>
                            </ul>
                        </li>
                        <li><strong>Mission Rewards Tracking:</strong> Rewards move from OCR to Hauling Missions tab.</li>
                    </ul>
                    <h4>Improvements</h4>
                    <ul>
                        <li><strong>Mission List:</strong> Adds an extra entry after the previous entry has been filled.</li>
                    </ul>
                </div>
                <div className="changelog-entry">
                    <h3>Version 1.3</h3>
                    <h4>New Features</h4>
                    <ul>
                        <li><strong>Debug Mode for OCR Capture:</strong> "Debug Info" button under Capture tab.</li>
                        <li><strong>Tooltips:</strong> Added tooltips for general info and usage instructions.</li>
                    </ul>
                    <h4>Fixes</h4>
                    <ul>
                        <li><strong>Fixed:</strong> "Undo OCR Mistake" button.</li>
                    </ul>
                </div>
                <div className="changelog-entry">
                    <h3>Version 1.2.1 - HotFix</h3>
                    <ul>
                        <u>FIXES</u>
                        <li>Mission entries being displayed as separate missions when adding to the Payouts tab and having different locations.</li>
                        <li>OCR no longer shows a success message when no text is detected.</li>
                    </ul>
                </div>
                <div className="changelog-entry">
                    <h3>Version 1.2.0 - Fixes and Temporary Changes</h3>
                    <ul>
                        <li>1AM fixes be like</li>
                        <u>FIXES</u>
                        <li>Forgot to use my index on status toggling, so if you have 2 drop-off points, only the top drop-off point was being toggled.</li>
                        <li>Added green text to the "Delivered" status of missions in the mission table.</li>
                        <li>Fixed entries added from OCR capture to allow individual status toggling synced with missions using ID.</li>
                        <li>Added to OCR results table to track missions.</li>
                        <li>- Each scan is considered a mission and is tracked in the OCR results table as well.</li>
                        <li>- No need to click on the Hauling tab and then come to the Capture tab to add entries to missions.</li>
                        <u>KNOWN BUGS</u>
                        <li>When adding mission entries to payouts, some tables are ignored. Looking into it.</li>
                        <u>TODO</u>
                        <li>Turn the mission list into a dynamic list instead of a fixed 10 slots.</li>
                        <li>Add capturing reward amount table for even less input required X_X.</li>
                    </ul>
                </div>
                <div className="changelog-entry">
                    <h3>Version 1.1.0 - Fixes and Temporary Changes</h3>
                    <ul>
                        <u>ADDITIONAL TABS</u>
                        <li>Mining (WIP) - Shoutout to huskerbolt1 for giving me a new idea.</li>
                        <u>FIXES</u>
                        <li>Non-missions being sent to the Payouts tab.</li>
                        <li>Imports not being saved on refresh.</li>
                        <li>Constant capture countdown going from 3 to the user's set time and then counting down.</li>
                        <li>Clicking status changes between "Pending" and "Delivered" for both mission and cargo manifest by using a unique ID to keep track. Thanks to Ruadhan2300 for pointing out ease of use.</li>
                        <u>TEMPORARY REMOVAL</u>
                        <li>Removed import/export payouts function.</li>
                    </ul>
                </div>
                <div className="changelog-entry">
                    <h3>Version 1.0.0 - Initial Release</h3>
                    <ul>
                        <li>Added Hauling Mission tracking system.</li>
                        <li>Improved OCR accuracy.</li>
                        <li>Added mission management system.</li>
                        <li>Added history tracking.</li>
                        <li>Added customizable preferences.</li>
                        <li>Added import/export functionality.</li>
                    </ul>
                </div>
                <div className="changelog-entry">
                    <h3>Version 0.9.0 - Beta</h3>
                    <ul>
                        <li>Added constant capture mode.</li>
                        <li>Added customizable capture intervals.</li>
                        <li>Implemented OCR capture functionality.</li>
                        <li>Added status toggling for individual entries.</li>
                    </ul>
                </div>
                <div className="changelog-entry">
                    <h3>Version 0.8.0 - Alpha</h3>
                    <ul>
                        <li>Initial implementation of cargo tracking.</li>
                        <li>Basic mission system.</li>
                        <li>Basic UI and styling.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}; 