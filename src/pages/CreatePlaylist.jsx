import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { usePlaylist } from '../context/PlaylistContext';
import { useAuth } from '../context/AuthContext';
import PLAYLIST_API from '../services/playlist';
import { enrichPlaylistWithSongs } from '../utils/playlistUtils';
import musicService from '../services/musicService';
import data from '../data';
import { usePlaylistNotification } from '../context/PlaylistNotificationContext';
import '../assets/styles/main.css';

const CreatePlaylist = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { currentUser } = useAuth();
  const { playlists, addPlaylist, updatePlaylist } = usePlaylist();
  const { showSuccess, showError } = usePlaylistNotification();
  
  const editPlaylistId = searchParams.get('edit');
  const isEditMode = !!editPlaylistId;
  
  const [playlistData, setPlaylistData] = useState({
    name: '',
    description: '',
    songs: []
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [allSongs, setAllSongs] = useState([]);
  const [allArtists, setAllArtists] = useState([]);
  const [allAlbums, setAllAlbums] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const [isSaving, setIsSaving] = useState(false);

  // Load all data from API
  useEffect(() => {
    const loadAllData = async () => {
      try {
        setIsLoadingData(true);
        
        // Load songs, artists, and albums from API with fallback to local data
        const [songsResponse, artistsResponse, albumsResponse] = await Promise.all([
          musicService.getAllSongs({ limit: 100 }).catch(() => ({ success: false })),
          musicService.getAllArtists({ limit: 100 }).catch(() => ({ success: false })),
          musicService.getAllAlbums({ limit: 100 }).catch(() => ({ success: false }))
        ]);

        // Use API data if available, otherwise fallback to local data
        const songs = songsResponse.success && songsResponse.data.length > 0 
          ? songsResponse.data 
          : data.songs;
        
        const artists = artistsResponse.success && artistsResponse.data.length > 0 
          ? artistsResponse.data 
          : data.artists;
          
        const albums = albumsResponse.success && albumsResponse.data.length > 0 
          ? albumsResponse.data 
          : data.albums;

        setAllSongs(songs);
        setAllArtists(artists);
        setAllAlbums(albums);
        
      } catch (error) {
        console.error('Error loading data:', error);
        // Fallback to local data
        setAllSongs(data.songs);
        setAllArtists(data.artists);
        setAllAlbums(data.albums);
      } finally {
        setIsLoadingData(false);
      }
    };

    loadAllData();
  }, []);

  // Load playlist data for edit mode
  useEffect(() => {
    if (isEditMode && editPlaylistId) {
      const playlistToEdit = playlists.find(p => p._id === editPlaylistId);
      if (playlistToEdit) {
        setPlaylistData({
          name: playlistToEdit.name,
          description: playlistToEdit.description || '',
          songs: playlistToEdit.songs || []
        });
      } else {
        // If playlist not found in cache, fetch from API
        const fetchPlaylist = async () => {
          try {
            const response = await PLAYLIST_API.getPlaylistById(editPlaylistId);
            const enrichedPlaylist = await enrichPlaylistWithSongs(response);
            setPlaylistData({
              name: enrichedPlaylist.name,
              description: enrichedPlaylist.description || '',
              songs: enrichedPlaylist.songs || []
            });
          } catch (error) {
            console.error('Error loading playlist for edit:', error);
            showError('Failed to load playlist for editing. Redirecting to your playlists.', 'Load Failed');
            navigate('/your-playlists');
          }
        };
        fetchPlaylist();
      }
    }
  }, [isEditMode, editPlaylistId, playlists, navigate]);

  const updatePlaylistInfo = (updates) => {
    setPlaylistData(prev => ({ ...prev, ...updates }));
  };

  const addSongToPlaylist = (song) => {
    const songId = song._id || song.id; // Support both API (_id) and local (id) formats
    if (!playlistData.songs.some(s => (s._id || s.id) === songId)) {
      setPlaylistData(prev => ({
        ...prev,
        songs: [...prev.songs, song]
      }));
      return true;
    }
    return false;
  };

  const removeSongFromPlaylist = (songId) => {
    setPlaylistData(prev => ({
      ...prev,
      songs: prev.songs.filter(song => (song._id || song.id) !== songId)
    }));
  };

  const searchSongs = (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    
    const results = allSongs.filter(song => {
      const songTitle = song.title?.toLowerCase() || '';
      const queryLower = query.toLowerCase();
      
      // For API songs, find artist by ID
      let artistName = '';
      if (song.artist) {
        if (typeof song.artist === 'string') {
          // If artist is populated as object
          const artist = allArtists.find(a => (a._id || a.id) === song.artist);
          artistName = artist?.name?.toLowerCase() || '';
        } else if (song.artist.name) {
          // If artist is populated as object
          artistName = song.artist.name.toLowerCase();
        }
      } else if (song.artistId) {
        // For local data format
        const artist = allArtists.find(a => (a._id || a.id) === song.artistId);
        artistName = artist?.name?.toLowerCase() || '';
      }
      
      return songTitle.includes(queryLower) || artistName.includes(queryLower);
    });
    
    setSearchResults(results);
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    searchSongs(query);
  };

  const handleAddSong = (song) => {
    const added = addSongToPlaylist(song);
    if (added) {
      // Don't remove from search results, just let the UI update to show "Added" state
      // The search results will now show "Added" button instead of "Add" button
    }
  };

  const handleRemoveSong = (song) => {
    const songId = song._id || song.id; // Support both formats
    removeSongFromPlaylist(songId);
  };

  const handleSavePlaylist = async () => {
    if (!playlistData.name.trim()) {
      showError('Please enter a playlist name to continue.', 'Name Required');
      return;
    }
    
    if (playlistData.songs.length === 0) {
      showError('Please add at least one song to the playlist.', 'Songs Required');
      return;
    }
    
    if (!currentUser) {
      showError('Please login to create playlists.', 'Login Required');
      return;
    }
    
    setIsSaving(true);
    
    try {
      const playlistPayload = {
        name: playlistData.name,
        description: playlistData.description,
        songs: playlistData.songs.map(song => song._id || song.id) // Support both formats
      };
      
      if (isEditMode) {
        // Update existing playlist
        const response = await PLAYLIST_API.updatePlaylist(editPlaylistId, playlistPayload);
        if (response.success) {
          // Update the playlist in context with enriched data
          await updatePlaylist(editPlaylistId, response.playlist);
          showSuccess(`"${playlistData.name}" has been updated successfully!`, 'Playlist Updated');
          // Navigate back with state to force refresh
          navigate(`/playlist/${editPlaylistId}`, { 
            state: { forceRefresh: true },
            replace: true 
          });
        }
      } else {
        // Create new playlist
        const response = await PLAYLIST_API.createPlaylist(playlistPayload);
        if (response.success) {
          await addPlaylist(response.playlist);
          showSuccess(`"${playlistData.name}" has been created successfully!`, 'Playlist Created');
          navigate('/your-playlists');
        }
      }
    } catch (error) {
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} playlist:`, error);
      showError(`Failed to ${isEditMode ? 'update' : 'create'} playlist. Please try again.`, `${isEditMode ? 'Update' : 'Create'} Failed`);
    } finally {
      setIsSaving(false);
    }
  };

  // Format duration from MM:SS string or seconds to MM:SS
  const formatDuration = (duration) => {
    if (!duration) return '0:00';
    
    // If duration is already in MM:SS format, return as is
    if (typeof duration === 'string' && duration.includes(':')) {
      return duration;
    }
    
    // If duration is a number (in seconds), convert to MM:SS
    const numDuration = Number(duration);
    if (!isNaN(numDuration)) {
      const mins = Math.floor(numDuration / 60);
      const secs = Math.floor(numDuration % 60).toString().padStart(2, '0');
      return `${mins}:${secs}`;
    }
    
    return '0:00';
  };

  if (isLoadingData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#1e1e2a] to-[#0f0f1a] text-white p-6 ml-64">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
            <span className="ml-4 text-gray-400">Loading songs...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1e1e2a] to-[#0f0f1a] text-white p-6 ml-64">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">
          {isEditMode ? 'Edit Playlist' : 'Create New Playlist'}
        </h1>
        
        {/* Playlist Info */}
        <div className="bg-[#181a2a] rounded-lg p-6 mb-8">
          <div className="flex gap-6">
            <div className="w-48 h-48 bg-gradient-to-br from-pink-600 to-purple-700 rounded-lg overflow-hidden flex-shrink-0">
              {playlistData.songs.length > 0 ? (
                <div className="grid grid-cols-2 grid-rows-2 w-full h-full">
                  {Array.from({ length: 4 }).map((_, index) => {
                    const song = playlistData.songs[index];
                    return song ? (
                      <div key={index} className="relative overflow-hidden">
                        <img 
                          src={song.cover} 
                          alt={`${song.title} cover`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/assets/images/default-song-cover.jpg';
                          }}
                        />
                      </div>
                    ) : (
                      <div key={index} className="bg-gray-800" />
                    );
                  })}
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-800">
                  <span className="text-gray-500 text-xs text-center p-2">Add songs to see cover</span>
                </div>
              )}
            </div>
            
            <div className="flex-1 flex flex-col justify-end">
              <div className="mb-4">
                <input
                  type="text"
                  value={playlistData.name}
                  onChange={(e) => updatePlaylistInfo({ name: e.target.value })}
                  className="w-full bg-transparent text-4xl font-bold mb-2 text-white placeholder-gray-500 focus:outline-none"
                  placeholder="New Playlist"
                />
                <textarea
                  value={playlistData.description}
                  onChange={(e) => updatePlaylistInfo({ description: e.target.value })}
                  className="w-full bg-transparent text-gray-300 placeholder-gray-500 focus:outline-none resize-none"
                  placeholder="Add an optional description"
                  rows="2"
                />
              </div>
              
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-gray-400">
                  {playlistData.songs.length} {playlistData.songs.length === 1 ? 'song' : 'songs'}
                </div>
                
                <div className="flex gap-3">
                  {isEditMode && (
                    <button
                      onClick={() => navigate(`/playlist/${editPlaylistId}`)}
                      className="px-6 py-2 bg-transparent border border-gray-600 hover:border-gray-400 text-gray-300 hover:text-white rounded-full font-medium transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    onClick={handleSavePlaylist}
                    disabled={isSaving || !playlistData.name.trim() || playlistData.songs.length === 0}
                    className={`px-6 py-2 rounded-full font-medium ${
                      isSaving || !playlistData.name.trim() || playlistData.songs.length === 0
                        ? 'bg-gray-600 cursor-not-allowed'
                        : 'bg-pink-600 hover:bg-pink-700'
                    } text-white transition-colors`}
                  >
                    {isSaving 
                      ? (isEditMode ? 'Updating...' : 'Saving...') 
                      : (isEditMode ? 'Update Playlist' : 'Save Playlist')
                    }
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Selected Songs */}
        <div className="bg-[#181a2a] rounded-lg overflow-hidden">
            {playlistData.songs.length > 0 ? (
              <div className="w-full">
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-gray-800 text-gray-400 text-sm font-medium">
                  <div className="col-span-1 text-center">#</div>
                  <div className="col-span-6">TITLE</div>
                  <div className="col-span-4">ALBUM</div>
                  <div className="col-span-1 text-right">DURATION</div>
                </div>
                
                {/* Song Rows */}
                <div className="divide-y divide-gray-800">
                  {playlistData.songs.map((song, index) => {
                    // Find artist and album from loaded data
                    let artist, album;
                    
                    if (song.artist) {
                      if (typeof song.artist === 'string') {
                        // Artist is ID, find in allArtists
                        artist = allArtists.find(a => (a._id || a.id) === song.artist);
                      } else {
                        // Artist is populated object
                        artist = song.artist;
                      }
                    } else if (song.artistId) {
                      // Local data format
                      artist = allArtists.find(a => (a._id || a.id) === song.artistId);
                    }
                    
                    if (song.album) {
                      if (typeof song.album === 'string') {
                        // Album is ID, find in allAlbums
                        album = allAlbums.find(a => (a._id || a.id) === song.album);
                      } else {
                        // Album is populated object
                        album = song.album;
                      }
                    } else if (song.albumId) {
                      // Local data format
                      album = allAlbums.find(a => (a._id || a.id) === song.albumId);
                    }
                    
                    return (
                      <div 
                        key={song._id || song.id} 
                        className="grid grid-cols-12 gap-4 items-center px-6 py-3 hover:bg-[#2d2240] group"
                      >
                        <div className="col-span-1 text-center text-gray-400 group-hover:text-white">
                          {index + 1}
                        </div>
                        <div className="col-span-6 flex items-center gap-4">
                          <img 
                            src={song.cover} 
                            alt={song.title} 
                            className="w-10 h-10 rounded object-cover"
                          />
                          <div className="min-w-0">
                            <div className="font-medium truncate">{song.title}</div>
                            <div className="text-sm text-gray-400 truncate">
                              {artist ? artist.name : 'Unknown Artist'}
                            </div>
                          </div>
                        </div>
                        <div className="col-span-4 text-gray-400 text-sm truncate">
                          {album ? album.name : 'Unknown Album'}
                        </div>
                        <div className="col-span-1 flex justify-between items-center">
                          <span className="text-gray-400 text-sm">
                            {formatDuration(song.duration || 180)}
                          </span>
                          <button
                            onClick={() => handleRemoveSong(song)}
                            className="text-gray-400 hover:text-red-400 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Remove from playlist"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="text-center py-16 text-gray-400">
                <p>No songs added yet. Search above to add songs to your playlist.</p>
              </div>
            )}
          </div>

        {/* Search Section */}
        <div className="mb-8 mt-8">
          <div className="relative mb-6">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full bg-[#2d2240] border border-gray-600 rounded-full px-12 py-3 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="Search for songs to add to your playlist..."
            />
            <svg
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          
          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="bg-[#181a2a] rounded-lg p-4 mb-8">
              <h3 className="text-lg font-semibold mb-4">Add to playlist</h3>
              <div className="space-y-2">
                {searchResults.map((song) => {
                  // Find artist from loaded data
                  let artist;
                  if (song.artist) {
                    if (typeof song.artist === 'string') {
                      artist = allArtists.find(a => (a._id || a.id) === song.artist);
                    } else {
                      artist = song.artist;
                    }
                  } else if (song.artistId) {
                    artist = allArtists.find(a => (a._id || a.id) === song.artistId);
                  }
                  
                  const songId = song._id || song.id;
                  const isAlreadyAdded = playlistData.songs.some(s => (s._id || s.id) === songId);
                  
                  return (
                    <div key={songId} className="flex items-center justify-between p-3 hover:bg-[#2d2240] rounded-lg">
                      <div className="flex items-center gap-4 flex-1">
                        <img 
                          src={song.cover} 
                          alt={song.title} 
                          className="w-12 h-12 rounded object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium truncate">{song.title}</h4>
                          <p className="text-sm text-gray-400 truncate">
                            {artist ? artist.name : 'Unknown Artist'}
                          </p>
                        </div>
                      </div>
                      <div className="text-sm text-gray-400 w-16 text-right">
                        {formatDuration(song.duration || 180)}
                      </div>
                      {isAlreadyAdded ? (
                        <button
                          onClick={() => handleRemoveSong(song)}
                          className="ml-4 px-4 py-1.5 bg-green-600/20 border border-green-500 hover:border-red-500 hover:bg-red-600/20 hover:text-red-400 text-green-400 text-sm rounded-full flex items-center gap-2 transition-colors"
                          title="Remove from playlist"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Added
                        </button>
                      ) : (
                        <button
                          onClick={() => handleAddSong(song)}
                          className="ml-4 px-4 py-1.5 bg-transparent border border-gray-600 hover:border-pink-500 hover:text-pink-500 text-white text-sm rounded-full transition-colors"
                        >
                          Add
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          
          
        </div>
      </div>
      
    </div>
  );
};

export default CreatePlaylist;
