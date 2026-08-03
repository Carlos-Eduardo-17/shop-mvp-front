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

## Detalle de producto y filtro por categorías
Se agregó `ProductDetailPage.tsx` (ruta `/products/:id`, conectada al botón "Ver detalle" del catálogo) y el filtro por categorías en `Catalog.tsx` (`category.service.ts` nuevo + `productService.getAll` ahora acepta `categoryId` opcional). Ambos funcionando de punta a punta.

## Carrito: bug de rutas — la documentación (`endpoints.md`) del backend no coincide con el código real
Al conectar `cart.service.ts` contra `POST /api/carts/cart/items`, `GET /api/carts/cart` y `DELETE /api/carts/cart/items` (tal como indica `docs/endpoints.md`), todas las peticiones fallaban — con el mismo mensaje de error genérico estando logueado o no, señal de que ni siquiera se estaba resolviendo la ruta.

Revisando `server.ts` y `cart.route.ts` directamente, el router de carrito está montado en **`/api/cart`** (singular, no `/api/carts`), y dentro del router:
- `POST /items` → ruta real: `POST /api/cart/items`
- `GET /` → ruta real: `GET /api/cart`
- `DELETE /item` → ruta real: `DELETE /api/cart/item`, y además **espera `cartItemId` como query param** (`req.query["cartItemId"]` en el controller), no en el body como dice la documentación.

Se corrigió `cart.service.ts` para usar las rutas y el formato reales. **Lección para el siguiente bloque (órdenes):** verificar `order.route.ts` y `server.ts` directamente antes de confiar en `docs/endpoints.md`, ya que quedó desactualizada al menos para el módulo de carrito.

**Estado del carrito:** agregar producto (con selector de cantidad, tope de 5), ver carrito con detalle y total, y eliminar ítems — funcionando contra las rutas reales. Pendiente: flujo de órdenes (checkout).

## Flujo de órdenes (checkout)
Antes de escribir `order.service.ts`, se revisó `order.route.ts` y `server.ts` directamente (lección de la sesión anterior). A diferencia del carrito, aquí `docs/endpoints.md` sí coincide con el código real: `POST /api/orders` y `GET /api/orders`, body `{ shippingAddress }` (8-128 caracteres), mismo shape de respuesta documentado.

Se creó `order.service.ts` (`create`, `getAll`). En `CartPage.tsx` se reemplazó el botón placeholder por un formulario con input de dirección de envío (validado en el cliente antes de llamar al backend) y el botón real de checkout; al confirmar, se crea la orden y se navega a `/orders`. Se creó `OrdersPage.tsx` (ruta `/orders`, link "Mis Órdenes" en el navbar) con el historial de órdenes, badge de estado (Pendiente de pago / Pagada) y detalle de cada línea.

Nota: el detalle de cada orden que devuelve el backend solo trae `productId` (no el nombre del producto), así que por ahora se muestra como "Producto #id"; se podría enriquecer más adelante si el backend empieza a incluir el nombre.

**Estado tras esta sesión:** con esto, el frontend cubre todo el flujo de punta a punta: login, registro, logout, catálogo, filtro por categoría, detalle de producto, carrito y órdenes.

## Sesión de refreshToken automático (interceptor de axios en `api.ts`)
Todo el flujo de auth ya funcionaba de punta a punta, salvo por una pieza suelta: `auth.service.ts` tenía un método `refresh()` que llamaba a `POST /auth/refresh`, pero nada en el frontend lo invocaba. Como el `accessToken` dura 15 minutos, cualquier sesión de uso normal terminaba en un 401 sin recuperación automática. Se revisó primero el backend real (no la documentación) para confirmar el contrato: `accessToken` (15 min) y `refreshToken` (7 días) viajan como cookies HttpOnly, `POST /auth/refresh` los rota a ambos, y `requireAuth.middleware.ts` responde 401 tanto si el `accessToken` falta como si expiró o es inválido.

Se implementó todo en un interceptor de respuesta de axios en `api.ts` (no se creó `AuthContext` ni rutas protegidas — no era el objetivo de esta sesión), en tres partes:

