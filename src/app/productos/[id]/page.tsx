import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import Badge from "@/components/Badge";
import { apiFetch, ApiError } from "@/lib/api";
import { emojiCategoria, ETAPAS, estadoStock, formatearPrecio } from "@/lib/formato";
import type { Categoria, Especie, Marca, Paginado, ProductoDetalle } from "@/lib/tipos";

async function obtenerProducto(id: string) {
    // Un id que no es número no puede existir: 404 sin consultar la API
    if (!/^\d+$/.test(id)) notFound();
    try {
        return await apiFetch<ProductoDetalle>(`/api/productos/${id}/`);
    } catch (error) {
        if (error instanceof ApiError && error.status === 404) notFound();
        throw error;
    }
}

export async function generateMetadata({ params }: PageProps<"/productos/[id]">): Promise<Metadata> {
    const { id } = await params;
    const producto = await obtenerProducto(id);
    return { title: producto.nombre };
}

export default async function ProductoPage({ params }: PageProps<"/productos/[id]">) {
    const { id } = await params;
    const producto = await obtenerProducto(id);

    // El detalle trae las relaciones como IDs: se buscan los nombres en sus listados
    const [categorias, marcas, especies] = await Promise.all([
        apiFetch<Paginado<Categoria>>("/api/categorias/"),
        apiFetch<Paginado<Marca>>("/api/marcas/"),
        apiFetch<Paginado<Especie>>("/api/especies/"),
    ]);
    const categoria = categorias.results.find((c) => c.id === producto.categoria);
    const marca = marcas.results.find((m) => m.id === producto.marca);
    const especiesProducto = especies.results.filter((e) => producto.especies.includes(e.id));
    const stock = estadoStock(producto.stock);

    return (
        <article className="flex flex-col gap-6">
            <Link href="/productos" className="w-fit text-sm font-semibold text-marca hover:underline">
                ← Volver al catálogo
            </Link>

            <div className="grid gap-8 rounded-3xl border border-borde bg-superficie p-6 md:grid-cols-2 md:p-10">
                <div className="flex min-h-64 items-center justify-center rounded-2xl bg-fondo text-8xl" aria-hidden="true">
                    {emojiCategoria(categoria?.nombre)}
                </div>

                <div className="flex flex-col gap-4">
                    <div>
                        <p className="text-sm font-semibold tracking-wide text-suave uppercase">
                            {marca?.nombre} · {categoria?.nombre}
                        </p>
                        <h1 className="mt-1 text-3xl font-extrabold">{producto.nombre}</h1>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {especiesProducto.map((especie) => (
                            <Badge key={especie.id} tono="marca">
                                {especie.nombre}
                            </Badge>
                        ))}
                        <Badge>{ETAPAS[producto.etapa_vida]}</Badge>
                        <Badge tono={stock.tono}>{stock.texto}</Badge>
                    </div>

                    <p className="text-4xl font-extrabold text-marca">{formatearPrecio(producto.precio)}</p>

                    {producto.descripcion && <p className="text-suave">{producto.descripcion}</p>}

                    <dl className="grid grid-cols-2 gap-3 rounded-2xl bg-fondo p-4 text-sm">
                        <div>
                            <dt className="text-suave">Peso</dt>
                            <dd className="font-semibold">{producto.peso_kg ? `${Number(producto.peso_kg)} kg` : "—"}</dd>
                        </div>
                        <div>
                            <dt className="text-suave">Unidades disponibles</dt>
                            <dd className="font-semibold">{producto.stock}</dd>
                        </div>
                    </dl>
                </div>
            </div>
        </article>
    );
}