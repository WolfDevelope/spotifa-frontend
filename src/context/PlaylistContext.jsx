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
        // Enrich playlists with full song details from API/local data
        const enrichedPlaylists = await enrichPlaylistsWithSongs(userPlaylists);
        setPlaylists(enrichedPlaylists);
      }
      setIsInitialized(true);
    } catch (error) {
      console.error('Error loading playlists:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addPlaylist = async (playlist) => {
    const enrichedPlaylists = await enrichPlaylistsWithSongs([playlist]);
    const enrichedPlaylist = enrichedPlaylists[0];
    setPlaylists(prev => [...prev, enrichedPlaylist]);
  };

  const removePlaylist = (playlistId) => {
    setPlaylists(prev => prev.filter(p => p._id !== playlistId));
  };

  const updatePlaylist = async (playlistId, updatedData) => {
    const enrichedPlaylists = await enrichPlaylistsWithSongs([updatedData]);
    const enrichedData = enrichedPlaylists[0];
    setPlaylists(prev => 
      prev.map(p => p._id === playlistId ? { ...p, ...enrichedData } : p)
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
