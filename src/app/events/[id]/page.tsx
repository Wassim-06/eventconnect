// src/app/events/[id]/page.tsx
"use client"; // Ceci fait de ce composant un Client Component

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { Event } from '../../../generated/prisma'; // Assure-toi que le chemin est correct

// Étend le type Event pour inclure l'organisateur complet si tu l'inclues dans la réponse API
interface FullEvent extends Event {
    organizer?: { id: string; name: string; email: string; }; // Inclut les détails de l'organisateur
}

export default function EventDetailPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    // La modification ici : Accède directement à params.id au lieu de la déstructuration
    const id = params.id; // L'ID de l'événement est disponible via params. C'est l'ID de l'événement.
    const [event, setEvent] = useState<FullEvent | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) {
            setError("ID de l'événement manquant.");
            setIsLoading(false);
            return;
        }

        async function fetchEventDetails() {
            try {
                const res = await fetch(`/api/events/${id}`);
                if (!res.ok) {
                    if (res.status === 404) {
                        throw new Error("Événement non trouvé.");
                    }
                    throw new Error(`Erreur HTTP: ${res.status}`);
                }
                const data: FullEvent = await res.json();
                setEvent(data);
            } catch (err: any) {
                console.error(`Erreur lors de la récupération de l'événement ${id}:`, err);
                setError(err.message || "Impossible de charger les détails de l'événement.");
            } finally {
                setIsLoading(false);
            }
        }

        fetchEventDetails();
    }, [id]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <p className="text-gray-600 text-lg animate-pulse">Chargement des détails de l'événement...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-red-50">
                <div className="text-center p-6 bg-white rounded-lg shadow-md border border-red-200">
                    <p className="text-red-700 text-lg font-semibold mb-4">{error}</p>
                    <Link href="/events" className="text-blue-600 hover:underline">Retour à la liste des événements</Link>
                </div>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <p className="text-gray-600">Aucune donnée pour cet événement.</p>
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
                    <Link href="/events" className="text-gray-700 hover:text-blue-600 font-medium">
                        Tous les événements
                    </Link>
                    <Link href="/dashboard" className="text-gray-700 hover:text-blue-600 font-medium">
                        Tableau de bord
                    </Link>
                    {/* Ajoutez un bouton de déconnexion si l'utilisateur est connecté */}
                </div>
            </nav>

            <main className="flex-1 p-6 lg:p-10">
                <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden border border-gray-200">
                    {event.imageUrl && (
                        <img
                            src={event.imageUrl}
                            alt={event.title}
                            className="w-full h-80 object-cover"
                        />
                    )}
                    <div className="p-8">
                        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">{event.title}</h1>

                        <div className="flex flex-wrap items-center gap-4 text-gray-700 mb-6">
                            <span className="flex items-center text-lg font-medium">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                </svg>
                                {new Date(event.date).toLocaleDateString('fr-FR', {
                                    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                })}
                            </span>
                            <span className="flex items-center text-lg font-medium">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                </svg>
                                {event.location}
                            </span>
                            {event.category && (
                                <span className="inline-block bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">
                                    {event.category}
                                </span>
                            )}
                        </div>

                        {event.organizer && (
                            <p className="text-gray-600 text-md mb-6">
                                Organisé par : <span className="font-semibold text-blue-700">{event.organizer.name}</span>
                            </p>
                        )}

                        <h2 className="text-2xl font-bold text-gray-800 mb-3">À Propos de l'Événement</h2>
                        <p className="text-gray-700 leading-relaxed mb-8">
                            {event.description || "Aucune description détaillée n'est disponible pour cet événement."}
                        </p>

                        <div className="flex items-center space-x-4">
                            <span className="text-xl font-bold text-gray-900">
                                Places disponibles : {event.maxAttendees ? `${event.currentAttendees}/${event.maxAttendees}` : 'Illimité'}
                            </span>
                            {/* Bouton de réservation (à implémenter plus tard) */}
                            <button
                                className="bg-blue-600 text-white py-3 px-6 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors duration-200 shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed"
                                disabled={event.maxAttendees !== null && event.currentAttendees >= (event.maxAttendees || 0)}
                            >
                                {event.maxAttendees !== null && event.currentAttendees >= (event.maxAttendees || 0) ? "Complet" : "Réserver votre place"}
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            {/* Pied de page */}
            <footer className="bg-white py-4 text-center text-gray-500 text-sm border-t border-gray-200 mt-8">
                &copy; {new Date().getFullYear()} EventConnect. Tous droits réservés.
            </footer>
        </div>
    );
}