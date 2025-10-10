// src/components/PopularArtists_API.jsx
import React, { useState, useEffect } from 'react';
import ArtistCard from './ArtistsCard_API'; // Import ArtistCard API version
import musicService from '../services/musicService';

const PopularArtists = () => {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAll, setShowAll] = useState(false);

  // Fetch popular artists from API
  useEffect(() => {
    const fetchPopularArtists = async () => {
      try {
        setLoading(true);
        const response = await musicService.getAllArtists();
        if (response.success) {
          // Lấy 10 artists đầu tiên và shuffle để tạo "popular" effect
          const popularArtists = response.data.slice(0, 10).sort(() => Math.random() - 0.5);
          setArtists(popularArtists);
        } else {
          setError('Failed to load popular artists');
        }
      } catch (err) {
        setError('Failed to load popular artists');
        console.error('Error fetching popular artists:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularArtists();
  }, []);

  if (loading) {
    return (
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-3">
          Popular <span className="text-pink-400">Artists</span>
        </h2>
        <div className="flex flex-wrap gap-2">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 flex-grow">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="text-center">
                <div className="w-24 h-24 bg-gray-600 rounded-full mx-auto mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-600 rounded mb-1 animate-pulse"></div>
                <div className="h-3 bg-gray-600 rounded w-3/4 mx-auto animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-3">
          Popular <span className="text-pink-400">Artists</span>
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

  // Lấy danh sách artist để hiển thị
  const artistsToShow = showAll ? artists : artists.slice(0, 5);

  if (!artists || artists.length === 0) {
    return (
      <section className="mb-8" id="popularArtistsList">
        <h2 className="text-2xl font-bold mb-3">
          Popular <span className="text-pink-400">Artists</span>
        </h2>
        <div className="text-center py-8">
          <p className="text-gray-400 mb-4">No popular artists available</p>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-8" id="popularArtistsList">
      <h2 className="text-2xl font-bold mb-3">
        Popular <span className="text-pink-400">Artists</span>
      </h2>
      <div className="flex flex-wrap gap-2">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 flex-grow">
          {artistsToShow.map((artist, index) => (
            <ArtistCard artist={artist} key={artist._id} index={index} />
          ))}
      </div>
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

export default PopularArtists;
