import React from 'react';
import '../assets/styles/main.css';
import { Link, useNavigate } from 'react-router-dom';
import data from "../data";
import { useAuth } from '../context/AuthContext';

const Header = ({ user, searchTerm, setSearchTerm, setSearchResults }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  // Hàm xử lý tìm kiếm
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim() === "") {
      setSearchResults({ songs: [], albums: [], artists: [] });
      return;
    }

    const lower = value.toLowerCase();

    const songs = data.songs.filter(
      (song) =>
        song.title.toLowerCase().includes(lower) ||
        (song.lyrics && song.lyrics.toLowerCase().includes(lower))
    );

    const albums = data.albums.filter((album) =>
      album.name.toLowerCase().includes(lower)
    );

    const artists = data.artists.filter((artist) =>
      artist.name.toLowerCase().includes(lower)
    );

    setSearchResults({ songs, albums, artists });
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="fixed top-0 left-64 z-50 flex items-center py-6 px-10 w-[calc(100%-256px)] justify-between bg-gradient-to-r backdrop-blur-md border-b border-[#32244a]/40 shadow">
      <input
        id="searchInput"
        type="text"
        placeholder="Search for tracks, artists, albums..."
        className="rounded-lg px-4 py-2 bg-[#2d2240] text-white w-1/3 focus:outline-none focus:ring-2 focus:ring-pink-400"
        value={searchTerm || ""}
        onChange={handleSearch}
        autoComplete="off"
      />
      {/* Navigation chỉ hiện khi không tìm kiếm */}
      {(searchTerm || "").trim() === "" && (
        <nav className="flex gap-8 items-center">
          <a href="#" className="text-white hover:text-pink-300">About</a>
          <a href="#" className="text-white hover:text-pink-300">Contact</a>
          <a href="#" className="text-white hover:text-pink-300">Premium</a>
          {user ? (
            <div className="flex items-center gap-4">
              <Link to="/account" className="flex items-center gap-2 text-white hover:text-pink-300">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center">
                  {user && (user.name || user.username || user.displayName || user.email) ?
  (user.name || user.username || user.displayName || user.email).charAt(0).toUpperCase() : 'U'}
                </div>
                <span>{user && (user.name || user.username || user.displayName || user.email) || 'User'}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="cursor-pointer bg-[#2d2240] text-white px-4 py-1 rounded-lg hover:bg-pink-400 hover:text-white"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className='flex gap-2'>
              <Link to="/login">
                <button className="cursor-pointer w-24 bg-[#2d2240] text-white px-4 py-1 rounded-lg hover:bg-pink-400 hover:text-white">
                  Login
                </button>
              </Link>
              <Link to="/signup">
                <button className="cursor-pointer w-24 bg-[#2d2240] text-white px-4 py-1 rounded-lg hover:bg-pink-400 hover:text-white">
                  Sign Up
                </button>
              </Link>
            </div>
          )}
        </nav>
      )}
    </header>
  );
};

export default Header;