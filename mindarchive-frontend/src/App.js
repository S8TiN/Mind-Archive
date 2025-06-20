// src/App.js
import { ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React, { useEffect, useState, useRef, useContext } from 'react';
import NewMemoryForm from './NewMemoryForm';
import Login from './Login';
import './App.css';
import { ThemeContext } from './ThemeContext';

function App() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [memories, setMemories] = useState([]);
  const [selectedMemory, setSelectedMemory] = useState(null);
  const [editing, setEditing] = useState(false);
  const [draggingId, setDraggingId] = useState(null);
  const [user, setUser] = useState(null);

  const containerRefs = useRef({});
  const sectionIndexRef = useRef(null);

  const fetchUser = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/user/", {
        credentials: "include",
      });
      if (res.status === 200) {
        const data = await res.json();
        setUser(data);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/memories/')
      .then(res => res.json())
      .then(data => setMemories(data));
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!draggingId || sectionIndexRef.current === null) return;
      const container = containerRefs.current[sectionIndexRef.current];
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      let y = ((e.clientY - rect.top) / rect.height) * 100;
      y = Math.max(10, y);

      setMemories((prev) =>
        prev.map((m) =>
          m.id === draggingId ? { ...m, x: x.toFixed(2), y: y.toFixed(2) } : m
        )
      );
    };

    const handleMouseUp = () => {
      if (!draggingId) return;
      const memory = memories.find((m) => m.id === draggingId);
      if (memory) {
        fetch(`http://127.0.0.1:8000/api/memories/${memory.id}/`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ x: memory.x, y: memory.y }),
        });
      }
      setDraggingId(null);
      sectionIndexRef.current = null;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [draggingId, memories]);

  const getMonthYear = (title) => {
    const date = new Date(title);
    if (isNaN(date)) return 'unknown';
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
  };

  const groupedMemories = memories.reduce((acc, memory) => {
    const key = getMonthYear(memory.title);
    if (!acc[key]) acc[key] = [];
    acc[key].push(memory);
    return acc;
  }, {});

  const monthKeys = Object.keys(groupedMemories).sort((a, b) => {
    const getDateFromKey = (key) => new Date(`${key} 01`);
    return getDateFromKey(a) - getDateFromKey(b);
  });

  const sectionHeight = 600;

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this memory?')) return;
    const response = await fetch(`http://127.0.0.1:8000/api/memories/${id}/`, {
      method: 'DELETE',
    });
    if (response.ok) {
      toast.success("Memory deleted.");
      setMemories(prev => prev.filter(m => m.id !== id));
      setSelectedMemory(null);
    } else {
      toast.error("Failed to delete memory.");
    }
  };

  if (!user) {
    return <Login onLoginSuccess={fetchUser} />;
  }

  return (
    <div
      style={{
        background: theme === 'dark' ? '#000' : '#fff',
        color: theme === 'dark' ? '#8fdcff' : '#1a1a1a',
        overflowY: 'scroll',
        height: '100vh',
        padding: '16px',
        position: 'relative',
      }}
    >
      <button
        onClick={toggleTheme}
        style={{
          position: 'absolute',
          top: '1rem',
          right: '1rem',
          fontSize: '1.5rem',
          background: 'none',
          border: 'none',
          color: 'inherit',
          cursor: 'pointer',
          zIndex: 1000,
        }}
      >
        {theme === 'light' ? '🌙' : '☀️'}
      </button>

      <h1 style={{ marginBottom: '8px' }}>Mind Archive 🌌</h1>
      <p>Welcome, {user.username}!</p>

      <NewMemoryForm onAdd={() => {
        fetch('http://127.0.0.1:8000/api/memories/')
          .then(res => res.json())
          .then(data => setMemories(data));
      }} />

      {monthKeys.map((monthKey, index) => {
        const monthMemories = [...groupedMemories[monthKey]].sort((a, b) => new Date(a.title) - new Date(b.title));

        return (
          <div
            key={monthKey}
            ref={(el) => (containerRefs.current[index] = el)}
            style={{ position: 'relative', height: `${sectionHeight}px`, borderBottom: '1px solid #444' }}
          >
            <div
              style={{
                position: 'absolute', top: '10px', left: '20px', backgroundColor: theme === 'dark' ? '#000' : '#fff',
                color: theme === 'dark' ? '#8fdcff' : '#1a1a1a', fontSize: '18px', fontWeight: 'bold', padding: '4px 8px',
                borderRadius: '4px', zIndex: 5
              }}
            >
              {monthKey}
            </div>

            <svg style={{ position: 'absolute', width: '100%', height: '100%', zIndex: 0 }}>
              {monthMemories.map((curr, i) => {
                const prev = monthMemories[i - 1];
                if (!prev) return null;
                return (
                  <line
                    key={`${prev.id}-to-${curr.id}`}
                    x1={`${prev.x}%`} y1={`${prev.y * 0.9}%`}
                    x2={`${curr.x}%`} y2={`${curr.y * 0.9}%`}
                    stroke="#8fdcff"
                    strokeWidth="1"
                  />
                );
              })}
            </svg>

            {monthMemories.map((memory) => {
              const x = parseFloat(memory.x);
              const y = parseFloat(memory.y) * 0.9;
              if (isNaN(x) || isNaN(y)) return null;

              return (
                <div
                  key={memory.id}
                  onClick={() => {
                    setSelectedMemory(memory);
                    setEditing(false);
                  }}
                  onMouseDown={() => {
                    setDraggingId(memory.id);
                    sectionIndexRef.current = index;
                  }}
                  style={{
                    position: 'absolute', left: `${x}%`, top: `${y}%`, width: '10px', height: '10px',
                    borderRadius: '50%', backgroundColor: memory.color || '#ffffff', boxShadow: `0 0 8px 2px ${memory.color || '#8fdcff'}`,
                    cursor: 'grab', transform: 'translate(-50%, -50%)', zIndex: 1
                  }}
                />
              );
            })}
          </div>
        );
      })}

      {selectedMemory && editing && (
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const updatedMemory = {
              title: e.target.title.value,
              content: e.target.content.value,
              color: e.target.color.value,
            };

            const res = await fetch(`http://127.0.0.1:8000/api/memories/${selectedMemory.id}/`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(updatedMemory),
            });

            if (res.ok) {
              const updated = await res.json();
              toast.success("Memory updated");
              setMemories((prev) =>
                prev.map((m) => (m.id === updated.id ? updated : m))
              );
              setEditing(false);
              setSelectedMemory(null);
            } else {
              toast.error("Failed to update memory.");
            }
          }}
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '30px',
            backgroundColor: 'white',
            padding: '16px',
            borderRadius: '8px',
            boxShadow: '0 0 10px rgba(0,0,0,0.2)',
            zIndex: 10,
            width: '300px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <h3 style={{ color: theme === 'dark' ? '#8fdcff' : '#000' }}>Edit Memory</h3>
          <label style={{ color: theme === 'dark' ? '#8fdcff' : '#000' }}>Date:</label>
          <input name="title" type="date" defaultValue={selectedMemory.title} required />

          <label style={{ color: theme === 'dark' ? '#8fdcff' : '#000' }}>Memory:</label>
          <textarea name="content" defaultValue={selectedMemory.content} required rows={4} />

          <label style={{ color: theme === 'dark' ? '#8fdcff' : '#000' }}>Color:</label>
          <input name="color" type="color" defaultValue={selectedMemory.color || '#ffffff'} />

          <button type="submit">Save</button>
          
        </form>
      )}

      {selectedMemory && !editing && (
        <div
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '30px',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            padding: '24px',
            borderRadius: '16px',
            boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
            width: '300px',
            height: '220px',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            color: 'black'
          }}
        >
          <div>
            <h3 style={{ marginBottom: '8px', color: '#000' }}>{selectedMemory.title}</h3>
            <p><strong style={{ color: '#000' }}>Content:</strong> {selectedMemory.content}</p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
            <button style={{ padding: '6px 12px' }} onClick={() => setSelectedMemory(null)}>Close</button>
            <button style={{ backgroundColor: '#007bff', color: 'white', padding: '6px 12px' }} onClick={() => setEditing(true)}>Edit</button>
            <button style={{ backgroundColor: '#ff4d4d', color: 'white', padding: '6px 12px' }} onClick={() => handleDelete(selectedMemory.id)}>Delete</button>
          </div>
        </div>
      )}

      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
}

export default App;