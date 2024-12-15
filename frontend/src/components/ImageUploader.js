// src/components/ImageUploader.js
import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { uploadImageToServer } from '../services/api';

const ImageUploader = ({ onUpload }) => {
  const [files, setFiles] = useState([]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    onDrop: async (acceptedFiles) => {
      try {
        const uploadedImages = await Promise.all(
          acceptedFiles.map(file => uploadImageToServer(file))
        );
        setFiles(uploadedImages);
        onUpload(uploadedImages);
      } catch (error) {
        console.error('Error uploading images:', error);
      }
    },
  });

  return (
    <div className="image-uploader">
      <div {...getRootProps({ className: 'dropzone' })}>
        <input {...getInputProps()} />
        <p>Drag 'n' drop some files here, or click to select files</p>
      </div>
      <div className="preview">
        {files.map((file, index) => (
          <div key={index}>
            <img src={file.url} alt="preview" width="100" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageUploader;
