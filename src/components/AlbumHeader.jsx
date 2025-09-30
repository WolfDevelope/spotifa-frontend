import {useMusic} from "../context/MusicContext";
import data from "../data";

const AlbumHeader = ({ album, artist, onBack, tracks = [] }) => {
  const { setPlaylistAndPlay } = useMusic();
  
  // Use tracks passed from parent or fallback to songIds lookup
  let albumTracks = tracks;
  
  if (!albumTracks.length && album?.songIds) {
    // Fallback to local data lookup if tracks not provided
    albumTracks = album.songIds
      .map(songId => data.songs.find(song => song.id === songId))
      .filter(Boolean);
  }
  
  const handlePlayAll = () => {
    if(albumTracks.length > 0) {
      setPlaylistAndPlay(albumTracks);
    }
  };
  return (
  <section className="bg-gradient-to-br from-[#4A90E2] via-[#357ABD] to-[#2E5984] rounded-xl p-8 shadow-2xl max-w-5xl mx-auto mb-10 relative overflow-hidden">
    {/* Background pattern */}
    <div className="absolute inset-0 opacity-10">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/20 to-transparent"></div>
    </div>
    
    {/* Back button */}
    <div className="relative z-10 mb-6">
      <button onClick={onBack} className="flex items-center gap-2 text-white/80 hover:text-white transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span className="text-sm font-medium">Back</span>
      </button>
    </div>

    {/* Main content */}
    <div className="relative z-10 flex items-end gap-8">
      {/* Album cover */}
      <div className="flex-shrink-0">
        <img 
          src={album.cover} 
          alt={album.name} 
          className="w-48 h-48 rounded-lg object-cover shadow-2xl border-4 border-white/20" 
        />
      </div>
      
      {/* Album info */}
      <div className="flex-1 pb-4">
        {/* Album type */}
        <p className="text-white/80 text-sm font-medium mb-2 uppercase tracking-wider">Album</p>
        
        {/* Album name - Large and prominent */}
        <h1 className="text-white text-5xl font-black mb-4 leading-tight tracking-tight">
          {album.name}
        </h1>
        
        {/* Artist and details */}
        <div className="flex items-center gap-2 text-white/90 text-base">
          {artist && (
            <>
              <span className="font-semibold hover:underline cursor-pointer">
                {artist.name}
              </span>
              <span className="text-white/60">•</span>
            </>
          )}
          <span>{album.year || '2024'}</span>
          <span className="text-white/60">•</span>
          <span>{albumTracks.length} songs</span>
          {albumTracks.length > 0 && (
            <>
              <span className="text-white/60">•</span>
              <span>1 hr 12 min</span>
            </>
          )}
        </div>
      </div>
      
      {/* Play button */}
      <div className="flex-shrink-0 pb-4">
        <button 
          className="bg-pink-500 hover:bg-pink-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-105" 
          onClick={handlePlayAll}
          title="Play album"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z"/>
          </svg>
        </button>
      </div>
    </div>
  </section>
);
};

export default AlbumHeader;