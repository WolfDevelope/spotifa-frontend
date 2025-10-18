import React from 'react';

const CreateSongModal = ({ 
  showModal, 
  setShowModal, 
  editingSong, 
  formData, 
  setFormData, 
  handleSubmit,
  artists,
  albums,
  loadingDropdowns,
  openArtistModal,
  openAlbumModal,
  onOpenUploadModal
}) => {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0  backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#2d2240] rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl border border-purple-500/10">
        <h3 className="text-xl font-bold text-white mb-4">
          {editingSong ? 'Edit Song' : 'Add New Song'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white mb-1">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full p-2 bg-[#3a2d52] text-white rounded border border-gray-600 focus:border-purple-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-white mb-1">Artist</label>
            {loadingDropdowns ? (
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
            <label className="block text-white mb-1">Album</label>
            {loadingDropdowns ? (
              <div className="w-full p-2 bg-[#3a2d52] text-gray-400 rounded border border-gray-600">
                Loading albums...
              </div>
            ) : (
              <div className="space-y-2">
                <select
                  value={formData.album}
                  onChange={(e) => setFormData({ ...formData, album: e.target.value })}
                  className="w-full p-2 bg-[#3a2d52] text-white rounded border border-gray-600 focus:border-purple-500"
                >
                  <option value="">Select an album (optional)</option>
                  {albums.map((album) => (
                    <option key={album._id} value={album._id}>
                      {album.name} - {album.artist?.name || 'Unknown Artist'}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={openAlbumModal}
                  className="w-full text-sm bg-green-500 hover:bg-green-600 text-white py-1 px-2 rounded transition-colors"
                >
                  + Create New Album
                </button>
              </div>
            )}
          </div>
          
          <div>
            <label className="block text-white mb-1">Duration</label>
            <input
              type="text"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              className="w-full p-2 bg-[#3a2d52] text-white rounded border border-gray-600 focus:border-purple-500"
              placeholder="e.g., 3:45"
            />
          </div>
          
          <div>
            <label className="block text-white mb-1">Audio Source URL</label>
            <div className="space-y-2">
              <input
                type="text"
                value={formData.src}
                onChange={(e) => setFormData({ ...formData, src: e.target.value })}
                className="w-full p-2 bg-[#3a2d52] text-white rounded border border-gray-600 focus:border-purple-500"
                placeholder="e.g., /assets/audio/song.mp3 or https://example.com/song.mp3"
              />
              <button
                type="button"
                onClick={onOpenUploadModal}
                className="w-full text-sm bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 text-white py-2 px-3 rounded transition-opacity flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                Upload from Computer (Cloudinary)
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-white mb-1">Cover Image URL</label>
            <input
              type="text"
              value={formData.cover}
              onChange={(e) => setFormData({ ...formData, cover: e.target.value })}
              className="w-full p-2 bg-[#3a2d52] text-white rounded border border-gray-600 focus:border-purple-500"
              placeholder="e.g., /assets/images/cover.jpg or https://example.com/cover.jpg"
            />
          </div>
          
          <div>
            <label className="block text-white mb-1">Lyrics</label>
            <textarea
              value={formData.lyrics}
              onChange={(e) => setFormData({ ...formData, lyrics: e.target.value })}
              className="w-full p-2 bg-[#3a2d52] text-white rounded border border-gray-600 focus:border-purple-500 h-24 resize-none"
              placeholder="Enter song lyrics..."
            />
          </div>
          
          <div className="flex space-x-3 pt-2">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 rounded hover:opacity-90"
            >
              {editingSong ? 'Update Song' : 'Add Song'}
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

export default CreateSongModal;
