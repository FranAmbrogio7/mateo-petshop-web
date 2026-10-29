import type { Metadata } from "next";
import { redirect } from "next/navigation";

import Alerta from "@/components/Alerta";
import { apiFetch, ApiError, mensajeDeError } from "@/lib/api";
import type { Usuario } from "@/lib/sesion";

export const metadata: Metadata = { title: "Mi cuenta" };

export default async function MiCuentaPage() {
    let perfil: Usuario;
    try {
        // Consulta protegida: apiFetch agrega el header Authorization con el token de la cookie
        perfil = await apiFetch<Usuario>("/api/auth/perfil/", { auth: true });
    } catch (error) {
        if (error instanceof ApiError && error.status === 401) {
            redirect("/login?siguiente=/mi-cuenta");
        }
        return <Alerta tipo="error">{mensajeDeError(error)}</Alerta>;
    }

    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-3xl font-extrabold">Hola, {perfil.nombre || perfil.username} 👋</h1>
            <div className="rounded-2xl border border-borde bg-superficie p-6">
                <dl className="grid gap-3 sm:grid-cols-2">
                    <div>
                        <dt className="text-sm text-suave">Usuario</dt>
                        <dd className="font-semibold">{perfil.username}</dd>
                    </div>
                    <div>
                        <dt className="text-sm text-suave">Email</dt>
                        <dd className="font-semibold">{perfil.email}</dd>
                    </div>
                </dl>
            </div>
            <p className="text-suave">Desde el menú podés gestionar tus mascotas y tus turnos.</p>
        </div>
    );
}