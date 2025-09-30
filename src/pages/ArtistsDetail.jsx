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
import { useAuth } from "../context/AuthContext";
import musicService from "../services/musicService";

const ArtistsDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { currentTrack, setCurrentTrack } = useMusic();
  
  const [artist, setArtist] = useState(null);
  const [songs, setSongs] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadArtistDetail = async () => {
      setLoading(true);
      setError(null);

      try {
        // Try to get artist from API first (MongoDB format)
        let foundArtist = null;
        let artistSongs = [];
        let artistAlbums = [];

        try {
          const artistResponse = await musicService.getArtistById(id);
          if (artistResponse.success && artistResponse.data) {
            foundArtist = artistResponse.data;
            
            // Get artist's songs
            try {
              const songsResponse = await musicService.getAllSongs({ 
                artist: foundArtist._id,
                limit: 50 
              });
              if (songsResponse.success) {
                artistSongs = songsResponse.data;
              }
            } catch (err) {
              console.error('Error loading artist songs:', err);
            }

            // Get artist's albums
            try {
              const albumsResponse = await musicService.getAllAlbums({ 
                artist: foundArtist._id,
                limit: 20 
              });
              if (albumsResponse.success) {
                artistAlbums = albumsResponse.data;
              }
            } catch (err) {
              console.error('Error loading artist albums:', err);
            }
          }
        } catch (apiError) {
          console.log('API failed, trying local data:', apiError);
        }

        // Fallback to local data if API fails
        if (!foundArtist) {
          foundArtist = data.artists.find(a => (a._id || a.id) === id);
          if (foundArtist) {
            // Get songs and albums from local data
            artistSongs = data.songs
              ? data.songs.filter(song => foundArtist.songIds && foundArtist.songIds.includes(song.id))
              : [];
            artistAlbums = data.albums
              ? data.albums.filter(album => foundArtist.albumIds && foundArtist.albumIds.includes(album.id))
              : [];
          }
        }

        if (foundArtist) {
          setArtist(foundArtist);
          setSongs(artistSongs);
          setAlbums(artistAlbums);
        } else {
          setError('Artist not found');
        }
      } catch (error) {
        console.error('Error loading artist detail:', error);
        setError('Error loading artist information');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadArtistDetail();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="bg-gradient-to-b from-[#22172b] to-[#3d2a3f] min-h-screen text-white font-sans flex">
        <main className="flex-1 px-8 py-6" style={{ marginLeft: "16rem" }}>
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
            <p>Loading artist...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error || !artist) {
    return (
      <div className="bg-gradient-to-b from-[#22172b] to-[#3d2a3f] min-h-screen text-white font-sans flex">
        <main className="flex-1 px-8 py-6" style={{ marginLeft: "16rem" }}>
          <div className="text-center py-16">
            <p className="text-red-400 text-xl">{error || 'Artist not found'}</p>
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
        
          <ArtistProfile artist={artist} />
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Popular <span className="text-pink-400">Tracks</span></h2>
            <TrackList tracks={songs} artist={artist} />
          </section>
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Latest <span className="text-pink-400">Albums</span></h2>
            <AlbumList albums={albums.slice(0, 6)} />
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