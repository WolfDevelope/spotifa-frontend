import {useMusic} from "../context/MusicContext";
import data from "../data";

const AlbumHeader = ({ album, artist, onBack }) => {
  const { setPlaylistAndPlay } = useMusic();
  const albumTracks = album.songIds
  .map(songId => data.songs.find(song => song.id === songId))
  .filter(Boolean);

  const handlePlayAll = () => {
    if(albumTracks.length > 0) {
      setPlaylistAndPlay(albumTracks);
    }
  };
  return (
  <section className="bg-gradient-to-br from-[#8BCBE700] to-[#1171E2] rounded-xl p-6 shadow-lg max-w-4xl mx-auto mb-10">
    <div className="flex justify-between items-center mb-4">
      <button onClick={onBack} className="mr-4 mt-1">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-white hover:text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
    </div>
    <div className="flex items-end justify-between">
      <div className="flex gap-8 flex-1">
        <img src={album.cover} alt={album.name} className="w-32 h-32 rounded-xl object-cover shadow-lg" />
        <div className="flex flex-col justify-between flex-1">
          <div>
            <h2 className="text-2xl font-bold mb-1 flex items-center gap-2">
              {artist && <span>{artist.name}</span>}
              <span className="text-pink-400">{album.name}</span>
            </h2>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-300 mb-2">
            <span>{album.songIds ? album.songIds.length : 0} songs</span>
            <span className="text-pink-400 text-xs">●</span>
            {/* Bạn có thể tính tổng thời lượng nếu muốn */}
            <span>{/* Tổng thời lượng */}</span>
          </div>
        </div>
      </div>
      <button className="flex items-center gap-2 text-pink-400 font-bold text-lg hover:text-pink-500 mt-2" onClick={handlePlayAll}>
        Play All
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-7 h-7">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
          <polygon points="10,8 16,12 10,16" fill="currentColor" className="text-pink-400"/>
        </svg>
      </button>
    </div>
  </section>
);
};

export default AlbumHeader;