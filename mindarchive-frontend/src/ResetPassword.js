import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function ResetPassword() {
  const { uid, token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/api/password-reset-confirm/${uid}/${token}/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        setConfirmed(true);
      } else {
        const data = await response.json();
        setError(data.error || 'Reset failed.');
      }
    } catch (err) {
      setError('Something went wrong.');
      console.error(err);
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
        <source src="/resetpasswordwallpaper.mp4" type="video/mp4" />
      </video>

      <div
        style={{
          color: '#8fdcff',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          padding: '20px',
          position: 'relative'
        }}
      >
        <h2 style={{ color: '#000' }}>Set a New Password</h2>

        {confirmed ? (
          <>
            <p style={{ color: '#000' }}>Your password has been reset. You can now log in!</p>
            <button
              onClick={() => navigate('/login')}
              style={{
                marginTop: '1rem',
                padding: '10px 20px',
                backgroundColor: '#8fdcff',
                color: '#000',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Back to Login
            </button>
          </>
        ) : (
          <form onSubmit={handleSubmit} style={{ maxWidth: '400px', width: '100%' }}>
            {/* First password field with toggle icon */}
            <div style={{ position: 'relative', marginBottom: '1rem' }}>
              <input
                type={showPasswords ? 'text' : 'password'}
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  padding: '10px',
                  width: '95%',
                  borderRadius: '8px',
                  border: '1px solid #000',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: '#000',
                  outline: 'none'
                }}
              />
              <img
                src={showPasswords ? '/hide.png' : '/show.png'}
                alt="Toggle password visibility"
                onClick={() => setShowPasswords(prev => !prev)}
                style={{
                  position: 'absolute',
                  top: '50%',
                  right: '10px',
                  transform: 'translateY(-50%)',
                  cursor: 'pointer',
                  width: '20px',
                  height: '20px'
                }}
              />
            </div>

            {/* Second password field (no icon, just follows state) */}
            <div style={{ position: 'relative', marginBottom: '1rem' }}>
              <input
                type={showPasswords ? 'text' : 'password'}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                style={{
                  padding: '10px',
                  width: '95%',
                  borderRadius: '8px',
                  border: '1px solid #000',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: '#000',
                  outline: 'none'
                }}
              />
            </div>

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
              Reset Password
            </button>

            {error && <p style={{ color: 'salmon', marginTop: '1rem' }}>{error}</p>}
          </form>
        )}
      </div>
    </div>
  );
}
