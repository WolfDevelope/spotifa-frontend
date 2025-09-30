import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter as Router } from 'react-router-dom';
import { MusicProvider } from './context/MusicContext';
import { AuthProvider } from './context/AuthContext';
import { PlaylistProvider } from './context/PlaylistContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { AdminProvider } from './context/AdminContext';
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <AuthProvider>
        <AdminProvider>
          <MusicProvider>
            <FavoritesProvider>
              <PlaylistProvider>
                <App />
              </PlaylistProvider>
            </FavoritesProvider>
          </MusicProvider>
        </AdminProvider>
      </AuthProvider>
    </Router>
  </StrictMode>
);
