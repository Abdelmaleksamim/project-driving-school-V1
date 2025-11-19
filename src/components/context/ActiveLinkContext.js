// src/context/ActiveLinkContext.js
import { createContext, useState } from 'react';

export const ActiveLinkContext = createContext();

export const ActiveLinkProvider = ({ children }) => {
    const [activeLink, setActiveLink] = useState('dashboard');
    return (
        <ActiveLinkContext.Provider value={{ activeLink, setActiveLink }}>
            {children}
        </ActiveLinkContext.Provider>
    );
};