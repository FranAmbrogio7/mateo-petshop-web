export default function Footer() {
    return (
        <footer className="mt-auto border-t border-borde bg-superficie">
            <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-6 text-sm text-suave sm:flex-row sm:justify-between">
                <p>Mateo Pet Shop · Alimentos balanceados, accesorios y estética</p>
                <p>Río Cuarto, Córdoba · {new Date().getFullYear()}</p>
            </div>
        </footer>
    );
}