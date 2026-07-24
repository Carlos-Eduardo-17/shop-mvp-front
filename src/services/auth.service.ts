import { api } from './api';

export const authService = {
    login: async (credentials: { email: string; password: string }) => {
        const response = await api.post('/users/login', credentials);
        return response.data;
    },

    register: async (userData: { email: string; password: string; firstName?: string; lastName?: string }) => {
        const response = await api.post('/users/register', userData);
        return response.data;
    },

    logout: async () => {
        const response = await api.post('/users/logout');
        return response.data;
    },

    getProfile: async () => {
        // Este endpoint debe requerir estar autenticado en el backend
        const response = await api.get('/users/me');
        return response.data;
    }
};