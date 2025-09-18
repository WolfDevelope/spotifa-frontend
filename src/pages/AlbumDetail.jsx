import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Footer from "../components/Footer";
import AlbumHeader from "../components/AlbumHeader";
import AlbumTrackTable from "../components/AlbumTrackTable";
import data from "../data";

const AlbumDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const album = data.albums.find(a => a.id === id);
  const artist = album ? data.artists.find(ar => ar.id === album.artistId) : null;
  const tracks = album && album.songIds
    ? album.songIds
        .map(songId => data.songs.find(song => song.id === songId))
        .filter(Boolean)
    : [];

  if (!album) return <div className="text-center py-10 text-2xl">Không tìm thấy album.</div>;
const [currentUser, setCurrentUser] = useState(null);
  
    useEffect(() => {
      // Lấy thông tin người dùng từ localStorage nếu có
      const user = JSON.parse(localStorage.getItem('currentUser'));
      if (user) {
        setCurrentUser(user);
      }
    }, []);

  
  return (
    <div className="bg-gradient-to-b from-[#22172b] to-[#3d2a3f] min-h-screen text-white font-sans flex">
      
      <main className="flex-1 px-8 py-6" style={{ marginLeft: "16rem" }}>
        
        <AlbumHeader album={album} artist={artist} onBack={() => navigate(-1)} />
        <AlbumTrackTable tracks={tracks} album={album} artist={artist} />
        <Footer />
      </main>
    </div>
  );
};

export default AlbumDetail;