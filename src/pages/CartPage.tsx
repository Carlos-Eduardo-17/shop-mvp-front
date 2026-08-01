// src/pages/CartPage.tsx
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { type Cart, cartService } from '../services/cart.service';
import { orderService } from '../services/order.service';

export const CartPage = () => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<number | null>(null);

  const [shippingAddress, setShippingAddress] = useState('');
  const [checkingOut, setCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const navigate = useNavigate();

  const fetchCart = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await cartService.getCart();
      setCart(data);
    } catch (err: any) {
      if (err?.response?.status === 401) {
        navigate('/login');
        return;
      }
      console.error(err);
      setError('No se pudo cargar el carrito.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRemove = async (cartItemId: number) => {
    setRemovingId(cartItemId);
    try {
      await cartService.removeItem(cartItemId);
      // Se recarga el carrito para tener el total actualizado desde el backend
      await fetchCart();
    } catch (err) {
      console.error(err);
      setError('No se pudo eliminar el producto del carrito.');
    } finally {
      setRemovingId(null);
    }
  };

  const handleCheckout = async () => {
    setCheckoutError(null);

    const trimmed = shippingAddress.trim();
    if (trimmed.length < 8 || trimmed.length > 128) {
      setCheckoutError('La dirección de envío debe tener entre 8 y 128 caracteres.');
      return;
    }

    setCheckingOut(true);
    try {
      await orderService.create(trimmed);
      // La orden se creó y el carrito quedó vacío en el backend; se navega al historial
      navigate('/orders');
    } catch (err: any) {
      if (err?.response?.status === 401) {
        navigate('/login');
        return;
      }
      const message = err?.response?.data?.message || 'No se pudo generar la orden.';
      setCheckoutError(message);
    } finally {
      setCheckingOut(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="alert alert-error max-w-md mx-auto">
          <span>{error}</span>
        </div>
      </div>
    );
  }

  const items = cart?.items ?? [];

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-4xl font-bold text-center mb-10 text-base-content">
        Mi Carrito
      </h1>

      {items.length === 0 ? (
        <div className="text-center">
          <p className="text-base-content/70 mb-6">Tu carrito está vacío todavía.</p>
          <Link to="/catalog" className="btn btn-primary">Ir al catálogo</Link>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-4 mb-8">
            {items.map((item) => (
              <div key={item.id} className="card card-side bg-base-100 shadow-md">
                <figure className="w-28 h-28 shrink-0 p-3">
                  <img
                    src={item.product.imageUrl || 'https://placehold.co/200x200/EEE/31343C?text=Amigurumi'}
                    alt={item.product.name}
                    className="rounded-xl object-cover w-full h-full"
                  />
                </figure>
                <div className="card-body py-4">
                  <h2 className="card-title text-base">{item.product.name}</h2>
                  <p className="text-sm text-base-content/70">
                    Cantidad: {item.quantity} × S/ {item.product.unitPrice.toFixed(2)}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-bold">S/ {item.subtotal.toFixed(2)}</span>
                    <button
                      className="btn btn-outline btn-error btn-sm"
                      disabled={removingId === item.id}
                      onClick={() => handleRemove(item.id)}
                    >
                      {removingId === item.id ? (
                        <span className="loading loading-spinner loading-xs"></span>
                      ) : (
                        'Eliminar'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="card bg-base-100 shadow-md">
            <div className="card-body flex-row items-center justify-between">
              <span className="text-xl font-bold">Total</span>
              <span className="text-2xl font-bold text-primary">S/ {cart!.total.toFixed(2)}</span>
            </div>
          </div>

          <div className="card bg-base-100 shadow-md mt-6">
            <div className="card-body">
              <label className="label" htmlFor="shippingAddress">
                <span className="label-text font-medium">Dirección de envío</span>
              </label>
              <input
                id="shippingAddress"
                type="text"
                placeholder="Ej: Av. Siempre Viva 742, Lima"
                className="input input-bordered w-full"
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                maxLength={128}
              />

              {checkoutError && (
                <div className="alert alert-error mt-4 py-2">
                  <span>{checkoutError}</span>
                </div>
              )}

              <button
                className="btn btn-primary btn-wide mt-4 self-center"
                disabled={checkingOut}
                onClick={handleCheckout}
              >
                {checkingOut && <span className="loading loading-spinner loading-sm"></span>}
                Proceder al pago
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
