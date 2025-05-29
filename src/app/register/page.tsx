// src/app/register/page.tsx
"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import Link from "next/link"; // Importation du composant Link

const formSchema = z.object({
    name: z.string().min(2, "Le nom doit contenir au moins 2 caractères."),
    email: z.string().email("L'adresse email est invalide."),
    password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères."),
});

type FormData = z.infer<typeof formSchema>;

export default function RegisterPage() {
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false); // Nouvel état pour le chargement

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset, // Ajout de la fonction reset pour réinitialiser le formulaire
    } = useForm<FormData>({
        resolver: zodResolver(formSchema),
    });

    const onSubmit = async (data: FormData) => {
        setIsSubmitting(true); // Début de la soumission
        setSuccessMessage(""); // Efface les messages précédents
        setErrorMessage("");   // Efface les messages précédents

        try {
            const res = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const result = await res.json();

            if (res.ok) {
                setSuccessMessage("Compte créé avec succès ! Vous pouvez maintenant vous connecter.");
                reset(); // Réinitialise les champs du formulaire après succès
            } else {
                // Utilise le message d'erreur du backend ou un message générique
                setErrorMessage(result.message || "Une erreur est survenue lors de l'inscription.");
            }
        } catch (err) {
            console.error("Erreur côté client lors de l'inscription :", err);
            setErrorMessage("Erreur de connexion au serveur. Veuillez réessayer.");
        } finally {
            setIsSubmitting(false); // Fin de la soumission
        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md space-y-5 border border-gray-200 transform hover:scale-[1.01] transition-transform duration-200 ease-out"
            >
                <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-6">
                    Rejoignez EventConnect !
                </h1>

                <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1">Nom</label>
                    <input
                        id="name"
                        {...register("name")}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition duration-150 ease-in-out shadow-sm"
                        aria-invalid={errors.name ? "true" : "false"}
                    />
                    {errors.name && (
                        <p role="alert" className="text-red-500 text-xs mt-1 animate-fadeIn">{errors.name.message}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                    <input
                        id="email"
                        {...register("email")}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition duration-150 ease-in-out shadow-sm"
                        type="email"
                        aria-invalid={errors.email ? "true" : "false"}
                    />
                    {errors.email && (
                        <p role="alert" className="text-red-500 text-xs mt-1 animate-fadeIn">{errors.email.message}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1">Mot de passe</label>
                    <input
                        id="password"
                        {...register("password")}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition duration-150 ease-in-out shadow-sm"
                        type="password"
                        aria-invalid={errors.password ? "true" : "false"}
                    />
                    {errors.password && (
                        <p role="alert" className="text-red-500 text-xs mt-1 animate-fadeIn">{errors.password.message}</p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting} // Désactive le bouton pendant la soumission
                    className={`w-full py-3 px-4 rounded-lg font-bold text-white transition-all duration-200 ease-in-out ${isSubmitting
                            ? "bg-blue-300 cursor-not-allowed" // Style quand désactivé
                            : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 active:bg-blue-800"
                        }`}
                >
                    {isSubmitting ? "Inscription en cours..." : "S'inscrire"}
                </button>

                {successMessage && (
                    <p className="text-green-600 font-medium text-center text-sm mt-3 bg-green-50 p-3 rounded-md border border-green-200 animate-fadeIn">{successMessage}</p>
                )}
                {errorMessage && (
                    <p className="text-red-600 font-medium text-center text-sm mt-3 bg-red-50 p-3 rounded-md border border-red-200 animate-fadeIn">{errorMessage}</p>
                )}

                <p className="text-center text-gray-600 text-sm mt-4">
                    Déjà un compte ?{" "}
                    <Link href="/login" className="text-blue-600 hover:text-blue-800 font-semibold transition-colors duration-200">
                        Connectez-vous ici
                    </Link>
                </p>
            </form>
        </main>
    );
}