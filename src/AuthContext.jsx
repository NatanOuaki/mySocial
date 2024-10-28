// AuthContext.js
import React, { useContext, useState, useEffect } from 'react';
import { auth } from './firebase';
import { 
    createUserWithEmailAndPassword, 
    updateProfile,
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged 
} from 'firebase/auth';

const AuthContext = React.createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true); 
    
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    const signUp = async (email, password, fullName) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await updateProfile(user, {
                displayName: fullName
            });

            console.log('User signed up with name:', fullName);
        } catch (error) {
            console.error('Error signing up:', error.message);  // Log error for visibility
        }
    };

    const logIn = async (email, password) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log('User logged in:', userCredential.user);
        } catch (error) {
            console.error('Error logging in:', error.message); 
        }
    };

    const logOut = async () => {
        try {
            await signOut(auth);
            console.log('User logged out');
        } catch (error) {
            console.error('Error logging out:', error.message);
        }
    };

    const value = { currentUser, signUp, logIn, logOut };
    
    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
