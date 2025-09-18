import React from "react";
import SongResultList from "./SongResultList";
import AlbumResultList from "./AlbumResultList";
import ArtistResultList from "./ArtistResultList";

const SearchResults = ({ songs, albums, artists, onNavigate }) => (
  <div className="bg-[#1e1930] rounded-lg p-6 mt-4 shadow-lg w-full pt28">
    {songs.length > 0 && (
      <div>
        <h3 className="text-pink-400 text-xl font-bold mb-2">Tracks</h3>
        <SongResultList songs={songs} onNavigate={onNavigate} />
      </div>
    )}
    {albums.length > 0 && (
      <div className="mt-6">
        <h3 className="text-pink-400 text-xl font-bold mb-2">Albums</h3>
        <AlbumResultList albums={albums} onNavigate={onNavigate} />
      </div>
    )}
    {artists.length > 0 && (
      <div className="mt-6">
        <h3 className="text-pink-400 text-xl font-bold mb-2">Artists</h3>
        <ArtistResultList artists={artists} onNavigate={onNavigate} />
      </div>
    )}
    {songs.length === 0 && albums.length === 0 && artists.length === 0 && (
      <div className="text-white mt-4">No results found.</div>
    )}
  </div>
);

export default SearchResults;