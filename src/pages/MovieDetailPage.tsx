import { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, Clock, Star, Award, Heart, Film } from 'lucide-react';
import { useRouter, Link } from '../router';
import { getMovieDetails, MovieDetail } from '../services/omdbApi';
import { Loader } from '../components/Loader';
import { ErrorMessage } from '../components/ErrorMessage';
import { Button } from '../components/Button';
import { useFavorites } from '../hooks/useFavorites';

export const MovieDetailPage = () => {
  const { params } = useRouter();
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    const loadMovie = async () => {
      if (!params.id) return;

      setLoading(true);
      setError('');

      try {
        const data = await getMovieDetails(params.id);
        setMovie(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load movie details');
      } finally {
        setLoading(false);
      }
    };

    loadMovie();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Loader />
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-gray-50">
        <ErrorMessage message={error || 'Movie not found'} />
      </div>
    );
  }

  const favorite = isFavorite(movie.imdbID);

  const handleToggleFavorite = () => {
    toggleFavorite({
      imdbID: movie.imdbID,
      Title: movie.Title,
      Year: movie.Year,
      Poster: movie.Poster,
      Type: movie.Type,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="absolute inset-0 opacity-20">
          {movie.Poster && movie.Poster !== 'N/A' && (
            <img
              src={movie.Poster}
              alt=""
              className="w-full h-full object-cover blur-xl"
            />
          )}
        </div>

        <div className="container mx-auto px-4 py-8 relative z-10">
          <Link to="/search" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6">
            <ArrowLeft className="w-5 h-5" />
            Back to search
          </Link>

          <div className="grid md:grid-cols-[300px,1fr] gap-8">
            <div className="relative">
              {movie.Poster && movie.Poster !== 'N/A' ? (
                <img
                  src={movie.Poster}
                  alt={movie.Title}
                  className="w-full rounded-xl shadow-2xl"
                />
              ) : (
                <div className="w-full aspect-[2/3] bg-gray-700 rounded-xl flex items-center justify-center">
                  <Film className="w-20 h-20 text-gray-500" />
                </div>
              )}
            </div>

            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold mb-2">{movie.Title}</h1>
                  <div className="flex flex-wrap items-center gap-3 text-lg">
                    <span className="bg-white/20 px-3 py-1 rounded">{movie.Rated}</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {movie.Year}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {movie.Runtime}
                    </span>
                  </div>
                </div>
                <Button onClick={handleToggleFavorite} variant="outline">
                  <Heart className={`w-5 h-5 ${favorite ? 'fill-current' : ''}`} />
                </Button>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {movie.Genre.split(', ').map((genre) => (
                  <span
                    key={genre}
                    className="bg-blue-500/30 backdrop-blur-sm px-4 py-1 rounded-full text-sm"
                  >
                    {genre}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-6 mb-6 text-lg">
                {movie.imdbRating !== 'N/A' && (
                  <div className="flex items-center gap-2">
                    <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                    <span className="font-bold text-2xl">{movie.imdbRating}</span>
                    <span className="text-white/60">/ 10</span>
                  </div>
                )}
                {movie.imdbVotes !== 'N/A' && (
                  <span className="text-white/80">{movie.imdbVotes} votes</span>
                )}
              </div>

              {movie.Awards !== 'N/A' && (
                <div className="flex items-start gap-2 mb-6 bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                  <Award className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <p className="text-white/90">{movie.Awards}</p>
                </div>
              )}

              <p className="text-lg text-white/90 leading-relaxed mb-6">{movie.Plot}</p>

              <div className="space-y-3">
                <InfoRow label="Director" value={movie.Director} />
                <InfoRow label="Writer" value={movie.Writer} />
                <InfoRow label="Cast" value={movie.Actors} />
                <InfoRow label="Released" value={movie.Released} />
                <InfoRow label="Language" value={movie.Language} />
                <InfoRow label="Country" value={movie.Country} />
                {movie.BoxOffice && <InfoRow label="Box Office" value={movie.BoxOffice} />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoRow = ({ label, value }: { label: string; value: string }) => {
  if (value === 'N/A') return null;

  return (
    <div className="flex gap-2">
      <span className="text-white/60 font-medium min-w-[100px]">{label}:</span>
      <span className="text-white/90">{value}</span>
    </div>
  );
};
