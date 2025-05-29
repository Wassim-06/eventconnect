// src/app/dashboard/edit-event/[id]/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { LayoutDashboard, ArrowLeft, Save } from 'lucide-react'; // Ajout de l'icône Save

interface Event {
    id: string;
    title: string;
    description: string;
    date: string; // Garder en string pour le formulaire, convertir en Date pour l'API
    location: string;
    maxAttendees?: number;
    // Ajoutez d'autres champs de votre modèle Event si nécessaire
}

interface EditEventPageProps {
    params: {
        id: string; // L'ID de l'événement sera passé via les params de l'URL
    };
}

export default function EditEventPage({ params }: EditEventPageProps) {
    const router = useRouter();
    const { id: eventId } = params; // Récupérer l'ID de l'URL

    const [event, setEvent] = useState<Event | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState<Partial<Event>>({}); // État pour les données du formulaire

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            toast.error("Session invalide. Veuillez vous reconnecter.");
            localStorage.clear();
            router.push('/login');
            return;
        }

        async function fetchEvent() {
            setIsLoading(true);
            try {
                const res = await fetch(`/api/events/${eventId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(errorData.message || 'Événement non trouvé.');
                }
                const data: Event = await res.json();
                setEvent(data);
                // Pré-remplir le formulaire avec les données existantes
                setFormData({
                    title: data.title,
                    description: data.description,
                    date: data.date.substring(0, 16), // Formater la date pour un input datetime-local
                    location: data.location,
                    maxAttendees: data.maxAttendees,
                });
            } catch (e: any) {
                toast.error(e.message || "Impossible de charger les détails de l'événement.");
                router.push('/dashboard'); // Rediriger en cas d'erreur
            } finally {
                setIsLoading(false);
            }
        }
        fetchEvent();
    }, [eventId, router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value === '' ? undefined : Number(value) }));
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        const token = localStorage.getItem('authToken');

        if (!token) {
            toast.error("Session invalide. Veuillez vous reconnecter.");
            localStorage.clear();
            router.push('/login');
            setIsSaving(false);
            return;
        }

        try {
            const response = await fetch(`/api/events/${eventId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    ...formData,
                    // S'assurer que la date est envoyée au format Date pour Prisma
                    date: formData.date ? new Date(formData.date).toISOString() : undefined,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                if (response.status === 401) {
                    toast.error("Session expirée ou non autorisée. Veuillez vous reconnecter.");
                    localStorage.clear();
                    router.push('/login');
                } else if (response.status === 403) {
                    toast.error(errorData.message || "Vous n'êtes pas autorisé à modifier cet événement.");
                } else if (response.status === 404) {
                    toast.error(errorData.message || "Événement non trouvé.");
                } else {
                    throw new Error(errorData.message || 'Échec de la mise à jour de l\'événement.');
                }
                return;
            }

            toast.success('Événement mis à jour avec succès !');
            router.push('/dashboard'); // Rediriger vers le tableau de bord après la mise à jour
        } catch (err: any) {
            console.error('Erreur lors de la mise à jour de l\'événement :', err);
            toast.error(err.message || 'Une erreur est survenue lors de la mise à jour.');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="flex items-center space-x-3">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <p className="text-gray-600 text-lg">Chargement de l'événement...</p>
                </div>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-red-50">
                <p className="text-red-700 text-lg font-semibold">Événement introuvable.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Barre Latérale (Simplifiée pour cette page) */}
            <aside className="w-64 bg-white border-r border-gray-200 flex flex-col fixed h-full">
                <div className="p-6">
                    <Link href="/dashboard" className="text-2xl font-bold text-blue-600">
                        EventConnect
                    </Link>
                </div>
                <nav className="flex-1 px-4 py-2 space-y-2">
                    <Link href="/dashboard" className="flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg">
                        <LayoutDashboard className="mr-3 h-5 w-5" /> Retour au Dashboard
                    </Link>
                </nav>
            </aside>

            {/* Main content */}
            <main className="flex-1 ml-64 p-8">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Modifier l'événement : {event.title}</h1>
                        <p className="text-gray-500 mt-1">Mettez à jour les détails de votre événement.</p>
                    </div>
                    <Link href="/dashboard" className="bg-gray-200 text-gray-700 px-5 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors shadow-sm flex items-center">
                        <ArrowLeft className="mr-2 h-5 w-5" /> Annuler
                    </Link>
                </header>

                <section className="bg-white p-8 rounded-xl shadow-md border border-gray-200">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Titre de l'événement</label>
                            <input
                                type="text"
                                name="title"
                                id="title"
                                value={formData.title || ''}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea
                                name="description"
                                id="description"
                                value={formData.description || ''}
                                onChange={handleChange}
                                rows={4}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            ></textarea>
                        </div>
                        <div>
                            <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date et Heure</label>
                            <input
                                type="datetime-local"
                                name="date"
                                id="date"
                                value={formData.date || ''}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="location" className="block text-sm font-medium text-gray-700">Lieu</label>
                            <input
                                type="text"
                                name="location"
                                id="location"
                                value={formData.location || ''}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="maxAttendees" className="block text-sm font-medium text-gray-700">Capacité maximale</label>
                            <input
                                type="number"
                                name="maxAttendees"
                                id="maxAttendees"
                                value={formData.maxAttendees === undefined ? '' : formData.maxAttendees}
                                onChange={handleNumberChange}
                                min="0"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-sm flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSaving ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                        Sauvegarde...
                                    </>
                                ) : (
                                    <>
                                        <Save className="mr-2 h-5 w-5" /> Enregistrer les modifications
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </section>
            </main>
        </div>
    );
}