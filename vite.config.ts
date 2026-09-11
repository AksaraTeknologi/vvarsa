import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';

function pageEntries(directory: string): string[] {
    return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
        const path = resolve(directory, entry.name);

        if (entry.isDirectory()) return pageEntries(path);

        return entry.isFile() && /\.(tsx|ts)$/.test(entry.name) ? [path] : [];
    });
}

const pageInputs = pageEntries(resolve(__dirname, 'resources/js/pages'));

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx', ...pageInputs],
            ssr: 'resources/js/ssr.tsx',
            refresh: true,
        }),
        react(),
        tailwindcss(),
    ],
    server: {
        host: 'localhost',
        port: 5173,
        strictPort: true,
        hmr: {
            host: 'localhost',
            port: 5173,
        },
    },
    preview: {
        host: 'localhost',
        port: 4173,
        strictPort: true,
    },
    esbuild: {
        jsx: 'automatic',
    },
    resolve: {
        alias: {
            'ziggy-js': resolve(__dirname, 'vendor/tightenco/ziggy'),
        },
    },
});
