type Props = {
    tipo?: "error" | "info" | "exito";
    children: React.ReactNode;
};

const estilos = {
    error: "border-red-300 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200",
    info: "border-borde bg-superficie text-texto",
    exito: "border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200",
};

export default function Alerta({ tipo = "info", children }: Props) {
    return (
        <div role={tipo === "error" ? "alert" : "status"} className={`rounded-xl border px-4 py-3 text-sm ${estilos[tipo]}`}>
            {children}
        </div>
    );
}