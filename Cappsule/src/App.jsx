import React, { useState } from 'react';
import axios from 'axios';
import Header from './components/Header';
import Results from './components/Results';

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    const response = await axios.get(`https://backend.cappsule.co.in/api/v1/new_search?q=${searchTerm}&pharmacyIds=1,2,3`);
    setResults(response.data.data.saltSuggestions);
  };

  return (
    <div>
      <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} handleSearch={handleSearch} />
      {results.length > 0 && <Results results={results} />}
    </div>
  );
};

export default App;