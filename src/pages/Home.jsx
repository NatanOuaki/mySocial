import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import '../assets/homePage.css';
import userImage from "../assets/default-profile.png";

const Home = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const postsData = snapshot.docs.map(doc => ({ id: doc.id , ...doc.data() }));
            setPosts(postsData);
        });
        return unsubscribe;
    }, []);

    return (
        <div className="post-container">
            {posts.map(post => (
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
                        <button className="post-like-btn">❤️ Like</button>
                        <button className="post-comment-btn">💬 Comment</button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Home;
