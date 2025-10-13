import { useState } from 'react';

export const useUserNotification = () => {
  const [showNotification, setShowNotification] = useState(false);
  const [notificationData, setNotificationData] = useState({
    title: '',
    message: '',
    type: 'success'
  });

  const showSuccess = (message, title = 'Success!') => {
    setNotificationData({
      title,
      message,
      type: 'success'
    });
    setShowNotification(true);
  };

  const showError = (message, title = 'Error!') => {
    setNotificationData({
      title,
      message,
      type: 'error'
    });
    setShowNotification(true);
  };

  const showWarning = (message, title = 'Warning!') => {
    setNotificationData({
      title,
      message,
      type: 'warning'
    });
    setShowNotification(true);
  };

  const showInfo = (message, title = 'Info') => {
    setNotificationData({
      title,
      message,
      type: 'info'
    });
    setShowNotification(true);
  };

  const hideNotification = () => {
    setShowNotification(false);
  };

  return {
    showNotification,
    setShowNotification,
    notificationData,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    hideNotification
  };
};

export default useUserNotification;
