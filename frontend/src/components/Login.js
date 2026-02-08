import React, { useState } from 'react';
import axios from 'axios';

function Login({ onLogin, apiBaseUrl }) {
  const [isSignup, setIsSignup] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (isSignup) {
        // Signup
        const response = await axios.post(`${apiBaseUrl}/users`, {
          username,
          password
        });
        onLogin(response.data.token, response.data);
      } else {
        // Login
        const response = await axios.post(`${apiBaseUrl}/users/login`, {
          username,
          password
        });
        onLogin(response.data.token, response.data.user);
      }
    } catch (err) {
      window.alert('Invalid username/password');
      setError('Invalid username/password');
    }
  };

  return (
    <div className={isSignup ? 'signup-container' : 'login-container'}>
      <h1>{isSignup ? 'Sign Up' : 'Login'}</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          {isSignup ? 'Sign Up' : 'Login'}
        </button>
      </form>
      <a
        className="toggle-link"
        onClick={() => {
          setIsSignup(!isSignup);
          setError('');
          setUsername('');
          setPassword('');
        }}
      >
        {isSignup ? 'Already have an account? Login' : "Don't have an account? Sign up"}
      </a>
    </div>
  );
}

export default Login;
