# Version 2.0

## Major Changes
- **UI Size:** Changed to full screen scale instead of small window in center
  - Scaling still works but gets weird when size becomes too small (Half window for 1920x1080 works)
  - Making changes to tab layouts for better PC experience

## New Features
- **3D Cargo Grid - Test Version**
  - Allows users to place and move cargo boxes in 3D space
  - **Playground:** Custom grids with unlimited cargo (4 separate grids)
  - **Ship:** Two options
    - Presets for quick grid size settings (More grids to be added)
    - Cargo Hold integration to load cargo from storage
  - **Manifest:** Pull mission cargo into 3D environment with box sizes calculated from highest to lowest (matches in-game cargo mission acceptance)
- **Extra Features:**
  - New window popup when adding boxes from manifest/cargo hold
  - Displays all missions and commodities with highlighting for easier identification
- **UI Changes for 3D Cargo Grid:**
  - Current graphics are plain and simple (will be changed)

## Currently in Work
- Adding more ships
- Adding blocked zones to grids for proper alignment with cargo grid designs
- Adding ability to move grids around (after fixing other bugs)

## Cargo Hold - Ships
- Added ship management option
  - Adding ships adds them to available ships list under storage tab
  - Adding the same ship again indexes name (1, 2, 3) as separate entries to allow more than one of the same ship
  - Links to 3D Cargo Grid tab for populating environment with boxes
  - Ships are sorted by SCU Capacity

## Bug Report
- Changed "Experiencing bugs" button to "Bug Report"
  - Opens new tab to Google Form
  - Original guide on simple fixes remains

## Misc Fixes
- Pyro Location Recognition improvements

## Known Issues
- **Hauling - Route Planner - Basic View:**
  - Still not allowing users to move entries up and down
- **Hauling - Hauling Missions:**
  - Need to add Pyro locations to quick lookup and drop off points
- **Capture Tab:**
  - First capture 90% wrong read - second capture corrects result
- **3D Cargo Grid:**
  - Boxes can't be placed under another box if there's a box above it
  - Height calculation bugged - currently removed (default height set to 20 blocks)
- **Preferences Layout:**
  - Blocks are spaced out

## Todo
- **Trading Tab:**
  - Add simple cargo type and value based on user input
  - Similar input as storage tab but with aUEC value and locations
  - Can still use hauling manifest to track trading trips
- **3D Cargo Grid:**
  - Save cargo present based on cargo hold data
  - Example: Hull C's 4 grids will be made, switching to playground loads separate instance to keep box locations saved 