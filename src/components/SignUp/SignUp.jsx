import React, { useState } from 'react';
import { useAuth } from '../../AuthContext';
import { getAuth, updateProfile } from "firebase/auth";
import { Link } from 'react-router-dom';
import './signUp.css';

const SignUp = () => {
    const { signUp } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await signUp(email, password, fullName);
            const user = userCredential.user;
            const auth = getAuth();

            await updateProfile(user, {
                displayName: fullName
            });
            console.log("User profile updated with full name");
        } catch (error) {
            console.error("Error signing up: ", error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
            />
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <button type="submit">Sign Up</button>
            <p>Already have an account? <Link to="/login">Log in here</Link></p>
        </form>
    );
};

export default SignUp;
