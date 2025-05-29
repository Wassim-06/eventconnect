// src/app/dashboard/settings/page.tsx
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
    Settings as SettingsIcon, // Renamed to avoid conflict if component was named Settings
    LifeBuoy,
    LogOut,
    UserCircle,
    Bell,
    Lock
} from 'lucide-react';

export default function SettingsPage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    // const [error, setError] = useState<string | null>(null); // setError was not used

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
            // setError("Erreur de données utilisateur."); // setError was not used
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
                    <p className="text-gray-600 text-lg">Chargement des paramètres...</p>
                </div>
            </div>
        );
    }

    // if (error) { // error state was not being set in a way that would display this
    //     return (
    //         <div className="min-h-screen flex items-center justify-center bg-red-50">
    //             <p className="text-red-700 text-lg font-semibold">{error}</p>
    //         </div>
    //     );
    // }

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
                    <Link href="/dashboard/settings" className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg">
                        <SettingsIcon className="mr-3 h-5 w-5" /> Paramètres
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
            <main className="flex-1 ml-64 p-8">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Paramètres</h1>
                    <p className="text-gray-500 mt-1">Gérez les paramètres de votre compte et vos préférences.</p>
                </header>

                <div className="space-y-8">
                    {/* Section Profil */}
                    <section className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                        <div className="flex items-center mb-4">
                            <UserCircle className="h-6 w-6 mr-3 text-blue-600" />
                            <h2 className="text-xl font-semibold text-gray-800">Profil</h2>
                        </div>
                        <form className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nom complet</label>
                                <input type="text" name="name" id="name" defaultValue={user?.name || ''} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Adresse e-mail</label>
                                <input type="email" name="email" id="email" defaultValue={user?.email || ''} readOnly className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 sm:text-sm" />
                            </div>
                            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium">Enregistrer les modifications</button>
                        </form>
                    </section>

                    {/* Section Notifications */}
                    <section className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                        <div className="flex items-center mb-4">
                            <Bell className="h-6 w-6 mr-3 text-purple-600" />
                            <h2 className="text-xl font-semibold text-gray-800">Notifications</h2>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-700">Notifications par e-mail</span>
                                <label htmlFor="emailNotifications" className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" id="emailNotifications" className="sr-only peer" defaultChecked />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>
                            {/* Ajoutez d'autres préférences de notification ici */}
                        </div>
                    </section>

                    {/* Section Sécurité */}
                    <section className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                        <div className="flex items-center mb-4">
                            <Lock className="h-6 w-6 mr-3 text-red-600" />
                            <h2 className="text-xl font-semibold text-gray-800">Sécurité</h2>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <button className="w-full text-left px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-sm font-medium">Changer le mot de passe</button>
                            </div>
                            <div>
                                <button className="w-full text-left px-4 py-2 border border-red-300 text-red-600 rounded-md hover:bg-red-50 text-sm font-medium">Supprimer le compte</button>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}