1. **Renovación transparente.** Ante un 401, el interceptor llama a `POST /auth/refresh` y reintenta la petición original una sola vez (flag `_retry` en el config de axios, para no reintentar en loop). Se excluyó explícitamente `/auth/login` de este mecanismo: revisando `user.service.ts` se confirmó que el login con credenciales incorrectas *también* responde 401, así que sin esta exclusión un simple error de contraseña hubiera disparado un intento de refresh innecesario y tapado el mensaje real de error.
2. **Sesión no recuperable → `/login`.** Si el propio `/auth/refresh` responde 401 (el refreshToken de 7 días ya venció o fue revocado) o si la petición ya reintentada vuelve a fallar, se redirige a `/login` con `window.location.href` (no `useNavigate`, porque el interceptor vive fuera del árbol de componentes de React). Se valida `pathname !== '/login'` antes de redirigir, para no generar un loop.
3. **Refreshes concurrentes.** Revisando `userService.refreshSession` se confirmó que el `refreshToken` es de un solo uso (se rota en cada llamada, vía `updateRefreshToken`). Esto significa que si dos peticiones protegidas expiran casi al mismo tiempo y cada una dispara su propio refresh por separado, la segunda llega con el token ya invalidado por la primera y recibe 401 injustamente — lo que antes de este arreglo hubiera mandado a `/login` a un usuario con la sesión en realidad sana. Se resolvió compartiendo una única promesa (`refreshInFlight`) entre todos los 401 concurrentes, en vez de que cada uno dispare su propia llamada.

Ningún endpoint protegido actual del frontend dispara dos llamadas en paralelo (Catalog usa solo endpoints públicos; Cart hace una única llamada al montar), así que el punto 3 no se pudo probar todavía contra una carrera real — queda como protección defensiva para cuando el front crezca. Los puntos 1 y 2 sí se probaron a mano: login, espera de 6 minutos (accessToken vencido a los 15 min) y una petición protegida (agregar producto al carrito) se renovó sola sin que el usuario notara nada.

**Pendiente, deliberadamente pospuesto para otra sesión:**
- El backend no hace `clearCookie` cuando el refresh falla (revisado en `user.controller.ts`); la cookie del refreshToken inválido queda en el navegador hasta que expira sola a los 7 días. No es un problema de seguridad (sigue siendo HttpOnly e inútil), solo una llamada de más antes de fallar de nuevo.
- `CartPage.tsx` tiene un chequeo manual `if (err?.response?.status === 401) navigate('/login')` que quedó redundante desde el punto 2 (el interceptor ya redirige antes de que ese `catch` lo vea). No es un bug, pero es código muerto a limpiar.

Véase: [api.ts](./src/services/api.ts).

**Estado tras esta sesión:** refreshToken funcionando de punta a punta (renovación transparente, fallback a login, protección contra refreshes concurrentes), probado manualmente en los dos primeros puntos.

## Limpieza de código muerto: chequeos manuales de 401 redundantes
Tras el interceptor de `api.ts`, quedaron tres chequeos manuales `if (err?.response?.status === 401) { navigate('/login'); ... }` en distintas páginas — código que ya no hacía nada útil, porque el interceptor intercepta el 401 antes de que estos `catch` lleguen a verlo (renueva sola la sesión, o si no puede, ya redirige a `/login` él mismo). Se limpiaron los tres:

- **`CartPage.tsx`**: quitado en `fetchCart` y en `handleCheckout`.
- **`ProductDetailPage.tsx`**: quitado en `handleAddToCart`.
- **`OrdersPage.tsx`**: quitado en `fetchOrders`. A diferencia de los otros dos, aquí `navigate` no se usaba para nada más, así que también se quitó el import de `useNavigate` y la variable, para no dejar un import huérfano.

Se corrió `eslint` antes y después del cambio (comparando con `git stash`) para separar deuda técnica preexistente de lo tocado en esta limpieza: antes había 5 errores (todos preexistentes: tipos `any` sin especificar en los tres archivos, más un patrón de `setState` dentro de `useEffect` en `CartPage.tsx`, sin relación con el refreshToken). Después quedaron 4 errores + 1 warning — bajó uno porque en `OrdersPage.tsx` el `catch (err: any)` ya no necesitaba tipar `any` al no volver a leer `err.response`. El resto de la deuda (los `any` restantes y el patrón de `setState` en efecto) se deja pendiente para otra sesión, sin relación con esta limpieza.

