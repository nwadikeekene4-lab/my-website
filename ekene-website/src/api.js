import axios from 'axios';

// We are hardcoding this to FORCE the connection to Render
const API = axios.create({
    baseURL: "https://ekene-backend-shop.onrender.com",
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

// This log will help us see it working in the Chrome Console
console.log("🚀 API instance initialized pointing to: https://ekene-backend-shop.onrender.com");

export default API;