import React, { useState } from 'react';
import { API_BASE } from './config';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // reuse the same CSRF cookie helper as Login
  const getCSRFTokenFromCookie = () => {
    const m = document.cookie.match(/(?:^|;\s*)csrftoken=([^;]+)/);
    return m ? decodeURIComponent(m[1]) : '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // prime CSRF cookie (safe if it already exists)
      await fetch(`${API_BASE}/csrf/`, { credentials: 'include' });
      const csrf = getCSRFTokenFromCookie();

      const response = await fetch(`${API_BASE}/api/password-reset/`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrf,
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        const txt = await response.text();
        alert('Failed to send reset email.' + (txt ? `\n\n${txt}` : ''));
      }
    } catch (err) {
      console.error('Error sending password reset:', err);
      alert('Something went wrong.');
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
            zIndex: -1
        }}
        >
        <source src="/star.mp4" type="video/mp4" />
        </video>

        <div style={{
        color: '#8fdcff',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        padding: '20px',
        position: 'relative'
        }}>
        <h2>Reset Your Password</h2>

        {submitted ? (
            <p>We’ve sent you an email with instructions to reset your password.</p>
        ) : (
            <form onSubmit={handleSubmit} style={{ maxWidth: '400px', width: '100%' }}>
            <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                padding: '10px',
                width: '100%',
                marginBottom: '1rem',
                borderRadius: '8px',
                border: '1px solid #8fdcff',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: '#8fdcff',
                outline: 'none'
                }}
            />
            <button
                type="submit"
                style={{
                padding: '10px 20px',
                backgroundColor: '#8fdcff',
                color: '#000',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 'bold',
                cursor: 'pointer'
                }}
            >
                Send Reset Link
            </button>
            </form>
        )}
        </div>
    </div>
    );
}
