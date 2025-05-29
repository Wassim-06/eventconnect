// src/hooks/useAuth.ts
'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode'; // Assure-toi que 'jwt-decode' est bien installé

interface User {
    id: string;
    email: string;
    name?: string;
    // Ajoute d'autres propriétés si nécessaire (ex: role)
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    login: (token: string) => void;
    logout: () => void;
    checkAuthStatus: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const checkAuthStatus = () => {
        setLoading(true);
        // Utilisation de typeof window !== 'undefined' pour éviter les erreurs côté serveur (SSR)
        const token = typeof window !== 'undefined' ? localStorage.getItem('jwt') : null;
        if (token) {
            try {
                const decodedToken: any = jwtDecode(token);
                // Vérifie l'expiration du token (exp est en secondes, Date.now() en millisecondes)
                if (decodedToken.exp * 1000 > Date.now()) {
                    setUser({
                        id: decodedToken.userId,
                        email: decodedToken.email,
                        name: decodedToken.name || decodedToken.email // Utilise 'name' si disponible, sinon 'email'
                    });
                    setIsAuthenticated(true);
                } else {
                    // Token expiré
                    if (typeof window !== 'undefined') {
                        localStorage.removeItem('jwt'); // Supprime le token expiré
                    }
                    setUser(null);
                    setIsAuthenticated(false);
                }
            } catch (error) {
                // Erreur de décodage JWT (token invalide, malformé, etc.)
                console.error('Erreur décodage JWT:', error);
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('jwt'); // Supprime le token invalide
                }
                setUser(null);
                setIsAuthenticated(false);
            }
        } else {
            // Pas de token trouvé
            setUser(null);
            setIsAuthenticated(false);
        }
        setLoading(false);
    };

    // Exécuté une seule fois au montage du composant
    useEffect(() => {
        checkAuthStatus();
        // Pour un rafraîchissement périodique du statut (si les tokens ont une courte durée de vie)
        // const interval = setInterval(checkAuthStatus, 5 * 60 * 1000); // toutes les 5 minutes
        // return () => clearInterval(interval); // Nettoyage à l'unmount
    }, []);

    const login = (token: string) => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('jwt', token); // Stocke le token
        }
        checkAuthStatus(); // Met à jour l'état d'authentification
        router.push('/dashboard'); // Redirige vers le tableau de bord
    };

    const logout = () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('jwt'); // Supprime le token
        }
        setUser(null);
        setIsAuthenticated(false);
        router.push('/login'); // Redirige vers la page de connexion
    };

    // prettier-ignore
    return (
        <AuthContext.Provider value={{ user, isAuthenticated, loading, login, logout, checkAuthStatus }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};