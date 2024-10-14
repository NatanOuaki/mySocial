import React, { useState } from 'react';
import { storage } from '../../firebase';

const UploadImage = () => {
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');

  const handleUpload = async () => {
    if (!file) return;

    const storageRef = storage.ref();
    const fileRef = storageRef.child(file.name);
    await fileRef.put(file);
    const downloadURL = await fileRef.getDownloadURL();
    setImageUrl(downloadURL);
  };

  return (
    <div>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleUpload}>Upload Image</button>

      {imageUrl && <img src={imageUrl} alt="Uploaded" />}
    </div>
  );
};

export default UploadImage;
