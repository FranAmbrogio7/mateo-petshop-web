import Link from "next/link";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
            <p className="text-6xl" aria-hidden="true">
                🐶❓
            </p>
            <h1 className="text-3xl font-extrabold">No encontramos esta página</h1>
            <p className="max-w-md text-suave">Puede que el producto ya no exista o que el enlace esté mal escrito.</p>
            <div className="mt-4 flex flex-wrap justify-center gap-3">
                <Link href="/" className="rounded-full bg-marca px-6 py-2 font-bold text-white transition hover:brightness-110">
                    Ir al inicio
                </Link>
                <Link
                    href="/productos"
                    className="rounded-full border border-borde px-6 py-2 font-bold transition hover:border-marca hover:text-marca"
                >
                    Ver productos
                </Link>
            </div>
        </div>
    );
}