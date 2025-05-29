// src/app/dashboard/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User } from '../../generated/prisma'; // Importe le type User de Prisma
import { toast } from 'react-hot-toast'; // Importe toast pour les notifications

// Définis un type pour un événement simulé (pour l'affichage en attendant le backend)
interface Event {
    id: string;
    title: string;
    date: string;
    location: string;
    status: 'confirmé' | 'annulé' | 'terminé';
}

export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // State for the modal
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    // States for the form fields inside the modal
    const [profileName, setProfileName] = useState('');
    const [profileEmail, setProfileEmail] = useState('');
    const [isUpdatingProfile, setIsUpdatingProfile] = useState(false); // Loading state for modal form
    const [profileError, setProfileError] = useState<string | null>(null); // Error state for modal form


    // Données d'événements simulées pour l'affichage
    const upcomingEvents: Event[] = [
        { id: 'evt001', title: 'Conférence Tech Connect', date: '10 juillet 2025', location: 'Paris', status: 'confirmé' },
        { id: 'evt002', title: 'Workshop Design UX', date: '22 août 2025', location: 'Lyon', status: 'confirmé' },
        { id: 'evt003', title: 'Meetup Cyber Sécurité', date: '05 septembre 2025', location: 'Marseille', status: 'confirmé' },
    ];

    const pastEvents: Event[] = [
        { id: 'evt004', title: 'Hackathon Innovation', date: '15 avril 2025', location: 'Bordeaux', status: 'terminé' },
    ];

    // Effect for initial user data loading and authentication check
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        const userString = localStorage.getItem('user');

        if (!token) {
            setError("Vous n'êtes pas connecté. Redirection...");
            toast.error("Vous n'êtes pas connecté. Redirection...");
            setTimeout(() => router.push('/login'), 1500);
            return;
        }

        try {
            if (userString) {
                const parsedUser: User = JSON.parse(userString);
                setUser(parsedUser);
                // Initialize profile form fields with current user data
                setProfileName(parsedUser.name || '');
                setProfileEmail(parsedUser.email || '');
            } else {
                setError("Données utilisateur introuvables. Redirection...");
                toast.error("Données utilisateur introuvables. Veuillez vous reconnecter.");
                localStorage.removeItem('authToken');
                localStorage.removeItem('user');
                setTimeout(() => router.push('/login'), 1500);
            }
        } catch (e) {
            console.error("Erreur lors du parsing des données utilisateur:", e);
            setError("Erreur de récupération des données utilisateur. Redirection...");
            toast.error("Erreur de récupération des données utilisateur. Veuillez vous reconnecter.");
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            setTimeout(() => router.push('/login'), 1500);
        } finally {
            setIsLoading(false);
        }
    }, [router]);

    // Function to handle profile update from the modal
    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsUpdatingProfile(true);
        setProfileError(null);

        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                toast.error('Token manquant, veuillez vous reconnecter.');
                router.push('/login');
                return;
            }

            const res = await fetch('/api/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                // Send only the name as email is readOnly
                body: JSON.stringify({ name: profileName }),
            });

            if (res.status === 401 || res.status === 403) {
                toast.error('Votre session a expiré ou est invalide. Veuillez vous reconnecter.');
                router.push('/login');
                return;
            }

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Erreur lors de la mise à jour du profil.');
            }

            const updatedUser = await res.json();
            setUser(updatedUser); // Update local user state with new data
            localStorage.setItem('user', JSON.stringify(updatedUser)); // Update localStorage

            toast.success('Profil mis à jour avec succès !');
            setIsProfileModalOpen(false); // Close the modal on success
        } catch (err: any) {
            setProfileError(err.message);
            toast.error(err.message);
        } finally {
            setIsUpdatingProfile(false);
        }
    };


    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        router.push('/login');
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                <p className="text-gray-600 text-lg animate-pulse">Chargement de votre tableau de bord...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-red-50">
                <p className="text-red-700 text-lg font-semibold">{error}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Barre de navigation */}
            <nav className="bg-white shadow-sm py-4 px-6 flex justify-between items-center border-b border-gray-200">
                <Link href="/" className="text-2xl font-bold text-blue-600 hover:text-blue-800 transition-colors">
                    EventConnect
                </Link>
                <div className="flex items-center space-x-4">
                    <span className="text-gray-700 font-medium">Bonjour, {user?.name || 'Utilisateur'}</span>
                    <button
                        onClick={handleLogout}
                        className="py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-400"
                    >
                        Déconnexion
                    </button>
                </div>
            </nav>

            {/* Contenu principal du tableau de bord */}
            <main className="flex-1 p-6 lg:p-10">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">

                    {/* Section Profil rapide */}
                    <div className="md:col-span-1 bg-white p-6 rounded-lg shadow-md border border-gray-200 h-fit">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Votre Profil</h2>
                        <div className="flex items-center space-x-4 mb-4">
                            {/* Un avatar fictif ou réel si tu en as un */}
                            <div className="w-16 h-16 bg-blue-200 rounded-full flex items-center justify-center text-blue-800 text-3xl font-bold">
                                {user?.name ? user.name.charAt(0).toUpperCase() : '?'}
                            </div>
                            <div>
                                <p className="text-xl font-semibold text-gray-900">{user?.name}</p>
                                <p className="text-sm text-gray-600">{user?.email}</p>
                            </div>
                        </div>
                        <button // Changed from Link to button to open modal
                            onClick={() => setIsProfileModalOpen(true)}
                            className="block w-full text-center py-2 px-4 rounded-lg font-semibold text-blue-600 border border-blue-600 hover:bg-blue-50 transition-colors duration-200"
                        >
                            Gérer votre profil
                        </button>
                    </div>

                    {/* Section Événements à Venir */}
                    <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-md border border-gray-200">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Vos Prochains Événements</h2>
                        {upcomingEvents.length > 0 ? (
                            <ul className="space-y-4">
                                {upcomingEvents.map(event => (
                                    <li key={event.id} className="p-4 bg-blue-50 rounded-lg flex items-center justify-between shadow-sm border border-blue-100">
                                        <div>
                                            <p className="text-lg font-semibold text-blue-800">{event.title}</p>
                                            <p className="text-sm text-gray-600">{event.date} à {event.location}</p>
                                        </div>
                                        <Link href={`/events/${event.id}`} className="text-blue-600 hover:underline font-medium">
                                            Voir les détails
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-600 italic">Vous n'avez pas encore d'événements à venir. <Link href="/events" className="text-blue-600 hover:underline">Trouvez-en un !</Link></p>
                        )}

                        {/* Section Événements Passés (optionnel) */}
                        <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Historique des Événements</h2>
                        {pastEvents.length > 0 ? (
                            <ul className="space-y-4">
                                {pastEvents.map(event => (
                                    <li key={event.id} className="p-4 bg-gray-50 rounded-lg flex items-center justify-between shadow-sm border border-gray-100 opacity-80">
                                        <div>
                                            <p className="text-lg font-semibold text-gray-700">{event.title}</p>
                                            <p className="text-sm text-gray-500">{event.date} à {event.location}</p>
                                        </div>
                                        <Link href={`/events/${event.id}`} className="text-gray-500 hover:underline font-medium">
                                            Voir les détails
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-600 italic">Aucun événement terminé pour l'instant.</p>
                        )}
                    </div>
                </div>
            </main>

            {/* Pied de page simple */}
            <footer className="bg-white py-4 text-center text-gray-500 text-sm border-t border-gray-200 mt-8">
                &copy; {new Date().getFullYear()} EventConnect. Tous droits réservés.
            </footer>

            {/* --- La Modal de modification du profil (intégrée ici) --- */}
            {isProfileModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md relative animate-fade-in-up">
                        {/* Bouton de fermeture de la modal */}
                        <button
                            onClick={() => setIsProfileModalOpen(false)} // Ferme la modal au clic
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-semibold"
                        >
                            &times;
                        </button>

                        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Modifier le Profil</h2>

                        <form onSubmit={handleProfileUpdate} className="space-y-6">
                            <div>
                                <label htmlFor="profileName" className="block text-gray-700 text-sm font-semibold mb-2">Nom :</label>
                                <input
                                    type="text"
                                    id="profileName"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={profileName}
                                    onChange={(e) => setProfileName(e.target.value)}
                                    disabled={isUpdatingProfile}
                                />
                            </div>
                            <div>
                                <label htmlFor="profileEmail" className="block text-gray-700 text-sm font-semibold mb-2">Email :</label>
                                <input
                                    type="email"
                                    id="profileEmail"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100 cursor-not-allowed"
                                    value={profileEmail}
                                    readOnly // L'email est en lecture seule
                                    disabled={isUpdatingProfile}
                                />
                                <p className="text-xs text-gray-500 mt-1">L'email ne peut pas être modifié pour l'instant.</p>
                            </div>

                            {profileError && (
                                <p className="text-red-500 text-sm text-center">{profileError}</p>
                            )}

                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={isUpdatingProfile}
                            >
                                {isUpdatingProfile ? 'Mise à jour...' : 'Mettre à jour le profil'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}