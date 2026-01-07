import axios from 'axios';

// This checks if the site is live or on your computer
const isProduction = window.location.hostname !== "localhost";

const API_BASE_URL = isProduction 
    ? "https://ekene-backend-shop.onrender.com"  // PASTE YOUR RENDER LINK HERE
    : "http://localhost:5000";

const API = axios.create({
    baseURL: API_BASE_URL
});

export default API;