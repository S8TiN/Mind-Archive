import React, { useEffect, useState, useRef } from 'react';

function App() {
  const [memories, setMemories] = useState([]);
  const [selectedMemory, setSelectedMemory] = useState(null);
  const [draggingId, setDraggingId] = useState(null);
  const containerRefs = useRef({});
  const sectionIndexRef = useRef(null);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/memories/')
      .then((res) => res.json())
      .then((data) => setMemories(data));
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!draggingId || sectionIndexRef.current === null) return;
      const container = containerRefs.current[sectionIndexRef.current];
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      let y = ((e.clientY - rect.top) / rect.height) * 100;

      y = Math.max(10, y); // prevent dragging into label area

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

  const getMonthYear = (dateStr) => {
    if (!dateStr || typeof dateStr !== 'string') return 'unknown';
    const [month, , year] = dateStr.split('/');
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const monthIndex = parseInt(month, 10) - 1;
    return `${monthNames[monthIndex]} ${year}`;
  };

  const groupedMemories = memories.reduce((acc, memory) => {
    const key = getMonthYear(memory.title); // replace with memory.date if field is renamed
    if (!acc[key]) acc[key] = [];
    acc[key].push(memory);
    return acc;
  }, {});

  const monthKeys = Object.keys(groupedMemories);
  const sectionHeight = 600;

  return (
    <div style={{ background: '#000', overflowY: 'scroll', height: '100vh' }}>
      {monthKeys.map((monthKey, index) => {
        const monthMemories = [...groupedMemories[monthKey]]
          .sort((a, b) => new Date(a.title) - new Date(b.title)); // sort chronologically

        return (
          <div
            key={monthKey}
            ref={(el) => (containerRefs.current[index] = el)}
            style={{
              position: 'relative',
              height: `${sectionHeight}px`,
              borderBottom: '1px solid #444',
            }}
          >
            {/* Month Label */}
            <div
              style={{
                position: 'absolute',
                top: '10px',
                left: '20px',
                backgroundColor: '#000',
                color: '#8fdcff',
                fontSize: '18px',
                fontWeight: 'bold',
                padding: '4px 8px',
                borderRadius: '4px',
                zIndex: 5,
                pointerEvents: 'auto',
                userSelect: 'none', // prevent highlight
              }}
              onMouseDown={(e) => e.stopPropagation()}
            >
              {monthKey}
            </div>

            {/* Constellation Lines */}
            <svg style={{ position: 'absolute', width: '100%', height: '100%', zIndex: 0 }}>
              {monthMemories.map((curr, i) => {
                const prev = monthMemories[i - 1];
                if (!prev) return null;
                return (
                  <line
                    key={`${prev.id}-to-${curr.id}`}
                    x1={`${prev.x}%`}
                    y1={`${prev.y * 0.9}%`}
                    x2={`${curr.x}%`}
                    y2={`${curr.y * 0.9}%`}
                    stroke="#8fdcff"
                    strokeWidth="1"
                  />
                );
              })}
            </svg>

            {/* Stars */}
            {monthMemories.map((memory) => {
              const x = parseFloat(memory.x);
              const y = parseFloat(memory.y) * 0.9;
              if (isNaN(x) || isNaN(y)) return null;

              return (
                <div
                  key={memory.id}
                  title={memory.title}
                  onClick={() => setSelectedMemory(memory)}
                  onMouseDown={() => {
                    setDraggingId(memory.id);
                    sectionIndexRef.current = index;
                  }}
                  style={{
                    position: 'absolute',
                    left: `${x}%`,
                    top: `${y}%`,
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: '#fff',
                    boxShadow: '0 0 8px 2px #8fdcff',
                    cursor: 'grab',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 1,
                  }}
                />
              );
            })}
          </div>
        );
      })}

      {/* Popup Info Card */}
      {selectedMemory && (
        <div
          style={{
            position: 'fixed',
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
