import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
    plugins: [react()],
    resolve: {
        // Entiende los imports "@/..." igual que Next, leyendo tsconfig.json
        tsconfigPaths: true,
    },
    test: {
        // jsdom simula un navegador para poder renderizar componentes
        environment: "jsdom",
    },
});