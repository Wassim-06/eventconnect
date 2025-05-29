// src/app/events/page.tsx
"use client";

import { useEffect, useState, Fragment } from 'react'; // Ajout de Fragment si nécessaire pour des retours multiples
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User } from '../../generated/prisma'; // Assurez-vous que ce chemin est correct
import { toast } from 'react-hot-toast';
import {
    LayoutDashboard,
    Calendar as CalendarIcon, // Renommer pour éviter conflit avec type Calendar si existant
    BarChart2,
    Settings,
    LifeBuoy,
    LogOut,
} from 'lucide-react';

// Type pour les événements (doit correspondre à ton modèle Prisma Event)
interface Event {
    id: string;
    title: string;
    description?: string;
    date: string; // Garde-le en string ici, tu le convertiras en Date pour l'affichage
    location: string;
    imageUrl?: string;
    category?: string;
    organizer?: {
        name: string;
    };
}

export default function EventsPage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [events, setEvents] = useState<Event[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUserLoading, setIsUserLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        const userString = localStorage.getItem('user');

        if (!token || !userString) {
            toast.error("Session invalide. Veuillez vous reconnecter.");
            localStorage.clear();
            router.push('/login');
            return;
        }

        try {
            const parsedUser: User = JSON.parse(userString);
            setUser(parsedUser);
        } catch (e) {
            toast.error("Erreur de données utilisateur. Reconnexion requise.");
            localStorage.clear();
            router.push('/login');
            return; // Arrêter l'exécution si les données utilisateur sont invalides
        } finally {
            setIsUserLoading(false);
        }

        async function fetchEvents() {
            try {
                const res = await fetch('/api/events');
                if (!res.ok) {
                    throw new Error(`Erreur HTTP: ${res.status}`);
                }
                const data: Event[] = await res.json();
                setEvents(data);
            } catch (err: any) {
                console.error("Erreur lors de la récupération des événements:", err);
                setError("Impossible de charger les événements. Veuillez réessayer plus tard.");
            } finally {
                setIsLoading(false);
            }
        }

        if (token && userString) { // Ne fetcher les événements que si l'utilisateur est potentiellement authentifié
            fetchEvents();
        }
    }, [router]);

    const handleLogout = () => {
        toast.success("Vous avez été déconnecté.");
        localStorage.clear();
        router.push('/login');
    };

    if (isUserLoading || (isLoading && events.length === 0)) { // Afficher le chargement si l'utilisateur ou les événements chargent
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="flex items-center space-x-3">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <p className="text-gray-600 text-lg">Chargement des événements...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* ===== Barre Latérale (Sidebar) ===== */}
            <aside className="w-64 bg-white border-r border-gray-200 flex flex-col fixed h-full">
                <div className="p-6">
                    <Link href="/dashboard" className="text-2xl font-bold text-blue-600">
                        EventConnect
                    </Link>
                </div>
                <nav className="flex-1 px-4 py-2 space-y-2">
                    <Link href="/dashboard" className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg">
                        <LayoutDashboard className="mr-3 h-5 w-5" /> Tableau de bord
                    </Link>
                    <Link href="/events" className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg">
                        <CalendarIcon className="mr-3 h-5 w-5" /> Mes Événements
                    </Link>
                    <Link href="/dashboard/analytics" className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg">
                        <BarChart2 className="mr-3 h-5 w-5" /> Analytics
                    </Link>
                    <Link href="/dashboard/settings" className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg">
                        <Settings className="mr-3 h-5 w-5" /> Paramètres
                    </Link>
                    <Link href="/dashboard/help" className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg">
                        <LifeBuoy className="mr-3 h-5 w-5" /> Aide & Support
                    </Link>
                </nav>
                <div className="p-4 border-t border-gray-200">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center text-blue-800 font-bold">
                            {user?.name ? user.name.charAt(0).toUpperCase() : '?'}
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                            <button onClick={handleLogout} className="text-xs text-red-600 hover:underline flex items-center">
                                <LogOut className="mr-1 h-3 w-3" /> Déconnexion
                            </button>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main content */}
            <main className="flex-1 ml-64 p-6 lg:p-10">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Mes Événements</h1>
                    <p className="text-gray-500 mt-1">Consultez et gérez vos événements.</p>
                </header>

                <div className="max-w-7xl mx-auto">
                    {/* La logique d'affichage des événements existante commence ici */}
                    {isLoading && events.length === 0 && ( // Modifié pour s'afficher uniquement si aucun événement n'est encore chargé
                        <p className="text-center text-gray-600 text-lg">Chargement des événements...</p>
                    )}

                    {error && (
                        <p className="text-center text-red-600 text-lg">{error}</p>
                    )}

                    {!isLoading && !error && events.length === 0 && (
                        <p className="text-center text-gray-600 text-lg">Vous n'avez aucun événement pour le moment. <Link href="/events/create" className="text-blue-600 hover:underline">Créez-en un !</Link></p>
                    )}

                    {events.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {events.map((event) => (
                                <div
                                    key={event.id}
                                    className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden border border-gray-200"
                                >
                                    {event.imageUrl && (
                                        <img
                                            src={event.imageUrl}
                                            alt={event.title}
                                            className="w-full h-48 object-cover"
                                        />
                                    )}
                                    <div className="p-5">
                                        <h2 className="text-xl font-semibold text-gray-900 mb-2">{event.title}</h2>
                                        {event.category && (
                                            <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full mb-2">
                                                {event.category}
                                            </span>
                                        )}
                                        <p className="text-gray-600 text-sm mb-1">
                                            <strong className="font-medium">Quand :</strong> {new Date(event.date).toLocaleDateString('fr-FR', {
                                                year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                            })}
                                        </p>
                                        <p className="text-gray-600 text-sm mb-3">
                                            <strong className="font-medium">Où :</strong> {event.location}
                                        </p>
                                        {event.organizer && (
                                            <p className="text-gray-500 text-xs mb-3">
                                                Organisé par : {event.organizer.name}
                                            </p>
                                        )}
                                        <p className="text-gray-700 text-base mb-4 line-clamp-3">{event.description || "Pas de description disponible."}</p>
                                        <Link
                                            href={`/events/${event.id}`}
                                            className="inline-block bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-semibold"
                                        >
                                            Voir les détails
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {/* Le pied de page simple peut être conservé ou supprimé si le layout global en fournit un */}
            {/*
            <footer className="bg-white py-4 text-center text-gray-500 text-sm border-t border-gray-200 mt-8">
                &copy; {new Date().getFullYear()} EventConnect. Tous droits réservés.
            </footer>
            */}
        </div>
    );
}