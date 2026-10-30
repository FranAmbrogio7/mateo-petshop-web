import type { Metadata } from "next";

import EstadoVacio from "@/components/EstadoVacio";
import FiltrosProductos from "@/components/FiltrosProductos";
import Paginacion from "@/components/Paginacion";
import ProductoCard from "@/components/ProductoCard";
import { apiFetch } from "@/lib/api";
import { construirQuery, type Filtros } from "@/lib/formato";
import type { Categoria, Especie, Paginado, ProductoListado } from "@/lib/tipos";

export const metadata: Metadata = { title: "Productos" };

const FILTROS = ["search", "especie", "categoria", "etapa_vida", "ordering", "page"] as const;
const POR_PAGINA = 10; // PAGE_SIZE de la API

export default async function ProductosPage({ searchParams }: PageProps<"/productos">) {
    const parametros = await searchParams;

    // Solo se pasan a la API los filtros conocidos
    const filtros: Filtros = {};
    for (const clave of FILTROS) {
        const valor = parametros[clave];
        if (typeof valor === "string" && valor) filtros[clave] = valor;
    }

    // Las tres consultas salen en paralelo; si alguna falla, se muestra error.tsx
    const [productos, categorias, especies] = await Promise.all([
        apiFetch<Paginado<ProductoListado>>(`/api/productos/${construirQuery(filtros, { page: filtros.page })}`),
        apiFetch<Paginado<Categoria>>("/api/categorias/"),
        apiFetch<Paginado<Especie>>("/api/especies/"),
    ]);

    const paginaActual = Number(filtros.page ?? "1");
    const totalPaginas = Math.max(1, Math.ceil(productos.count / POR_PAGINA));

    return (
        <div className="flex flex-col gap-6">
            <header>
                <h1 className="text-3xl font-extrabold">Productos</h1>
                <p className="text-suave">Alimentos, accesorios, higiene y juguetes para tu mascota.</p>
            </header>

            <FiltrosProductos actuales={filtros} categorias={categorias.results} especies={especies.results} />

            <p className="text-sm text-suave">
                {productos.count} {productos.count === 1 ? "producto encontrado" : "productos encontrados"}
            </p>

            {productos.results.length === 0 ? (
                <EstadoVacio
                    emoji="🔍"
                    titulo="No encontramos productos"
                    texto="Probá con otra búsqueda o quitá algún filtro."
                    enlace={{ href: "/productos", texto: "Ver todos los productos" }}
                />
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {productos.results.map((producto) => (
                        <ProductoCard key={producto.id} producto={producto} />
                    ))}
                </div>
            )}

            <Paginacion ruta="/productos" filtros={filtros} paginaActual={paginaActual} totalPaginas={totalPaginas} />
        </div>
    );
}