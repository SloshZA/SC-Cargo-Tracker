# Star Citizen Cargo Hauling Tracker

A comprehensive tool for managing and tracking multiple cargo hauling missions in Star Citizen.

## Features

### Capture Tab
- **OCR Integration**: Uses Tesseract OCR to stream video and capture mission details
- **Interactive Selection**: 
  - Draw boxes around mission areas to automatically add to a table
  - Custom recapture button to reuse previously drawn boxes
  - Experimental constant capture mode for quick scanning
  - User can interact with Amount on results table to update incase of bad reads
  - Undo OCR button to correct text recognition errors
  - Automatic text validation with % word matching for improved accuracy
  - Entries that dont meet requirments apprear red in the table giving you a visual indicator to bad reads


### Hauling Missions Tab
- **Location Selection**: Choose pickup and drop-off points
- **Quick Lookup**: Auto-fill drop boxes for faster mission setup
- **Mission Preview**: Hover over missions to see existing entries
- **Automatic Mission Allocation**: Set a desiered key for when your adding manual entries and speed through the process of adding missions

### Buttons
- **Add Entry**: Process drop box selections into the table
- **Process Orders**: Move delivered orders to History and Payouts tabs
- **Missions**: Switch to missions table view
- **Clear Log**: Clear all entries (with confirmation)

### SCU Tracking
- Real-time SCU total tracking in the manifest table

### Hauling Manifest Table
- **Reorganization**: Use up/down arrows on the location names to rearrange entries
- **Grouping**: Drop-off points as collapsible headers
- **Delivery Tracking**: Mark all cargo for a drop-off point as delivered
- **Route Planning**: Set up pre defined routes that will automatically sort your hauling manifest list. This allows you to quickly sort routes and help sorting of boxes

### Table Layout
- **Pickup**: Display selected pickup point
- **Commodity**: Show selected commodity
- **QTY**: Current/Original amounts with percentage tracking
- **Action Buttons**:
  - Text box for quantity updates
  - Update Cargo button
  - Remove Cargo option
- ***Status**: Switches between Pending and Delivered. Entries marked as delivered will be sent to the payouts/history table and entries marked as Pending will be ignored. The user can click on the pending or delivered to switch between the 2. This also links up to the missions table for easier usability

### History & Payouts
- **History Table**: Track delivered cargo with date, location, and commodity details
- **Payouts Table**: Mission-specific tracking with custom reward amounts

### Cargo Hold
- **Ships**: This tab allows you to add ships to your fleet, for use in the storage tab and the 3D cargo grid
- **Storage**: Allows the user to select comoddities from the list on the left and specifiy the size and quantity of the boxes for either a ship added to your fleet. You can also view all cargo from the hauling manifest to see if it would fit on your ship by clicking the Cargo view button

### Preferences
- Customizable colors and fonts

### Data Management
- **Export/Import History**: Save/load history and payouts as .json or .xls files
- **Export/Import User Settings**: Save/Load user preferences like colors and font
- **Export/Import Route Presets**: Save/Load user Route Presets
- **Export/Import Local Storage**: Save/Load Local Storage - you would use this if your changing browsers or if you have any issues with tables loading
- **Clear History**: Option to wipe history and payouts data
- **Delete Local Storage**: This will remove everything you have done and reset the app back to its original state, all user settings/ routes/ history and payouts tables will be removed (Please Bkacup needed items before using this)

## Usage
1. **Setup**: Ensure your browser allows you to stream vide from your application
2. **Capture**: Use the Capture Tab to add missions via OCR (You should have your mobiglass open and have a mission selected)
3. **Organize**: Manage missions in the Hauling Missions Tab
4. **Plan**: Plan your routes according to your prefered trips
5. **Track**: Monitor cargo in the Hauling Manifest Table
6. **Review**: Analyze completed missions in History and Payouts tabs
7. **Customize**: Adjust appearance in Preferences
8. **Manage Data**: Export/Import data as needed

## Third-Party Licenses

This project uses several open-source packages. We acknowledge and are grateful to these contributors:

### Core Dependencies
- [React](https://github.com/facebook/react) - MIT License
- [React DOM](https://github.com/facebook/react) - MIT License
- [React Color](https://github.com/casesandberg/react-color) - MIT License
- [React Select](https://github.com/JedWatson/react-select) - MIT License
- [React Window](https://github.com/bvaughn/react-window) - MIT License
- [Tesseract.js](https://github.com/naptha/tesseract.js) - Apache-2.0 License
- [Three.js](https://github.com/mrdoob/three.js) - MIT License

### Development Dependencies
- [Parcel](https://github.com/parcel-bundler/parcel) - MIT License
- [gh-pages](https://github.com/tschaub/gh-pages) - MIT License

For full license texts, please see the respective packages' repositories or the `node_modules` directory.

This tool is unofficial and not affiliated with Cloud Imperium Games
