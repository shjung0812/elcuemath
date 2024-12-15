import React, { useState } from 'react';
import './App.css';
import ImageUploader from './components/ImageUploader';
import ImageGallery from './components/ImageGallery';
import PostView from './components/PostView';
import EditPost from './components/EditPost';
import PostList from './components/PostList';
import Home from './pages/Home';

import { createPost } from './services/api';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

function App() {
  const [images, setImages] = useState([]);
  const [postUrl, setPostUrl] = useState('');

  const handleUpload = (uploadedImages) => {
    setImages([...images, ...uploadedImages]);
  };

  const handleRemove = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
  };

  const handleCreatePost = async () => {
    try {
      const imageUrls = images.map(image => image.url);
      const post = await createPost(imageUrls);
      setPostUrl(post.url);
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  return (
    <div className="App">
      <BrowserRouter>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/create">Create Post</Link>
        </nav>
        <Routes>
          <Route path="/" element={<PostList />} />
          <Route path="/posts/:id" element={<PostView />} />
          <Route path="/edit/:id" element={<EditPost />} />
          <Route path="/create" element={
            <div>
              <h1>Create Post</h1>
              <ImageUploader onUpload={handleUpload} />
              <ImageGallery images={images} onRemove={handleRemove} />
              <button onClick={handleCreatePost}>Create Post</button>
              {postUrl && <div>Post URL: <a href={postUrl}>{postUrl}</a></div>}
            </div>
          } />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
