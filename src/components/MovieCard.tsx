import { Film, Heart } from 'lucide-react';
import { Link } from '../router';
import { useFavorites } from '../hooks/useFavorites';

interface MovieCardProps {
  id: string;
  title: string;
  year: string;
  poster: string;
  type?: string;
}

export const MovieCard = ({ id, title, year, poster, type }: MovieCardProps) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleFavorite({ imdbID: id, Title: title, Year: year, Poster: poster, Type: type || 'movie' });
  };

  return (
    <Link to={`/movie/${id}`} className="group block">
      <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        <div className="relative aspect-[2/3] bg-gray-200 overflow-hidden">
          {poster && poster !== 'N/A' ? (
            <img
              src={poster}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-300 to-gray-400">
              <Film className="w-16 h-16 text-gray-500" />
            </div>
          )}
          <button
            onClick={handleFavoriteClick}
            className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-colors z-10"
          >
            <Heart
              className={`w-5 h-5 ${favorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
            />
          </button>
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-lg text-gray-900 line-clamp-2 mb-1 group-hover:text-blue-600 transition-colors">
            {title}
          </h3>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 text-sm">{year}</span>
            {type && (
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded capitalize">
                {type}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};
