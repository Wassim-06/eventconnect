// src/app/dashboard/profile/page.tsx
'use client'; // Ce composant aura des interactions utilisateur, donc c'est un Client Component

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Pour les redirections
import { useAuth } from '@/hooks/useAuth'; // Assure-toi d'avoir un hook useAuth ou de gérer l'authentification ici
import { toast } from 'react-hot-toast'; // Utilisation d'une librairie de toasts pour les notifications
import Link from 'next/link'; // <-- AJOUTE CETTE LIGNE

export default function ProfilePage() {
    const { user, loading: authLoading, isAuthenticated, checkAuthStatus } = useAuth(); // Hook d'authentification
    const router = useRouter();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Redirection si non authentifié après le chargement de l'auth
    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/login');
            toast.error('Vous devez être connecté pour accéder à cette page.');
        }
    }, [authLoading, isAuthenticated, router]);

    // Chargement des données du profil
    useEffect(() => {
        if (isAuthenticated && user) {
            // Si le hook d'auth fournit déjà le nom et l'email, utilise-les
            setName(user.name || '');
            setEmail(user.email || '');

            // Sinon, tu peux faire une requête GET supplémentaire ici si nécessaire
            // fetchProfileData();
        }
    }, [isAuthenticated, user]);

    // Fonction pour récupérer les données du profil (si non déjà dans useAuth)
    const fetchProfileData = async () => {
        if (!isAuthenticated) return; // Ne pas fetcher si pas authentifié

        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('jwt'); // Assure-toi d'avoir le token JWT stocké
            if (!token) {
                router.push('/login');
                toast.error('Token manquant, veuillez vous reconnecter.');
                return;
            }

            const res = await fetch('/api/profile', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (res.status === 401 || res.status === 403) {
                // Token invalide ou expiré, rediriger
                router.push('/login');
                toast.error('Votre session a expiré ou est invalide. Veuillez vous reconnecter.');
                return;
            }

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Erreur lors de la récupération du profil.');
            }

            const data = await res.json();
            setName(data.name || '');
            setEmail(data.email || '');
        } catch (err: any) {
            setError(err.message);
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('jwt'); // Assure-toi d'avoir le token JWT stocké
            if (!token) {
                router.push('/login');
                toast.error('Token manquant, veuillez vous reconnecter.');
                return;
            }

            const res = await fetch('/api/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ name, email }),
            });

            if (res.status === 401 || res.status === 403) {
                // Token invalide ou expiré, rediriger
                router.push('/login');
                toast.error('Votre session a expiré ou est invalide. Veuillez vous reconnecter.');
                return;
            }

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Erreur lors de la mise à jour du profil.');
            }

            const updatedUser = await res.json();
            // Optionnel: Mettre à jour l'état de l'utilisateur dans ton hook d'auth si tu l'as
            // checkAuthStatus(); // Re-vérifier le statut d'auth pour rafraîchir les données

            toast.success('Profil mis à jour avec succès !');
        } catch (err: any) {
            setError(err.message);
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (authLoading) {
        return <div className="min-h-screen flex items-center justify-center bg-[#ebeced]">Chargement du profil...</div>;
    }

    if (!isAuthenticated) {
        return null; // ou un spinner, la redirection est gérée par useEffect
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#ebeced] p-4">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Gérer votre Profil</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-gray-700 text-sm font-semibold mb-2">Nom :</label>
                        <input
                            type="text"
                            id="name"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            disabled={loading}
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-gray-700 text-sm font-semibold mb-2">Email :</label>
                        <input
                            type="email"
                            id="email"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100 cursor-not-allowed"
                            value={email}
                            readOnly // Généralement, l'email est readonly après l'inscription
                            disabled={loading}
                        />
                        <p className="text-xs text-gray-500 mt-1">L'email ne peut pas être modifié pour l'instant.</p>
                    </div>

                    {error && (
                        <p className="text-red-500 text-sm text-center">{error}</p>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={loading}
                    >
                        {loading ? 'Mise à jour...' : 'Mettre à jour le profil'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <Link href="/dashboard" className="text-blue-600 hover:underline">
                        Retour au tableau de bord
                    </Link>
                </div>
            </div>
        </div>
    );
}