import { shouldLog, DEBUG_FLAGS } from './DebugOptions.js';

export const logOCRProcess = (captureDebugMode, debugFlags, message, data = null) => {
    if (!captureDebugMode || !shouldLog(debugFlags, DEBUG_FLAGS.OCR_LOGGING)) return;
    
    if (data) {
        console.log(message, data);
    } else {
        console.log(message);
    }
};

export const logOCRError = (captureDebugMode, debugFlags, message, error = null) => {
    if (!captureDebugMode || !shouldLog(debugFlags, DEBUG_FLAGS.OCR_LOGGING)) return;
    
    if (error) {
        console.error(message, error);
    } else {
        console.error(message);
    }
};

export const logOCRProgress = (captureDebugMode, debugFlags, progress) => {
    if (!captureDebugMode || !shouldLog(debugFlags, DEBUG_FLAGS.OCR_LOGGING)) return;
    console.log(`OCR Progress: ${Math.round(progress * 100)}%`);
};

export const logOCRResults = (captureDebugMode, debugFlags, rawText, parsedResults, validEntries) => {
    if (!captureDebugMode || !shouldLog(debugFlags, DEBUG_FLAGS.OCR_LOGGING)) return;
    
    console.log('Raw OCR text:', rawText);
    console.log('Parsed OCR results:', parsedResults);
    if (validEntries) {
        console.log('Valid entries found:', parsedResults);
    } else {
        console.log('No valid mission data found in:', rawText);
    }
}; 