import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';

const Portal = ({ children }) => {
  const el = document.createElement('div');

  useEffect(() => {
    // Append the element to the body when the component mounts
    document.body.appendChild(el);
    
    // Clean up by removing the element when the component unmounts
    return () => {
      document.body.removeChild(el);
    };
  }, [el]);

  // Use createPortal to render children into the portal element
  return ReactDOM.createPortal(children, el);
};

export default Portal; 