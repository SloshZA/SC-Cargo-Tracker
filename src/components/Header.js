import React from 'react';

const Header = ({ darkMode, setDarkMode }) => {
    return (
        <header>
            <h1 style={{ color: 'var(--title-color)' }}>SC Cargo Tracker</h1>
            <button onClick={() => setDarkMode(!darkMode)}>
                {darkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
        </header>
    );
};

export default Header; 