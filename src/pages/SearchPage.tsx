import { useState, useEffect } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { searchMovies, Movie } from '../services/omdbApi';
import { MovieCard } from '../components/MovieCard';
import { Loader } from '../components/Loader';
import { ErrorMessage } from '../components/ErrorMessage';
import { Button } from '../components/Button';

export const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [type, setType] = useState('all');
  const [year, setYear] = useState('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const performSearch = async (searchQuery: string, page: number = 1) => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError('');

    try {
      const response = await searchMovies(searchQuery, type, year, page);
      setMovies(response.Search || []);
      setTotalResults(parseInt(response.totalResults) || 0);
      setCurrentPage(page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search movies');
      setMovies([]);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query) {
        performSearch(query);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query, type, year]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setQuery(searchInput);
  };

  const clearFilters = () => {
    setType('all');
    setYear('');
  };

  const hasActiveFilters = type !== 'all' || year !== '';
  const totalPages = Math.ceil(totalResults / 10);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6 text-gray-900">Search Movies & TV Shows</h1>

          <form onSubmit={handleSearch} className="mb-4">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search for movies, TV shows, episodes..."
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-lg"
                />
              </div>
              <Button type="submit" size="lg">
                Search
              </Button>
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-3 rounded-lg border-2 transition-colors ${
                  showFilters || hasActiveFilters
                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Filter className="w-5 h-5" />
              </button>
            </div>
          </form>

          {showFilters && (
            <div className="bg-gray-50 p-4 rounded-lg border-2 border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Filters</h3>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    <X className="w-4 h-4" />
                    Clear filters
                  </button>
                )}
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  >
                    <option value="all">All Types</option>
                    <option value="movie">Movies</option>
                    <option value="series">TV Series</option>
                    <option value="episode">Episodes</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                  <input
                    type="text"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    placeholder="e.g., 2024"
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {query && totalResults > 0 && (
            <p className="text-gray-600 mt-4">
              Found {totalResults.toLocaleString()} results for "{query}"
            </p>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <Loader />
        ) : error ? (
          <ErrorMessage message={error} onRetry={() => performSearch(query)} />
        ) : movies.length === 0 && query ? (
          <div className="text-center py-16">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No results found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        ) : movies.length === 0 ? (
          <div className="text-center py-16">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Start your search</h3>
            <p className="text-gray-600">Enter a movie or TV show name to begin</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
              {movies.map((movie) => (
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

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2">
                <Button
                  onClick={() => performSearch(query, currentPage - 1)}
                  disabled={currentPage === 1}
                  variant="outline"
                >
                  Previous
                </Button>
                <span className="px-4 py-2 text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  onClick={() => performSearch(query, currentPage + 1)}
                  disabled={currentPage === totalPages}
                  variant="outline"
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
