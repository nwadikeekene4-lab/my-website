import axios from 'axios';
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

    // We define these as strings here so the computer cannot say "admin is not defined"
    const loginPayload = {
      username: credentials.username,
      password: credentials.password
    };

    try {
      // Direct call to Render to bypass any api.js issues
      const response = await API.post("/admin/login", loginPayload);
      
      if (response.data && response.data.success) {
        localStorage.setItem("isAdminAuthenticated", "true");
        window.location.href = "/admin";
      }
    } catch (err) {
      console.error("Login Error:", err);
      // This helps us see if the error is CORS or Wrong Password
      if (err.response) {
        setError(`Error: ${err.response.data.message || "Invalid Credentials"}`);
      } else {
        setError("Network Error: Could not reach the server.");
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
          
          {error && <p className="error-message" style={{color: 'red', fontSize: '0.9rem'}}>{error}</p>}
          
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