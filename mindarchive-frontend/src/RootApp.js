import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import App from './App'; // ✅ use App, not Dashboard

function RootApp() {
  const token = localStorage.getItem('authToken');
  console.log("RootApp loaded");

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={token ? <App /> : <Navigate to="/login" />}
        />
        <Route
          path="*"
          element={<Navigate to={token ? '/dashboard' : '/login'} />}
        />
      </Routes>
    </Router>
  );
}

export default RootApp;
