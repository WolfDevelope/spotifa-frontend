import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { CreateSongModal, LittleCreateArtistModal, LittleCreateAlbumModal, ConfirmDeleteModal, SuccessModal } from './modals';
import UploadSongModal from './modals/UploadSongModal';

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
  
  const [artists, setArtists] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [loadingDropdowns, setLoadingDropdowns] = useState(false);
  
  // Modal states for creating artist/album
  const [showArtistModal, setShowArtistModal] = useState(false);
  const [showAlbumModal, setShowAlbumModal] = useState(false);
  const [artistFormData, setArtistFormData] = useState({ name: '', genre: '', country: '' });
  const [albumFormData, setAlbumFormData] = useState({ name: '', artist: '', year: '' });
  
  // Modal state for delete confirmation
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [songToDelete, setSongToDelete] = useState(null);
  
  // Modal state for success notification
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [successType, setSuccessType] = useState('success');
  
  // Modal state for upload song from computer
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });

  // Sử dụng ref để track mounted state
  const isMountedRef = React.useRef(true);

  // Helper function to show success message
  const showSuccess = (message, type = "success") => {
    setSuccessMessage(message);
    setSuccessType(type);
    setShowSuccessModal(true);
  };

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Test server connection
  const testServerConnection = async () => {
    try {
      console.log('🔍 Testing server connection...');
      // Test với endpoint admin songs thay vì health
      const response = await fetch('http://localhost:5000/api/admin/songs?page=1&limit=1', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok || response.status === 401) {
        // 200 = OK, 401 = Unauthorized nhưng server vẫn chạy
        console.log('✅ Server is running');
        return true;
      } else {
        console.log('❌ Server responded with error:', response.status);
        return false;
      }
    } catch (error) {
      console.log('❌ Server connection failed:', error.message);
      return false;
    }
  };

  const fetchSongs = async () => {
    console.log('🎵 Fetching songs for page:', pagination.page);
    
    try {
      setLoading(true);
      setError(null);
      
      console.log('🎵 Calling adminAPI.getSongs...');
      const response = await adminAPI.getSongs(pagination.page, pagination.limit);
      console.log('🎵 API Response:', response);
      
      if (response && response.success) {
        console.log('🎵 Songs data:', response.data);
        setSongs(response.data || []);
        
        // API trả về pagination object
        if (response.pagination) {
          setPagination(prev => ({
            ...prev,
            total: response.pagination.total || 0,
            pages: response.pagination.pages || 0
          }));
        }
      } else {
        console.error('🎵 API Error:', response);
        setError(response?.message || 'Failed to load songs');
      }
    } catch (error) {
      console.error('🎵 Fetch error:', error);
      setError('Failed to load songs: ' + error.message);
    } finally {
      console.log('🎵 Setting loading to false');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSongs();
  }, [pagination.page]);

  // Load artists and albums for dropdowns
  const loadDropdownData = async () => {
    try {
      setLoadingDropdowns(true);
      
      // Load all artists (without pagination)
      const artistsResponse = await adminAPI.getArtists(1, 100); // Get first 100 artists
      if (artistsResponse.success) {
        setArtists(artistsResponse.data || []);
      }
      
      // Load all albums (without pagination)
      const albumsResponse = await adminAPI.getAlbums(1, 100); // Get first 100 albums
      if (albumsResponse.success) {
        setAlbums(albumsResponse.data || []);
      }
    } catch (error) {
      console.error('Error loading dropdown data:', error);
    } finally {
      setLoadingDropdowns(false);
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
      console.log('Creating artist with data:', {
        name: artistFormData.name,
        avatar: '',
        bio: '',
        genre: artistFormData.genre,
        country: artistFormData.country
      });
      
      // Prepare artist data with default avatar
      const artistData = {
        name: artistFormData.name,
        avatar: '/assets/images/artist-icon.png', // Default avatar
        bio: `${artistFormData.name} is a talented artist.`, // Default bio
        genre: artistFormData.genre || 'Unknown',
        country: artistFormData.country || 'Unknown'
      };
      
      console.log('Creating artist with prepared data:', artistData);
      
      const response = await adminAPI.createArtist(artistData);
      
      console.log('Create artist response:', response);
      
      if (response.success) {
        // Add new artist to the list
        setArtists(prev => [...prev, response.data]);
        // Auto-select the new artist
        setFormData(prev => ({ ...prev, artist: response.data._id }));
        setShowArtistModal(false);
        
      } else {
        console.error('Artist creation failed:', response);
        alert(`Failed to create artist: ${response.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error creating artist:', error);
      alert(`Failed to create artist: ${error.message || 'Network error'}`);
    }
  };

  // Open album creation modal
  const openAlbumModal = () => {
    if (!formData.artist) {
      alert('Please select an artist first before creating an album.');
      return;
    }
    setAlbumFormData({ name: '', year: new Date().getFullYear() });
    setShowAlbumModal(true);
  };

  // Create new album
  const createNewAlbum = async () => {
    try {
      console.log('Creating album:', { name: albumFormData.name, artist: formData.artist });
      
      const response = await adminAPI.createAlbum({
        name: albumFormData.name,
        artist: formData.artist,
        year: albumFormData.year
        // Let backend use defaults for cover, genre
      });
      
      console.log('Create album response:', response);
      
      if (response.success) {
        // Add new album to the list
        setAlbums(prev => [...prev, response.data]);
        // Auto-select the new album
        setFormData(prev => ({ ...prev, album: response.data._id }));
        setShowAlbumModal(false);
        
      } else {
        console.error('Create album failed:', response);
        alert(`Failed to create album: ${response.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error creating album:', error);
      alert(`Failed to create album: ${error.message || 'Network error'}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validate required fields
      if (!formData.title || !formData.title.trim()) {
        alert('Title is required');
        return;
      }
      if (!formData.artist) {
        alert('Artist is required');
        return;
      }
      
      // Helper function to convert duration string to seconds
      const durationToSeconds = (duration) => {
        if (!duration || duration === '0:00') return 0;
        const parts = duration.split(':');
        if (parts.length === 2) {
          const minutes = parseInt(parts[0]) || 0;
          const seconds = parseInt(parts[1]) || 0;
          return minutes * 60 + seconds;
        }
        return 0;
      };

      // Try format similar to existing data structure from memory
      const durationStr = formData.duration?.trim() || '0:00';
      let submitData = {
        title: formData.title.trim(),
        artist: formData.artist,
        cover: formData.cover?.trim() || '/assets/images/song-icon.png',
        src: formData.src?.trim() || '',
        duration: durationStr,
        durationSec: durationToSeconds(durationStr), // Required field!
        lyrics: formData.lyrics?.trim() || ''
      };
      
      // Only add album if it's selected (not empty)
      if (formData.album && formData.album.trim()) {
        submitData.album = formData.album;
      }
      
      console.log('Trying complete song data structure:', submitData);
      console.log('Artist ID format:', typeof formData.artist, formData.artist.length);
      
      // Show success message immediately
      const action = editingSong ? 'updated' : 'created';
      showSuccess(`Song "${formData.title}" ${action} successfully!`);
      
      // Close modal and reset form immediately
      setShowModal(false);
      setEditingSong(null);
      resetForm();
      
      let response;
      if (editingSong) {
        response = await adminAPI.updateSong(editingSong._id, submitData);
      } else {
        response = await adminAPI.createSong(submitData);
      }

      if (response.success) {
        // Refresh songs list after API success
        fetchSongs();
      } else {
        // If API fails, show error and revert success message
        console.error('API failed:', response);
        setShowSuccessModal(false);
        alert(`Failed to ${action} song. Please try again.`);
      }
      
    } catch (error) {
      console.error('Error saving song:', error);
      // Hide success modal if there's an error
      setShowSuccessModal(false);
      alert('Error saving song: ' + error.message);
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
    loadDropdownData(); // Load dropdown data when editing
    setShowModal(true);
  };

  const handleDelete = (song) => {
    setSongToDelete(song);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      // Show delete success message immediately
      showSuccess(`Song "${songToDelete.title}" deleted successfully!`, "delete");
      
      const response = await adminAPI.deleteSong(songToDelete._id);
      if (response.success) {
        fetchSongs();
        console.log(`Song "${songToDelete.title}" deleted successfully`);
      } else {
        // If API fails, hide success message and show error
        setShowSuccessModal(false);
        alert('Failed to delete song. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting song:', error);
      setShowSuccessModal(false);
      alert('Error deleting song: ' + error.message);
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
    loadDropdownData(); // Load dropdown data when creating
    setShowModal(true);
  };
  
  // Handle upload success from UploadSongModal
  const handleUploadSuccess = (uploadedSong) => {
    console.log('Upload success:', uploadedSong);
    
    // Tự động điền thông tin vào form
    setFormData(prev => ({
      ...prev,
      src: uploadedSong.src || '',
      title: uploadedSong.title || prev.title,
      duration: uploadedSong.duration || prev.duration,
      artist: uploadedSong.artist || prev.artist,
      album: uploadedSong.album || prev.album,
      lyrics: uploadedSong.lyrics || prev.lyrics
    }));
    
    // Đóng upload modal
    setShowUploadModal(false);
    
    // Hiển thị thông báo thành công
    showSuccess('File uploaded successfully! URL has been filled in.');
  };

  // Render content based on state
  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center py-8 space-y-4">
          <div className="text-white">Loading songs...</div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center py-8 space-y-4">
          <div className="text-red-400 text-center">
            <p className="text-lg font-semibold">Error Loading Songs</p>
            <p className="text-sm">{error}</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => {
                setError(null);
                fetchSongs();
              }}
              className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={async () => {
                try {
                  const response = await fetch('http://localhost:5000/api/admin/songs?page=1&limit=1', {
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                  });
                  const data = await response.json();
                  console.log('Direct API test:', data);
                  alert(`Server response: ${response.status} - ${JSON.stringify(data)}`);
                } catch (error) {
                  alert(`Server error: ${error.message}`);
                }
              }}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
            >
              Test API
            </button>
          </div>
        </div>
      );
    }

    // Main content when loaded successfully
    return (
      <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Song Management</h2>
        <button
          onClick={openCreateModal}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded hover:opacity-90 transition-opacity"
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
                        src={song.cover || '/assets/images/song-icon.png'}
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
                        onClick={() => handleDelete(song)}
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

        {songs.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-400">No songs found. Add your first song!</p>
          </div>
        )}
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

      <CreateSongModal
        showModal={showModal}
        setShowModal={setShowModal}
        editingSong={editingSong}
        formData={formData}
        setFormData={setFormData}
        handleSubmit={handleSubmit}
        artists={artists}
        albums={albums}
        loadingDropdowns={loadingDropdowns}
        openArtistModal={openArtistModal}
        openAlbumModal={openAlbumModal}
        onOpenUploadModal={() => setShowUploadModal(true)}
      />
      
      <UploadSongModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onSuccess={handleUploadSuccess}
        artists={artists}
        albums={albums}
      />

      <LittleCreateArtistModal
        showModal={showArtistModal}
        setShowModal={setShowArtistModal}
        formData={artistFormData}
        setFormData={setArtistFormData}
        onCreateArtist={createNewArtist}
      />

      <LittleCreateAlbumModal
        showModal={showAlbumModal}
        setShowModal={setShowAlbumModal}
        formData={albumFormData}
        setFormData={setAlbumFormData}
        onCreateAlbum={createNewAlbum}
        selectedArtist={artists.find(a => a._id === formData.artist)?.name}
      />
      </div>
    );
  };

  console.log('🎵 Rendering SongManagement, songs count:', songs.length, 'loading:', loading, 'error:', error);

  return (
    <>
      {renderContent()}

      {/* Modals always render outside of loading/error states */}
      <ConfirmDeleteModal
        showModal={showDeleteModal}
        setShowModal={setShowDeleteModal}
        onConfirm={confirmDelete}
        title="Delete Song"
        message="Are you sure you want to delete this song? This action cannot be undone."
        itemName={songToDelete?.title}
        confirmText="Delete Song"
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

export default SongManagement;
