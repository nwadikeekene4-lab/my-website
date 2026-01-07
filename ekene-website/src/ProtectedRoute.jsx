import React from 'react';
import { Navigate } from 'react-router-dom';

export function ProtectedRoute({ children }) {
  const isAuthenticated = localStorage.getItem("isAdminAuthenticated");

  if (isAuthenticated !== "true") {
    // Changed this to /admin/login to match your App.jsx routes
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}