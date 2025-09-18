// src/components/WeeklyTopSongs.jsx
import React from 'react';
import SongCard from './SongCard'; // Import SongCard
import { getWeeklyTopSongs } from '../utils/dataProcessor'; // Hàm đã được tạo trong dataProcessor

const WeeklyTopSongs = () => {
  const weeklySongs = getWeeklyTopSongs();
  const [showAll, setShowAll] = React.useState(false);

  if (!weeklySongs || weeklySongs.length === 0) {
    return null; // Không hiển thị phần này nếu không có dữ liệu
  }

  return (
    <section className="mb-8">
      <h2 className="text-2xl font-bold mb-3">
        Weekly <span className="text-pink-400">Top Songs</span>
      </h2>
      <div className="flex flex-wrap gap-2">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 flex-grow">
        {" "}
        {/* Sử dụng flexbox cho responsive */}
        {weeklySongs.map((song, index) => (
          <div
            key={song.id}
            className="w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 xl:w-1/6 px-2 mb-4"
          >
            {" "}
            {/* Responsive column layout */}
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

export default WeeklyTopSongs;