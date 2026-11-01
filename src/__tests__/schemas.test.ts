import { describe, expect, test } from "vitest";

import { aPayloadMascota, loginSchema, mascotaSchema, turnoSchema, type MascotaDatos } from "@/lib/schemas";

/** Devuelve los mensajes de error de un campo, o [] si es válido. */
function errores(resultado: { success: boolean; error?: { issues: { path: PropertyKey[]; message: string }[] } }, campo: string) {
    return resultado.success ? [] : resultado.error!.issues.filter((i) => i.path[0] === campo).map((i) => i.message);
}

describe("loginSchema", () => {
    test("acepta usuario y contraseña", () => {
        expect(loginSchema.safeParse({ username: "cliente_demo", password: "demo12345" }).success).toBe(true);
    });

    test("rechaza campos vacíos con mensajes en español", () => {
        const resultado = loginSchema.safeParse({ username: "   ", password: "" });
        expect(errores(resultado, "username")).toContain("Ingresá tu usuario");
        expect(errores(resultado, "password")).toContain("Ingresá tu contraseña");
    });
});

describe("mascotaSchema", () => {
    const valida: MascotaDatos = {
        nombre: "Toby",
        especie: "1",
        raza: "Caniche",
        fecha_nacimiento: "2022-03-10",
        peso_kg: "6.5",
        observaciones: "",
    };

    test("acepta una mascota válida", () => {
        expect(mascotaSchema.safeParse(valida).success).toBe(true);
    });

    test("valida longitud, especie obligatoria, fecha futura y rango de peso", () => {
        const resultado = mascotaSchema.safeParse({
            ...valida,
            nombre: "T",
            especie: "",
            fecha_nacimiento: "2999-01-01",
            peso_kg: "-3",
        });
        expect(errores(resultado, "nombre")).toContain("El nombre debe tener al menos 2 letras");
        expect(errores(resultado, "especie")).toContain("Elegí una especie");
        expect(errores(resultado, "fecha_nacimiento")).toContain("La fecha no puede ser futura");
        expect(errores(resultado, "peso_kg")).toContain("Ingresá un peso entre 0 y 150 kg");
    });

    test("aPayloadMascota convierte los textos al formato de la API", () => {
        expect(aPayloadMascota({ ...valida, fecha_nacimiento: "", peso_kg: "" })).toEqual({
            nombre: "Toby",
            especie: 1,
            raza: "Caniche",
            fecha_nacimiento: null,
            peso_kg: null,
            observaciones: "",
        });
    });
});

describe("turnoSchema", () => {
    test("rechaza horarios fuera de atención", () => {
        const resultado = turnoSchema.safeParse({
            mascota: "1",
            servicio: "1",
            fecha: "2999-01-01",
            hora: "20:00",
            notas: "",
        });
        expect(errores(resultado, "hora")).toContain("Atendemos de 9 a 18 h");
    });

    test("rechaza turnos en el pasado", () => {
        const resultado = turnoSchema.safeParse({
            mascota: "1",
            servicio: "1",
            fecha: "2020-01-01",
            hora: "10:00",
            notas: "",
        });
        expect(errores(resultado, "fecha")).toContain("El turno tiene que ser en el futuro");
    });
});