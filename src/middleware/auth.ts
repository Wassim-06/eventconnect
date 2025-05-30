// src/middleware/auth.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken'; // Assure-toi d'avoir 'jsonwebtoken' installé (npm install jsonwebtoken)

// Définit une interface pour les informations de l'utilisateur extraites du token
export interface AuthUser {
    userId: string;
    // Ajoute d'autres propriétés si ton token contient le rôle, l'email, etc.
    // email?: string;
    // role?: string;
}

// Adapte cette clé secrète. Elle DOIT correspondre à celle utilisée lors de la génération du token JWT.
// Idéalement, elle devrait être stockée dans une variable d'environnement (.env.local).
const JWT_SECRET = process.env.JWT_SECRET || 'votre_cle_secrete_jwt_tres_longue_et_complexe';

export async function authMiddleware(req: NextRequest) {
    // 1. Récupérer le token depuis les en-têtes (Authorization: Bearer <token>)
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.warn('Authentification requise: Pas de token Bearer.');
        return NextResponse.json({ message: 'Authentification requise.' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];

    try {
        // 2. Vérifier et décoder le token
        // Le type 'any' est utilisé ici car le payload peut varier. Idéalement, définis une interface.
        const decoded = jwt.verify(token, JWT_SECRET) as AuthUser;

        // 3. Stocker les informations de l'utilisateur dans l'objet de requête (à passer aux API Routes)
        // Ceci est une astuce car Next.js 13 Route Handlers ne passent pas directement un objet req modifié.
        // Nous allons renvoyer les informations de l'utilisateur.
        return { userId: decoded.userId /*, ... autres propriétés du token */ };

    } catch (error: any) {
        if (error.name === 'TokenExpiredError') {
            console.warn('Token expiré.');
            return NextResponse.json({ message: 'Token d\'authentification expiré.' }, { status: 401 });
        }
        console.error('Erreur de validation du token JWT:', error);
        return NextResponse.json({ message: 'Token d\'authentification invalide.' }, { status: 401 });
    }
}