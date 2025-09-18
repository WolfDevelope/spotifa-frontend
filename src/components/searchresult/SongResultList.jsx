import React from "react";
import SongCard from "../SongCard";
import { Link } from "react-router-dom";
const SongResultList = ({ songs, onNavigate }) => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    {songs.map((song) => (
        <Link to={`/song/${song.id}`}
          onClick={onNavigate}
          key={song.id}
          style={{ textDecoration: "none" }}
        >
            <SongCard song={song} />

        </Link>
    ))}
    </div>
);

export default SongResultList;