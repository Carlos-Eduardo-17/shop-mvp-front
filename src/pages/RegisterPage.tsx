import { Link } from 'react-router-dom';

export default function RegisterPage() {
    return (
        <div className="flex h-screen items-center justify-center bg-base-200">
            <div className="card w-96 bg-base-100 shadow-xl p-6 text-center">
                <h2 className="text-2xl font-bold mb-4">Registro</h2>
                <p>Aquí irá el formulario de Logup</p>
                <Link to="/login" className="btn btn-primary mt-4">Ir a Login</Link>
            </div>
        </div>
    );
}