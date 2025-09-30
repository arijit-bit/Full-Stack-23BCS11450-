import React, { useState } from 'react';
import './App.css';
import BookList from './components/BookList';
import SearchBar from './components/SearchBar';
import BookForm from './components/BookForm';

function App() {
  // Sample book data
  const [books, setBooks] = useState([
    {
      id: 1,
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      isbn: "978-0-06-112008-4",
      publishedYear: 1960,
      genre: "Fiction",
      description: "A classic novel about racial injustice and childhood innocence in the American South."
    },
    {
      id: 2,
      title: "1984",
      author: "George Orwell",
      isbn: "978-0-452-28423-4",
      publishedYear: 1949,
      genre: "Dystopian Fiction",
      description: "A dystopian social science fiction novel about totalitarian control."
    },
    {
      id: 3,
      title: "Pride and Prejudice",
      author: "Jane Austen",
      isbn: "978-0-14-143951-8",
      publishedYear: 1813,
      genre: "Romance",
      description: "A romantic novel about manners, upbringing, morality, and marriage."
    },
    {
      id: 4,
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      isbn: "978-0-7432-7356-5",
      publishedYear: 1925,
      genre: "Fiction",
      description: "A story of decadence and excess in the Jazz Age."
    },
    {
      id: 5,
      title: "Harry Potter and the Sorcerer's Stone",
      author: "J.K. Rowling",
      isbn: "978-0-439-70818-8",
      publishedYear: 1997,
      genre: "Fantasy",
      description: "The first book in the beloved Harry Potter series."
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [editingBook, setEditingBook] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Generate next ID for new books
  const getNextId = () => {
    return books.length > 0 ? Math.max(...books.map(book => book.id)) + 1 : 1;
  };

  // Add new book
  const addBook = (bookData) => {
    const newBook = {
      ...bookData,
      id: getNextId()
    };
    setBooks(prevBooks => [...prevBooks, newBook]);
    setShowForm(false);
  };

  // Update existing book
  const updateBook = (bookData) => {
    setBooks(prevBooks => 
      prevBooks.map(book => 
        book.id === bookData.id ? bookData : book
      )
    );
    setEditingBook(null);
    setShowForm(false);
  };

  // Delete book
  const deleteBook = (bookId) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      setBooks(prevBooks => prevBooks.filter(book => book.id !== bookId));
    }
  };

  // Edit book
  const editBook = (book) => {
    setEditingBook(book);
    setShowForm(true);
  };

  // Filter books based on search term
  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.genre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="App">
      <header className="App-header">
        <h1>📚 Library Management System</h1>
      </header>
      
      <main className="main-content">
        <div className="controls">
          <SearchBar 
            searchTerm={searchTerm} 
            onSearch={setSearchTerm} 
          />
          <button 
            className="add-book-btn"
            onClick={() => {
              setEditingBook(null);
              setShowForm(!showForm);
            }}
          >
            {showForm ? 'Cancel' : '+ Add New Book'}
          </button>
        </div>

        {showForm && (
          <BookForm
            book={editingBook}
            onSubmit={editingBook ? updateBook : addBook}
            onCancel={() => {
              setShowForm(false);
              setEditingBook(null);
            }}
          />
        )}

        <BookList
          books={filteredBooks}
          onEdit={editBook}
          onDelete={deleteBook}
        />

        {filteredBooks.length === 0 && searchTerm && (
          <div className="no-results">
            <p>No books found matching "{searchTerm}"</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
