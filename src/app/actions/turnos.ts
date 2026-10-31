"use server";

import { revalidatePath } from "next/cache";

import { apiFetch, ApiError, mensajeDeError } from "@/lib/api";
import { aFechaHoraISO, turnoSchema, type TurnoDatos } from "@/lib/schemas";

export type ResultadoTurno = {
    ok?: boolean;
    error?: string;
    campos?: Partial<Record<keyof TurnoDatos, string>>;
};

export async function reservarTurno(datos: TurnoDatos): Promise<ResultadoTurno> {
    const validacion = turnoSchema.safeParse(datos);
    if (!validacion.success) return { error: "Revisá los datos del formulario." };
    const { mascota, servicio, fecha, hora, notas } = validacion.data;

    try {
        await apiFetch("/api/turnos/", {
            method: "POST",
            auth: true,
            body: {
                mascota: Number(mascota),
                servicio: Number(servicio),
                fecha_hora: aFechaHoraISO(fecha, hora),
                notas,
            },
        });
    } catch (error) {
        // La API valida que el servicio aplique a la especie, que la mascota sea tuya y que no haya otro turno a esa hora
        if (error instanceof ApiError && error.status === 400 && error.datos && typeof error.datos === "object") {
            const datosError = error.datos as Record<string, string[]>;
            const campos: ResultadoTurno["campos"] = {};
            if (datosError.servicio) campos.servicio = datosError.servicio[0];
            if (datosError.mascota) campos.mascota = datosError.mascota[0];
            if (datosError.fecha_hora) campos.fecha = datosError.fecha_hora[0];
            if (datosError.non_field_errors) {
                return { error: "Esa mascota ya tiene un turno en ese horario. Elegí otro." };
            }
            if (Object.keys(campos).length > 0) return { campos };
        }
        return { error: mensajeDeError(error) };
    }

    revalidatePath("/mi-cuenta/turnos");
    return { ok: true };
}

export async function cancelarTurno(id: number): Promise<{ error?: string }> {
    try {
        // Acción personalizada del back (@action cambiar-estado): el cliente solo puede cancelar
        await apiFetch(`/api/turnos/${id}/cambiar-estado/`, {
            method: "POST",
            auth: true,
            body: { estado: "cancelado" },
        });
    } catch (error) {
        return { error: mensajeDeError(error) };
    }
    revalidatePath("/mi-cuenta/turnos");
    return {};
}