// src/components/PostList.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPosts } from '../services/api';

const PostList = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const postsData = await getPosts();
      setPosts(postsData);
    };

    fetchPosts();
  }, []);

  return (
    <div className="post-list">
      <h1>Posts</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <Link to={`/posts/${post.id}`}>View Post</Link>
            <Link to={`/edit/${post.id}`}>Edit Post</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PostList;
