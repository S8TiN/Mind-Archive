import React, { useState, useContext } from 'react';
import { toast } from 'react-toastify';
import { ThemeContext } from './ThemeContext'; //make sure this path is correct

function NewMemoryForm({ onAdd }) {
  const { theme } = useContext(ThemeContext); //get theme from context
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [color, setColor] = useState('#ffffff'); 

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
      toast.success("Memory saved");
      onAdd();
      setTitle('');
      setContent('');
      setColor('#ffffff');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        marginBottom: '1rem',
        color: theme === 'dark' ? '#8fdcff' : '#000', //switch text color based on theme
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        maxWidth: '320px',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <label htmlFor="date" style={{ color: theme === 'dark' ? '#8fdcff' : '#000' }}>Date:</label>
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
        <label htmlFor="content" style={{ color: theme === 'dark' ? '#8fdcff' : '#000' }}>Memory:</label>
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
        <label htmlFor="color" style={{ color: theme === 'dark' ? '#8fdcff' : '#000' }}>Color:</label>
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
