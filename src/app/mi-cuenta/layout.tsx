import Link from "next/link";

const secciones = [
    { href: "/mi-cuenta", texto: "Resumen" },
    { href: "/mi-cuenta/mascotas", texto: "Mis mascotas" },
    { href: "/mi-cuenta/turnos", texto: "Mis turnos" },
];

// Layout anidado: envuelve todas las páginas de /mi-cuenta con su menú lateral
export default function MiCuentaLayout({ children }: LayoutProps<"/mi-cuenta">) {
    return (
        <div className="grid gap-6 md:grid-cols-[220px_1fr]">
            <aside className="h-fit rounded-2xl border border-borde bg-superficie p-4">
                <p className="mb-3 px-2 text-xs font-bold tracking-wide text-suave uppercase">Mi cuenta</p>
                <nav className="flex flex-col gap-1">
                    {secciones.map((seccion) => (
                        <Link
                            key={seccion.href}
                            href={seccion.href}
                            className="rounded-lg px-2 py-2 font-semibold text-texto transition hover:bg-fondo hover:text-marca"
                        >
                            {seccion.texto}
                        </Link>
                    ))}
                </nav>
            </aside>
            <section>{children}</section>
        </div>
    );
}