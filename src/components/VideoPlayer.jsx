import React, { useRef, useState, useEffect } from 'react';
import '../assets/styles/VideoPlayer.css';
import data from '../data';

const VideoPlayer = ({ video, onClose }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play().catch(e => console.error("Video play failed:", e));
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying]);

  if (!video) return null;

  return (
    <div className="fixed bg-gradient-to-b from-[#22172b] to-[#3d2a3f] inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl relative">
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-white hover:text-pink-400 transition-colors"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <video
          ref={videoRef}
          src={video.src}
          className="w-full aspect-video bg-gradient-to-b from-[#22172b] to-[#3d2a3f]"
          controls
          autoPlay
          onClick={() => setIsPlaying(!isPlaying)}
        />
        
        <div className="mt-4 text-white">
          <h2 className="text-2xl font-bold">{video.title}</h2>
          <p className="text-gray-300">{data.artists.find(artist => artist.id === video.artistId).name}</p>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;