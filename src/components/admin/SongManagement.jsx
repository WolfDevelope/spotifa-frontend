import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';

const SongManagement = () => {
  const { adminAPI } = useAdmin();
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingSong, setEditingSong] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    album: '',
    duration: '',
    src: '',
    cover: '',
    lyrics: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });

  // Sử dụng ref để track mounted state
  const isMountedRef = React.useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const fetchSongs = async () => {
    console.log('🎵 Fetching songs for page:', pagination.page);
    
    try {
      setLoading(true);
      setError(null); // Clear previous errors
      setSongs([]); // Clear songs trước khi fetch
      
      const response = await adminAPI.getSongs(pagination.page, pagination.limit);
      console.log('🎵 API Response:', response);
      
      if (response && response.success === true) {
        console.log('🎵 Setting songs:', response.data?.length || 0, 'songs');
        setSongs(response.data || []);
        setPagination(prev => ({
          ...prev,
          total: response.pagination?.total || 0,
          pages: response.pagination?.pages || 0
        }));
        console.log('🎵 Songs state updated successfully');
      } else {
        console.log('🎵 Response not successful:', response);
        setError(response?.message || 'Failed to load songs');
        setSongs([]);
      }
    } catch (error) {
      console.error('🎵 Error fetching songs:', error);
      setSongs([]);
      setError('Failed to load songs. Please make sure you are logged in as admin.');
    } finally {
      console.log('🎵 Setting loading to false');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSongs();
  }, [pagination.page]); // Đơn giản hóa dependency

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      if (editingSong) {
        response = await adminAPI.updateSong(editingSong._id, formData);
      } else {
        response = await adminAPI.createSong(formData);
      }

      if (response.success) {
        setShowModal(false);
        setEditingSong(null);
        resetForm();
        fetchSongs();
      }
    } catch (error) {
      console.error('Error saving song:', error);
    }
  };

  const handleEdit = (song) => {
    setEditingSong(song);
    setFormData({
      title: song.title || '',
      artist: song.artist?._id || '',
      album: song.album?._id || '',
      duration: song.duration || '',
      src: song.src || '',
      cover: song.cover || '',
      lyrics: song.lyrics || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this song?')) {
      try {
        const response = await adminAPI.deleteSong(id);
        if (response.success) {
          fetchSongs();
        }
      } catch (error) {
        console.error('Error deleting song:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      artist: '',
      album: '',
      duration: '',
      src: '',
      cover: '',
      lyrics: ''
    });
  };

  const openCreateModal = () => {
    resetForm();
    setEditingSong(null);
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-white">Loading songs...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Song Management</h2>
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
              fetchSongs();
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
        <h2 className="text-2xl font-bold text-white">Song Management</h2>
        <button
          onClick={openCreateModal}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
        >
          Add New Song
        </button>
      </div>

      {/* Songs Table */}
      <div className="bg-[#3a2d52] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#2d2240]">
              <tr>
                <th className="text-left text-white p-4">Title</th>
                <th className="text-left text-white p-4">Artist</th>
                <th className="text-left text-white p-4">Album</th>
                <th className="text-left text-white p-4">Duration</th>
                <th className="text-left text-white p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {songs.map((song) => (
                <tr key={song._id} className="border-t border-[#2d2240]">
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={song.cover || '/default-cover.jpg'}
                        alt={song.title}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <span className="text-white font-medium">{song.title}</span>
                    </div>
                  </td>
                  <td className="p-4 text-gray-300">{song.artist?.name || 'Unknown'}</td>
                  <td className="p-4 text-gray-300">{song.album?.name || 'Unknown'}</td>
                  <td className="p-4 text-gray-300">{song.duration || 'N/A'}</td>
                  <td className="p-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(song)}
                        className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(song._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
                <label className="block text-white mb-1">Artist ID</label>
                <input
                  type="text"
                  value={formData.artist}
                  onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
                  className="w-full p-2 bg-[#3a2d52] text-white rounded border border-gray-600 focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-white mb-1">Album ID</label>
                <input
                  type="text"
                  value={formData.album}
                  onChange={(e) => setFormData({ ...formData, album: e.target.value })}
                  className="w-full p-2 bg-[#3a2d52] text-white rounded border border-gray-600 focus:border-purple-500"
                />
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
                <input
                  type="url"
                  value={formData.src}
                  onChange={(e) => setFormData({ ...formData, src: e.target.value })}
                  className="w-full p-2 bg-[#3a2d52] text-white rounded border border-gray-600 focus:border-purple-500"
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
                <label className="block text-white mb-1">Lyrics</label>
                <textarea
                  value={formData.lyrics}
                  onChange={(e) => setFormData({ ...formData, lyrics: e.target.value })}
                  className="w-full p-2 bg-[#3a2d52] text-white rounded border border-gray-600 focus:border-purple-500 h-24"
                />
              </div>
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 rounded hover:opacity-90"
                >
                  {editingSong ? 'Update' : 'Create'}
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

export default SongManagement;
