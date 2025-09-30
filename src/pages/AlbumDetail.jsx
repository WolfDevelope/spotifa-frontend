import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Footer from "../components/Footer";
import AlbumHeader from "../components/AlbumHeader";
import AlbumTrackTable from "../components/AlbumTrackTable";
import data from "../data";
import { useAuth } from "../context/AuthContext";
import musicService from "../services/musicService";

const AlbumDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [album, setAlbum] = useState(null);
  const [artist, setArtist] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadAlbumDetail = async () => {
      setLoading(true);
      setError(null);

      try {
        // Try to get album from API first (MongoDB format)
        let foundAlbum = null;
        let foundArtist = null;
        let albumTracks = [];

        try {
          const albumResponse = await musicService.getAlbumById(id);
          if (albumResponse.success && albumResponse.data) {
            foundAlbum = albumResponse.data;
            
            // Get artist info if album has artist
            if (foundAlbum.artist) {
              if (typeof foundAlbum.artist === 'string') {
                // Artist is ID, fetch artist details
                try {
                  const artistResponse = await musicService.getArtistById(foundAlbum.artist);
                  if (artistResponse.success) {
                    foundArtist = artistResponse.data;
                  }
                } catch (err) {
                  console.error('Error loading artist:', err);
                }
              } else {
                // Artist is already populated
                foundArtist = foundAlbum.artist;
              }
            }

            // Get album's songs
            try {
              const songsResponse = await musicService.getAllSongs({ 
                album: foundAlbum._id,
                limit: 50 
              });
              if (songsResponse.success) {
                albumTracks = songsResponse.data;
              }
            } catch (err) {
              console.error('Error loading album songs:', err);
            }
          }
        } catch (apiError) {
          console.log('API failed, trying local data:', apiError);
        }

        // Fallback to local data if API fails
        if (!foundAlbum) {
          foundAlbum = data.albums.find(a => (a._id || a.id) === id);
          if (foundAlbum) {
            // Get artist and tracks from local data
            foundArtist = foundAlbum.artistId 
              ? data.artists.find(ar => ar.id === foundAlbum.artistId) 
              : null;
            albumTracks = foundAlbum.songIds
              ? foundAlbum.songIds
                  .map(songId => data.songs.find(song => song.id === songId))
                  .filter(Boolean)
              : [];
          }
        }

        if (foundAlbum) {
          setAlbum(foundAlbum);
          setArtist(foundArtist);
          setTracks(albumTracks);
        } else {
          setError('Album not found');
        }
      } catch (error) {
        console.error('Error loading album detail:', error);
        setError('Error loading album information');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadAlbumDetail();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="bg-gradient-to-b from-[#22172b] to-[#3d2a3f] min-h-screen text-white font-sans flex">
        <main className="flex-1 px-8 py-6" style={{ marginLeft: "16rem" }}>
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
            <p>Loading album...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error || !album) {
    return (
      <div className="bg-gradient-to-b from-[#22172b] to-[#3d2a3f] min-h-screen text-white font-sans flex">
        <main className="flex-1 px-8 py-6" style={{ marginLeft: "16rem" }}>
          <div className="text-center py-16">
            <p className="text-red-400 text-xl">{error || 'Album not found'}</p>
            <button
              onClick={() => navigate(-1)}
              className="mt-4 px-6 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-full"
            >
              Go Back
            </button>
          </div>
        </main>
      </div>
    );
  }
  
  return (
    <div className="bg-gradient-to-b from-[#22172b] to-[#3d2a3f] min-h-screen text-white font-sans flex">
      
      <main className="flex-1 px-8 py-6" style={{ marginLeft: "16rem" }}>
        
        <AlbumHeader album={album} artist={artist} tracks={tracks} onBack={() => navigate(-1)} />
        <AlbumTrackTable tracks={tracks} album={album} artist={artist} />
        <Footer />
      </main>
    </div>
  );
};

export default AlbumDetail;