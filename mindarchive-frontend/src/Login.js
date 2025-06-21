// src/Login.js
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from './ThemeContext';

function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { theme, toggleTheme } = useContext(ThemeContext); // ⬅️ Grab theme/toggle

  useEffect(() => {
    fetchCSRFToken();

    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
      });

      window.google.accounts.id.renderButton(
        document.getElementById('g-signin'),
        {
          theme: 'outline',
          size: 'large',
          text: 'signin_with',
          shape: 'rectangular',
          logo_alignment: 'center',
        }
      );
    }
  }, []);

  const fetchCSRFToken = async () => {
    try {
      const res = await fetch('http://localhost:8000/csrf/', {
        credentials: 'include',
      });
      console.log('CSRF cookie set:', res.status);
    } catch (err) {
      console.error('Failed to fetch CSRF:', err);
    }
  };

  const handleCredentialResponse = async (response) => {
    try {
      const res = await fetch('http://localhost:8000/api/google-login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ credential: response.credential }),
      });

      const data = await res.json();
      if (res.ok) {
        console.log('Google login success:', data);
        if (onLoginSuccess) {
          onLoginSuccess();
        } else {
          navigate('/dashboard');
        }
      } else {
        alert('Google login failed: ' + (data.error || ''));
      }
    } catch (err) {
      console.error('Google login error:', err);
      alert('Something went wrong with Google login.');
    }
  };

  const getCSRFTokenFromCookie = () => {
    const name = 'csrftoken=';
    const cookies = decodeURIComponent(document.cookie).split(';');
    for (let cookie of cookies) {
      cookie = cookie.trim();
      if (cookie.startsWith(name)) {
        return cookie.slice(name.length);
      }
    }
    return '';
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const csrfToken = getCSRFTokenFromCookie();

    try {
      const response = await fetch('http://localhost:8000/api/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (response.ok && data.key) {
        localStorage.setItem('authToken', data.key);
        navigate('/dashboard');
      } else {
        alert('Login failed: ' + (data?.non_field_errors || data?.detail || 'Unknown error'));
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login request failed.');
    }
  };

  return (
    <div
      style={{
        background: theme === 'dark' ? '#000' : '#fff',
        color: theme === 'dark' ? '#8fdcff' : '#1a1a1a',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
        position: 'relative',
      }}
    >
      {/* Theme Toggle in top-right */}
      <button
        onClick={toggleTheme}
        style={{
          position: 'absolute',
          top: '1rem',
          right: '1rem',
          fontSize: '1.5rem',
          background: 'none',
          border: 'none',
          color: 'inherit',
          cursor: 'pointer',
        }}
      >
        {theme === 'light' ? '🌙' : '☀️'}
      </button>

      <h1>Welcome to Mind Archive 🌌</h1>
      <p className="intro-text">
        The web app that allows you to record life’s key moments and explore your memories in a visual, evolving space.
      </p>

      <p>Please sign in to continue</p>

      <div id="g-signin" style={{ marginBottom: '20px' }}></div>

      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          required
          onChange={(e) => setUsername(e.target.value)}
          style={{ marginBottom: '10px', padding: '8px' }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
          style={{ marginBottom: '10px', padding: '8px' }}
        />
        <button type="submit" style={{ padding: '8px 16px' }}>Log In</button>
      </form>
    </div>
  );
}

export default Login;
