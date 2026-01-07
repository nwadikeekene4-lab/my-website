import axios from 'axios';

// 1. Explicitly check if we are in a production environment
const isProduction = import.meta.env.PROD || window.location.hostname !== "localhost";

// 2. Set the URL based on that check
const API_BASE_URL = isProduction 
    ? "https://ekene-backend-shop.onrender.com" 
    : "http://localhost:5000";

const API = axios.create({
    baseURL: API_BASE_URL
});

// Debugging: This will help us see exactly what URL is being used in the F12 console
console.log("Current API URL:", API_BASE_URL);

export default API;