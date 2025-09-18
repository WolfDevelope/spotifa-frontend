import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { getFavorites } from '../services/favorites';
import data from '../data';

const FavoritesContext = createContext();

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [favoriteSongs, setFavoriteSongs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const { currentUser } = useAuth();

  // Load favorites when user changes
  useEffect(() => {
    if (currentUser) {
      // Reset state and load favorites for new user
      setIsInitialized(false);
      loadFavorites();
    } else {
      // Clear favorites when user logs out
      setFavorites([]);
      setFavoriteSongs([]);
      setIsInitialized(false);
    }
  }, [currentUser]);

  const loadFavorites = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      if (currentUser) {
        const response = await getFavorites();
        const favoriteIds = response.favoriteSongs || [];
        setFavorites(favoriteIds);
        updateFavoriteSongs(favoriteIds);
      }
      setIsInitialized(true);
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateFavoriteSongs = (favoriteIds) => {
    const songs = favoriteIds.map(songId => 
      data.songs.find(song => song.id === songId)
    ).filter(song => song !== undefined);
    setFavoriteSongs(songs);
  };

  const addToFavorites = (songId) => {
    if (!favorites.includes(songId)) {
      const newFavorites = [...favorites, songId];
      setFavorites(newFavorites);
      updateFavoriteSongs(newFavorites);
      
      // Update localStorage for non-logged users
      if (!currentUser) {
        localStorage.setItem('favorites', JSON.stringify(newFavorites));
      }
    }
  };

  const removeFromFavorites = (songId) => {
    const newFavorites = favorites.filter(id => id !== songId);
    setFavorites(newFavorites);
    updateFavoriteSongs(newFavorites);
    
    // Update localStorage for non-logged users
    if (!currentUser) {
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
    }
  };

  const isFavorite = (songId) => {
    return favorites.includes(songId);
  };

  const refreshFavorites = () => {
    if (currentUser) {
      setIsInitialized(false);
      loadFavorites();
    } else {
      const localFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      setFavorites(localFavorites);
      updateFavoriteSongs(localFavorites);
    }
  };

  const value = {
    favorites,
    favoriteSongs,
    isLoading,
    isInitialized,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    refreshFavorites,
    loadFavorites
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};
