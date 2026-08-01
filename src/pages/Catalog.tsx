// src/pages/Catalog.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { type Product, productService } from '../services/product.service';
import { type Category, categoryService } from '../services/category.service';

export const Catalog = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Las categorías se cargan una sola vez, no dependen del filtro
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getAll();
        setCategories(data);
      } catch (err) {
        // Si falla, simplemente no se muestra el filtro; no bloquea el catálogo
        console.error('No se pudieron cargar las categorías', err);
      }
    };

    fetchCategories();
  }, []);

  // Los productos se recargan cada vez que cambia la categoría seleccionada
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await productService.getAll(selectedCategoryId);
        setProducts(data);
      } catch (err) {
        console.error(err);
        setError('Hubo un error al cargar los amigurumis.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategoryId]);

  // Estado de carga con DaisyUI
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  // Manejo de errores simple
  if (error) {
    return (
      <div className="toast toast-top toast-center mt-10">
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-6 text-base-content">
        Catálogo de Amigurumis
      </h1>

      {categories.length > 0 && (
        <div className="flex justify-center mb-10">
          <select
            className="select select-bordered w-full max-w-xs"
            value={selectedCategoryId ?? ''}
            onChange={(e) =>
              setSelectedCategoryId(e.target.value ? Number(e.target.value) : undefined)
            }
          >
            <option value="">Todas las categorías</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {products.length === 0 ? (
        <p className="text-center text-base-content/70">
          No hay amigurumis en esta categoría todavía.
        </p>
      ) : (
      /* Grid responsivo: 1 col en móvil, 2 en tablet, 4 en desktop */
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product.id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
            <figure className="px-4 pt-4">
              <img 
                src={product.imageUrl || 'https://placehold.co/400x400/EEE/31343C?text=Amigurumi'} 
                alt={product.name} 
                className="rounded-xl object-cover h-48 w-full"
              />
            </figure>
            <div className="card-body items-center text-center">
              <span className="badge badge-outline badge-sm">{product.categoryName}</span>
              <h2 className="card-title">{product.name}</h2>
              <p className="text-sm text-base-content/70 line-clamp-2">
                {product.description}
              </p>
              <div className="card-actions w-full flex justify-between items-center mt-4">
                <span className="text-xl font-bold">S/ {product.unitPrice.toFixed(2)}</span>
                <button
                  className="btn btn-primary btn-sm"
                  disabled={product.unitsInStock === 0}
                  onClick={() => navigate(`/products/${product.id}`)}
                >
                  {product.unitsInStock === 0 ? 'Sin stock' : 'Ver detalle'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      )}
    </div>
  );
};