import React, { useState } from 'react';
import data from '../data';
import { findArtistById } from '../utils/dataProcessor';
import ArtistsCard from './ArtistsCard';

const { emergingPopArtists } = data;

const EmergingPopArtists = () => {
  const [showAll, setShowAll] = useState(false);

  // Lấy danh sách artist object từ ID
  const artists = emergingPopArtists.map(id => findArtistById(id)).filter(Boolean);
  const artistsToShow = showAll ? artists : artists.slice(0, 5);

  if (!artists.length) return null;

  return (
    <section className="mb-8" id="emergingPopArtistsList">
      <h2 className="text-2xl font-bold mb-3">
        Emerging <span className="text-pink-400">Pop Artists</span>
      </h2>
      <div className="flex flex-wrap gap-2">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 flex-grow">
          {artistsToShow.map(artist => (
            <ArtistsCard key={artist.id} artist={artist} />
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