// src/config.js
const base =
  process.env.REACT_APP_API_BASE ||        // local/dev if you set it
  process.env.REACT_APP_API_BASE_URL ||    // Vercel/production
  'http://localhost:8000';                 // fallback for dev

export const API_BASE = base.replace(/\/+$/, ''); // strip trailing slash
export default API_BASE; // optional default export

