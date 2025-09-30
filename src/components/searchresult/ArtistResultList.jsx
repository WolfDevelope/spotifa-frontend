import React from "react";
import ArtistsCard_API from "../ArtistsCard_API";

const ArtistResultList = ({ artists, onNavigate }) => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    {artists.map((artist) => (
      <div key={artist._id || artist.id} onClick={onNavigate}>
        <ArtistsCard_API artist={artist} />
      </div>
    ))}
  </div>
);

export default ArtistResultList;