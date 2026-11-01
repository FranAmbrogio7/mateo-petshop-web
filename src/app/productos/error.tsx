"use client"; // Los límites de error tienen que ser Client Components

import { useEffect } from "react";

export default function ErrorProductos({ error, retry }: { error: unknown; retry: () => void }) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-red-300 bg-superficie px-6 py-14 text-center dark:border-red-900">
            <p className="text-4xl" aria-hidden="true">
                😿
            </p>
            <h2 className="text-lg font-bold">No pudimos cargar los productos</h2>
            <p className="max-w-md text-suave">
                La API no respondió. Si es la primera visita del día, el servidor puede tardar cerca de un minuto en
                despertar.
            </p>
            <button
                type="button"
                onClick={() => retry()}
                className="mt-2 rounded-full bg-marca px-6 py-2 font-bold text-white transition hover:brightness-110"
            >
                Reintentar
            </button>
        </div>
    );
}