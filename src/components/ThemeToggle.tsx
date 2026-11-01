"use client";

import { useTheme } from "@/context/ThemeContext";

export default function ThemeToggle() {
    const { alternarTema } = useTheme();

    // El ícono lo decide el CSS (clase dark en <html>), no el estado:
    // así el HTML del servidor y el del navegador coinciden y no hay parpadeo.
    return (
        <button
            type="button"
            onClick={alternarTema}
            aria-label="Cambiar entre tema claro y oscuro"
            title="Cambiar tema"
            className="rounded-full border border-borde p-2 text-lg leading-none transition hover:bg-fondo"
        >
            <span className="dark:hidden">🌙</span>
            <span className="hidden dark:inline">☀️</span>
        </button>
    );
}