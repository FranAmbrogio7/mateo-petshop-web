import { describe, expect, test } from "vitest";

import { calcularEdad, construirQuery, estadoStock, formatearFechaHora, formatearPrecio } from "@/lib/formato";

// Intl usa un espacio que no se corta (\u00a0) entre "$" y el número
const sinEspaciosRaros = (texto: string) => texto.replace(/\u00a0/g, " ");

describe("formatearPrecio", () => {
    test("convierte el texto de la API en pesos argentinos", () => {
        expect(sinEspaciosRaros(formatearPrecio("68000.00"))).toBe("$ 68.000");
    });

    test("devuelve un guion si el valor no es un número", () => {
        expect(formatearPrecio("abc")).toBe("—");
    });
});

describe("estadoStock", () => {
    test.each([
        [0, "Sin stock", "agotado"],
        [3, "Últimas 3 unidades", "aviso"],
        [12, "En stock", "ok"],
    ])("con %i unidades muestra «%s»", (stock, texto, tono) => {
        expect(estadoStock(stock)).toEqual({ texto, tono });
    });
});

describe("construirQuery", () => {
    test("omite los filtros vacíos", () => {
        expect(construirQuery({ search: "royal", especie: "", categoria: undefined })).toBe("?search=royal");
    });

    test("al cambiar un filtro vuelve a la página 1", () => {
        expect(construirQuery({ especie: "1", page: "3" }, { especie: "2" })).toBe("?especie=2");
    });

    test("conserva la página cuando se la pide explícitamente", () => {
        expect(construirQuery({ especie: "1" }, { page: "2" })).toBe("?especie=1&page=2");
    });

    test("sin filtros devuelve un texto vacío", () => {
        expect(construirQuery({})).toBe("");
    });
});

describe("calcularEdad", () => {
    // Fecha fija: el test da el mismo resultado hoy y dentro de un año
    const hoy = new Date("2026-10-31T12:00:00");

    test.each([
        ["2023-05-10", "3 años"],
        ["2025-10-31", "1 año"],
        ["2026-05-15", "5 meses"],
        ["2026-10-20", "Menos de un mes"],
    ])("nacido el %s tiene %s", (fecha, esperado) => {
        expect(calcularEdad(fecha, hoy)).toBe(esperado);
    });

    test("sin fecha devuelve null", () => {
        expect(calcularEdad(null, hoy)).toBeNull();
    });
});

describe("formatearFechaHora", () => {
    test("muestra la hora en horario argentino aunque la API mande UTC", () => {
        expect(formatearFechaHora("2026-11-10T13:30:00Z")).toBe("martes, 10 de noviembre, 10:30");
    });
});