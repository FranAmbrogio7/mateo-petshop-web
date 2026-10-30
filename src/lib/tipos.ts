/** Respuesta paginada de DRF (PageNumberPagination). */
export type Paginado<T> = {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
};

export type Especie = { id: number; nombre: string };
export type Categoria = { id: number; nombre: string; descripcion: string };
export type Marca = { id: number; nombre: string; pais: string };

export type EtapaVida = "cachorro" | "adulto" | "senior" | "todas";

type ProductoBase = {
    id: number;
    nombre: string;
    descripcion: string;
    precio: string; // DRF manda los DecimalField como texto: "68000.00"
    stock: number;
    peso_kg: string | null;
    etapa_vida: EtapaVida;
    imagen_url: string;
    activo: boolean;
    creado: string;
};

/** Listado: categoría, marca y especies vienen anidadas. */
export type ProductoListado = ProductoBase & {
    categoria: Categoria;
    marca: Marca;
    especies: Especie[];
};

/** Detalle: las relaciones vienen como IDs. */
export type ProductoDetalle = ProductoBase & {
    categoria: number;
    marca: number;
    especies: number[];
};

export type Servicio = {
    id: number;
    nombre: string;
    descripcion: string;
    precio: string;
    duracion_min: number;
    especies: number[];
    activo: boolean;
};

/** Listado de mascotas: la especie viene anidada. */
export type Mascota = {
    id: number;
    nombre: string;
    especie: Especie;
    raza: string;
    fecha_nacimiento: string | null;
    peso_kg: string | null;
    observaciones: string;
};

/** Detalle de una mascota: la especie viene como ID. */
export type MascotaDetalle = Omit<Mascota, "especie"> & { especie: number };