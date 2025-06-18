import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000',  // your FastAPI backend
  withCredentials: true,              // send/receive cookies
});

export default api;
