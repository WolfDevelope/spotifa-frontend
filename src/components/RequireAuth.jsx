import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import LoginModal from './LoginModal';

const RequireAuth = ({ children, onLogin }) => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [storedLocation, setStoredLocation] = useState(null);
  const location = useLocation();

  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  useEffect(() => {
    if (!currentUser) {
      setShowLoginModal(true);
      setStoredLocation(location); // lưu trang gốc nếu muốn dùng redirect sau login
    } else {
      setShowLoginModal(false);
    }
  }, [currentUser, location]);

  const handleLoginSuccess = (user) => {
    localStorage.setItem('currentUser', JSON.stringify(user));
    if (onLogin) onLogin(user);
    setShowLoginModal(false);
  };

  const handleCloseModal = () => {
    setShowLoginModal(false); // nếu bạn muốn cho phép đóng modal mà vẫn ở trang mờ
  };

  if (currentUser) {
    return children;
  }

  return (
    <div className="relative w-full h-full">
      {/* Mờ nền */}
      <div className="absolute inset-0 backdrop-blur-[5px] z-10" />

      {/* Nội dung bị disable */}
      <div
        className="relative z-0 opacity-80 pointer-events-none select-none"
      >
        {children}
      </div>
      {/* Lớp overlay bắt click */}
      <div
        className="absolute inset-0 z-20 cursor-pointer"
        onClick={() => setShowLoginModal(true)}
      />
      {/* Modal đăng nhập */}
      {showLoginModal && (
        <div className="z-20">
          <LoginModal onClose={handleCloseModal} onLogin={handleLoginSuccess} />
        </div>
      )}
    </div>
  );
};

export default RequireAuth;
