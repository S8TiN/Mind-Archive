import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Fetch CSRF token from backend
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

  useEffect(() => {
    fetchCSRFToken();
  }, []);

  const getCSRFTokenFromCookie = () => {
    const name = 'csrftoken=';
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookies = decodedCookie.split(';');
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
      console.log("Login response:", data);

      if (response.ok && data.key) {
        localStorage.setItem('authToken', data.key);
        navigate('/dashboard'); // ✅ Redirect on success
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
        background: '#000',
        color: '#8fdcff',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <h1>Welcome to Mind Archive 🌌</h1>

      {/* Google Login */}
      <a href="http://localhost:8000/accounts/google/login/">
        <button
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#8fdcff',
            color: '#000',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginBottom: '20px',
          }}
        >
          Login with Google
        </button>
      </a>

      {/* Username/Password Login */}
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
