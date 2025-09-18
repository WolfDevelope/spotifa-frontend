
import React from 'react';
import data from '../data';
import { findSongById } from '../utils/dataProcessor'; // or wherever your function is

import VideoCard from './VideoCard';

const { musicVideos } = data;

const MusicVideo = () => {
  // Map IDs to full song objects
  const videos = musicVideos.map(id => findSongById(id)).filter(Boolean);

  // ...your showAll logic
  const [showAll, setShowAll] = React.useState(false);
  const videosToShow = showAll ? videos : videos.slice(0, 3);

  return (
    <section className="mb-8" id="musicVideoList">
      <h2 className="text-2xl font-bold mb-3">
        Music <span className="text-pink-400">Video</span>
      </h2>
      <div className="flex flex-wrap gap-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
          {videosToShow.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
        {/* ...View All Button... */}
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

export default MusicVideo;