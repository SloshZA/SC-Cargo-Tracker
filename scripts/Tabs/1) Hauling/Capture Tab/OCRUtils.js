// Fuzzy matching for OCR results
export const findClosestMatch = (input, options) => {
    if (!input || !options || options.length === 0) return null;

    const cleanInput = input.replace(/[[\]{}]/g, '').toLowerCase();
    
    let bestMatch = null;
    let bestScore = -Infinity;

    options.forEach(option => {
        const cleanOption = option.replace(/[[\]{}]/g, '').toLowerCase();
        
        let score = 0;
        const inputWords = cleanInput.split(' ');
        const optionWords = cleanOption.split(' ');
        
        inputWords.forEach(word => {
            if (optionWords.includes(word)) {
                score += word.length * 2;
            } else {
                optionWords.forEach(optionWord => {
                    if (optionWord.includes(word) || word.includes(optionWord)) {
                        score += Math.min(word.length, optionWord.length);
                    }
                });
            }
        });

        if (cleanInput === cleanOption) {
            score = Infinity;
        }

        if (score > bestScore || (score === bestScore && cleanOption.length < bestMatch.length)) {
            bestScore = score;
            bestMatch = option;
        }
    });

    return bestScore === Infinity || bestScore >= cleanInput.length * 0.5 ? bestMatch : null;
};

// Data validation for OCR results
export const validateOCRData = (result, data) => {
    const exactCommodityMatch = data.commodities.includes(result.commodity);
    const exactPickupMatch = data.pickupPoints.includes(result.pickup) || 
        Object.values(data.Dropoffpoints).flat().includes(result.pickup) ||
        Object.values(data.moons).flatMap(moon => Object.values(moon)).flat().includes(result.pickup);
    const exactDropoffMatch = data.pickupPoints.includes(result.dropoff) || 
        Object.values(data.Dropoffpoints).flat().includes(result.dropoff) ||
        Object.values(data.moons).flatMap(moon => Object.values(moon)).flat().includes(result.dropoff);

    const matchedCommodity = findClosestMatch(result.commodity, data.commodities) || result.commodity;
    const matchedPickup = findClosestMatch(result.pickup, [
        ...data.pickupPoints,
        ...Object.values(data.Dropoffpoints).flat(),
        ...Object.values(data.moons).flatMap(moon => Object.values(moon)).flat()
    ]) || result.pickup;
    const matchedDropoff = findClosestMatch(result.dropoff, [
        ...data.pickupPoints,
        ...Object.values(data.Dropoffpoints).flat(),
        ...Object.values(data.moons).flatMap(moon => Object.values(moon)).flat()
    ]) || result.dropoff;

    return {
        exactMatches: {
            commodity: exactCommodityMatch,
            pickup: exactPickupMatch,
            dropoff: exactDropoffMatch
        },
        matchedValues: {
            commodity: matchedCommodity,
            pickup: matchedPickup,
            dropoff: matchedDropoff
        },
        isValid: exactCommodityMatch || exactPickupMatch || exactDropoffMatch
    };
};

// Process OCR text with corrections
export const processOCRText = (text, locationCorrections) => {
    let processedText = text;

    // Apply location code corrections
    Object.entries(locationCorrections.codes).forEach(([incorrect, correct]) => {
        processedText = processedText.replace(new RegExp(incorrect, 'g'), correct);
    });

    // Apply location name corrections
    Object.entries(locationCorrections.names).forEach(([incorrect, correct]) => {
        const escapedIncorrect = incorrect.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        processedText = processedText.replace(new RegExp(escapedIncorrect, 'g'), correct);
    });

    // Remove special characters
    processedText = processedText.replace(/[{}[\]()<>.,|]/g, '');

    return processedText;
};

// Add this new function
export const validateOCREntries = (parsedResults, data) => {
    return parsedResults.some(result => {
        const matchedCommodity = findClosestMatch(result.commodity, data.commodities);
        const matchedPickup = findClosestMatch(result.pickup, [
            ...data.pickupPoints,
            ...Object.values(data.Dropoffpoints).flat(),
            ...Object.values(data.moons).flatMap(moon => Object.values(moon)).flat()
        ]);
        const matchedDropoff = findClosestMatch(result.dropoff, [
            ...data.pickupPoints,
            ...Object.values(data.Dropoffpoints).flat(),
            ...Object.values(data.moons).flatMap(moon => Object.values(moon)).flat()
        ]);
        
        return matchedCommodity && matchedPickup && matchedDropoff;
    });
}; 