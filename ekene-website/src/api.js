import axios from 'axios';

// We hardcode this to ensure NO environmental variables can mess it up
const RENDER_URL = 'https://ekene-backend-shop.onrender.com';

console.log("🚀 API LOADING: Connecting to ->", RENDER_URL);

const API = axios.create({
  baseURL: RENDER_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

export default API;