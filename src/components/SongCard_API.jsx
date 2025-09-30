import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMusic } from '../context/MusicContext';
import LoginModal from './LoginModal';
import HeartIcon from './HeartIcon';
import { useAuth } from '../context/AuthContext';
import musicService from '../services/musicService';

const SongCard = ({ song, index }) => {
  const navigate = useNavigate();
  const { setPlaylistAndPlay } = useMusic();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { currentUser } = useAuth();

  if (!song) return null;

  const handlePlay = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!currentUser && index >= 3) {
      setShowLoginModal(true);
      return;
    }
    
    // If user is not logged in, play only the selected song
    const songsToPlay = !currentUser ? [song] : [song]; // For now, just play single song
    const playIndex = 0;

    // Increment play count
    try {
      await musicService.incrementPlayCount(song._id);
    } catch (err) {
      console.error('Failed to increment play count:', err);
    }

    setPlaylistAndPlay(songsToPlay, playIndex);
  };

  const handleClickSong = (e) => {
    e.preventDefault();
    if (currentUser) {
      navigate(`/song/${song._id}`);
    } else {
      setShowLoginModal(true);
    }
  };

  const handleClickArtist = (e) => {
    e.preventDefault();
    if (currentUser && song.artist) {
      navigate(`/artist/${song.artist._id}`);
    } else if (!currentUser) {
      setShowLoginModal(true);
    }
  };


  return (
    <>
      <div onClick={handleClickSong} className="bg-[#2d2240] rounded-lg p-3 w-40 flex flex-col items-center search-item cursor-pointer">
        <div className="relative group w-full">
          <img
            src={song.cover}
            alt={song.title}
            className="rounded-lg mb-2 w-full aspect-square object-cover"
          />
          <button
            onClick={handlePlay}
            className="absolute bottom-3 right-0 bg-purple-500 hover:bg-purple-600 text-white rounded-full w-9 h-9 flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 play-btn"
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
        </div>

        <div className="flex flex-row items-center w-full justify-between mt-2">
          <span className="text-sm font-semibold text-white hover:text-pink-400 transition-colors">
            {song.title}
          </span>
          <div className="ml-2">
            <HeartIcon songId={song._id} size={16} />
          </div>
        </div>
        <span
          onClick={handleClickArtist}
          className="text-xs text-gray-400 w-full text-left hover:text-white transition-colors"
        >
          {song.artist ? song.artist.name : 'Unknown Artist'}
        </span>
      </div>

      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onLogin={(user) => window.location.reload()}
        />
      )}
    </>
  );
};

export default SongCard;
