import { shouldLog, DEBUG_FLAGS } from './DebugOptions.js';

export const logStreamOperation = (captureDebugMode, debugFlags, message, error = null) => {
    if (!captureDebugMode || !shouldLog(debugFlags, DEBUG_FLAGS.STREAM_LOGGING)) return;
    
    if (error) {
        console.error('[Stream] Error:', error);
    } else {
        console.log(`[Stream] ${message}`);
    }
};

export const logStreamResolution = (captureDebugMode, debugFlags, resolution) => {
    if (!captureDebugMode || !shouldLog(debugFlags, DEBUG_FLAGS.STREAM_LOGGING)) return;
    console.log('[Stream] Resolution:', resolution);
};

export const logSelectionBox = (captureDebugMode, debugFlags, box) => {
    if (!captureDebugMode || !shouldLog(debugFlags, DEBUG_FLAGS.STREAM_LOGGING)) return;
    
    // Calculate dimensions
    const width = Math.abs(box.endX - box.startX);
    const height = Math.abs(box.endY - box.startY);
    
    console.log('\n[Stream] Final Selection Box Details:');
    console.log('----------------------------------------');
    console.log('  Coordinates:');
    console.log(`    Start: (${Math.round(box.startX)}, ${Math.round(box.startY)})`);
    console.log(`    End: (${Math.round(box.endX)}, ${Math.round(box.endY)})`);
    console.log('  Dimensions:');
    console.log(`    Width: ${Math.round(width)}px`);
    console.log(`    Height: ${Math.round(height)}px`);
    console.log('  Percentage of Screen:');
    console.log(`    Start: (${box.startX.toFixed(2)}%, ${box.startY.toFixed(2)}%)`);
    console.log(`    End: (${box.endX.toFixed(2)}%, ${box.endY.toFixed(2)}%)`);
    console.log('----------------------------------------\n');
};

// For mousemove, we'll only log every 100px change
let lastLoggedPosition = { x: 0, y: 0 };

export const logSelectionBoxUpdate = (captureDebugMode, debugFlags, box, event) => {
    if (!captureDebugMode || !shouldLog(debugFlags, DEBUG_FLAGS.STREAM_LOGGING)) return;
    
    // Only log mousemove if position has changed significantly
    if (event === 'mousemove') {
        const currentX = Math.round(box.endX);
        const currentY = Math.round(box.endY);
        const deltaX = Math.abs(currentX - lastLoggedPosition.x);
        const deltaY = Math.abs(currentY - lastLoggedPosition.y);
        
        if (deltaX < 100 && deltaY < 100) return;
        
        lastLoggedPosition = { x: currentX, y: currentY };
    }
    
    // Only log mousedown and significant mousemove events
    if (event === 'mousedown' || event === 'mousemove') {
        const width = Math.abs(box.endX - box.startX);
        const height = Math.abs(box.endY - box.startY);
        console.log(`[Stream] Box Size: ${Math.round(width)}x${Math.round(height)}px`);
    }
};

export const logLoadedSelectionBox = (captureDebugMode, debugFlags, savedBox, newBox) => {
    if (!captureDebugMode || !shouldLog(debugFlags, DEBUG_FLAGS.STREAM_LOGGING)) return;
    
    console.log('\n[Stream] Loading Saved Selection Box:');
    console.log('----------------------------------------');
    console.log('  Saved Coordinates (Percentage):');
    console.log(`    Start: (${savedBox.startX.toFixed(2)}%, ${savedBox.startY.toFixed(2)}%)`);
    console.log(`    End: (${savedBox.endX.toFixed(2)}%, ${savedBox.endY.toFixed(2)}%)`);
    console.log('  Converted Coordinates (Pixels):');
    console.log(`    Start: (${Math.round(newBox.startX)}, ${Math.round(newBox.startY)})`);
    console.log(`    End: (${Math.round(newBox.endX)}, ${Math.round(newBox.endY)})`);
    console.log('  Dimensions:');
    console.log(`    Width: ${Math.round(Math.abs(newBox.endX - newBox.startX))}px`);
    console.log(`    Height: ${Math.round(Math.abs(newBox.endY - newBox.startY))}px`);
    console.log('----------------------------------------\n');
}; 