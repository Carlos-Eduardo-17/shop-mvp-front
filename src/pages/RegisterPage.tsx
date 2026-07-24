import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/auth.service';

export default function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await authService.register({ email, password, firstName, lastName });
            // Dependiendo del backend, el registro podría o no loguear automáticamente. 
            // Por convención simple, lo enviamos al login tras un registro exitoso.
            alert("Registro exitoso");
            navigate('/login');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al registrar usuario');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen items-center justify-center bg-base-200">
            <div className="card w-96 bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title justify-center text-2xl font-bold">Registro</h2>

                    <form onSubmit={handleRegister} className="flex flex-col gap-4 mt-4">
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

                        <div className="form-control">
                            <label className="label"><span className="label-text">Nombre</span></label>
                            <input
                                type="text"
                                placeholder="Nombre"
                                className="input input-bordered"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-control">
                            <label className="label"><span className="label-text">Apellido</span></label>
                            <input
                                type="text"
                                placeholder="Apellido"
                                className="input input-bordered"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                required
                            />
                        </div>

                        {error && <p className="text-error text-sm text-center">{error}</p>}

                        <button type="submit" className="btn btn-primary mt-4" disabled={loading}>
                            {loading ? <span className="loading loading-spinner"></span> : 'Crear cuenta'}
                        </button>
                    </form>

                    <p className="text-center text-sm mt-4">
                        ¿Ya tienes cuenta? <Link to="/login" className="link link-primary">Inicia Sesión</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}