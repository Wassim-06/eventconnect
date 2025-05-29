// src/app/api/events/[id]/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server'; // <-- AJOUTE CET IMPORT
import { prisma } from '@/lib/prisma';
import { authMiddleware } from '@/middleware/auth';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) { // <-- CHANGE Request EN NextRequest
    try {
        const eventId = params.id;

        const event = await prisma.event.findUnique({
            where: { id: eventId },
            include: { organizer: { select: { id: true, name: true, email: true } } },
        });

        if (!event || !event.isPublished) {
            return NextResponse.json({ message: 'Événement non trouvé ou non publié.' }, { status: 404 });
        }

        return NextResponse.json(event, { status: 200 });
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'événement :', error);
        return NextResponse.json({ message: 'Erreur interne du serveur.' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) { // <-- CHANGE Request EN NextRequest
    const authResult = await authMiddleware(req);
    if (authResult instanceof NextResponse) {
        return authResult;
    }
    const { userId } = authResult;
    const eventId = params.id;

    try {
        const data = await req.json();

        const existingEvent = await prisma.event.findUnique({
            where: { id: eventId },
            select: { organizerId: true }
        });

        if (!existingEvent) {
            return NextResponse.json({ message: 'Événement non trouvé.' }, { status: 404 });
        }

        if (existingEvent.organizerId !== userId) {
            return NextResponse.json({ message: 'Non autorisé à modifier cet événement.' }, { status: 403 });
        }

        const updatedEvent = await prisma.event.update({
            where: { id: eventId },
            data: {
                ...data,
                date: data.date ? new Date(data.date) : undefined,
            },
        });

        return NextResponse.json(updatedEvent, { status: 200 });
    } catch (error: any) {
        if (error.code === 'P2025') {
            return NextResponse.json({ message: 'Événement non trouvé.' }, { status: 404 });
        }
        console.error('Erreur lors de la mise à jour de l\'événement :', error);
        return NextResponse.json({ message: 'Une erreur est survenue lors de la mise à jour de l\'événement.' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) { // <-- CHANGE Request EN NextRequest
    const authResult = await authMiddleware(req);
    if (authResult instanceof NextResponse) {
        return authResult;
    }
    const { userId } = authResult;
    const eventId = params.id;

    try {
        const existingEvent = await prisma.event.findUnique({
            where: { id: eventId },
            select: { organizerId: true }
        });

        if (!existingEvent) {
            return NextResponse.json({ message: 'Événement non trouvé.' }, { status: 404 });
        }

        if (existingEvent.organizerId !== userId) {
            return NextResponse.json({ message: 'Non autorisé à supprimer cet événement.' }, { status: 403 });
        }

        await prisma.event.delete({
            where: { id: eventId },
        });

        return NextResponse.json({ message: 'Événement supprimé avec succès.' }, { status: 204 });
    } catch (error: any) {
        if (error.code === 'P2025') {
            return NextResponse.json({ message: 'Événement non trouvé.' }, { status: 404 });
        }
        console.error('Erreur lors de la suppression de l\'événement :', error);
        return NextResponse.json({ message: 'Une erreur est survenue lors de la suppression de l\'événement.' }, { status: 500 });
    }
}