import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginModal from './LoginModal';
import { useAuth } from '../context/AuthContext';

const ArtistsCard = ({ artist }) => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);

  if (!artist) return null;

  const handleClickArtist = (e) => {
    e.preventDefault();
    console.log('ArtistsCard - artist object:', artist);
    console.log('ArtistsCard - artist.id:', artist.id);
    if (currentUser) {
      console.log('Navigating to:', `/artist/${artist.id}`);
      navigate(`/artist/${artist.id}`);
    } else {
      setShowLoginModal(true);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative group cursor-pointer" onClick={handleClickArtist}>
        <img
          src={artist.avatar}
          alt={artist.name}
          className="cursor-pointer rounded-full w-32 h-32 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <button
          className="absolute -bottom-3 -right-3 bg-pink-500 hover:bg-pink-600 text-white rounded-full w-9 h-9 flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer"
          title="View Artist"
          tabIndex={-1}
          onClick={(e) => e.stopPropagation()}
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
      <span onClick={handleClickArtist} className="cursor-pointer text-lg font-semibold text-white mt-3 hover:text-pink-400 transition-colors block text-center">
        {artist.name}
      </span>
   
      {showLoginModal && (
        <LoginModal
  onClose={() => setShowLoginModal(false)}
  onLogin={(user) => {
    localStorage.setItem('currentUser', JSON.stringify(user));
    setShowLoginModal(false); // Tắt modal sau khi login thành công
    // Optional: có thể navigate lại nếu muốn
  }}
/>
      )}
    </div>
  );
};

export default ArtistsCard;
