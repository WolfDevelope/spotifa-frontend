import React, { useState } from 'react';
import VideoPlayer from './VideoPlayer';

const VideoCard = ({ video }) => {
  const [showPlayer, setShowPlayer] = useState(false);

  if (!video) return null;

  return (
    <>
      <div 
        className="bg-[#232026] rounded-xl overflow-hidden w-80 search-item cursor-pointer hover:scale-105 transition-transform"
        onClick={() => setShowPlayer(true)}
      >
        <div className="h-44 w-full bg-gray-700 flex items-center justify-center relative">
          <img
            src={video.cover}
            alt={video.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
            <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"/>
              </svg>
            </div>
          </div>
        </div>
        <div className="p-4">
          <div className="text-xl font-semibold text-white mb-1">{video.title}</div>
          <div className="flex justify-between items-center text-sm text-gray-300">
            <span>{video.artist ? video.artist.name : video.artist}</span>
            <span>{video.views || '0'} views</span>
          </div>
        </div>
      </div>

      {showPlayer && (
        <VideoPlayer
          video={video}
          onClose={() => setShowPlayer(false)}
        />
      )}
    </>
  );
};

export default VideoCard;
