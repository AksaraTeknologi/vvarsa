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
    resolve: async (name) => {
        const page = await resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx'));
        
        const pageModule = page as any;
        const originalLayout = pageModule.default.layout || ((pageContent: any) => pageContent);
        
        pageModule.default.layout = (pageContent: any) => {
            return (
                <>
                    <FlashMessageToaster />
                    {originalLayout(pageContent)}
                </>
            );
        };
        
        return pageModule;
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
