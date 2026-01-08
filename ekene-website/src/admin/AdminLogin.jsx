import React, { useState } from 'react';
import axios from 'axios'; // Used for type checking/error handling
import API from '../api'; 
import './AdminLogin.css';

export function AdminLogin() {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Using explicit strings to avoid any "admin is not defined" variable errors
    const loginPayload = {
      username: credentials.username,
      password: credentials.password
    };

    try {
      // This uses the baseURL from your api.js (https://ekene-backend-shop.onrender.com)
      const response = await API.post("/admin/login", loginPayload);
      
      if (response.data && response.data.success) {
        localStorage.setItem("isAdminAuthenticated", "true");
        // Redirect to admin dashboard on success
        window.location.href = "/admin";
      }
    } catch (err) {
      console.error("Login Error Details:", err);
      
      // If the server responded with an error (like 401 Unauthorized)
      if (err.response) {
        setError(`Error: ${err.response.data.message || "Invalid Admin Credentials"}`);
      } 
      // If the request was made but no response was received (CORS or Network issue)
      else if (err.request) {
        setError("Network Error: Cannot reach the backend. Please check the console.");
      } 
      else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <h2 className="admin-login-title">Admin Login</h2>
        <form onSubmit={handleLogin} className="admin-login-form">
          <input 
            type="text" 
            name="username" 
            placeholder="Username" 
            value={credentials.username}
            onChange={handleChange} 
            disabled={isLoading}
            required 
            className="admin-input" 
          />
          <input 
            type="password" 
            name="password" 
            placeholder="Password" 
            value={credentials.password}
            onChange={handleChange} 
            disabled={isLoading}
            required 
            className="admin-input" 
          />
          
          {error && (
            <p className="error-message" style={{ color: 'red', fontSize: '0.85rem', marginTop: '10px' }}>
              {error}
            </p>
          )}
          
          <button 
            type="submit" 
            className={`admin-login-button ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? "Authenticating..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}