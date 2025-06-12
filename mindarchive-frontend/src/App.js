import React, { useEffect, useState } from 'react';

function App() {
  const [memories, setMemories] = useState([]);
  const [selectedMemory, setSelectedMemory] = useState(null);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/memories/')
      .then((res) => res.json())
      .then((data) => {
        console.log('Fetched memories:', data);  // ✅ Log entire list
        setMemories(data);
      });
  }, []);

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        background: '#000',
        overflow: 'hidden',
      }}
    >
      {memories.map((memory) => {
        console.log('Rendering memory:', memory);  // ✅ Log each one
        return (
          <div
            key={memory.id}
            title={memory.title}
            onClick={() => setSelectedMemory(memory)}
            style={{
              position: 'absolute',
              left: `${memory.x}%`,
              top: `${memory.y}%`,
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: '#fff',
              boxShadow: '0 0 8px 2px #8fdcff',
              cursor: 'pointer',
              transform: 'translate(-50%, -50%)',
            }}
          />
        );
      })}
      {selectedMemory && (
  <div
    style={{
      position: 'absolute',
      top: '20px',
      left: '20px',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      padding: '16px',
      borderRadius: '8px',
      boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
      maxWidth: '300px',
      zIndex: 10,
    }}
  >
    <h3>{selectedMemory.title}</h3>
    <p><strong>Content:</strong> {selectedMemory.content}</p>
    <button onClick={() => setSelectedMemory(null)}>Close</button>
  </div>
)}

    </div>
  );
}

export default App;
