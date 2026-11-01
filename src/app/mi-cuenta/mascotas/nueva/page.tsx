import type { Metadata } from "next";

import MascotaForm from "@/components/MascotaForm";
import { apiFetch } from "@/lib/api";
import type { Especie, Paginado } from "@/lib/tipos";

export const metadata: Metadata = { title: "Agregar mascota" };

export default async function NuevaMascotaPage() {
    const especies = await apiFetch<Paginado<Especie>>("/api/especies/");

    return (
        <div className="flex flex-col gap-6">
            <header>
                <h1 className="text-3xl font-extrabold">Agregar mascota</h1>
                <p className="text-suave">Los campos con * son obligatorios.</p>
            </header>
            <div className="rounded-2xl border border-borde bg-superficie p-6">
                <MascotaForm especies={especies.results} />
            </div>
        </div>
    );
}