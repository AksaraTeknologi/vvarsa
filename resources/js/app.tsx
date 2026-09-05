import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { initializeTheme } from './hooks/use-appearance';

import { Toaster } from '@/components/ui/sonner';
import { FlashMessageToaster } from '@/lib/toast';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => {
        return resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx'));
    },
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <>
                <App {...props} />
                <Toaster position="top-right" richColors theme="light" />
            </>,
        );
    },
    progress: {
        color: '#4B5563',
    },
});

initializeTheme();
