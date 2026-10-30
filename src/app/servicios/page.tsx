import type { Metadata } from "next";
import Link from "next/link";

import Badge from "@/components/Badge";
import { apiFetch } from "@/lib/api";
import { formatearPrecio } from "@/lib/formato";
import type { Especie, Paginado, Servicio } from "@/lib/tipos";

export const metadata: Metadata = { title: "Servicios" };

export default async function ServiciosPage() {
    const [servicios, especies] = await Promise.all([
        apiFetch<Paginado<Servicio>>("/api/servicios/"),
        apiFetch<Paginado<Especie>>("/api/especies/"),
    ]);
    const nombreEspecie = (id: number) => especies.results.find((e) => e.id === id)?.nombre ?? "";

    return (
        <div className="flex flex-col gap-6">
            <header>
                <h1 className="text-3xl font-extrabold">Servicios de estética</h1>
                <p className="text-suave">Reservá el turno de tu mascota desde tu cuenta.</p>
            </header>

            <div className="grid gap-4 sm:grid-cols-2">
                {servicios.results.map((servicio) => (
                    <article key={servicio.id} className="flex flex-col gap-3 rounded-2xl border border-borde bg-superficie p-6">
                        <div className="flex items-start justify-between gap-4">
                            <h2 className="text-xl font-bold">{servicio.nombre}</h2>
                            <p className="text-xl font-extrabold text-marca">{formatearPrecio(servicio.precio)}</p>
                        </div>
                        {servicio.descripcion && <p className="text-suave">{servicio.descripcion}</p>}
                        <div className="mt-auto flex flex-wrap items-center gap-2">
                            <Badge>⏱ {servicio.duracion_min} min</Badge>
                            {servicio.especies.map((id) => (
                                <Badge key={id} tono="marca">
                                    {nombreEspecie(id)}
                                </Badge>
                            ))}
                        </div>
                    </article>
                ))}
            </div>

            <Link
                href="/mi-cuenta/turnos"
                className="w-fit rounded-full bg-acento px-6 py-3 font-bold text-[#24302e] transition hover:brightness-95"
            >
                Reservar un turno
            </Link>
        </div>
    );
}