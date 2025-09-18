import { apiRequest } from './api';

const PLAYLIST_API = {
  // Get user's playlists
  getMyPlaylists: async () => {
    return apiRequest('/playlists/my', {
      method: 'GET'
    });
  },

  // Create new playlist
  createPlaylist: async (playlistData) => {
    return apiRequest('/playlists', {
      method: 'POST',
      body: JSON.stringify(playlistData)
    });
  },

  // Get playlist by ID
  getPlaylistById: async (id) => {
    return apiRequest(`/playlists/${id}`, {
      method: 'GET'
    });
  },

  // Update playlist
  updatePlaylist: async (id, playlistData) => {
    return apiRequest(`/playlists/${id}`, {
      method: 'PUT',
      body: JSON.stringify(playlistData)
    });
  },

  // Delete playlist
  deletePlaylist: async (id) => {
    return apiRequest(`/playlists/${id}`, {
      method: 'DELETE'
    });
  },

  // Add song to playlist
  addSongToPlaylist: async (playlistId, songId) => {
    return apiRequest(`/playlists/${playlistId}/songs`, {
      method: 'POST',
      body: JSON.stringify({ songId })
    });
  },

  // Remove song from playlist
  removeSongFromPlaylist: async (playlistId, songId) => {
    return apiRequest(`/playlists/${playlistId}/songs/${songId}`, {
      method: 'DELETE'
    });
  }
};

export default PLAYLIST_API;
