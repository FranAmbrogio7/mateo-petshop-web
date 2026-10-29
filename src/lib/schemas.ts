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