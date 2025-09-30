import React from "react";
import AlbumCard_API from "../AlbumCard_API";

const AlbumResultList = ({ albums, onNavigate }) => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    {albums.map((album) => (
      <div key={album._id || album.id} onClick={onNavigate}>
        <AlbumCard_API album={album} />
      </div>
    ))}
    </div>
);

export default AlbumResultList;