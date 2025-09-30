import data from '../data';
import musicService from '../services/musicService';

// Cache for API data to avoid repeated calls
let apiSongsCache = null;
let apiArtistsCache = null;

// Load songs from API with caching
const loadApiSongs = async () => {
  if (apiSongsCache) return apiSongsCache;
  
  try {
    const response = await musicService.getAllSongs({ limit: 100 });
    if (response.success && response.data.length > 0) {
      apiSongsCache = response.data;
      return apiSongsCache;
    }
  } catch (error) {
    console.error('Error loading API songs:', error);
  }
  
  return data.songs; // Fallback to local data
};

// Load artists from API with caching
const loadApiArtists = async () => {
  if (apiArtistsCache) return apiArtistsCache;
  
  try {
    const response = await musicService.getAllArtists({ limit: 100 });
    if (response.success && response.data.length > 0) {
      apiArtistsCache = response.data;
      return apiArtistsCache;
    }
  } catch (error) {
    console.error('Error loading API artists:', error);
  }
  
  return data.artists; // Fallback to local data
};

// Merge playlist with full song details from API or local data
export const enrichPlaylistWithSongs = async (playlist) => {
  if (!playlist || !playlist.songs) return playlist;

  const [allSongs, allArtists] = await Promise.all([
    loadApiSongs(),
    loadApiArtists()
  ]);

  console.log('Enriching playlist with:', allSongs.length, 'songs and', allArtists.length, 'artists');

  const enrichedSongs = playlist.songs.map(songId => {
    // Try to find song in API data first (by _id), then local data (by id)
    let song = allSongs.find(s => (s._id || s.id) === songId);
    
    if (song) {
      // If song found, enrich with artist info
      let artist;
      if (song.artist) {
        if (typeof song.artist === 'string') {
          // Artist is ID, find in allArtists
          artist = allArtists.find(a => (a._id || a.id) === song.artist);
        } else {
          // Artist is already populated
          artist = song.artist;
        }
      } else if (song.artistId) {
        // Local data format
        artist = allArtists.find(a => (a._id || a.id) === song.artistId);
      }
      
      const enrichedSong = {
        ...song,
        artistName: artist?.name || 'Unknown Artist'
      };
      
      // Debug log to check artist enrichment
      if (!artist && song.artist) {
        console.log('Artist not found for song:', song.title, 'Artist ID:', song.artist);
      }
      
      return enrichedSong;
    }
    
    return { 
      _id: songId, 
      id: songId, 
      title: 'Unknown Song', 
      artistName: 'Unknown Artist',
      cover: '/assets/images/default-song-cover.jpg'
    };
  });

  return {
    ...playlist,
    songs: enrichedSongs
  };
};

// Enrich multiple playlists
export const enrichPlaylistsWithSongs = async (playlists) => {
  if (!Array.isArray(playlists)) return playlists;
  
  return Promise.all(playlists.map(enrichPlaylistWithSongs));
};

// Generate playlist cover from first 4 songs
export const generatePlaylistCover = (songs) => {
  if (!songs || songs.length === 0) return null;
  
  return songs.slice(0, 4).map(song => song.cover || '/assets/images/default-song-cover.jpg');
};
