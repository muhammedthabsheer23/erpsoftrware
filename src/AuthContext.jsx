import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [username, setUsername] = useState('');

    // Load username from localStorage on component mount
    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
            setUsername(storedUsername);
        }
    }, []);

    // Save username to localStorage whenever it changes
    useEffect(() => {
        if (username) {
            localStorage.setItem('username', username);
        }
    }, [username]);

    return (
        <AuthContext.Provider value={{ token, setToken, username, setUsername }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
