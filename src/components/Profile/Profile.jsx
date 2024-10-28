import React, { useState, useEffect } from 'react';
import { useAuth } from '../../AuthContext';
import { storage, db } from '../../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, getDoc, setDoc, collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import userImage from "../../assets/default-profile.png";

const Profile = () => {
    const { currentUser, logOut } = useAuth();
    const [profileImageURL, setProfileImageURL] = useState('');
    const [userPosts, setUserPosts] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchProfileData = async () => {
            if (currentUser) {
                const userDocRef = doc(db, 'users', currentUser.uid);
                const userDoc = await getDoc(userDocRef);
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    setProfileImageURL(userData.photoURL || userImage);
                }
            }
        };

        const fetchUserPosts = async () => {
            if (currentUser) {
                const postsRef = collection(db, 'posts');
                const userPostsQuery = query(postsRef, where('userId', '==', currentUser.uid), orderBy('createdAt', 'desc'));
                const querySnapshot = await getDocs(userPostsQuery);
                let posts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                posts = posts.sort((a, b) => b.createdAt - a.createdAt);
                setUserPosts(posts);
            }
        };

        fetchProfileData();
        fetchUserPosts();
    }, [currentUser]);

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

    return (
        <div style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex',  justifyContent: 'space-between'}}>
                <div>
                    <img
                        src={profileImageURL || userImage}
                        alt="Profile"
                        onClick={() => setIsModalOpen(true)}
                        style={{
                            width: '150px',
                            height: '150px',
                            borderRadius: '50%',
                            marginBottom: '20px',
                            cursor: 'pointer',
                        }}
                    />
                </div>
                <h1>Hello, {currentUser?.displayName} 👋</h1>
                <button onClick={logOut} style={{ width: '10%', height: '3%'}}>Log Out</button>
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

            <h2>Your Posts</h2>
            <div style={{ display: 'flex', gap: '20px', marginTop: '20px', width: '100%', height: '50vh'  }}>
                {userPosts.length > 0 ? (
                    userPosts.map(post => (
                        <div key={post.id} style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '8px', textAlign: 'center', width: '30%', height: '75%' }}>
                            {post.imageUrl && (
                                <img style={{height: '80%'}} src={post.imageUrl} alt="Post" className="post-image" />
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
