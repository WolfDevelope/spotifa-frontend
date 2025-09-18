import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlaylist } from '../context/PlaylistContext';
import { useAuth } from '../context/AuthContext';
import PLAYLIST_API from '../services/playlist';
import DeletePlaylistModal from '../components/DeletePlaylistModal';
import { toast } from 'react-toastify';

const YourPlaylists = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { playlists, isLoading, removePlaylist } = usePlaylist();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [playlistToDelete, setPlaylistToDelete] = useState(null);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  const handlePlaylistClick = (playlistId) => {
    navigate(`/playlist/${playlistId}`);
  };

  const handleDeleteClick = (e, playlist) => {
    e.stopPropagation();
    setPlaylistToDelete(playlist);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!playlistToDelete) return;
    
    try {
      await PLAYLIST_API.deletePlaylist(playlistToDelete._id);
      removePlaylist(playlistToDelete._id);
      toast.success('Playlist deleted successfully');
      setShowDeleteModal(false);
      setPlaylistToDelete(null);
    } catch (error) {
      console.error('Error deleting playlist:', error);
      toast.error('Failed to delete playlist');
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setPlaylistToDelete(null);
  };

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white p-6 ml-64">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Your Playlists</h1>
          <button
            onClick={() => navigate('/create-playlist')}
            className="px-6 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-full font-medium flex items-center gap-2"
          >
            <span>+</span> Create New Playlist
          </button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
          </div>
        ) : playlists.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 text-lg mb-4">You don't have any playlists yet</div>
            <button
              onClick={() => navigate('/create-playlist')}
              className="px-6 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-full font-medium"
            >
              Create your first playlist
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {playlists.map((playlist) => (
              <div
                key={playlist._id}
                onClick={() => handlePlaylistClick(playlist._id)}
                className="bg-[#181a2a] rounded-lg overflow-hidden cursor-pointer hover:bg-[#2d2240] transition-colors group relative"
              >
                <div className="relative">
                  <div className="w-full h-48 bg-gradient-to-br from-pink-600 to-purple-700">
                    {playlist.songs && playlist.songs.length > 0 ? (
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
                        <span className="text-gray-500 text-xs text-center p-2">No songs</span>
                      </div>
                    )}
                  </div>
                  <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6.3 2.841A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"/>
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg truncate">{playlist.name}</h3>
                  <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                    {playlist.description || 'No description'}
                  </p>
                  <div className="flex justify-between items-center mt-3 text-sm text-gray-400">
                    <span>{playlist.songs.length} songs</span>
                    <button
                      onClick={(e) => handleDeleteClick(e, playlist)}
                      className="text-gray-400 hover:text-red-400 p-1"
                      title="Delete playlist"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <DeletePlaylistModal
        isOpen={showDeleteModal}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        playlistName={playlistToDelete?.name || ''}
      />
    </div>
  );
};

export default YourPlaylists;
