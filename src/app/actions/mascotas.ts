"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { apiFetch, ApiError, mensajeDeError } from "@/lib/api";
import { aPayloadMascota, mascotaSchema, type MascotaDatos } from "@/lib/schemas";

export type ResultadoMascota = {
    error?: string;
    /** Errores por campo que devolvió la API, para mostrarlos debajo de cada input */
    campos?: Partial<Record<keyof MascotaDatos, string>>;
};

/** Transforma {"nombre": ["mensaje"]} de DRF en {"nombre": "mensaje"}. */
function erroresDeCampos(error: unknown): ResultadoMascota {
    if (error instanceof ApiError && error.status === 400 && error.datos && typeof error.datos === "object") {
        const campos: ResultadoMascota["campos"] = {};
        for (const [campo, mensajes] of Object.entries(error.datos as Record<string, unknown>)) {
            if (Array.isArray(mensajes) && campo in mascotaSchema.shape) {
                campos[campo as keyof MascotaDatos] = String(mensajes[0]);
            }
        }
        if (Object.keys(campos).length > 0) return { campos };
    }
    if (error instanceof ApiError && error.status === 401) {
        return { error: "Tu sesión venció. Volvé a ingresar." };
    }
    return { error: mensajeDeError(error) };
}

export async function crearMascota(datos: MascotaDatos): Promise<ResultadoMascota> {
    const validacion = mascotaSchema.safeParse(datos);
    if (!validacion.success) return { error: "Revisá los datos del formulario." };

    try {
        await apiFetch("/api/mascotas/", { method: "POST", body: aPayloadMascota(validacion.data), auth: true });
    } catch (error) {
        return erroresDeCampos(error);
    }
    revalidatePath("/mi-cuenta/mascotas");
    redirect("/mi-cuenta/mascotas?ok=creada");
}

export async function editarMascota(id: number, datos: MascotaDatos): Promise<ResultadoMascota> {
    const validacion = mascotaSchema.safeParse(datos);
    if (!validacion.success) return { error: "Revisá los datos del formulario." };

    try {
        await apiFetch(`/api/mascotas/${id}/`, { method: "PUT", body: aPayloadMascota(validacion.data), auth: true });
    } catch (error) {
        return erroresDeCampos(error);
    }
    revalidatePath("/mi-cuenta/mascotas");
    redirect("/mi-cuenta/mascotas?ok=editada");
}

export async function borrarMascota(id: number): Promise<{ error?: string }> {
    try {
        await apiFetch(`/api/mascotas/${id}/`, { method: "DELETE", auth: true });
    } catch (error) {
        return { error: mensajeDeError(error) };
    }
    revalidatePath("/mi-cuenta/mascotas");
    return {};
}