Véase: [CartPage.tsx](./src/pages/CartPage.tsx), [ProductDetailPage.tsx](./src/pages/ProductDetailPage.tsx), [OrdersPage.tsx](./src/pages/OrdersPage.tsx).

**Estado tras esta sesión:** el manejo de sesión expirada/inválida quedó centralizado exclusivamente en el interceptor de `api.ts`; ninguna página maneja el 401 por su cuenta. `tsc --noEmit` sin errores en los tres archivos.

## Deuda de ESLint, AuthContext y rutas protegidas, y destino tras un refresh fallido
Se cerraron los tres pendientes que habían quedado anotados de la sesión anterior.

1. **Deuda de ESLint preexistente.** Se creó `src/lib/http-error.ts` con `getErrorMessage(err, fallback)` (usa `isAxiosError` de axios como type guard) para reemplazar todos los `catch (err: any)` sin tener que repetir la lógica en cada página. De paso, en `ProductDetailPage.tsx` se encontró que el chequeo manual `if (err?.response?.status === 401) navigate('/login')` seguía ahí pese a que la entrada anterior de esta bitácora decía que ya se había limpiado — no llegó a incluirse en aquel commit. Se quitó ahora, ya redundante con el interceptor. Para el patrón `setState` dentro de `useEffect` de `CartPage.tsx`, envolver la llamada a `fetchCart()` en un IIFE async (`(async () => { await fetchCart(); })()`) fue suficiente para que `react-hooks/set-state-in-effect` dejara de dispararse. `npx eslint .` y `npx tsc --noEmit` quedan sin errores.

2. **AuthContext y rutas protegidas.** Se creó `src/context/auth-context.ts` (definición del contexto + hook `useAuth`, sin JSX) y `src/context/AuthContext.tsx` (el componente `AuthProvider`) — separados en dos archivos porque `react-refresh/only-export-components` no deja mezclar un hook exportado con un componente en el mismo archivo. `AuthProvider` pregunta la sesión actual una vez al montar (`GET /users/me`, apoyándose en el interceptor de `api.ts` para renovar sola si hace falta) y expone `status` (`loading`/`authenticated`/`unauthenticated`), `user`, `refreshAuth` y `logout`. Se creó `src/components/ProtectedRoute.tsx`, que solo protege `/cart`, `/orders` y `/profile` — el catálogo y el detalle de producto se dejaron deliberadamente fuera, porque son de lectura pública (solo agregar al carrito exige sesión). `ProfilePage.tsx` se reescribió para consumir `user` y `logout` del contexto en vez de mantener su propio `fetch`/`loading`/redirect duplicado.

3. **UX: volver a donde estaba tras renovar sesión.** Antes, tanto `ProtectedRoute` (sesión no confirmada al entrar a una ruta protegida) como el interceptor de `api.ts` (refresh fallido a media sesión) mandaban siempre a `/login` sin rastro de a dónde iba el usuario. Ahora:
   - `ProtectedRoute` pasa la ruta actual como `state={{ from }}` de `react-router` al redirigir (vive dentro del árbol de React).
   - El interceptor de `api.ts`, que vive *fuera* del árbol de React (por eso usa `window.location.href` y no `useNavigate`), la pasa como `?redirectTo=` en la URL.
   - `LoginPage.tsx` lee ambas fuentes (con un `sanitizeRedirectTarget` que solo acepta rutas internas, para evitar un open-redirect vía `?redirectTo=`) y navega ahí tras un login exitoso; si no hay ninguna, cae a `/profile` como antes.

Véase: [http-error.ts](./src/lib/http-error.ts), [auth-context.ts](./src/context/auth-context.ts), [AuthContext.tsx](./src/context/AuthContext.tsx), [ProtectedRoute.tsx](./src/components/ProtectedRoute.tsx), [ProfilePage.tsx](./src/pages/ProfilePage.tsx), [LoginPage.tsx](./src/pages/LoginPage.tsx), [App.tsx](./src/App.tsx).

**Estado tras esta sesión:** `npx eslint .`, `npx tsc --noEmit` y `npx vite build` sin errores. No se probó todavía contra el backend real (falta levantar sesión de dev y verificar a mano login → ruta protegida → refresh de 15 min → logout); queda pendiente para cuando se despliegue o se corra localmente, igual que el `clearCookie` del backend.