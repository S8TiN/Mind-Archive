// src/Login.js
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

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
      if (res.ok && data.token && data.user) {
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        onLoginSuccess ? onLoginSuccess() : navigate('/dashboard');
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

        // 🔁 Fetch user info (uses token via session)
        const userRes = await fetch('http://localhost:8000/api/user/', {
          credentials: 'include'
        });
        const userData = await userRes.json();

        if (userRes.ok) {
          localStorage.setItem('user', JSON.stringify(userData));
          navigate('/dashboard');
        } else {
          alert('Login succeeded, but failed to fetch user data');
        }
      }


      else {
        alert('Login failed: ' + (data?.non_field_errors || data?.detail || 'Unknown error'));
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login request failed.');
    }
  };

  return (
    <div style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
      <video
        autoPlay
        muted
        loop
        playsInline
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: -1,
        }}
      >
        <source src="/star.mp4" type="video/mp4" />
      </video>

      <div
        style={{
          color: '#8fdcff',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '20px',
          position: 'relative',
        }}
      >
        <h1>Welcome to Mind Archive</h1>

        <p
          style={{
            fontSize: '1.25rem',
            lineHeight: '1.8',
            textAlign: 'center',
            maxWidth: '700px',
            margin: '20px auto',
          }}
        >
          The web app that allows you to record life’s key moments and explore your memories in a
          visual, evolving space.
        </p>

        <p>Please sign in to continue</p>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            required
            onChange={(e) => setUsername(e.target.value)}
            style={{
              marginBottom: '12px',
              padding: '12px',
              width: '150px',
              borderRadius: '12px',
              border: '1px solid #8fdcff',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              color: '#8fdcff',
              fontSize: '16px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              backdropFilter: 'blur(6px)',
              outline: 'none',
              transition: '0.3s ease',
            }}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
            style={{
              marginBottom: '20px',
              padding: '12px',
              width: '150px',
              borderRadius: '12px',
              border: '1px solid #8fdcff',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              color: '#8fdcff',
              fontSize: '16px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              backdropFilter: 'blur(6px)',
              outline: 'none',
              transition: '0.3s ease',
            }}
          />

          <button
            type="submit"
            style={{
              width: '175px',
              padding: '10px 0',
              backgroundColor: '#fff',
              color: '#000',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            Log In
          </button>
        </form>

        {/* Forgot password and register links grouped */}
        <div style={{ marginTop: '1.2rem', fontSize: '0.95rem', textAlign: 'center' }}>
          <p>
            Forgot password?{' '}
            <Link to="/forgot-password" style={{ color: '#8fdcff', textDecoration: 'underline' }}>
              Reset here
            </Link>
          </p>
          <p>
            Don’t have an account?{' '}
            <span
              onClick={() => navigate('/register')}
              style={{ color: '#8fdcff', textDecoration: 'underline', cursor: 'pointer' }}
            >
              Create one here
            </span>
          </p>
        </div>

        {/* OR separator */}
        <div style={{ margin: '20px 0', color: '#8fdcff' }}>────────  or  ────────</div>

        {/* Google Sign In */}
        <div id="g-signin" style={{ marginBottom: '20px' }}></div>
      </div>
    </div>
  );
}

export default Login;

