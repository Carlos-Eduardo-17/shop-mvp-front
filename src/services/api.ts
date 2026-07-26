import axios from 'axios';

// El puerto debe coincidir con el del backend Express en desarrollo
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/';

export const api = axios.create({
    baseURL: API_URL,
    withCredentials: true, // Crucial para que el navegador gestione las cookies HttpOnly automáticamente
    headers: { 'Content-Type': 'application/json' }
});