import axios from 'axios';

const api = axios.create({
  baseURL: '/api', // will resolve to http://localhost:8080/api via Nginx
  withCredentials: true,              // send/receive cookies
});

export default api;
