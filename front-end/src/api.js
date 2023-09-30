// api.js
import axios from 'axios';

const baseURL = "http://107.172.21.30:3000/api"; // backend server URL

const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;

