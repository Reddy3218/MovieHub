import { useState, useEffect } from 'react';
import { Movie } from '../services/omdbApi';

const FAVORITES_KEY = 'moviehub_favorites';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<Movie[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(FAVORITES_KEY);
    if (stored) {
      try {
        setFavorites(JSON.parse(stored));
      } catch (error) {
        console.error('Failed to parse favorites:', error);
      }
    }
  }, []);

  const saveFavorites = (newFavorites: Movie[]) => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
    setFavorites(newFavorites);
  };

  const toggleFavorite = (movie: Movie) => {
    const exists = favorites.some((fav) => fav.imdbID === movie.imdbID);

    if (exists) {
      const updated = favorites.filter((fav) => fav.imdbID !== movie.imdbID);
      saveFavorites(updated);
    } else {
      const updated = [...favorites, movie];
      saveFavorites(updated);
    }
  };

  const isFavorite = (id: string) => {
    return favorites.some((fav) => fav.imdbID === id);
  };

  return {
    favorites,
    toggleFavorite,
    isFavorite,
  };
};
