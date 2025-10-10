import React, { useState, useEffect } from 'react';
import AlbumCard from './AlbumCard_API';
import musicService from '../services/musicService';

const PopularAlbums = () => {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAll, setShowAll] = useState(false);

  // Fetch popular albums from API
  useEffect(() => {
    const fetchPopularAlbums = async () => {
      try {
        setLoading(true);
        // Sử dụng getAllAlbums để lấy popular albums (có thể sort theo plays hoặc ratings)
        const response = await musicService.getAllAlbums();
        if (response.success) {
          // Lấy random từ toàn bộ albums, chỉ hiển thị 10 albums
          const shuffledAlbums = response.data.sort(() => Math.random() - 0.5);
          const popularAlbums = shuffledAlbums.slice(0, 10);
          setAlbums(popularAlbums);
        } else {
          setError('Failed to load popular albums');
        }
      } catch (err) {
        setError('Failed to load popular albums');
        console.error('Error fetching popular albums:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularAlbums();
  }, []);

  if (loading) {
    return (
      <section className="mb-8" id="popularAlbumsList">
        <h2 className="text-2xl font-bold mb-3">
          Popular <span className="text-pink-400">Albums</span>
        </h2>
        <div className="flex flex-wrap gap-2">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 flex-grow">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="bg-gray-600 rounded-lg animate-pulse">
                <div className="w-40 h-60 bg-gray-700 rounded-lg mb-2"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mb-8" id="popularAlbumsList">
        <h2 className="text-2xl font-bold mb-3">
          Popular <span className="text-pink-400">Albums</span>
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

  // Lấy danh sách album để hiển thị
  const albumsToShow = showAll ? albums : albums.slice(0, 5);

  if (!albums.length) return null;

  return (
    <section className="mb-8" id="popularAlbumsList">
      <h2 className="text-2xl font-bold mb-3">
        Popular <span className="text-pink-400">Albums</span>
      </h2>
      <div className="flex flex-wrap gap-2">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 flex-grow">
          {albumsToShow.map(album => (
            <AlbumCard key={album._id} album={album} />
          ))}
        </div>
        {/* View All Button */}
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
              <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" fill="none" />
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
            {showAll ? 'Collapse' : 'View All'}
          </span>
        </div>
      </div>
    </section>
  );
};

export default PopularAlbums;
