import React from 'react';
import './Header.css'; // import the CSS file

const Header = ({ searchTerm, setSearchTerm, handleSearch }) => {
  return (
    <header className="header">
      <div className="search-bar">
        <input 
          type="text" 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
          placeholder="Search for medicine"
          className="search-input"
        />
        <button onClick={handleSearch} className="search-button">Search</button>
      </div>
      <h2 className="header-message">Find medicine with amazing discounts</h2>
    </header>
  );
};

export default Header;