import { useState, useRef, useEffect } from 'react';

export const useTooltip = () => {
    // Load saved size from localStorage, fallback to default if not found
    const defaultSize = { width: 600, height: 300 };
    const savedSize = JSON.parse(localStorage.getItem('tooltipSize')) || defaultSize;
    
    const [showTooltipPopup, setShowTooltipPopup] = useState(false);
    const [tooltipPopupPosition, setTooltipPopupPosition] = useState({ x: 100, y: 100 });
    const [activeTooltipContent, setActiveTooltipContent] = useState('');
    const [tooltipPopupSize, setTooltipPopupSize] = useState(savedSize);
    const tooltipDragRef = useRef(null);
    const resizeRef = useRef(null);
    const lastPosition = useRef({ x: 0, y: 0 });

    // Save size to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('tooltipSize', JSON.stringify(tooltipPopupSize));
    }, [tooltipPopupSize]);

    const handleTooltipDragStart = (e) => {
        const startX = e.clientX - tooltipPopupPosition.x;
        const startY = e.clientY - tooltipPopupPosition.y;

        const handleDrag = (e) => {
            const newPosition = {
                x: e.clientX - startX,
                y: e.clientY - startY
            };
            setTooltipPopupPosition(newPosition);
            lastPosition.current = newPosition; // Remember the last position
        };

        const handleDragEnd = () => {
            document.removeEventListener('mousemove', handleDrag);
            document.removeEventListener('mouseup', handleDragEnd);
        };

        document.addEventListener('mousemove', handleDrag);
        document.addEventListener('mouseup', handleDragEnd);
    };

    const handleResizeStart = (e) => {
        e.preventDefault();
        const startX = e.clientX;
        const startY = e.clientY;
        const startWidth = tooltipPopupSize.width;
        const startHeight = tooltipPopupSize.height;

        const handleResize = (e) => {
            const newWidth = startWidth + (e.clientX - startX);
            const newHeight = startHeight + (e.clientY - startY);
            
            setTooltipPopupSize({
                width: Math.max(300, newWidth),
                height: Math.max(200, newHeight)
            });
        };

        const handleResizeEnd = () => {
            document.removeEventListener('mousemove', handleResize);
            document.removeEventListener('mouseup', handleResizeEnd);
        };

        document.addEventListener('mousemove', handleResize);
        document.addEventListener('mouseup', handleResizeEnd);
    };

    const handleTooltipClick = (e, content) => {
        e.preventDefault();
        e.stopPropagation();
        setActiveTooltipContent(content);
        setShowTooltipPopup(true);
        
        if (lastPosition.current.x === 0 && lastPosition.current.y === 0) {
            // First open of the session - center the popup
            const windowWidth = window.innerWidth;
            const popupWidth = tooltipPopupSize.width;
            const xPosition = Math.max(0, (windowWidth - popupWidth) / 2);
            
            const newPosition = {
                x: xPosition,
                y: 30
            };
            setTooltipPopupPosition(newPosition);
            lastPosition.current = newPosition;
        } else {
            // Use the last known position
            setTooltipPopupPosition(lastPosition.current);
        }
    };

    return {
        showTooltipPopup,
        setShowTooltipPopup,
        tooltipPopupPosition,
        activeTooltipContent,
        tooltipPopupSize,
        tooltipDragRef,
        resizeRef,
        handleTooltipDragStart,
        handleResizeStart,
        handleTooltipClick
    };
}; 