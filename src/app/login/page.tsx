import type { Metadata } from "next";
import { redirect } from "next/navigation";

import LoginForm from "@/components/LoginForm";
import { obtenerToken } from "@/lib/sesion";

export const metadata: Metadata = { title: "Ingresar" };

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
    // Si ya hay sesión, no tiene sentido mostrar el login
    if (await obtenerToken()) redirect("/mi-cuenta");

    const { siguiente } = await searchParams;

    return (
        <div className="mx-auto max-w-md rounded-3xl border border-borde bg-superficie p-8">
            <h1 className="text-2xl font-extrabold">Ingresá a tu cuenta</h1>
            <p className="mt-1 mb-6 text-suave">Gestioná tus mascotas y reservá turnos de estética.</p>
            <LoginForm siguiente={typeof siguiente === "string" ? siguiente : undefined} />
            <p className="mt-6 text-center text-sm text-suave">
                Para probar: <strong>cliente_demo</strong> / <strong>demo12345</strong>
            </p>
        </div>
    );
}