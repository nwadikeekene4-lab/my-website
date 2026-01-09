import axios from 'axios';

// Create the axios instance for the entire app
const API = axios.create({
  // This is your LIVE backend URL on Render
  baseURL: 'https://ekene-backend-shop.onrender.com', 
  
  // IMPORTANT: withCredentials allows the browser to handle 
  // the "Handshake" for protected admin routes correctly.
  withCredentials: true,
  
  headers: {
    'Content-Type': 'application/json'
  }
});

// DEBUGGER: This will print the EXACT URL being called in your browser console.
// If you see "localhost" here after pushing, your Vercel build did not update.
API.interceptors.request.use((config) => {
  console.log("🚀 API CALLING:", config.baseURL + config.url);
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default API;