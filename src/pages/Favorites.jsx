import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlay, FaTrash } from 'react-icons/fa';
import data from '../data';
import { useMusic } from '../context/MusicContext';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';
import { toggleFavorite } from '../services/favorites';

const Favorites = () => {
  const navigate = useNavigate();
  const { setPlaylistAndPlay } = useMusic();
  const { currentUser } = useAuth();
  const { favoriteSongs, isLoading, removeFromFavorites, refreshFavorites } = useFavorites();

  // Debug log (reduced spam)
  // console.log('Favorites page - favoriteSongs count:', favoriteSongs.length);

  // Let FavoritesContext handle loading automatically
  // No need to force refresh here

  const handleRemoveFromFavorites = async (song) => {
    try {
      const songId = song._id || song.id; // Support both API and local data
      
      if (currentUser) {
        // Remove from context immediately for instant UI update
        removeFromFavorites(songId);
        
        // Then remove from database (without triggering refresh)
        try {
          await toggleFavorite(songId);
          
          // Dispatch event to update heart icons in other components, but skip refresh
          window.dispatchEvent(new CustomEvent('refreshFavorites', { 
            detail: { skipRefresh: true } 
          }));
        } catch (apiError) {
          console.error('Failed to remove from database:', apiError);
        }
      } else {
        // For non-logged users, just remove from context
        removeFromFavorites(songId);
      }
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  const handlePlaySong = (songToPlay) => {
    // Find the index of the clicked song in the favorites list
    const startIndex = favoriteSongs.findIndex(song => 
      (song._id || song.id) === (songToPlay._id || songToPlay.id)
    );
    
    if (startIndex !== -1) {
      setPlaylistAndPlay(favoriteSongs, startIndex);
    }
  };

  return (
    <div className="p-6 ml-[16rem]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Your Favorite Songs</h2>
        <button 
          onClick={() => navigate('/discover')}
          className="px-4 py-2 bg-pink-600 hover:bg-pink-700 rounded-lg transition-colors text-white"
        >
          Discover Songs
        </button>
      </div>
      
      {isLoading ? (
        <div className="flex items-center justify-center mt-16">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
        </div>
      ) : favoriteSongs.length === 0 ? (
        <div className="text-center mt-16">
          <p className="text-gray-400 mb-6">You haven't added any songs to your favorites yet.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {favoriteSongs.map((song, index) => (
            <div 
              key={song._id || song.id}
              className="flex items-center p-3 bg-[#2a2139] rounded-lg hover:bg-[#342a42] transition-colors"
            >
              <span className="text-gray-400 w-8 text-center">{index + 1}</span>
              
              <div className="flex items-center flex-1">
                <img 
                  src={song.cover} 
                  alt={song.title} 
                  className="w-12 h-12 object-cover rounded mr-4"
                />
                <div className="flex-1">
                  <h3 className="font-medium text-white">{song.title}</h3>
                  <p className="text-sm text-gray-400">
                    {song.artist ? 
                      (song.artist.name || song.artist) : 
                      (data.artists.find(a => a.id === song.artistId)?.name || 'Unknown Artist')
                    }
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => handlePlaySong(song)}
                  className="text-gray-300 hover:text-white p-2"
                  title="Play"
                >
                  <FaPlay />
                </button>
                
                <button 
                  onClick={() => handleRemoveFromFavorites(song)}
                  className="text-pink-500 hover:text-pink-400 p-2"
                  title="Remove from favorites"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;