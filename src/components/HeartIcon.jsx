import React, { useState, useEffect } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';
import { toggleFavorite } from '../services/favorites';
import { toast } from 'react-toastify';

const HeartIcon = ({ songId, size = 20 }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { currentUser } = useAuth();
  const { isFavorite: contextIsFavorite, addToFavorites, removeFromFavorites } = useFavorites();

  const isFavorite = contextIsFavorite(songId);

  const handleToggleFavorite = async (e) => {
    e.stopPropagation(); // Prevent triggering parent click events
    
    if (!currentUser) {
      // Handle localStorage for non-logged users
      if (isFavorite) {
        removeFromFavorites(songId);
      } else {
        addToFavorites(songId);
      }
      return;
    }

    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const response = await toggleFavorite(songId);
      console.log('Toggle favorite response:', response);
      
      // Update context immediately for UI responsiveness, then sync with API
      if (response.success) {
        if (response.isFavorite) {
          console.log('Added to favorites:', songId);
          addToFavorites(songId);
          toast.success('Added to favorites');
        } else {
          console.log('Removed from favorites:', songId);
          removeFromFavorites(songId);
          toast.success('Removed from favorites');
        }
        
        // Also refresh from API to ensure consistency
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('refreshFavorites'));
        }, 100);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error('Failed to update favorites');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button 
      onClick={handleToggleFavorite}
      className="text-pink-500 hover:text-pink-400 transition-colors"
      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      {isFavorite ? <FaHeart size={size} /> : <FaRegHeart size={size} />}
    </button>
  );
};

export default HeartIcon;
