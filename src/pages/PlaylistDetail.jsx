import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { usePlaylist } from '../context/PlaylistContext';
import { useMusic } from '../context/MusicContext';
import PLAYLIST_API from '../services/playlist';
import { enrichPlaylistWithSongs } from '../utils/playlistUtils';
import DeletePlaylistModal from '../components/DeletePlaylistModal';
import data from '../data';
import { toast } from 'react-toastify';

const PlaylistDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { playlists, isInitialized, removePlaylist } = usePlaylist();
  const { setPlaylistAndPlay, currentPlaylist, currentTrackIndex, isPlaying: musicIsPlaying, setIsPlaying } = useMusic();
  const [playlist, setPlaylist] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const isDeleting = useRef(false);
  
  // Check if this playlist is currently playing
  const isCurrentPlaylistPlaying = playlist && currentPlaylist.length > 0 && 
    currentPlaylist[0]?.playlistId === playlist._id && musicIsPlaying;
  
  // Check if we need to force refresh from location state
  const shouldForceRefresh = location.state?.forceRefresh;

  useEffect(() => {
    let isMounted = true;

    const loadPlaylistDetail = async () => {
      // Skip loading if we're in the process of deleting
      if (isDeleting.current) {
        return;
      }

      try {
        // If force refresh is requested, skip cache and fetch from API
        if (shouldForceRefresh) {
          const response = await PLAYLIST_API.getPlaylistById(id);
          const enrichedPlaylist = await enrichPlaylistWithSongs(response);
          if (isMounted) setPlaylist(enrichedPlaylist);
          // Clear the force refresh state
          navigate(location.pathname, { replace: true, state: {} });
          return;
        }

        // Always try to find in cached playlists first
        const cachedPlaylist = playlists.find(p => p._id === id);
        if (cachedPlaylist && cachedPlaylist.songs) {
          if (isMounted) setPlaylist(cachedPlaylist);
          return;
        }

        // If playlists are initialized but playlist not found, it was likely deleted
        if (isInitialized && playlists.length > 0 && !cachedPlaylist) {
          console.log('Playlist not found in initialized cache, redirecting...');
          if (isMounted) navigate('/your-playlists', { replace: true });
          return;
        }

        // Fetch from API if not in cache or cache doesn't have full data
        const response = await PLAYLIST_API.getPlaylistById(id);
        const enrichedPlaylist = await enrichPlaylistWithSongs(response);
        if (isMounted) setPlaylist(enrichedPlaylist);
      } catch (error) {
        if (!isMounted || isDeleting.current) return;
        
        console.error('Error loading playlist:', error);
        if (error.message === 'Playlist not found') {
          // Don't show toast for deleted playlists, just redirect silently
          console.log('Playlist was deleted, redirecting silently...');
        } else {
          toast.error('Failed to load playlist');
        }
        navigate('/your-playlists', { replace: true });
      }
    };

    if (id) {
      loadPlaylistDetail();
    }

    return () => {
      isMounted = false;
    };
  }, [id, playlists, isInitialized, navigate, shouldForceRefresh, location.pathname]);

  const handlePlayClick = () => {
    if (!playlist || !playlist.songs || playlist.songs.length === 0) {
      toast.error('No songs in this playlist to play');
      return;
    }

    if (isCurrentPlaylistPlaying) {
      // If this playlist is currently playing, pause it
      setIsPlaying(false);
    } else {
      // Play this playlist from the beginning
      const playlistSongs = playlist.songs.map(song => ({
        ...song,
        playlistId: playlist._id,
        playlistName: playlist.name
      }));
      setPlaylistAndPlay(playlistSongs, 0);
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      isDeleting.current = true; // Mark as deleting to prevent further API calls
      setShowDeleteModal(false);
      await PLAYLIST_API.deletePlaylist(id);
      removePlaylist(id);
      toast.success('Playlist deleted successfully');
      // Navigate immediately and prevent further loading
      navigate('/your-playlists', { replace: true });
    } catch (error) {
      isDeleting.current = false; // Reset on error
      console.error('Error deleting playlist:', error);
      toast.error('Failed to delete playlist');
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
  };

  const handleSongClick = (songIndex) => {
    if (!playlist || !playlist.songs || playlist.songs.length === 0) {
      return;
    }

    const playlistSongs = playlist.songs.map(song => ({
      ...song,
      playlistId: playlist._id,
      playlistName: playlist.name
    }));
    
    setPlaylistAndPlay(playlistSongs, songIndex);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (!playlist) {
    return (
      <div className="min-h-screen bg-[#0f0f1a] text-white p-6 ml-64 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p>Loading playlist...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1e1e2a] to-[#0f0f1a] text-white p-6 ml-64">
      <div className="max-w-6xl mx-auto">
        {/* Playlist Header */}
        <div className="flex items-end gap-6 mb-8">
          <div className="w-56 h-56 bg-gradient-to-br from-pink-600 to-purple-700 shadow-2xl rounded-lg overflow-hidden flex-shrink-0">
            {playlist.songs.length > 0 ? (
              <div className="grid grid-cols-2 grid-rows-2 w-full h-full">
                {Array.from({ length: 4 }).map((_, index) => {
                  const song = playlist.songs[index];
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
                <span className="text-gray-500">No songs</span>
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <div className="text-sm font-semibold text-pink-400 mb-2">PLAYLIST</div>
            <h1 className="text-5xl font-bold mb-4">{playlist.name}</h1>
            
            {playlist.description && (
              <p className="text-gray-300 mb-4">{playlist.description}</p>
            )}
            
            <div className="flex items-center text-sm text-gray-400">
              <span className="font-medium text-white">
                {playlist.songs.length} {playlist.songs.length === 1 ? 'song' : 'songs'}
              </span>
              <span className="mx-2">•</span>
              <span>Created on {formatDate(playlist.createdAt)}</span>
            </div>
            
            <div className="flex gap-4 mt-6">
              <button
                onClick={handlePlayClick}
                className="px-8 py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-full font-medium flex items-center gap-2"
              >
                {isCurrentPlaylistPlaying ? (
                  <>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    Pause
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                    Play
                  </>
                )}
              </button>
              
              <button
                onClick={() => navigate(`/create-playlist?edit=${playlist._id}`)}
                className="px-6 py-3 bg-transparent border border-gray-600 hover:border-gray-400 text-white rounded-full font-medium"
              >
                Edit
              </button>
              
              <button
                onClick={handleDeleteClick}
                className="p-3 text-gray-400 hover:text-red-400 transition-colors"
                title="Delete playlist"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        {/* Songs List */}
        <div className="mt-8">
          <div className="grid grid-cols-12 gap-4 px-4 py-2 text-gray-400 text-sm font-medium border-b border-gray-800">
            <div className="col-span-1">#</div>
            <div className="col-span-5">TITLE</div>
            <div className="col-span-4">ARTIST</div>
            <div className="col-span-2 text-right">DURATION</div>
          </div>
          
          {playlist.songs.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p>No songs in this playlist yet.</p>
              <button
                onClick={() => navigate('/create-playlist')}
                className="mt-4 px-6 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-full text-sm font-medium"
              >
                Add Songs
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-800">
              {playlist.songs.map((song, index) => {
                // Use artistName from enriched song data, or fallback to finding artist
                let artistName = 'Unknown Artist';
                
                if (song.artistName) {
                  // Use pre-enriched artist name from playlistUtils
                  artistName = song.artistName;
                } else if (song.artist) {
                  // Handle different artist formats
                  if (typeof song.artist === 'string') {
                    // Artist is ID, try to find in data
                    const artist = data.artists.find(a => (a._id || a.id) === song.artist);
                    artistName = artist?.name || 'Unknown Artist';
                  } else if (song.artist.name) {
                    // Artist is populated object
                    artistName = song.artist.name;
                  }
                } else if (song.artistId) {
                  // Local data format
                  const artist = data.artists.find(a => (a._id || a.id) === song.artistId);
                  artistName = artist?.name || 'Unknown Artist';
                }
                
                const isCurrentSong = currentPlaylist.length > 0 && 
                  currentPlaylist[0]?.playlistId === playlist._id && 
                  currentTrackIndex === index && musicIsPlaying;
                
                return (
                  <div 
                    key={song._id || song.id} 
                    className={`grid grid-cols-12 gap-4 items-center p-3 hover:bg-[#2d2240] rounded-lg group cursor-pointer ${
                      isCurrentSong ? 'bg-[#2d2240]' : ''
                    }`}
                    onClick={() => handleSongClick(index)}
                  >
                    <div className="col-span-1 text-gray-400 text-center group-hover:text-white">
                      {isCurrentSong ? (
                        <div className="flex items-center justify-center">
                          <svg className="w-4 h-4 text-pink-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM15.657 6.343a1 1 0 011.414 0A9.972 9.972 0 0119 12a9.972 9.972 0 01-1.929 5.657 1 1 0 11-1.414-1.414A7.971 7.971 0 0017 12a7.971 7.971 0 00-1.343-4.243 1 1 0 010-1.414z" clipRule="evenodd" />
                            <path fillRule="evenodd" d="M13.828 8.172a1 1 0 011.414 0A5.983 5.983 0 0117 12a5.983 5.983 0 01-1.758 3.828 1 1 0 11-1.414-1.414A3.987 3.987 0 0015 12a3.987 3.987 0 00-1.172-2.828 1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </div>
                      ) : (
                        index + 1
                      )}
                    </div>
                    <div className="col-span-5 flex items-center gap-4">
                      <img 
                        src={song.cover} 
                        alt={song.title} 
                        className="w-10 h-10 rounded object-cover"
                      />
                      <div>
                        <div className={`font-medium group-hover:text-pink-400 ${
                          isCurrentSong ? 'text-pink-500' : ''
                        }`}>
                          {song.title}
                        </div>
                      </div>
                    </div>
                    <div className="col-span-4 text-gray-400 group-hover:text-white">
                      {artistName}
                    </div>
                    <div className="col-span-2 text-right text-gray-400 text-sm">
                      {song.duration || '3:45'}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeletePlaylistModal
        isOpen={showDeleteModal}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        playlistName={playlist?.name || ''}
      />
    </div>
  );
};

export default PlaylistDetail;
