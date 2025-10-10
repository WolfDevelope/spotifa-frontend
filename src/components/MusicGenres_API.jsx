import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import musicService from '../services/musicService';
import data from '../data'; // Import fallback data

const MusicGenres = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [musicGenres, setMusicGenres] = useState(data.musicGenres); // Set initial state with fallback data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAll, setShowAll] = useState(false);

  const handleGenreClick = (genre) => {
    // Tạm thời vô hiệu hóa navigation - chưa có genre functionality thật sự
    // TODO: Implement actual genre functionality
    console.log('Genre clicked:', genre.name || genre.title);
    // Không làm gì cả - no action when clicked
  };

  // Fetch music genres from API
  useEffect(() => {
    const fetchMusicGenres = async () => {
      try {
        setLoading(true);
        const response = await musicService.getGenrePlaylists();
        if (response.success) {
          // Nếu API trả về dữ liệu, sử dụng nó. Nếu không, giữ fallback data
          if (response.data && response.data.length > 0) {
            setMusicGenres(response.data);
          }
          // Nếu API trả về empty array, giữ nguyên fallback data từ data.js
        } else {
          setError('Failed to load music genres');
        }
      } catch (err) {
        setError('Failed to load music genres');
        console.error('Error fetching music genres:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMusicGenres();
  }, []);

  if (loading) {
    return (
      <section id="musicGenresSection" className="mb-12 search-item">
        <h2 className="text-2xl font-bold mb-6">
          Music <span className="text-pink-400">Genres</span>
        </h2>
        <div className="flex items-center gap-6 search-item">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="relative shadow-lg group cursor-pointer search-item animate-pulse">
              <div className="w-48 h-32 bg-gray-600 rounded"></div>
              <div className="absolute bottom-4 left-4 w-20 h-6 bg-gray-700 rounded"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="musicGenresSection" className="mb-12 search-item">
        <h2 className="text-2xl font-bold mb-6">
          Music <span className="text-pink-400">Genres</span>
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

  // Lấy danh sách genres để hiển thị
  const genresToShow = showAll ? musicGenres : musicGenres.slice(0, 5);

  return (
    <section id="musicGenresSection" className="mb-12 search-item">
      <h2 className="text-2xl font-bold mb-6">
        Music <span className="text-pink-400">Genres</span>
      </h2>
      
      <div className="flex items-center gap-6 search-item">
        {genresToShow.map((genre, idx) => (
          <div 
            key={genre._id || genre.id || genre.name} 
            className="relative shadow-lg group cursor-pointer search-item hover:scale-105 transition-transform"
            onClick={() => handleGenreClick(genre)}
          >
            <img src={genre.cover} alt={genre.name} />
            <div className="absolute bottom-4 left-4 text-3xl font-semibold text-white drop-shadow-lg font-handwriting hover:text-pink-400 transition-colors">
              {genre.name}
            </div>
          </div>
        ))}
        {/* View All */}
        <div className="flex flex-col items-center justify-center flex-shrink-0">
      <button
      className="cursor-pointer w-14 h-14 bg-[#232323] rounded-full flex items-center justify-center shadow-lg mb-2 hover:bg-pink-500 transition"
      onClick={() => setShowAll((prev) => !prev)}
      >
      <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-8 h-8 text-white"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      >
      <circle
      cx="12"
      cy="12"
      r="10"
      stroke="white"
      strokeWidth="2"
      fill="none"
      />
      <path
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 8v8m-4-4h8"
      />
      </svg>
      </button>
      <span className="text-white font-semibold text-base">
      {showAll ? "Collapse" : "View All"}
      </span>
      </div>
      </div>
      
    </section>
  );
};

export default MusicGenres;
