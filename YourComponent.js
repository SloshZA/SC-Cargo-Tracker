import React, { useState } from 'react';

const [isCompactMode, setIsCompactMode] = useState(false);

const toggleCompactMode = () => {
    const body = document.body;
    const root = document.getElementById('root');
    
    if (isCompactMode) {
        body.classList.remove('compact-mode');
        body.classList.add('normal-mode');
        root.classList.remove('compact-mode');
        root.classList.add('normal-mode');
    } else {
        body.classList.remove('normal-mode');
        body.classList.add('compact-mode');
        root.classList.remove('normal-mode');
        root.classList.add('compact-mode');
    }
    
    setIsCompactMode(!isCompactMode);
}; 