import React, {useState, useEffect} from 'react';
import {books} from './data';
import BookCard from './components/BookCard';
import FavoritesList from './components/FavoritesList';

const App: React.FC = () => {
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });

  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id],
    );
  };

  const favoriteBooks = books.filter((b) => favorites.includes(b.id));

  return (
    <div className="container">
      <header className="header">
        <h1>Книжный магазин</h1>
        <button
          className="favorites-toggle-btn"
          onClick={() => setIsFavoritesOpen(true)}
        >
          Избранное:{' '}
          <span data-testid="favorites-count">{favorites.length}</span>
        </button>
      </header>

      <FavoritesList
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        favoriteBooks={favoriteBooks}
        onRemove={toggleFavorite}
      />

      <div className="book-list">
        {books.map((book) => (
          <BookCard
            key={book.id}
            book={book}
            isFavorite={favorites.includes(book.id)}
            onToggle={() => toggleFavorite(book.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default App;
