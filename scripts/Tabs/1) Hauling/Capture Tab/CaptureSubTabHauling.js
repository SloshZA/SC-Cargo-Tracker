import React, { useState, useRef, useEffect } from 'react';
import Tesseract from 'tesseract.js';
import Select from 'react-select';
import { locationCorrections } from './LocationCorrections';
import { findClosestMatch, validateOCRData, processOCRText, validateOCREntries } from './OCRUtils';
import { logOCRProcess, logOCRError, logOCRProgress, logOCRResults } from '../../7) Debug Options/OCRDebugLogs';
import { logStreamOperation, logStreamResolution, logSelectionBox, logSelectionBoxUpdate, logLoadedSelectionBox } from '../../7) Debug Options/StreamDebugLogs';
import '../../../../styles/Tabs/1) Hauling/Capture Tab/CaptureSubTabHauling.css';

const CaptureSubTabHauling = ({
    data,
    addOCRToManifest,
    showBannerMessage,
    hasEntries,
    setHasEntries,
    locationCorrections,
    captureDebugMode,
    debugFlags
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
    const [savedResolution, setSavedResolution] = useState(() => {
        const saved = localStorage.getItem('captureResolution');
        return saved ? JSON.parse(saved) : null;
    });
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
        setIsDrawing(true);
        const rect = e.currentTarget.getBoundingClientRect();
        const scaleX = videoRef.current.videoWidth / rect.width;
        const scaleY = videoRef.current.videoHeight / rect.height;
        
        const startX = (e.clientX - rect.left) * scaleX;
        const startY = (e.clientY - rect.top) * scaleY;
        
        const newBox = {
            startX: startX,
            startY: startY,
            endX: startX,
            endY: startY
        };
        
        setSelectionBox(newBox);
        logSelectionBoxUpdate(captureDebugMode, debugFlags, newBox, 'mousedown');
    };

    const handleMouseMove = (e) => {
        if (!isDrawing || !useVideoStream || !videoRef.current) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const scaleX = videoRef.current.videoWidth / rect.width;
        const scaleY = videoRef.current.videoHeight / rect.height;
        
        const currentX = (e.clientX - rect.left) * scaleX;
        const currentY = (e.clientY - rect.top) * scaleY;
        
        const updatedBox = {
            ...selectionBox,
            endX: currentX,
            endY: currentY
        };
        
        setSelectionBox(updatedBox);
        logSelectionBoxUpdate(captureDebugMode, debugFlags, updatedBox, 'mousemove');
    };

    const handleMouseUp = async () => {
        setIsDrawing(false);
        if (!selectionBox || !videoRef.current) return;

        // Save selection box as percentages of window size
        const relativeBox = {
            startX: (selectionBox.startX / videoRef.current.videoWidth) * 100,
            startY: (selectionBox.startY / videoRef.current.videoHeight) * 100,
            endX: (selectionBox.endX / videoRef.current.videoWidth) * 100,
            endY: (selectionBox.endY / videoRef.current.videoHeight) * 100
        };
        
        logSelectionBox(captureDebugMode, debugFlags, relativeBox);
        setSavedSelectionBox(relativeBox);
        localStorage.setItem('captureSelectionBox', JSON.stringify(relativeBox));

        try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            canvas.width = Math.abs(selectionBox.endX - selectionBox.startX);
            canvas.height = Math.abs(selectionBox.endY - selectionBox.startY);
            
            ctx.drawImage(
                videoRef.current,
                Math.min(selectionBox.startX, selectionBox.endX),
                Math.min(selectionBox.startY, selectionBox.endY),
                canvas.width,
                canvas.height,
                0, 0, canvas.width, canvas.height
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

            const newResults = parseOCRResults(rawOcrText);
            console.log('Parsed OCR results:', newResults);
                    
            if (newResults && newResults.length > 0) {
                // Add reward to mission group
                setOcrMissionGroups(prev => {
                    const newIndex = prev.length;
                    return [...prev, newResults];
                });

                // Add reward to mission rewards
                const reward = newResults[0]?.reward;
                if (reward) {
                    setOcrMissionRewards(prev => ({
                        ...prev,
                        [ocrMissionGroups.length]: reward
                    }));
                }
                
                setOcrResults(prev => [...prev, ...newResults]);
                showBannerMessage('OCR capture successful! Mission group created.', true);
            } else {
                showBannerMessage('No valid mission data found in OCR text.', false);
            }

        } catch (error) {
            console.error('Error in handleMouseUp:', error);
            showBannerMessage('Error capturing text. Please check box size and location.', false);
        }
    };

    const performOCR = async (image) => {
        try {
            setOcrProgress(0);
            if (!image || typeof image !== 'string' || !image.startsWith('data:image')) {
                logOCRError(captureDebugMode, debugFlags, 'Invalid image data provided to OCR');
                showBannerMessage('Invalid image data', false);
                return '';
            }

            logOCRProcess(captureDebugMode, debugFlags, 'Starting OCR processing...');
            
            const worker = await Tesseract.createWorker({
                logger: m => {
                    if (m.status === 'recognizing text') {
                        logOCRProgress(captureDebugMode, debugFlags, m.progress);
                        setOcrProgress(Math.round(m.progress * 100));
                        
                        // Check for reward at every progress update
                        if (m.text) {
                            const reward = extractReward(m.text);
                            if (reward) {
                                logOCRProcess(captureDebugMode, debugFlags, 'Found reward during progress:', reward);
                            }
                        }
                    }
                },
                errorHandler: (err) => {
                    logOCRError(captureDebugMode, debugFlags, 'Tesseract Error:', err);
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
                logOCRProcess(captureDebugMode, debugFlags, 'No text detected in image');
                showBannerMessage('No text detected in image. Try adjusting the capture area.', false);
                return '';
            }

            logOCRProcess(captureDebugMode, debugFlags, 'Raw OCR text:', text);
            
            // Extract reward regardless of progress
            const reward = extractReward(text);
            if (reward) {
                logOCRProcess(captureDebugMode, debugFlags, 'Found reward:', reward);
            }

            const cleanedText = text.replace(/[.,]/g, '');
            
            const parsedResults = parseOCRResults(cleanedText);
            logOCRProcess(captureDebugMode, debugFlags, 'Parsed OCR results:', parsedResults);
            
            const hasValidEntries = validateOCREntries(parsedResults, data);

            if (hasValidEntries) {
                logOCRProcess(captureDebugMode, debugFlags, 'Valid entries found:', parsedResults);
                showBannerMessage('OCR capture successful!', true);
                logOCRResults(captureDebugMode, debugFlags, text, parsedResults, hasValidEntries);
                return cleanedText;
            } else {
                logOCRProcess(captureDebugMode, debugFlags, 'No valid mission data found in:', cleanedText);
                showBannerMessage('No valid mission data detected', false);
                return '';
            }

        } catch (error) {
            logOCRError(captureDebugMode, debugFlags, 'OCR Error:', error);
            showBannerMessage('Error processing image. Please try again.', false);
            return '';
        } finally {
            setOcrProgress(0);
        }
    };

    const parseOCRResults = (text) => {
        const processedText = processOCRText(text, locationCorrections);
        const lines = processedText.split('\n').filter(line => line.trim() !== '');
        const results = [];
        let currentCommodity = null;
        let currentPickup = null;
        let currentDropoff = null;

        const collectPattern = /Collect\s+([\w\s]+?)\s+from/i;
        const pickupPattern = /from\s+(.+)/i;
        const dropoffPattern = /To\s+(.+)/i;
        const deliverPattern = /Deliver\s+(\d+\s*\/\s*\d+)/i;
        const specialCommodityPattern = /(Ship|Quantum)\s+([\w\s]+?)\s+from/i;
        const rawMaterialPattern = /(Corundum|Quartz|Silicon|Tin|Titanium|Tungsten)\s+\(Raw\)/i;

        const commodityEntries = {};

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            
            const specialCommodityMatch = line.match(specialCommodityPattern);
            if (specialCommodityMatch) {
                currentCommodity = `${specialCommodityMatch[1]} ${specialCommodityMatch[2].trim()}`;
            }
            else if (line.match(rawMaterialPattern)) {
                currentCommodity = line.match(rawMaterialPattern)[0];
            }
            else {
                const collectMatch = line.match(collectPattern);
                if (collectMatch) {
                    currentCommodity = collectMatch[1].trim();
                }
            }
            
            const pickupMatch = line.match(pickupPattern);
            if (pickupMatch) {
                currentPickup = pickupMatch[1].trim();
                currentPickup = currentPickup.replace(/[.,]/g, '');
                if (i + 1 < lines.length && !lines[i + 1].match(/Collect|from|To|Deliver/i)) {
                    let nextLine = lines[i + 1].trim().replace(/[.,]/g, '');
                    currentPickup = currentPickup ? `${currentPickup} ${nextLine}` : nextLine;
                    i++;
                }
            }
            
            const dropoffMatch = line.match(dropoffPattern);
            if (dropoffMatch) {
                currentDropoff = dropoffMatch[1].trim();
            }
            
            const deliverMatch = line.match(deliverPattern);
            if (deliverMatch && currentCommodity) {
                let quantity = deliverMatch[1].replace(/\s*\/\s*/, '/').trim();
                quantity = quantity.split('/')[1];
                
                if (i + 1 < lines.length && !lines[i + 1].match(/Collect|from|To|Deliver/i)) {
                    currentDropoff = currentDropoff ? `${currentDropoff} ${lines[i + 1].trim()}` : lines[i + 1].trim();
                    i++;
                }
                
                const entryKey = `${currentCommodity}-${currentPickup}-${currentDropoff}`;
                
                if (commodityEntries[entryKey]) {
                    const existingQuantity = parseInt(commodityEntries[entryKey].quantity, 10) || 0;
                    const newQuantity = parseInt(quantity, 10) || 0;
                    commodityEntries[entryKey].quantity = (existingQuantity + newQuantity).toString();
                } else {
                    commodityEntries[entryKey] = {
                        commodity: currentCommodity,
                        quantity: quantity,
                        pickup: currentPickup || '',
                        dropoff: currentDropoff || ''
                    };
                }
            }
        }

        // Extract reward and add to all entries
        const reward = extractReward(text);
        const entries = Object.values(commodityEntries);
        
        if (reward && entries.length > 0) {
            entries[0].reward = reward;
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

    const handleQuantityEdit = (index, newValue) => {
        setEditedQuantities(prev => ({
            ...prev,
            [index]: newValue
        }));
    };

    const saveQuantityEdit = (index) => {
        const updatedResults = [...ocrResults];
        updatedResults[index].quantity = editedQuantities[index];
        setOcrResults(updatedResults);
        setEditedQuantities(prev => {
            const newState = { ...prev };
            delete newState[index];
            return newState;
        });
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
        
        // Look for "Reward" followed by any characters and a number
        const rewardLine = text.split('\n').find(line => line.toLowerCase().includes('reward'));
        if (rewardLine) {
            // Find all numbers in the line
            const numbers = rewardLine.match(/\d{1,3}(?:,\d{3})*|\d+/g);
            if (numbers) {
                // Convert all numbers to integers (removing commas)
                const cleanNumbers = numbers.map(num => parseInt(num.replace(/,/g, ''), 10));
                // Find the largest number that's at least 1000
                const reward = cleanNumbers.reduce((max, num) => {
                    return (num >= 1000 && num > max) ? num : max;
                }, 0);
                
                if (reward >= 1000) {
                    logOCRProcess(captureDebugMode, debugFlags, 'Extracted reward:', reward);
                    
                    // Set the reward for the current mission group
                    setOcrMissionRewards(prev => ({
                        ...prev,
                        [ocrMissionGroups.length]: reward.toString()
                    }));
                    
                    return reward.toString();
                }
            }
        }
        
        logOCRProcess(captureDebugMode, debugFlags, 'No valid reward found in text');
        return null;
    };

    const handleAddOCRToManifest = () => {
        if (ocrMissionGroups.length > 0) {
            const entries = ocrMissionGroups.flatMap((missionGroup, missionIndex) => {
                return missionGroup.map((result, resultIndex) => {
                    const validation = validateOCRData(result, data);
                    return {
                        commodity: validation.matchedValues.commodity,
                        quantity: result.quantity.split('/')[1] || result.quantity,
                        pickup: validation.matchedValues.pickup,
                        dropoff: validation.matchedValues.dropoff,
                        reward: resultIndex === 0 ? (result.reward || ocrMissionRewards[missionIndex] || '0') : '0'
                    };
                });
            });

            if (entries.length > 0) {
                addOCRToManifest(entries);
                clearOCRMissions();
                showBannerMessage('Mission added successfully!', true);
            }
        }
    };

    // Modify the focusBrowserWindow function
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
                    
                    // Save resolution when stream starts
                    const track = stream.getVideoTracks()[0];
                    const settings = track.getSettings();
                    const resolution = {
                        width: settings.width,
                        height: settings.height
                    };
                    setSavedResolution(resolution);
                    localStorage.setItem('captureResolution', JSON.stringify(resolution));
                    logStreamResolution(captureDebugMode, debugFlags, resolution);

                    // Wait for video to be ready
                    videoRef.current.onloadedmetadata = () => {
                        setTimeout(() => {
                            if (savedSelectionBox) {
                                const newBox = {
                                    startX: (savedSelectionBox.startX * settings.width) / 100,
                                    startY: (savedSelectionBox.startY * settings.height) / 100,
                                    endX: (savedSelectionBox.endX * settings.width) / 100,
                                    endY: (savedSelectionBox.endY * settings.height) / 100
                                };
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
                                setCurrentParsedResults(parsedResults);
                                setOcrResults(prev => [...prev, ...parsedResults]);
                                setOcrCaptureHistory(prev => [...prev, parsedResults]);
                                setOcrMissionGroups(prev => [...prev, parsedResults]);
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
        setSavedSelectionBox(null);
        setSavedResolution(null);
        localStorage.removeItem('captureSelectionBox');
        localStorage.removeItem('captureResolution');
        setSelectionBox(null);
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

                // Convert to grayscale and apply threshold
                for (let i = 0; i < data.length; i += 4) {
                    const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
                    const color = avg > 128 ? 255 : 0; // 128 is the threshold value
                    data[i] = color;
                    data[i + 1] = color;
                    data[i + 2] = color;
                }

                ctx.putImageData(imgData, 0, 0);
                resolve(canvas.toDataURL());
            };
        });
    }

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
                            className="add-entry-button" 
                            onClick={handleAddOCRToManifest}
                            disabled={ocrResults.length === 0}
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
                                    .reduce((total, reward) => total + (parseInt(reward) || 0), 0)
                                    .toLocaleString()} aUEC
                            </div>
                        </div>
                        <h4>OCR Process Log:</h4>
                        {ocrMissionGroups.map((missionGroup, missionIndex) => (
                            <div key={missionIndex} className="capture-table-group">
                                <div className="capture-tab-header">
                                    <h5>Mission {missionIndex + 1}</h5>
                                    <div className="reward-input-container">
                                        <input
                                            type="text"
                                            className="ocr-mission-payout-capture"
                                            placeholder="Enter reward"
                                            value={ocrMissionRewards[missionIndex] ? 
                                                ocrMissionRewards[missionIndex].replace(/\B(?=(\d{3})+(?!\d))/g, ',') : 
                                                ''}
                                            onChange={(e) => {
                                                const reward = e.target.value.replace(/\D/g, '');
                                                const formattedReward = reward.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                                                e.target.value = formattedReward;
                                                setOcrMissionRewards(prev => ({
                                                    ...prev,
                                                    [missionIndex]: reward
                                                }));
                                            }}
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
                                        {missionGroup.map((result, index) => {
                                            const validation = validateOCRData(result, data);
                                            const { exactMatches, matchedValues } = validation;

                                            return (
                                                <tr key={index}>
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
                                                        {editedQuantities[index] !== undefined ? (
                                                            <input
                                                                type="text"
                                                                value={editedQuantities[index]}
                                                                onChange={(e) => handleQuantityEdit(index, e.target.value)}
                                                                onKeyPress={(e) => {
                                                                    if (e.key === 'Enter') {
                                                                        saveQuantityEdit(index);
                                                                    }
                                                                }}
                                                                className="qty-input"
                                                                autoFocus
                                                            />
                                                        ) : (
                                                            <span className="qty-span" onClick={() => handleQuantityEdit(index, result.quantity)}>
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
                        ))}
                        <div className="ocr-actions">
                            <button onClick={handleAddOCRToManifest}>Add All Missions to Manifest</button>
                            <button onClick={clearOCRMissions}>Clear OCR Missions</button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default CaptureSubTabHauling;
