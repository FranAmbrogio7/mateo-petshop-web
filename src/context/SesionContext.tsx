"use client";

import { createContext, useContext } from "react";

export type UsuarioSesion = {
    id: number;
    username: string;
    nombre: string;
    es_staff: boolean;
};

const SesionContext = createContext<UsuarioSesion | null>(null);

/** El layout (Server Component) lee la cookie y le pasa el usuario a los componentes cliente. */
export function SesionProvider({ usuario, children }: { usuario: UsuarioSesion | null; children: React.ReactNode }) {
    return <SesionContext.Provider value={usuario}>{children}</SesionContext.Provider>;
}

/** Devuelve el usuario logueado o null si no hay sesión. */
export function useSesion() {
    return useContext(SesionContext);
}