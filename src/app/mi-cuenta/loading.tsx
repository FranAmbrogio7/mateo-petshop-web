export default function CargandoMiCuenta() {
    return (
        <div className="flex flex-col gap-4" aria-busy="true" aria-label="Cargando">
            <div className="h-10 w-56 animate-pulse rounded-xl bg-borde" />
            <div className="grid gap-4 lg:grid-cols-2">
                <div className="h-48 animate-pulse rounded-2xl bg-borde" />
                <div className="h-48 animate-pulse rounded-2xl bg-borde" />
            </div>
        </div>
    );
}