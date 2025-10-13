import React, { createContext, useContext } from 'react';
import { useUserNotification } from '../hooks/useUserNotification';
import UserNotificationModal from '../components/UserNotificationModal';

const PlaylistNotificationContext = createContext();

export const usePlaylistNotification = () => {
  const context = useContext(PlaylistNotificationContext);
  if (!context) {
    throw new Error('usePlaylistNotification must be used within a PlaylistNotificationProvider');
  }
  return context;
};

export const PlaylistNotificationProvider = ({ children }) => {
  const {
    showNotification,
    setShowNotification,
    notificationData,
    showSuccess,
    showError,
    showInfo
  } = useUserNotification();

  const value = {
    showSuccess,
    showError,
    showInfo
  };

  return (
    <PlaylistNotificationContext.Provider value={value}>
      {children}
      
      {/* Playlist Notification Modal */}
      <UserNotificationModal
        showModal={showNotification}
        setShowModal={setShowNotification}
        title={notificationData.title}
        message={notificationData.message}
        type={notificationData.type}
        autoClose={true}
        autoCloseDelay={3500}
      />
    </PlaylistNotificationContext.Provider>
  );
};

export default PlaylistNotificationProvider;
