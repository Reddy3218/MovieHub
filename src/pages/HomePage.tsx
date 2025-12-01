import { useState, useEffect } from 'react';
import { Film, Search, Heart, TrendingUp, ArrowRight } from 'lucide-react';
import { Link } from '../router';
import { Button } from '../components/Button';
import { MovieCard } from '../components/MovieCard';
import { Loader } from '../components/Loader';
import { searchMovies, Movie } from '../services/omdbApi';

export const HomePage = () => {
  const [featuredMovies, setFeaturedMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeatured = async () => {
      try {
        const response = await searchMovies('marvel', 'movie');
        setFeaturedMovies(response.Search?.slice(0, 6) || []);
      } catch (error) {
        console.error('Failed to load featured movies:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFeatured();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <Film className="w-12 h-12" />
              <span className="text-2xl font-bold">MovieHub</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Discover Your Next
              <br />
              Favorite Movie
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Search from millions of movies, TV shows, and episodes. Save your favorites and explore detailed information.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/search">
                <Button size="lg">
                  <Search className="w-5 h-5 mr-2" />
                  Start Searching
                </Button>
              </Link>
              <Link to="/favorites">
                <Button variant="outline" size="lg">
                  <Heart className="w-5 h-5 mr-2" />
                  View Favorites
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-50 to-transparent"></div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="bg-blue-100 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
              <Search className="w-7 h-7 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900">Advanced Search</h3>
            <p className="text-gray-600">
              Search by title, filter by type and year, and find exactly what you're looking for.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="bg-red-100 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
              <Heart className="w-7 h-7 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900">Save Favorites</h3>
            <p className="text-gray-600">
              Keep track of movies you love with our favorites feature. Your data is saved locally.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="bg-green-100 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="w-7 h-7 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900">Detailed Info</h3>
            <p className="text-gray-600">
              Get comprehensive details including ratings, cast, plot, and more for every title.
            </p>
          </div>
        </div>

        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-3xl font-bold text-gray-900">Featured Movies</h2>
          <Link to="/search" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium">
            View All
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {loading ? (
          <Loader />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {featuredMovies.map((movie) => (
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
      </section>
    </div>
  );
};
