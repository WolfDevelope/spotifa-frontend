import React, { useState, useEffect } from 'react';
import ArtistsCard from './ArtistsCard_API';
import musicService from '../services/musicService';

const EmergingPopArtists = () => {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAll, setShowAll] = useState(false);

  // Fetch emerging pop artists from API
  useEffect(() => {
    const fetchEmergingPopArtists = async () => {
      try {
        setLoading(true);
        // Sử dụng getAllArtists và lấy một phần để tạo "emerging pop" effect
        const response = await musicService.getAllArtists();
        if (response.success) {
          // Lấy artists từ vị trí 5-15 để tạo hiệu ứng "emerging"
          const emergingArtists = response.data.slice(5, 15);
          setArtists(emergingArtists);
        } else {
          setError('Failed to load emerging pop artists');
        }
      } catch (err) {
        setError('Failed to load emerging pop artists');
        console.error('Error fetching emerging pop artists:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmergingPopArtists();
  }, []);

  if (loading) {
    return (
      <section className="mb-8" id="emergingPopArtistsList">
        <h2 className="text-2xl font-bold mb-3">
          Emerging <span className="text-pink-400">Pop Artists</span>
        </h2>
        <div className="flex flex-wrap gap-2">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 flex-grow">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="text-center">
                <div className="w-32 h-32 bg-gray-600 rounded-full mx-auto mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-600 rounded mb-1 animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mb-8" id="emergingPopArtistsList">
        <h2 className="text-2xl font-bold mb-3">
          Emerging <span className="text-pink-400">Pop Artists</span>
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

  if (!artists.length) {
    return (
      <section className="mb-8" id="emergingPopArtistsList">
        <h2 className="text-2xl font-bold mb-3">
          Emerging <span className="text-pink-400">Pop Artists</span>
        </h2>
        <div className="text-center py-8">
          <p className="text-gray-400 mb-4">No emerging pop artists available</p>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-8" id="emergingPopArtistsList">
      <h2 className="text-2xl font-bold mb-3">
        Emerging <span className="text-pink-400">Pop Artists</span>
      </h2>
      <div className="flex flex-wrap gap-2">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 flex-grow">
          {artistsToShow.map(artist => (
            <ArtistsCard key={artist._id} artist={artist} />
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

export default EmergingPopArtists;
