import React, { useState } from 'react';
import API from '../api'; // Replaced standard axios with your custom API instance
import './AdminLogin.css';

export function AdminLogin() {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false); // New Loading State

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Start loading
    setError(""); // Clear previous errors

    try {
      // Changed from axios.post("http://localhost:5000/admin/login"...) 
      // to API.post("/admin/login"...)
      const response = await API.post("/admin/login", credentials);
      if (response.data.success) {
        localStorage.setItem("isAdminAuthenticated", "true");
        window.location.href = "/admin";
      }
    } catch (err) {
      setError("Incorrect Username or Password");
      setIsLoading(false); // Stop loading if it fails
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
            onChange={handleChange} 
            disabled={isLoading}
            required 
            className="admin-input" 
          />
          <input 
            type="password" 
            name="password" 
            placeholder="Password" 
            onChange={handleChange} 
            disabled={isLoading}
            required 
            className="admin-input" 
          />
          
          {error && <p className="error-message">{error}</p>}
          
          <button 
            type="submit" 
            className={`admin-login-button ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? <div className="spinner"></div> : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}