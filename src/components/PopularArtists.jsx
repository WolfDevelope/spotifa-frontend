// src/components/PopularArtists.jsx
import React from 'react';
import ArtistCard from './ArtistsCard'; // Import ArtistCard
import { popularArtistsIds, findArtistById } from '../utils/dataProcessor';

const PopularArtists = () => {
  const [showAll, setShowAll] = React.useState(false);
  const artists = popularArtistsIds.map(id => findArtistById(id)).filter(Boolean);

  if (!artists || artists.length === 0) {
    return null;
  }

  return (
    <section className="mb-8">
      <h2 className="text-2xl font-bold mb-3">
        Popular <span className="text-pink-400">Artists</span>
      </h2>
      <div className="flex flex-wrap gap-2">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 flex-grow">
        {artists.map((artist, index) => (
          <ArtistCard artist={artist} key={artist.id} index={index} />
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