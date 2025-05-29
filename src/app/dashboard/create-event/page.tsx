// src/app/dashboard/create-event/page.tsx
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CreateEventPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '', // Format string pour l'input date-time-local
        location: '',
        imageUrl: '',
        category: '',
        maxAttendees: '', // Type string pour l'input
        isPublished: false,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        // Gère spécifiquement les cases à cocher (checkbox)
        if (type === 'checkbox') {
            setFormData({
                ...formData,
                [name]: (e.target as HTMLInputElement).checked,
            });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        // TODO: En attendant l'implémentation de l'authentification, nous allons utiliser
        // un ID d'organisateur temporaire. REMPLACEZ-LE PAR UN VRAI ID DE VOTRE DB !
        const tempOrganizerId = "6836d70d02ca5a4a5c91ec56"; // <-- REMPLACE CETTE VALEUR

        // Validation simple
        if (!formData.title || !formData.date || !formData.location || !tempOrganizerId) {
            setError("Les champs titre, date, lieu et organisateur sont obligatoires.");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('/api/events', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    maxAttendees: formData.maxAttendees ? parseInt(formData.maxAttendees, 10) : null,
                    // MongoDB et Prisma attendent une date au format ISO, l'input date-time-local le fournit déjà
                    // mais il faut ajouter le 'Z' pour indiquer l'heure UTC si ce n'est pas le cas pour ta DB
                    date: new Date(formData.date).toISOString(),
                    organizerId: tempOrganizerId, // Utilise l'ID temporaire ici
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Échec de la création de l\'événement.');
            }

            const newEvent = await response.json();
            setSuccess('Événement créé avec succès !');
            // Redirection vers la page de détails de l'événement ou le catalogue
            router.push(`/events/${newEvent.id}`);
            // Ou réinitialiser le formulaire
            // setFormData({ title: '', description: '', date: '', location: '', imageUrl: '', category: '', maxAttendees: '', isPublished: false });

        } catch (err: any) {
            console.error('Erreur lors de la création de l\'événement :', err);
            setError(err.message || 'Une erreur est survenue lors de la création de l\'événement.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
            <nav className="bg-white shadow-sm py-4 px-6 w-full max-w-4xl rounded-lg mb-8 flex justify-between items-center">
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
                </div>
            </nav>

            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-xl">
                <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Créer un Nouvel Événement</h1>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                        <strong className="font-bold">Erreur :</strong>
                        <span className="block sm:inline"> {error}</span>
                    </div>
                )}

                {success && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
                        <strong className="font-bold">Succès !</strong>
                        <span className="block sm:inline"> {success}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">Titre de l'événement</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={4}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        ></textarea>
                    </div>
                    <div>
                        <label htmlFor="date" className="block text-gray-700 text-sm font-bold mb-2">Date et Heure</label>
                        <input
                            type="datetime-local"
                            id="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            required
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div>
                        <label htmlFor="location" className="block text-gray-700 text-sm font-bold mb-2">Lieu</label>
                        <input
                            type="text"
                            id="location"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            required
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div>
                        <label htmlFor="imageUrl" className="block text-gray-700 text-sm font-bold mb-2">URL de l'image (optionnel)</label>
                        <input
                            type="url"
                            id="imageUrl"
                            name="imageUrl"
                            value={formData.imageUrl}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div>
                        <label htmlFor="category" className="block text-gray-700 text-sm font-bold mb-2">Catégorie (ex: Conférence, Atelier)</label>
                        <input
                            type="text"
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div>
                        <label htmlFor="maxAttendees" className="block text-gray-700 text-sm font-bold mb-2">Nombre Max de Participants (optionnel)</label>
                        <input
                            type="number"
                            id="maxAttendees"
                            name="maxAttendees"
                            value={formData.maxAttendees}
                            onChange={handleChange}
                            min="1"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="isPublished"
                            name="isPublished"
                            checked={formData.isPublished}
                            onChange={handleChange}
                            className="mr-2 leading-tight"
                        />
                        <label htmlFor="isPublished" className="text-sm text-gray-700">Publier l'événement maintenant</label>
                    </div>
                    <div className="flex items-center justify-between">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-200 disabled:bg-gray-400"
                        >
                            {loading ? 'Création en cours...' : 'Créer l\'événement'}
                        </button>
                    </div>
                </form>
            </div>
            {/* Pied de page */}
            <footer className="w-full max-w-4xl text-center text-gray-500 text-sm mt-8 py-4">
                &copy; {new Date().getFullYear()} EventConnect. Tous droits réservés.
            </footer>
        </div>
    );
}