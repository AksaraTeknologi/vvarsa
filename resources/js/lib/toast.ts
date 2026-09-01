import { toast } from 'sonner';
import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';

interface ToastMessages {
    loading?: string;
    success?: string | ((data: any) => string);
    error?: string | ((error: any) => string);
}

export async function handleAsyncAction<T>(apiCall: () => Promise<T>, messages?: ToastMessages): Promise<T | null> {
    const loadingMessage = messages?.loading || 'Sedang memproses data...';
    const successMessage = messages?.success || 'Aksi berhasil diselesaikan!';
    const errorMessage = messages?.error || 'Terjadi kesalahan, silakan coba lagi.';

    const toastId = Math.random().toString(36).substring(2, 9);

    toast.loading(loadingMessage, { id: toastId });

    try {
        const result = await apiCall();
        toast.dismiss(toastId); // Hapus loading, biar flash dari backend yang muncul
        return result;
    } catch (error: any) {
        toast.dismiss(toastId);
        const apiErrorMessage = error?.response?.data?.message || error?.message;

        let finalErrorMsg = '';
        if (typeof errorMessage === 'function') {
            finalErrorMsg = errorMessage(error);
        } else {
            finalErrorMsg = apiErrorMessage ? `${errorMessage}: ${apiErrorMessage}` : errorMessage;
        }

        toast.error(finalErrorMsg, { id: toastId });
        return null;
    }
}

// Variable di luar agar persisten saat React StrictMode remounting
let previousFlashStr: string | null = null;

// Komponen Global untuk menampilkan flash message secara otomatis menggunakan usePage
export function FlashMessageToaster() {
    const { props } = usePage<any>();
    const flash = props.flash;

    useEffect(() => {
        if (!flash) return;
        
        const isEmpty = !flash.success && !flash.error && !flash.warning && !flash.info;
        if (isEmpty) return;
        
        const currentFlashStr = JSON.stringify(flash);
        if (currentFlashStr === previousFlashStr) {
            return;
        }

        if (flash.success) toast.success(flash.success);
        if (flash.error) toast.error(flash.error);
        if (flash.warning) toast.warning(flash.warning);
        if (flash.info) toast.info(flash.info);

        previousFlashStr = currentFlashStr;
    }, [flash]);

    return null;
}
