import React from 'react';
import './TooltipPopup.css';

export const TooltipPopup = ({
    showTooltipPopup,
    tooltipPopupPosition,
    tooltipPopupSize,
    activeTooltipContent,
    handleTooltipDragStart,
    handleResizeStart,
    tooltipDragRef,
    resizeRef,
    setShowTooltipPopup
}) => {
    return showTooltipPopup ? (
        <div 
            className="tooltip-popup"
            style={{
                left: tooltipPopupPosition.x,
                top: tooltipPopupPosition.y,
                width: tooltipPopupSize.width,
                height: tooltipPopupSize.height
            }}
        >
            <div 
                className="tooltip-popup-header"
                onMouseDown={handleTooltipDragStart}
                ref={tooltipDragRef}
            >
                <span>Info</span>
                <button className="close-button" onClick={() => setShowTooltipPopup(false)}>✕</button>
            </div>
            <div 
                className="tooltip-popup-content"
                style={{ height: tooltipPopupSize.height - 50 }}
            >
                {activeTooltipContent.split('\n').map((line, index) => (
                    <p key={index}>{line}</p>
                ))}
            </div>
            <div 
                className="tooltip-popup-resize-handle"
                onMouseDown={handleResizeStart}
                ref={resizeRef}
            />
        </div>
    ) : null;
}; 