import { shouldLog } from './DebugOptions.js';

export const HAULING_DEBUG_FLAGS = {
    ADD_ENTRY: 'haulingMissions.addEntry',
    PROCESS_ORDERS: 'haulingMissions.processOrders',
    MISSION_GROUPING: 'haulingMissions.missionGrouping',
    STATUS_CHANGES: 'haulingMissions.statusChanges'
};

export const logAddEntry = (debugFlags, message, data = null) => {
    if (!shouldLog(debugFlags, HAULING_DEBUG_FLAGS.ADD_ENTRY)) return;
    
    console.log('\n[Hauling] Add Entry:');
    console.log('----------------------------------------');
    console.log(`  ${message}`);
    if (data) {
        console.log('  Data:', data);
    }
    console.log('----------------------------------------\n');
};

export const logProcessOrders = (debugFlags, message, data = null) => {
    if (!shouldLog(debugFlags, HAULING_DEBUG_FLAGS.PROCESS_ORDERS)) return;
    
    console.log('\n[Hauling] Process Orders:');
    console.log('----------------------------------------');
    console.log(`  ${message}`);
    if (data) {
        console.log('  Data:', data);
    }
    console.log('----------------------------------------\n');
};

export const logMissionGrouping = (debugFlags, message, data = null) => {
    if (!shouldLog(debugFlags, HAULING_DEBUG_FLAGS.MISSION_GROUPING)) return;
    
    console.log('\n[Hauling] Mission Grouping:');
    console.log('----------------------------------------');
    console.log(`  ${message}`);
    if (data) {
        console.log('  Data:', data);
    }
    console.log('----------------------------------------\n');
};

export const logStatusChange = (debugFlags, message, data = null) => {
    if (!shouldLog(debugFlags, HAULING_DEBUG_FLAGS.STATUS_CHANGES)) return;
    
    console.log('\n[Hauling] Status Change:');
    console.log('----------------------------------------');
    console.log(`  ${message}`);
    if (data) {
        console.log('  Data:', data);
    }
    console.log('----------------------------------------\n');
}; 