import Link from "next/link";

const destacados = [
  {
    emoji: "🥩",
    titulo: "Alimentos balanceados",
    texto: "Marcas premium para perros y gatos, de cachorro a senior.",
  },
  {
    emoji: "🦴",
    titulo: "Accesorios y juguetes",
    texto: "Correas, camas, comederos y todo para el día a día.",
  },
  {
    emoji: "🛁",
    titulo: "Estética",
    texto: "Baño, corte y deslanado con turno, sin esperas.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col gap-12">
      <section className="rounded-3xl bg-hero px-6 py-14 text-center text-white sm:px-12">
        <p className="mb-2 font-semibold text-acento">Río Cuarto · Córdoba</p>
        <h1 className="text-4xl font-extrabold sm:text-5xl">Todo para tu mascota, en un solo lugar</h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-white/90">
          En Mateo Pet Shop encontrás alimentos balanceados, accesorios y servicios de estética. Reservá el
          turno de tu mascota desde acá.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/productos"
            className="rounded-full bg-acento px-6 py-3 font-bold text-[#24302e] transition hover:brightness-95"
          >
            Ver productos
          </Link>
          <Link
            href="/servicios"
            className="rounded-full border border-white/70 px-6 py-3 font-bold text-white transition hover:bg-white/10"
          >
            Servicios de estética
          </Link>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        {destacados.map((item) => (
          <article key={item.titulo} className="rounded-2xl border border-borde bg-superficie p-6">
            <p className="text-3xl" aria-hidden="true">
              {item.emoji}
            </p>
            <h2 className="mt-3 text-lg font-bold">{item.titulo}</h2>
            <p className="mt-1 text-suave">{item.texto}</p>
          </article>
        ))}
      </section>
    </div>
  );
}