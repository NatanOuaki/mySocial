import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, where, orderBy, onSnapshot, doc, updateDoc, arrayUnion, arrayRemove, getDoc } from 'firebase/firestore';
import { useAuth } from '../AuthContext'; 
import '../assets/homePage.css';
import heartEmpty from "../assets/heartEmpty.svg";
import heartHover from "../assets/heartHover.svg";
import heartFilled from "../assets/heartFilled.svg";

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [hoveredPostId, setHoveredPostId] = useState(null);
    const [following, setFollowing] = useState([]);
    const { currentUser } = useAuth(); 

    useEffect(() => {
        const fetchFollowing = async () => {
            if (currentUser) {
                const userDocRef = doc(db, 'users', currentUser.uid);
                const userDoc = await getDoc(userDocRef);
                if (userDoc.exists()) {
                    const followingData = userDoc.data().connections || [];
                    setFollowing([...followingData, currentUser.uid]);
                }
            }
        };

        fetchFollowing();
    }, [currentUser]);

    useEffect(() => {
        if (following.length === 0) return;

        const q = query(
            collection(db, 'posts'), 
            where('userId', 'in', following), 
            orderBy('createdAt', 'desc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const postsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setPosts(postsData);
        });

        return unsubscribe;
    }, [following]);

    const handleLike = async (postId, likedBy) => {
        const postRef = doc(db, 'posts', postId);
        const userId = currentUser.uid;

        const isLiked = likedBy.includes(userId);

        try {
            if (isLiked) {
                await updateDoc(postRef, {
                    likedBy: arrayRemove(userId),
                });
            } else {
                await updateDoc(postRef, {
                    likedBy: arrayUnion(userId),
                });
            }
        } catch (error) {
            console.error("Error updating like status:", error);
        }
    };

    return (
        <div className="post-container">
            {posts.map(post => {
                const isLiked = post.likedBy?.includes(currentUser.uid);
                const heartIcon = hoveredPostId === post.id && !isLiked ? heartHover : isLiked ? heartFilled : heartEmpty;

                return (
                    <div key={post.id} className="post-card">
                        <div className="post-header">
                            <img src={`https://firebasestorage.googleapis.com/v0/b/mysocial-5555.appspot.com/o/profileImages%2F${post.userId}?alt=media&token=865e2d9e-919b-41e6-a5ac-f175eb1220c2`} alt="User" className="post-avatar" />
                            <div className="post-user-info">
                                <span className="post-username">{post.userName}</span>
                                <span className="post-date">{new Date(post.createdAt?.toDate()).toLocaleString()}</span>
                            </div>
                        </div>
                        <p className="post-content">{post.content}</p>
                        {post.imageUrl && (
                            <img src={post.imageUrl} alt="Post" className="post-image" />
                        )}
                        <div className="post-footer">
                            <img 
                                src={heartIcon}
                                onMouseEnter={() => setHoveredPostId(post.id)}
                                onMouseLeave={() => setHoveredPostId(null)}
                                onClick={() => handleLike(post.id, post.likedBy || [])}
                                alt="Like Icon" 
                                className="heart-icon" 
                            />
                            <span>{post.likedBy?.length || 0} Likes</span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default Home;
