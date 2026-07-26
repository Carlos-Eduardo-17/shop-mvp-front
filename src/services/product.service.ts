import { api } from './api';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  categoryId: string;
}

export const productService = {
  // Obtener todos los productos
  getAll: async (): Promise<Product[]> => {
    const response = await api.get('/products');
    // Asume que el backend Express devuelve un JSON con la data en response.data
    return response.data; 
  },
  
  // Obtener detalle (usado más adelante)
  getById: async (id: string): Promise<Product> => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  }
};