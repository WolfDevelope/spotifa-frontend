import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AUTH_API from '../services/auth';
import { useAuth } from '../context/AuthContext';

const Account = () => {
  const [user, setUser] = useState({
    name: '',
    email: '',
    phone: '',
    about: '',
    genre: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const navigate = useNavigate();
  const { updateProfile, deleteAccount } = useAuth();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchUserData = async () => {
    try {
      const data = await AUTH_API.getCurrentUser();
      const userData = data.data; // lấy đúng object user từ API trả về
      setUser({
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        about: userData.about || '',
        genre: userData.genre || ''
      });
    } catch (error) {
      setMessage({ text: 'Failed to load user data', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ text: '', type: '' });

    try {
      const result = await updateProfile(user); // dùng context 
      if (result && result.success !== false) {
        setMessage({ text: 'Update profile successfully!', type: 'success' });
        setIsEditing(false);
        fetchUserData();
      } else {
        throw new Error(result?.error || 'Update failed');
      }
    } catch (error) {
      setMessage({ text: error.message || 'Failed to update profile', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteAccount(); // Use context method instead of direct API call
      if (result && result.success !== false) {
        setMessage({ text: 'Account deleted successfully!', type: 'success' });
        
        // Force logout and redirect after showing success message
        setTimeout(() => {
          window.location.href = '/login'; // Force full page reload to clear all state
        }, 2000);
      } else {
        throw new Error(result?.error || 'Delete failed');
      }
    } catch (error) {
      setMessage({ text: error.message || 'Failed to delete account', type: 'error' });
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-[#22172b] to-[#3d2a3f]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  // Phần JSX giữ nguyên như trước
  return (
    <div className="bg-gradient-to-b from-[#22172b] to-[#3d2a3f] min-h-screen text-white font-sans flex">
      
      <main className="flex-1 px-8 py-6" style={{ marginLeft: '16rem' }}>
        
        
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Your Account</h1>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-pink-500 hover:bg-pink-600 rounded-lg transition-colors"
              >
                Edit Information
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setIsEditing(false);
                    // Reset form khi hủy
                    fetchUserData(user._id);
                  }}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSaving}
                  className="px-4 py-2 bg-pink-500 hover:bg-pink-600 rounded-lg transition-colors disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : 'Save changes'}
                </button>
              </div>
            )}
          </div>

          {message.text && (
            <div 
              className={`mb-6 p-4 rounded-lg ${
                message.type === 'error' ? 'bg-red-500/20 border border-red-500' : 'bg-green-500/20 border border-green-500'
              }`}
            >
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-[#2d2240] rounded-xl p-8 shadow-lg">
              <div className="flex items-center gap-6 mb-8">
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-4xl font-bold">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <h2 className="text-2xl font-bold">
                    {isEditing ? (
                      <input
                        type="text"
                        name="name"
                        value={user.name}
                        onChange={handleChange}
                        className="bg-transparent border-b border-white/30 focus:border-pink-500 focus:outline-none"
                        required
                      />
                    ) : (
                      user.name
                    )}
                  </h2>
                  <p className="text-gray-300">{user.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Phone</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        name="phone"
                        value={user.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg bg-[#3d2e4a] text-white focus:outline-none focus:ring-2 focus:ring-pink-400"
                      />
                    ) : (
                      <p>{user.phone || 'Not updated'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">About</label>
                    {isEditing ? (
                      <textarea
                        name="about"
                        rows="3"
                        value={user.about}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg bg-[#3d2e4a] text-white focus:outline-none focus:ring-2 focus:ring-pink-400"
                      />
                    ) : (
                      <p className="whitespace-pre-line">{user.about || 'Not updated'}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Favorite genre</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="genre"
                        value={user.genre}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg bg-[#3d2e4a] text-white focus:outline-none focus:ring-2 focus:ring-pink-400"
                        placeholder="Example: Pop, Rock, EDM..."
                      />
                    ) : (
                      <p>{user.genre || 'Not updated'}</p>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Nút xóa tài khoản ở góc dưới bên phải */}
              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete Account
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Modal xác nhận xóa tài khoản */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-[#2d2240] rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-xl font-bold text-white mb-4">Delete Account</h3>
              <p className="text-gray-300 mb-6">
                Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently deleted.
              </p>
              <div className="flex gap-4 justify-end">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={isDeleting}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {isDeleting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                      Deleting...
                    </>
                  ) : (
                    'Delete Account'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Account;