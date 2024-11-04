import React, { useState, useEffect } from 'react';
import { useAuth } from '../../AuthContext';
import { storage, db } from '../../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, getDoc, setDoc, collection, query, where, orderBy, getDocs, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import userImage from "../../assets/default-profile.png";

const Profile = ({ userId }) => {
    const { currentUser, logOut } = useAuth();
    const [profileImageURL, setProfileImageURL] = useState('');
    const [userPosts, setUserPosts] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [displayName, setDisplayName] = useState(''); 
    const isCurrentUserProfile = !userId || userId === currentUser?.uid;
    const [isConnectedTo, setIsConnectedTo] = useState(false);

    useEffect(() => {
        const fetchProfileData = async () => {
            const uid = isCurrentUserProfile ? currentUser?.uid : userId;
            if (uid) {
                const userDocRef = doc(db, 'users', uid);
                const userDoc = await getDoc(userDocRef);
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    setProfileImageURL(userData.photoURL || userImage);
                    setDisplayName(userData.displayName || uid); 
                }
            }
        };

        const fetchUserPosts = async () => {
            const uid = isCurrentUserProfile ? currentUser?.uid : userId;
            if (uid) {
                const postsRef = collection(db, 'posts');
                const userPostsQuery = query(postsRef, where('userId', '==', uid), orderBy('createdAt', 'desc'));
                const querySnapshot = await getDocs(userPostsQuery);
                const posts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setUserPosts(posts);
            }
        };

        const fetchConnectedUsers = async () => {
            const uid = currentUser.uid;
            if (uid) {
                const userDocRef = doc(db, 'users', uid);
                const userDoc = await getDoc(userDocRef);
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    if (userData.connections.includes(userId)) 
                        setIsConnectedTo(true);
                }
            }
        };


        fetchProfileData();
        fetchUserPosts();
        fetchConnectedUsers();
    }, [currentUser, userId, isCurrentUserProfile]);

    const handleProfileImageChange = async (event) => {
        const file = event.target.files[0];
        if (file && currentUser) {
            setUploading(true);
            const storageRef = ref(storage, `profileImages/${currentUser.uid}`);
            await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(storageRef);

            const userDocRef = doc(db, 'users', currentUser.uid);
            await setDoc(userDocRef, { photoURL: downloadURL }, { merge: true });

            setProfileImageURL(downloadURL); 
            setUploading(false);
            setIsModalOpen(false);
        }
    };

    const handleConnect = async () =>{
        const uid = currentUser.uid;
        const userDocRef = doc(db, 'users', uid);
        await updateDoc(userDocRef, {
            connections: arrayUnion(userId)
        })
        setIsConnectedTo(true);
    }

        const handleRemove = async () =>{
        const uid = currentUser.uid;
        const userDocRef = doc(db, 'users', uid);
        await updateDoc(userDocRef, {
            connections: arrayRemove(userId)
        })
        setIsConnectedTo(false);
    }


    return (
        <div style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <img
                        src={profileImageURL || userImage}
                        alt="Profile"
                        onClick={() => isCurrentUserProfile && setIsModalOpen(true)}
                        style={{
                            width: '150px',
                            height: '150px',
                            borderRadius: '50%',
                            marginBottom: '20px',
                            objectFit: 'cover',
                            cursor: isCurrentUserProfile ? 'pointer' : 'default',
                        }}
                    />
                </div>
                <h1 style={{ margin: '0', flex: 1 }}>{isCurrentUserProfile ? `Hello, ${displayName} 👋` : `${displayName}`}</h1>
                {isCurrentUserProfile ? (
                    <button onClick={logOut} style={{ width: '10%', height: '3%' }}>Log Out</button>
                ): isConnectedTo ? (
                    <button onClick={handleRemove} style={{ width: '10%', height: '3%' }}>Remove -</button>
                ) :(
                    <button onClick={handleConnect} style={{ width: '10%', height: '3%' }}>Connect +</button>
                ) }
            </div>

            {isModalOpen && (
                <div style={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    background: 'white',
                    padding: '20px',
                    borderRadius: '8px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                    zIndex: '1000'
                }}>
                    <h2>Change Profile Image</h2>
                    <input type="file" onChange={handleProfileImageChange} disabled={uploading} />
                    {uploading && <p>Uploading...</p>}
                    <button onClick={() => setIsModalOpen(false)}>Cancel</button>
                </div>
            )}
            <div style={{ display: 'flex', gap: '20px', marginTop: '20px', flexWrap: 'wrap'}}>
                {userPosts.length > 0 ? (
                    userPosts.map(post => (
                        <div key={post.id} style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '8px', textAlign: 'center', width: '200px' }}>
                            {post.imageUrl && (
                                <img src={post.imageUrl} alt="Post" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                            )}
                            <p>{post.content}</p>
                        </div>
                    ))
                ) : (
                    <p>No posts yet.</p>
                )}
            </div>
        </div>
    );
};

export default Profile;
