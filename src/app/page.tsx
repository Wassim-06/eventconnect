// src/app/page.tsx
import Link from 'next/link';
import Image from 'next/image';
// Importation des icônes de lucide-react. Assurez-vous d'avoir installé le paquet.
import { ArrowRight, Ticket, Users, CalendarPlus, BarChart, Mic, Clapperboard, GraduationCap, PartyPopper } from 'lucide-react';

export default function HomePage() {
  return (
    // J'ai opté pour un fond blanc/très clair pour une meilleure lisibilité et un look plus pro/épuré.
    <div className="bg-white text-gray-800">

      {/* ===== Header ===== */}
      {/* Le header est maintenant "sticky" et a un effet de flou pour un look moderne lors du défilement */}
      <header className="sticky top-0 z-50 w-full flex justify-between items-center p-4 md:p-6 max-w-7xl mx-auto bg-white/80 backdrop-blur-lg border-b border-gray-200">
        <Link href="/" className="flex items-center space-x-3">
          <Image
            src="/Logo.png" // Assurez-vous que le chemin est correct
            alt="EventConnect Logo"
            width={220} // Taille ajustée pour un header plus fin
            height={60}
            priority
          />
        </Link>
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="#features" className="text-base font-medium text-gray-600 hover:text-blue-600 transition-colors">
            Fonctionnalités
          </Link>
          <Link href="#use-cases" className="text-base font-medium text-gray-600 hover:text-blue-600 transition-colors">
            Pour qui ?
          </Link>
          <Link href="/login" className="text-base font-medium text-gray-600 hover:text-blue-600 transition-colors">
            Se connecter
          </Link>
          <Link href="/register" className="bg-blue-600 text-white px-5 py-2 rounded-full text-base font-semibold hover:bg-blue-700 transition-colors shadow-sm">
            S'inscrire gratuitement
          </Link>
        </nav>
        {/* Menu burger pour mobile (non fonctionnel ici, juste pour le design) */}
        <div className="md:hidden">
          <button className="text-gray-800">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>
          </button>
        </div>
      </header>

      <main>
        {/* ===== Section Héros ===== */}
        <section className="max-w-7xl mx-auto px-6 py-20 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-center md:text-left">
              <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6 text-gray-900">
                La plateforme tout-en-un pour des événements mémorables.
              </h1>
              <p className="text-lg md:text-xl mb-10 max-w-xl mx-auto md:mx-0 text-gray-600">
                Créez, gérez et promouvez vos événements sans effort. Engagez votre public et analysez vos résultats, le tout au même endroit.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Link href="/register" className="bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-bold hover:bg-blue-700 transition-colors shadow-lg transform hover:scale-105 flex items-center justify-center">
                  Commencer gratuitement <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link href="#features" className="bg-white border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-full text-lg font-bold hover:bg-gray-100 transition-colors shadow-lg transform hover:scale-105">
                  Découvrir les fonctionnalités
                </Link>
              </div>
            </div>
            {/* Placeholder pour une image ou une vidéo du produit */}
            <div className="mt-12 md:mt-0">
              <Image
                src="/Concert.jpg" // Corrected path
                alt="Dashboard EventConnect"
                width={600}
                height={400}
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </section>

        {/* ===== Section Fonctionnalités ("Comment ça marche ?") ===== */}
        <section id="features" className="bg-gray-50 py-20 md:py-28">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Tout ce dont vous avez besoin pour réussir</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-16">De la création de la page à l'analyse post-événement, nous avons pensé à tout.</p>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Feature 1 */}
              <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow text-left">
                <CalendarPlus className="h-10 w-10 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Création Facile</h3>
                <p className="text-gray-600">Lancez la page de votre événement en quelques minutes avec nos modèles personnalisables.</p>
              </div>
              {/* Feature 2 */}
              <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow text-left">
                <Ticket className="h-10 w-10 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Gestion des Billets</h3>
                <p className="text-gray-600">Vendez plusieurs types de billets, offrez des codes promo et suivez les ventes en temps réel.</p>
              </div>
              {/* Feature 3 */}
              <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow text-left">
                <Users className="h-10 w-10 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Engagement du Public</h3>
                <p className="text-gray-600">Interagissez avec vos participants avant, pendant et après l'événement grâce à nos outils de communication.</p>
              </div>
              {/* Feature 4 */}
              <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow text-left">
                <BarChart className="h-10 w-10 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Analyse des Données</h3>
                <p className="text-gray-600">Prenez des décisions éclairées avec des rapports détaillés sur vos ventes et votre audience.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ===== Section Cas d'Usage ("Pour qui ?") ===== */}
        <section id="use-cases" className="py-20 md:py-28">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Conçu pour tous les créateurs d'événements</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">Que vous organisiez un atelier intimiste ou une conférence internationale, EventConnect s'adapte à vos besoins.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Use Case 1 */}
              <div className="border border-gray-200 p-6 rounded-lg text-center">
                <Mic className="h-12 w-12 text-blue-600 mb-4 mx-auto" />
                <h4 className="text-xl font-semibold">Conférences</h4>
                <p className="text-gray-600 mt-2">Gérez les inscriptions, les intervenants et les plannings complexes.</p>
              </div>
              {/* Use Case 2 */}
              <div className="border border-gray-200 p-6 rounded-lg text-center">
                <GraduationCap className="h-12 w-12 text-blue-600 mb-4 mx-auto" />
                <h4 className="text-xl font-semibold">Ateliers & Formations</h4>
                <p className="text-gray-600 mt-2">Limitez le nombre de places, gérez les listes d'attente et communiquez facilement.</p>
              </div>
              {/* Use Case 3 */}
              <div className="border border-gray-200 p-6 rounded-lg text-center">
                <PartyPopper className="h-12 w-12 text-blue-600 mb-4 mx-auto" />
                <h4 className="text-xl font-semibold">Événements Communautaires</h4>
                <p className="text-gray-600 mt-2">Créez des meetups, des lancements de produit ou des soirées networking.</p>
              </div>
              {/* Use Case 4 */}
              <div className="border border-gray-200 p-6 rounded-lg text-center">
                <Clapperboard className="h-12 w-12 text-blue-600 mb-4 mx-auto" />
                <h4 className="text-xl font-semibold">Événements Culturels</h4>
                <p className="text-gray-600 mt-2">Vendez des billets pour des concerts, des spectacles ou des expositions.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ===== Section Témoignages (Preuve Sociale) ===== */}
        <section className="bg-gray-50 py-20 md:py-28">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12">Ils nous font confiance</h2>
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <blockquote className="text-xl text-gray-700 italic">
                "EventConnect a transformé la façon dont nous organisons nos conférences annuelles. La plateforme est intuitive, puissante et le support client est incroyablement réactif. Un gain de temps monumental !"
              </blockquote>
              <div className="mt-8 flex items-center justify-center">
                <Image
                  src="https://i.pravatar.cc/150?u=a042581f4e29026704d" // Placeholder d'avatar
                  alt="Avatar de Marie Dubois"
                  width={60}
                  height={60}
                  className="rounded-full"
                />
                <div className="ml-4 text-left">
                  <p className="font-semibold text-gray-900">Marie Dubois</p>
                  <p className="text-gray-600">Directrice Marketing, Tech Innovate</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== Section CTA (Call to Action) Final ===== */}
        <section className="bg-blue-600 text-white">
          <div className="max-w-7xl mx-auto px-6 py-20 text-center">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-6">Prêt à créer votre prochain événement ?</h2>
            <p className="text-lg md:text-xl mb-10 opacity-90 max-w-2xl mx-auto">Rejoignez des milliers d'organisateurs qui utilisent EventConnect pour créer des expériences inoubliables.</p>
            <Link href="/register" className="bg-white text-blue-600 px-10 py-4 rounded-full text-xl font-bold hover:bg-gray-200 transition-colors shadow-lg transform hover:scale-105 inline-block">
              Lancez-vous gratuitement
            </Link>
          </div>
        </section>

      </main>

      {/* ===== Footer ===== */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center space-x-3">
              <Image
                src="/Logo.png" // Prévoyez une version blanche de votre logo pour les fonds sombres
                alt="EventConnect Logo"
                width={180}
                height={50}
              />
            </Link>
            <p className="text-gray-400 mt-4">&copy; {new Date().getFullYear()} EventConnect. Tous droits réservés.</p>
          </div>
          <div>
            <h5 className="font-semibold tracking-wider uppercase">Produit</h5>
            <nav className="mt-4 flex flex-col space-y-2">
              <Link href="#features" className="text-gray-400 hover:text-white">Fonctionnalités</Link>
              <Link href="/pricing" className="text-gray-400 hover:text-white">Tarifs</Link>
              <Link href="/integrations" className="text-gray-400 hover:text-white">Intégrations</Link>
            </nav>
          </div>
          <div>
            <h5 className="font-semibold tracking-wider uppercase">Entreprise</h5>
            <nav className="mt-4 flex flex-col space-y-2">
              <Link href="/about" className="text-gray-400 hover:text-white">À propos</Link>
              <Link href="/careers" className="text-gray-400 hover:text-white">Carrières</Link>
              <Link href="/contact" className="text-gray-400 hover:text-white">Contact</Link>
            </nav>
          </div>
          <div>
            <h5 className="font-semibold tracking-wider uppercase">Ressources</h5>
            <nav className="mt-4 flex flex-col space-y-2">
              <Link href="/blog" className="text-gray-400 hover:text-white">Blog</Link>
              <Link href="/help" className="text-gray-400 hover:text-white">Centre d'aide</Link>
              <Link href="/partners" className="text-gray-400 hover:text-white">Partenaires</Link>
            </nav>
          </div>
          <div>
            <h5 className="font-semibold tracking-wider uppercase">Légal</h5>
            <nav className="mt-4 flex flex-col space-y-2">
              <Link href="/privacy" className="text-gray-400 hover:text-white">Confidentialité</Link>
              <Link href="/terms" className="text-gray-400 hover:text-white">Conditions</Link>
            </nav>
          </div>
        </div>
      </footer>

    </div>
  );
}