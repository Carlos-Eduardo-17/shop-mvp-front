## Inicialización del proyecto y configuración de dependencias
1. Inicializar un proyecto con Vite, React y TS

        pnpm create vite@latest shop-mvp-front
- Seleccionar: framework → React, variant → TS, linter → ESLint, Instal with pnpm → Yes.
- Se crean automáticamente:
	- node_modules/ (con muchos directorios y archivos adentro)
	- public/favicon.svg
	- public/icons.svg
	- src/assets/hero.png
	- src/assets/react.svg
	- src/assets/vite.svg
	- src/App.css
	- src/App.tsx
	- src/index.css
	- src/main.tsx
	- .gitignore
	- eslint.config.js
	- index.html
	- package.json
	- pnpm-lock.yaml
	- README.md
	- tsconfig.app.json
	- tsconfig.json
	- tsconfig.node.json
	- vite.config.ts
2. Ingresar a la carpeta e instalar las dependencias base de React

		cd shop-mvp-front
		pnpm install
3. Instalar stack para enrutamiento (react-router-dom) y peticiones (axios)

		pnpm add react-router-dom axios
4. Instalar TailwindCSS v4 y DaisyUI como dependencias de desarrollo

		pnpm add -D tailwindcss @tailwindcss/vite daisyui
5. Configurar Vite
- Ir a vite.config.ts y agregar el plugin de tailwindcss:

		export default defineConfig({
			plugins: [
				react(),
				tailwindcss(),	→ Agregar
			],
		})
6. Configurar estilos globales
- Vaciar todo el contenido de src/index.css y src/App.css y agregarle como contenido a cada uno:

		@import 'tailwindcss';
		@plugin 'daisyui';
- Vaciar todo el contenido de src/App.tsx y agregarle como contenido:

		export default function App() {
			return (
				<div className="flex h-screen items-center justify-center bg-base-200">
				<h1 className="text-3xl font-bold text-primary">¡Frontend inicializado! 🚀</h1>
				</div>
			)
		}s
7. Comprobar que todo funcione bien (ver un fondo gris oscuro/claro y el texto con el color primario de DaisyUI (morado)) ejecutando el servidor

		pnpm dev

## Configuración de peticiones HTTP y navegación de rutas
Configurar Axios para que envíe y reciba automáticamente tokens mediante cookies HttpOnly en cada petición, además de apuntar a la API.
1. Crear una carpeta llamada `services` dentro de src/.
2. Crear un archivo llamado api.ts dentro de src/services/ y agregar el siguiente código:

		import axios from 'axios';

		// El puerto debe coincidir con el del backend Express en desarrollo
		const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/'; 
		
		export const api = axios.create({
			baseURL: API_URL,
			withCredentials: true, // Crucial para que el navegador gestione las cookies HttpOnly automáticamente
		});
## Creación de vistas base
Se creará la estructura base de las páginas para que el enrutador funcione correctamente.
1. Crear una carpeta llamada `pages` dentro de src/.
2. Crear LoginPage.tsx, ProfilePage.tsx y RegisterPage.tsx dentro de src/pages/. Véase: [LoginPage](./shop-mvp-front/src/pages/LoginPage.tsx), [ProfilePage](./shop-mvp-front/src/pages/ProfilePage.tsx), [RegisterPage](./shop-mvp-front/src/pages/RegisterPage.tsx).

## Configuración de Enrutador Principal
Se unirán las vistas base antes creadas.
1. Vaciar todo el contenido de src/App.tsx y agregarle como contenido:

		import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
		import LoginPage from './pages/LoginPage';
		import RegisterPage from './pages/RegisterPage';
		import ProfilePage from './pages/ProfilePage';

		export default function App() {
			return (
				<BrowserRouter>
				<Routes>
					<Route path="/login" element={<LoginPage />} />
					<Route path="/register" element={<RegisterPage />} />
					<Route path="/profile" element={<ProfilePage />} />
					
					{/* Redirección por defecto si la ruta no existe */}
					<Route path="*" element={<Navigate to="/login" replace />} />
				</Routes>
				</BrowserRouter>
			);
		}

## Construcción de Formularios y Conexión Real a Backend
Se creará un archivo para gestionar las peticiones de autenticación ordenadamente.
1. Crear el archivo auth.services.ts en src/services/ y agregar contenido. Véase: [auth.service.ts](./src/services/auth.service.ts).
2. Implementar la vista de Login usando las clases de Daysi para crear un formulario efectivo. Reemplazar el contenido de src/pages/LoginPage.tsx, src/pages/ProfilePage.tsx y src/pages/RegisterPage.tsx. Véase: [LoginPage](./shop-mvp-front/src/pages/LoginPage.tsx), [ProfilePage](./shop-mvp-front/src/pages/ProfilePage.tsx), [RegisterPage](./shop-mvp-front/src/pages/RegisterPage.tsx)
3. Asegurarse de tener en el backend, en server.ts:

		import cors from 'cors';

		app.use(cors({
			origin: 'http://localhost:5173', // La URL exacta del frontend en Vite
			credentials: true // Vital para aceptar las cookies HttpOnly
		}));

