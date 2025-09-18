import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { useMusic } from './context/MusicContext';
import { PlaylistProvider } from './context/PlaylistContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Components
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import SearchResults from './components/searchresult/SearchResults';
import MusicPlayer from './components/MusicPlayer';
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Account from './pages/Account';
import Discover from './pages/Discover';
import Albums from './pages/Albums';
import Artists from './pages/Artists';
import SongDetail from './pages/SongDetail';
import AlbumDetail from './pages/AlbumDetail';
import ArtistsDetail from './pages/ArtistsDetail';
import Favorites from './pages/Favorites';
import CreatePlaylist from './pages/CreatePlaylist';
import YourPlaylists from './pages/YourPlaylists';
import PlaylistDetail from './pages/PlaylistDetail';
import NotFoundPage from './pages/NotFoundPage';

const App = () => {
  const location = useLocation();
  const { isAuthenticated, currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState({
    songs: [],
    albums: [],
    artists: [],
  });

  const handleSearch = (term) => {
    setSearchTerm(term);
    // TODO: Implement search functionality
    console.log('Searching for:', term);
  };

  const isAccountPage = location.pathname === '/account';
  const { currentTrack } = useMusic();
  const shouldShowMusicPlayer = !isAccountPage && currentTrack;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#22172b] to-[#3d2a3f]">
      <PlaylistProvider>
        <ScrollToTop />
        <Header
          user={currentUser}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          setSearchResults={setSearchResults}
        />
        <div className="relative">
          <Sidebar />
          <main className="min-h-[calc(100vh-80px)] pt-20">
          <ScrollToTop />
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} className="mt-8"/>
            <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} />
            <Route path="/signup" element={isAuthenticated ? <Navigate to="/" replace /> : <SignUp/>} />
            
            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              
              <Route path="/discover" element={<Discover />} />
              <Route path="/albums" element={<Albums />} />
              <Route path="/artists" element={<Artists />} />
              <Route path="/song/:id" element={<SongDetail />} />
              <Route path="/album/:id" element={<AlbumDetail />} />
              <Route path="/artist/:id" element={<ArtistsDetail />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/create-playlist" element={<CreatePlaylist />} />
              <Route path="/your-playlists" element={<YourPlaylists />} />
              <Route path="/playlist/:id" element={<PlaylistDetail />} />
              <Route path="/account" element={<Account />} />
            </Route>
            
            {/* 404 - Not Found */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          {searchTerm.trim() !== '' && (
            <div className="pt-22 pl-32 px-4 max-w-6xl mx-auto">
              <SearchResults
                songs={searchResults.songs}
                albums={searchResults.albums}
                artists={searchResults.artists}
                onNavigate={() => setSearchTerm('')}
              /> 
            </div>
          )}
        </main>
        {shouldShowMusicPlayer && <MusicPlayer />}
        <ToastContainer position="bottom-right" autoClose={3000} />
      </div>
      </PlaylistProvider>
    </div>
  );
}

// Export the App component as default
export default App;
