import React, { createContext, useEffect, useState } from "react";

export const DarkModeContext = createContext();

export const DarkModeProvider = ({children}) => {
    const [darkMode, setDarkMode] = useState(() => {
        const savedMode = localStorage.getItem('darkMode');
        return savedMode ? JSON.parse(savedMode) : false;
    });

    useEffect(() => {
        localStorage.setItem('darkMode',JSON.stringify(darkMode));
    },[darkMode]);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    return(
        <DarkModeContext.Provider value={{darkMode, toggleDarkMode}}>
            {children}
        </DarkModeContext.Provider>
    )
}