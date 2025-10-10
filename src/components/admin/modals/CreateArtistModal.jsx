import React from 'react';

const ArtistModal = ({ 
  showModal, 
  setShowModal, 
  editingArtist, 
  formData, 
  setFormData, 
  handleSubmit 
}) => {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-[10px] flex items-center justify-center z-50">
      <div className="bg-[#2d2240] rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-bold text-white mb-4">
          {editingArtist ? 'Edit Artist' : 'Add New Artist'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white mb-1">Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-2 bg-[#3a2d52] text-white rounded border border-gray-600 focus:border-purple-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-white mb-1">Avatar URL</label>
            <input
              type="text"
              value={formData.avatar}
              onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
              className="w-full p-2 bg-[#3a2d52] text-white rounded border border-gray-600 focus:border-purple-500"
              placeholder="e.g., /assets/images/artist.jpg or https://example.com/artist.jpg"
            />
          </div>
          
          <div>
            <label className="block text-white mb-1">Bio</label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full p-2 bg-[#3a2d52] text-white rounded border border-gray-600 focus:border-purple-500 h-20 resize-none"
              placeholder="Artist biography..."
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
              type="submit"
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 rounded hover:opacity-90"
            >
              {editingArtist ? 'Update Artist' : 'Add Artist'}
            </button>
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="flex-1 bg-gray-500 text-white py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ArtistModal;
