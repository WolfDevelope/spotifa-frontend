import React from "react";
import SongCard_API from "../SongCard_API";

const SongResultList = ({ songs, onNavigate }) => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    {songs.map((song) => (
        <div key={song._id || song.id} onClick={onNavigate}>
            <SongCard_API song={song} />
        </div>
    ))}
    </div>
);

export default SongResultList;