import data from '../data';

// Merge playlist with full song details from local data
export const enrichPlaylistWithSongs = (playlist) => {
  if (!playlist || !playlist.songs) return playlist;

  const enrichedSongs = playlist.songs.map(songId => {
    const song = data.songs.find(s => s.id === songId);
    return song || { id: songId, title: 'Unknown Song', artist: 'Unknown Artist' };
  });

  return {
    ...playlist,
    songs: enrichedSongs
  };
};

// Enrich multiple playlists
export const enrichPlaylistsWithSongs = (playlists) => {
  if (!Array.isArray(playlists)) return playlists;
  
  return playlists.map(enrichPlaylistWithSongs);
};

// Generate playlist cover from first 4 songs
export const generatePlaylistCover = (songs) => {
  if (!songs || songs.length === 0) return null;
  
  return songs.slice(0, 4).map(song => song.cover || '/assets/images/default-song-cover.jpg');
};
