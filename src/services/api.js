// src/services/api.js
const API_URL = 'http://localhost:5000/api';

// Helper function to handle API requests
export const apiRequest = async (endpoint, options = {}) => {
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
        ...(localStorage.getItem('token') ? { Authorization: `Bearer ${localStorage.getItem('token')}` } : {}),
      },
      credentials: 'include',
      mode: 'cors',
    });

    // Handle non-JSON responses
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      throw new Error(text || 'Invalid response from server');
    }

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Song related APIs
export const songApi = {
  getAllSongs: () => apiRequest('/songs'),
  getSongById: (id) => apiRequest(`/songs/${id}`),
  searchSongs: (query) => apiRequest(`/songs/search?q=${query}`),
  // Add more song-related API calls as needed
};

// Album related APIs
export const albumApi = {
  getAllAlbums: () => apiRequest('/albums'),
  getAlbumById: (id) => apiRequest(`/albums/${id}`),
  getAlbumsByArtist: (artistId) => apiRequest(`/albums/artist/${artistId}`),
};

// Artist related APIs
export const artistApi = {
  getAllArtists: () => apiRequest('/artists'),
  getArtistById: (id) => apiRequest(`/artists/${id}`),
  getTopArtists: () => apiRequest('/artists/top'),
};

// Playlist related APIs
export const playlistApi = {
  getUserPlaylists: () => apiRequest('/playlists/user'),
  createPlaylist: (data) => 
    apiRequest('/playlists', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  addToPlaylist: (playlistId, songId) => 
    apiRequest(`/playlists/${playlistId}/songs`, {
      method: 'POST',
      body: JSON.stringify({ songId }),
    }),
};

// User related APIs
export const userApi = {
  getCurrentUser: () => apiRequest('/users/me'),
  updateUserProfile: (data) => 
    apiRequest('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

// Add auth related API calls
export const authApi = {
  login: (credentials) => 
    apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
  register: (userData) =>
    apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),
};