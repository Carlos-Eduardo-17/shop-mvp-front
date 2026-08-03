import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/auth-context';

// Envuelve rutas que exigen sesión (carrito, órdenes, perfil). El catálogo y
// el detalle de producto quedan fuera de esto a propósito: son de lectura
// pública, solo agregar al carrito requiere estar logueado.
export default function ProtectedRoute() {
  const { status } = useAuth();
  const location = useLocation();

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    // Guardamos a dónde iba el usuario para volver ahí después de loguearse,
    // en vez de mandarlo siempre al punto de entrada por defecto.
    const from = `${location.pathname}${location.search}`;
    return <Navigate to="/login" state={{ from }} replace />;
  }

  return <Outlet />;
}
