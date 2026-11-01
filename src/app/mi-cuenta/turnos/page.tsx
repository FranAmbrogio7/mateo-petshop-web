import type { Metadata } from "next";
import { redirect } from "next/navigation";

import EstadoVacio from "@/components/EstadoVacio";
import TurnoCard from "@/components/TurnoCard";
import TurnoForm from "@/components/TurnoForm";
import { apiFetch, ApiError } from "@/lib/api";
import type { Mascota, Paginado, Servicio, Turno } from "@/lib/tipos";

export const metadata: Metadata = { title: "Mis turnos" };

export default async function TurnosPage() {
    let turnos: Paginado<Turno>;
    let mascotas: Paginado<Mascota>;
    let servicios: Paginado<Servicio>;
    try {
        [turnos, mascotas, servicios] = await Promise.all([
            apiFetch<Paginado<Turno>>("/api/turnos/?ordering=fecha_hora", { auth: true }),
            apiFetch<Paginado<Mascota>>("/api/mascotas/", { auth: true }),
            apiFetch<Paginado<Servicio>>("/api/servicios/"),
        ]);
    } catch (error) {
        if (error instanceof ApiError && error.status === 401) redirect("/login?siguiente=/mi-cuenta/turnos");
        throw error;
    }

    const proximos = turnos.results.filter((t) => t.estado === "pendiente" || t.estado === "confirmado");
    const historial = turnos.results.filter((t) => t.estado === "realizado" || t.estado === "cancelado").reverse();

    return (
        <div className="flex flex-col gap-8">
            <header>
                <h1 className="text-3xl font-extrabold">Mis turnos</h1>
                <p className="text-suave">Reservá y gestioná los turnos de estética de tus mascotas.</p>
            </header>

            <section className="rounded-2xl border border-borde bg-superficie p-6">
                <h2 className="mb-4 text-xl font-bold">Reservar un turno</h2>
                {mascotas.results.length === 0 ? (
                    <EstadoVacio
                        emoji="🐶"
                        titulo="Primero agregá una mascota"
                        texto="Para reservar un turno necesitás tener al menos una mascota registrada."
                        enlace={{ href: "/mi-cuenta/mascotas/nueva", texto: "Agregar mascota" }}
                    />
                ) : (
                    <TurnoForm mascotas={mascotas.results} servicios={servicios.results} />
                )}
            </section>

            <section className="flex flex-col gap-3">
                <h2 className="text-xl font-bold">Próximos turnos</h2>
                {proximos.length === 0 ? (
                    <EstadoVacio emoji="📅" titulo="No tenés turnos próximos" />
                ) : (
                    proximos.map((turno) => <TurnoCard key={turno.id} turno={turno} />)
                )}
            </section>

            {historial.length > 0 && (
                <section className="flex flex-col gap-3">
                    <h2 className="text-xl font-bold">Historial</h2>
                    {historial.map((turno) => (
                        <TurnoCard key={turno.id} turno={turno} />
                    ))}
                </section>
            )}
        </div>
    );
}