import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';

const ArtistManagement = () => {
  const { adminAPI } = useAdmin();
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingArtist, setEditingArtist] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    avatar: '',
    bio: '',
    genre: '',
    country: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12, // Thay đổi từ 10 thành 12
    total: 0,
    pages: 0
  });

  useEffect(() => {
    fetchArtists();
  }, [pagination.page]);

  const fetchArtists = async () => {
    console.log('🎨 Fetching artists for page:', pagination.page);
    
    try {
      setLoading(true);
      setError(null); // Clear previous errors
      setArtists([]); // Clear artists trước khi fetch
      
      const response = await adminAPI.getArtists(pagination.page, pagination.limit);
      console.log('🎨 API Response:', response);
      
      if (response && response.success === true) {
        console.log('🎨 Setting artists:', response.data?.length || 0, 'artists');
        setArtists(response.data || []);
        setPagination(prev => ({
          ...prev,
          total: response.pagination?.total || 0,
          pages: response.pagination?.pages || 0
        }));
        console.log('🎨 Artists state updated successfully');
      } else {
        console.log('🎨 Response not successful:', response);
        setError(response?.message || 'Failed to load artists');
        setArtists([]);
      }
    } catch (error) {
      console.error('🎨 Error fetching artists:', error);
      setArtists([]);
      setError('Failed to load artists. Please make sure you are logged in as admin.');
    } finally {
      console.log('🎨 Setting loading to false');
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      if (editingArtist) {
        response = await adminAPI.updateArtist(editingArtist._id, formData);
      } else {
        response = await adminAPI.createArtist(formData);
      }

      if (response.success) {
        setShowModal(false);
        setEditingArtist(null);
        resetForm();
        fetchArtists();
      }
    } catch (error) {
      console.error('Error saving artist:', error);
    }
  };

  const handleEdit = (artist) => {
    setEditingArtist(artist);
    setFormData({
      name: artist.name || '',
      avatar: artist.avatar || '',
      bio: artist.bio || '',
      genre: artist.genre || '',
      country: artist.country || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this artist?')) {
      try {
        const response = await adminAPI.deleteArtist(id);
        if (response.success) {
          fetchArtists();
        }
      } catch (error) {
        console.error('Error deleting artist:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      avatar: '',
      bio: '',
      genre: '',
      country: ''
    });
  };

  const openCreateModal = () => {
    resetForm();
    setEditingArtist(null);
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-white">Loading artists...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Artist Management</h2>
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
              fetchArtists();
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
        <h2 className="text-2xl font-bold text-white">Artist Management</h2>
        <button
          onClick={openCreateModal}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
        >
          Add New Artist
        </button>
      </div>

      {/* Artists Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {artists.map((artist) => (
          <div key={artist._id} className="bg-[#3a2d52] rounded-lg p-4">
            <div className="flex flex-col items-center text-center">
              <img
                src={artist.avatar || '/default-avatar.jpg'}
                alt={artist.name}
                className="w-24 h-24 rounded-full object-cover mb-3"
              />
              <h3 className="text-white font-semibold text-lg mb-1">{artist.name}</h3>
              <p className="text-gray-400 text-sm mb-2">{artist.genre || 'Unknown Genre'}</p>
              <p className="text-gray-500 text-xs mb-3">{artist.country || 'Unknown Country'}</p>
              
              {artist.bio && (
                <p className="text-gray-300 text-xs mb-3 line-clamp-2">
                  {artist.bio.length > 100 ? `${artist.bio.substring(0, 100)}...` : artist.bio}
                </p>
              )}
              
              <div className="flex space-x-2 w-full">
                <button
                  onClick={() => handleEdit(artist)}
                  className="flex-1 bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(artist._id)}
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
                  type="url"
                  value={formData.avatar}
                  onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
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
                <label className="block text-white mb-1">Country</label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="w-full p-2 bg-[#3a2d52] text-white rounded border border-gray-600 focus:border-purple-500"
                  placeholder="e.g., USA, UK, Vietnam"
                />
              </div>
              <div>
                <label className="block text-white mb-1">Biography</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full p-2 bg-[#3a2d52] text-white rounded border border-gray-600 focus:border-purple-500 h-24"
                  placeholder="Artist biography..."
                />
              </div>
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 rounded hover:opacity-90"
                >
                  {editingArtist ? 'Update' : 'Create'}
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

export default ArtistManagement;
