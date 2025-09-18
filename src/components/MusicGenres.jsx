import React from 'react';
import data from '../data';

const { musicGenres } = data;

const MusicGenres = () => (
  <section id="musicGenresSection" className="mb-12 search-item">
    <h2 className="text-2xl font-bold mb-6">
      Music <span className="text-pink-400">Genres</span>
    </h2>
    
      <div className="flex items-center gap-6 search-item">
        {musicGenres.map((genre, idx) => (
          <div key={genre.name} className="relative shadow-lg group cursor-pointer search-item">
            <img src={genre.cover} alt={genre.name} />
            <div className="absolute bottom-4 left-4 text-3xl font-semibold text-white drop-shadow-lg font-handwriting">
              {genre.name}
            </div>
          </div>
        ))}
        {/* View All */}
        <div className="flex flex-col items-center justify-center ml-2 flex-shrink-0">
          <button className="cursor-pointer w-14 h-14 bg-[#232323] rounded-full flex items-center justify-center shadow-lg mb-2 hover:bg-pink-500 transition">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" fill="none"/>
              <path stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 8v8m-4-4h8"/>
            </svg>
          </button>
          <span className="text-white font-semibold text-base">View All</span>
        </div>
      </div>
    
  </section>
);

export default MusicGenres;