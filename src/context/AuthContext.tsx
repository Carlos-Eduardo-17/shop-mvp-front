import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { authService } from '../services/auth.service';
import { AuthContext, type AuthStatus, type AuthUser } from './auth-context';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [user, setUser] = useState<AuthUser | null>(null);

  const refreshAuth = useCallback(async () => {
    try {
      const response = await authService.getProfile();
      setUser(response.data);
      setStatus('authenticated');
    } catch {
      // Si esto falla es porque ni el interceptor pudo renovar la sesión
      // (no había sesión, o el refreshToken también venció/es inválido).
      setUser(null);
      setStatus('unauthenticated');
    }
  }, []);

  useEffect(() => {
    (async () => {
      await refreshAuth();
    })();
  }, [refreshAuth]);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // Aunque falle la llamada (ej. sin red), igual limpiamos el estado
      // local: no tiene sentido dejar al usuario "logueado" en la UI si no
      // podemos confirmar la sesión con el backend.
    } finally {
      setUser(null);
      setStatus('unauthenticated');
    }
  }, []);

  return (
    <AuthContext.Provider value={{ status, user, refreshAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
