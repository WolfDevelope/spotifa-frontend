import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import musicService from '../services/musicService';
import data from '../data'; // Import fallback data

const MoodPlaylists = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [moodPlaylists, setMoodPlaylists] = useState(data.moodPlaylists); // Set initial state with fallback data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAll, setShowAll] = useState(false);

  const handlePlaylistClick = (playlist) => {
    // Tạm thời vô hiệu hóa navigation - chưa có playlist thật sự
    // TODO: Implement actual playlist functionality
    console.log('Playlist clicked:', playlist.name || playlist.title);
    // Không làm gì cả - no action when clicked
  };

  // Fetch mood playlists from API
  useEffect(() => {
    const fetchMoodPlaylists = async () => {
      try {
        setLoading(true);
        const response = await musicService.getMoodPlaylists();
        if (response.success) {
          // Nếu API trả về dữ liệu, sử dụng nó. Nếu không, giữ fallback data
          if (response.data && response.data.length > 0) {
            setMoodPlaylists(response.data);
          }
          // Nếu API trả về empty array, giữ nguyên fallback data từ data.js
        } else {
          setError('Failed to load mood playlists');
        }
      } catch (err) {
        setError('Failed to load mood playlists');
        console.error('Error fetching mood playlists:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMoodPlaylists();
  }, []);

  if (loading) {
    return (
      <section className="mb-8" id="moodPlaylistsList">
        <h2 className="text-2xl font-bold mb-3">
          <span className="">Mood</span> <span className="text-pink-400">Playlists</span>
        </h2>
        <div className="flex flex-wrap gap-2">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 flex-grow">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="bg-[#2d2240] rounded-lg p-3 w-40 flex flex-col items-center search-item animate-pulse">
                <div className="w-full h-32 bg-gray-600 rounded mb-2"></div>
                <div className="h-4 bg-gray-600 rounded w-3/4 mb-1"></div>
                <div className="h-3 bg-gray-600 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mb-8" id="moodPlaylistsList">
        <h2 className="text-2xl font-bold mb-3">
          <span className="">Mood</span> <span className="text-pink-400">Playlists</span>
        </h2>
        <div className="text-center py-8">
          <p className="text-red-400 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg transition"
          >
            Retry
          </button>
        </div>
      </section>
    );
  }

  // Chọn mảng video cần render
  const playlistsToShow = showAll ? moodPlaylists : moodPlaylists.slice(0, 5);

  return (
    <section className="mb-8" id="moodPlaylistsList">
    <h2 className="text-2xl font-bold mb-3">
      <span className="">Mood</span> <span className="text-pink-400">Playlists</span>
    </h2>
    <div className="flex flex-wrap gap-2">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 flex-grow">
      {playlistsToShow.map((playlist, idx) => (
        
          <div 
            key={playlist._id || playlist.id} 
            className="bg-[#2d2240] rounded-lg p-3 w-40 flex flex-col items-center search-item hover:bg-[#3a2d52] transition-colors cursor-pointer"
            onClick={() => handlePlaylistClick(playlist)}
          >
            <img src={playlist.cover} alt={playlist.name} className="rounded-lg mb-2" />
            <span className="text-white text-base font-semibold hover:text-pink-400 transition-colors">{playlist.name}</span>
            <span className="text-xs text-gray-300 mt-1 text-center">{playlist.description}</span>
          </div>
        
      ))}
      </div>
      {/* View All Button */}
      <div className="flex flex-col items-center justify-center flex-shrink-0">
          <button
            className="cursor-pointer w-14 h-14 bg-[#232323] rounded-full flex items-center justify-center shadow-lg mb-2 hover:bg-pink-500 transition"
            onClick={() => setShowAll((prev) => !prev)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" fill="none"/>
              <path stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 8v8m-4-4h8"/>
            </svg>
          </button>
          <span className="text-white font-semibold text-base">
            {showAll ? 'Collapse' : 'View All'}
          </span>
        </div>
    </div>
    
  </section>
);
};

export default MoodPlaylists;
