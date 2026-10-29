import type { Metadata } from "next";
import { Nunito } from "next/font/google";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "@/context/ThemeContext";

import { SesionProvider } from "@/context/SesionContext";
import { obtenerUsuario } from "@/lib/sesion";

import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Mateo Pet Shop",
    template: "%s · Mateo Pet Shop",
  },
  description: "Alimentos balanceados, accesorios y estética para tu mascota en Río Cuarto.",
};

// Se ejecuta antes de pintar la página: aplica el tema guardado y evita el destello de tema claro
const scriptTema = `(function(){try{var t=localStorage.getItem('mateo-tema');if(t==='oscuro'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}})();`;

export default async function RootLayout({ children }: LayoutProps<"/">) {
  // Se lee la cookie en el servidor y se comparte con los componentes cliente por SesionContext
  const usuario = await obtenerUsuario();

  return (
    <html lang="es" className={`${nunito.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: scriptTema }} />
      </head>
      <body className="flex min-h-full flex-col font-sans">
        <ThemeProvider>
          <SesionProvider usuario={usuario}>
            <Navbar />
            <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">{children}</main>
            <Footer />
          </SesionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}