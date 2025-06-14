import React, { useState } from 'react';

function NewMemoryForm({ onAdd }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newMemory = {
      title,
      content,
      x: (Math.random() * 80 + 10).toFixed(2),
      y: (Math.random() * 80 + 10).toFixed(2),
    };

    const response = await fetch('http://127.0.0.1:8000/api/memories/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newMemory),
    });

    if (response.ok) {
      onAdd();
      setTitle('');
      setContent('');
    } else {
      alert('Failed to save memory');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
      <input
        type="text"
        placeholder="Date (or Title)"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <br />
      <textarea
        placeholder="Memory content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      />
      <br />
      <button type="submit">Add Memory</button>
    </form>
  );
}

export default NewMemoryForm;
