// src/components/NewReleaseSongs.jsx
import React from 'react';
import SongCard from './SongCard';
import { newReleaseSongsIds, findSongById } from '../utils/dataProcessor';

const NewReleaseSongs = () => {
  const newSongs = newReleaseSongsIds.map(id => findSongById(id)).filter(Boolean);
  const [showAll, setShowAll] = React.useState(false);

  if (!newSongs || newSongs.length === 0) {
    return null;
  }

  return (
    <section className="mb-8">
      <h2 className="text-2xl font-bold mb-3">
        New <span className="text-pink-400">Release Songs</span>
      </h2>
      <div className="flex flex-wrap gap-2">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 flex-grow">
          {newSongs.map((song, index) => (
            <div
              key={song.id}
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