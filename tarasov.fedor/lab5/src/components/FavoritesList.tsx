import React from 'react';
import {Book} from '../data';

interface Props {
  favoriteBooks: Book[];
  onRemove: (id: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const FavoritesList: React.FC<Props> = ({
  favoriteBooks,
  onRemove,
  isOpen,
  onClose,
}) => {
  return (
    <div
      className="modal-overlay"
      data-testid="favorites-list"
      style={{display: isOpen ? 'flex' : 'none'}}
      onClick={onClose}
    >
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Ваше избранное</h2>
          <button className="close-btn" onClick={onClose}>
            &times;
          </button>
        </div>

        {favoriteBooks.length === 0 ? (
          <p className="empty-message">Список пуст</p>
        ) : (
          <div className="favorites-items">
            {favoriteBooks.map((book) => (
              <div
                key={book.id}
                className="favorite-item"
                data-testid="favorite-item"
              >
                <span className="fav-title">{book.title}</span>
                <span className="fav-price">{book.price} ₽</span>
                <button
                  className="remove-btn"
                  onClick={() => onRemove(book.id)}
                >
                  Удалить
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesList;
