import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
        return NextResponse.json({ message: "Champs manquants" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        return NextResponse.json({ message: "Email ou mot de passe incorrect" }, { status: 401 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        return NextResponse.json({ message: "Email ou mot de passe incorrect" }, { status: 401 });
    }

    return NextResponse.json({ message: "Connexion réussie", user: { id: user.id, name: user.name, email: user.email } }, { status: 200 });
}
