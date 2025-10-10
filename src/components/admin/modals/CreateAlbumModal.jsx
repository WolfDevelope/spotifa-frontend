import React from 'react';

const CreateAlbumModal = ({ 
  showModal, 
  setShowModal, 
  editingAlbum, 
  formData, 
  setFormData, 
  handleSubmit,
  artists,
  loadingDropdown,
  openArtistModal
}) => {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-[10px] flex items-center justify-center z-50">
      <div className="bg-[#2d2240] rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-bold text-white mb-4">
          {editingAlbum ? 'Edit Album' : 'Add New Album'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white mb-1">Album Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-2 bg-[#3a2d52] text-white rounded border border-gray-600 focus:border-purple-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-white mb-1">Artist</label>
            {loadingDropdown ? (
              <div className="w-full p-2 bg-[#3a2d52] text-gray-400 rounded border border-gray-600">
                Loading artists...
              </div>
            ) : (
              <div className="space-y-2">
                <select
                  value={formData.artist}
                  onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
                  className="w-full p-2 bg-[#3a2d52] text-white rounded border border-gray-600 focus:border-purple-500"
                  required
                >
                  <option value="">Select an artist</option>
                  {artists.map((artist) => (
                    <option key={artist._id} value={artist._id}>
                      {artist.name}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={openArtistModal}
                  className="w-full text-sm bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded transition-colors"
                >
                  + Create New Artist
                </button>
              </div>
            )}
          </div>
          
          <div>
            <label className="block text-white mb-1">Cover Image URL</label>
            <input
              type="text"
              value={formData.cover}
              onChange={(e) => setFormData({ ...formData, cover: e.target.value })}
              className="w-full p-2 bg-[#3a2d52] text-white rounded border border-gray-600 focus:border-purple-500"
              placeholder="e.g., /assets/images/album.jpg or https://example.com/album.jpg"
            />
          </div>
          
          <div>
            <label className="block text-white mb-1">Release Year</label>
            <input
              type="number"
              min="1900"
              max={new Date().getFullYear() + 1}
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: e.target.value })}
              className="w-full p-2 bg-[#3a2d52] text-white rounded border border-gray-600 focus:border-purple-500"
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
            <label className="block text-white mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-2 bg-[#3a2d52] text-white rounded border border-gray-600 focus:border-purple-500 h-20 resize-none"
              placeholder="Album description..."
            />
          </div>
          
          <div className="flex space-x-3 pt-2">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 rounded hover:opacity-90"
            >
              {editingAlbum ? 'Update Album' : 'Add Album'}
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

export default CreateAlbumModal;
