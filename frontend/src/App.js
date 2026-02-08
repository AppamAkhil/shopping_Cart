import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import Login from './components/Login';
import Items from './components/Items';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || 'null'));

  React.useEffect(() => {
    if (localStorage.getItem('token')) {
      setToken(localStorage.getItem('token'));
      setUser(JSON.parse(localStorage.getItem('user')));
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (token, userData) => {
    setToken(token);
    setUser(userData);
    setIsLoggedIn(true);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setToken('');
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <div className="App">
      {!isLoggedIn ? (
        <Login onLogin={handleLogin} apiBaseUrl={API_BASE_URL} />
      ) : (
        <Items token={token} user={user} onLogout={handleLogout} apiBaseUrl={API_BASE_URL} />
      )}
    </div>
  );
}

export default App;
