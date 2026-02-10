

import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
const createAuthAxios = () => {
  const instance = axios.create({
    baseURL: API_URL,
    withCredentials: true,
  });
  instance.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  
    return instance;
  };

  export const api  = createAuthAxios();