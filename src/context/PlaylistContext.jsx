import React, { createContext, useContext, useEffect, useState } from 'react';

const PlaylistContext = createContext();

export const usePlaylist = () => {
  return useContext(PlaylistContext);
};

export const PlaylistProvider = ({ children }) => {
  const [currentPlaylist, setCurrentPlaylist] = useState({
    name: '',
    description: '',
    songs: [],
    cover: '/assets/images/default-playlist-cover.jpg'
  });
  const [userPlaylists, setUserPlaylists] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  // Load user's playlists from localStorage on component mount
  useEffect(() => {
    const storedPlaylists = localStorage.getItem('userPlaylists');
    if (storedPlaylists) {
      setUserPlaylists(JSON.parse(storedPlaylists));
    }
  }, []);

  // Save playlists to localStorage whenever they change
  useEffect(() => {
    if (userPlaylists.length > 0) {
      localStorage.setItem('userPlaylists', JSON.stringify(userPlaylists));
    }
  }, [userPlaylists]);

  const createNewPlaylist = () => {
    setCurrentPlaylist({
      name: '',
      description: '',
      songs: [],
      cover: '/assets/images/default-playlist-cover.jpg'
    });
  };

  const updatePlaylistInfo = (updates) => {
    setCurrentPlaylist(prev => ({
      ...prev,
      ...updates
    }));
  };

  const addSongToPlaylist = (song) => {
    if (!currentPlaylist.songs.some(s => s.id === song.id)) {
      setCurrentPlaylist(prev => ({
        ...prev,
        songs: [...prev.songs, song]
      }));
      return true;
    }
    return false;
  };

  const removeSongFromPlaylist = (songId) => {
    setCurrentPlaylist(prev => ({
      ...prev,
      songs: prev.songs.filter(song => song.id !== songId)
    }));
  };

  const savePlaylist = () => {
    if (!currentPlaylist.name.trim()) return false;
    
    const playlistToSave = {
      ...currentPlaylist,
      id: `playlist-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updatedPlaylists = [...userPlaylists, playlistToSave];
    setUserPlaylists(updatedPlaylists);
    localStorage.setItem('userPlaylists', JSON.stringify(updatedPlaylists));
    
    // Reset current playlist
    createNewPlaylist();
    return true;
  };

  const deletePlaylist = (playlistId) => {
    const updatedPlaylists = userPlaylists.filter(playlist => playlist.id !== playlistId);
    setUserPlaylists(updatedPlaylists);
    localStorage.setItem('userPlaylists', JSON.stringify(updatedPlaylists));
  };

  const searchSongs = (query, allSongs) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    
    const results = allSongs.filter(song => 
      song.title.toLowerCase().includes(query.toLowerCase()) ||
      (song.artist && song.artist.toLowerCase().includes(query.toLowerCase()))
    );
    
    setSearchResults(results);
  };

  const value = {
    currentPlaylist,
    userPlaylists,
    searchQuery,
    searchResults,
    setSearchQuery,
    createNewPlaylist,
    updatePlaylistInfo,
    addSongToPlaylist,
    removeSongFromPlaylist,
    savePlaylist,
    deletePlaylist,
    searchSongs,
    setSearchResults
  };

  return (
    <PlaylistContext.Provider value={value}>
      {children}
    </PlaylistContext.Provider>
  );
};

export default PlaylistContext;
