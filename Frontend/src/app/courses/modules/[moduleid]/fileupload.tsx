"use client"
import React  from 'react';
import axios from 'axios';
export default function FileUpload({ moduleId, onUploadSuccess }:any ){
  const [file, setFile] = React.useState(null);
  const [resourceType, setResourceType] = React.useState('');
  const [resourceContent, setResourceContent] = React.useState('');
  const [uploading, setUploading] = React.useState(false);

  const handleFileChange = (e:any) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e:any) => {
    e.preventDefault();
    if (!file || !resourceType || !resourceContent) {
      alert('Please fill in all fields.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', resourceType);
    formData.append('content', resourceContent);

    setUploading(true);
    try {
      const res = await axios.post(`http://localhost:5000/resources/${moduleId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });

      alert('File uploaded successfully!');
      onUploadSuccess(res.data);
    } catch (err) {
      console.error('Error uploading file:', err);
      alert('Failed to upload file. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleUpload} className="file-upload-form">
    <label className="file-upload-label">
      Resource Type:
      <input
        type="text"
        value={resourceType}
        onChange={(e) => setResourceType(e.target.value)}
        required
        className="file-upload-input resource-type-input"
      />
    </label>
    <label className="file-upload-label">
      Resource Content:
      <input
        type="text"
        value={resourceContent}
        onChange={(e) => setResourceContent(e.target.value)}
        required
        className="file-upload-input resource-content-input"
      />
    </label>
    <label className="file-upload-label">
      File:
      <input
        type="file"
        onChange={handleFileChange}
        required
        className="file-upload-input file-input"
      />
    </label>
    <button
      type="submit"
      disabled={uploading}
      className={`file-upload-button ${uploading ? 'uploading' : ''}`}
    >
      {uploading ? 'Uploading...' : 'Upload'}
    </button>
  </form>  
  );
}
