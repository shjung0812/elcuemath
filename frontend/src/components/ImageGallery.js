// src/components/ImageGallery.js
import React from 'react';

const ImageGallery = ({ images, onRemove }) => {
  return (
    <div className="image-gallery">
      {images.map((image, index) => (
        <div key={index} className="image-item">
          <img src={image.url} alt={`img-${index}`} width="100" />
          <button onClick={() => onRemove(index)}>Remove</button>
        </div>
      ))}
    </div>
  );
};

export default ImageGallery;
