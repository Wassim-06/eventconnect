// src/app/layout.tsx
import type { Metadata } from "next";
// Changez ces imports
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import "./globals.css";
import { AuthProvider } from '@/hooks/useAuth';
import { Toaster } from 'react-hot-toast';

// Plus besoin d'appeler Geist ou Geist_Mono avec des sous-objets
// Utilisez directement les exports nommés des polices
const geistSans = GeistSans;
const geistMono = GeistMono;

export const metadata: Metadata = {
  title: "EventConnect - Votre portail d'événements",
  description: "Découvrez, Créez, Connectez - Votre plateforme tout-en-un pour trouver et organiser des événements inoubliables.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${geistSans.variable} ${geistMono.variable}`}> {/* Applique les variables CSS des polices ici */}
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`} // Si tu veux aussi les appliquer au body (souvent fait sur le HTML seulement)
      >
        <AuthProvider>
          {children}
        </AuthProvider>
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}