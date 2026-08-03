// src/pages/OrdersPage.tsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { type Order, orderService } from '../services/order.service';

const statusBadgeClass = (status: string) => {
  switch (status) {
    case 'PAID':
      return 'badge-success';
    case 'PENDING':
      return 'badge-warning';
    default:
      return 'badge-neutral';
  }
};

const statusLabel = (status: string) => {
  switch (status) {
    case 'PAID':
      return 'Pagada';
    case 'PENDING':
      return 'Pendiente de pago';
    default:
      return status;
  }
};

export const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await orderService.getAll();
        setOrders(data);
      } catch (err) {
        // El 401 (incluida la sesión no recuperable) ya lo maneja el
        // interceptor de api.ts: renueva sola o redirige a /login. Este
        // catch solo cubre errores reales de carga de órdenes.
        console.error(err);
        setError('No se pudieron cargar tus órdenes.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

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

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-4xl font-bold text-center mb-10 text-base-content">
        Mis Órdenes
      </h1>

      {orders.length === 0 ? (
        <div className="text-center">
          <p className="text-base-content/70 mb-6">Todavía no tienes órdenes registradas.</p>
          <Link to="/catalog" className="btn btn-primary">Ir al catálogo</Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order) => (
            <div key={order.id} className="card bg-base-100 shadow-md">
              <div className="card-body">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h2 className="card-title">Orden #{order.id}</h2>
                  <span className={`badge ${statusBadgeClass(order.status)}`}>
                    {statusLabel(order.status)}
                  </span>
                </div>

                <p className="text-sm text-base-content/70">
                  {new Date(order.createdAt).toLocaleString('es-PE', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </p>
                <p className="text-sm text-base-content/70">
                  Envío a: {order.shippingAddress}
                </p>

                <div className="divider my-2"></div>

                <ul className="text-sm space-y-1">
                  {order.details.map((detail) => (
                    <li key={detail.id} className="flex justify-between">
                      <span>Producto #{detail.productId} × {detail.quantity}</span>
                      <span>S/ {detail.subtotal.toFixed(2)}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex justify-end mt-2">
                  <span className="text-lg font-bold">
                    Total: S/ {order.total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};