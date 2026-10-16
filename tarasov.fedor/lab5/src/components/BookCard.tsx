import React from 'react';
import {Book} from '../data';

interface Props {
  book: Book;
  isFavorite: boolean;
  onToggle: () => void;
}

const BookCard: React.FC<Props> = ({book, isFavorite, onToggle}) => {
  return (
    <div className="book-card" data-testid="book-card">
      <div className="book-cover">
        {book.cover ? (
          <img src={book.cover} alt={`Обложка книги ${book.title}`} />
        ) : (
          <span>Нет обложки</span>
        )}
      </div>
      <h3 className="book-title">{book.title}</h3>
      <div className="book-meta">Рейтинг: {book.rating}⭐</div>
      <p className="book-desc">{book.description}</p>
      <div className="book-price">{book.price} ₽</div>
      <button
        data-testid="favorite-add"
        className={`fav-btn ${isFavorite ? 'active' : ''}`}
        onClick={onToggle}
      >
        {isFavorite ? 'В избранном ♥' : 'Добавить в избранное ♡'}
      </button>
    </div>
  );
};

export default BookCard;
