import Link from "next/link";

import Badge from "@/components/Badge";
import BotonBorrarMascota from "@/components/BotonBorrarMascota";
import { calcularEdad } from "@/lib/formato";
import type { Mascota } from "@/lib/tipos";

const EMOJI_ESPECIE: Record<string, string> = {
    Perro: "🐶",
    Gato: "🐱",
    Ave: "🐦",
    Pez: "🐟",
    Roedor: "🐹",
};

export default function MascotaCard({ mascota }: { mascota: Mascota }) {
    const edad = calcularEdad(mascota.fecha_nacimiento);

    return (
        <article className="flex flex-col gap-4 rounded-2xl border border-borde bg-superficie p-5">
            <div className="flex items-center gap-4">
                <p className="flex h-14 w-14 items-center justify-center rounded-full bg-fondo text-3xl" aria-hidden="true">
                    {EMOJI_ESPECIE[mascota.especie.nombre] ?? "🐾"}
                </p>
                <div>
                    <h2 className="text-lg font-bold">{mascota.nombre}</h2>
                    <p className="text-sm text-suave">{mascota.raza || "Raza sin especificar"}</p>
                </div>
            </div>

            <div className="flex flex-wrap gap-2">
                <Badge tono="marca">{mascota.especie.nombre}</Badge>
                {edad && <Badge>{edad}</Badge>}
                {mascota.peso_kg && <Badge>{Number(mascota.peso_kg)} kg</Badge>}
            </div>

            {mascota.observaciones && <p className="text-sm text-suave">{mascota.observaciones}</p>}

            <div className="mt-auto flex flex-wrap items-start gap-2 border-t border-borde pt-4">
                <Link
                    href={`/mi-cuenta/mascotas/${mascota.id}/editar`}
                    className="rounded-full border border-borde px-4 py-1.5 text-sm font-semibold transition hover:border-marca hover:text-marca"
                >
                    Editar
                </Link>
                <BotonBorrarMascota id={mascota.id} nombre={mascota.nombre} />
            </div>
        </article>
    );
}