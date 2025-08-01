import React, { useState, useRef, useEffect } from 'react';
import Tesseract from 'tesseract.js';
import Select from 'react-select';
import { locationCorrections } from './LocationCorrections';
import { findClosestMatch, validateOCRData, processOCRText, validateOCREntries } from './OCRUtils';
import { logOCRProcess, logOCRError, logOCRProgress, logOCRResults } from '../../7) Debug Options/OCRDebugLogs';
import { logStreamOperation, logStreamResolution, logSelectionBox, logSelectionBoxUpdate, logLoadedSelectionBox } from '../../7) Debug Options/StreamDebugLogs';
import '../../../../styles/Tabs/1) Hauling/Capture Tab/CaptureSubTabHauling.css';
const crypto = require('crypto');

// Add this near the top of the file, before the component definition
const defaultData = {
    commodities: [],
    pickupPoints: [],
    Dropoffpoints: {},
    moons: {}
};

// Add this near the top of the file
const debugFlags = JSON.parse(localStorage.getItem('ocrDebugFlags')) || {
    ocrProcess: false,
    ocrProgress: false,
    ocrRewards: false,
    ocrErrors: false
};

const CaptureSubTabHauling = ({
    data = defaultData,
    addOCRToManifest,
    showBannerMessage,
    hasEntries,
    setHasEntries,
    captureDebugMode,
    debugFlags,
    missionEntries,
    setMissionEntries
}) => {
    // State variables
    const [useVideoStream, setUseVideoStream] = useState(false);
    const [isDrawing, setIsDrawing] = useState(false);
    const [selectionBox, setSelectionBox] = useState(null);
    const [ocrResults, setOcrResults] = useState([]);
    const [currentParsedResults, setCurrentParsedResults] = useState([]);
    const [editedQuantities, setEditedQuantities] = useState({});
    const [ocrCaptureHistory, setOcrCaptureHistory] = useState([]);
    const [ocrMissionGroups, setOcrMissionGroups] = useState([]);
    const [ocrText, setOcrText] = useState('');
    const [isConstantCapture, setIsConstantCapture] = useState(false);
    const [captureTimer, setCaptureTimer] = useState(0);
    const [captureInterval, setCaptureInterval] = useState(null);
    const [captureIntervalDuration, setCaptureIntervalDuration] = useState(4);
    const [captureKey, setCaptureKey] = useState(() => {
        const savedKey = localStorage.getItem('captureKey');
        return savedKey || 'Enter';
    });
    const [showKeyInput, setShowKeyInput] = useState(false);
    const [ocrMissionRewards, setOcrMissionRewards] = useState({});
    const [savedSelectionBox, setSavedSelectionBox] = useState(() => {
        const saved = localStorage.getItem('captureSelectionBox');
        return saved ? JSON.parse(saved) : null;
    });
    const [ocrProgress, setOcrProgress] = useState(0);
    const [firstDropdownValue, setFirstDropdownValue] = useState('');
    const [entries, setEntries] = useState([]);

    // Refs
    const videoRef = useRef(null);
    const focusButtonRef = useRef(null);
    const iframeRef = useRef(null);

    // Functions
    const toggleVideoStream = () => {
        setUseVideoStream(!useVideoStream);
        if (!useVideoStream) {
            stopVideoStream();
        }
    };

    const stopVideoStream = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            videoRef.current.srcObject.getTracks().forEach(track => track.stop());
        }
    };

    const handleMouseDown = (e) => {
        if (!useVideoStream || !videoRef.current) return;
        
        const rect = videoRef.current.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        
        setIsDrawing(true);
        const scaleX = videoRef.current.videoWidth / rect.width;
        const scaleY = videoRef.current.videoHeight / rect.height;
        
        const startX = Math.max(0, (e.clientX - rect.left) * scaleX);
        const startY = Math.max(0, (e.clientY - rect.top) * scaleY);
        
        const newBox = {
            startX,
            startY,
            endX: startX,
            endY: startY
        };
        
        setSelectionBox(newBox);
        logSelectionBoxUpdate(captureDebugMode, debugFlags, newBox, 'mousedown');
    };

    const handleMouseMove = (e) => {
        if (!isDrawing || !useVideoStream || !videoRef.current) return;
        
        const rect = videoRef.current.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        
        const scaleX = videoRef.current.videoWidth / rect.width;
        const scaleY = videoRef.current.videoHeight / rect.height;
        
        const currentX = Math.max(0, Math.min((e.clientX - rect.left) * scaleX, videoRef.current.videoWidth));
        const currentY = Math.max(0, Math.min((e.clientY - rect.top) * scaleY, videoRef.current.videoHeight));
        
        // Get current selection box before update
        const updatedBox = {
            ...selectionBox,
            endX: currentX,
            endY: currentY
        };
        
        // Log the update with the new box
        logSelectionBoxUpdate(captureDebugMode, debugFlags, updatedBox, 'mousemove');
        
        // Update state with new box
        setSelectionBox(updatedBox);
    };

    const handleMouseUp = async () => {
        setIsDrawing(false);
        if (!selectionBox || !videoRef.current) return;
        
        // Ensure selection box dimensions are valid
        const width = Math.abs(selectionBox.endX - selectionBox.startX);
        const height = Math.abs(selectionBox.endY - selectionBox.startY);
        
        if (width < 1 || height < 1) {
            console.log('Selection box too small');
            return;
        }
        
        try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            canvas.width = width;
            canvas.height = height;
            
            // Draw only the selected region
            ctx.drawImage(
                videoRef.current,
                Math.min(selectionBox.startX, selectionBox.endX),
                Math.min(selectionBox.startY, selectionBox.endY),
                width,
                height,
                0, 0,
                width,
                height
            );
            
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const sharpenedImage = sharpenImage(imageData);
            ctx.putImageData(sharpenedImage, 0, 0);
            
            const image = canvas.toDataURL('image/png', 1.0);
            
            console.log('Starting OCR process...');
            const preprocessedImage = await preprocessImage(image);
            const rawOcrText = await performOCR(preprocessedImage);
            setOcrText(rawOcrText);
            
            if (!rawOcrText) {
                console.log('No text recognized from image');
                return;
            }

            const newResults = parseOCRResults(rawOcrText, false); // Pass false to skip reward extraction
            console.log('Parsed OCR results:', newResults);

            if (newResults && newResults.length > 0) {
                const nextMissionIndex = ocrMissionGroups.length;
                let reward = extractReward(rawOcrText);

                if (captureDebugMode) {
                    console.log('Adding new mission group:', {
                        index: nextMissionIndex,
                        entries: newResults,
                        reward: reward,
                        currentGroups: ocrMissionGroups
                    });
                }

                // Update mission groups
                setOcrMissionGroups(prev => {
                    // Create a new array with all previous missions
                    const updated = [...prev];
                    // Add new mission group
                    updated.push(newResults);
                    return updated;
                });

                
                // Update mission rewards
                const parsedReward = parseAndFormatReward(reward);
                if (parsedReward) {
                    console.log('OCR Reward Debug:', {
                        original: reward,
                        processed: parsedReward,
                        nextMissionIndex,
                        typeOfNumericValue: typeof parsedReward,
                        parsedNumericValue: parseInt(parsedReward, 10),
                        typeOfParsedNumericValue: typeof parseInt(parsedReward, 10),
                        isNaN: isNaN(parseInt(parsedReward, 10))
                    });

                    setOcrMissionRewards(prev => {
                        const newRewards = { ...prev };
                        newRewards[nextMissionIndex] = parsedReward;
                        console.log('Updated rewards state:', newRewards);
                        return newRewards;
                    });
                }

                // Also update OCR results for tracking
                setCurrentParsedResults(newResults);
                setOcrResults(prev => [...prev, ...newResults]);
                setOcrCaptureHistory(prev => [...prev, newResults]);
                setHasEntries(true);

                showBannerMessage(`Mission group ${nextMissionIndex + 1} created successfully!`, true);
            }

            showBannerMessage('OCR capture successful! Mission group created.', true);

            // Save selection box to local storage
            const rect = videoRef.current.getBoundingClientRect();
            const scaleX = videoRef.current.videoWidth / rect.width;
            const scaleY = videoRef.current.videoHeight / rect.height;
            const savedBox = {
                startX: (Math.min(selectionBox.startX, selectionBox.endX) / videoRef.current.videoWidth) * 100,
                startY: (Math.min(selectionBox.startY, selectionBox.endY) / videoRef.current.videoHeight) * 100,
                endX: (Math.max(selectionBox.startX, selectionBox.endX) / videoRef.current.videoWidth) * 100,
                endY: (Math.max(selectionBox.startY, selectionBox.endY) / videoRef.current.videoHeight) * 100
            };
            console.log('Saving selection box to local storage:', savedBox);
            localStorage.setItem('captureSelectionBox', JSON.stringify(savedBox));
            setSavedSelectionBox(savedBox);
        } catch (error) {
            console.error('Error in handleMouseUp:', error);
            showBannerMessage('Error capturing text. Please check box size and location.', false);
        }
    };

    const performOCR = async (image) => {
        try {
            setOcrProgress(0);
            if (!image || typeof image !== 'string' || !image.startsWith('data:image')) {
                if (debugFlags.ocrErrors) {
                    logOCRError('Invalid image data provided to OCR');
                }
                showBannerMessage('Invalid image data', false);
                return '';
            }

            // Always log the start of OCR processing
            logOCRProcess('Starting OCR processing...');
            
            const worker = await Tesseract.createWorker({
                logger: m => {
                    if (m.status === 'recognizing text') {
                        if (debugFlags.ocrProgress) {
                            logOCRProgress(m.progress);
                        }
                        setOcrProgress(Math.round(m.progress * 100));
                        
                        if (debugFlags.ocrRewards && m.text) {
                            const reward = extractReward(m.text);
                            if (reward) {
                                logOCRProcess('Found reward during progress:', reward);
                            }
                        }
                    }
                },
                errorHandler: (err) => {
                    if (debugFlags.ocrErrors) {
                        logOCRError('Tesseract Error:', err);
                    }
                    showBannerMessage('OCR processing error', false);
                }
            });

            await worker.loadLanguage('eng');
            await worker.initialize('eng');
            
            await worker.setParameters({
                tessedit_pageseg_mode: '6',
                tessedit_char_whitelist: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz. ,/+'
            });

            const { data: { text } } = await worker.recognize(image);
            await worker.terminate();

            if (!text || text.trim() === '') {
                // Keep this log conditional as it's an informational message about no text being detected
                if (debugFlags.ocrProcess) {
                    logOCRProcess('No text detected in image');
                }
                showBannerMessage('No text detected in image. Try adjusting the capture area.', false);
                return '';
            }

            // Always log the raw OCR text now
            logOCRProcess('Raw OCR text:', text);
            
            // Extract reward first
            const reward = extractReward(text);
            if (reward && debugFlags.ocrRewards) {
                logOCRProcess('Found reward:', reward);
            }

            const cleanedText = text.replace(/[.,]/g, '');
            
            // Don't validate here, just parse
            const parsedResults = parseOCRResults(cleanedText, false);
            
            if (debugFlags.ocrProcess) {
                logOCRProcess('Parsed OCR results:', parsedResults);
            }
            
            // Check if we have any parsed results
            if (parsedResults && parsedResults.length > 0) {
                if (debugFlags.ocrProcess) {
                    logOCRProcess('Valid entries found:', parsedResults);
                }
                showBannerMessage('OCR capture successful!', true);
                return cleanedText;
            } else {
                if (debugFlags.ocrProcess) {
                    logOCRProcess('No valid mission data found in:', cleanedText);
                }
                showBannerMessage('No valid mission data detected', false);
                return '';
            }

        } catch (error) {
            if (debugFlags.ocrErrors) {
                logOCRError('OCR Error:', error);
            }
            showBannerMessage('Error processing image. Please try again.', false);
            return '';
        } finally {
            setOcrProgress(0);
        }
    };

    const parseOCRResults = (text, shouldExtractReward = true) => {
        const processedText = processOCRText(text, locationCorrections);

        // New logic to combine "Deliver" lines that are split across multiple lines
        const rawLines = processedText.split('\n').map(line => line.trim()).filter(line => line !== '');
        const combinedLines = [];

        // Patterns for combining lines - check if a line *starts* with these
        // These are simpler and only used for the initial line combination logic.
        const deliverStartPattern = /^(?:Deliver|Quantity|SCU)/i;
        const collectStartPattern = /^(?:Collect|O Collect)/i;

        for (let i = 0; i < rawLines.length; i++) {
            let currentLine = rawLines[i];

            // If the current line starts with a deliver pattern and there's a next line
            if (currentLine.match(deliverStartPattern) && (i + 1) < rawLines.length) {
                const nextLine = rawLines[i + 1];

                // If the next line does NOT start with a known mission pattern (deliver or collect),
                // it's likely a continuation of the current deliver line.
                if (!nextLine.match(deliverStartPattern) && !nextLine.match(collectStartPattern)) {
                    currentLine += ' ' + nextLine; // Combine them with a space
                    i++; // Skip the next line as it's now part of the current line
                }
            }
            combinedLines.push(currentLine);
        }

        const lines = combinedLines; // Use the combined lines for subsequent parsing
        
        if (captureDebugMode) {
            console.log('Processing OCR lines (after combining):', lines);
        }
    
        const commodityEntries = {};
        let currentCommodity = null;
        let currentPickup = null;
        let currentDropoff = null;
    
        // Modified patterns to be more forgiving
        // Relaxed the ending condition for dropoffPattern to allow for "in Lorville" or "on microTech"
        // by making the last part `(.+?)` extend until a clear new section keyword or the very end.
        const collectPattern = /(?:Collect|O Collect)\s+([\w\s]+?)(?:(?:\s+from|\s+at)\s+([^.]+?)(?:(?=\s*(?:To|Deliver))|\.|(?=\s*(?:Reward|Contract Deadline|Contracted By|PRIMARY OBJECTIVES))|$))/i; // Modified to capture pickup in same line
        const pickupPattern = /(?:from|at)\s+([^.]+?)(?:(?=\s*(?:To|Deliver))|\.|(?=\s*(?:Reward|Contract Deadline|Contracted By|PRIMARY OBJECTIVES))|$)/i; // Modified to be more flexible
        const dropoffPattern = /(?:To|Deliver to|Deliver\s+(?:\d+\/\d+\s+)?SCU\s+to)\s+(.+?)(?=\s*(?:Reward|Contract Deadline|Contracted By|PRIMARY OBJECTIVES|Collect|To|Deliver|$))/i; // Relaxed: capture until a new clear section (Reward, Collect, To, Deliver) or end of string
        const deliverPattern = /(?:Deliver|Quantity|SCU)\s*:?\s*(\d+\s*\/\s*\d+)/i;
        const pickupLocationPattern = /(?:Port\s+Tressler|Area\s+18|Orison|Lorville|New\s+Babbage|Everus Harbor|Port Olisar|Grim Hex|Levski|Cellin|Daymar|Yela|Crusader|MicroTech|ArcCorp|Hurston|Magellan|Lyria|Wala|Brio\'s Breakdown|Covalex Trading Post|Shubin Mining Facility|HDMO-Dobbs|Deakins Research Outpost|ArcCorp Mining Area|Bezdek Research Outpost|Terra Mills HydroFarm|Samson & Son\'s Salvage Center|Rayari Deltana Research Outpost|Security Post Kareah|HUR-L1|CRU-L1|ARC-L1|MIC-L1|GRIMHEX|LEVSKI|GIBSON ORBITAL|PORT OLISAR|COMMUNITY MEDICAL|COVALEX_TRADING_HUB|JUMPTOWN|SEACRAFT_RESORT|DEVIL\'S_PIT|BETHLEHEM_SHIPPING_HUB|ADIRA_FALLS|CLIO|EUTERPE|CALLIOPE|URANIA|ERATO|TERPSICHORE|THALIA|MELPOMENE|POLYHYMNIA|EGYPT|TOKYO|BERLIN|LONDON|PARIS|ROME|OSLO|MOSCOW|DUBAI|SYDNEY|RIO|HAVANA|CAIRO|ATHENS|BUDAPEST|PRAGUE|VIENNA|ZURICH|AMSTERDAM|BRUSSELS|COPENHAGEN|HELSINKI|STOCKHOLM|WARSAW|LISBON|MADRID|DUBLIN|EDINBURGH|CARDIFF|BELFAST|REYKJAVIK|GREENVILLE|AUSTIN|DALLAS|HOUSTON|SAN ANTONIO|PHOENIX|TUCSON|ALBUQUERQUE|SANTA FE|DENVER|COLORADO SPRINGS|SALT LAKE CITY|LAS VEGAS|RENO|BOISE|PORTLAND|SEATTLE|ANCHORAGE|FAIRBANKS|HONOLULU|LOS ANGELES|SAN FRANCISCO|SAN DIEGO|SACRAMENTO|FRESNO|BAKERSFIELD|PALM SPRINGS|EL PASO|SAN JUAN|ST LOUIS|KANSAS CITY|MINNEAPOLIS|ST PAUL|MILWAUKEE|CHICAGO|INDIANAPOLIS|DETROIT|CLEVELAND|COLUMBUS|CINCINNATI|LOUISVILLE|NASHVILLE|MEMPHIS|NEW ORLEANS|ATLANTA|MIAMI|ORLANDO|TAMPA|CHARLOTTE|RALEIGH|DURHAM|RICHMOND|BALTIMORE|PHILADELPHIA|PITTSBURGH|WASHINGTON|BOSTON|NEW YORK|BUFFALO|ROCHESTER|SYRACUSE|ALBANY|HARTFORD|PROVIDENCE|MONTREAL|TORONTO|VANCOUVER|CALGARY|EDMONTON|WINNIPEG|OTTAWA|QUEBEC CITY|HALIFAX|ST JOHN\'S|MEXICO CITY|GUADALAJARA|MONTERREY|CANCUN|PUERTO VALLARTA|CABO SAN LUCAS|PUNTA CANA|KINGSTON|NASSAU|SANTO DOMINGO|PORT AU PRINCE|HAVANA|SAN SALVADOR|TEGUCIGALPA|MANAGUA|SAN JOSE|PANAMA CITY|BOGOTA|MEDELLIN|CALI|QUITO|GUAYAQUIL|LIMA|SANTIAGO|BUENOS AIRES|SAO PAULO|RIO DE JANEIRO|BRASILIA|MONTEVIDEO|ASUNCION|LA PAZ|SANTA CRUZ|CARACAS|MARACAIBO|VALENCIA|GEORGETOWN|PARAMARIBO|CAYENNE)/i;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            
            if (captureDebugMode) {
                console.log('Processing line:', line);
            }
    
            // First try to find a collection instruction
            const collectMatch = line.match(collectPattern);
            if (collectMatch) {
                currentCommodity = collectMatch[1].trim();
                
                // Try to find pickup location in the same line
                const pickupMatch = line.match(pickupPattern);
                if (pickupMatch) {
                    currentPickup = pickupMatch[1].trim();
                }
                
                if (captureDebugMode) {
                    console.log('Found collection:', { commodity: currentCommodity, pickup: currentPickup });
                }
                continue;
            }
    
            // Check for delivery instruction
            const deliverMatch = line.match(deliverPattern);
            if (deliverMatch && currentCommodity) {
                let quantity = deliverMatch[1].replace(/\s*\/\s*/, '/').trim();
                quantity = quantity.split('/')[1] || quantity;
    
                // Look for dropoff location in this line
                let dropoffLocation = '';
                const dropoffMatch = line.match(dropoffPattern);
                if (dropoffMatch) {
                    dropoffLocation = dropoffMatch[1].trim();
                    if (captureDebugMode) {
                        console.log('Extracted dropoff location:', dropoffLocation); // Added debug log
                    }
                }
    
                if (dropoffLocation) {
                    currentDropoff = dropoffLocation;
                    
                    const entryKey = `${currentCommodity}-${currentPickup}-${currentDropoff}`;
                    if (captureDebugMode) {
                        console.log('Creating entry:', {
                            commodity: currentCommodity,
                            quantity,
                            pickup: currentPickup || '',
                            dropoff: currentDropoff || ''
                        });
                    }
    
                    if (!commodityEntries[entryKey]) {
                        commodityEntries[entryKey] = {
                            commodity: currentCommodity,
                            quantity: quantity,
                            pickup: currentPickup || '',
                            dropoff: currentDropoff || ''
                        };
                    } else {
                        // If the entry already exists, add the quantity to the existing entry
                        commodityEntries[entryKey].quantity += `, ${quantity}`;
                    }
                }
            }
    
            // If we find a pickup location pattern, save it
            const pickupLocationMatch = line.match(pickupLocationPattern);
            if (pickupLocationMatch && !currentPickup) {
                currentPickup = pickupLocationMatch[0].trim();
            }
        }
    
        const entries = Object.values(commodityEntries);
        
        if (captureDebugMode) {
            console.log('Final parsed entries:', entries);
        }
    
        // Handle reward extraction if needed
        if (shouldExtractReward && entries.length > 0) {
            const reward = extractReward(text);
            if (reward) {
                entries.forEach(entry => entry.reward = reward);
            }
        }
    
        return entries;
    };

    const handleConstantCapture = () => {
        if (!isConstantCapture) {
            if (hasEntries || ocrResults.length > 0) {
                setIsConstantCapture(true);
                setCaptureTimer(captureIntervalDuration);
                
                const interval = setInterval(() => {
                    setCaptureTimer(prev => {
                        if (prev <= 1) {
                            handleMouseUp();
                            return captureIntervalDuration;
                        }
                        return prev - 1;
                    });
                }, 1000);
                
                setCaptureInterval(interval);
                showBannerMessage('Constant capture started.', true);
            } else {
                showBannerMessage('Please add entries to the table before starting constant capture', false);
            }
        } else {
            setIsConstantCapture(false);
            setCaptureTimer(0);
            if (captureInterval) {
                clearInterval(captureInterval);
            }
            showBannerMessage('Constant capture stopped.', true);
        }
    };

    const handleSpeedAdjustment = () => {
        const newSpeed = prompt('Enter capture interval in seconds (minimum 2):', captureIntervalDuration);
        if (newSpeed && !isNaN(newSpeed) && newSpeed >= 2) {
            setCaptureIntervalDuration(Number(newSpeed));
            showBannerMessage(`Capture interval set to ${newSpeed} seconds.`, true);
            
            if (isConstantCapture) {
                clearInterval(captureInterval);
                setCaptureTimer(captureIntervalDuration);
                const interval = setInterval(() => {
                    setCaptureTimer(prev => {
                        if (prev === 0) {
                            handleMouseUp();
                            return captureIntervalDuration;
                        }
                        return prev - 1;
                    });
                }, 1000);
                setCaptureInterval(interval);
            }
        } else {
            showBannerMessage('Invalid interval. Must be a number greater than or equal to 2.', false);
        }
    };

    const undoLastOcrCapture = () => {
        if (ocrCaptureHistory.length > 0) {
            const lastCapture = ocrCaptureHistory[ocrCaptureHistory.length - 1];
            
            setOcrResults(prevResults => {
                const newResults = [...prevResults];
                return newResults.slice(0, newResults.length - lastCapture.length);
            });
            
            setOcrMissionGroups(prev => prev.slice(0, -1));
            setOcrCaptureHistory(prev => prev.slice(0, -1));
            
            if (JSON.stringify(currentParsedResults) === JSON.stringify(lastCapture)) {
                setCurrentParsedResults([]);
            }
            
            showBannerMessage('Last OCR capture undone.', true);
        } else {
            showBannerMessage('No OCR captures to undo.', false);
        }
    };

    const clearOCRMissions = () => {
        setOcrResults([]);
        setCurrentParsedResults([]);
        setOcrMissionGroups([]);
        setOcrMissionRewards({});
        setOcrText('');
        setEditedQuantities({});
        setHasEntries(false);
        setIsConstantCapture(false);
        if (captureInterval) {
            clearInterval(captureInterval);
        }
        setCaptureTimer(0);
        setOcrProgress(0);
        showBannerMessage('OCR missions cleared.', true);
    };

    const handleQuantityEdit = (missionIndex, entryIndex, value) => {
        setEditedQuantities(prev => {
            const key = `${missionIndex}-${entryIndex}`;
            return {
                ...prev,
                [key]: value
            };
        });
    };

    const saveQuantityEdit = (missionIndex, entryIndex) => {
        const key = `${missionIndex}-${entryIndex}`;
        const newValue = editedQuantities[key];
        
        if (newValue !== undefined) {
            setOcrMissionGroups(prev => {
                const updatedGroups = [...prev];
                updatedGroups[missionIndex] = updatedGroups[missionIndex].map((entry, idx) => 
                    idx === entryIndex ? { ...entry, quantity: newValue } : entry
                );
                return updatedGroups;
            });
            
            setEditedQuantities(prev => {
                const newQuantities = { ...prev };
                delete newQuantities[key];
                return newQuantities;
            });
        }
    };

    const sharpenImage = (imageData) => {
        const width = imageData.width;
        const height = imageData.height;
        const data = imageData.data;
        
        const output = new ImageData(new Uint8ClampedArray(data), width, height);
        const outputData = output.data;
        
        const kernel = [
            0, -1, 0,
            -1, 5, -1,
            0, -1, 0
        ];
        
        for (let y = 1; y < height - 1; y++) {
            for (let x = 1; x < width - 1; x++) {
                const i = (y * width + x) * 4;
                let r = 0, g = 0, b = 0;
                
                for (let ky = -1; ky <= 1; ky++) {
                    for (let kx = -1; kx <= 1; kx++) {
                        const ki = ((y + ky) * width + (x + kx)) * 4;
                        const weight = kernel[(ky + 1) * 3 + (kx + 1)];
                        
                        r += data[ki] * weight;
                        g += data[ki + 1] * weight;
                        b += data[ki + 2] * weight;
                    }
                }
                
                outputData[i] = Math.min(255, Math.max(0, r));
                outputData[i + 1] = Math.min(255, Math.max(0, g));
                outputData[i + 2] = Math.min(255, Math.max(0, b));
            }
        }
        
        return output;
    };

    const extractReward = (text) => {
        if (!text) return null;
        
        // Try to find reward in various formats
        const rewardPatterns = [
            /reward\s*:\s*([\d,]+)/i,        // "Reward: 123,456"
            /([\d,]+)\s*auec/i,              // "123,456 aUEC"
            /([\d,]+)\s*uec/i,               // "123,456 UEC"
            /([\d,]+)\s*currency/i,          // "123,456 currency"
            /([\d,]+)\s*cr/i,                // "123,456 CR"
            /([\d,]+)\s*\$?/i                // "123,456" or "123,456$"
        ];
        
        for (const pattern of rewardPatterns) {
            const match = text.match(pattern);
            if (match && match[1]) {
                const parsedValue = parseAndFormatReward(match[1]);
                if (parsedValue) {
                    return parsedValue;
                }
            }
        }
        
        // If no pattern matched, try to find any large number
        const numbers = text.match(/\d+/g);
        if (numbers) {
            const cleanNumbers = numbers
                .map(num => parseInt(num.replace(/[^\d]/g, ''), 10))
                .filter(num => !isNaN(num) && num >= 1000);
            
            if (cleanNumbers.length > 0) {
                return Math.max(...cleanNumbers).toString();
            }
        }
        
        return null;
    };

    const findNextEmptySlot = (missionId) => {
        // First check if this mission already exists somewhere
        for (let i = 0; i < missionEntries.length; i++) {
            const missionGroup = missionEntries[i];
            if (missionGroup && missionGroup.length > 0) {
                // Check if any entry in this group has our missionId
                if (missionGroup.some(entry => entry.missionId === missionId)) {
                    console.log(`Found existing mission ${missionId} in slot ${i}`);
                    return { slot: i, isExisting: true };
                }
            }
        }

        // If mission doesn't exist, find first empty slot
        const emptySlot = missionEntries.findIndex(group => !group || group.length === 0);
        return { 
            slot: emptySlot !== -1 ? emptySlot : missionEntries.length,
            isExisting: false 
        };
    };

    const findHighestMissionIndex = () => {
        let highest = -1;
        missionEntries.forEach((group, index) => {
            if (group && group.length > 0) {
                highest = index;
            }
        });
        return highest;
    };

    const findNextAvailableSlot = (startFromIndex = 0) => {
        // First try to find an empty slot after startFromIndex
        for (let i = startFromIndex; i < 15; i++) {
            if (!missionEntries[i] || missionEntries[i].length === 0) {
                console.log(`Found empty slot at index ${i}`);
                return i;
            }
        }

        // If no slots found after startFromIndex, look from beginning up to startFromIndex
        for (let i = 0; i < startFromIndex; i++) {
            if (!missionEntries[i] || missionEntries[i].length === 0) {
                console.log(`Found empty slot at index ${i} (wrapped search)`);
                return i;
            }
        }

        // If no empty slots found at all
        console.log('No empty slots available');
        return -1;
    };

    const handleAddOCRToManifest = async () => {
        if (ocrMissionGroups.length === 0) {
            showBannerMessage('No OCR missions to add', false);
            return;
        }
    
        console.log('=== Starting OCR Mission Processing ===');
        console.log('Total mission groups in queue:', ocrMissionGroups.length);
    
        // Find starting point for mission allocation
        let nextSlotIndex = findNextAvailableSlot(findHighestMissionIndex() + 1);
        let processedCount = 0;
        
        // Process missions sequentially
        for (let groupIndex = 0; groupIndex < ocrMissionGroups.length; groupIndex++) {
            const missionGroup = ocrMissionGroups[groupIndex];
            const missionId = `ocr_mission_${Date.now()}_${groupIndex}`;
            
            console.log(`\n--- Processing Mission ${groupIndex + 1} of ${ocrMissionGroups.length} ---`);
            console.log('Mission ID:', missionId);
            console.log('Targeting slot:', nextSlotIndex);
            
            if (!missionGroup || missionGroup.length === 0) {
                console.log(`Skipping empty mission group ${groupIndex + 1}`);
                continue;
            }
    
            try {
                console.log('Mission Group Processing:', {
                    groupIndex,
                    missionId,
                    reward: ocrMissionRewards[groupIndex],
                    allRewards: ocrMissionRewards
                });
                
                // Check if slot is actually available
                if (nextSlotIndex >= 15) {
                    console.log('No more mission slots available');
                    showBannerMessage('Maximum mission limit reached', false);
                    break;
                }
    
                // Validate entries before allocation
                const reward = ocrMissionRewards[groupIndex] || '';
                console.log('Manifest Reward Debug:', {
                    groupIndex,
                    reward,
                    typeOfReward: typeof reward,
                    parsedReward: parseInt(reward, 10),
                    typeOfParsedReward: typeof parseInt(reward, 10),
                    isNaN: isNaN(parseInt(reward, 10)),
                    missionIndex: nextSlotIndex
                });
                
                const validatedEntries = missionGroup.map(entry => {
                    console.log('Entry validation with reward:', { groupIndex, reward, allRewards: ocrMissionRewards });
                    console.log('Raw OCR reward:', reward);
                    const validation = validateOCRData(entry, data);
                    return {
                        ...validation.matchedValues,
                        quantity: entry.quantity.split('/')[1] || entry.quantity,
                        missionId,
                        missionReward: reward
                    };
                });

                console.log('Adding to manifest:', {
                    slot: nextSlotIndex,
                    reward,
                    entries: validatedEntries
                });
    
                // Add to manifest and wait for completion
                const missionKey = `mission_${nextSlotIndex}`;
                await addOCRToManifest(validatedEntries, { 
                    missionIndex: nextSlotIndex,
                    missionId,
                    missionSlot: missionKey,
                    missionReward: {
                        index: nextSlotIndex,
                        id: `mission_${nextSlotIndex}`,
                        value: ocrMissionRewards[groupIndex],
                        timestamp: Date.now(),
                        groupIndex
                    },
                    reward: ocrMissionRewards[groupIndex]
                });
    
                processedCount++;
                console.log(`Successfully allocated mission ${groupIndex + 1} to slot ${nextSlotIndex}`);
                
                // Find next available slot for next mission
                nextSlotIndex = findNextAvailableSlot(nextSlotIndex + 1);
    
            } catch (error) {
                console.error(`Error processing mission group ${groupIndex + 1}:`, error);
                showBannerMessage(`Error processing mission group ${groupIndex + 1}`, false);
            }
        }
    
        console.log('\n=== Mission Processing Summary ===');
        console.log(`Successfully processed ${processedCount} of ${ocrMissionGroups.length} missions`);
    
        if (processedCount > 0) {
            clearOCRMissions();
            showBannerMessage(`Successfully added ${processedCount} mission groups to manifest`, true);
        }
    };

    const focusBrowserWindow = () => {
        try {
            if (iframeRef.current) {
                // Focus the iframe first
                iframeRef.current.focus();
                // Then focus the window
                window.focus();
                // Finally, blur the iframe to prevent it from capturing keyboard events
                iframeRef.current.blur();
            }
        } catch (error) {
            console.error('Error focusing window:', error);
        }
    };

    // Add this function at the top level of your component
    const focusWindow = () => {
        // Try to focus window
        window.focus();
        
        // Try to focus document
        if (document.hasFocus && !document.hasFocus()) {
            window.focus();
            document.body.focus();
        }
    };

    // Add this useEffect for focus management
    useEffect(() => {
        let focusInterval;
        let focusAttempts = 0;
        const maxAttempts = 10;

        const attemptFocus = () => {
            if (focusAttempts >= maxAttempts) {
                clearInterval(focusInterval);
                return;
            }
            
            focusWindow();
            focusAttempts++;
        };

        const handleVisibilityChange = () => {
            if (document.hidden) {
                focusAttempts = 0;
                focusInterval = setInterval(attemptFocus, 50);
            } else {
                clearInterval(focusInterval);
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('blur', focusWindow);
        window.addEventListener('focus', () => clearInterval(focusInterval));

        // Initial focus attempt with reduced interval
        focusInterval = setInterval(attemptFocus, 50);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('blur', focusWindow);
            window.removeEventListener('focus', () => clearInterval(focusInterval));
            clearInterval(focusInterval);
        };
    }, []);

    // Update initializeStream function
    const initializeStream = async () => {
        if (useVideoStream && !videoRef.current?.srcObject) {
            try {
                const stream = await navigator.mediaDevices.getDisplayMedia({
                    video: {
                        displaySurface: 'application'
                    }
                });
                
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    
                    // Remove saving resolution when stream starts
                    const track = stream.getVideoTracks()[0];
                    const settings = track.getSettings();
                    const resolution = {
                        width: settings.width,
                        height: settings.height
                    };
                    logStreamResolution(captureDebugMode, debugFlags, resolution);

                    // Wait for video to be ready
                    videoRef.current.onloadedmetadata = () => {
                        setTimeout(() => {
                            if (savedSelectionBox) {
                                const newBox = {
                                    startX: (savedSelectionBox.startX / 100) * resolution.width,
                                    startY: (savedSelectionBox.startY / 100) * resolution.height,
                                    endX: (savedSelectionBox.endX / 100) * resolution.width,
                                    endY: (savedSelectionBox.endY / 100) * resolution.height
                                };
                                console.log('Loading selection box from local storage:', savedSelectionBox);
                                console.log('Calculated new selection box:', newBox);
                                setSelectionBox(newBox);
                                logLoadedSelectionBox(captureDebugMode, debugFlags, savedSelectionBox, newBox);
                            }
                            // Focus window after stream is ready
                            focusWindow();
                        }, 500);
                    };

                    // Focus window after stream selection
                    focusWindow();
                }
            } catch (error) {
                console.error('Error starting video stream:', error);
                setUseVideoStream(false);
            }
        } else if (!useVideoStream && videoRef.current?.srcObject) {
            // Stop the stream when toggled off
            const tracks = videoRef.current.srcObject.getTracks();
            tracks.forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
    };

    // Effects
    useEffect(() => {
        let stream = null;

        initializeStream();

        // Cleanup function
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [useVideoStream]); // Only depend on useVideoStream toggle

    useEffect(() => {
        localStorage.setItem('captureKey', captureKey);
    }, [captureKey]);

    useEffect(() => {
        const handleKeyPress = async (e) => {
            if (e.key === captureKey && selectionBox) {
                e.preventDefault();
                try {
                    if (videoRef.current && videoRef.current.srcObject) {
                        const canvas = document.createElement('canvas');
                        const ctx = canvas.getContext('2d');
                        
                        // Use selection box dimensions
                        const width = Math.abs(selectionBox.endX - selectionBox.startX);
                        const height = Math.abs(selectionBox.endY - selectionBox.startY);
                        canvas.width = width;
                        canvas.height = height;
                        
                        // Draw only the selected region
                        ctx.drawImage(
                            videoRef.current,
                            Math.min(selectionBox.startX, selectionBox.endX),
                            Math.min(selectionBox.startY, selectionBox.endY),
                            width,
                            height,
                            0, 0,
                            width,
                            height
                        );
                        
                        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                        const sharpenedImage = sharpenImage(imageData);
                        ctx.putImageData(sharpenedImage, 0, 0);
                        
                        const image = canvas.toDataURL('image/png', 1.0);
                        const rawOcrText = await performOCR(image);
                        
                        if (rawOcrText) {
                            setOcrText(rawOcrText);
                            const cleanedText = rawOcrText.replace(/[.,]/g, '');
                            const parsedResults = parseOCRResults(cleanedText);
                            
                            if (parsedResults && parsedResults.length > 0) {
                                const nextMissionIndex = ocrMissionGroups.length;
                                const reward = extractReward(rawOcrText);
                                const parsedReward = parseAndFormatReward(reward);
                                
                                setOcrMissionGroups(prevGroups => {
                                    const newGroups = [...prevGroups, parsedResults];
                                    const nextMissionIndex = newGroups.length - 1;

                                    if (parsedReward) {
                                        setOcrMissionRewards(prevRewards => {
                                            const newRewards = { ...prevRewards };
                                            newRewards[nextMissionIndex] = parsedReward;
                                            console.log('Updated rewards state (key press):', {
                                                nextMissionIndex,
                                                newRewards
                                            });
                                            return newRewards;
                                        });
                                    }

                                    console.log('Key press capture - adding mission at index:', nextMissionIndex, {
                                        currentGroups: prevGroups.length,
                                        newGroupsCount: newGroups.length,
                                        parsedResultsCount: parsedResults.length
                                    });

                                    return newGroups;
                                });

                                setCurrentParsedResults(parsedResults);
                                setOcrResults(prev => [...prev, ...parsedResults]);
                                setOcrCaptureHistory(prev => [...prev, parsedResults]);
                                setHasEntries(true);
                            }
                        }
                    }
                } catch (error) {
                    console.error('Error during capture:', error);
                    showBannerMessage('Error capturing image', false);
                }
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        
        // Cleanup function - just remove the event listener
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [captureKey, selectionBox, showBannerMessage]);

    // Add function to handle capture key change
    const handleCaptureKeyChange = (e) => {
        const newKey = e.target.value;
        setCaptureKey(newKey);
        localStorage.setItem('captureKey', newKey);
        setShowKeyInput(false);
    };

    // Add button to clear saved selection
    const clearSavedSelection = () => {
        const confirmed = window.confirm('Are you sure you want to clear the saved selection box? This action cannot be undone.');
        if (confirmed) {
            setSavedSelectionBox(null);
            localStorage.removeItem('captureSelectionBox');
            setSelectionBox(null);
            showBannerMessage('Saved selection cleared.', true);
        }
    };

    const preprocessImage = (image) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.src = image;
        return new Promise((resolve) => {
            img.onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);

                let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                let data = imgData.data;

                // Convert to grayscale and calculate histogram
                const grayscaleData = new Uint8ClampedArray(data.length / 4);
                const histogram = new Array(256).fill(0);

                for (let i = 0; i < data.length; i += 4) {
                    const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
                    grayscaleData[i / 4] = avg;
                    histogram[Math.floor(avg)]++;
                }

                // Apply Otsu's thresholding
                const threshold = getOtsuThreshold(histogram, grayscaleData.length);
                logOCRProcess('Otsu Threshold:', threshold);

                for (let i = 0; i < data.length; i += 4) {
                    const color = grayscaleData[i / 4] > threshold ? 255 : 0;
                    data[i] = color;
                    data[i + 1] = color;
                    data[i + 2] = color;
                }

                ctx.putImageData(imgData, 0, 0);
                resolve(canvas.toDataURL());
            };
        });
    }

    const getOtsuThreshold = (histogram, totalPixels) => {
        let sum = 0;
        for (let i = 0; i < 256; i++) {
            sum += i * histogram[i];
        }

        let sumB = 0;
        let wB = 0;
        let wF = 0;
        let mB = 0;
        let mF = 0;
        let maxVar = 0;
        let threshold = 0;

        for (let i = 0; i < 256; i++) {
            wB += histogram[i];
            if (wB === 0) continue;
            wF = totalPixels - wB;
            if (wF === 0) break;

            sumB += (i * histogram[i]);
            mB = sumB / wB;
            mF = (sum - sumB) / wF;

            const varBetween = wB * wF * (mB - mF) * (mB - mF);

            if (varBetween > maxVar) {
                maxVar = varBetween;
                threshold = i;
            }
        }
        return threshold;
    };

    const thresholdImage = (imageData, threshold) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = imageData.width;
        canvas.height = imageData.height;
        ctx.putImageData(imageData, 0, 0);

        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;

        for (let i = 0; i < data.length; i += 4) {
            const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
            const color = avg > threshold ? 255 : 0;
            data[i] = color;
            data[i + 1] = color;
            data[i + 2] = color;
        }

        ctx.putImageData(imgData, 0, 0);
        return canvas.toDataURL();
    }

    const handleRewardChange = (e, missionIndex) => {
        let value = e.target.value;
        // Store numeric value only
        const numericValue = value.replace(/[^\d]/g, '');
        
        console.log('Reward Input Debug:', {
            rawInput: value,
            typeOfRawInput: typeof value,
            numericValue: numericValue,
            typeOfNumericValue: typeof numericValue,
            parsedNumericValue: parseInt(numericValue, 10),
            typeOfParsedNumericValue: typeof parseInt(numericValue, 10),
            isNaN: isNaN(parseInt(numericValue, 10)),
            missionIndex: missionIndex,
            currentStateValue: ocrMissionRewards[missionIndex],
            typeOfStateValue: typeof ocrMissionRewards[missionIndex]
        });
        
        if (numericValue) {
            // Format display value with commas
            const formattedValue = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            
            // Update the input field with formatted value
            e.target.value = formattedValue;

            // Store only numeric value in state
            setOcrMissionRewards(prev => ({
                ...prev,
                [missionIndex]: numericValue
            }));
        } else {
            // Clear the value if empty
            setOcrMissionRewards(prev => ({
                ...prev,
                [missionIndex]: ''
            }));
        }
    };

    // Add this function near the top of the file
    const parseAndFormatReward = (rewardText) => {
        if (!rewardText) return null;
        
        // Remove all non-numeric characters except decimal points
        let numericValue = rewardText.replace(/[^0-9.]/g, '');
        
        // If there's a decimal point, remove it and everything after it
        if (numericValue.includes('.')) {
            numericValue = numericValue.split('.')[0];
        }
        
        // Convert to number and validate
        const parsedValue = parseInt(numericValue, 10);
        if (isNaN(parsedValue) || parsedValue < 1000) return null;
        
        // Return the numeric value as a string
        return parsedValue.toString();
    };

    // Add this useEffect
    useEffect(() => {
        if (Object.keys(ocrMissionRewards).length > 0) {
            localStorage.setItem('ocrMissionRewards', JSON.stringify(ocrMissionRewards));
        }
    }, [ocrMissionRewards]);

    // Add this useEffect
    useEffect(() => {
        console.log('Current mission rewards:', ocrMissionRewards);
    }, [ocrMissionRewards]);

    // Add this useEffect
    useEffect(() => {
        console.log('Mission groups updated:', {
            count: ocrMissionGroups.length,
            groups: ocrMissionGroups.map((group, index) => ({
                index,
                entries: group.length,
                reward: ocrMissionRewards[index] || 'No reward'
            }))
        });
    }, [ocrMissionGroups]);

    // Add this useEffect
    useEffect(() => {
        return () => {
            localStorage.removeItem('ocrMissionRewards');
        };
    }, []);

    // Render component
    return (
        <div className="capture-tab">
            <iframe
                ref={iframeRef}
                title="focus-keeper"
                style={{
                    position: 'absolute',
                    width: '0',
                    height: '0',
                    border: 'none',
                    pointerEvents: 'none',
                    opacity: 0
                }}
                tabIndex="-1"
            />
            <button
                ref={focusButtonRef}
                onClick={focusBrowserWindow}
                style={{
                    position: 'absolute',
                    opacity: 0,
                    pointerEvents: 'none',
                    height: 0,
                    width: 0,
                    padding: 0,
                    margin: 0,
                    border: 'none'
                }}
            />
            <h3>Capture Mode</h3>
            <div className="capture-controls">
                <div className="stream-toggle" style={{
                    border: '1px solid var(--table-outline-color)',
                    padding: '5px 10px',
                    borderRadius: '4px',
                    marginBottom: '10px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: 'fit-content',
                    backgroundColor: '#2a2a2a',
                    position: 'relative'
                }}>
                    <label style={{ marginRight: '15px' }}>
                        <input 
                            type="checkbox" 
                            checked={useVideoStream} 
                            onChange={toggleVideoStream} 
                        />
                        Capture Application Window
                    </label>
                    <div className="keybinding-control">
                        {showKeyInput ? (
                            <input
                                type="text"
                                className="key-input"
                                onKeyDown={(e) => {
                                    if (e.key.length === 1 || [
                                        'Enter', 'Escape', 'Backspace', 'Tab', 'Shift', 'Control', 'Alt', 
                                        'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
                                        'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12'
                                    ].includes(e.key)) {
                                        setCaptureKey(e.key);
                                        setShowKeyInput(false);
                                    }
                                }}
                                autoFocus
                                maxLength={1}
                                placeholder="Press any key"
                            />
                        ) : (
                            <button 
                                className="keybinding-button"
                                onClick={() => setShowKeyInput(true)}
                                style={{ 
                                    backgroundColor: 'var(--button-color)',
                                    color: '#0d0d0d',
                                    border: 'none',
                                    padding: '7px 20px',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                    fontFamily: 'inherit',
                                    fontSize: '16px',
                                    transition: 'background-color 0.3s, color 0.3s',
                                    margin: '0',
                                    display: 'inline-block',
                                    textAlign: 'center',
                                    textDecoration: 'none',
                                    whiteSpace: 'nowrap'
                                }}
                            >
                                Set Capture Key: {captureKey.toUpperCase()}
                            </button>
                        )}
                    </div>
                    <div className="ocr-progress-bar" style={{ width: `${ocrProgress}%` }} />
                </div>
                <div 
                    className="video-container"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    style={{ 
                        position: 'relative', 
                        cursor: isDrawing ? 'crosshair' : 'default',
                        backgroundColor: '#2a2a2a',
                        minHeight: '200px',
                        border: '1px solid var(--table-outline-color)',
                        borderRadius: '5px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    {useVideoStream ? (
                        <>
                            <video 
                                ref={videoRef} 
                                autoPlay 
                                playsInline 
                                style={{ 
                                    width: '100%', 
                                    height: 'auto', 
                                    borderRadius: '5px',
                                    display: 'block'
                                }}
                            />
                            {selectionBox && videoRef.current && (
                                <div 
                                    style={{
                                        position: 'absolute',
                                        left: (Math.min(selectionBox.startX, selectionBox.endX) / videoRef.current.videoWidth) * 100 + '%',
                                        top: (Math.min(selectionBox.startY, selectionBox.endY) / videoRef.current.videoHeight) * 100 + '%',
                                        width: (Math.abs(selectionBox.endX - selectionBox.startX) / videoRef.current.videoWidth) * 100 + '%',
                                        height: (Math.abs(selectionBox.endY - selectionBox.startY) / videoRef.current.videoHeight) * 100 + '%',
                                        border: '2px dashed #00ffcc',
                                        backgroundColor: 'rgba(0, 255, 204, 0.1)',
                                        pointerEvents: 'none'
                                    }}
                                />
                            )}
                        </>
                    ) : (
                        <div style={{ 
                            color: 'var(--dropdown-text-color)', 
                            textAlign: 'center',
                            padding: '20px'
                        }}>
                            Enable "Capture Application Window" to start streaming
                        </div>
                    )}
                </div>
                {isConstantCapture && (
                    <div className="capture-timer" style={{
                        fontSize: '1.2em',
                        fontWeight: 'bold',
                        color: 'var(--title-color)',
                        margin: '10px 0'
                    }}>
                        Next capture in: {captureTimer} seconds
                    </div>
                )}
                <div className="capture-buttons" style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <div style={{
                        border: '1px solid var(--table-outline-color)',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        backgroundColor: '#2a2a2a',
                        display: 'flex',
                        gap: '8px',
                        alignItems: 'center'
                    }}>
                        <button 
                            className="constant-capture-button" 
                            onClick={handleConstantCapture}
                            style={{ 
                                backgroundColor: isConstantCapture ? '#f44336' : 'var(--button-color)',
                                color: '#0d0d0d',
                                border: 'none',
                                padding: '5px 20px',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                fontFamily: 'inherit',
                                fontSize: '16px',
                                transition: 'background-color 0.3s, color 0.3s',
                                display: 'inline-block',
                                textAlign: 'center',
                                textDecoration: 'none',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            {isConstantCapture ? 'Stop Constant Capture' : 'Start Constant Capture'}
                        </button>
                        <button 
                            className="adjust-speed-button"
                            onClick={handleSpeedAdjustment}
                            style={{ 
                                backgroundColor: 'var(--button-color)',
                                color: '#0d0d0d',
                                border: 'none',
                                padding: '5px 20px',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                fontFamily: 'inherit',
                                fontSize: '16px',
                                transition: 'background-color 0.3s, color 0.3s',
                                display: 'inline-block',
                                textAlign: 'center',
                                textDecoration: 'none',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            Adjust Speed
                        </button>
                    </div>

                    <div style={{
                        border: '1px solid var(--table-outline-color)',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        backgroundColor: '#2a2a2a',
                        display: 'flex',
                        gap: '8px',
                        alignItems: 'center'
                    }}>
                        <button 
                            onClick={handleAddOCRToManifest}
                            className="add-to-manifest-button"
                        >
                            Add to Manifest
                        </button>
                        <button 
                            className="undo-ocr-button" 
                            onClick={undoLastOcrCapture}
                            disabled={ocrCaptureHistory.length === 0}
                            style={{ 
                                backgroundColor: '#ff6666',
                                color: '#0d0d0d',
                                border: 'none',
                                padding: '5px 20px',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                fontFamily: 'inherit',
                                fontSize: '16px',
                                transition: 'background-color 0.3s, color 0.3s',
                                display: 'inline-block',
                                textAlign: 'center',
                                textDecoration: 'none',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            Undo Mistake
                        </button>
                        <button 
                            onClick={clearSavedSelection}
                            style={{
                                backgroundColor: '#ff6666',
                                color: '#0d0d0d',
                                border: 'none',
                                padding: '5px 20px',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                fontFamily: 'inherit',
                                fontSize: '16px',
                                transition: 'background-color 0.3s, color 0.3s',
                                display: 'inline-block',
                                textAlign: 'center',
                                textDecoration: 'none',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            Clear Saved Selection
                        </button>
                    </div>
                </div>
            </div>
            <div id="process-log" className="process-log">
                {ocrResults.length > 0 && (
                    <>
                        <div className="ocr-counters">
                            <div className="ocr-counter">
                                <strong>Total Missions:</strong> {ocrMissionGroups.length}
                            </div>
                            <div className="ocr-counter">
                                <strong>Total Entries:</strong> {ocrResults.length}
                            </div>
                            <div className="ocr-counter">
                                <strong>Total SCU:</strong> {ocrResults.reduce((total, result) => {
                                    const quantity = parseInt(result.quantity.split('/')[0], 10) || 0;
                                    return total + quantity;
                                }, 0)}
                            </div>
                            <div className="ocr-counter">
                                <strong>Expected Earnings:</strong> {Object.values(ocrMissionRewards)
                                    .reduce((total, reward) => {
                                        const numericValue = reward ? parseInt(reward, 10) : 0;
                                        return total + (isNaN(numericValue) ? 0 : numericValue);
                                    }, 0)
                                    .toLocaleString()} aUEC
                            </div>
                        </div>
                        <h4>OCR Process Log:</h4>
                        {ocrMissionGroups.map((missionGroup, missionIndex) => {
                            if (!missionGroup || missionGroup.length === 0) return null;

                            return (
                                <div key={`mission-${missionIndex}`} className="capture-table-group">
                                    <div className="capture-tab-header">
                                        <h5>Mission {missionIndex + 1}</h5>
                                        <div className="reward-input-container">
                                            <span className="reward-label">Reward:</span>
                                            <input
                                                type="text"
                                                className="ocr-mission-payout-capture"
                                                placeholder="Enter reward"
                                                value={
                                                    ocrMissionRewards[missionIndex] ? 
                                                    parseInt(ocrMissionRewards[missionIndex], 10).toLocaleString() :
                                                    ''
                                                }
                                                onChange={(e) => {
                                                    const numericValue = e.target.value.replace(/[^\d]/g, '');
                                                    setOcrMissionRewards(prev => {
                                                        const newRewards = { ...prev };
                                                        newRewards[missionIndex] = numericValue;
                                                        console.log('Updated rewards state (input change):', {
                                                            missionIndex,
                                                            newValue: numericValue,
                                                            allRewards: newRewards
                                                        });
                                                        return newRewards;
                                                    });
                                                }}
                                                style={{
                                                    minWidth: '80px',
                                                    width: '120px',
                                                    textAlign: 'right',
                                                    display: 'block',
                                                    opacity: 1,
                                                    pointerEvents: 'auto'
                                                }}
                                                onFocus={(e) => e.target.select()}
                                            />
                                            <span className="currency-label">aUEC</span>
                                        </div>
                                    </div>
                                    <table className="capture-table">
                                        <thead>
                                            <tr>
                                                <th className="commodity">Commodity</th>
                                                <th className="qty">QTY</th>
                                                <th className="pickup">Pickup</th>
                                                <th className="dropoff">Drop Off</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {missionGroup.map((result, entryIndex) => {
                                                const validation = validateOCRData(result, data);
                                                const { exactMatches, matchedValues } = validation;
                                                const quantityKey = `${missionIndex}-${entryIndex}`;

                                                return (
                                                    <tr key={`mission-${missionIndex}-entry-${entryIndex}`}>
                                                        <td className="commodity" style={{ 
                                                            color: captureDebugMode && !exactMatches.commodity ? 'red' : 'inherit'
                                                        }}>
                                                            {captureDebugMode ? (
                                                                <>
                                                                    {result.commodity}
                                                                    {!exactMatches.commodity && matchedValues.commodity !== result.commodity && (
                                                                        <span style={{ color: 'green', marginLeft: '5px', fontWeight: 'bold' }}>
                                                                            → {matchedValues.commodity}
                                                                        </span>
                                                                    )}
                                                                </>
                                                            ) : (
                                                                matchedValues.commodity
                                                            )}
                                                        </td>
                                                        <td className="qty">
                                                            {editedQuantities[quantityKey] !== undefined ? (
                                                                <input
                                                                    type="text"
                                                                    value={editedQuantities[quantityKey]}
                                                                    onChange={(e) => handleQuantityEdit(missionIndex, entryIndex, e.target.value)}
                                                                    onKeyPress={(e) => {
                                                                        if (e.key === 'Enter') {
                                                                            saveQuantityEdit(missionIndex, entryIndex);
                                                                        }
                                                                    }}
                                                                    className="qty-input"
                                                                    autoFocus
                                                                />
                                                            ) : (
                                                                <span 
                                                                    className="qty-span" 
                                                                    onClick={() => handleQuantityEdit(missionIndex, entryIndex, result.quantity)}
                                                                >
                                                                    {result.quantity}
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td className="pickup" style={{ 
                                                            color: captureDebugMode && !exactMatches.pickup ? 'red' : 'inherit'
                                                        }}>
                                                            {captureDebugMode ? (
                                                                <>
                                                                    {result.pickup}
                                                                    {!exactMatches.pickup && matchedValues.pickup !== result.pickup && (
                                                                        <span style={{ color: 'green', marginLeft: '5px', fontWeight: 'bold' }}>
                                                                            → {matchedValues.pickup}
                                                                        </span>
                                                                    )}
                                                                </>
                                                            ) : (
                                                                matchedValues.pickup
                                                            )}
                                                        </td>
                                                        <td className="dropoff" style={{ 
                                                            color: captureDebugMode && !exactMatches.dropoff ? 'red' : 'inherit'
                                                        }}>
                                                            {captureDebugMode ? (
                                                                <>
                                                                    {result.dropoff}
                                                                    {!exactMatches.dropoff && matchedValues.dropoff !== result.dropoff && (
                                                                        <span style={{ color: 'green', marginLeft: '5px', fontWeight: 'bold' }}>
                                                                            → {matchedValues.dropoff}
                                                                        </span>
                                                                    )}
                                                                </>
                                                            ) : (
                                                                matchedValues.dropoff
                                                            )}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            );
                        })}
                        <div className="ocr-actions">
                            <button onClick={handleAddOCRToManifest}>Add All Missions to Manifest</button>
                            <button onClick={clearOCRMissions}>Clear OCR Missions</button>
                        </div>
                    </>
                )}
            </div>
            {captureDebugMode && (
                <button 
                    onClick={() => handleRewardChange({ target: { value: '123,456' } }, 0)}
                    style={{
                        position: 'fixed',
                        bottom: '20px',
                        right: '20px',
                        zIndex: 1000,
                        padding: '10px 20px',
                        backgroundColor: '#ffcc00',
                        color: '#000',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer'
                    }}
                >
                    Test Reward Log
                </button>
            )}
        </div>
    );
};

export default CaptureSubTabHauling;

