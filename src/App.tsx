import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import { Catalog } from './pages/Catalog';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { OrdersPage } from './pages/OrdersPage';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Rutas con navbar */}
          <Route element={<Layout />}>
            {/* Catálogo y detalle de producto son de lectura pública */}
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />

            {/* Estas sí exigen sesión */}
            <Route element={<ProtectedRoute />}>
              <Route path="/cart" element={<CartPage />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>
          </Route>

          {/* Redirección por defecto si la ruta no existe */}
          <Route path="*" element={<Navigate to="/catalog" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}