import axios from 'axios';

// This logic automatically picks the right URL
const API_BASE_URL = window.location.hostname === "localhost" 
    ? "http://localhost:5000"  // Change to your local port if different
    : "https://ekene-backend-shop.onrender.com";

const API = axios.create({
    baseURL: API_BASE_URL
});

export default API;