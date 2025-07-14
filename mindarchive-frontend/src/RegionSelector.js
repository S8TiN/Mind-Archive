// src/RegionSelector.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { ThemeContext } from './ThemeContext'; // make sure this path is correct

export default function RegionSelector() {
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);
  const [region, setRegion] = useState(
    localStorage.getItem('timezoneRegion') ||
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );

  // live preview of the selected time/date
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const saveRegion = () => {
    localStorage.setItem('timezoneRegion', region);
    navigate('/dashboard');                // go back to main page
  };

  return (
    <div style={{ padding: '2rem', color: theme === 'dark' ? '#8fdcff' : '#1a1a1a' }}>
      <h2>Select your region</h2>

      <select
        value={region}
        onChange={e => setRegion(e.target.value)}
        style={{ padding: '0.5rem', fontSize: '1rem', marginTop: '1rem' }}
      >
        <option value="America/Los_Angeles">Pacific (US)</option>
        <option value="America/Denver">Mountain (US)</option>
        <option value="America/Chicago">Central (US)</option>
        <option value="America/New_York">Eastern (US)</option>
        <option value="Europe/London">London</option>
        <option value="Europe/Berlin">Berlin</option>
        <option value="Asia/Tokyo">Tokyo</option>
        <option value="Australia/Sydney">Sydney</option>
      </select>

      <p style={{ marginTop: '1.5rem' }}>
        Current time in <strong>{region}</strong>:
        <br />
        {now.toLocaleString('en-US', {
          timeZone: region,
          weekday: 'short',
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        })}
      </p>

      <button onClick={saveRegion} style={{ padding: '0.5rem 1rem' }}>
        Save & Return
      </button>
    </div>
  );
}
