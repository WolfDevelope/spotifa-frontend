import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { findSongById, findArtistById, findAlbumById } from '../utils/dataProcessor';
import { FaPlay, FaShareAlt, FaArrowLeft } from 'react-icons/fa';
import { useMusic } from '../context/MusicContext';
import data from '../data';
import lyricsData from '../lyrics';
import HeartIcon from '../components/HeartIcon';

const SongDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [song, setSong] = useState(null);
  const [artist, setArtist] = useState(null);
  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Lấy hàm setPlaylistAndPlay từ context
  const { setPlaylistAndPlay } = useMusic();

  useEffect(() => {
    setLoading(true);
    setError(null);

    const foundSong = findSongById(id);

    if (foundSong) {
      setSong(foundSong);
      if (foundSong.artistId) setArtist(findArtistById(foundSong.artistId));
      if (foundSong.albumId) setAlbum(findAlbumById(foundSong.albumId));
    } else {
      setError('Không tìm thấy bài hát.');
    }
    setLoading(false);
  }, [id]);

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    if (!currentUser) {
      // Show login modal or redirect to login
      navigate('/login');
    }
    // The HeartIcon component will handle the rest
  };

  if (loading) return <div className="text-center py-10">Đang tải thông tin bài hát...</div>;
  if (error) return <div className="text-center text-red-400 py-10">{error}</div>;
  if (!song) return <div className="text-center py-10">Không có thông tin bài hát.</div>;

  // Nút play sẽ phát đúng bài hát này
  const handlePlay = (e) => {
    e.stopPropagation();
    const playlist = data.songs;
    const startIndex = playlist.findIndex(item => item.id === song.id);
    setPlaylistAndPlay(playlist, startIndex);
  };

  return (
    <div className="relative bg-gradient-to-br from-[#22172b] to-[#3d2a3f] rounded-xl shadow-lg p-8 pt-20 mt-10 mx-auto max-w-4xl flex flex-col gap-8 ml-[16rem] md:ml-[240px] lg:ml-[280px] xl:ml-[320px]">
      {/* Nút quay lại */}
      <button
        className="absolute top-4 left-4 flex items-center gap-2 text-gray-400 hover:text-pink-400 transition z-10 bg-[#241a33]/80 px-3 py-1 rounded"
        onClick={() => navigate(-1)}
      >
        <FaArrowLeft /> Back
      </button>

      {/* Main content */}
      <div className="flex flex-col md:flex-row items-center gap-10">
        {/* Album Art + Play */}
        <div className="relative w-56 h-56 flex-shrink-0 shadow-2xl rounded-lg overflow-hidden group">
          <img
            src={song.cover}
            alt={song.title}
            className="w-full h-full object-cover rounded-lg"
          />
          
        </div>

        {/* Song Info */}
        <div className="flex-1 flex flex-col gap-2 mt-6 md:mt-0">
          <h1 className="text-3xl md:text-4xl font-bold text-white">{song.title}</h1>
          <div className="flex items-center gap-2 text-lg text-gray-300 font-medium flex-wrap">
            {artist && (
              <Link
                to={`/artist/${artist.id}`}
                className="hover:text-pink-400 transition"
              >
                {artist.name}
              </Link>
            )}
            {album && (
              <>
                <span className="mx-2 text-gray-500">•</span>
                <Link
                  to={`/album/${album.id}`}
                  className="hover:text-pink-400 transition"
                >
                  {album.name}
                </Link>
              </>
            )}
          </div>
          <div className="flex items-center gap-4 mt-2">
            <span className="text-gray-400">{song.duration}</span>
            <span className="text-gray-400">{song.releaseDate && <>• {song.releaseDate}</>}</span>
          </div>
          <div className="flex gap-4 mt-4">
            <div onClick={handleFavoriteClick} className="text-pink-400 hover:text-pink-300 transition" title="Yêu thích">
              <HeartIcon songId={song.id} size={26} />
            </div>
            <button className="text-pink-400 hover:text-pink-300 transition" title="Chia sẻ">
              <FaShareAlt size={22} />
            </button>
          </div>
          {/* Nút Play lớn */}
          <div className="flex items-center mt-8">
            <button
              className="bg-gradient-to-tr from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-pink-300"
              title="Play"
              onClick={handlePlay}
            >
              <FaPlay size={20} />
            </button>
            <span className="ml-6 text-lg text-gray-300 font-semibold">Play this song</span>
          </div>
        </div>
      </div>

      {/* Lyrics */}
      <div className="w-full bg-[#2d2240] rounded-lg p-6 shadow-inner max-h-64 overflow-y-auto mt-4">
        <h3 className="text-pink-400 text-xl font-bold mb-2">Song Lyrics</h3>
        <div className="text-gray-200 whitespace-pre-line text-base" style={{ fontFamily: 'inherit' }}>
          {lyricsData[song.id] || "No lyrics available for this song."}
        </div>
      </div>
    </div>
  );
};

export default SongDetail;