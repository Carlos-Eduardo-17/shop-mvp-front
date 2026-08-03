import axios from 'axios';

// El puerto debe coincidir con el del backend Express en desarrollo
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/';

export const api = axios.create({
    baseURL: API_URL,
    withCredentials: true, // Crucial para que el navegador gestione las cookies HttpOnly automáticamente
    headers: { 'Content-Type': 'application/json' }
});

// Si la sesión no se puede recuperar (refreshToken vencido/inválido, o la
// petición ya reintentada vuelve a dar 401), no queda otra que re-loguearse.
// Se evita el loop comprobando que no estemos ya en /login.
//
// Como este código vive fuera del árbol de React (no hay useNavigate ni
// useLocation aquí), la ruta de origen se pasa como query param en vez de
// state de react-router, para que LoginPage pueda leerla y volver ahí tras
// un login exitoso en lugar de mandar siempre al punto de entrada por defecto.
const redirectToLogin = () => {
    if (window.location.pathname === '/login') return;

    const redirectTo = `${window.location.pathname}${window.location.search}`;
    window.location.href = `/login?redirectTo=${encodeURIComponent(redirectTo)}`;
};

// El refreshToken es de un solo uso (el backend lo rota en cada llamada a
// /auth/refresh). Si dos peticiones expiran casi al mismo tiempo y cada una
// dispara su propio refresh por separado, la segunda llega con el token ya
// invalidado por la primera y recibe 401 injustamente. Por eso todas las
// peticiones 401 concurrentes comparten esta única promesa en curso.
let refreshInFlight: Promise<unknown> | null = null;

const refreshSession = () => {
    if (!refreshInFlight) {
        refreshInFlight = api.post('/auth/refresh').finally(() => {
            refreshInFlight = null;
        });
    }
    return refreshInFlight;
};

// Paso 1 del refreshToken: si el accessToken expira (401), el backend permite
// renovarlo transparentemente vía POST /auth/refresh (lee el refreshToken de
// su propia cookie HttpOnly). Este interceptor reintenta UNA vez la petición
// original después de renovar, para que el usuario no note el vencimiento.
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const status = error.response?.status;

        const isLogin = originalRequest?.url?.includes('/auth/login');
        const isRefresh = originalRequest?.url?.includes('/auth/refresh');

        // login (401 ahí significa "credenciales incorrectas", no "sesión
        // vencida") queda totalmente al margen de este mecanismo.
        if (status === 401 && !isLogin) {
            // Primer 401 de una petición que no es /auth/refresh: intentamos
            // renovar la sesión (compartiendo la promesa si ya hay una en
            // curso) y reintentar una sola vez (flag _retry).
            if (!isRefresh && !originalRequest?._retry) {
                originalRequest._retry = true;

                try {
                    await refreshSession();
                    return api(originalRequest);
                } catch (refreshError) {
                    // El refreshToken también venció o es inválido.
                    redirectToLogin();
                    return Promise.reject(refreshError);
                }
            }

            // Llegamos aquí en dos casos: (a) el propio POST /auth/refresh
            // devolvió 401, o (b) la petición ya reintentada volvió a fallar
            // con 401. En ambos, no hay forma de recuperar la sesión sola.
            redirectToLogin();
        }

        return Promise.reject(error);
    }
);