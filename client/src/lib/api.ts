import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add operator key from localStorage if available
api.interceptors.request.use((config) => {
  const operatorKey = localStorage.getItem('operatorKey');
  if (operatorKey) {
    config.headers['x-operator-key'] = operatorKey;
  }
  return config;
});

export default api;
