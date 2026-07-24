import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth.service';

export default function ProfilePage() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await authService.getProfile();
                setUser(data);
            } catch (error) {
                // Si hay error (ej. token inválido o expirado), mandamos al login
                navigate('/login', { replace: true });
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [navigate]);

    const handleLogout = async () => {
        try {
            await authService.logout();
            // El backend debería encargarse de limpiar las cookies            
            navigate('/login');
        } catch (error) {
            console.error('Error cerrando sesión', error);
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-base-200">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    return (
        <div className="flex h-screen items-center justify-center bg-base-200 p-4">
            <div className="card w-full max-w-md bg-base-100 shadow-xl">
                <div className="card-body items-center text-center">
                    <h2 className="card-title text-3xl font-bold mb-2">¡Hola! 🧶</h2>
                    <p className="mb-6 text-gray-500">Has accedido al sistema exitosamente.</p>

                    <div className="w-full bg-base-200 rounded-box p-4 mb-6">
                        <p className="font-semibold">Correo registrado:</p>
                        <p>{user?.data.email || 'No disponible'}</p>
                        <p className="font-semibold">Nombre:</p>
                        <p>{user?.data.firstName || 'No disponible'}</p>
                        <p className="font-semibold">Apellido:</p>
                        <p>{user?.data.lastName || 'No disponible'}</p>

                    </div>

                    <button onClick={handleLogout} className="btn btn-outline btn-error w-full">
                        Cerrar Sesión
                    </button>
                </div>
            </div>
        </div>
    );
}