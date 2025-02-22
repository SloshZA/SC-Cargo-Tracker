import { ShipProvider } from './utils/Ships/ShipContext';

// In your App component
function App() {
    return (
        <ShipProvider>
            {/* Your other components */}
            <Ships />
        </ShipProvider>
    );
} 