type Props = {
    tono?: "neutro" | "marca" | "ok" | "aviso" | "agotado";
    children: React.ReactNode;
};

const tonos = {
    neutro: "bg-fondo text-suave border-borde",
    marca: "bg-marca/10 text-marca border-marca/30",
    ok: "bg-emerald-500/10 text-emerald-700 border-emerald-500/30 dark:text-emerald-300",
    aviso: "bg-amber-500/10 text-amber-700 border-amber-500/30 dark:text-amber-300",
    agotado: "bg-red-500/10 text-red-700 border-red-500/30 dark:text-red-300",
};

export default function Badge({ tono = "neutro", children }: Props) {
    return (
        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${tonos[tono]}`}>
            {children}
        </span>
    );
}