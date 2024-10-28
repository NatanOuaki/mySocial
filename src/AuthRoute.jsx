import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const AuthRoute = ({ children }) => {
    const { currentUser } = useAuth(); 

    return !currentUser ? children : <Navigate to="/" />;
};

export default AuthRoute;
