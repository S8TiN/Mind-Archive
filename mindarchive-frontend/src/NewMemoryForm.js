import React, { useState } from 'react';

function NewMemoryForm({ onAdd }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

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
    } else {
      alert('Failed to save memory.');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '1rem', color: '#8fdcff' }}>
      <label>
        Date:
        <input
          type="date"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{ marginLeft: '10px', padding: '4px' }}
        />
      </label>
      <br /><br />
      <label>
        Memory:
        <br />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows={4}
          style={{ width: '300px', padding: '6px' }}
        />
      </label>
      <br />
      <button type="submit" style={{ marginTop: '8px', padding: '6px 12px' }}>
        Add Memory
      </button>
    </form>
  );
}

export default NewMemoryForm;
