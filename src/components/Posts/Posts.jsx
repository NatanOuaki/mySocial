// Posts.js
import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { useAuth } from '../../AuthContext';

const Posts = () => {
    const [content, setContent] = useState('');
    const [posts, setPosts] = useState([]);
    const { currentUser } = useAuth();

    useEffect(() => {
        const unsubscribe = db.collection('posts')
        .orderBy('createdAt', 'desc')
        .onSnapshot(snapshot => {
            const postsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setPosts(postsData);
        });
        return unsubscribe;
    }, []);

    const handlePostSubmit = async (e) => {
        e.preventDefault();
        if (!currentUser) return;
        
        await db.collection('posts').add({
        userId: currentUser.uid,
        content,
        createdAt: new Date(),
        });

        setContent('');
    };

    return (
        <div>
        <h1>Posts</h1>
        <form onSubmit={handlePostSubmit}>
            <input 
            type="text" 
            placeholder="What's on your mind?" 
            value={content} 
            onChange={(e) => setContent(e.target.value)} 
            />
            <button type="submit">Post</button>
        </form>

        <div>
            {posts.map(post => (
            <div key={post.id}>
                <p>{post.content}</p>
            </div>
            ))}
        </div>
        </div>
    );
};

export default Posts;
