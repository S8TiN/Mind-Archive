// src/RootApp.js
import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './Login';
import Dashboard from './App';
import RegionSelector from './RegionSelector';
import Register from './Register';
import ForgotPassword from './ForgotPassword';
import ResetPassword from './ResetPassword';

function RequireAuth({ children }) {
  const token = localStorage.getItem('authToken');
  const location = useLocation();
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

function RedirectHome() {
  const token = localStorage.getItem('authToken');
  return <Navigate to={token ? '/dashboard' : '/login'} replace />;
}

export default function RootApp() {
  return (
    <Routes>
      {/* Send "/" to dashboard if authed, else login */}
      <Route path="/" element={<RedirectHome />} />

      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:uid/:token" element={<ResetPassword />} />

      {/* Protected routes */}
      <Route
        path="/dashboard"
        element={
          <RequireAuth>
            <Dashboard />
          </RequireAuth>
        }
      />
      <Route
        path="/region"
        element={
          <RequireAuth>
            <RegionSelector />
          </RequireAuth>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}


