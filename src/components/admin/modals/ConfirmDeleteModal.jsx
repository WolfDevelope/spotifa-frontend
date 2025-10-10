import React from 'react';

const ConfirmDeleteModal = ({ 
  showModal, 
  setShowModal, 
  onConfirm, 
  title = "Confirm Delete",
  message = "Are you sure you want to delete this item?",
  itemName = "",
  confirmText = "Delete",
  cancelText = "Cancel"
}) => {
  if (!showModal) return null;

  const handleConfirm = () => {
    onConfirm();
    setShowModal(false);
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  return (
    <div className="fixed inset-0 backdrop-blur-[10px] flex items-center justify-center z-50">
      <div className="bg-[#2d2240] rounded-lg p-6 w-full max-w-md mx-4 border border-purple-500/20">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            {itemName && (
              <p className="text-sm text-gray-400">"{itemName}"</p>
            )}
          </div>
        </div>

        {/* Message */}
        <p className="text-gray-300 mb-6">
          {message}
        </p>

        {/* Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={handleCancel}
            className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
