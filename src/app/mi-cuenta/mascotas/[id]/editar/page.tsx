import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import MascotaForm from "@/components/MascotaForm";
import { apiFetch, ApiError } from "@/lib/api";
import type { Especie, MascotaDetalle, Paginado } from "@/lib/tipos";

export const metadata: Metadata = { title: "Editar mascota" };

export default async function EditarMascotaPage({ params }: PageProps<"/mi-cuenta/mascotas/[id]/editar">) {
    const { id } = await params;
    if (!/^\d+$/.test(id)) notFound();

    let mascota: MascotaDetalle;
    try {
        // La API solo devuelve mascotas del usuario logueado: una ajena da 404
        mascota = await apiFetch<MascotaDetalle>(`/api/mascotas/${id}/`, { auth: true });
    } catch (error) {
        if (error instanceof ApiError && error.status === 404) notFound();
        if (error instanceof ApiError && error.status === 401) redirect("/login");
        throw error;
    }
    const especies = await apiFetch<Paginado<Especie>>("/api/especies/");

    return (
        <div className="flex flex-col gap-6">
            <header>
                <h1 className="text-3xl font-extrabold">Editar a {mascota.nombre}</h1>
                <p className="text-suave">Los campos con * son obligatorios.</p>
            </header>
            <div className="rounded-2xl border border-borde bg-superficie p-6">
                <MascotaForm
                    especies={especies.results}
                    mascotaId={mascota.id}
                    valoresIniciales={{
                        nombre: mascota.nombre,
                        especie: String(mascota.especie),
                        raza: mascota.raza,
                        fecha_nacimiento: mascota.fecha_nacimiento ?? "",
                        peso_kg: mascota.peso_kg ? String(Number(mascota.peso_kg)) : "",
                        observaciones: mascota.observaciones,
                    }}
                />
            </div>
        </div>
    );
}