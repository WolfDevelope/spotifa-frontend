import { useMusic } from "../context/MusicContext";
import musicService from '../services/musicService';
import data from '../data';

const TrackList = ({ tracks, artist }) => {
    const { setPlaylistAndPlay } = useMusic();

    const handlePlay = async (track) => {
        // Increment play count if track has _id (from API)
        if (track._id) {
            try {
                await musicService.incrementPlayCount(track._id);
            } catch (err) {
                console.error('Failed to increment play count:', err);
            }
        }

        if (tracks.length > 0) {
            // Use the tracks from props (API data)
            const startIndex = tracks.findIndex(item => (item._id || item.id) === (track._id || track.id));
            setPlaylistAndPlay(tracks, startIndex >= 0 ? startIndex : 0);
        } else {
            // Fallback to local data
            const playlist = data.songs;
            const startIndex = playlist.findIndex(item => item.id === track.id);
            setPlaylistAndPlay(playlist, startIndex >= 0 ? startIndex : 0);
        }
    };

    return (
        <div className="space-y-4">
            {tracks.length === 0 && <div className="text-gray-400">No tracks available.</div>}
            {tracks.map((track, idx) => (
                <div key={track._id || track.id} className="flex items-center justify-between bg-[#2d2240] p-4 rounded-lg hover:bg-[#3d2a3f] transition group" onClick={() => handlePlay(track)}>
                    <div className="flex items-center">
                        <img src={track.cover} alt={track.title} className="w-16 h-16 mr-4 rounded" />
                        <div>
                            <span className="font-semibold">{track.title}</span>
                            <p className="text-sm text-gray-400">{artist.name}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="play-btn opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-pink-500 hover:bg-pink-600 rounded-full w-10 h-10 flex items-center justify-center shadow-lg ml-4" title="Play" onClick={(e) => {e.stopPropagation(); handlePlay(track);}}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 20 20" className="w-6 h-6">
                                <path d="M6 4l12 6-12 6V4z"/>
                            </svg>
                        </button>
                        <span className="text-gray-400">{track.duration || "3:00"}</span>
                    </div>
                </div>
            ))}
        </div>
    );  
};

export default TrackList;