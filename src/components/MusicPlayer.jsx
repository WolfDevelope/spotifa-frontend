import React, { useRef, useEffect, useState } from "react";
import {
  FaPlay,
  FaPause,
  FaStepForward,
  FaStepBackward,
  FaRandom,
  FaRedo,
  FaVolumeUp,
  FaVolumeMute,
} from "react-icons/fa";``
import { IoMdMusicalNote } from "react-icons/io";
import "../assets/styles/MusicPlayer.css";
import { useMusic } from "../context/MusicContext";
import { findArtistById } from "../utils/dataProcessor";
import { FaTimes } from 'react-icons/fa';

const MusicPlayer = () => {
  const {
    currentPlaylist,
    currentTrackIndex,
    setCurrentTrackIndex,
    currentTrack,
    isPlaying,
    setIsPlaying,
    isPlayerVisible,
    setIsPlayerVisible,
    setPlaylistAndPlay, 
  } = useMusic();

  if (!currentTrack || !isPlayerVisible) return null;

  const [volume, setVolume] = useState(80);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const audioRef = useRef(null);
  const progressBarRef = useRef(null);

  // Format time helper
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  // Play/Pause handler
  const togglePlay = () => {
    if (!currentTrack) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Next/Prev
  const handleNext = () => {
    if (currentPlaylist.length === 0) return;
    if (isShuffle) {
      let next;
      do {
        next = Math.floor(Math.random() * currentPlaylist.length);
      } while (next === currentTrackIndex && currentPlaylist.length > 1);
      setCurrentTrackIndex(next);
    } else {
      setCurrentTrackIndex((currentTrackIndex + 1) % currentPlaylist.length);
    }
    setIsPlaying(true);
  };

  const handlePrevious = () => {
    if (currentPlaylist.length === 0) return;
    setCurrentTrackIndex(
      (currentTrackIndex - 1 + currentPlaylist.length) % currentPlaylist.length
    );
    setIsPlaying(true);
  };

  // Repeat/Shuffle
  const handleSongEnd = () => {
    if (isRepeat) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    } else {
      handleNext();
    }
  };

  // Progress bar
  const updateProgress = () => {
    if (audioRef.current) {
      const progress =
        (audioRef.current.currentTime / audioRef.current.duration) * 100;
      progressBarRef.current.style.width = `${progress}%`;
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleProgressClick = (e) => {
    const progressBar = e.currentTarget;
    const clickPosition = e.clientX - progressBar.getBoundingClientRect().left;
    const progressBarWidth = progressBar.clientWidth;
    const clickPercentage = clickPosition / progressBarWidth;
    const newTime = clickPercentage * audioRef.current.duration;
    // Store the current play state
    const wasPlaying = !audioRef.current.paused;

    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);

    // If it was playing before seeking, continue playing
    if (wasPlaying) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error("Playback failed after seeking:", error);
        });
      }
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100;
    }
  }, [volume, isMuted]);

  // Volume
  const handleVolumeChange = (e) => {
    const newVolume = Number(e.target.value);
    setVolume(newVolume);
    if (newVolume === 0) setIsMuted(true);
    else if (isMuted) setIsMuted(false);
  };

  const toggleMute = () => {
    audioRef.current.volume = isMuted ? volume / 100 : 0;
    setIsMuted(!isMuted);
  };

  // Auto play when currentTrack changes
  useEffect(() => {
    if (currentTrack && audioRef.current) {
      audioRef.current.src = currentTrack.src;
      if (isPlaying) {
        audioRef.current.play().catch((error) => {
          console.error("Audio play failed:", error);
        });
      }
    }
  }, [currentTrack]);

  // Auto play/pause when isPlaying changes
  useEffect(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.error("Playback failed:", error);
          setIsPlaying(false);
        });
      }
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, currentTrack]);  

  const artistObj = currentTrack.artistId
    ? findArtistById(currentTrack.artistId)
    : null;

  
    const handleClose = (e) => {
      e.stopPropagation();
      setIsPlaying(false);  // Stop the music
      setIsPlayerVisible(false);  // Hide the player
    };

  if (!isPlayerVisible) return null;

  return (
    <div className="music-player">
      <audio
        ref={audioRef}
        onTimeUpdate={updateProgress}
        onEnded={handleSongEnd}
        onLoadedMetadata={() => setDuration(audioRef.current.duration)}
        autoPlay
      />

      <div className="track-info">
        {currentTrack.cover ? (
          <img
            src={currentTrack.cover}
            alt={currentTrack.title}
            className="track-cover"
          />
        ) : (
          <div className="track-cover-placeholder">
            <IoMdMusicalNote size={24} />
          </div>
        )}
        <div className="track-details">
          <h4 className="track-title">{currentTrack.title}</h4>
          <p className="track-artist">
            {artistObj ? artistObj.name : "Unknown Artist"}
          </p>
        </div>
      </div>

      <div className="player-controls">
        <div className="progress-container" onClick={handleProgressClick}>
          <div className="progress-bar" ref={progressBarRef}></div>
        </div>
        <div className="time-display">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>

        <div className="controls">
          <button
            className={`control-btn ${isShuffle ? "active" : ""}`}
            onClick={() => setIsShuffle(!isShuffle)}
            title="Shuffle"
          >
            <FaRandom />
          </button>

          <button
            className="control-btn"
            onClick={handlePrevious}
            title="Previous"
          >
            <FaStepBackward />
          </button>

          <button className="play-btn" onClick={togglePlay}>
            {isPlaying ? <FaPause /> : <FaPlay />}
          </button>

          <button className="control-btn" onClick={handleNext} title="Next">
            <FaStepForward />
          </button>

          <button
            className={`control-btn ${isRepeat ? "active" : ""}`}
            onClick={() => setIsRepeat(!isRepeat)}
            title="Repeat"
          >
            <FaRedo />
          </button>
        </div>
      </div>

      <div className="volume-control">
        <button className="volume-btn" onClick={toggleMute}>
          {isMuted || volume === 0 ? <FaVolumeMute /> : <FaVolumeUp />}
        </button>
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={handleVolumeChange}
          className="volume-slider"
        />
      </div>
      <button 
      className="close-player-btn"
      onClick={handleClose}
      title="Đóng trình phát nhạc"
    >
      <FaTimes />  
      </button>
    </div>
    );
  };

  


export default MusicPlayer;