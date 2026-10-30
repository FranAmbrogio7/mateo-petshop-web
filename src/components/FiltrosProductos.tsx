"use client";

import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";

import { construirQuery, ETAPAS, type Filtros } from "@/lib/formato";
import type { Categoria, Especie } from "@/lib/tipos";

type Props = {
    actuales: Filtros;
    categorias: Categoria[];
    especies: Especie[];
};

const ORDENES = [
    { valor: "", texto: "Nombre (A-Z)" },
    { valor: "precio", texto: "Menor precio" },
    { valor: "-precio", texto: "Mayor precio" },
    { valor: "-creado", texto: "Más nuevos" },
];

const estiloCampo = "w-full rounded-xl border border-borde bg-fondo px-3 py-2 outline-none focus:border-marca";

export default function FiltrosProductos({ actuales, categorias, especies }: Props) {
    const router = useRouter();
    const pathname = usePathname();
    const [cargando, startTransition] = useTransition();

    // Los filtros viven en la URL: se pueden compartir, y el botón Atrás funciona
    const aplicar = (cambios: Filtros) => {
        startTransition(() => {
            router.push(`${pathname}${construirQuery(actuales, cambios)}`);
        });
    };

    const buscar = (evento: React.FormEvent<HTMLFormElement>) => {
        evento.preventDefault();
        const texto = new FormData(evento.currentTarget).get("search");
        aplicar({ search: typeof texto === "string" ? texto.trim() : "" });
    };

    const hayFiltros = Object.entries(actuales).some(([clave, valor]) => clave !== "page" && valor);

    return (
        <div className="flex flex-col gap-3 rounded-2xl border border-borde bg-superficie p-4">
            <form onSubmit={buscar} className="flex gap-2" role="search">
                <label htmlFor="search" className="sr-only">
                    Buscar productos
                </label>
                <input
                    key={actuales.search ?? ""}
                    id="search"
                    name="search"
                    defaultValue={actuales.search ?? ""}
                    placeholder="Buscar por nombre o marca…"
                    className={estiloCampo}
                />
                <button
                    type="submit"
                    className="rounded-xl bg-marca px-4 py-2 font-bold text-white transition hover:brightness-110"
                >
                    Buscar
                </button>
            </form>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <label className="flex flex-col gap-1 text-sm font-semibold">
                    Especie
                    <select
                        value={actuales.especie ?? ""}
                        onChange={(e) => aplicar({ especie: e.target.value })}
                        className={estiloCampo}
                    >
                        <option value="">Todas</option>
                        {especies.map((especie) => (
                            <option key={especie.id} value={especie.id}>
                                {especie.nombre}
                            </option>
                        ))}
                    </select>
                </label>

                <label className="flex flex-col gap-1 text-sm font-semibold">
                    Categoría
                    <select
                        value={actuales.categoria ?? ""}
                        onChange={(e) => aplicar({ categoria: e.target.value })}
                        className={estiloCampo}
                    >
                        <option value="">Todas</option>
                        {categorias.map((categoria) => (
                            <option key={categoria.id} value={categoria.id}>
                                {categoria.nombre}
                            </option>
                        ))}
                    </select>
                </label>

                <label className="flex flex-col gap-1 text-sm font-semibold">
                    Etapa de vida
                    <select
                        value={actuales.etapa_vida ?? ""}
                        onChange={(e) => aplicar({ etapa_vida: e.target.value })}
                        className={estiloCampo}
                    >
                        <option value="">Todas</option>
                        {Object.entries(ETAPAS).map(([valor, texto]) => (
                            <option key={valor} value={valor}>
                                {texto}
                            </option>
                        ))}
                    </select>
                </label>

                <label className="flex flex-col gap-1 text-sm font-semibold">
                    Ordenar por
                    <select
                        value={actuales.ordering ?? ""}
                        onChange={(e) => aplicar({ ordering: e.target.value })}
                        className={estiloCampo}
                    >
                        {ORDENES.map((orden) => (
                            <option key={orden.valor} value={orden.valor}>
                                {orden.texto}
                            </option>
                        ))}
                    </select>
                </label>
            </div>

            <div className="flex min-h-6 items-center justify-between text-sm">
                <span className="text-suave" aria-live="polite">
                    {cargando ? "Actualizando resultados…" : ""}
                </span>
                {hayFiltros && (
                    <button
                        type="button"
                        onClick={() => startTransition(() => router.push(pathname))}
                        className="font-semibold text-marca hover:underline"
                    >
                        Limpiar filtros
                    </button>
                )}
            </div>
        </div>
    );
}