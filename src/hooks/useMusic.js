import { useState, useEffect, useCallback } from 'react';
import musicService from '../services/musicService';

// Custom hook for music data management
export const useMusic = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Songs state
  const [songs, setSongs] = useState([]);
  const [trendingSongs, setTrendingSongs] = useState([]);
  const [newReleases, setNewReleases] = useState([]);
  const [weeklyTopSongs, setWeeklyTopSongs] = useState([]);
  const [musicVideos, setMusicVideos] = useState([]);

  // Artists state
  const [artists, setArtists] = useState([]);
  const [popularArtists, setPopularArtists] = useState([]);

  // Albums state
  const [albums, setAlbums] = useState([]);
  const [topAlbums, setTopAlbums] = useState([]);
  const [newAlbums, setNewAlbums] = useState([]);

  // Playlists state
  const [playlists, setPlaylists] = useState([]);
  const [moodPlaylists, setMoodPlaylists] = useState([]);
  const [genrePlaylists, setGenrePlaylists] = useState([]);

  // Generic API call handler
  const handleApiCall = useCallback(async (apiFunction, setter, errorMessage) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiFunction();
      if (response.success) {
        setter(response.data);
      } else {
        throw new Error(response.message || errorMessage);
      }
    } catch (err) {
      setError(err.message || errorMessage);
      console.error(errorMessage, err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Songs methods
  const fetchAllSongs = useCallback((params) => {
    return handleApiCall(
      () => musicService.getAllSongs(params),
      setSongs,
      'Failed to fetch songs'
    );
  }, [handleApiCall]);

  const fetchTrendingSongs = useCallback(() => {
    return handleApiCall(
      musicService.getTrendingSongs,
      setTrendingSongs,
      'Failed to fetch trending songs'
    );
  }, [handleApiCall]);

  const fetchNewReleases = useCallback(() => {
    return handleApiCall(
      musicService.getNewReleases,
      setNewReleases,
      'Failed to fetch new releases'
    );
  }, [handleApiCall]);

  const fetchWeeklyTopSongs = useCallback(() => {
    return handleApiCall(
      musicService.getWeeklyTopSongs,
      setWeeklyTopSongs,
      'Failed to fetch weekly top songs'
    );
  }, [handleApiCall]);

  const fetchMusicVideos = useCallback(() => {
    return handleApiCall(
      musicService.getMusicVideos,
      setMusicVideos,
      'Failed to fetch music videos'
    );
  }, [handleApiCall]);

  // Artists methods
  const fetchAllArtists = useCallback((params) => {
    return handleApiCall(
      () => musicService.getAllArtists(params),
      setArtists,
      'Failed to fetch artists'
    );
  }, [handleApiCall]);

  const fetchPopularArtists = useCallback(() => {
    return handleApiCall(
      musicService.getPopularArtists,
      setPopularArtists,
      'Failed to fetch popular artists'
    );
  }, [handleApiCall]);

  // Albums methods
  const fetchAllAlbums = useCallback((params) => {
    return handleApiCall(
      () => musicService.getAllAlbums(params),
      setAlbums,
      'Failed to fetch albums'
    );
  }, [handleApiCall]);

  const fetchTopAlbums = useCallback(() => {
    return handleApiCall(
      musicService.getTopAlbums,
      setTopAlbums,
      'Failed to fetch top albums'
    );
  }, [handleApiCall]);

  const fetchNewAlbums = useCallback(() => {
    return handleApiCall(
      musicService.getNewAlbums,
      setNewAlbums,
      'Failed to fetch new albums'
    );
  }, [handleApiCall]);

  // Playlists methods
  const fetchAllPlaylists = useCallback((params) => {
    return handleApiCall(
      () => musicService.getAllPlaylists(params),
      setPlaylists,
      'Failed to fetch playlists'
    );
  }, [handleApiCall]);

  const fetchMoodPlaylists = useCallback(() => {
    return handleApiCall(
      musicService.getMoodPlaylists,
      setMoodPlaylists,
      'Failed to fetch mood playlists'
    );
  }, [handleApiCall]);

  const fetchGenrePlaylists = useCallback(() => {
    return handleApiCall(
      musicService.getGenrePlaylists,
      setGenrePlaylists,
      'Failed to fetch genre playlists'
    );
  }, [handleApiCall]);

  // Play count increment
  const incrementPlayCount = useCallback(async (songId) => {
    try {
      await musicService.incrementPlayCount(songId);
    } catch (err) {
      console.error('Failed to increment play count:', err);
    }
  }, []);

  // Search functionality
  const searchMusic = useCallback(async (query, type = 'all') => {
    try {
      setLoading(true);
      setError(null);
      const response = await musicService.searchMusic(query, type);
      return response;
    } catch (err) {
      setError(err.message || 'Search failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Initialize data on mount
  useEffect(() => {
    const initializeData = async () => {
      try {
        // Fetch essential data for home page
        await Promise.all([
          fetchTrendingSongs(),
          fetchNewReleases(),
          fetchWeeklyTopSongs(),
          fetchMusicVideos(),
          fetchPopularArtists(),
          fetchTopAlbums(),
          fetchNewAlbums(),
          fetchMoodPlaylists(),
          fetchGenrePlaylists()
        ]);
      } catch (err) {
        console.error('Failed to initialize music data:', err);
      }
    };

    initializeData();
  }, [
    fetchTrendingSongs,
    fetchNewReleases,
    fetchWeeklyTopSongs,
    fetchMusicVideos,
    fetchPopularArtists,
    fetchTopAlbums,
    fetchNewAlbums,
    fetchMoodPlaylists,
    fetchGenrePlaylists
  ]);

  return {
    // State
    loading,
    error,
    songs,
    trendingSongs,
    newReleases,
    weeklyTopSongs,
    musicVideos,
    artists,
    popularArtists,
    albums,
    topAlbums,
    newAlbums,
    playlists,
    moodPlaylists,
    genrePlaylists,

    // Methods
    fetchAllSongs,
    fetchTrendingSongs,
    fetchNewReleases,
    fetchWeeklyTopSongs,
    fetchMusicVideos,
    fetchAllArtists,
    fetchPopularArtists,
    fetchAllAlbums,
    fetchTopAlbums,
    fetchNewAlbums,
    fetchAllPlaylists,
    fetchMoodPlaylists,
    fetchGenrePlaylists,
    incrementPlayCount,
    searchMusic,

    // Clear error
    clearError: () => setError(null)
  };
};

export default useMusic;
