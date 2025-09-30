import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';

const AlbumManagement = () => {
  const { adminAPI } = useAdmin();
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    artist: '',
    cover: '',
    year: '',
    genre: '',
    description: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0
  });

  useEffect(() => {
    fetchAlbums();
  }, [pagination.page]);

  const fetchAlbums = async () => {
    console.log('💿 Fetching albums for page:', pagination.page);
    
    try {
      setLoading(true);
      setError(null); // Clear previous errors
      setAlbums([]); // Clear albums trước khi fetch
      
      const response = await adminAPI.getAlbums(pagination.page, pagination.limit);
      console.log('💿 API Response:', response);
      
      if (response && response.success === true) {
        console.log('💿 Setting albums:', response.data?.length || 0, 'albums');
        setAlbums(response.data || []);
        setPagination(prev => ({
          ...prev,
          total: response.pagination?.total || 0,
          pages: response.pagination?.pages || 0
        }));
        console.log('💿 Albums state updated successfully');
      } else {
        console.log('💿 Response not successful:', response);
        setError(response?.message || 'Failed to load albums');
        setAlbums([]);
      }
    } catch (error) {
      console.error('💿 Error fetching albums:', error);
      setAlbums([]);
      setError('Failed to load albums. Please make sure you are logged in as admin.');
    } finally {
      console.log('💿 Setting loading to false');
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      if (editingAlbum) {
        response = await adminAPI.updateAlbum(editingAlbum._id, formData);
      } else {
        response = await adminAPI.createAlbum(formData);
      }

      if (response.success) {
        setShowModal(false);
        setEditingAlbum(null);
        resetForm();
        fetchAlbums();
      }
    } catch (error) {
      console.error('Error saving album:', error);
    }
  };

  const handleEdit = (album) => {
    setEditingAlbum(album);
    setFormData({
      name: album.name || '',
      artist: album.artist?._id || '',
      cover: album.cover || '',
      year: album.year || '',
      genre: album.genre || '',
      description: album.description || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this album?')) {
      try {
        const response = await adminAPI.deleteAlbum(id);
        if (response.success) {
          fetchAlbums();
        }
      } catch (error) {
        console.error('Error deleting album:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      artist: '',
      cover: '',
      year: '',
      genre: '',
      description: ''
    });
  };

  const openCreateModal = () => {
    resetForm();
    setEditingAlbum(null);
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-white">Loading albums...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Album Management</h2>
        </div>
        <div className="bg-red-500/20 border border-red-500 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <span className="text-red-400">⚠️</span>
            <span className="text-red-400 font-medium">Error</span>
          </div>
          <p className="text-red-300 mt-2">{error}</p>
          <button
            onClick={() => {
              setError(null);
              fetchAlbums();
            }}
            className="mt-3 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Album Management</h2>
        <button
          onClick={openCreateModal}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
        >
          Add New Album
        </button>
      </div>

      {/* Albums Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {albums.map((album) => (
          <div key={album._id} className="bg-[#3a2d52] rounded-lg p-4">
            <div className="flex flex-col">
              <img
                src={album.cover || '/default-album.jpg'}
                alt={album.name}
                className="w-full h-48 rounded-lg object-cover mb-3"
              />
              <h3 className="text-white font-semibold text-lg mb-1 line-clamp-1">{album.name}</h3>
              <p className="text-gray-400 text-sm mb-1">{album.artist?.name || 'Unknown Artist'}</p>
              <p className="text-gray-500 text-xs mb-2">{album.year || 'Unknown Year'}</p>
              
              {album.genre && (
                <p className="text-purple-400 text-xs mb-2">{album.genre}</p>
              )}
              
              {album.description && (
                <p className="text-gray-300 text-xs mb-3 line-clamp-2">
                  {album.description.length > 80 ? `${album.description.substring(0, 80)}...` : album.description}
                </p>
              )}
              
              <div className="flex space-x-2 mt-auto">
                <button
                  onClick={() => handleEdit(album)}
                  className="flex-1 bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(album._id)}
                  className="flex-1 bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center space-x-2">
        <button
          onClick={() => {
            if (pagination.page > 1 && !loading) {
              setPagination(prev => ({ ...prev, page: prev.page - 1 }));
            }
          }}
          disabled={pagination.page === 1 || loading}
          className="px-3 py-1 bg-[#3a2d52] text-white rounded disabled:opacity-50 transition-opacity"
        >
          Previous
        </button>
        
        {/* Page numbers */}
        <div className="flex space-x-1">
          {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
            let pageNum;
            if (pagination.pages <= 5) {
              pageNum = i + 1;
            } else if (pagination.page <= 3) {
              pageNum = i + 1;
            } else if (pagination.page >= pagination.pages - 2) {
              pageNum = pagination.pages - 4 + i;
            } else {
              pageNum = pagination.page - 2 + i;
            }
            
            return (
              <button
                key={pageNum}
                onClick={() => {
                  if (pageNum !== pagination.page && !loading) {
                    setPagination(prev => ({ ...prev, page: pageNum }));
                  }
                }}
                disabled={loading}
                className={`px-3 py-1 rounded transition-all ${
                  pageNum === pagination.page
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                    : 'bg-[#3a2d52] text-white hover:bg-[#4a3d62]'
                } disabled:opacity-50`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>
        
        <button
          onClick={() => {
            if (pagination.page < pagination.pages && !loading) {
              setPagination(prev => ({ ...prev, page: prev.page + 1 }));
            }
          }}
          disabled={pagination.page === pagination.pages || loading}
          className="px-3 py-1 bg-[#3a2d52] text-white rounded disabled:opacity-50 transition-opacity"
        >
          Next
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
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
                <label className="block text-white mb-1">Artist ID</label>
                <input
                  type="text"
                  value={formData.artist}
                  onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
                  className="w-full p-2 bg-[#3a2d52] text-white rounded border border-gray-600 focus:border-purple-500"
                  placeholder="Artist ObjectId from database"
                />
              </div>
              <div>
                <label className="block text-white mb-1">Cover Image URL</label>
                <input
                  type="url"
                  value={formData.cover}
                  onChange={(e) => setFormData({ ...formData, cover: e.target.value })}
                  className="w-full p-2 bg-[#3a2d52] text-white rounded border border-gray-600 focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-white mb-1">Release Year</label>
                <input
                  type="number"
                  min="1900"
                  max={new Date().getFullYear()}
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
                  className="w-full p-2 bg-[#3a2d52] text-white rounded border border-gray-600 focus:border-purple-500 h-24"
                  placeholder="Album description..."
                />
              </div>
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 rounded hover:opacity-90"
                >
                  {editingAlbum ? 'Update' : 'Create'}
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
      )}
    </div>
  );
};

export default AlbumManagement;
