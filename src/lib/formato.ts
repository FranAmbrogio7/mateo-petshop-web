import type { EtapaVida } from "@/lib/tipos";

const pesos = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
});

/** "68000.00" → "$ 68.000" */
export function formatearPrecio(valor: string | number): string {
    const numero = typeof valor === "string" ? Number(valor) : valor;
    return Number.isFinite(numero) ? pesos.format(numero) : "—";
}

export const ETAPAS: Record<EtapaVida, string> = {
    cachorro: "Cachorro",
    adulto: "Adulto",
    senior: "Senior",
    todas: "Todas las etapas",
};

/** Texto e importancia del stock para mostrarle al cliente. */
export function estadoStock(stock: number): { texto: string; tono: "ok" | "aviso" | "agotado" } {
    if (stock <= 0) return { texto: "Sin stock", tono: "agotado" };
    if (stock <= 3) return { texto: `Últimas ${stock} unidades`, tono: "aviso" };
    return { texto: "En stock", tono: "ok" };
}

export type Filtros = Record<string, string | undefined>;

/**
 * Arma el query string a partir de los filtros, sin los vacíos.
 * Cambiar cualquier filtro vuelve a la página 1, salvo que se indique la página.
 */
export function construirQuery(actuales: Filtros, cambios: Filtros = {}): string {
    const resultado = new URLSearchParams();
    const combinados = { ...actuales, ...cambios };
    if (!("page" in cambios)) delete combinados.page;

    for (const [clave, valor] of Object.entries(combinados)) {
        if (valor !== undefined && valor !== "") resultado.set(clave, valor);
    }
    const texto = resultado.toString();
    return texto ? `?${texto}` : "";
}

const EMOJI_CATEGORIA: Record<string, string> = {
    Alimentos: "🥩",
    Accesorios: "🦴",
    Higiene: "🧴",
    Juguetes: "🎾",
};

/** Ícono que representa a cada categoría (los productos no tienen foto). */
export function emojiCategoria(nombre?: string): string {
    return (nombre && EMOJI_CATEGORIA[nombre]) || "🐾";
}


/** "2021-03-10" → "3 años", "5 meses" o "Menos de un mes". */
export function calcularEdad(fecha: string | null, hoy: Date = new Date()): string | null {
    if (!fecha) return null;
    const nacimiento = new Date(`${fecha}T00:00:00`);
    if (Number.isNaN(nacimiento.getTime())) return null;

    let meses = (hoy.getFullYear() - nacimiento.getFullYear()) * 12 + (hoy.getMonth() - nacimiento.getMonth());
    if (hoy.getDate() < nacimiento.getDate()) meses -= 1;

    if (meses < 1) return "Menos de un mes";
    if (meses < 12) return meses === 1 ? "1 mes" : `${meses} meses`;
    const anios = Math.floor(meses / 12);
    return anios === 1 ? "1 año" : `${anios} años`;
}