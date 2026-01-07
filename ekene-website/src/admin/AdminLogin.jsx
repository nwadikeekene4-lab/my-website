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
      // Sending request to your Render backend via api.js
      const response = await API.post("/admin/login", credentials);
      
      if (response.data.success) {
        localStorage.setItem("isAdminAuthenticated", "true");
        window.location.href = "/admin";
      }
    } catch (err) {
      console.error("Login Error:", err);
      
      // If there's no response, it's a network/URL error (like the localhost issue)
      if (!err.response) {
        setError("Network Error: Site is still looking for 'localhost' instead of Render.");
      } else {
        setError("Incorrect Username or Password");
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
          
          {error && <p className="error-message" style={{color: 'red'}}>{error}</p>}
          
          <button 
            type="submit" 
            className={`admin-login-button ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? "Checking..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}