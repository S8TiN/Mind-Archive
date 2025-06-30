import React, { useState, useContext } from 'react';
import { toast } from 'react-toastify';
import { ThemeContext } from './ThemeContext'; //make sure this path is correct

function NewMemoryForm({ onAdd }) {
  const { theme } = useContext(ThemeContext); //get theme from context
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [color, setColor] = useState('#ffffff'); 
  const [images, setImages] = useState([]);

  const handleImageChange = (index, file) => {
    if (!file) return;  //Prevents null uploads
    const newImages = [...images];
    newImages[index] = file;
    setImages(newImages);
  };


  const addImageInput = () => {
    setImages([...images, null]);
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('color', color);
    formData.append('x', (Math.random() * 80 + 10).toFixed(2));
    formData.append('y', (Math.random() * 80 + 10).toFixed(2));
    images.filter(Boolean).forEach(img => {
      formData.append('images', img);
    });

    for (let pair of formData.entries()) {
      console.log(pair[0] + ':', pair[1]);
    }

    const csrfToken = getCSRFTokenFromCookie();

    const response = await fetch('http://127.0.0.1:8000/api/memories/', {
      method: 'POST',
      headers: {
        'X-CSRFToken': csrfToken,
      },
      credentials: 'include',
      body: formData,
    });


    if (response.ok) {
      toast.success("Memory saved");
      onAdd();
      setTitle('');
      setContent('');
      setColor('#ffffff');
      setImages([]);
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

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <label style={{ color: theme === 'dark' ? '#8fdcff' : '#000' }}>Images:</label>
        {/* Initial choose file button if no files yet */}
        {images.length === 0 && (
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageChange(0, e.target.files[0])}
            style={{ padding: '6px', marginBottom: '6px' }}
          />
        )}

        {/* Render all added file inputs */}
        {images.map((img, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '6px'
            }}
          >
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(index, e.target.files[0])}
              style={{
                padding: '6px',
                flexGrow: 1
              }}
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
                  fontSize: '16px'
                }}
                aria-label="Remove image"
              >
                ❌
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
            width: 'fit-content'
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
