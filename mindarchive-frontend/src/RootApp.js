// src/RootApp.js
import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './Login';
import Dashboard from './App';

function RequireAuth({ children }) {
  const token = localStorage.getItem('authToken');
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

function RootApp() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <RequireAuth>
            <Dashboard />
          </RequireAuth>
        }
      />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default RootApp;

