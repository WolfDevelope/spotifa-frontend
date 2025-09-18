import React from 'react';

const DeletePlaylistModal = ({ isOpen, onClose, onConfirm, playlistName }) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-[#181a2a] rounded-lg p-6 max-w-md w-full mx-4 border border-gray-700 shadow-2xl backdrop-blur-md">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Delete Playlist</h3>
            <p className="text-gray-400 text-sm">This action cannot be undone</p>
          </div>
        </div>

        {/* Content */}
        <div className="mb-6">
          <p className="text-gray-300 mb-2">
            Are you sure you want to delete the playlist
          </p>
          <p className="text-white font-semibold text-lg">
            "{playlistName}"?
          </p>
          <p className="text-gray-400 text-sm mt-2">
            All songs in this playlist will be removed permanently.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-transparent border border-gray-600 hover:border-gray-400 text-gray-300 hover:text-white rounded-full font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full font-medium transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeletePlaylistModal;
