import { RouterProvider, Route } from './router';
import { Navbar } from './components/Navbar';
import { HomePage } from './pages/HomePage';
import { SearchPage } from './pages/SearchPage';
import { MovieDetailPage } from './pages/MovieDetailPage';
import { FavoritesPage } from './pages/FavoritesPage';

function App() {
  return (
    <RouterProvider>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Route path="/" component={HomePage} />
        <Route path="/search" component={SearchPage} />
        <Route path="/movie/:id" component={MovieDetailPage} />
        <Route path="/favorites" component={FavoritesPage} />
      </div>
    </RouterProvider>
  );
}

export default App;
