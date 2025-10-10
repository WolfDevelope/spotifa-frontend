import React from 'react';

const LittleCreateArtistModal = ({ 
  showModal, 
  setShowModal, 
  formData, 
  setFormData, 
  onCreateArtist 
}) => {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-[10px] flex items-center justify-center z-50">
      <div className="bg-[#2d2240] rounded-lg p-6 w-full max-w-md shadow-2xl border border-purple-500/20">
        <h3 className="text-xl font-bold text-white mb-4">Create New Artist</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-white mb-1">Artist Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-2 bg-[#3a2d52] text-white rounded border border-gray-600 focus:border-purple-500"
              placeholder="Enter artist name"
              required
            />
          </div>
          
          <div>
            <label className="block text-white mb-1">Genre</label>
            <input
              type="text"
              value={formData.genre}
              onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
              className="w-full p-2 bg-[#3a2d52] text-white rounded border border-gray-600 focus:border-purple-500"
              placeholder="e.g., Pop, Rock, Hip-Hop"
            />
          </div>
          
          <div>
            <label className="block text-white mb-1">Country</label>
            <input
              type="text"
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              className="w-full p-2 bg-[#3a2d52] text-white rounded border border-gray-600 focus:border-purple-500"
              placeholder="e.g., USA, UK, Vietnam"
            />
          </div>
          
          <div className="flex space-x-3 pt-2">
            <button
              onClick={onCreateArtist}
              disabled={!formData.name.trim()}
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 rounded hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
            >
              Create Artist
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

export default LittleCreateArtistModal;
