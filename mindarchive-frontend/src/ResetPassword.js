import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

export default function ResetPassword() {
  const { uid, token } = useParams();
  const [password, setPassword] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

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
    <div>
      <h2>Set New Password</h2>
      {confirmed ? (
        <p>Password has been reset. You can now log in.</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Reset Password</button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
      )}
    </div>
  );
}
