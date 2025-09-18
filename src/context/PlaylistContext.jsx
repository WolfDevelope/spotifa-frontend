import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import PLAYLIST_API from '../services/playlist';
import { enrichPlaylistsWithSongs } from '../utils/playlistUtils';

const PlaylistContext = createContext();

export const usePlaylist = () => {
  const context = useContext(PlaylistContext);
  if (!context) {
    throw new Error('usePlaylist must be used within a PlaylistProvider');
  }
  return context;
};

export const PlaylistProvider = ({ children }) => {
  const [playlists, setPlaylists] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const { currentUser } = useAuth();

  // Load playlists when user changes
  useEffect(() => {
    if (currentUser) {
      // Reset state and load playlists for new user
      setIsInitialized(false);
      loadPlaylists();
    } else {
      // Clear playlists when user logs out
      setPlaylists([]);
      setIsInitialized(false);
    }
  }, [currentUser]);

  const loadPlaylists = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      if (currentUser) {
        const response = await PLAYLIST_API.getMyPlaylists();
        const userPlaylists = response.playlists || [];
        // Enrich playlists with full song details from local data
        const enrichedPlaylists = enrichPlaylistsWithSongs(userPlaylists);
        setPlaylists(enrichedPlaylists);
      }
      setIsInitialized(true);
    } catch (error) {
      console.error('Error loading playlists:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addPlaylist = (playlist) => {
    const enrichedPlaylist = enrichPlaylistsWithSongs([playlist])[0];
    setPlaylists(prev => [...prev, enrichedPlaylist]);
  };

  const removePlaylist = (playlistId) => {
    setPlaylists(prev => prev.filter(p => p._id !== playlistId));
  };

  const updatePlaylist = (playlistId, updatedData) => {
    setPlaylists(prev => 
      prev.map(p => p._id === playlistId ? { ...p, ...updatedData } : p)
    );
  };

  const refreshPlaylists = () => {
    if (currentUser) {
      setIsInitialized(false);
      loadPlaylists();
    }
  };

  const value = {
    playlists,
    isLoading,
    isInitialized,
    addPlaylist,
    removePlaylist,
    updatePlaylist,
    refreshPlaylists,
    loadPlaylists
  };

  return (
    <PlaylistContext.Provider value={value}>
      {children}
    </PlaylistContext.Provider>
  );
};
