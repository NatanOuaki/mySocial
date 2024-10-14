// AuthContext.js
import React, { useContext, useState, useEffect } from 'react';
import { auth } from './firebase';

const AuthContext = React.createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => setCurrentUser(user));
        return unsubscribe;
    }, []);

    const signUp = (email, password) => {
        return auth.createUserWithEmailAndPassword(email, password);
    };

    const logIn = (email, password) => {
        return auth.signInWithEmailAndPassword(email, password);
    };

    const logOut = () => {
        return auth.signOut();
    };

    const value = { currentUser, signUp, logIn, logOut };
    
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
