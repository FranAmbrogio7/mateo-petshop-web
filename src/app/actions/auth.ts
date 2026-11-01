"use server";

import { redirect } from "next/navigation";

import { apiFetch, ApiError, mensajeDeError } from "@/lib/api";
import { loginSchema, type LoginDatos } from "@/lib/schemas";
import { borrarSesion, guardarSesion, type Usuario } from "@/lib/sesion";

export type ResultadoLogin = { error: string } | undefined;

export async function iniciarSesion(datos: LoginDatos, siguiente?: string): Promise<ResultadoLogin> {
    // Se valida otra vez en el servidor: nunca se confía solo en la validación del navegador
    const validacion = loginSchema.safeParse(datos);
    if (!validacion.success) {
        return { error: "Revisá los datos del formulario." };
    }

    try {
        const respuesta = await apiFetch<{ token: string; usuario: Usuario }>("/api/auth/login/", {
            method: "POST",
            body: validacion.data,
        });
        await guardarSesion(respuesta.token, respuesta.usuario);
    } catch (error) {
        if (error instanceof ApiError && error.status === 400) {
            return { error: "Usuario o contraseña incorrectos." };
        }
        return { error: mensajeDeError(error) };
    }

    // Solo se aceptan rutas internas, para no redirigir a otro sitio
    const destino = siguiente?.startsWith("/") && !siguiente.startsWith("//") ? siguiente : "/mi-cuenta";
    redirect(destino);
}

export async function cerrarSesion() {
    try {
        await apiFetch("/api/auth/logout/", { method: "POST", auth: true });
    } catch {
        // aunque la API falle (token vencido, sin conexión), la sesión local se cierra igual
    }
    await borrarSesion();
    redirect("/");
}