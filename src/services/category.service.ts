import { api } from './api';

export interface Category {
  id: number;
  name: string;
}

export const categoryService = {
  // Obtener todas las categorías (usado para el filtro del catálogo)
  getAll: async (): Promise<Category[]> => {
    const response = await api.get('/categories');
    // Mismo shape { message, data } que el resto de endpoints del backend.
    const payload = response.data?.data ?? response.data;
    return Array.isArray(payload) ? payload : [];
  },
};
