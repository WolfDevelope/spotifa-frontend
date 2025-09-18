import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { findArtistById, findAlbumById } from '../utils/dataProcessor';
import { useMusic } from '../context/MusicContext';
import LoginModal from './LoginModal';
import data from '../data';
import HeartIcon from './HeartIcon';
import { useAuth } from '../context/AuthContext';

const SongCard = ({ song, index }) => {
  const navigate = useNavigate();
  const { setPlaylistAndPlay } = useMusic();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { currentUser } = useAuth();
  const artist = song.artistId ? findArtistById(song.artistId) : null;

  if (!song) return null;

  const handlePlay = (e) => {
    e.preventDefault();
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

  const handleClickSong = (e) => {
    e.preventDefault();
    if (currentUser) {
      navigate(`/song/${song.id}`);
    } else {
      setShowLoginModal(true);
    }
  };

  const handleClickArtist = (e) => {
    e.preventDefault();
    if (currentUser && artist) {
      navigate(`/artist/${artist.id}`);
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
          <div onClick={handleFavoriteClick} className="ml-2">
            <HeartIcon songId={song.id} size={16} />
          </div>
        </div>
        <span
          onClick={handleClickArtist}
          className="text-xs text-gray-400 w-full text-left hover:text-white transition-colors"
        >
          {artist ? artist.name : 'Unknown Artist'}
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
