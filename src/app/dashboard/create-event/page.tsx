"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-hot-toast'; // Importez toast
import { LayoutDashboard, ArrowLeft, Save } from 'lucide-react'; // Importez les icônes

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
    const [isLoading, setIsLoading] = useState(false); // Renommé loading en isLoading pour cohérence
    // Suppression des états `error` et `success` au profit de `react-hot-toast`

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
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

    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value === '' ? '' : Number(value) }));
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true); // Utilisez setIsLoading
        // setError(null); // Supprimé
        // setSuccess(null); // Supprimé

        // TODO: En attendant l'implémentation de l'authentification, nous allons utiliser
        // un ID d'organisateur temporaire. REMPLACEZ-LE PAR UN VRAI ID DE VOTRE DB !
        // Idéalement, cet ID devrait venir du token d'authentification de l'utilisateur connecté.
        const tempOrganizerId = "66579b5c2a1a1f337ef117d6"; // <--- ASSUREZ-VOUS QUE C'EST UN ID VALIDE DE VOTRE DB

        // Validation simple
        if (!formData.title || !formData.date || !formData.location || !tempOrganizerId) {
            toast.error("Les champs titre, date, lieu et organisateur sont obligatoires.");
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch('/api/events', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Pour la création, on peut choisir d'envoyer ou non le token.
                    // Si l'API backend exige un token pour la création, décommentez la ligne ci-dessous
                    // 'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                },
                body: JSON.stringify({
                    ...formData,
                    maxAttendees: formData.maxAttendees ? parseInt(formData.maxAttendees, 10) : null,
                    date: new Date(formData.date).toISOString(),
                    organizerId: tempOrganizerId,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Échec de la création de l\'événement.');
            }

            const newEvent = await response.json();
            toast.success('Événement créé avec succès !');
            router.push('/dashboard'); // Rediriger vers le tableau de bord ou la liste des événements
        } catch (err: any) {
            console.error('Erreur lors de la création de l\'événement :', err);
            toast.error(err.message || 'Une erreur est survenue lors de la création de l\'événement.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Barre Latérale */}
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
                        <h1 className="text-3xl font-bold text-gray-900">Créer un Nouvel Événement</h1>
                        <p className="text-gray-500 mt-1">Remplissez les informations pour votre nouvel événement.</p>
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
                                value={formData.title}
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
                                value={formData.description}
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
                                value={formData.date}
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
                                value={formData.location}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">URL de l'image (optionnel)</label>
                            <input
                                type="url"
                                name="imageUrl"
                                id="imageUrl"
                                value={formData.imageUrl}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700">Catégorie (ex: Conférence, Atelier)</label>
                            <input
                                type="text"
                                name="category"
                                id="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="maxAttendees" className="block text-sm font-medium text-gray-700">Capacité maximale (optionnel)</label>
                            <input
                                type="number"
                                name="maxAttendees"
                                id="maxAttendees"
                                value={formData.maxAttendees}
                                onChange={handleNumberChange} // Utiliser handleNumberChange
                                min="0"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="isPublished"
                                name="isPublished"
                                checked={formData.isPublished}
                                onChange={handleChange}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor="isPublished" className="ml-2 block text-sm text-gray-900">Publier l'événement maintenant</label>
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-sm flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                        Création...
                                    </>
                                ) : (
                                    <>
                                        <Save className="mr-2 h-5 w-5" /> Créer l'événement
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