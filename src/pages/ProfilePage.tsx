import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/auth-context';

export default function ProfilePage() {
    // Al llegar hasta acá ya pasamos por ProtectedRoute, así que la sesión
    // está confirmada y user no debería ser null.
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <div className="flex h-screen items-center justify-center bg-base-200 p-4">
            <div className="card w-full max-w-md bg-base-100 shadow-xl">
                <div className="card-body items-center text-center">
                    <h2 className="card-title text-3xl font-bold mb-2">¡Hola! 🧶</h2>
                    <p className="mb-6 text-gray-500">Has accedido al sistema exitosamente.</p>

                    <div className="w-full bg-base-200 rounded-box p-4 mb-6">
                        <p className="font-semibold">Correo registrado:</p>
                        <p>{user?.email || 'No disponible'}</p>
                        <p className="font-semibold">Nombre:</p>
                        <p>{user?.firstName || 'No disponible'}</p>
                        <p className="font-semibold">Apellido:</p>
                        <p>{user?.lastName || 'No disponible'}</p>
                    </div>

                    <button onClick={handleLogout} className="btn btn-outline btn-error w-full">
                        Cerrar Sesión
                    </button>
                </div>
            </div>
        </div>
    );
}
