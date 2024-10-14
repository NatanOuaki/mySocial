import React, { useState } from 'react';
import { useAuth } from '../../AuthContext';

const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
        await login(email, password);
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
        </form>
    );
};

export default SignIn;
