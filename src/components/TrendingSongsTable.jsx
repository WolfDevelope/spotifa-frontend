import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import data from '../data';
import { findSongById, findAlbumById, findArtistById } from '../utils/dataProcessor';
import HeartIcon from './HeartIcon';
import LoginModal from './LoginModal';
import { useMusic } from '../context/MusicContext';

const { trendingSongs } = data;

const TrendingSongsTable = () => {
  const navigate = useNavigate();
  const { setPlaylistAndPlay } = useMusic();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [hoveredRow, setHoveredRow] = useState(null);
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  
  // Get full song objects from IDs
  const songs = trendingSongs.map(id => findSongById(id)).filter(Boolean);

  const handlePlay = (e, song) => {
    e.stopPropagation();
    
    const playlist = data.songs;
    const startIndex = playlist.findIndex(item => item.id === song.id);

    if (!currentUser && startIndex >= 3) {
      setShowLoginModal(true);
      return;
    }
    
    // If user is not logged in, play only the selected song
    const songsToPlay = !currentUser ? [song] : playlist;
    const playIndex = !currentUser ? 0 : startIndex;

    setPlaylistAndPlay(songsToPlay, playIndex);
  };

  const handleRowClick = (songId) => {
    if (currentUser) {
      navigate(`/song/${songId}`);
    } else {
      setShowLoginModal(true);
    }
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    if (!currentUser) {
      setShowLoginModal(true);
    }
    // The HeartIcon component will handle the rest
  };

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
          {songs.map((song, idx) => {
            const album = song.albumId ? findAlbumById(song.albumId) : null;
            const artist = song.artistId ? findArtistById(song.artistId) : null;
            return (
              <tr 
                key={song.id} 
                className="border-t border-[#333] text-gray-200 hover:bg-[#2d2240] cursor-pointer"
                onMouseEnter={() => setHoveredRow(song.id)}
                onMouseLeave={() => setHoveredRow(null)}
                onClick={() => handleRowClick(song.id)}
              >
                <td className="py-2 px-4">{idx + 1}</td>
                <td className="py-2 px-4 relative">
                  <div className="relative">
                    <img
                      src={song.cover}
                      alt={song.title}
                      className="release-img"
                      style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover' }}
                    />
                    {hoveredRow === song.id && (
                      <button
                        onClick={(e) => handlePlay(e, song)}
                        className="absolute top-1/2 left-1/2 transform -translate-x-[70%] -translate-y-1/2 bg-purple-500 hover:bg-purple-600 text-white rounded-full w-9 h-9 flex items-center justify-center shadow-lg transition-opacity duration-200"
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
                </td>
                <td className="py-2 px-4">{song.title}</td>
                <td className="py-2 px-4">{artist ? artist.name : 'Unknown'}</td>
                <td className="py-2 px-4">{album ? album.name : 'Unknown'}</td>
                <td className="py-2 px-4">{album ? album.year : ''}</td>
                <td className="py-2 px-4" onClick={handleFavoriteClick}>
                  <HeartIcon songId={song.id} size={18} />
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