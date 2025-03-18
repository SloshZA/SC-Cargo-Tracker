import React from 'react';
import { ShipProvider } from './utils/Ships/ShipContext';
import Ships from './scripts/Tabs/2) Cargo Hold/Ships/Ships';

// In your App component
function App() {
    return (
        <ShipProvider>
            <Ships />
            {/* Your other components */}
        </ShipProvider>
    );
}

export default App; 