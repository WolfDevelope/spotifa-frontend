// services/favorites.js
import { apiRequest } from './api';

// Get user's favorite songs
export const getFavorites = async () => {
  return await apiRequest('/users/me/favorites');
};

// Toggle favorite status for a song
export const toggleFavorite = async (songId) => {
  return await apiRequest(`/users/me/favorites/${songId}`, {
    method: 'PUT'
  });
};
