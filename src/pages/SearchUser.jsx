import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const UserSearch = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const navigate = useNavigate();

    const handleSearchChange = async (e) => {
        const term = e.target.value;
        setSearchTerm(term);

        if (term.trim() === '') {
            setSearchResults([]);
            return;
        }

        try {
            const usersRef = collection(db, 'users');
            const searchQuery = query(
                usersRef,
                where('displayName', '>=', term),
                where('displayName', '<=', term + '\uf8ff')
            );

            const querySnapshot = await getDocs(searchQuery);
            
            console.log("Search Term:", term); 
            console.log("Number of Results:", querySnapshot.docs.length); 

            const results = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setSearchResults(results);
        } catch (error) {
        }
    };

    const handleUserClick = (userId) => {
        navigate(`/user/${userId}`);
    };

    return (
        <div style={{ textAlign: 'center', margin: '20px' }}>
            <input
                type="text"
                placeholder="Search for users..."
                value={searchTerm}
                onChange={handleSearchChange}
                style={{
                    padding: '10px',
                    width: '300px',
                    borderRadius: '5px',
                    border: '1px solid #ccc',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                    outline: 'none',
                    transition: 'border 0.3s',
                }}
                onFocus={(e) => (e.target.style.border = '1px solid #007bff')}
                onBlur={(e) => (e.target.style.border = '1px solid #ccc')}
            />

            {searchResults.length > 0 && (
                <ul style={{ listStyleType: 'none', padding: 0, marginTop: '20px' }}>
                    {searchResults.map(user => (
                        <li
                            key={user.id}
                            onClick={() => handleUserClick(user.id)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                padding: '10px',
                                cursor: 'pointer',
                                borderBottom: '1px solid #ddd',
                                transition: 'background-color 0.3s',
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f0f8ff')}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                        >
                            {user.photoURL ? (
                                <img
                                    src={user.photoURL}
                                    alt={`${user.displayName}'s profile`}
                                    style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '50%',
                                        marginRight: '10px',
                                        objectFit: 'cover',
                                    }}
                                />
                            ) : (
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '50%',
                                    backgroundColor: '#ccc',
                                    marginRight: '10px',
                                }} />
                            )}
                            <span style={{ fontSize: '1.1em', color: '#333' }}>{user.displayName}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default UserSearch;
