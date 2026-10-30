import Link from "next/link";

import Badge from "@/components/Badge";
import { emojiCategoria, ETAPAS, estadoStock, formatearPrecio } from "@/lib/formato";
import type { ProductoListado } from "@/lib/tipos";

export default function ProductoCard({ producto }: { producto: ProductoListado }) {
    const stock = estadoStock(producto.stock);

    return (
        <Link
            href={`/productos/${producto.id}`}
            className="group flex flex-col overflow-hidden rounded-2xl border border-borde bg-superficie transition hover:-translate-y-0.5 hover:shadow-lg"
        >
            <div className="flex h-36 items-center justify-center bg-fondo text-6xl" aria-hidden="true">
                {emojiCategoria(producto.categoria.nombre)}
            </div>
            <div className="flex flex-1 flex-col gap-2 p-4">
                <p className="text-xs font-semibold tracking-wide text-suave uppercase">{producto.marca.nombre}</p>
                <h2 className="font-bold leading-snug group-hover:text-marca">{producto.nombre}</h2>
                <div className="flex flex-wrap gap-1.5">
                    {producto.especies.map((especie) => (
                        <Badge key={especie.id} tono="marca">
                            {especie.nombre}
                        </Badge>
                    ))}
                    {producto.etapa_vida !== "todas" && <Badge>{ETAPAS[producto.etapa_vida]}</Badge>}
                </div>
                <div className="mt-auto flex items-end justify-between pt-2">
                    <p className="text-xl font-extrabold">{formatearPrecio(producto.precio)}</p>
                    <Badge tono={stock.tono}>{stock.texto}</Badge>
                </div>
            </div>
        </Link>
    );
}