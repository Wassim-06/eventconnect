// src/app/dashboard/help/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User } from '../../../generated/prisma'; // Adjusted path
import { toast } from 'react-hot-toast';
import {
    LayoutDashboard,
    Calendar,
    BarChart2,
    Settings,
    LifeBuoy as LifeBuoyIcon, // Renamed to avoid conflict if component was named LifeBuoy
    LogOut,
    HelpCircle, // For FAQ
    Mail,       // For Contact
    BookOpen    // For Documentation
} from 'lucide-react';

export default function HelpPage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

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
        } finally {
            setIsLoading(false);
        }
    }, [router]);

    const handleLogout = () => {
        toast.success("Vous avez été déconnecté.");
        localStorage.clear();
        router.push('/login');
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="flex items-center space-x-3">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <p className="text-gray-600 text-lg">Chargement de l'aide...</p>
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
                    <Link href="/events" className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg">
                        <Calendar className="mr-3 h-5 w-5" /> Mes Événements
                    </Link>
                    <Link href="/dashboard/analytics" className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg">
                        <BarChart2 className="mr-3 h-5 w-5" /> Analytics
                    </Link>
                    <Link href="/dashboard/settings" className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg">
                        <Settings className="mr-3 h-5 w-5" /> Paramètres
                    </Link>
                    <Link href="/dashboard/help" className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg">
                        <LifeBuoyIcon className="mr-3 h-5 w-5" /> Aide & Support
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
            <main className="flex-1 ml-64 p-8">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Aide & Support</h1>
                    <p className="text-gray-500 mt-1">Trouvez des réponses à vos questions et contactez-nous.</p>
                </header>

                <div className="space-y-8">
                    {/* Section FAQ */}
                    <section className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                        <div className="flex items-center mb-4">
                            <HelpCircle className="h-6 w-6 mr-3 text-blue-600" />
                            <h2 className="text-xl font-semibold text-gray-800">Questions Fréquentes (FAQ)</h2>
                        </div>
                        <div className="space-y-3">
                            <details className="group">
                                <summary className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                                    <span className="text-sm font-medium text-gray-700">Comment créer un nouvel événement ?</span>
                                    {/* Icone Chevron (peut être remplacé par lucide-react ChevronDown/Up) */}
                                    <span className="text-gray-500 group-open:rotate-180 transition-transform">▼</span>
                                </summary>
                                <p className="mt-2 px-3 pb-3 text-sm text-gray-600">
                                    Pour créer un nouvel événement, allez sur votre tableau de bord et cliquez sur le bouton "Créer un événement". Suivez ensuite les instructions à l'écran.
                                </p>
                            </details>
                            {/* Ajoutez d'autres FAQs ici */}
                            <details className="group">
                                <summary className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                                    <span className="text-sm font-medium text-gray-700">Où puis-je voir mes statistiques ?</span>
                                    <span className="text-gray-500 group-open:rotate-180 transition-transform">▼</span>
                                </summary>
                                <p className="mt-2 px-3 pb-3 text-sm text-gray-600">
                                    La section "Analytics" de votre tableau de bord vous fournit des statistiques détaillées sur vos événements.
                                </p>
                            </details>
                        </div>
                    </section>

                    {/* Section Contact */}
                    <section className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                        <div className="flex items-center mb-4">
                            <Mail className="h-6 w-6 mr-3 text-green-600" />
                            <h2 className="text-xl font-semibold text-gray-800">Nous Contacter</h2>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">Si vous ne trouvez pas de réponse dans notre FAQ, n'hésitez pas à nous contacter :</p>
                        <a href="mailto:support@eventconnect.com" className="inline-block px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium text-sm">Envoyer un e-mail</a>
                        {/* Vous pourriez ajouter un formulaire de contact ici plus tard */}
                    </section>

                    {/* Section Documentation (Optionnel) */}
                    <section className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                        <div className="flex items-center mb-4">
                            <BookOpen className="h-6 w-6 mr-3 text-purple-600" />
                            <h2 className="text-xl font-semibold text-gray-800">Documentation</h2>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">Consultez notre documentation complète pour en savoir plus sur toutes les fonctionnalités d'EventConnect.</p>
                        <Link href="/docs" className="inline-block px-4 py-2 border border-purple-600 text-purple-600 rounded-md hover:bg-purple-50 font-medium text-sm">
                            Voir la documentation
                        </Link>
                    </section>
                </div>
            </main>
        </div>
    );
}