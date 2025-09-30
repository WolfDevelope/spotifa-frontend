// src/components/NewReleaseSongs_API.jsx
import React, { useState, useEffect } from 'react';
import SongCard from './SongCard_API';
import musicService from '../services/musicService';

const NewReleaseSongs = () => {
  const [newSongs, setNewSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAll, setShowAll] = useState(false);

  // Fetch new release songs from API
  useEffect(() => {
    const fetchNewReleases = async () => {
      try {
        setLoading(true);
        const response = await musicService.getNewReleases();
        if (response.success) {
          setNewSongs(response.data);
        } else {
          setError('Failed to load new release songs');
        }
      } catch (err) {
        setError('Failed to load new release songs');
        console.error('Error fetching new release songs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNewReleases();
  }, []);

  if (loading) {
    return (
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-3">
          New <span className="text-pink-400">Release Songs</span>
        </h2>
        <div className="flex flex-wrap gap-2">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 flex-grow">
            {[...Array(5)].map((_, index) => (
              <div
                key={index}
                className="w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 xl:w-1/6 px-2 mb-4"
              >
                <div className="bg-gray-600 rounded-lg animate-pulse">
                  <div className="w-full h-32 bg-gray-700 rounded-lg mb-2"></div>
                  <div className="h-4 bg-gray-700 rounded mb-1"></div>
                  <div className="h-3 bg-gray-700 rounded w-3/4"></div>
                </div>
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
          New <span className="text-pink-400">Release Songs</span>
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

  if (!newSongs || newSongs.length === 0) {
    return null;
  }

  // Chỉ hiển thị 5 bài đầu tiên, nếu showAll = true thì hiển thị tất cả
  const songsToShow = showAll ? newSongs : newSongs.slice(0, 5);

  return (
    <section className="mb-8">
      <h2 className="text-2xl font-bold mb-3">
        New <span className="text-pink-400">Release Songs</span>
      </h2>
      <div className="flex flex-wrap gap-2">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 flex-grow">
          {songsToShow.map((song, index) => (
            <div
              key={song._id}
              className="w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 xl:w-1/6 px-2 mb-4"
            >
              <SongCard song={song} index={index} /> 
            </div>
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

export default NewReleaseSongs;
