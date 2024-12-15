// src/components/PostView.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPost } from '../services/api';

const PostView = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postData = await getPost(id);
        setPost(postData);
      } catch (error) {
        setError('Post not found');
      }
    };

    fetchPost();
  }, [id]);

  if (error) {
    return <div>{error}</div>;
  }

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div className="post-view">
      <h1>Post ID: {post.id}</h1>
      <div className="image-gallery">
        {post.images.map((image, index) => (
          <div key={index} className="image-item">
            <img src={image} alt={`img-${index}`} width="100" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostView;
