// API base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function for API calls
const apiCall = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

// Music Service
const musicService = {
  // Songs
  getAllSongs: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/music/songs${queryString ? `?${queryString}` : ''}`);
  },

  getSongById: async (id) => {
    return apiCall(`/music/songs/${id}`);
  },

  getTrendingSongs: async () => {
    return apiCall('/music/songs/trending');
  },

  getNewReleases: async () => {
    return apiCall('/music/songs/new-releases');
  },

  getWeeklyTopSongs: async () => {
    return apiCall('/music/songs/weekly-top');
  },

  getMusicVideos: async () => {
    return apiCall('/music/songs/videos');
  },

  incrementPlayCount: async (songId) => {
    return apiCall(`/music/songs/${songId}/play`, {
      method: 'POST',
    });
  },

  // Artists
  getAllArtists: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/music/artists${queryString ? `?${queryString}` : ''}`);
  },

  getArtistById: async (id) => {
    return apiCall(`/music/artists/${id}`);
  },

  getPopularArtists: async () => {
    return apiCall('/music/artists/popular');
  },

  // Albums
  getAllAlbums: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/music/albums${queryString ? `?${queryString}` : ''}`);
  },

  getAlbumById: async (id) => {
    return apiCall(`/music/albums/${id}`);
  },

  getTopAlbums: async () => {
    return apiCall('/music/albums/top');
  },

  getNewAlbums: async () => {
    return apiCall('/music/albums/new');
  },

  // Playlists
  getAllPlaylists: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/music/playlists${queryString ? `?${queryString}` : ''}`);
  },

  getPlaylistById: async (id) => {
    return apiCall(`/music/playlists/${id}`);
  },

  getMoodPlaylists: async () => {
    return apiCall('/music/playlists/mood');
  },

  getGenrePlaylists: async () => {
    return apiCall('/music/playlists/genres');
  },

  // Search
  searchMusic: async (query, type = 'all') => {
    const params = { search: query };
    
    switch (type) {
      case 'songs':
        return apiCall(`/music/songs?${new URLSearchParams(params).toString()}`);
      case 'artists':
        return apiCall(`/music/artists?${new URLSearchParams(params).toString()}`);
      case 'albums':
        return apiCall(`/music/albums?${new URLSearchParams(params).toString()}`);
      default:
        // Return combined results for 'all'
        const [songs, artists, albums] = await Promise.all([
          apiCall(`/music/songs?${new URLSearchParams(params).toString()}`),
          apiCall(`/music/artists?${new URLSearchParams(params).toString()}`),
          apiCall(`/music/albums?${new URLSearchParams(params).toString()}`)
        ]);
        return {
          success: true,
          data: {
            songs: songs.data,
            artists: artists.data,
            albums: albums.data
          }
        };
    }
  }
};

export default musicService;
