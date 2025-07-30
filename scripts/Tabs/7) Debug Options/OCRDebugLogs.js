import { shouldLog, DEBUG_FLAGS } from './DebugOptions.js';

export const logOCRProcess = (...args) => {
    console.log('[OCR Process]', ...args);
};

export const logOCRError = (...args) => {
        console.error('[OCR Error]', ...args);
};

export const logOCRProgress = (...args) => {
        console.log('[OCR Progress]', ...args);
};

export const logOCRResults = (...args) => {
    console.log('[OCR Results]', ...args);
}; 