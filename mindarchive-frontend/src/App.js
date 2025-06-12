import React, { useEffect, useState } from 'react';

function App() {
  const [memories, setMemories] = useState([]);

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
    </div>
  );
}

export default App;
