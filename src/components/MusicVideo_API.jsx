import React, { useState, useEffect } from 'react';
import VideoCard from './VideoCard_API';
import musicService from '../services/musicService';

const MusicVideo = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAll, setShowAll] = useState(false);

  // Fetch music videos from API
  useEffect(() => {
    const fetchMusicVideos = async () => {
      try {
        setLoading(true);
        const response = await musicService.getMusicVideos();
        if (response.success) {
          setVideos(response.data);
        } else {
          setError('Failed to load music videos');
        }
      } catch (err) {
        setError('Failed to load music videos');
        console.error('Error fetching music videos:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMusicVideos();
  }, []);

  if (loading) {
    return (
      <section className="mb-8" id="musicVideoList">
        <h2 className="text-2xl font-bold mb-3">
          Music <span className="text-pink-400">Video</span>
        </h2>
        <div className="flex flex-wrap gap-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="bg-gray-600 rounded-lg animate-pulse">
                <div className="w-full h-48 bg-gray-700 rounded-lg mb-2"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-700 rounded mb-2"></div>
                  <div className="h-3 bg-gray-700 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mb-8" id="musicVideoList">
        <h2 className="text-2xl font-bold mb-3">
          Music <span className="text-pink-400">Video</span>
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

  const videosToShow = showAll ? videos : videos.slice(0, 3);

  return (
    <section className="mb-8" id="musicVideoList">
      <h2 className="text-2xl font-bold mb-3">
        Music <span className="text-pink-400">Video</span>
      </h2>
      <div className="flex flex-wrap gap-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
          {videosToShow.map((video) => (
            <VideoCard key={video._id} video={video} />
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
