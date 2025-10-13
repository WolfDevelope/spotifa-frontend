import React from 'react';
import { useMusic } from '../context/MusicContext';
import musicService from '../services/musicService';
import data from '../data';

const ArtistProfile = ({ artist, songs = [] }) => {
    const { setPlaylistAndPlay } = useMusic();
    const handlePlay = async () => {
      if (songs.length > 0) {
        // Increment play count for first song if it has _id (from API)
        const firstSong = songs[0];
        if (firstSong._id) {
          try {
            await musicService.incrementPlayCount(firstSong._id);
          } catch (err) {
            console.error('Failed to increment play count:', err);
          }
        }
        setPlaylistAndPlay(songs, 0); // Play from the first song
      } else {
        // Fallback to local data if no songs provided
        const artistSongs = data.songs.filter(song => song.artistId === (artist._id || artist.id));
        if (artistSongs.length > 0) {
          setPlaylistAndPlay(artistSongs, 0);
        }
      }
    };




    return (
    <header className="flex items-center mb-8 bg-[#2d2240] rounded-lg p-6">
      <img src={artist.avatar} alt={artist.name} className="w-64 h-64 rounded-full object-cover mr-8 shadow-2xl" />
      <div>
        <h1 className="text-5xl font-extrabold mb-4">
          {artist.name.split(" ")[0]} <span className="text-pink-400">{artist.name.split(" ").slice(1).join(" ")}</span>
        </h1>
        {/* Có thể thêm số lượng listeners/location nếu có */}
        <div className="flex space-x-4 mt-4">
          <button className="bg-pink-500 text-white px-6 py-2 rounded-full hover:bg-pink-600 transition" onClick={handlePlay}>Play</button>
          <button className="border border-white text-white px-6 py-2 rounded-full hover:bg-white hover:text-black transition">Follow</button>
        </div>
      </div>
    </header>
  );
};
  export default ArtistProfile;