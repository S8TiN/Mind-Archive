// src/RootApp.js
import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './Login';
import Dashboard from './App';
import RegionSelector from './RegionSelector';
import Register from './Register';
import ForgotPassword from './ForgotPassword';
import ResetPassword from './ResetPassword';
console.log("ResetPassword component is:", ResetPassword);

console.log("Register component is:", Register);

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
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:uid/:token" element={<ResetPassword />} />
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
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default RootApp;

