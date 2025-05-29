// src/app/api/profile/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authMiddleware } from '@/middleware/auth';

// GET /api/profile
// Permet à l'utilisateur connecté de récupérer ses propres informations de profil
export async function GET(req: NextRequest) {
    const authResult = await authMiddleware(req);
    if (authResult instanceof NextResponse) {
        return authResult; // Non autorisé ou erreur
    }
    const { userId } = authResult;

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, name: true, email: true, createdAt: true }, // Sélectionne les champs que tu veux exposer
        });

        if (!user) {
            return NextResponse.json({ message: 'Utilisateur non trouvé.' }, { status: 404 });
        }

        return NextResponse.json(user, { status: 200 });
    } catch (error) {
        console.error('Erreur lors de la récupération du profil utilisateur :', error);
        return NextResponse.json({ message: 'Erreur interne du serveur lors de la récupération du profil.' }, { status: 500 });
    }
}

// PUT /api/profile
// Permet à l'utilisateur connecté de mettre à jour ses propres informations de profil
export async function PUT(req: NextRequest) {
    const authResult = await authMiddleware(req);
    if (authResult instanceof NextResponse) {
        return authResult; // Non autorisé ou erreur
    }
    const { userId } = authResult;

    try {
        const data = await req.json();
        // Filtrer les champs que l'utilisateur est autorisé à modifier
        const { name, email } = data; // Par exemple, permettre de modifier le nom et l'email

        // Préparer les données pour la mise à jour, en s'assurant qu'elles sont définies
        const updateData: { name?: string; email?: string } = {};
        if (name !== undefined) updateData.name = name;
        if (email !== undefined) updateData.email = email;

        // Si aucune donnée valide n'est fournie pour la mise à jour
        if (Object.keys(updateData).length === 0) {
            return NextResponse.json({ message: 'Aucune donnée valide fournie pour la mise à jour.' }, { status: 400 });
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: updateData,
            select: { id: true, name: true, email: true, createdAt: true },
        });

        return NextResponse.json(updatedUser, { status: 200 });
    } catch (error: any) {
        console.error('Erreur lors de la mise à jour du profil utilisateur :', error);
        if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
            return NextResponse.json({ message: 'Cet email est déjà utilisé par un autre compte.' }, { status: 409 });
        }
        return NextResponse.json({ message: 'Erreur interne du serveur lors de la mise à jour du profil.' }, { status: 500 });
    }
}