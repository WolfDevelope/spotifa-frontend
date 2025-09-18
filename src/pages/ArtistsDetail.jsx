import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import ArtistProfile from "../components/ArtistProfile";
import TrackList from "../components/TrackList";
import AlbumList from "../components/AlbumList";
import ArtistBio from "../components/ArtistBio";
import Footer from "../components/Footer";
import data from "../data";
import MusicPlayer from "../components/MusicPlayer";
import { useMusic } from "../context/MusicContext";

const ArtistsDetail = () => {
  const { id } = useParams();
  const artistId = id;
  console.log('ArtistsDetail - artistId from params:', artistId);
  console.log('Available artist IDs:', data.artists.map(a => a.id));
  const artist = data.artists.find(a => String(a.id) === String(artistId));
  console.log('Found artist:', artist);
  const { currentTrack, setCurrentTrack } = useMusic();
   
  const [currentUser, setCurrentUser] = useState(null);
    const navigate = useNavigate();
  
    useEffect(() => {
      // Lấy thông tin người dùng từ localStorage nếu có
      const user = JSON.parse(localStorage.getItem('currentUser'));
      if (user) {
        setCurrentUser(user);
      }
    }, []);

  if (!artist) return <div className="text-center py-10 text-2xl">Artist not found</div>;

  // Lấy bài hát và album của nghệ sĩ
  const songs = data.songs
    ? data.songs.filter(song => artist.songIds && artist.songIds.includes(song.id))
    : [];
  const albums = data.albums
    ? data.albums.filter(album => artist.albumIds && artist.albumIds.includes(album.id))
    : [];

  return (
    <div className="bg-gradient-to-b from-[#22172b] to-[#3d2a3f] min-h-screen text-white font-sans flex">
      
      <main className="flex-1 px-8 py-6" style={{ marginLeft: "16rem" }}>
        
          <ArtistProfile artist={artist} />
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Popular <span className="text-pink-400">Tracks</span></h2>
            <TrackList tracks={songs} artist={artist} />
          </section>
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Latest <span className="text-pink-400">Album</span></h2>
            <AlbumList albums={albums} />
          </section>
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">About <span className="text-pink-400">{artist.name}</span></h2>
            <ArtistBio bio={artist.bio} />
          </section>
          <Footer />
        </main>
    </div>
    
  );
};

export default ArtistsDetail;