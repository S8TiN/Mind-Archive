// src/RegionSelector.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function RegionSelector() 
{
  const navigate = useNavigate();

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
    navigate('/dashboard'); // go back to main page
  };

  const timeZoneOptions = [
    {
      label: 'Pacific Standard Time',
      abbr: 'PST',
      city: 'Los Angeles',
      value: 'America/Los_Angeles',
    },
    {
      label: 'Mountain Standard Time',
      abbr: 'MST',
      city: 'Denver',
      value: 'America/Denver',
    },
    {
      label: 'Central Standard Time',
      abbr: 'CST',
      city: 'Chicago',
      value: 'America/Chicago',
    },
    {
      label: 'Eastern Standard Time',
      abbr: 'EST',
      city: 'New York',
      value: 'America/New_York',
    },
    {
      label: 'Greenwich Mean Time',
      abbr: 'GMT',
      city: 'London',
      value: 'Etc/GMT',
    },
    {
      label: 'Central European Time',
      abbr: 'CET',
      city: 'Paris',
      value: 'Europe/Paris',
    },
    {
      label: 'India Standard Time',
      abbr: 'IST',
      city: 'New Delhi',
      value: 'Asia/Kolkata',
    },
    {
      label: 'Japan Standard Time',
      abbr: 'JST',
      city: 'Tokyo',
      value: 'Asia/Tokyo',
    },
    {
      label: 'Australian Eastern Time',
      abbr: 'AEST',
      city: 'Sydney',
      value: 'Australia/Sydney',
    },
  ];

  
  const getTimeInZone = (zone) => {
    return new Date().toLocaleTimeString('en-US', {
      timeZone: zone,
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <>
      <video
        autoPlay
        muted
        loop
        playsInline
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: -1
        }}
      >
        <source src="/regionwallpaper.mp4" type="video/mp4" />
      </video>

      <div style={{
        padding: '2rem',
        color: '#8fdcff',
        position: 'relative',
        zIndex: 1
      }}>

      <h2>Select your region: </h2>

      <select
        value={region}
        onChange={e => setRegion(e.target.value)}
        style={{ padding: '0.5rem', fontSize: '1rem', marginTop: '1rem', width: '60%' }}
      >
        {timeZoneOptions.map((tz, index) => (
          <option key={index} value={tz.value}>
            {tz.label} ({tz.abbr}) – {tz.city} – {getTimeInZone(tz.value)}
          </option>
        ))}
      </select>

      <p style={{ marginTop: '1.5rem' }}>
        <strong>Selected time/date:</strong>
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
      
    </>

  );

}

