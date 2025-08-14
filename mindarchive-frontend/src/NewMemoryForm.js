// src/NewMemoryForm.js
import React, { useState, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';
import { ThemeContext } from './ThemeContext';
import { API_BASE } from './config';

function NewMemoryForm({ onAdd, user }) {
  const { theme } = useContext(ThemeContext);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [color, setColor] = useState('#ffffff');
  const [images, setImages] = useState([null]); // start with one input

  const userEmail = user?.email || 'guest';

  const [recentColors, setRecentColors] = useState([]);
  useEffect(() => {
    const stored = localStorage.getItem(`recentColors_${userEmail}`);
    if (stored) setRecentColors(JSON.parse(stored));
  }, [userEmail]);

  const updateRecentColors = (newColor) => {
    setRecentColors((prev) => {
      const updated = [newColor, ...prev.filter((c) => c !== newColor)].slice(0, 5);
      localStorage.setItem(`recentColors_${userEmail}`, JSON.stringify(updated));
      return updated;
    });
  };

  const handleImageChange = (index, file) => {
    if (!file) return;
    const newImages = [...images];
    newImages[index] = file;
    setImages(newImages);
  };

  const addImageInput = () => setImages((prev) => [...prev, null]);

  const getCSRFTokenFromCookie = () => {
    const m = document.cookie.match(/(?:^|;\s*)csrftoken=([^;]+)/);
    return m ? decodeURIComponent(m[1]) : '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // randomize coordinates if not set by UI
    const x = (Math.random() * 80 + 10).toFixed(2);
    const y = (Math.random() * 80 + 10).toFixed(2);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('color', color);
    formData.append('x', x);
    formData.append('y', y);

    // append all selected images
    images.filter(Boolean).forEach((img) => formData.append('images', img));

    // (optional) prime CSRF cookie
    try {
      await fetch(`${API_BASE}/csrf/`, { credentials: 'include' });
    } catch (_) {}

    const csrfToken = getCSRFTokenFromCookie();
    const token = localStorage.getItem('authToken');

    try {
      const response = await fetch(`${API_BASE}/api/memories/`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          // don't set Content-Type when using FormData
          Authorization: token ? `Token ${token}` : '',
          'X-CSRFToken': csrfToken,
        },
        body: formData,
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || `HTTP ${response.status}`);
      }

      toast.success('Memory saved');
      updateRecentColors(color);

      // let parent refresh the list
      onAdd && onAdd();

      // reset form
      setTitle('');
      setContent('');
      setColor('#ffffff');
      setImages([]); // show the single "choose file" input again
    } catch (err) {
      console.error('Create memory failed:', err);
      toast.error('Failed to save memory');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        marginBottom: '1rem',
        color: theme === 'dark' ? '#8fdcff' : '#000',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        maxWidth: '320px',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <label htmlFor="date" style={{ color: theme === 'dark' ? '#8fdcff' : '#000' }}>
          Date:
        </label>
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
        <label htmlFor="content" style={{ color: theme === 'dark' ? '#8fdcff' : '#000' }}>
          Memory:
        </label>
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
        <label htmlFor="color" style={{ color: theme === 'dark' ? '#8fdcff' : '#000' }}>
          Color:
        </label>
        <input
          id="color"
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          style={{ width: '100%' }}
        />
      </div>

      {recentColors.length > 0 && (
        <div
          style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}
        >
          <span style={{ fontSize: '0.9rem', color: theme === 'dark' ? '#8fdcff' : '#000' }}>
            Recently Used:
          </span>
          {recentColors.map((c, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setColor(c)}
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                border: '1px solid #ccc',
                backgroundColor: c,
                cursor: 'pointer',
              }}
              aria-label={`Use recent color ${c}`}
            />
          ))}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <label style={{ color: theme === 'dark' ? '#8fdcff' : '#000' }}>Images:</label>

        {images.length === 0 && (
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageChange(0, e.target.files[0])}
            style={{ padding: '6px', marginBottom: '6px' }}
          />
        )}

        {images.map((img, index) => (
          <div
            key={index}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}
          >
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(index, e.target.files[0])}
              style={{ padding: '6px', flexGrow: 1, color: theme === 'dark' ? '#8fdcff' : '#000' }}
            />
            {index > 0 && (
              <button
                type="button"
                onClick={() => {
                  const newImages = [...images];
                  newImages.splice(index, 1);
                  setImages(newImages);
                }}
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: theme === 'dark' ? '#ff8080' : '#cc0000',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  fontSize: '16px',
                }}
                aria-label="Remove image"
              >
                ✕
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={addImageInput}
          style={{
            padding: '6px',
            backgroundColor: '#e0e0e0',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            width: 'fit-content',
          }}
        >
          + Add file
        </button>
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

