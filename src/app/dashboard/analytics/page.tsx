// src/app/dashboard/analytics/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User } from '../../../generated/prisma'; // Adjusted path
import { toast } from 'react-hot-toast';
import {
    LayoutDashboard,
    Calendar,
    BarChart2 as BarChart2Icon, // Renamed to avoid conflict if component was named BarChart2
    Settings,
    LifeBuoy,
    LogOut,
    Users,        // Example icon for analytics section
    TrendingUp,   // Example icon for analytics section
    Activity      // Example icon for analytics section
} from 'lucide-react';

export default function AnalyticsPage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    // const [analyticsData, setAnalyticsData] = useState<any>(null); // Placeholder for actual data
    // const [isAnalyticsLoading, setIsAnalyticsLoading] = useState(true); // Placeholder

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

        // Placeholder: Fetch analytics data
        // async function fetchAnalytics() {
        //     try {
        //         // const response = await fetch('/api/analytics');
        //         // const data = await response.json();
        //         // setAnalyticsData(data);
        //         setTimeout(() => setIsAnalyticsLoading(false), 1000); // Simulate API call
        //     } catch (error) {
        //         toast.error("Erreur lors du chargement des données d'analyse.");
        //         setIsAnalyticsLoading(false);
        //     }
        // }
        // fetchAnalytics();

    }, [router]);

    const handleLogout = () => {
        toast.success("Vous avez été déconnecté.");
        localStorage.clear();
        router.push('/login');
    };

    if (isLoading) { // || isAnalyticsLoading) { // Add isAnalyticsLoading if fetching data
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="flex items-center space-x-3">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <p className="text-gray-600 text-lg">Chargement des analyses...</p>
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
                    <Link href="/dashboard/analytics" className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg">
                        <BarChart2Icon className="mr-3 h-5 w-5" /> Analytics
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
            <main className="flex-1 ml-64 p-8">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
                    <p className="text-gray-500 mt-1">Visualisez les performances et les tendances de vos événements.</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {/* Placeholder Stat Cards */}
                    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 flex items-center space-x-4">
                        <div className="p-3 bg-blue-100 rounded-full">
                            <Users className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Participants Total</p>
                            <p className="text-2xl font-semibold text-gray-800">1,234</p>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 flex items-center space-x-4">
                        <div className="p-3 bg-green-100 rounded-full">
                            <TrendingUp className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Taux d'Engagement</p>
                            <p className="text-2xl font-semibold text-gray-800">75%</p>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 flex items-center space-x-4">
                        <div className="p-3 bg-purple-100 rounded-full">
                            <Activity className="h-6 w-6 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Événements Actifs</p>
                            <p className="text-2xl font-semibold text-gray-800">12</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Performance des Événements (Placeholder)</h2>
                    <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                        <p className="text-gray-400">Graphique de données à venir...</p>
                    </div>
                </div>
                {/* Ajoutez d'autres sections d'analyse ici */}
            </main>
        </div>
    );
}