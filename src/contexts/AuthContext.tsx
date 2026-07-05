import { createContext, useEffect, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { authApi } from '../services/api';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  authReady: boolean;
  login(email: string, password: string): Promise<void>;
  register(name: string, email: string, password: string): Promise<void>;
  logout(): void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export { AuthContext, type AuthContextType };

// ---------- localStorage keys ----------
// Seuls les JWT (opaques, signés côté serveur) sont stockés ici.
// Il n'y a PLUS de mode de secours qui stockait des mots de passe en clair
// dans le navigateur : sans backend disponible, l'authentification échoue
// simplement avec un message clair, ce qui est le comportement attendu
// pour une application qui manipule des données financières.
const TOKEN_KEY = 'financeflow-token';
const REFRESH_KEY = 'financeflow-refresh';

/** Décode le payload d'un JWT sans le vérifier (vérification faite côté serveur). */
function decodeJwt(token: string): Record<string, any> | null {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return null;
  }
}

function userFromToken(token: string, fallbackEmail?: string): User {
  const payload = decodeJwt(token);
  return {
    id: String(payload?.sub ?? ''),
    name: payload?.name || payload?.email || fallbackEmail || 'Utilisateur',
    email: payload?.email || fallbackEmail || '',
  };
}

function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
}

// ---------- Provider ----------
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authReady, setAuthReady] = useState(false);

  // Hydrate la session au montage à partir du token JWT stocké, s'il est valide.
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      const payload = decodeJwt(token);
      const isExpired = payload?.exp ? payload.exp * 1000 < Date.now() : false;

      if (payload && !isExpired) {
        setUser(userFromToken(token));
        setIsAuthenticated(true);
        setAuthReady(true);
        return;
      }

      // Token absent, invalide ou expiré — on nettoie. Si un refresh token
      // existe, l'intercepteur axios (services/api.ts) tentera de le
      // rafraîchir au prochain appel API.
      if (isExpired && localStorage.getItem(REFRESH_KEY)) {
        setUser(userFromToken(token));
        setIsAuthenticated(true);
        setAuthReady(true);
        return;
      }
      clearSession();
    }
    setAuthReady(true);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const data = await authApi.login(email, password);
    localStorage.setItem(TOKEN_KEY, data.access_token);
    if (data.refresh_token) localStorage.setItem(REFRESH_KEY, data.refresh_token);

    const u = userFromToken(data.access_token, email);
    setUser(u);
    setIsAuthenticated(true);
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const data = await authApi.register(name, email, password);

    if (data.access_token) {
      localStorage.setItem(TOKEN_KEY, data.access_token);
      if (data.refresh_token) localStorage.setItem(REFRESH_KEY, data.refresh_token);
      const u = userFromToken(data.access_token, email);
      setUser(u);
      setIsAuthenticated(true);
      return;
    }

    // Le backend n'a pas renvoyé de token directement (cas improbable avec
    // l'API actuelle, mais on gère le cas plutôt que de fabriquer un faux
    // utilisateur local).
    await login(email, password);
  }, [login]);

  const logout = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
    clearSession();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, authReady, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
