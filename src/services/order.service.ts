import { api } from './api';

export interface OrderDetail {
  id: number;
  productId: number;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export type OrderStatus = 'PENDING' | 'PAID' | string;

export interface Order {
  id: number;
  status: OrderStatus;
  total: number;
  shippingAddress: string;
  createdAt: string;
  details: OrderDetail[];
}

export const orderService = {
  // Convierte el carrito activo en una orden PENDING (checkout)
  create: async (shippingAddress: string): Promise<Order> => {
    const response = await api.post('/orders', { shippingAddress });
    return response.data?.data ?? response.data;
  },

  // Lista las órdenes del usuario autenticado, de la más reciente a la más antigua
  getAll: async (): Promise<Order[]> => {
    const response = await api.get('/orders');
    const payload = response.data?.data ?? response.data;
    return Array.isArray(payload) ? payload : [];
  },
};
