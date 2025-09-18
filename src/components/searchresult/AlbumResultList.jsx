import React from "react";
import AlbumCard from "../AlbumCard";
import { Link } from "react-router-dom";

const AlbumResultList = ({ albums, onNavigate }) => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    {albums.map((album) => (
      <Link to={`/album/${album.id}`}
        onClick={onNavigate}
        key={album.id}
        style={{ textDecoration: "none" }}
      >
        <AlbumCard album={album} />
      </Link>
    ))}
    </div>
);

export default AlbumResultList;