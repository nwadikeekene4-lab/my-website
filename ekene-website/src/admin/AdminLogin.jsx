import React, { useState } from 'react';
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

    try {
      const response = await API.post("/admin/login", {
        username: credentials.username,
        password: credentials.password
      });
      
      if (response.data && response.data.success) {
        localStorage.setItem("isAdminAuthenticated", "true");
        window.location.href = "/admin";
      }
    } catch (err) {
      console.error("Login Error:", err);
      if (err.response) {
        setError(`Error: ${err.response.data.message || "Invalid Admin Credentials"}`);
      } else {
        setError("Network Error: Backend unreachable. Check Console (F12).");
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
          {error && <p className="error-message" style={{ color: 'red' }}>{error}</p>}
          <button type="submit" className="admin-login-button" disabled={isLoading}>
            {isLoading ? "Checking..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}