// Debug console logging utility
export const DebugLogs = {
    haulingMissions: {
        processOrders: {
            completedEntries: (entries) => console.log('Completed entries:', entries),
            processingEntry: (key, entry) => console.log('Processing entry for mission:', key, entry),
            createdGroup: (key) => console.log('Created new mission group for index:', key),
            updatedGroup: (key, group) => console.log('Updated mission group:', key, group),
            finalGroups: (groups) => console.log('Final mission groups:', groups),
            processingGroup: (index, group) => console.log('Processing mission group:', index, group),
            incrementingSlot: (slot) => console.log('Incrementing slot to:', slot),
            addingEntries: (slot, entries) => console.log('Adding entries with new index:', slot, entries),
            nonMissionEntries: (entries) => console.log('Adding non-mission entries:', entries),
            finalHistory: (history) => console.log('Final updated history:', history)
        },
        addEntry: {
            newEntry: (entry) => console.log('Adding new entry:', entry),
            missionUpdate: (missionIndex, entries) => console.log('Updated mission entries for index:', missionIndex, entries)
        },
        statusChanges: {
            statusToggle: (entry, newStatus) => console.log('Toggling status for entry:', entry, 'to:', newStatus),
            markingDelivered: (entries) => console.log('Marking entries as delivered:', entries)
        }
    },
    capture: {
        ocrProcessing: {
            rawText: (text) => console.log('Raw OCR text:', text),
            parsedResults: (results) => console.log('Parsed OCR results:', results)
        },
        locationCorrection: {
            correction: (original, corrected) => console.log('Location corrected from:', original, 'to:', corrected)
        },
        dataValidation: {
            validation: (data) => console.log('Validating data:', data),
            errors: (errors) => console.log('Validation errors:', errors)
        }
    },
    history: {
        entryGrouping: {
            grouping: (entries) => console.log('Grouping history entries:', entries),
            result: (groups) => console.log('Grouped result:', groups)
        },
        dataLoading: {
            loading: (data) => console.log('Loading history data:', data)
        }
    },
    payouts: {
        missionTracking: {
            tracking: (mission) => console.log('Tracking mission:', mission),
            rewards: (rewards) => console.log('Mission rewards:', rewards)
        },
        rewardCalculations: {
            calculation: (data) => console.log('Calculating rewards:', data),
            total: (total) => console.log('Total rewards:', total)
        }
    },
    localStorage: {
        saving: {
            data: (key, data) => console.log('Saving to localStorage:', key, data)
        },
        loading: {
            data: (key, data) => console.log('Loading from localStorage:', key, data)
        }
    },
    stateChanges: {
        entries: {
            update: (entries) => console.log('Updating entries:', entries)
        },
        missions: {
            update: (missions) => console.log('Updating missions:', missions)
        },
        rewards: {
            update: (rewards) => console.log('Updating rewards:', rewards)
        }
    }
};

// Helper function to check if debug is enabled for a specific category and type
export const shouldLog = (debugFlags, category, type) => {
    return debugFlags?.[category]?.[type] === true;
};

// Usage example:
// if (shouldLog(debugFlags, 'haulingMissions', 'processOrders')) {
//     DebugLogs.haulingMissions.processOrders.completedEntries(entries);
// } 