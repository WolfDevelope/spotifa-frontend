import { createContext, useContext, useState } from 'react';
export const MusicContext = createContext();

export const MusicProvider = ({ children }) => {
  // Playlist hiện tại (mảng các bài hát)
  const [currentPlaylist, setCurrentPlaylist] = useState([]);
  // Vị trí bài hát đang phát trong playlist
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  // Trạng thái phát
  const [isPlaying, setIsPlaying] = useState(false);

  // Hàm dùng để play một playlist mới, bắt đầu từ một index cụ thể
  const setPlaylistAndPlay = (playlist, startIndex = 0) => {
    setCurrentPlaylist(playlist);
    setCurrentTrackIndex(startIndex);
    setIsPlaying(true);
    setIsPlayerVisible(true);
  };

  // Bài hát hiện tại
  const currentTrack = currentPlaylist[currentTrackIndex] || null;
  
  const [isPlayerVisible, setIsPlayerVisible] = useState(false);
  return (
    <MusicContext.Provider
      value={{
        currentPlaylist,
        setCurrentPlaylist,
        currentTrackIndex,
        setCurrentTrackIndex,
        currentTrack,
        isPlaying,
        setIsPlaying,
        setPlaylistAndPlay,
        isPlayerVisible,
        setIsPlayerVisible,

      }}
    >
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => useContext(MusicContext);