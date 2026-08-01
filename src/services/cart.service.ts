import { api } from './api';

export interface CartItem {
  id: number;
  quantity: number;
  productId: number;
  product: {
    id: number;
    name: string;
    unitPrice: number;
    imageUrl: string;
  };
  subtotal: number;
}

export interface Cart {
  id: number;
  userId: string;
  items: CartItem[];
  total: number;
}

export const cartService = {
  // Agrega un producto al carrito, o actualiza su cantidad si ya existe
  addItem: async (productId: number, quantity: number): Promise<void> => {
    await api.post('/cart/items', { productId, quantity });
  },

  // Obtiene el carrito activo del usuario, con items y total
  getCart: async (): Promise<Cart> => {
    const response = await api.get('/cart');
    return response.data?.data ?? response.data;
  },

  // Elimina un item puntual del carrito.
  // Nota: el backend real lo espera como query param (?cartItemId=), no en el body,
  // a diferencia de lo documentado en endpoints.md.
  removeItem: async (cartItemId: number): Promise<void> => {
    await api.delete('/cart/item', { params: { cartItemId } });
  },
};
