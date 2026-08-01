import { api } from './api';

export interface Product {
  id: number;
  name: string;
  description: string;
  unitPrice: number;
  unitsInStock: number;
  imageUrl: string;
  categoryId: number;
  categoryName: string;
}

export const productService = {
  // Obtener todos los productos, opcionalmente filtrados por categoría
  getAll: async (categoryId?: number): Promise<Product[]> => {
    const response = await api.get('/products', {
      params: categoryId ? { categoryId } : undefined,
    });
    // El backend envuelve las respuestas en { data: ... }, igual que /users/me.
    // Se deja un fallback defensivo por si el shape cambia en algún endpoint.
    const payload = response.data?.data ?? response.data;
    return Array.isArray(payload) ? payload : [];
  },

  // Obtener detalle (usado más adelante)
  getById: async (id: string): Promise<Product> => {
    const response = await api.get(`/products/${id}`);
    return response.data?.data ?? response.data;
  }
};