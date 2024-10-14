import React from 'react';
import { useAuth } from '../../AuthContext';

const Profile = () => {
    const { currentUser, logOut } = useAuth();

    return (
        <>
            <div>
            <h1>Profile</h1>
            <p>Email: {currentUser?.email}</p>
            <button onClick={logOut}>Log Out</button>
            </div>
        </>
    );
};

export default Profile;
