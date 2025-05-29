// src/app/events/page.tsx
"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';

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
    const [events, setEvents] = useState<Event[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
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

        fetchEvents();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Barre de navigation (peut être un composant réutilisable) */}
            <nav className="bg-white shadow-sm py-4 px-6 flex justify-between items-center border-b border-gray-200">
                <Link href="/" className="text-2xl font-bold text-blue-600 hover:text-blue-800 transition-colors">
                    EventConnect
                </Link>
                <div className="flex items-center space-x-4">
                    <Link href="/dashboard" className="text-gray-700 hover:text-blue-600 font-medium">
                        Tableau de bord
                    </Link>
                    <Link href="/login" className="py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        Connexion
                    </Link>
                </div>
            </nav>

            <main className="flex-1 p-6 lg:p-10">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-4xl font-extrabold text-gray-800 mb-8 text-center">
                        Découvrez nos Événements
                    </h1>

                    {isLoading && (
                        <p className="text-center text-gray-600 text-lg">Chargement des événements...</p>
                    )}

                    {error && (
                        <p className="text-center text-red-600 text-lg">{error}</p>
                    )}

                    {!isLoading && !error && events.length === 0 && (
                        <p className="text-center text-gray-600 text-lg">Aucun événement disponible pour le moment.</p>
                    )}

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
                </div>
            </main>

            {/* Pied de page simple */}
            <footer className="bg-white py-4 text-center text-gray-500 text-sm border-t border-gray-200 mt-8">
                &copy; {new Date().getFullYear()} EventConnect. Tous droits réservés.
            </footer>
        </div>
    );
}