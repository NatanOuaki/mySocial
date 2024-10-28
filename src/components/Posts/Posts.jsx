import React, { useState } from 'react';
import { db, storage } from '../../firebase';
import { useAuth } from '../../AuthContext';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const Posts = () => {
    const [content, setContent] = useState('');
    const [image, setImage] = useState(null);
    const { currentUser } = useAuth();

    const handlePostSubmit = async (e) => {
        e.preventDefault();
        if (!currentUser) return;

        let imageUrl = null;
        if (image) {
            const imageRef = ref(storage, `posts/${currentUser.uid}_${Date.now()}`);
            await uploadBytes(imageRef, image);
            imageUrl = await getDownloadURL(imageRef);
        }

        await addDoc(collection(db, 'posts'), {
            userId: currentUser.uid,
            userName: currentUser.displayName || "Anonymous",
            content,
            imageUrl, 
            createdAt: Timestamp.now(),
        });

        setContent('');
        setImage(null);
    };

    return (
        <div>
            <form onSubmit={handlePostSubmit}>
                <input 
                    type="text" 
                    placeholder="What's on your mind?" 
                    value={content} 
                    onChange={(e) => setContent(e.target.value)} 
                />
                <input 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => setImage(e.target.files[0])} 
                />
                <button type="submit">Post</button>
            </form>
        </div>
    );
};

export default Posts;
