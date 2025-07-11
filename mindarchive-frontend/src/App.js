// src/App.js
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React, { useEffect, useState, useRef, useContext } from 'react';
import NewMemoryForm from './NewMemoryForm';
import Login from './Login';
import './App.css';
import { ThemeContext } from './ThemeContext';

function App() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  useEffect(() => {
    document.body.className = theme === 'dark' ? 'dark' : 'light';
  }, [theme]);

  const [memories, setMemories] = useState([]);
  const [selectedMemory, setSelectedMemory] = useState(null);
  const [editing, setEditing] = useState(false);
  const [draggingId, setDraggingId] = useState(null);
  const [hoveredMemoryId, setHoveredMemoryId] = useState(null);
  const [user, setUser] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [infoExpanded, setInfoExpanded] = useState(false);

  const containerRefs = useRef({});
  const sectionIndexRef = useRef(null);

  const [currentTime, setCurrentTime] = useState(new Date());
  const [region, setRegion] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);


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
      const interval = setInterval(() => {
        setCurrentTime(new Date());
      }, 1000);
      return () => clearInterval(interval);
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

    if (date.getUTCDate() === 1) {
      // Shift by +1 day to avoid timezone misclassification
      date.setUTCDate(date.getUTCDate() + 1);
    }

    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    return `${monthNames[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
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
        color: theme === 'dark' ? '#8fdcff' : '#1a1a1a',
        overflowY: 'scroll',
        height: '100vh',
        padding: '16px',
        position: 'relative',
      }}
    >

      {theme === 'dark' && (
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
          <source src="/star.mp4" type="video/mp4" />
        </video>
      )}

      {theme === 'light' && (
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
          <source src="/cloudwallpaper.mp4" type="video/mp4" />
        </video>
      )}


          {/* 🌐 Profile picture dropdown toggle */}
    <div style={{ position: 'absolute', top: '1rem', right: '1rem', display: 'flex', alignItems: 'center', gap: '12px', zIndex: 1000 }}>
      <div style={{ 
        color: theme === 'dark' ? '#8fdcff' : '#333', 
        fontWeight: 'bold', 
        fontSize: '14px', 
        textAlign: 'right',
        display: 'flex', 
        flexDirection: 'row', 
        gap: '8px', 
        alignItems: 'center' 
      }}>
        <span>{currentTime.toLocaleDateString('en-US', { timeZone: region })}</span>
        <span>{currentTime.toLocaleTimeString('en-US', { timeZone: region })}</span>
      </div>

      <img
        src={user?.picture || "/avatars/avatar1.jpg"}
        alt="Profile"
        onClick={() => setShowMenu(prev => !prev)}
        style={{
          width: 35,
          height: 35,
          objectFit: 'cover',
          borderRadius: '50%',
          cursor: 'pointer',
          border: theme === 'dark' ? '2px solid #8fdcff' : '2px solid #333'
        }}
      />

      {showMenu && (
        <div style={{
          position: 'absolute',
          top: 50,
          right: 0,
          backgroundColor: theme === 'dark' ? '#111' : '#fff',
          color: theme === 'dark' ? '#fff' : '#000',
          boxShadow: '0px 4px 12px rgba(0,0,0,0.15)',
          borderRadius: '8px',
          padding: '10px',
          zIndex: 100,
          minWidth: '205px',
          maxWidth: '220px',
          whiteSpace: 'normal',
          wordWrap: 'break-word'
        }}>
          
          <div
            onClick={() => {
              toggleTheme();
              setShowMenu(false);
            }}
            
            style={{
              padding: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              width: '150px', 
              whiteSpace: 'nowrap',
              gap: '8px',
            }}
          >
            🌗 Toggle Dark Mode
          </div>

          <div
            style={{
              padding: '8px',
              cursor: 'default',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              width: '150px',
              whiteSpace: 'nowrap',
              gap: '6px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              🌍 <span>Change Region</span>
            </div>
            <select
              value={region}
              onChange={(e) => {
                setRegion(e.target.value);
                localStorage.setItem("timezoneRegion", e.target.value);
              }}
              style={{
                padding: '4px 8px',
                fontSize: '14px',
                width: '100%',
              }}
            >
              <option value="America/Los_Angeles">Pacific (US)</option>
              <option value="America/New_York">Eastern (US)</option>
              <option value="Europe/London">London</option>
              <option value="Asia/Tokyo">Tokyo</option>
              <option value="Australia/Sydney">Sydney</option>
            </select>
          </div>


          <div
            onClick={() => {
              localStorage.removeItem("authToken");
              localStorage.removeItem("user");
              window.location.href = "/login";
            }}
            style={{
              padding: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              width: '150px',
              whiteSpace: 'nowrap',
              gap: '8px',
            }}
          >
            🚪 Logout
          </div>
        </div>
      )}
    </div>


      <h1 style={{ marginBottom: '8px' }}>Mind Archive 🌌</h1>
      <p style={{ fontSize: '20px', fontWeight: 'bold' }}>
        Welcome, {user.username}!
      </p>

      <NewMemoryForm onAdd={() => {
        fetch('http://127.0.0.1:8000/api/memories/')
          .then(res => res.json())
          .then(data => {
            setMemories(data);
            setSelectedMemory(null); 
          });
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
                  onMouseEnter={() => setHoveredMemoryId(memory.id)}
                  onMouseLeave={() => setHoveredMemoryId(null)}
                  style={{
                    position: 'absolute',
                    left: `${x}%`,
                    top: `${y}%`,
                    transform: 'translate(-50%, -50%)',
                    cursor: 'grab',
                    zIndex: 1
                  }}
                >
                  <div
                    className="circle-star"
                    style={{ backgroundColor: memory.color || '#ffffff' }}
                  ></div>

                  {hoveredMemoryId === memory.id && (
                    <div style={{
                      position: 'absolute',
                      top: '-32px',
                      left: '10px',
                      backgroundColor: theme === 'dark' ? '#111' : '#f1f1f1',
                      color: theme === 'dark' ? '#8fdcff' : '#222',
                      padding: '6px 10px',
                      borderRadius: '8px',
                      fontSize: '0.75rem',
                      whiteSpace: 'nowrap',
                      zIndex: 5
                    }}>
                      {memory.title}
                    </div>
                  )}
                </div>
              );

            })}
          </div>
        );
      })}

      {selectedMemory && editing && (
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData();
            formData.append("title", e.target.title.value);
            formData.append("content", e.target.content.value);
            formData.append("color", e.target.color.value);

            // Append new image file
            const imageFile = e.target.newImage.files[0];
            if (imageFile) {
              formData.append("image", imageFile);
            }

            const res = await fetch(`http://127.0.0.1:8000/api/memories/${selectedMemory.id}/`, {
              method: 'PATCH',
              body: formData,
              headers: {
                // DON'T include 'Content-Type', let the browser set it
              },
            });


            if (res.ok) {
              const updated = await res.json();
              toast.success("Memory updated");

              // 🔁 Fetch fresh copy from backend (with all images)
              const refreshed = await fetch(`http://127.0.0.1:8000/api/memories/${updated.id}/`)
                .then(r => r.json());

              setMemories((prev) =>
                prev.map((m) => (m.id === updated.id ? refreshed : m))
              );
              setSelectedMemory(refreshed); // ✅ Keep selected memory open, now with new images
              setEditing(false);
            }
            
            else {
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

          <button
            onClick={() => {
              const fresh = memories.find(m => m.id === selectedMemory.id);
              setSelectedMemory(fresh);
              setEditing(false);
            }}

            style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              background: 'transparent',
              border: 'none',
              fontSize: '18px',
              color: '#333',
              cursor: 'pointer',
            }}
          >
            ✕
          </button>

          <h3 style={{ color: '#000' }}>Edit Memory</h3>

          <label style={{ color: '#000' }}>Date:</label>
          <input name="title" type="date" defaultValue={selectedMemory.title} required />

          <label style={{ color: '#000' }}>Memory:</label>
          <textarea name="content" defaultValue={selectedMemory.content} required rows={4} />

          <label style={{ color: '#000' }}>Color:</label>
          <input
            name="color"
            type="color"
            defaultValue={selectedMemory.color || '#ffffff'}
            style={{ width: '100%', height: '30px', padding: '4px' }}
          />

          {/* Existing images with delete buttons */}
          {selectedMemory.images && selectedMemory.images.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ color: '#000' }}>Existing Images:</label>
              {selectedMemory.images.map((img, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <img
                    src={img.image}
                    alt={`Image ${i + 1}`}
                    style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px' }}
                  />
                  <button
                    type="button"
                    onClick={async () => {
                      const res = await fetch(`http://127.0.0.1:8000/api/images/${img.id}/`, {
                        method: 'DELETE',
                      });

                      if (res.ok) {
                        const updatedImages = selectedMemory.images.filter(image => image.id !== img.id);
                        setSelectedMemory({ ...selectedMemory, images: updatedImages });
                        toast.success("Image deleted");
                      } else {
                        toast.error("Failed to delete image");
                      }
                    }}
                    style={{
                      backgroundColor: 'transparent',
                      color: '#d00',
                      border: 'none',
                      fontSize: '16px',
                      cursor: 'pointer'
                    }}
                  >
                    ❌
                  </button>

                </div>
              ))}
            </div>
          )}

    <label style={{ color: '#000' }}>Add Image:</label>
    <input
      type="file"
      name="newImage"
      accept="image/*"
    />

    <button type="submit">Save</button>
  </form>
)}


      {selectedMemory && !editing && (
        <div
          style={{
            position: 'fixed',
            bottom: infoExpanded ? '50px' : '20px',
            right: infoExpanded ? '50px' : '30px',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            padding: '24px',
            borderRadius: '16px',
            boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
            width: infoExpanded ? '600px' : '300px',
            height: infoExpanded ? '600px' : '350px',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            color: 'black',
            transition: 'all 0.3s ease-in-out'
          }}
        >
          <div
            onClick={() => setInfoExpanded(prev => !prev)}
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              fontSize: '30px',
              cursor: 'pointer',
              color: '#444',
              zIndex: 100
            }}
            title={infoExpanded ? "Collapse" : "Expand"}
          >
            ⛶
          </div>


          <div>
            <h3 style={{ marginBottom: '8px', color: '#000' }}>{selectedMemory.title}</h3>
            <p><strong style={{ color: '#000' }}>Content:</strong> {selectedMemory.content}</p>

            {selectedMemory.images && selectedMemory.images.length > 0 && (
              <div style={{ 
                marginTop: '12px', 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '8px', 
                maxHeight: infoExpanded ? '400px' : '210px', 
                overflowY: 'auto' 
              }}>
                {selectedMemory.images.map((img, i) => (
                  <img
                    key={i}
                    src={img.image}
                    alt={`Memory ${i + 1}`}
                    style={{
                      width: '100%',
                      height: 'auto',
                      objectFit: 'contain',
                      borderRadius: '8px'
                    }}
                  />
                ))}
              </div>
            )}



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