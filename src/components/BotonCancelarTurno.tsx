"use client";

import { useState, useTransition } from "react";

import { cancelarTurno } from "@/app/actions/turnos";

export default function BotonCancelarTurno({ id }: { id: number }) {
    const [error, setError] = useState<string | null>(null);
    const [cancelando, startTransition] = useTransition();

    const cancelar = () => {
        startTransition(async () => {
            const resultado = await cancelarTurno(id);
            if (resultado.error) setError(resultado.error);
        });
    };

    return (
        <div className="flex flex-col items-end gap-1">
            <button
                type="button"
                onClick={cancelar}
                disabled={cancelando}
                className="rounded-full border border-red-300 px-4 py-1.5 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:opacity-60 dark:border-red-900 dark:text-red-300 dark:hover:bg-red-950/40"
            >
                {cancelando ? "Cancelando…" : "Cancelar turno"}
            </button>
            {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}
        </div>
    );
}