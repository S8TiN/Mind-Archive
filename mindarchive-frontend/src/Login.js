// src/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const response = await fetch('http://127.0.0.1:8000/api/login/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: email, password }),
    });

    const data = await response.json();
    console.log("Login response:", data);

    if (response.ok && data.key) {
      localStorage.setItem('authToken', data.key);
      navigate('/dashboard');
    } else {
      alert('Login failed: ' + (data?.non_field_errors || 'Unknown error'));
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Mind Archive 🌌</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        /><br /><br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        /><br /><br />
        <button type="submit">Log In</button>
      </form>
    </div>
  );
}

export default Login;
