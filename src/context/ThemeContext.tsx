"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Tema = "claro" | "oscuro";

type ThemeContextValue = {
    tema: Tema;
    alternarTema: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

const CLAVE = "mateo-tema";

function temaInicial(): Tema {
    // En el servidor no existe document: arranca en claro y el script del layout corrige antes de pintar
    if (typeof document === "undefined") return "claro";
    return document.documentElement.classList.contains("dark") ? "oscuro" : "claro";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [tema, setTema] = useState<Tema>(temaInicial);

    // Cada vez que cambia el tema: actualiza la clase de <html> y lo recuerda en el navegador
    useEffect(() => {
        document.documentElement.classList.toggle("dark", tema === "oscuro");
        try {
            localStorage.setItem(CLAVE, tema);
        } catch {
            // modo incógnito o almacenamiento bloqueado: el tema funciona igual, solo no se recuerda
        }
    }, [tema]);

    const alternarTema = () => setTema((actual) => (actual === "claro" ? "oscuro" : "claro"));

    return <ThemeContext.Provider value={{ tema, alternarTema }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
    const contexto = useContext(ThemeContext);
    if (!contexto) {
        throw new Error("useTheme debe usarse dentro de <ThemeProvider>");
    }
    return contexto;
}