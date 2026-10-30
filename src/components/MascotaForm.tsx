"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";

import { crearMascota, editarMascota } from "@/app/actions/mascotas";
import Alerta from "@/components/Alerta";
import { mascotaSchema, type MascotaDatos } from "@/lib/schemas";
import type { Especie } from "@/lib/tipos";

type Props = {
    especies: Especie[];
    /** Si viene, el formulario edita esa mascota; si no, crea una nueva */
    mascotaId?: number;
    valoresIniciales?: MascotaDatos;
};

const VACIO: MascotaDatos = {
    nombre: "",
    especie: "",
    raza: "",
    fecha_nacimiento: "",
    peso_kg: "",
    observaciones: "",
};

const estiloCampo = "rounded-xl border border-borde bg-fondo px-3 py-2 outline-none focus:border-marca";

function Campo({ id, etiqueta, error, children }: { id: string; etiqueta: string; error?: string; children: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-1">
            <label htmlFor={id} className="text-sm font-semibold">
                {etiqueta}
            </label>
            {children}
            {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
        </div>
    );
}

export default function MascotaForm({ especies, mascotaId, valoresIniciales }: Props) {
    const editando = mascotaId !== undefined;
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<MascotaDatos>({
        resolver: zodResolver(mascotaSchema),
        defaultValues: valoresIniciales ?? VACIO,
    });

    const onSubmit = async (datos: MascotaDatos) => {
        const resultado = editando ? await editarMascota(mascotaId, datos) : await crearMascota(datos);
        // Si salió bien, la Server Action redirige; si volvió acá, hubo errores
        if (resultado.campos) {
            for (const [campo, mensaje] of Object.entries(resultado.campos)) {
                setError(campo as keyof MascotaDatos, { message: mensaje });
            }
        }
        if (resultado.error) setError("root", { message: resultado.error });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
            {errors.root && <Alerta tipo="error">{errors.root.message}</Alerta>}

            <div className="grid gap-4 sm:grid-cols-2">
                <Campo id="nombre" etiqueta="Nombre *" error={errors.nombre?.message}>
                    <input id="nombre" {...register("nombre")} aria-invalid={!!errors.nombre} className={estiloCampo} />
                </Campo>

                <Campo id="especie" etiqueta="Especie *" error={errors.especie?.message}>
                    <select id="especie" {...register("especie")} aria-invalid={!!errors.especie} className={estiloCampo}>
                        <option value="">Elegí una especie</option>
                        {especies.map((especie) => (
                            <option key={especie.id} value={especie.id}>
                                {especie.nombre}
                            </option>
                        ))}
                    </select>
                </Campo>

                <Campo id="raza" etiqueta="Raza" error={errors.raza?.message}>
                    <input id="raza" {...register("raza")} className={estiloCampo} placeholder="Opcional" />
                </Campo>

                <Campo id="fecha_nacimiento" etiqueta="Fecha de nacimiento" error={errors.fecha_nacimiento?.message}>
                    <input id="fecha_nacimiento" type="date" {...register("fecha_nacimiento")} className={estiloCampo} />
                </Campo>

                <Campo id="peso_kg" etiqueta="Peso (kg)" error={errors.peso_kg?.message}>
                    <input
                        id="peso_kg"
                        inputMode="decimal"
                        {...register("peso_kg")}
                        className={estiloCampo}
                        placeholder="Ej: 6.5"
                    />
                </Campo>
            </div>

            <Campo id="observaciones" etiqueta="Observaciones" error={errors.observaciones?.message}>
                <textarea
                    id="observaciones"
                    rows={3}
                    {...register("observaciones")}
                    className={estiloCampo}
                    placeholder="Alergias, carácter, cuidados especiales…"
                />
            </Campo>

            <div className="flex flex-wrap gap-3">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-full bg-marca px-6 py-3 font-bold text-white transition hover:brightness-110 disabled:opacity-60"
                >
                    {isSubmitting ? "Guardando…" : editando ? "Guardar cambios" : "Agregar mascota"}
                </button>
                <Link
                    href="/mi-cuenta/mascotas"
                    className="rounded-full border border-borde px-6 py-3 font-bold transition hover:border-marca hover:text-marca"
                >
                    Cancelar
                </Link>
            </div>
        </form>
    );
}