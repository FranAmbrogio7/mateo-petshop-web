import "server-only";

import { obtenerToken } from "@/lib/sesion";

const API_URL = process.env.API_URL;

/** Error de la API con su código HTTP y el cuerpo que devolvió Django. */
export class ApiError extends Error {
    status: number;
    datos: unknown;

    constructor(status: number, datos: unknown) {
        super(`La API respondió ${status}`);
        this.status = status;
        this.datos = datos;
    }
}

type Opciones = {
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    body?: unknown;
    /** true: manda el token de la sesión en el header Authorization */
    auth?: boolean;
};

/**
 * Llama a la API de Django desde el servidor de Next.
 * Arma la URL, manda JSON, agrega el token si hace falta y lanza ApiError si la respuesta no es 2xx.
 */
export async function apiFetch<T>(ruta: string, { method = "GET", body, auth = false }: Opciones = {}): Promise<T> {
    if (!API_URL) {
        throw new Error("Falta la variable de entorno API_URL");
    }

    const headers: Record<string, string> = { Accept: "application/json" };
    if (body !== undefined) headers["Content-Type"] = "application/json";
    if (auth) {
        const token = await obtenerToken();
        if (token) headers.Authorization = `Token ${token}`;
    }

    const respuesta = await fetch(`${API_URL}${ruta}`, {
        method,
        headers,
        body: body !== undefined ? JSON.stringify(body) : undefined,
        cache: "no-store",
    });

    // 204 No Content (logout, borrar): no hay cuerpo para leer
    const datos = respuesta.status === 204 ? null : await respuesta.json().catch(() => null);

    if (!respuesta.ok) {
        throw new ApiError(respuesta.status, datos);
    }
    return datos as T;
}

/** Convierte el cuerpo de error de DRF en un mensaje legible para el usuario. */
export function mensajeDeError(error: unknown): string {
    if (error instanceof ApiError) {
        const datos = error.datos as Record<string, unknown> | null;
        if (datos && typeof datos === "object") {
            if (typeof datos.detail === "string") return datos.detail;
            const primero = Object.values(datos)[0];
            if (Array.isArray(primero) && typeof primero[0] === "string") return primero[0];
            if (typeof primero === "string") return primero;
        }
        return `Error ${error.status} al comunicarse con la API.`;
    }
    return "No se pudo conectar con la API. Probá de nuevo en unos segundos.";
}