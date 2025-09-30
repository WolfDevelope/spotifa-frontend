import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import LoginModal from './LoginModal';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AlbumCard = ({ album }) => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);

  if (!album) {
    return null;
  }

  const handleClickAlbum = (e) => {
    e.preventDefault();
    if (currentUser) {
      navigate(`/album/${album._id}`);
    } else {
      setShowLoginModal(true);
    }
  };

  const handleClickArtist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (currentUser && album.artist) {
      navigate(`/artist/${album.artist._id}`);
    } else if (!currentUser) {
      setShowLoginModal(true);
    }
  };

  return (
    <>
    <div 
      onClick={handleClickAlbum}
      className="bg-[#2d2240] rounded-lg p-3 w-40 h-60 flex flex-col justify-between items-center overflow-hidden search-item hover:bg-[#3a2d52] transition-colors cursor-pointer"
    >
      <div className="w-full flex flex-col items-center group">
        <div className="relative w-32 h-32 mb-2">
          <img
            src={album.cover}
            alt={album.name}
            className="rounded-lg w-full h-full object-cover bg-gray-700 group-hover:opacity-90 transition-opacity"
          />
          <button
            className="absolute -bottom-3 -right-3 bg-pink-500 hover:bg-pink-600 text-white rounded-full w-9 h-9 flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200"
            title="View Artist"
            tabIndex={-1}
            onClick={handleClickArtist}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
        <span className="text-base font-semibold text-white text-center line-clamp-2 hover:text-pink-400 transition-colors">
          {album.name}
        </span>
      </div>
      {album.artist ? (
        <span 
          onClick={handleClickArtist}
          className="artist-link text-center text-gray-400 hover:text-white text-xs transition-colors"
        >
          {album.artist.name}
        </span>
      ) : (
        <span className="text-center text-gray-400 text-xs">Unknown Artist</span>
      )}
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

export default AlbumCard;
