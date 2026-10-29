import "server-only";

import { cookies } from "next/headers";

export type Usuario = {
    id: number;
    username: string;
    email: string;
    nombre: string;
    es_staff: boolean;
};

export const COOKIE_TOKEN = "mateo_token";
const COOKIE_USUARIO = "mateo_usuario";

const opciones = {
    httpOnly: true, // el JavaScript del navegador no puede leerla
    secure: process.env.NODE_ENV === "production", // solo por HTTPS en producción
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 días
};

export async function obtenerToken(): Promise<string | undefined> {
    return (await cookies()).get(COOKIE_TOKEN)?.value;
}

export async function obtenerUsuario(): Promise<Usuario | null> {
    const valor = (await cookies()).get(COOKIE_USUARIO)?.value;
    if (!valor) return null;
    try {
        return JSON.parse(valor) as Usuario;
    } catch {
        return null;
    }
}

/** Solo se puede llamar desde una Server Action o un Route Handler. */
export async function guardarSesion(token: string, usuario: Usuario) {
    const almacen = await cookies();
    almacen.set(COOKIE_TOKEN, token, opciones);
    almacen.set(COOKIE_USUARIO, JSON.stringify(usuario), opciones);
}

/** Solo se puede llamar desde una Server Action o un Route Handler. */
export async function borrarSesion() {
    const almacen = await cookies();
    almacen.delete(COOKIE_TOKEN);
    almacen.delete(COOKIE_USUARIO);
}