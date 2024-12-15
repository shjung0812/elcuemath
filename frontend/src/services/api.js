// src/services/api.js
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const uploadImageToServer = async (image) => {
  const formData = new FormData();
  formData.append('image', image);

  const response = await fetch(`${API_BASE_URL}/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Image upload failed');
  }

  return await response.json();
};

export const createPost = async (imageUrls) => {
  const response = await fetch(`${API_BASE_URL}/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ images: imageUrls }),
  });

  if (!response.ok) {
    throw new Error('Post creation failed');
  }

  return await response.json();
};

export const getPost = async (postId) => {
  const response = await fetch(`${API_BASE_URL}/posts/${postId}`);

  if (!response.ok) {
    throw new Error('Post not found');
  }

  return await response.json();
};

export const updatePost = async (postId, data) => {
  const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Post update failed');
  }

  return await response.json();
};

export const getPosts = async () => {
  const response = await fetch(`${API_BASE_URL}/posts`);

  if (!response.ok) {
    throw new Error('Failed to fetch posts');
  }

  return await response.json();
};
