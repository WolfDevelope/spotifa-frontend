import React, { useState } from 'react';
import '../assets/styles/main.css';
import data from '../data';

const { moodPlaylists } = data;

const MoodPlaylists = () => {
  const [showAll, setShowAll] = useState(false);

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
        
          <div className="bg-[#2d2240] rounded-lg p-3 w-40 flex flex-col items-center search-item">
            <img src={playlist.cover} alt={playlist.name} />
            <span className="text-white text-base font-semibold">{playlist.name}</span>
            <span className="text-xs text-gray-300 mt-1">{playlist.description}</span>
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