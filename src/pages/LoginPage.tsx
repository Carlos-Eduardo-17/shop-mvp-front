import { useState } from 'react';
import { useNavigate, useLocation, useSearchParams, Link } from 'react-router-dom';
import { authService } from '../services/auth.service';
import { getErrorMessage } from '../lib/http-error';
import { useAuth } from '../context/auth-context';

// Evita open-redirects: solo se acepta un destino que sea una ruta interna
// (empieza con "/" pero no con "//", que el navegador podría interpretar
// como protocol-relative hacia otro dominio).
const sanitizeRedirectTarget = (candidate: string | null | undefined): string | null => {
    if (!candidate || !candidate.startsWith('/') || candidate.startsWith('//')) {
        return null;
    }
    return candidate;
};

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const { refreshAuth } = useAuth();

    // A dónde volver tras loguearse: si fue ProtectedRoute quien mandó para
    // acá (dentro del árbol de React), viene en location.state.from; si fue
    // el interceptor de api.ts (fuera del árbol, tras un refresh fallido),
    // viene como ?redirectTo= en la URL. Si no hay ninguno, /profile por defecto.
    const redirectTarget =
        sanitizeRedirectTarget((location.state as { from?: string } | null)?.from) ||
        sanitizeRedirectTarget(searchParams.get('redirectTo')) ||
        '/profile';

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await authService.login({ email, password });
            // Si el login es exitoso, la cookie HttpOnly ya se guardó en el navegador.
            // Se refresca el AuthContext para que el resto de la app (ej. rutas
            // protegidas) se entere de inmediato de que ya hay sesión.
            await refreshAuth();
            navigate(redirectTarget, { replace: true });
        } catch (err) {
            setError(getErrorMessage(err, 'Error al iniciar sesión'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen items-center justify-center bg-base-200">
            <div className="card w-96 bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title justify-center text-2xl font-bold">Iniciar Sesión</h2>

                    <form onSubmit={handleLogin} className="flex flex-col gap-4 mt-4">
                        <div className="form-control">
                            <label className="label"><span className="label-text">Correo Electrónico</span></label>
                            <input
                                type="email"
                                placeholder="correo@ejemplo.com"
                                className="input input-bordered"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-control">
                            <label className="label"><span className="label-text">Contraseña</span></label>
                            <input
                                type="password"
                                placeholder="********"
                                className="input input-bordered"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        {error && <p className="text-error text-sm text-center">{error}</p>}

                        <button type="submit" className="btn btn-primary mt-4" disabled={loading}>
                            {loading ? <span className="loading loading-spinner"></span> : 'Ingresar'}
                        </button>
                    </form>

                    <p className="text-center text-sm mt-4">
                        ¿No tienes cuenta? <Link to="/register" className="link link-primary">Regístrate</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}