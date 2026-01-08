import axios from 'axios';

const API = axios.create({
  // Ensure there is NO slash at the end
  baseURL: 'https://ekene-backend-shop.onrender.com' 
});

// This helps us see in the console if the URL is correct every time a request is made
API.interceptors.request.use((config) => {
  console.log("Global API Call to:", config.baseURL + config.url);
  return config;
});

export default API;