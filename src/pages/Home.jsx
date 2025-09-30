// pages/Home.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import BillboardSlider from '../components/BillboardSlider';
import WeeklyTopSongs from '../components/WeeklyTopSongs_API';
import NewReleaseSongs from '../components/NewReleaseSongs_API';
import TrendingSongsTable from '../components/TrendingSongsTable_API';
import PopularArtists from '../components/PopularArtists_API';
import MusicVideo from '../components/MusicVideo_API';
import TopAlbums from '../components/TopAlbums_API';
import MoodPlaylists from '../components/MoodPlaylists_API';
import JoinOurPlatform from '../components/JoinOurPlatform';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-b from-[#22172b] to-[#3d2a3f] min-h-screen text-white font-sans flex">
      
      <main className="flex-1 px-8 py-6" style={{ marginLeft: '16rem' }}>
        
        {/* Welcome Section - Chỉ hiển thị khi đã đăng nhập */}
        {currentUser && (
          <div className="mb-8 bg-gradient-to-r from-purple-900/50 to-pink-900/50 p-6 rounded-xl">
            <h1 className="text-3xl font-bold mb-2">Welcome, {(currentUser.name || currentUser.username || currentUser.displayName || currentUser.email) || 'User'}!</h1>
            <p className="text-gray-300">What would you like to listen to today?</p>
          </div>
        )}
        
        {/* Các thành phần chính của trang Home */}
        <BillboardSlider />
        <WeeklyTopSongs />
        <NewReleaseSongs />
        <TrendingSongsTable />
        <PopularArtists />
        <MusicVideo />
        <TopAlbums />
        <MoodPlaylists />
        
        {/* Chỉ hiển thị JoinOurPlatform khi chưa đăng nhập */}
        {!currentUser && <JoinOurPlatform />}
        
        <Footer />
      </main>
    </div>
  );
};

export default Home;