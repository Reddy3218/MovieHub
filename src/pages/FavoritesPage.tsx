import { Heart } from 'lucide-react';
import { useFavorites } from '../hooks/useFavorites';
import { MovieCard } from '../components/MovieCard';

export const FavoritesPage = () => {
  const { favorites } = useFavorites();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-2">
            <Heart className="w-8 h-8 text-red-500 fill-red-500" />
            <h1 className="text-3xl font-bold text-gray-900">My Favorites</h1>
          </div>
          <p className="text-gray-600">
            {favorites.length === 0
              ? 'No favorites yet. Start adding movies you love!'
              : `You have ${favorites.length} favorite ${favorites.length === 1 ? 'movie' : 'movies'}`}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {favorites.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No favorites yet</h3>
            <p className="text-gray-600 mb-6">
              Start exploring movies and click the heart icon to save your favorites
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {favorites.map((movie) => (
              <MovieCard
                key={movie.imdbID}
                id={movie.imdbID}
                title={movie.Title}
                year={movie.Year}
                poster={movie.Poster}
                type={movie.Type}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
