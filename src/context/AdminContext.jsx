import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const AdminContext = createContext();

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

export const AdminProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      setIsAdmin(currentUser.role === 'admin');
    } else {
      setIsAdmin(false);
    }
    setLoading(false);
  }, [currentUser]);

  // Helper function to get auth headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  };

  // Admin API calls
  const adminAPI = {
    // Songs
    getSongs: async (page = 1, limit = 20) => {
      try {
        const response = await fetch(`http://localhost:5000/api/admin/songs?page=${page}&limit=${limit}`, {
          headers: getAuthHeaders(),
          credentials: 'include'
        });
        return await response.json();
      } catch (error) {
        console.error('Error fetching songs:', error);
        throw error;
      }
    },

    createSong: async (songData) => {
      try {
        console.log('AdminContext: Creating song with data:', songData);
        console.log('AdminContext: Headers:', getAuthHeaders());
        
        const response = await fetch('http://localhost:5000/api/admin/songs', {
          method: 'POST',
          headers: getAuthHeaders(),
          credentials: 'include',
          body: JSON.stringify(songData)
        });
        
        console.log('AdminContext: Song response status:', response.status);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('AdminContext: Song error response:', errorText);
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }
        
        const result = await response.json();
        console.log('AdminContext: Song success response:', result);
        return result;
      } catch (error) {
        console.error('Error creating song:', error);
        throw error;
      }
    },

    updateSong: async (id, songData) => {
      try {
        const response = await fetch(`http://localhost:5000/api/admin/songs/${id}`, {
          method: 'PUT',
          headers: getAuthHeaders(),
          credentials: 'include',
          body: JSON.stringify(songData)
        });
        return await response.json();
      } catch (error) {
        console.error('Error updating song:', error);
        throw error;
      }
    },

    deleteSong: async (id) => {
      try {
        const response = await fetch(`http://localhost:5000/api/admin/songs/${id}`, {
          method: 'DELETE',
          headers: getAuthHeaders(),
          credentials: 'include'
        });
        return await response.json();
      } catch (error) {
        console.error('Error deleting song:', error);
        throw error;
      }
    },

    // Artists
    getArtists: async (page = 1, limit = 20) => {
      try {
        const response = await fetch(`http://localhost:5000/api/admin/artists?page=${page}&limit=${limit}`, {
          headers: getAuthHeaders(),
          credentials: 'include'
        });
        return await response.json();
      } catch (error) {
        console.error('Error fetching artists:', error);
        throw error;
      }
    },

    createArtist: async (artistData) => {
      try {
        console.log('AdminContext: Creating artist with data:', artistData);
        console.log('AdminContext: Headers:', getAuthHeaders());
        
        const response = await fetch('http://localhost:5000/api/admin/artists', {
          method: 'POST',
          headers: getAuthHeaders(),
          credentials: 'include',
          body: JSON.stringify(artistData)
        });
        
        console.log('AdminContext: Response status:', response.status);
        console.log('AdminContext: Response headers:', response.headers);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('AdminContext: Error response:', errorText);
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }
        
        const result = await response.json();
        console.log('AdminContext: Success response:', result);
        return result;
      } catch (error) {
        console.error('Error creating artist:', error);
        throw error;
      }
    },

    updateArtist: async (id, artistData) => {
      try {
        const response = await fetch(`http://localhost:5000/api/admin/artists/${id}`, {
          method: 'PUT',
          headers: getAuthHeaders(),
          credentials: 'include',
          body: JSON.stringify(artistData)
        });
        return await response.json();
      } catch (error) {
        console.error('Error updating artist:', error);
        throw error;
      }
    },

    deleteArtist: async (id) => {
      try {
        const response = await fetch(`http://localhost:5000/api/admin/artists/${id}`, {
          method: 'DELETE',
          headers: getAuthHeaders(),
          credentials: 'include'
        });
        return await response.json();
      } catch (error) {
        console.error('Error deleting artist:', error);
        throw error;
      }
    },

    // Albums
    getAlbums: async (page = 1, limit = 20) => {
      try {
        const response = await fetch(`http://localhost:5000/api/admin/albums?page=${page}&limit=${limit}`, {
          headers: getAuthHeaders(),
          credentials: 'include'
        });
        return await response.json();
      } catch (error) {
        console.error('Error fetching albums:', error);
        throw error;
      }
    },

    createAlbum: async (albumData) => {
      try {
        const response = await fetch('http://localhost:5000/api/admin/albums', {
          method: 'POST',
          headers: getAuthHeaders(),
          credentials: 'include',
          body: JSON.stringify(albumData)
        });
        return await response.json();
      } catch (error) {
        console.error('Error creating album:', error);
        throw error;
      }
    },

    updateAlbum: async (id, albumData) => {
      try {
        const response = await fetch(`http://localhost:5000/api/admin/albums/${id}`, {
          method: 'PUT',
          headers: getAuthHeaders(),
          credentials: 'include',
          body: JSON.stringify(albumData)
        });
        return await response.json();
      } catch (error) {
        console.error('Error updating album:', error);
        throw error;
      }
    },

    deleteAlbum: async (id) => {
      try {
        const response = await fetch(`http://localhost:5000/api/admin/albums/${id}`, {
          method: 'DELETE',
          headers: getAuthHeaders(),
          credentials: 'include'
        });
        return await response.json();
      } catch (error) {
        console.error('Error deleting album:', error);
        throw error;
      }
    },

    // Users
    getUsers: async (page = 1, limit = 20) => {
      try {
        const response = await fetch(`http://localhost:5000/api/admin/users?page=${page}&limit=${limit}`, {
          headers: getAuthHeaders(),
          credentials: 'include'
        });
        return await response.json();
      } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
      }
    },

    updateUserRole: async (id, role) => {
      try {
        const response = await fetch(`http://localhost:5000/api/admin/users/${id}/role`, {
          method: 'PUT',
          headers: getAuthHeaders(),
          credentials: 'include',
          body: JSON.stringify({ role })
        });
        return await response.json();
      } catch (error) {
        console.error('Error updating user role:', error);
        throw error;
      }
    },

    // Dashboard Stats
    getDashboardStats: async () => {
      try {
        const response = await fetch('http://localhost:5000/api/admin/stats', {
          headers: getAuthHeaders(),
          credentials: 'include'
        });
        return await response.json();
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        throw error;
      }
    }
  };

  const value = {
    isAdmin,
    loading,
    adminAPI
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};
