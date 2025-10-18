/**
 * Service xử lý upload file lên Cloudinary từ Frontend
 * Sử dụng trong Admin Panel
 */

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class CloudinaryUploadService {
  /**
   * Upload bài hát (audio/video) lên Cloudinary
   * @param {File} file - File object từ input
   * @param {Object} songData - Thông tin bài hát
   * @returns {Promise<Object>} Response từ server
   */
  async uploadSong(file, songData) {
    try {
      // Tạo FormData để gửi file
      const formData = new FormData();
      formData.append('song', file);
      
      // Thêm thông tin bài hát
      Object.keys(songData).forEach(key => {
        if (songData[key] !== null && songData[key] !== undefined) {
          formData.append(key, songData[key]);
        }
      });

      const token = this.getToken();
      const url = `${API_URL}/songs/upload`;
      
      console.log('🔍 Upload Debug Info:');
      console.log('- API URL:', url);
      console.log('- Has Token:', !!token);
      console.log('- Token:', token ? token.substring(0, 20) + '...' : 'NO TOKEN');
      console.log('- File:', file.name, file.size, 'bytes');

      // Gửi request
      const response = await axios.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${this.getToken()}`
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          console.log(`Upload progress: ${percentCompleted}%`);
          
          // Có thể emit event hoặc callback ở đây
          if (songData.onProgress) {
            songData.onProgress(percentCompleted);
          }
        }
      });

      return response.data;
    } catch (error) {
      console.error('Upload song error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Upload ảnh cover lên Cloudinary
   * @param {File} file - File ảnh
   * @returns {Promise<string>} URL của ảnh đã upload
   */
  async uploadCover(file) {
    try {
      const formData = new FormData();
      formData.append('cover', file);

      const response = await axios.post(`${API_URL}/upload/cover`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${this.getToken()}`
        }
      });

      return response.data.url;
    } catch (error) {
      console.error('Upload cover error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Upload nhiều file cùng lúc
   * @param {Array<File>} files - Mảng các file
   * @param {Object} options - Tùy chọn upload
   * @returns {Promise<Array>} Mảng kết quả upload
   */
  async uploadMultiple(files, options = {}) {
    const uploadPromises = files.map(file => {
      if (this.isAudioVideo(file)) {
        return this.uploadSong(file, options);
      } else if (this.isImage(file)) {
        return this.uploadCover(file);
      } else {
        return Promise.reject(new Error(`Unsupported file type: ${file.type}`));
      }
    });

    try {
      const results = await Promise.all(uploadPromises);
      return results;
    } catch (error) {
      console.error('Upload multiple error:', error);
      throw error;
    }
  }

  /**
   * Xóa file từ Cloudinary
   * @param {string} publicId - Public ID của file trên Cloudinary
   * @returns {Promise<Object>} Response từ server
   */
  async deleteFile(publicId) {
    try {
      const response = await axios.delete(`${API_URL}/upload/cloudinary/${publicId}`, {
        headers: {
          'Authorization': `Bearer ${this.getToken()}`
        }
      });

      return response.data;
    } catch (error) {
      console.error('Delete file error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Kiểm tra file có phải audio/video không
   * @param {File} file - File object
   * @returns {boolean}
   */
  isAudioVideo(file) {
    const audioVideoTypes = [
      'audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg',
      'video/mp4', 'video/mpeg', 'video/quicktime', 'video/x-msvideo'
    ];
    return audioVideoTypes.includes(file.type);
  }

  /**
   * Kiểm tra file có phải ảnh không
   * @param {File} file - File object
   * @returns {boolean}
   */
  isImage(file) {
    return file.type.startsWith('image/');
  }

  /**
   * Validate file trước khi upload
   * @param {File} file - File object
   * @param {Object} options - Tùy chọn validate
   * @returns {Object} { valid: boolean, error: string }
   */
  validateFile(file, options = {}) {
    const {
      maxSize = 100 * 1024 * 1024, // 100MB mặc định
      allowedTypes = ['audio/*', 'video/*', 'image/*']
    } = options;

    // Kiểm tra kích thước
    if (file.size > maxSize) {
      return {
        valid: false,
        error: `File quá lớn. Kích thước tối đa: ${this.formatFileSize(maxSize)}`
      };
    }

    // Kiểm tra loại file
    const isAllowed = allowedTypes.some(type => {
      if (type.endsWith('/*')) {
        return file.type.startsWith(type.replace('/*', ''));
      }
      return file.type === type;
    });

    if (!isAllowed) {
      return {
        valid: false,
        error: `Loại file không được hỗ trợ: ${file.type}`
      };
    }

    return { valid: true };
  }

  /**
   * Format kích thước file
   * @param {number} bytes - Kích thước tính bằng bytes
   * @returns {string} Kích thước đã format
   */
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }

  /**
   * Lấy JWT token từ localStorage
   * @returns {string} JWT token
   */
  getToken() {
    // Thử lấy token trực tiếp trước
    const token = localStorage.getItem('token');
    if (token) return token;
    
    // Nếu không có, thử lấy từ user object
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.token || '';
  }

  /**
   * Xử lý lỗi từ API
   * @param {Error} error - Error object
   * @returns {Error} Error đã xử lý
   */
  handleError(error) {
    if (error.response) {
      // Server trả về lỗi
      const message = error.response.data?.message || 'Upload failed';
      return new Error(message);
    } else if (error.request) {
      // Không nhận được response
      return new Error('Không thể kết nối đến server');
    } else {
      // Lỗi khác
      return error;
    }
  }
}

// Export singleton instance
const cloudinaryUploadService = new CloudinaryUploadService();
export default cloudinaryUploadService;

// Export class để có thể tạo instance mới nếu cần
export { CloudinaryUploadService };
