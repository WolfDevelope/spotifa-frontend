import React from "react";
import ArtistsCard from "../ArtistsCard";
import { Link } from "react-router-dom";

const ArtistResultList = ({ artists, onNavigate }) => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    {artists.map((artist) => (
      <Link to={`/artist/${artist.id}`}
        onClick={onNavigate}
        key={artist.id}
        style={{ textDecoration: "none" }}
      >
        <ArtistsCard artist={artist} />
      </Link>
    ))}
  </div>
);

export default ArtistResultList;