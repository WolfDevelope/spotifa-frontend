import React from 'react';
import { useMusic } from '../context/MusicContext';
import data from '../data';

const ArtistProfile = ({ artist }) => {
    const { setPlaylistAndPlay } = useMusic();
    const handlePlay = () => {
      // Filter songs by the current artist
      const artistSongs = data.songs.filter(song => song.artistId === artist.id);
      
      if (artistSongs.length > 0) {
        setPlaylistAndPlay(artistSongs, 0); // Play from the first song
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