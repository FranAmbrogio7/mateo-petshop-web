import Link from "next/link";

type Props = {
    emoji?: string;
    titulo: string;
    texto?: string;
    enlace?: { href: string; texto: string };
};

export default function EstadoVacio({ emoji = "🐾", titulo, texto, enlace }: Props) {
    return (
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-borde bg-superficie px-6 py-14 text-center">
            <p className="text-4xl" aria-hidden="true">
                {emoji}
            </p>
            <h2 className="text-lg font-bold">{titulo}</h2>
            {texto && <p className="max-w-md text-suave">{texto}</p>}
            {enlace && (
                <Link href={enlace.href} className="mt-2 font-semibold text-marca hover:underline">
                    {enlace.texto}
                </Link>
            )}
        </div>
    );
}