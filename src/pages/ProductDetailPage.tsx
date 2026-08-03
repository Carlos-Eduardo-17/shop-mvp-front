// src/pages/ProductDetailPage.tsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { type Product, productService } from '../services/product.service';
import { cartService } from '../services/cart.service';
import { getErrorMessage } from '../lib/http-error';

export const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const [addSuccess, setAddSuccess] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await productService.getById(id);
        setProduct(data);
      } catch (err) {
        console.error(err);
        setError('No se pudo cargar este amigurumi.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;
    setAdding(true);
    setAddError(null);
    setAddSuccess(false);
    try {
      await cartService.addItem(product.id, quantity);
      setAddSuccess(true);
    } catch (err) {
      // El 401 (incluida la sesión no recuperable) ya lo maneja el
      // interceptor de api.ts: renueva sola o redirige a /login. Este catch
      // solo cubre errores reales de validación/negocio al agregar al carrito.
      setAddError(getErrorMessage(err, 'No se pudo agregar el producto al carrito.'));
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="alert alert-error max-w-md mx-auto">
          <span>{error || 'Producto no encontrado.'}</span>
        </div>
        <div className="text-center mt-6">
          <button onClick={() => navigate('/catalog')} className="btn btn-outline">
            Volver al catálogo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-sm breadcrumbs mb-6">
        <ul>
          <li><Link to="/catalog">Catálogo</Link></li>
          <li>{product.name}</li>
        </ul>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        <img
          src={product.imageUrl || 'https://placehold.co/600x600/EEE/31343C?text=Amigurumi'}
          alt={product.name}
          className="rounded-2xl object-cover w-full max-h-[480px] shadow-xl"
        />

        <div>
          <span className="badge badge-outline mb-3">{product.categoryName}</span>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-base-content/70 mb-6">{product.description}</p>

          <div className="flex items-center gap-4 mb-6">
            <span className="text-3xl font-bold text-primary">
              S/ {product.unitPrice.toFixed(2)}
            </span>
            {product.unitsInStock > 0 ? (
              <span className="badge badge-success badge-outline">
                {product.unitsInStock} disponibles
              </span>
            ) : (
              <span className="badge badge-error badge-outline">Sin stock</span>
            )}
          </div>

          {product.unitsInStock > 0 && (
            <div className="flex items-center gap-3 mb-4">
              <span className="font-medium">Cantidad:</span>
              <select
                className="select select-bordered select-sm w-20"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
              >
                {/* Máximo 5 unidades por regla de negocio del carrito, topado también por el stock disponible */}
                {Array.from({ length: Math.min(5, product.unitsInStock) }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
          )}

          <button
            className="btn btn-primary btn-wide"
            disabled={product.unitsInStock === 0 || adding}
            onClick={handleAddToCart}
          >
            {adding && <span className="loading loading-spinner loading-sm"></span>}
            {product.unitsInStock === 0 ? 'Sin stock' : 'Agregar al carrito'}
          </button>

          {addSuccess && (
            <div className="alert alert-success mt-4 py-2">
              <span>Se agregó al carrito.</span>
              <Link to="/cart" className="link link-primary font-medium">Ver carrito</Link>
            </div>
          )}

          {addError && (
            <div className="alert alert-error mt-4 py-2">
              <span>{addError}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
