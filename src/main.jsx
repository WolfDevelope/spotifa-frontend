import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter as Router } from 'react-router-dom';
import { MusicProvider } from './context/MusicContext';
import { AuthProvider } from './context/AuthContext';
import { PlaylistProvider } from './context/PlaylistContext';
import { FavoritesProvider } from './context/FavoritesContext';
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <AuthProvider>
        <MusicProvider>
          <FavoritesProvider>
            <PlaylistProvider>
              <App />
            </PlaylistProvider>
          </FavoritesProvider>
        </MusicProvider>
      </AuthProvider>
    </Router>
  </StrictMode>
);
