// Se muestra automáticamente mientras la página de productos espera a la API
export default function CargandoProductos() {
    return (
        <div className="flex flex-col gap-6" aria-busy="true" aria-label="Cargando productos">
            <div className="h-10 w-48 animate-pulse rounded-xl bg-borde" />
            <div className="h-36 animate-pulse rounded-2xl bg-borde" />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 8 }, (_, i) => (
                    <div key={i} className="h-72 animate-pulse rounded-2xl bg-borde" />
                ))}
            </div>
        </div>
    );
}