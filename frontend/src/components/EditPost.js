// src/components/EditPost.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate  } from 'react-router-dom';
import { getPost, updatePost, uploadImageToServer } from '../services/api';
import ImageUploader from './ImageUploader';
import ImageGallery from './ImageGallery';

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchPost = async () => {
      const postData = await getPost(id);
      setPost(postData);
      setImages(postData.images);
    };

    fetchPost();
  }, [id]);

  const handleUpload = async (uploadedImages) => {
    const newImages = await Promise.all(
      uploadedImages.map(image => uploadImageToServer(image))
    );
    setImages([...images, ...newImages]);
  };

  const handleRemove = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
  };

  const handleSave = async () => {
    await updatePost(id, { images });
    navigate(`/posts/${id}`);
  };

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div className="edit-post">
      <h1>Edit Post</h1>
      <ImageGallery images={images} onRemove={handleRemove} />
      <ImageUploader onUpload={handleUpload} />
      <button onClick={handleSave}>Save Changes</button>
    </div>
  );
};

export default EditPost;
