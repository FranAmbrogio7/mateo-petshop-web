import { NextResponse, type NextRequest } from "next/server";

// Rutas que requieren sesión: si no hay cookie con el token, se redirige al login
export function proxy(request: NextRequest) {
    const token = request.cookies.get("mateo_token")?.value;

    if (!token) {
        const login = new URL("/login", request.url);
        login.searchParams.set("siguiente", request.nextUrl.pathname);
        return NextResponse.redirect(login);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/mi-cuenta/:path*"],
};