import React, { createContext, useContext } from 'react';
import { useUserNotification } from '../hooks/useUserNotification';
import UserNotificationModal from '../components/UserNotificationModal';

const FavoritesNotificationContext = createContext();

export const useFavoritesNotification = () => {
  const context = useContext(FavoritesNotificationContext);
  if (!context) {
    throw new Error('useFavoritesNotification must be used within a FavoritesNotificationProvider');
  }
  return context;
};

export const FavoritesNotificationProvider = ({ children }) => {
  const {
    showNotification,
    setShowNotification,
    notificationData,
    showSuccess,
    showError
  } = useUserNotification();

  const value = {
    showSuccess,
    showError
  };

  return (
    <FavoritesNotificationContext.Provider value={value}>
      {children}
      
      {/* Favorites Notification Modal */}
      <UserNotificationModal
        showModal={showNotification}
        setShowModal={setShowNotification}
        title={notificationData.title}
        message={notificationData.message}
        type={notificationData.type}
        autoClose={true}
        autoCloseDelay={3000}
      />
    </FavoritesNotificationContext.Provider>
  );
};

export default FavoritesNotificationProvider;
