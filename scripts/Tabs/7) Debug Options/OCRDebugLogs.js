import { shouldLog, DEBUG_FLAGS } from './DebugOptions.js';

export const logOCRProcess = (captureDebugMode, debugFlags, ...args) => {
    if (captureDebugMode && debugFlags.ocrProcess) {
        console.log('[OCR Process]', ...args);
    }
};

export const logOCRError = (captureDebugMode, debugFlags, ...args) => {
    if (captureDebugMode && debugFlags.ocrErrors) {
        console.error('[OCR Error]', ...args);
    }
};

export const logOCRProgress = (captureDebugMode, debugFlags, ...args) => {
    if (captureDebugMode && debugFlags.ocrProgress) {
        console.log('[OCR Progress]', ...args);
    }
};

export const logOCRResults = (captureDebugMode, debugFlags, ...args) => {
    if (captureDebugMode && debugFlags.ocrProcess) {
        console.log('[OCR Results]', ...args);
    }
}; 