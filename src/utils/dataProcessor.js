// src/utils/dataProcessor.js
import data from '../data'; // Đảm bảo đường dẫn đúng đến file data.js của bạn

// Các hàm tìm kiếm trực tiếp trong các mảng chính
export const findSongById = (id) => data.songs.find(song => song.id === id);
export const findAlbumById = (id) => data.albums.find(album => album.id === id);
export const findArtistById = (id) => data.artists.find(artist => artist.id === id);

// Các hàm tiện ích để lấy các bài hát/album/nghệ sĩ liên quan
export const getSongsByArtistId = (artistId) => data.songs.filter(song => song.artistId === artistId);
export const getAlbumsByArtistId = (artistId) => data.albums.filter(album => album.artistId === artistId);
export const getSongsByAlbumId = (albumId) => data.songs.filter(song => song.albumId === albumId);

// Export trực tiếp các mảng để sử dụng ở các trang danh sách
export const allSongs = data.songs;
export const allAlbums = data.albums;
export const allArtists = data.artists;

// Export các danh sách nhóm ID để sử dụng trên trang chủ
export const weeklyTopSongsIds = data.weeklyTopSongs;
export const newReleaseSongsIds = data.newReleaseSongs;
export const trendingSongsIds = data.trendingSongs;
export const musicVideosIds = data.musicVideos;

export const popularArtistsIds = data.popularArtists;
export const emergingPopArtistsIds = data.emergingPopArtists;
export const risingAlternativeIndieArtistsIds = data.risingAlternativeIndieArtists;
export const recentlyViralArtistsIds = data.recentlyViralArtists;

export const topAlbumsIds = data.topAlbums;
export const newAlbumsIds = data.newAlbums;
export const popularAlbumsIds = data.popularAlbums;
export const mixAlbumsIds = data.mixAlbums;

// Bạn có thể thêm các hàm để lấy đối tượng đầy đủ từ các danh sách ID, ví dụ:
export const getWeeklyTopSongs = () => weeklyTopSongsIds.map(id => findSongById(id)).filter(Boolean);
// Tương tự cho các danh sách khác