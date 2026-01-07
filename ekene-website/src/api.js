import axios from 'axios';

const API = axios.create({
  baseURL: 'https://ekene-backend-shop.onrender.com', 
});

export default API;