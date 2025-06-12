import React, { useEffect, useState } from 'react';

function App() {
  const [memories, setMemories] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/memories/')
      .then((res) => res.json())
      .then((data) => {
        console.log('Fetched memories:', data);
        setMemories(data);
      });
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>🧠 Mind Archive</h1>
      <ul>
        {memories.map((memory) => (
          <li key={memory.id}>
            <strong>{memory.title}</strong> (x: {memory.x}, y: {memory.y})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
