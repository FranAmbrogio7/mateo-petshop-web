"use client";

import { useState, useTransition } from "react";

import { borrarMascota } from "@/app/actions/mascotas";

export default function BotonBorrarMascota({ id, nombre }: { id: number; nombre: string }) {
    const [confirmando, setConfirmando] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [borrando, startTransition] = useTransition();

    const confirmar = () => {
        startTransition(async () => {
            const resultado = await borrarMascota(id);
            if (resultado.error) {
                setError(resultado.error);
                setConfirmando(false);
            }
        });
    };

    if (!confirmando) {
        return (
            <div className="flex flex-col gap-1">
                <button
                    type="button"
                    onClick={() => {
                        setError(null);
                        setConfirmando(true);
                    }}
                    className="rounded-full border border-red-300 px-4 py-1.5 text-sm font-semibold text-red-700 transition hover:bg-red-50 dark:border-red-900 dark:text-red-300 dark:hover:bg-red-950/40"
                >
                    Borrar
                </button>
                {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}
            </div>
        );
    }

    return (
        <div className="flex flex-wrap items-center gap-2 text-sm" role="group" aria-label={`Confirmar borrado de ${nombre}`}>
            <span className="font-semibold">¿Borrar a {nombre}?</span>
            <button
                type="button"
                onClick={confirmar}
                disabled={borrando}
                className="rounded-full bg-red-600 px-3 py-1.5 font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
            >
                {borrando ? "Borrando…" : "Sí, borrar"}
            </button>
            <button
                type="button"
                onClick={() => setConfirmando(false)}
                disabled={borrando}
                className="rounded-full border border-borde px-3 py-1.5 font-semibold"
            >
                No
            </button>
        </div>
    );
}