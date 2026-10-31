import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, test } from "vitest";

import Badge from "@/components/Badge";
import EstadoVacio from "@/components/EstadoVacio";

afterEach(cleanup);

describe("EstadoVacio", () => {
    test("muestra el título, el texto y el enlace", () => {
        render(
            <EstadoVacio
                titulo="No encontramos productos"
                texto="Probá con otra búsqueda."
                enlace={{ href: "/productos", texto: "Ver todos los productos" }}
            />,
        );

        expect(screen.getByRole("heading", { name: "No encontramos productos" })).toBeDefined();
        expect(screen.getByText("Probá con otra búsqueda.")).toBeDefined();
        expect(screen.getByRole("link", { name: "Ver todos los productos" }).getAttribute("href")).toBe("/productos");
    });

    test("no muestra enlace si no se lo pasa", () => {
        render(<EstadoVacio titulo="Sin turnos" />);
        expect(screen.queryByRole("link")).toBeNull();
    });
});

describe("Badge", () => {
    test("aplica el color según el tono", () => {
        render(<Badge tono="agotado">Sin stock</Badge>);
        expect(screen.getByText("Sin stock").className).toContain("text-red-700");
    });
});