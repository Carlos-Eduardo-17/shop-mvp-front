import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/auth.service';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await authService.login({ email, password });
            // Si el login es exitoso, la cookie HttpOnly ya se guardó en el navegador
            alert(`Bienvenido ${response.data.firstName} ${response.data.lastName}`);
            navigate('/profile');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al iniciar sesión');
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