import React, { useEffect } from 'react';

const UserNotificationModal = ({ 
  showModal, 
  setShowModal, 
  title = "Success!",
  message = "Operation completed successfully.",
  autoClose = true,
  autoCloseDelay = 3000,
  type = "success" // "success", "error", "info", "warning"
}) => {
  useEffect(() => {
    if (showModal && autoClose) {
      const timer = setTimeout(() => {
        setShowModal(false);
      }, autoCloseDelay);

      return () => clearTimeout(timer);
    }
  }, [showModal, autoClose, autoCloseDelay, setShowModal]);

  if (!showModal) return null;

  const handleClose = () => {
    setShowModal(false);
  };

  // Configure colors and icons based on type
  const config = {
    success: {
      borderColor: "border-green-500/20",
      iconBg: "bg-green-500/20",
      iconColor: "text-green-400",
      progressColor: "from-green-400 to-green-600",
      icon: "M5 13l4 4L19 7" // Checkmark
    },
    error: {
      borderColor: "border-red-500/20",
      iconBg: "bg-red-500/20",
      iconColor: "text-red-400",
      progressColor: "from-red-400 to-red-600",
      icon: "M6 18L18 6M6 6l12 12" // X mark
    },
    warning: {
      borderColor: "border-yellow-500/20",
      iconBg: "bg-yellow-500/20",
      iconColor: "text-yellow-400",
      progressColor: "from-yellow-400 to-yellow-600",
      icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" // Warning triangle
    },
    info: {
      borderColor: "border-blue-500/20",
      iconBg: "bg-blue-500/20",
      iconColor: "text-blue-400",
      progressColor: "from-blue-400 to-blue-600",
      icon: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" // Info circle
    }
  };

  const currentConfig = config[type] || config.success;

  return (
    <div className="fixed bottom-4 right-4 z-50 transform transition-all duration-300 ease-out"
         style={{
           transform: showModal ? 'translateX(0)' : 'translateX(100%)',
           opacity: showModal ? 1 : 0
         }}>
      <div className={`bg-[#2d2240] rounded-lg p-4 w-80 border ${currentConfig.borderColor} shadow-lg`}>
        {/* Header */}
        <div className="flex items-center space-x-3 mb-2">
          <div className={`w-8 h-8 ${currentConfig.iconBg} rounded-full flex items-center justify-center flex-shrink-0`}>
            <svg className={`w-4 h-4 ${currentConfig.iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={currentConfig.icon} />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-white">{title}</h3>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors flex-shrink-0"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Message */}
        <p className="text-gray-300 text-sm mb-3 ml-11">
          {message}
        </p>

        {/* Progress bar for auto-close */}
        {autoClose && (
          <div className="w-full bg-gray-700 rounded-full h-1">
            <div 
              className={`bg-gradient-to-r ${currentConfig.progressColor} h-1 rounded-full transition-all ease-linear`}
              style={{
                width: showModal ? '100%' : '0%',
                transitionDuration: `${autoCloseDelay}ms`
              }}
            ></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserNotificationModal;
