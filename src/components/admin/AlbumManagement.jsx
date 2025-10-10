import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { CreateAlbumModal, LittleCreateArtistModal, ConfirmDeleteModal, SuccessModal } from './modals';

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
  
  // Data for dropdown
  const [artists, setArtists] = useState([]);
  const [loadingDropdown, setLoadingDropdown] = useState(false);
  
  // Modal state for creating artist
  const [showArtistModal, setShowArtistModal] = useState(false);
  const [artistFormData, setArtistFormData] = useState({ name: '', genre: '', country: '' });
  
  // Modal state for delete confirmation
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [albumToDelete, setAlbumToDelete] = useState(null);
  
  // Modal state for success notification
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [successType, setSuccessType] = useState('success');
  
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0
  });

  useEffect(() => {
    fetchAlbums();
  }, [pagination.page]);

  // Helper function to show success message
  const showSuccess = (message, type = "success") => {
    setSuccessMessage(message);
    setSuccessType(type);
    setShowSuccessModal(true);
  };

  // Load artists for dropdown
  const loadArtists = async () => {
    try {
      setLoadingDropdown(true);
      
      // Load all artists (without pagination)
      const artistsResponse = await adminAPI.getArtists(1, 100); // Get first 100 artists
      if (artistsResponse.success) {
        setArtists(artistsResponse.data || []);
      }
    } catch (error) {
      console.error('Error loading artists:', error);
    } finally {
      setLoadingDropdown(false);
    }
  };

  // Open artist creation modal
  const openArtistModal = () => {
    setArtistFormData({ name: '', genre: '', country: '' });
    setShowArtistModal(true);
  };

  // Create new artist
  const createNewArtist = async () => {
    try {
      const response = await adminAPI.createArtist({ 
        name: artistFormData.name,
        avatar: '/assets/images/artist-icon.png', // Default avatar
        bio: `${artistFormData.name} is a talented artist.`, // Default bio
        genre: artistFormData.genre || 'Unknown',
        country: artistFormData.country || 'Unknown'
      });
      
      if (response.success) {
        // Add new artist to the list
        setArtists(prev => [...prev, response.data]);
        // Auto-select the new artist
        setFormData(prev => ({ ...prev, artist: response.data._id }));
        setShowArtistModal(false);
        
      }
    } catch (error) {
      console.error('Error creating artist:', error);
      alert('Failed to create artist. Please try again.');
    }
  };

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

  const handleCreateAlbum = async (e) => {
    e.preventDefault();
    try {
      // Prepare data with default cover if empty
      const submitData = {
        ...formData,
        cover: formData.cover?.trim() || '/assets/images/album-icon.png'
      };
      
      console.log('Creating album with data:', submitData);
      
      // Show success message immediately
      showSuccess(`Album "${formData.name}" created successfully!`);
      
      // Close modal and reset form immediately
      setShowModal(false);
      resetForm();
      
      const response = await adminAPI.createAlbum(submitData);
      
      if (response.success) {
        console.log('Album created successfully:', response.data);
        fetchAlbums();
      } else {
        console.error('Create album failed:', response);
        setShowSuccessModal(false);
        alert('Failed to create album. Please try again.');
      }
    } catch (error) {
      console.error('Error creating album:', error);
      setShowSuccessModal(false);
      alert('Error creating album: ' + error.message);
    }
  };

  const handleUpdateAlbum = async (e) => {
    e.preventDefault();
    try {
      console.log('Updating album with data:', formData);
      
      // Show success message immediately
      showSuccess(`Album "${formData.name}" updated successfully!`);
      
      // Close modal and reset form immediately
      setShowModal(false);
      setEditingAlbum(null);
      resetForm();
      
      const response = await adminAPI.updateAlbum(editingAlbum._id, formData);
      
      if (response.success) {
        console.log('Album updated successfully:', response.data);
        fetchAlbums();
      } else {
        console.error('Update album failed:', response);
        setShowSuccessModal(false);
        alert('Failed to update album. Please try again.');
      }
    } catch (error) {
      console.error('Error updating album:', error);
      setShowSuccessModal(false);
      alert('Error updating album: ' + error.message);
    }
  };

  const handleEdit = (album) => {
    setEditingAlbum(album);
    setFormData({
      name: album.name || '',
      artist: album.artist?._id || '',
      cover: album.cover || '/assets/images/album-icon.png',
      year: album.year || '',
      genre: album.genre || '',
      description: album.description || ''
    });
    loadArtists(); // Load artists for dropdown
    setShowModal(true);
  };

  const handleDelete = (album) => {
    setAlbumToDelete(album);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      // Show delete success message immediately
      showSuccess(`Album "${albumToDelete.name}" deleted successfully!`, "delete");
      
      const response = await adminAPI.deleteAlbum(albumToDelete._id);
      if (response.success) {
        fetchAlbums();
        console.log(`Album "${albumToDelete.name}" deleted successfully`);
      } else {
        setShowSuccessModal(false);
        alert('Failed to delete album. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting album:', error);
      setShowSuccessModal(false);
      alert('Error deleting album: ' + error.message);
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
    loadArtists(); // Load artists for dropdown
    setShowModal(true);
  };

  // Render content based on state
  const renderContent = () => {
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

    // Main content when loaded successfully
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
                src={album.cover || '/assets/images/album-icon.png'}
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
                  onClick={() => handleDelete(album)}
                  className="flex-1 bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {albums.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-400">No albums found. Add your first album!</p>
        </div>
      )}

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

      <CreateAlbumModal
        showModal={showModal}
        setShowModal={setShowModal}
        editingAlbum={editingAlbum}
        formData={formData}
        setFormData={setFormData}
        handleSubmit={editingAlbum ? handleUpdateAlbum : handleCreateAlbum}
        artists={artists}
        loadingDropdown={loadingDropdown}
        openArtistModal={openArtistModal}
      />

      <LittleCreateArtistModal
        showModal={showArtistModal}
        setShowModal={setShowArtistModal}
        formData={artistFormData}
        setFormData={setArtistFormData}
        onCreateArtist={createNewArtist}
      />

      </div>
    );
  };

  return (
    <>
      {renderContent()}

      {/* Modals always render outside of loading/error states */}
      <CreateAlbumModal
        showModal={showModal}
        setShowModal={setShowModal}
        editingAlbum={editingAlbum}
        formData={formData}
        setFormData={setFormData}
        handleSubmit={editingAlbum ? handleUpdateAlbum : handleCreateAlbum}
        artists={artists}
        loadingDropdown={loadingDropdown}
        openArtistModal={openArtistModal}
      />

      <LittleCreateArtistModal
        showModal={showArtistModal}
        setShowModal={setShowArtistModal}
        formData={artistFormData}
        setFormData={setArtistFormData}
        onCreateArtist={createNewArtist}
      />

      <ConfirmDeleteModal
        showModal={showDeleteModal}
        setShowModal={setShowDeleteModal}
        onConfirm={confirmDelete}
        title="Delete Album"
        message="Are you sure you want to delete this album? This action cannot be undone."
        itemName={albumToDelete?.name}
        confirmText="Delete Album"
        cancelText="Cancel"
      />

      <SuccessModal
        showModal={showSuccessModal}
        setShowModal={setShowSuccessModal}
        title={successType === "delete" ? "Deleted!" : "Success!"}
        message={successMessage}
        type={successType}
        autoClose={true}
        autoCloseDelay={3000}
      />
    </>
  );
};

export default AlbumManagement;
