// src/app/dashboard/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { User } from '../../generated/prisma';
import { toast } from 'react-hot-toast';
import {
    LayoutDashboard, Home, Calendar, BarChart2, Settings, LifeBuoy, LogOut,
    PlusCircle, Users, Ticket, DollarSign, MoreVertical, Edit, Trash2, Eye
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Petite fonction pour générer le nombre d’inscrits par mois (exemple)
function getInscriptionsParMois(events: Event[]) {
    const map: { [mois: string]: number } = {};
    events.forEach(evt => {
        const date = new Date(evt.date);
        const mois = date.toLocaleString('fr-FR', { month: 'short', year: 'numeric' });
        map[mois] = (map[mois] || 0) + (evt.attendees || 0);
    });
    // Convertir en tableau trié par date
    return Object.entries(map).map(([name, inscrits]) => ({ name, inscrits }))
        .sort((a, b) => {
            const [mA, yA] = a.name.split(' ');
            const [mB, yB] = b.name.split(' ');
            return new Date(`01 ${mA} ${yA}`).getTime() - new Date(`01 ${mB} ${yB}`).getTime();
        });
}

interface Event {
    id: string;
    title: string;
    date: string; // string car on fetch du JSON (pense à new Date plus bas)
    location: string;
    attendees: number;
    capacity?: number;
    revenue?: number;
    status: 'À venir' | 'Terminé' | 'Annulé';
    organizer?: { id: string; name: string; email: string };
    // ajoute d'autres champs si besoin
}

export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [events, setEvents] = useState<Event[]>([]);
    const [eventsLoading, setEventsLoading] = useState(true);

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

    // Fetch real events from the API
    useEffect(() => {
        async function fetchEvents() {
            setEventsLoading(true);
            try {
                const res = await fetch('/api/events');
                if (!res.ok) throw new Error('Erreur lors du chargement des événements.');
                const data = await res.json();
                // Statut "À venir", "Terminé", "Annulé" déterminé selon date et currentAttendees/maxAttendees
                const now = new Date();
                setEvents(data.map((evt: any) => {
                    let status: Event["status"] = 'À venir';
                    if (evt.date && new Date(evt.date) < now) status = 'Terminé';
                    // (Facultatif : un champ dans la DB ou une logique d'annulation à ajouter plus tard)
                    return {
                        ...evt,
                        date: evt.date, // string, on parse au besoin plus bas
                        attendees: evt.currentAttendees || 0,
                        capacity: evt.maxAttendees,
                        revenue: 0, // Pas encore géré (tu pourras le faire avec bookings/tickets)
                        status,
                    }
                }));
            } catch (e: any) {
                toast.error(e.message || "Impossible de charger les événements.");
            } finally {
                setEventsLoading(false);
            }
        }
        fetchEvents();
    }, []);

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
                    <p className="text-gray-600 text-lg">Chargement de votre espace...</p>
                </div>
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

    // KPIs dynamiques
    const upcomingEventsCount = events.filter(e => e.status === 'À venir').length;
    const totalAttendees = events.reduce((sum, e) => sum + (e.attendees || 0), 0);
    const totalRevenue = events.reduce((sum, e) => sum + (e.revenue || 0), 0);

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
                    <Link href="/dashboard" className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg">
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
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Bonjour, {user?.name?.split(' ')[0]} !</h1>
                        <p className="text-gray-500 mt-1">Bienvenue sur votre tableau de bord.</p>
                    </div>
                    <Link href="/dashboard/create-event" className="bg-blue-600 text-white px-5 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-sm flex items-center">
                        <PlusCircle className="mr-2 h-5 w-5" /> Créer un événement
                    </Link>
                </header>

                {/* KPIs */}
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard icon={Calendar} title="Événements à venir" value={upcomingEventsCount.toString()} color="blue" />
                    <StatCard icon={Users} title="Participants Total" value={totalAttendees.toLocaleString('fr-FR')} color="purple" />
                    <StatCard icon={Ticket} title="Événements créés" value={events.length.toString()} color="green" />
                    <StatCard icon={DollarSign} title="Revenu Total" value={`${totalRevenue.toLocaleString('fr-FR')} €`} color="yellow" />
                </section>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    {/* Tableau des événements */}
                    <section className="xl:col-span-2 bg-white p-6 rounded-xl shadow-md border border-gray-200">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Aperçu de vos événements</h2>
                        {eventsLoading ? (
                            <div className="py-12 text-center text-gray-500">Chargement des événements...</div>
                        ) : events.length === 0 ? (
                            <div className="py-12 text-center text-gray-400 italic">Aucun événement trouvé.</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3">Événement</th>
                                            <th scope="col" className="px-6 py-3">Date</th>
                                            <th scope="col" className="px-6 py-3">Statut</th>
                                            <th scope="col" className="px-6 py-3">Participants</th>
                                            <th scope="col" className="px-6 py-3">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {events.slice(0, 4).map(event => (
                                            <EventRow key={event.id} event={event} />
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </section>

                    {/* Placeholder graphique */}
                    {/* Graphique des inscriptions par mois */}
                    <section className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Inscriptions par mois</h2>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={getInscriptionsParMois(events)}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis allowDecimals={false} />
                                    <Tooltip />
                                    <Bar dataKey="inscrits" fill="#2563eb" radius={[8, 8, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}

// Mini-composant pour les cartes de statistiques

const StatCard = ({
    icon: Icon,
    title,
    value,
    color,
}: {
    icon: React.ElementType;
    title: string;
    value: string;
    color: StatColor;
}) => {
    const colors: Record<StatColor, string> = {
        blue: 'bg-blue-100 text-blue-800',
        purple: 'bg-purple-100 text-purple-800',
        green: 'bg-green-100 text-green-800',
        yellow: 'bg-yellow-100 text-yellow-800',
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 flex items-center space-x-4">
            <div className={`p-3 rounded-full ${colors[color]}`}>
                <Icon className="h-6 w-6" />
            </div>
            <div>
                <p className="text-sm text-gray-500 font-medium">{title}</p>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
            </div>
        </div>
    );
};

type StatColor = 'blue' | 'purple' | 'green' | 'yellow';

const EventRow = ({ event }: { event: Event }) => {
    const statusClasses = {
        'À venir': 'bg-blue-100 text-blue-800',
        'Terminé': 'bg-gray-100 text-gray-800',
        'Annulé': 'bg-red-100 text-red-800',
    };

    return (
        <tr className="bg-white border-b hover:bg-gray-50">
            <td className="px-6 py-4 font-medium text-gray-900">{event.title}</td>
            <td className="px-6 py-4 text-gray-600">
                {new Date(event.date).toLocaleString('fr-FR', { dateStyle: 'medium', timeStyle: 'short' })}
            </td>
            <td className="px-6 py-4">
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusClasses[event.status]}`}>
                    {event.status}
                </span>
            </td>
            <td className="px-6 py-4 text-gray-600">
                {event.attendees}
                {event.capacity ? ` / ${event.capacity}` : ''}
            </td>
            <td className="px-6 py-4 flex space-x-2">
                <button className="text-gray-500 hover:text-blue-600"><Eye className="h-5 w-5" /></button>
                <button className="text-gray-500 hover:text-green-600"><Edit className="h-5 w-5" /></button>
                <button className="text-gray-500 hover:text-red-600"><Trash2 className="h-5 w-5" /></button>
            </td>
        </tr>
    );
};