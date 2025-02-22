import React from 'react';

export const ChangelogTab = () => {
    return (
        <div className="changelog">
            <div className="changelog-container">
            <div className="changelog-entry">
                    <h3>Version 1.9</h3>
                    <h4>New Features</h4>
                    <ul>
                        <li><b>Cargo Hold → Storage</b></li>
                        <li>Not final design, might change it around at a later date but does what it need to right now</li>
                        <ul>
                            <li>Added storage tab for tracking current onboard cargo or manifest cargo</li>
                            <li><b>Ship Selection:</b> Not yet implemented - coming soon</li>
                            <ul>
                            <li><b>Top Window:</b> Select ship to view or add to its cargo (updates list based on onboard cargo)</li>
                            <li>Quick Delete toggle - prevents confirmation windows from popping up when clearing table or removing single entries</li>
                            </ul>
                            <li><b>Left Window:</b> Add selected cargo</li>
                            <li><b>Right Window:</b> Specify SCU size and calculate total SCU</li>
                            <li>Added toggle button to switch between Cargo View and Manifest View</li>

                        </ul>
                        <li><b>Storage Interactions</b></li>
                        <ul>
                            <li>Collapsible categories for Commodities and Illegal Commodities</li>
                            <li>Search bar - filters entries by name or code (e.g., "Alum" shows Aluminum and Aluminum (Raw))</li>
                        </ul>
                    </ul>

                    <h4>Changes</h4>
                    <ul>
                        <li><b>Removed Inventory</b></li>
                        <ul>
                            <li>Seems redundant to use an inventory to track items in your ships</li>
                            <li>There are existing sites that allow org members to share lists</li>
                        </ul>
                        <li><b>Added Pyro locations to Dropdown boxes on Hauling Missions tab</b></li>
                        <ul>
                            <li>Added checkboxes for Stanton System and Pyro System</li>
                            <li>Quick lookup and pickup point still display Stanton locations</li>
                            <li>When Pyro system is selected, quicklookup and pickup are disabled</li>
                        </ul>
                        <li><b>OCR Capture</b></li>
                        <ul>
                            <li>Pyro Locations work without full data but may have misreads</li>
                            <li>Added initial name corrections for Pyro locations</li>
                        </ul>
                    </ul>

                    <h4>Fixes</h4>
                    <ul>
                        <li><b>Tooltips</b></li>
                        <ul>
                            <li>Fixed tooltips not opening</li>
                        </ul>
                        <li><b>Hauling Mission</b></li>
                        <ul>
                            <li>Fixed manifest view bug where entries from capture tab would jumble when using remove cargo</li>
                        </ul>
                        <li><b>Capture Tab</b></li>
                        <ul>
                            <li>Fixed quantity changes only updating first mission</li>
                            <li>Added more name corrections</li>
                        </ul>
                        <li><b>Hauling Manifest</b></li>
                        <ul>
                            <li>Increased max mission entries from 15 → 20</li>
                            <li>Fixed auto mission allocation text bug on mission 15</li>
                            <li>Fixed mission reward values persisting after mission removal</li>
                            <li>Fixed missions staying behind when using remove cargo button in drop-off view</li>
                        </ul>
                        <li><b>Advanced Route Planning</b></li>
                        <ul>
                            <li>Pyro Missions are now visible</li>
                        </ul>
                    </ul>

                    <h4>Known Issues</h4>
                    <ul>
                        <li><b>Cargo Hold - Manifest View</b></li>
                        <ul>
                            <li>SCU calculations for commodities consider the sum across all Drop off points in the Hauling Manifest table rather than per mission</li>
                            <li>Will add isMissionEntry check to adjust calculations</li>
                        </ul>
                    </ul>
                </div>

                <div className="changelog-entry">
                    <h3>Version 1.8</h3>
                    <h4>New Features</h4>
                    <ul>
                        <li><b>Cargo Hold → Storage</b></li>
                        <ul>
                                <li><b>Top Panel:</b> Ship Selection - Coming Soon</li>
                                <li><b>Left Panel:</b> Cargo management - add/remove cargo items with collapsible categories (Commodities, Illegal Commodities)</li>
                                <li><b>Right Panel:</b> SCU calculation - specify SCU size and automatically calculate total SCU</li>
                        </ul>
                        <li><b>Storage Interactions</b></li>
                        <ul>
                            <li>Quick Delete toggle - removes confirmation dialogs for clearing table or single entries</li>
                            <li>Filter Search - filters items by name or code (e.g., "Alum" shows Aluminum and Aluminum (Raw))</li>
                            <li>Collapsible categories - better organization of commodity types</li>   
                        </ul>
                        <li><b>Storage Notes</b></li>
                        <li>Currently im displayed all commodities and illegal commodities, i will go through and remove entries that are irrelevant.</li>
                    </ul>

                    <h4>Changes</h4>
                    <ul>
                        <li><b>Removed Inventory</b></li>
                        <ul>
                            <li>Seems redundant to use an inventory to track items in your ships</li>
                            <li>There is a site that lets you login and group with your Org buddies and share a list</li>
                        </ul>
                        <li><b>Added Pyro locations to Dropdown boxes on Hauling Missions tab</b></li>
                        <ul>
                            <li>Added 2 checkboxes to the top of the hauling missions for Stanton System and Pyro System</li>
                            <li>Quick lookup and pickup point will still display the Stanton locations</li>
                            <li>When Pyro system is ticked, the quicklookup and pickup are disabled for now</li>
                        </ul>
                        <li><b>OCR Capture</b></li>
                        <ul>
                            <li>Pyro Locations work without the data present but have misreads</li>
                            <li>Added small name corrections for Pyro locations</li>
                            <li>Expect misreads still - will have to add more corrections as I go</li>
                        </ul>
                    </ul>

                    <h4>Known Issues</h4>
                    <ul>
                        <li><b>Tooltips</b></li>
                        <ul>
                            <li>Tooltips not opening</li>
                        </ul>
                        <li><b>Hauling Manifest</b></li>
                        <ul>
                            <li>Max mission entries updated from 15 → 20 for now</li>
                            <li>Auto mission allocation text bug on mission 15 (not serious)</li>
                            <li>Pyro System - quicklookup and pickup points not populated with Pyro locations (will fix on the weekend)</li>
                        </ul>
                        <li><b>Basic View</b></li>
                        <ul>
                            <li>Can't move entries up or down</li>
                        </ul>
                    </ul>
                </div>
                <div className="changelog-entry">
                    <h3>Version 1.7</h3>
                    <h4>New Feature</h4>
                    <ul>
                        <li><b>Route Planner</b></li>
                        <ul>
                            <li>A new button is now visible at the top of your hauling manifest (Design will change - placeholder for now)</li>
                            <li>Allows the user to set an order for your drop-off points to appear in, when adding manually or from the capture tab</li>
                            <li>2 Modes:</li>
                            <ul>
                                <li>Basic View - using the entries present in your table</li>
                                <li>Advanced View - manually add and remove entries to a preset to setup larger routes or preferred routes</li>
                            </ul>
                            <li>Comes with an Active Route checkbox to automatically re-order your drop-off points based on your saved preset</li>
                            <li>Presets need to be done manually with entries in the table or through the advanced Route planner</li>
                            <li>Advanced Route Planner will indicate which entry is currently in the table (shown in red text below the location name)</li>
                            <li>See Help in the window for more info and how to use</li>
                        </ul>
                    </ul>
                    <h4>Changes</h4>
                    <ul>
                        <li><b>Hauling Missions Tab</b></li>
                        <ul>
                            <li>Added the full list of locations to the quick lookup and pickup point</li>
                        </ul>
                        <li><b>Mining Tab</b></li>
                        <ul>
                            <li>Hidden for the time being as cargo hold will allow you to add or remove cargo to your ship as a way of tracking for multiple professions</li>
                            <li>Note: There are much better sites out there for tracking mining</li>
                        </ul>
                        <li><b>Preferences Tab</b></li>
                        <ul>
                            <li>Redo of Preferences Tab</li>
                            <li>Added Sidebar for better future use</li>
                            <li>Debug options moved to the Debug options on the left instead of at the bottom of the page</li>
                            <li>Export and import Functions:</li>
                            <ul>
                                <li>All exports now let you choose between .json for basic text file or .xls for Excel sheet format</li>
                                <li>Clear History Log/Delete Local Storage/Clear Route Presets now have a popup - no more double clicking</li>
                            </ul>
                            <li>User Settings:</li>
                            <ul>
                                <li>Exporting/Importing your color and font into a .json file</li>
                            </ul>
                        </ul>
                    </ul>
                    <h4>Fixes</h4>
                    <ul>
                        <li>'Riker Memorial Spaceport' is considered invalid when using manual entry in the following dropdowns:</li>
                        <ul>
                            <li>Pickup Point</li>
                            <li>Quick Lookup</li>
                            <li>Drop-off point - not showing</li>
                        </ul>
                        <li>Following locations for filter search appearing under Distribution Centers:</li>
                        <ul>
                            <li>Humboldt Mine</li>
                            <li>Loveridge Mineral Reserve</li>
                            <li>Shubin Mining Facility SAL-2</li>
                            <li>Shubin Mining Facility SAL-5</li>
                        </ul>
                        <li>Searching keywords like City/Distribution/Outpost/Station/Lagrange does not filter relevant locations in Advanced Route Planning</li>
                    </ul>
                    <h4>Known Issues</h4>
                    <ul>
                        <li>Mission Limit set to 15 for now while testing stability</li>
                        <li>Using Basic View up and down arrows aren't working - Workaround: Sort in the Hauling Manifest table instead</li>
                    </ul>
                </div>
                <div className="changelog-entry">
                    <h3>CHANGES</h3>
                    <ul>
                        <li><b>Hauling Mission Tab</b></li>
                        <ul>
                            <li>Changed the Mission Allocation box to a set font of Arial</li>
                            <ul>
                                <li>All other fonts will change unless they cannot be fixed to keep the layout smooth</li>
                                <li>Was having issues keeping the block a good size and still making it look nice</li>
                                <li>Will look into a fix later on</li>
                            </ul>
                        </ul>
                        <li><b>Payouts Tab</b></li>
                        <ul>
                            <li>Mission Reward Editing - NEW</li>
                            <ul>
                                <li>For users that need to edit the value after all processes have been completed</li>
                                <li>Sometimes you only notice the mistake at the end, this will make it a better experience for users who would like to keep track</li>
                            </ul>
                        </ul>
                        <li><b>UI Adjusting</b></li>
                        <ul>
                            <li>Adjusting column sizes to fit larger amounts and longer names to keep the table small and prevent wrapping of text to the next line</li>
                            <li>Tested with:</li>
                            <ul>
                                <li>Complex-A as drop-off and pickup</li>
                                <li>Agri supplies as commodity</li>
                                <li>QTY as 99,999/99,999</li>
                                <li>% as 100%</li>
                            </ul>
                        </ul>
                    </ul>
                </div>                <div className="changelog-entry">
                <h3>ADDED FEATURES</h3>
                <ul>
                    <li><b>Capture Tab - NEW</b></li>
                    <ul>
                        <li>Move Total Rewards $$$ to the right of the header for better readability</li>
                        <li>Added % next to reward for each mission group that tracks your % of the entries</li>
                        <ul>
                            <li>0-50% marks mission as Failed and red text on %</li>
                            <li>51-55% marks mission as Completed and red text on %</li>
                            <ul>
                                <li>The reason this is marked as such is because when you're turning in a mission below 50%, it will be marked as a failure in-game and deduct 10x rank-based mission from your rep.</li>
                                <li>e.g., if you fail a senior mission once, it will take the value of the rep (let's say 1000 rep) and multiply it by 10 to 10,000, then deduct that from your current rep (ruining your rank).</li>
                            </ul>
                            <li>56%-100% marked as Completed with no color change</li>
                        </ul>
                    </ul>
                </ul>
                </div>
                <div className="changelog-entry">
                <h3>FIXED</h3>
                    <ul>
                        <li><b>Capture Tab</b></li>
                        <ul>
                            <li>Fixed Reward from capture not populating the mission group reward</li>
                            <li>OCR Rewards not transferring correctly when using add to manifest</li>
                            <li>Mission Index Correctly now with Mission #</li>
                        </ul>
                        <li><b>Hauling Manifest</b></li>
                        <ul>
                            <li>Fixed remove Cargo button also clearing reward value of missions when there is no more entries</li>
                            <li>Toggle Status is now working between drop off points and mission table</li>
                        </ul>
                    </ul>

                    <h3>Known Issues</h3>
                    <ul>
                        <li>Max Mission 15 (stabilizing everything first)</li>
                        <li>UI issues for different font sizes</li>
                        <li>Misc UI Changes</li>
                    </ul>
                </div>


                 <div className="changelog-entry">
                 <h3>Fixed OCR Selection Box</h3>
                 <li>OCR Capture Selection box now loads previously saved size wrong math involved was scaling infinitely instead of refrencing the video resolution size</li>

                </div>
                <div className="changelog-entry">
                <h3>Important Notice</h3>
                    <ul>
                        <li>Finally squashing all the bugs from previous mistakes.</li>
                        <li>USE the button under the Preferences tab called "Delete Local Storage." There are a ton of old entries causing issues, like duplicate instances of payouts storage.</li>
                        <li>A clean wipe is best—export your tables if needed. Haven't tested them yet to ensure they repopulate correctly, but I tried keeping most tables the same, so hopefully, they work properly.</li>
                        <li>So far, I've restored a lot of the app's functionality. Tons of sections have been completely redone due to duplicated code being cut off halfway, which caused a mess of issues.</li>
                    </ul>

                    <h3>Known Issues - Currently being rewritten</h3>

                    <h4>Capture Tab</h4>
                    <ul>
                        <li>When scanning entries with the same reward amount and using "Add to Manifest," only one entry gets the reward value in the Mission Manifest table.</li>
                        <li><b>Workaround:</b> Manually entering a value fixes this and allows all entries with the same reward to process correctly.</li>
                        <li>Selection box for the application screen is not loading when loading a stream.</li>
                        <li>Scanning more than 15 missions and trying to send them to the table results in only the first 15 missions being sent.</li>
                    </ul>

                    <h4>Hauling Manifest</h4>
                    <ul>
                        <li>Max mission entries are currently capped at 15.</li>
                        <li>UI issues with different font sizes.</li>
                        <li>Toggling mission status from "Pending" to "Delivered" is working.</li>
                    </ul>

                    <h4>Payouts Tab</h4>
                    <ul>
                        <li>Missions are not indexed correctly. If you add 5 missions and then add another 5 later, instead of numbering them 6-10, they start at 1 again.</li>
                    </ul>

                    <h4>Debug Options</h4>
                    <ul>
                        <li>Currently a jungle in there, but enabling "Debug Mode" (Preferences Tab) shows most processes happening between the Capture Table, Hauling Tables, and History/Payouts Table.</li>
                    </ul>
                </div>
                <div className="changelog-entry">
                <h3>Apologies for the issues</h3>
                    <ul>
                        <li>issues with the tables not dispalying properly or entries not being processed</li>
                        <li>This ithe outcome of being lazy and tried then asking Deepseek to change a class name and bam he changed 4 table names and duplicated some functions and renamed them aswell took me awhile to find all the mistakes made and some tables i jsut scraped and re did because im pretty sure theres code in here that does nothing. busy going through all the files and code.</li>
                        <li>Made some fixes for the tables by just remaking them hopefully these changes work i ran a few tests but knowing this cluster duck, its gonna take some time to fix te last few things, worst issue was it added a new payout and history local storage table and renamed it to Entries Q_Q...</li>
                        <li>Other than the above rant sorry for the past few days of issues and thanks for your patience.</li>
                    </ul>
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