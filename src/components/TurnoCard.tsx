import Badge from "@/components/Badge";
import BotonCancelarTurno from "@/components/BotonCancelarTurno";
import { formatearFechaHora, formatearPrecio } from "@/lib/formato";
import type { EstadoTurno, Turno } from "@/lib/tipos";

const ESTADOS: Record<EstadoTurno, { texto: string; tono: "aviso" | "ok" | "neutro" | "agotado" }> = {
    pendiente: { texto: "Pendiente", tono: "aviso" },
    confirmado: { texto: "Confirmado", tono: "ok" },
    realizado: { texto: "Realizado", tono: "neutro" },
    cancelado: { texto: "Cancelado", tono: "agotado" },
};

export default function TurnoCard({ turno }: { turno: Turno }) {
    const estado = ESTADOS[turno.estado];
    const activo = turno.estado === "pendiente" || turno.estado === "confirmado";

    return (
        <article className={`flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-borde bg-superficie p-5 ${activo ? "" : "opacity-70"}`}>
            <div className="flex flex-col gap-1">
                <p className="font-bold first-letter:uppercase">{formatearFechaHora(turno.fecha_hora)} h</p>
                <p className="text-suave">
                    {turno.servicio.nombre} para <strong className="text-texto">{turno.mascota.nombre}</strong> ·{" "}
                    {formatearPrecio(turno.servicio.precio)}
                </p>
                {turno.notas && <p className="text-sm text-suave">“{turno.notas}”</p>}
            </div>
            <div className="flex items-center gap-3">
                <Badge tono={estado.tono}>{estado.texto}</Badge>
                {activo && <BotonCancelarTurno id={turno.id} />}
            </div>
        </article>
    );
}