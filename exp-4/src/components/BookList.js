import React from 'react';
import './BookList.css';

const BookList = ({ books, onEdit, onDelete }) => {
  if (books.length === 0) {
    return (
      <div className="book-list-empty">
        <h3>📖 No books available</h3>
        <p>Add your first book to get started!</p>
      </div>
    );
  }

  return (
    <div className="book-list">
      <div className="book-grid">
        {books.map(book => (
          <div key={book.id} className="book-card">
            <div className="book-header">
              <h3 className="book-title">{book.title}</h3>
              <div className="book-actions">
                <button 
                  className="edit-btn"
                  onClick={() => onEdit(book)}
                  title="Edit book"
                >
                  ✏️
                </button>
                <button 
                  className="delete-btn"
                  onClick={() => onDelete(book.id)}
                  title="Delete book"
                >
                  🗑️
                </button>
              </div>
            </div>
            
            <div className="book-details">
              <p className="book-author">
                <strong>Author:</strong> {book.author}
              </p>
              <p className="book-genre">
                <strong>Genre:</strong> {book.genre}
              </p>
              <p className="book-year">
                <strong>Published:</strong> {book.publishedYear}
              </p>
              <p className="book-isbn">
                <strong>ISBN:</strong> {book.isbn}
              </p>
              {book.description && (
                <p className="book-description">
                  <strong>Description:</strong> {book.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookList;