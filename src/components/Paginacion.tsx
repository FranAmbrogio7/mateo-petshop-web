import Link from "next/link";

import { construirQuery, type Filtros } from "@/lib/formato";

type Props = {
    ruta: string;
    filtros: Filtros;
    paginaActual: number;
    totalPaginas: number;
};

export default function Paginacion({ ruta, filtros, paginaActual, totalPaginas }: Props) {
    if (totalPaginas <= 1) return null;

    const enlace = (pagina: number) => `${ruta}${construirQuery(filtros, { page: pagina > 1 ? String(pagina) : undefined })}`;
    const estilo = "rounded-full border border-borde px-4 py-2 text-sm font-semibold transition hover:border-marca hover:text-marca";

    return (
        <nav aria-label="Paginación" className="flex items-center justify-center gap-3">
            {paginaActual > 1 ? (
                <Link href={enlace(paginaActual - 1)} className={estilo}>
                    ← Anterior
                </Link>
            ) : (
                <span className={`${estilo} pointer-events-none opacity-40`}>← Anterior</span>
            )}
            <span className="text-sm text-suave">
                Página {paginaActual} de {totalPaginas}
            </span>
            {paginaActual < totalPaginas ? (
                <Link href={enlace(paginaActual + 1)} className={estilo}>
                    Siguiente →
                </Link>
            ) : (
                <span className={`${estilo} pointer-events-none opacity-40`}>Siguiente →</span>
            )}
        </nav>
    );
}