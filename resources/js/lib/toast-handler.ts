import { handleAsyncAction } from '@/lib/toast';
import { router } from '@inertiajs/react';

type InertiaMethod = 'post' | 'put' | 'patch' | 'delete';

interface RouterPromiseOptions {
    onSuccess?: (page: any) => void;
    onError?: (errors: any) => void;
    [key: string]: any;
}

/**
 * Membungkus `router.*` Inertia ke dalam Promise,
 * sehingga bisa digunakan langsung dengan `handleAsyncAction`.
 *
 * @example
 * await handleAsyncAction(
 *   () => routerPromise("post", "/recipes", data),
 *   { loading: "Menyimpan...", success: "Resep berhasil disimpan!", error: "Gagal Menyimpan" }
 * )
 */
export function routerPromise(method: InertiaMethod, url: string, data: any = {}, options: RouterPromiseOptions = {}): Promise<any> {
    const { onSuccess, onError, ...restOptions } = options;

    return new Promise((resolve, reject) => {
        const inertiaOptions = {
            ...restOptions,
            onSuccess: (page: any) => {
                onSuccess?.(page);
                resolve(page);
            },
            onError: (errors: any) => {
                onError?.(errors);
                const firstError = errors && typeof errors === 'object' ? Object.values(errors)[0] : null;
                reject(new Error(typeof firstError === 'string' ? firstError : 'Terjadi kesalahan pada server.'));
            },
        };

        if (method === 'delete') {
            router.delete(url, inertiaOptions);
        } else {
            router[method](url, data, inertiaOptions);
        }
    });
}

export { handleAsyncAction };
