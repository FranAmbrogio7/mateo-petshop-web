import Link from "next/link";

import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";

const enlaces = [
    { href: "/productos", texto: "Productos" },
    { href: "/servicios", texto: "Servicios" },
    { href: "/mi-cuenta", texto: "Mi cuenta" },
];

export default function Navbar() {
    return (
        <header className="sticky top-0 z-10 border-b border-borde bg-superficie/90 backdrop-blur">
            <nav className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
                <Logo />
                <div className="flex items-center gap-1 sm:gap-4">
                    {enlaces.map((enlace) => (
                        <Link
                            key={enlace.href}
                            href={enlace.href}
                            className="rounded-md px-2 py-1 text-sm font-semibold text-suave transition hover:text-marca"
                        >
                            {enlace.texto}
                        </Link>
                    ))}
                    <ThemeToggle />
                </div>
            </nav>
        </header>
    );
}