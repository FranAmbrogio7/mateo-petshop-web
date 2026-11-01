"use client";

import Link from "next/link";

import { cerrarSesion } from "@/app/actions/auth";
import { useSesion } from "@/context/SesionContext";

export default function MenuUsuario() {
    const usuario = useSesion();

    if (!usuario) {
        return (
            <Link
                href="/login"
                className="rounded-full bg-marca px-4 py-1.5 text-sm font-bold text-white transition hover:brightness-110"
            >
                Ingresar
            </Link>
        );
    }

    return (
        <div className="flex items-center gap-2">
            <span className="hidden text-sm text-suave sm:inline">Hola, {usuario.nombre || usuario.username}</span>
            <form action={cerrarSesion}>
                <button
                    type="submit"
                    className="rounded-full border border-borde px-3 py-1.5 text-sm font-semibold text-suave transition hover:text-marca"
                >
                    Salir
                </button>
            </form>
        </div>
    );
}