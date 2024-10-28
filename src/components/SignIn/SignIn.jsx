import React, { useState } from 'react';
import { useAuth } from '../../AuthContext';
import { Link } from 'react-router-dom';

const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { logIn } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await logIn(email, password);
            alert('Login successful!');
        } catch (error) {
            console.error('Error logging in:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input 
                type="email" 
                placeholder="Email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
            />
            <input 
                type="password" 
                placeholder="Password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
            />
            <button type="submit">Log In</button>
            <p>Don't have an account? <Link to="/register">Register here</Link></p>
        </form>
    );
};

export default SignIn;
