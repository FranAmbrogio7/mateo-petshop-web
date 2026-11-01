"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { iniciarSesion } from "@/app/actions/auth";
import Alerta from "@/components/Alerta";
import { loginSchema, type LoginDatos } from "@/lib/schemas";

export default function LoginForm({ siguiente }: { siguiente?: string }) {
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<LoginDatos>({
        resolver: zodResolver(loginSchema),
        defaultValues: { username: "", password: "" },
    });

    const onSubmit = async (datos: LoginDatos) => {
        // Si el login sale bien, la Server Action redirige y esta función no sigue
        const resultado = await iniciarSesion(datos, siguiente);
        if (resultado?.error) {
            setError("root", { message: resultado.error });
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
            {errors.root && <Alerta tipo="error">{errors.root.message}</Alerta>}

            <div className="flex flex-col gap-1">
                <label htmlFor="username" className="text-sm font-semibold">
                    Usuario
                </label>
                <input
                    id="username"
                    autoComplete="username"
                    {...register("username")}
                    aria-invalid={!!errors.username}
                    className="rounded-xl border border-borde bg-fondo px-3 py-2 outline-none focus:border-marca"
                />
                {errors.username && <p className="text-sm text-red-600 dark:text-red-400">{errors.username.message}</p>}
            </div>

            <div className="flex flex-col gap-1">
                <label htmlFor="password" className="text-sm font-semibold">
                    Contraseña
                </label>
                <input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    {...register("password")}
                    aria-invalid={!!errors.password}
                    className="rounded-xl border border-borde bg-fondo px-3 py-2 outline-none focus:border-marca"
                />
                {errors.password && <p className="text-sm text-red-600 dark:text-red-400">{errors.password.message}</p>}
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="mt-2 rounded-full bg-marca px-6 py-3 font-bold text-white transition hover:brightness-110 disabled:opacity-60"
            >
                {isSubmitting ? "Ingresando…" : "Ingresar"}
            </button>
        </form>
    );
}