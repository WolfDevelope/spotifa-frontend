import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeartIcon from './HeartIcon';
import LoginModal from './LoginModal';
import { useMusic } from '../context/MusicContext';
import musicService from '../services/musicService';

const TrendingSongsTable = () => {
  const navigate = useNavigate();
  const { setPlaylistAndPlay } = useMusic();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  // Fetch trending songs from API
  useEffect(() => {
    const fetchTrendingSongs = async () => {
      try {
        setLoading(true);
        const response = await musicService.getTrendingSongs();
        if (response.success) {
          setSongs(response.data);
        } else {
          setError('Failed to load trending songs');
        }
      } catch (err) {
        setError('Failed to load trending songs');
        console.error('Error fetching trending songs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingSongs();
  }, []);

  const handlePlay = async (e, song) => {
    e.stopPropagation();
    
    const startIndex = songs.findIndex(item => item._id === song._id);

    if (!currentUser && startIndex >= 3) {
      setShowLoginModal(true);
      return;
    }
    
    // If user is not logged in, play only the selected song
    const songsToPlay = !currentUser ? [song] : songs;
    const playIndex = !currentUser ? 0 : startIndex;

    // Increment play count
    try {
      await musicService.incrementPlayCount(song._id);
    } catch (err) {
      console.error('Failed to increment play count:', err);
    }

    setPlaylistAndPlay(songsToPlay, playIndex);
  };

  const handleRowClick = (song) => {
    if (currentUser) {
      navigate(`/song/${song._id}`);
    } else {
      setShowLoginModal(true);
    }
  };

  const handleArtistClick = (e, artist) => {
    e.stopPropagation();
    navigate(`/artist/${artist._id}`);
  };

  const handleAlbumClick = (e, album) => {
    e.stopPropagation();
    if (album) {
      navigate(`/album/${album._id}`);
    }
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    if (!currentUser) {
      setShowLoginModal(true);
    }
    // The HeartIcon component will handle the rest
  };

  if (loading) {
    return (
      <div>
        <section className="mb-8" id="trendingSongsList">
          <h2 className="text-2xl font-bold mb-3">
            Trending Now
          </h2>
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-400 border-b border-[#333]">
                <th className="py-2 px-4">#</th>
                <th className="py-2 px-4"></th>
                <th className="py-2 px-4">Title</th>
                <th className="py-2 px-4">Artist</th>
                <th className="py-2 px-4">Album</th>
                <th className="py-2 px-4">Year</th>
              </tr>
            </thead>
            <tbody>
              {[...Array(7)].map((_, index) => (
                <tr key={index} className="border-t border-[#333] text-gray-200">
                  <td className="py-2 px-4">{index + 1}</td>
                  <td className="py-2 px-4">
                    <div className="w-10 h-10 bg-gray-600 rounded animate-pulse"></div>
                  </td>
                  <td className="py-2 px-4">
                    <div className="h-4 bg-gray-600 rounded w-3/4 animate-pulse"></div>
                  </td>
                  <td className="py-2 px-4">
                    <div className="h-4 bg-gray-600 rounded w-1/2 animate-pulse"></div>
                  </td>
                  <td className="py-2 px-4">
                    <div className="h-4 bg-gray-600 rounded w-1/2 animate-pulse"></div>
                  </td>
                  <td className="py-2 px-4">
                    <div className="h-4 bg-gray-600 rounded w-16 animate-pulse"></div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <section className="mb-8" id="trendingSongsList">
          <h2 className="text-2xl font-bold mb-3">
            Trending Now
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
      </div>
    );
  }

  return (
    <div>
      <section className="mb-8" id="trendingSongsList">
        <h2 className="text-2xl font-bold mb-3">
          Trending Now
        </h2>
        <table className="w-full">
          <thead>
            <tr className="text-left text-gray-400 border-b border-[#333]">
              <th className="py-2 px-4">#</th>
              <th className="py-2 px-4">Title</th>
              <th className="py-2 px-4">Artist</th>
              <th className="py-2 px-4">Album</th>
              <th className="py-2 px-4">Year</th>
              <th className="py-2 px-4"></th>
            </tr>
          </thead>
          <tbody>
            {songs.map((song, idx) => {
              return (
                <tr 
                  key={song._id} 
                  className="border-t border-[#333] text-gray-200 hover:bg-[#2d2240] cursor-pointer"
                  onMouseEnter={() => setHoveredRow(song._id)}
                  onMouseLeave={() => setHoveredRow(null)}
                  onClick={() => handleRowClick(song)}
                >
                  <td className="py-2 px-4">{idx + 1}</td>
                  <td className="py-2 px-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={song.cover}
                          alt={song.title}
                          className="release-img"
                          style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover' }}
                        />
                        {hoveredRow === song._id && (
                          <button
                            onClick={(e) => handlePlay(e, song)}
                            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-purple-500 hover:bg-purple-600 text-white rounded-full w-9 h-9 flex items-center justify-center shadow-lg transition-opacity duration-200"
                            title="Nghe nhạc"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-5 h-5"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M8 5v14l11-7z"></path>
                            </svg>
                          </button>
                        )}
                      </div>
                      <span className="font-medium">{song.title}</span>
                    </div>
                  </td>
                  <td className="py-2 px-4">{song.artist ? song.artist.name : 'Unknown'}</td>
                  <td className="py-2 px-4">{song.album ? song.album.name : 'Unknown'}</td>
                  <td className="py-2 px-4">{song.album ? song.album.year : ''}</td>
                  <td className="py-2 px-4" onClick={handleFavoriteClick}>
                    <HeartIcon songId={song._id} size={18} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
      
      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onLogin={(user) => window.location.reload()}
        />
      )} 
    </div>
  );
};

export default TrendingSongsTable;
