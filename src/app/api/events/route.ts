// src/app/api/events/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server'; // <-- AJOUTE CET IMPORT
import { prisma } from '@/lib/prisma';
import { authMiddleware } from '@/middleware/auth';

export async function GET(req: NextRequest) { // <-- CHANGE Request EN NextRequest
    const events = await prisma.event.findMany({
        where: { isPublished: true },
        include: { organizer: { select: { id: true, name: true, email: true } } },
    });
    return NextResponse.json(events);
}

export async function POST(req: NextRequest) { // <-- CHANGE Request EN NextRequest
    const authResult = await authMiddleware(req);
    if (authResult instanceof NextResponse) {
        return authResult;
    }
    const { userId } = authResult;

    try {
        const { title, description, date, location, imageUrl, category, maxAttendees, isPublished } = await req.json();

        if (!title || !date || !location) {
            return NextResponse.json({ message: 'Titre, date et lieu sont obligatoires.' }, { status: 400 });
        }

        const newEvent = await prisma.event.create({
            data: {
                title,
                description,
                date: new Date(date),
                location,
                imageUrl,
                category,
                organizer: { connect: { id: userId } },
                maxAttendees: maxAttendees ? parseInt(maxAttendees, 10) : undefined,
                isPublished: isPublished ?? false,
            },
        });

        return NextResponse.json(newEvent, { status: 201 });
    } catch (error) {
        console.error('Erreur lors de la création de l\'événement :', error);
        return NextResponse.json({ message: 'Une erreur est survenue lors de la création de l\'événement.' }, { status: 500 });
    }
}