## Configuración de Instancia Base de Axios
1. En src/services/api.ts, en axios.create, agregar: `headers: { 'Content-Type': 'application/json' }`
2. Crear el servicio del catálogo
- En este proyecto, los endpoints del catálogo son de solo lectura.
- Crear src/services/product.service.ts y agregar contenido. Véase [product.service.ts](src/services/product.service.ts).
3. Crear la vista principal del catálogo
- Crear [src/pages/Catalog.tsx](src/pages/Catalog.tsx) y agregar contenido.

## Corrección de bugs y conexión del Catálogo al Router
Al probar el flujo completo con el backend real aparecieron varios problemas. Se documentan aquí para referencia futura.

1. **Bug: endpoints de autenticación incorrectos.** `auth.service.ts` apuntaba a `/users/login`, `/users/register` y `/users/logout`, pero el backend expone `/auth/login`, `/auth/register` y `/auth/logout` (verificado contra la colección de Postman del backend). Se corrigieron las tres rutas y se agregó el método `refresh` (`POST /auth/refresh`), pendiente de conectar a la UI. Véase: [auth.service.ts](./src/services/auth.service.ts).

2. **Conexión del Catálogo al enrutador.** `Catalog.tsx` y `product.service.ts` ya existían pero no estaban enlazados a ninguna ruta.
	- Se creó `src/components/Navbar.tsx` con links a Catálogo y Perfil.
	- Se creó `src/components/Layout.tsx`, que envuelve las rutas navegables con el Navbar usando `<Outlet />` de react-router-dom.
	- Se actualizó `App.tsx`: `/login` y `/register` quedan sin navbar; `/catalog` y `/profile` quedan anidadas dentro de `<Layout>`; la ruta comodín (`*`) ahora redirige a `/catalog` en vez de `/login`.

		import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
		import LoginPage from './pages/LoginPage';
		import RegisterPage from './pages/RegisterPage';
		import ProfilePage from './pages/ProfilePage';
		import { Catalog } from './pages/Catalog';
		import Layout from './components/Layout';

		export default function App() {
			return (
				<BrowserRouter>
				<Routes>
					<Route path="/login" element={<LoginPage />} />
					<Route path="/register" element={<RegisterPage />} />

					<Route element={<Layout />}>
					<Route path="/catalog" element={<Catalog />} />
					<Route path="/profile" element={<ProfilePage />} />
					</Route>

					<Route path="*" element={<Navigate to="/catalog" replace />} />
				</Routes>
				</BrowserRouter>
			);
		}

3. **Bug: `products.map is not a function`.** El backend envuelve las respuestas en un objeto `{ message, data }` (igual que `/users/me`, ya evidenciado en `ProfilePage.tsx`), pero `product.service.ts` devolvía la respuesta completa de axios en lugar de solo el arreglo. Se corrigió para desenvolver `response.data.data`, con un fallback defensivo (`Array.isArray`) por si algún endpoint cambia de forma. Véase: [product.service.ts](./src/services/product.service.ts).

4. **Bug: `Cannot read properties of undefined (reading 'toFixed')`.** La interfaz `Product` asumía campos `price` y `stock` en inglés simple, pero el backend real devuelve `unitPrice`, `unitsInStock` y además incluye `categoryName`. Se confirmó el shape real inspeccionando la respuesta de `GET /products` en la pestaña Network:

		{
			"message": "Productos",
			"data": [
				{
					"id": 1,
					"name": "Osito Dormilón",
					"description": "...",
					"unitPrice": 45,
					"unitsInStock": 5,
					"imageUrl": "...",
					"categoryId": 1,
					"categoryName": "Amigurumis"
				}
			]
		}

	Se actualizó la interfaz `Product` (`id` y `categoryId` como `number`, `unitPrice`, `unitsInStock`, `categoryName`) y se ajustó `Catalog.tsx` para usar los nombres reales de campo. De paso, se aprovechó `unitsInStock` para deshabilitar el botón y mostrar "Sin stock" cuando corresponde, y `categoryName` para un badge de categoría en cada card. Véase: [Catalog.tsx](./src/pages/Catalog.tsx).

**Estado tras esta sesión:** login, registro, logout y catálogo funcionando de punta a punta contra el backend real. Pendiente: detalle de producto (`/products/:id`), filtro/listado de categorías, carrito y flujo de órdenes.
