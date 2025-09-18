import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlaylist } from '../context/PlaylistContext';

const YourPlaylists = () => {
  const navigate = useNavigate();
  const { userPlaylists, deletePlaylist } = usePlaylist();

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  const handlePlaylistClick = (playlistId) => {
    navigate(`/playlist/${playlistId}`);
  };

  const handleDeletePlaylist = (e, playlistId) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this playlist?')) {
      deletePlaylist(playlistId);
    }
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

        {userPlaylists.length === 0 ? (
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
            {userPlaylists.map((playlist) => (
              <div
                key={playlist.id}
                onClick={() => handlePlaylistClick(playlist.id)}
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
                    <button className="w-12 h-12 bg-pink-600 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>
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
                      onClick={(e) => handleDeletePlaylist(e, playlist.id)}
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
    </div>
  );
};

export default YourPlaylists;
