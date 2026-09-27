import axios from 'axios';

export const BASE_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || 'http://localhost:8080';

const config = {
  baseURL: BASE_URL,
  timeout: 15000,
  withCredentials: true,
};

export const publicApi = axios.create(config);
export const api = axios.create(config);