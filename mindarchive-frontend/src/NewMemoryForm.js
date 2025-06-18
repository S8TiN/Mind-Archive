import React, { useState } from 'react';

function NewMemoryForm({ onAdd }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [color, setColor] = useState('#ffffff'); 

  // 🔒 Get CSRF token from cookie
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newMemory = {
      title,
      content,
      color, 
      x: (Math.random() * 80 + 10).toFixed(2),
      y: (Math.random() * 80 + 10).toFixed(2),
    };

    const csrfToken = getCSRFTokenFromCookie();

    const response = await fetch('http://127.0.0.1:8000/api/memories/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken,
      },
      credentials: 'include',
      body: JSON.stringify(newMemory),
    });

    if (response.ok) {
      onAdd();
      setTitle('');
      setContent('');
      setColor('#ffffff'); // Reset color too
    } else {
      alert('Failed to save memory.');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        marginBottom: '1rem',
        color: '#8fdcff',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        maxWidth: '320px',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <label htmlFor="date">Date:</label>
        <input
          id="date"
          type="date"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{ padding: '6px' }}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <label htmlFor="content">Memory:</label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows={4}
          style={{ padding: '6px' }}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <label htmlFor="color">Color:</label>
        <input
          id="color"
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          style={{ width: '100%' }}
        />
      </div>

      <button
        type="submit"
        style={{ padding: '8px', backgroundColor: '#4da6ff', color: 'white', border: 'none', borderRadius: '6px' }}
      >
        Add Memory
      </button>
    </form>
  );
}

export default NewMemoryForm;
