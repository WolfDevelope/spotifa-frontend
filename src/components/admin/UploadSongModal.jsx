/**
 * Modal upload bài hát lên Cloudinary
 * Component mẫu để tích hợp vào Admin Panel
 */

import React, { useState } from 'react';
import cloudinaryUploadService from '../../services/cloudinaryUpload';

const UploadSongModal = ({ isOpen, onClose, onSuccess, artists, albums }) => {
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    album: '',
    genre: '',
    lyrics: '',
    duration: '',
    durationSec: 0
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  // Xử lý thay đổi input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Xử lý chọn file
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file
    const validation = cloudinaryUploadService.validateFile(file, {
      maxSize: 100 * 1024 * 1024, // 100MB
      allowedTypes: ['audio/*', 'video/*']
    });

    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    setSelectedFile(file);
    setError('');

    // Tự động tính duration nếu là audio
    if (file.type.startsWith('audio/')) {
      const audio = new Audio();
      audio.src = URL.createObjectURL(file);
      audio.addEventListener('loadedmetadata', () => {
        const durationSec = Math.floor(audio.duration);
        const minutes = Math.floor(durationSec / 60);
        const seconds = durationSec % 60;
        const durationStr = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        setFormData(prev => ({
          ...prev,
          duration: durationStr,
          durationSec: durationSec
        }));
      });
    }
  };

  // Xử lý upload
  const handleUpload = async () => {
    // Validate form
    if (!formData.title.trim()) {
      setError('Vui lòng nhập tên bài hát');
      return;
    }

    if (!formData.artist) {
      setError('Vui lòng chọn nghệ sĩ');
      return;
    }

    if (!selectedFile) {
      setError('Vui lòng chọn file audio/video');
      return;
    }

    setIsUploading(true);
    setError('');

    try {
      // Upload lên Cloudinary
      const result = await cloudinaryUploadService.uploadSong(selectedFile, {
        ...formData,
        onProgress: (progress) => {
          setUploadProgress(progress);
        }
      });

      // Thành công
      setIsUploading(false);
      setUploadProgress(0);
      
      if (onSuccess) {
        onSuccess(result.data);
      }

      // Reset form
      resetForm();
      onClose();

    } catch (error) {
      setIsUploading(false);
      setUploadProgress(0);
      setError(error.message || 'Upload thất bại. Vui lòng thử lại.');
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: '',
      artist: '',
      album: '',
      genre: '',
      lyrics: '',
      duration: '',
      durationSec: 0
    });
    setSelectedFile(null);
    setUploadProgress(0);
    setError('');
  };

  // Đóng modal
  const handleClose = () => {
    if (!isUploading) {
      resetForm();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#2d2240] rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Upload Song to Cloudinary</h2>
          <button
            onClick={handleClose}
            disabled={isUploading}
            className="text-gray-400 hover:text-white disabled:opacity-50"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 bg-red-500 bg-opacity-20 border border-red-500 rounded text-red-400">
            {error}
          </div>
        )}

        {/* Form */}
        <div className="space-y-4">
          {/* File input */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Audio/Video File *
            </label>
            <input
              type="file"
              accept="audio/*,video/*"
              onChange={handleFileSelect}
              disabled={isUploading}
              className="w-full px-3 py-2 bg-[#1a1a2e] text-white rounded border border-gray-600 focus:border-pink-500 focus:outline-none disabled:opacity-50"
            />
            {selectedFile && (
              <p className="mt-2 text-sm text-gray-400">
                Selected: {selectedFile.name} ({cloudinaryUploadService.formatFileSize(selectedFile.size)})
              </p>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Song Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              disabled={isUploading}
              className="w-full px-3 py-2 bg-[#1a1a2e] text-white rounded border border-gray-600 focus:border-pink-500 focus:outline-none disabled:opacity-50"
              placeholder="Enter song title"
            />
          </div>

          {/* Artist */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Artist *
            </label>
            <select
              name="artist"
              value={formData.artist}
              onChange={handleInputChange}
              disabled={isUploading}
              className="w-full px-3 py-2 bg-[#1a1a2e] text-white rounded border border-gray-600 focus:border-pink-500 focus:outline-none disabled:opacity-50"
            >
              <option value="">Select artist</option>
              {artists?.map(artist => (
                <option key={artist._id} value={artist._id}>
                  {artist.name}
                </option>
              ))}
            </select>
          </div>

          {/* Album */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Album (Optional)
            </label>
            <select
              name="album"
              value={formData.album}
              onChange={handleInputChange}
              disabled={isUploading}
              className="w-full px-3 py-2 bg-[#1a1a2e] text-white rounded border border-gray-600 focus:border-pink-500 focus:outline-none disabled:opacity-50"
            >
              <option value="">Select album</option>
              {albums?.map(album => (
                <option key={album._id} value={album._id}>
                  {album.name}
                </option>
              ))}
            </select>
          </div>

          {/* Genre */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Genre
            </label>
            <input
              type="text"
              name="genre"
              value={formData.genre}
              onChange={handleInputChange}
              disabled={isUploading}
              className="w-full px-3 py-2 bg-[#1a1a2e] text-white rounded border border-gray-600 focus:border-pink-500 focus:outline-none disabled:opacity-50"
              placeholder="e.g., Pop, Rock, Jazz"
            />
          </div>

          {/* Duration */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Duration (MM:SS)
              </label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                disabled={isUploading}
                className="w-full px-3 py-2 bg-[#1a1a2e] text-white rounded border border-gray-600 focus:border-pink-500 focus:outline-none disabled:opacity-50"
                placeholder="3:45"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Duration (Seconds)
              </label>
              <input
                type="number"
                name="durationSec"
                value={formData.durationSec}
                onChange={handleInputChange}
                disabled={isUploading}
                className="w-full px-3 py-2 bg-[#1a1a2e] text-white rounded border border-gray-600 focus:border-pink-500 focus:outline-none disabled:opacity-50"
                placeholder="225"
              />
            </div>
          </div>

          {/* Lyrics */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Lyrics (Optional)
            </label>
            <textarea
              name="lyrics"
              value={formData.lyrics}
              onChange={handleInputChange}
              disabled={isUploading}
              rows={4}
              className="w-full px-3 py-2 bg-[#1a1a2e] text-white rounded border border-gray-600 focus:border-pink-500 focus:outline-none disabled:opacity-50"
              placeholder="Enter song lyrics..."
            />
          </div>

          {/* Upload progress */}
          {isUploading && (
            <div>
              <div className="flex justify-between text-sm text-gray-400 mb-2">
                <span>Uploading to Cloudinary...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-pink-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={handleClose}
            disabled={isUploading}
            className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={isUploading || !selectedFile || !formData.title || !formData.artist}
            className="px-6 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? 'Uploading...' : 'Upload to Cloudinary'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadSongModal;
