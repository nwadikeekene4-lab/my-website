import axios from 'axios';

const API = axios.create({
  baseURL: 'https://ekene-backend-shop.onrender.com', 
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// This interceptor will let us know EXACTLY where the browser is trying to go
API.interceptors.request.use((config) => {
  console.log("📡 CALLING BACKEND AT:", config.baseURL + config.url);
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default API;