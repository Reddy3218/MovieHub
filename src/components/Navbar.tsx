import { Film, Home, Search, Heart } from 'lucide-react';
import { Link, useRouter } from '../router';

export const Navbar = () => {
  const { currentPath } = useRouter();

  const isActive = (path: string) => {
    if (path === '/' && currentPath === '/') return true;
    if (path !== '/' && currentPath.startsWith(path)) return true;
    return false;
  };

  const linkClass = (path: string) =>
    `flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
      isActive(path)
        ? 'bg-blue-600 text-white shadow-md'
        : 'text-gray-700 hover:bg-gray-100'
    }`;

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-blue-600">
            <Film className="w-8 h-8" />
            <span className="hidden sm:inline">MovieHub</span>
          </Link>

          <div className="flex items-center gap-2">
            <Link to="/" className={linkClass('/')}>
              <Home className="w-5 h-5" />
              <span className="hidden sm:inline">Home</span>
            </Link>
            <Link to="/search" className={linkClass('/search')}>
              <Search className="w-5 h-5" />
              <span className="hidden sm:inline">Search</span>
            </Link>
            <Link to="/favorites" className={linkClass('/favorites')}>
              <Heart className="w-5 h-5" />
              <span className="hidden sm:inline">Favorites</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};
