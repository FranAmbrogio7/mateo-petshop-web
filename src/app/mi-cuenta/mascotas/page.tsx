import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import Alerta from "@/components/Alerta";
import EstadoVacio from "@/components/EstadoVacio";
import MascotaCard from "@/components/MascotaCard";
import { apiFetch, ApiError } from "@/lib/api";
import type { Mascota, Paginado } from "@/lib/tipos";

export const metadata: Metadata = { title: "Mis mascotas" };

const MENSAJES: Record<string, string> = {
    creada: "Mascota agregada correctamente.",
    editada: "Cambios guardados.",
};

export default async function MascotasPage({ searchParams }: PageProps<"/mi-cuenta/mascotas">) {
    const { ok } = await searchParams;

    let mascotas: Paginado<Mascota>;
    try {
        mascotas = await apiFetch<Paginado<Mascota>>("/api/mascotas/", { auth: true });
    } catch (error) {
        if (error instanceof ApiError && error.status === 401) redirect("/login?siguiente=/mi-cuenta/mascotas");
        throw error; // lo atrapa error.tsx de /mi-cuenta
    }

    return (
        <div className="flex flex-col gap-6">
            <header className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-3xl font-extrabold">Mis mascotas</h1>
                    <p className="text-suave">
                        {mascotas.count} {mascotas.count === 1 ? "mascota registrada" : "mascotas registradas"}
                    </p>
                </div>
                <Link
                    href="/mi-cuenta/mascotas/nueva"
                    className="rounded-full bg-marca px-5 py-2.5 font-bold text-white transition hover:brightness-110"
                >
                    + Agregar mascota
                </Link>
            </header>

            {typeof ok === "string" && MENSAJES[ok] && <Alerta tipo="exito">{MENSAJES[ok]}</Alerta>}

            {mascotas.results.length === 0 ? (
                <EstadoVacio
                    emoji="🐶"
                    titulo="Todavía no registraste mascotas"
                    texto="Agregá a tu mascota para poder reservarle turnos de estética."
                    enlace={{ href: "/mi-cuenta/mascotas/nueva", texto: "Agregar mi primera mascota" }}
                />
            ) : (
                <div className="grid gap-4 lg:grid-cols-2">
                    {mascotas.results.map((mascota) => (
                        <MascotaCard key={mascota.id} mascota={mascota} />
                    ))}
                </div>
            )}
        </div>
    );
}