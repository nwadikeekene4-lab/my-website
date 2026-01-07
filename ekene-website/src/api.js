import axios from 'axios';

const API = axios.create({
  // This MUST be your Render URL, NO localhost here!
  baseURL: 'https://ekene-backend-shop.onrender.com', 
});

export default API;