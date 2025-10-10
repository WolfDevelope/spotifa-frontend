import React from 'react';

const LittleCreateAlbumModal = ({ 
  showModal, 
  setShowModal, 
  formData, 
  setFormData, 
  onCreateAlbum,
  selectedArtist
}) => {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-[10px] flex items-center justify-center z-50">
      <div className="bg-[#2d2240] rounded-lg p-6 w-full max-w-md shadow-2xl border border-green-500/20">
        <h3 className="text-xl font-bold text-white mb-4">Create New Album</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-white mb-1">Album Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-2 bg-[#3a2d52] text-white rounded border border-gray-600 focus:border-purple-500"
              placeholder="Enter album name"
              required
            />
          </div>
          
          <div>
            <label className="block text-white mb-1">Release Year</label>
            <input
              type="number"
              min="1900"
              max={new Date().getFullYear() + 1}
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
              className="w-full p-2 bg-[#3a2d52] text-white rounded border border-gray-600 focus:border-purple-500"
            />
          </div>
          
          <div className="bg-[#3a2d52] p-3 rounded border border-gray-600">
            <p className="text-gray-300 text-sm">
              <span className="text-purple-400 font-medium">Artist:</span> {
                selectedArtist || 'No artist selected'
              }
            </p>
          </div>
          
          <div className="flex space-x-3 pt-2">
            <button
              onClick={onCreateAlbum}
              disabled={!formData.name.trim()}
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-2 rounded hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
            >
              Create Album
            </button>
            <button
              onClick={() => setShowModal(false)}
              className="flex-1 bg-gray-500 text-white py-2 rounded hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LittleCreateAlbumModal;
