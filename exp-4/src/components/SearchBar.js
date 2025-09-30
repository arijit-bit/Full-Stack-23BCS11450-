import React from 'react';
import './SearchBar.css';

const SearchBar = ({ searchTerm, onSearch }) => {
  const handleInputChange = (e) => {
    onSearch(e.target.value);
  };

  const clearSearch = () => {
    onSearch('');
  };

  return (
    <div className="search-bar">
      <div className="search-input-container">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder="Search by title, author, or genre..."
          value={searchTerm}
          onChange={handleInputChange}
          className="search-input"
        />
        {searchTerm && (
          <button 
            className="clear-search-btn"
            onClick={clearSearch}
            title="Clear search"
          >
            ✕
          </button>
        )}
      </div>
      {searchTerm && (
        <div className="search-info">
          Searching for: <span className="search-term">"{searchTerm}"</span>
        </div>
      )}
    </div>
  );
};

export default SearchBar;