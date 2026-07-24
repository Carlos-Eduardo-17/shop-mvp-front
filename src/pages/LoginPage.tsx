import { Link } from 'react-router-dom';

export default function LoginPage() {
    return (
        <div className="flex h-screen items-center justify-center bg-base-200">
            <div className="card w-96 bg-base-100 shadow-xl p-6 text-center">
                <h2 className="text-2xl font-bold mb-4">Iniciar Sesión</h2>
                <p>Aquí irá el formulario de Login</p>
                <Link to="/register" className="btn btn-primary mt-4">Ir a Registro</Link>
            </div>
        </div>
    );
}