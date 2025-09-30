import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { getFavorites } from '../services/favorites';
import musicService from '../services/musicService';
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

  const updateFavoriteSongs = async (favoriteIds) => {
    // Filter out invalid IDs and remove duplicates
    const validIds = [...new Set(favoriteIds.filter(id => id && id !== 'undefined' && id !== null))];
    
    try {
      // Thử lấy songs từ API trước - với limit cao để lấy tất cả
      const response = await musicService.getAllSongs({ limit: 100 });
      
      if (response.success && response.data.length > 0) {
        // Check if any of our favorite IDs exist in API
        const apiIds = response.data.map(song => song._id);
        const matchingIds = validIds.filter(id => apiIds.includes(id));
        const missingApiIds = validIds.filter(id => !apiIds.includes(id) && id.startsWith('68d'));
        
        if (missingApiIds.length > 0) {
          // Try to fetch missing songs individually
          const individualSongs = [];
          for (const songId of missingApiIds) {
            try {
              const songResponse = await musicService.getSongById(songId);
              if (songResponse.success && songResponse.data) {
                individualSongs.push(songResponse.data);
              }
            } catch (error) {
              // Silently handle individual song fetch errors
            }
          }
          
          // Add individually found songs to API songs
          response.data.push(...individualSongs);
        }
        // Sử dụng dữ liệu từ API - tìm theo cả _id và id
        const apiSongs = validIds.map(songId => 
          response.data.find(song => song._id === songId)
        ).filter(song => song !== undefined);
        
        // Tìm các songs còn lại từ local data (cho old format IDs)
        const remainingIds = validIds.filter(songId => 
          !apiSongs.some(song => song._id === songId)
        );
        
        const localSongs = remainingIds.map(songId => 
          data.songs.find(song => song.id === songId)
        ).filter(song => song !== undefined);
        
        const allSongs = [...apiSongs, ...localSongs];
        
        // Only log if there are significant missing songs
        const missingCount = validIds.length - allSongs.length;
        if (missingCount > 2) {
          console.log(`Found ${allSongs.length}/${validIds.length} favorite songs`);
        }
        
        setFavoriteSongs(allSongs);
      } else {
        // Fallback về dữ liệu local nếu API không có dữ liệu
        const songs = validIds.map(songId => 
          data.songs.find(song => song.id === songId || song._id === songId)
        ).filter(song => song !== undefined);
        console.log('updateFavoriteSongs - found songs from local fallback:', songs.length);
        setFavoriteSongs(songs);
      }
    } catch (error) {
      console.error('Error fetching songs for favorites:', error);
      // Fallback về dữ liệu local nếu API lỗi
      const songs = validIds.map(songId => 
        data.songs.find(song => song.id === songId || song._id === songId)
      ).filter(song => song !== undefined);
      console.log('updateFavoriteSongs - fallback songs:', songs.length);
      setFavoriteSongs(songs);
    }
  };

  const loadFavorites = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      if (currentUser) {
        const response = await getFavorites();
        const rawIds = response.favoriteSongs || [];
        
        // Clean up invalid values and remove duplicates
        const favoriteIds = [...new Set(rawIds.filter(id => id && id !== 'undefined' && id !== null))];
        
        const hasInvalidIds = rawIds.some(id => !id || id === 'undefined' || id === null);
        const hasDuplicates = rawIds.length !== new Set(rawIds).size;
        
        if (hasInvalidIds || hasDuplicates) {
          console.log(`Cleaned up ${rawIds.length - favoriteIds.length} invalid/duplicate IDs`);
        }
        
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

  // Load favorites when user changes
  useEffect(() => {
    if (currentUser) {
      // Load favorites for logged-in user
      if (!isInitialized) {
        loadFavorites();
      }
    } else {
      // Load from localStorage for non-logged users or clear when logout
      const localFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      setFavorites(localFavorites);
      if (localFavorites.length > 0) {
        updateFavoriteSongs(localFavorites);
      } else {
        setFavoriteSongs([]);
      }
      setIsInitialized(true);
    }
  }, [currentUser]);

  // Listen for refresh events from HeartIcon
  useEffect(() => {
    const handleRefreshFavorites = (event) => {
      // Only refresh if not triggered from Favorites page removal
      if (currentUser && !event.detail?.skipRefresh) {
        loadFavorites();
      }
    };

    window.addEventListener('refreshFavorites', handleRefreshFavorites);
    return () => {
      window.removeEventListener('refreshFavorites', handleRefreshFavorites);
    };
  }, [currentUser]);

  const addToFavorites = useCallback((songId) => {
    // Validate songId more strictly
    if (!songId || songId === 'undefined' || songId === null || typeof songId !== 'string' || songId.trim() === '') {
      console.warn('Invalid songId provided to addToFavorites:', songId);
      return;
    }
    
    setFavorites(prevFavorites => {
      // Remove duplicates and check if already exists
      const uniqueFavorites = [...new Set(prevFavorites)]; // Remove existing duplicates
      
      if (!uniqueFavorites.includes(songId)) {
        const newFavorites = [...uniqueFavorites, songId];
        // Update localStorage for non-logged users
        if (!currentUser) {
          localStorage.setItem('favorites', JSON.stringify(newFavorites));
        }
        // Update songs immediately for better UX
        updateFavoriteSongs(newFavorites);
        return newFavorites;
      }
      return uniqueFavorites; // Return deduplicated array even if not adding
    });
  }, [currentUser]);

  const removeFromFavorites = useCallback((songId) => {
    setFavorites(prevFavorites => {
      const newFavorites = prevFavorites.filter(id => id !== songId);
      // Update localStorage for non-logged users
      if (!currentUser) {
        localStorage.setItem('favorites', JSON.stringify(newFavorites));
      }
      // Update songs immediately for better UX
      updateFavoriteSongs(newFavorites);
      return newFavorites;
    });
  }, [currentUser]);

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

  const cleanupMissingFavorites = () => {
    // TODO: Implement API call to remove missing song IDs from user's favorites
    // This would help clean up the database from orphaned favorite references
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
