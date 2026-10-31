"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";

import { reservarTurno } from "@/app/actions/turnos";
import Alerta from "@/components/Alerta";
import { formatearPrecio } from "@/lib/formato";
import { turnoSchema, type TurnoDatos } from "@/lib/schemas";
import type { Mascota, Servicio } from "@/lib/tipos";

type Props = {
    mascotas: Mascota[];
    servicios: Servicio[];
};

const VACIO: TurnoDatos = { mascota: "", servicio: "", fecha: "", hora: "", notas: "" };
const estiloCampo = "w-full rounded-xl border border-borde bg-fondo px-3 py-2 outline-none focus:border-marca";

export default function TurnoForm({ mascotas, servicios }: Props) {
    const [exito, setExito] = useState(false);
    const {
        register,
        handleSubmit,
        setError,
        reset,
        control,
        formState: { errors, isSubmitting },
    } = useForm<TurnoDatos>({ resolver: zodResolver(turnoSchema), defaultValues: VACIO });

    // Solo se ofrecen los servicios que aplican a la especie de la mascota elegida
    const mascotaElegida = useWatch({ control, name: "mascota" });
    const especie = mascotas.find((m) => String(m.id) === mascotaElegida)?.especie.id;
    const serviciosDisponibles = especie ? servicios.filter((s) => s.especies.includes(especie)) : servicios;

    const onSubmit = async (datos: TurnoDatos) => {
        setExito(false);
        const resultado = await reservarTurno(datos);
        if (resultado.ok) {
            reset(VACIO);
            setExito(true);
            return;
        }
        for (const [campo, mensaje] of Object.entries(resultado.campos ?? {})) {
            setError(campo as keyof TurnoDatos, { message: mensaje });
        }
        if (resultado.error) setError("root", { message: resultado.error });
    };

    const hoy = new Date().toISOString().slice(0, 10);

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
            {exito && <Alerta tipo="exito">¡Turno reservado! Te esperamos en el local.</Alerta>}
            {errors.root && <Alerta tipo="error">{errors.root.message}</Alerta>}

            <div className="grid gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-1 text-sm font-semibold">
                    Mascota *
                    <select {...register("mascota")} aria-invalid={!!errors.mascota} className={estiloCampo}>
                        <option value="">Elegí una mascota</option>
                        {mascotas.map((mascota) => (
                            <option key={mascota.id} value={mascota.id}>
                                {mascota.nombre} ({mascota.especie.nombre})
                            </option>
                        ))}
                    </select>
                    {errors.mascota && <span className="font-normal text-red-600 dark:text-red-400">{errors.mascota.message}</span>}
                </label>

                <label className="flex flex-col gap-1 text-sm font-semibold">
                    Servicio *
                    <select {...register("servicio")} aria-invalid={!!errors.servicio} className={estiloCampo}>
                        <option value="">Elegí un servicio</option>
                        {serviciosDisponibles.map((servicio) => (
                            <option key={servicio.id} value={servicio.id}>
                                {servicio.nombre} · {formatearPrecio(servicio.precio)}
                            </option>
                        ))}
                    </select>
                    {errors.servicio && <span className="font-normal text-red-600 dark:text-red-400">{errors.servicio.message}</span>}
                </label>

                <label className="flex flex-col gap-1 text-sm font-semibold">
                    Fecha *
                    <input type="date" min={hoy} {...register("fecha")} aria-invalid={!!errors.fecha} className={estiloCampo} />
                    {errors.fecha && <span className="font-normal text-red-600 dark:text-red-400">{errors.fecha.message}</span>}
                </label>

                <label className="flex flex-col gap-1 text-sm font-semibold">
                    Horario *
                    <input type="time" min="09:00" max="18:00" step={1800} {...register("hora")} aria-invalid={!!errors.hora} className={estiloCampo} />
                    {errors.hora && <span className="font-normal text-red-600 dark:text-red-400">{errors.hora.message}</span>}
                </label>
            </div>

            <label className="flex flex-col gap-1 text-sm font-semibold">
                Notas
                <textarea rows={2} {...register("notas")} className={estiloCampo} placeholder="Algo que debamos saber (opcional)" />
                {errors.notas && <span className="font-normal text-red-600 dark:text-red-400">{errors.notas.message}</span>}
            </label>

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-fit rounded-full bg-acento px-6 py-3 font-bold text-[#24302e] transition hover:brightness-95 disabled:opacity-60"
            >
                {isSubmitting ? "Reservando…" : "Reservar turno"}
            </button>
        </form>
    );
}