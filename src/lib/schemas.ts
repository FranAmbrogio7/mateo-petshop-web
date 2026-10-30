import { z } from "zod";

export const loginSchema = z.object({
    username: z
        .string()
        .trim()
        .min(1, "Ingresá tu usuario")
        .max(150, "El usuario no puede superar los 150 caracteres"),
    password: z.string().min(1, "Ingresá tu contraseña"),
});

export type LoginDatos = z.infer<typeof loginSchema>;

const FECHA = /^\d{4}-\d{2}-\d{2}$/;

/** Los campos llegan del formulario como texto; se validan y después se convierten para la API. */
export const mascotaSchema = z.object({
    nombre: z
        .string()
        .trim()
        .min(2, "El nombre debe tener al menos 2 letras")
        .max(60, "El nombre no puede superar los 60 caracteres"),
    especie: z.string().min(1, "Elegí una especie"),
    raza: z.string().trim().max(60, "La raza no puede superar los 60 caracteres"),
    fecha_nacimiento: z
        .string()
        .refine((valor) => valor === "" || FECHA.test(valor), "Usá el formato AAAA-MM-DD")
        .refine((valor) => valor === "" || new Date(valor) <= new Date(), "La fecha no puede ser futura"),
    peso_kg: z
        .string()
        .trim()
        .refine(
            (valor) => valor === "" || (Number(valor) > 0 && Number(valor) <= 150),
            "Ingresá un peso entre 0 y 150 kg",
        ),
    observaciones: z.string().trim().max(500, "Máximo 500 caracteres"),
});

export type MascotaDatos = z.infer<typeof mascotaSchema>;

/** Convierte los datos del formulario al formato que espera la API (números y null). */
export function aPayloadMascota(datos: MascotaDatos) {
    return {
        nombre: datos.nombre,
        especie: Number(datos.especie),
        raza: datos.raza,
        fecha_nacimiento: datos.fecha_nacimiento || null,
        peso_kg: datos.peso_kg === "" ? null : Number(datos.peso_kg).toFixed(2),
        observaciones: datos.observaciones,
    };
}