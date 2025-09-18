import React, { useState, useEffect } from 'react';

import Footer from '../components/Footer';
import PopularArtists from '../components/PopularArtists';
import EmergingPopArtists from '../components/EmergingPopArtists';
import RisingAlternativeIndieArtists from '../components/RisingAlternativeIndieArtists';
import RecentlyViralArtists from '../components/RecentlyViralArtists';
import { useNavigate } from 'react-router-dom';
const Artists = () => {
  const [currentUser, setCurrentUser] = useState(null);
    const navigate = useNavigate();
  
    useEffect(() => {
      // Lấy thông tin người dùng từ localStorage nếu có
      const user = JSON.parse(localStorage.getItem('currentUser'));
      if (user) {
        setCurrentUser(user);
      }
    }, []);
    
    return (
        <div className="bg-gradient-to-b from-[#22172b] to-[#3d2a3f] min-h-screen text-white font-sans flex">
      
      <main className="flex-1 px-8 py-6" style={{ marginLeft: '16rem' }}>
       

        {/* Welcome Section - Chỉ hiển thị khi đã đăng nhập */}
        {currentUser && (
          <div className="mb-8 bg-gradient-to-r from-purple-900/50 to-pink-900/50 p-6 rounded-xl">
            <h1 className="text-3xl font-bold mb-2">Welcome, {currentUser.name}!</h1>
            <p className="text-gray-300">What would you like to listen to today?</p>
          </div>
        )}
        
        <PopularArtists />
        <EmergingPopArtists />
        <RisingAlternativeIndieArtists />
        <RecentlyViralArtists />
        
        <Footer />

      </main>
      
    </div>
    );
};

export default Artists;
