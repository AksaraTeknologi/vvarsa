import InputError from '@/components/input-error';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { cn } from '@/lib/utils';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useRef } from 'react';

import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Password settings',
        href: '/settings/password',
    },
];

export default function Password() {
    const { auth } = usePage<SharedData>().props;
    const isAdmin = auth.user?.roles?.includes('admin') || auth.user?.role === 'admin';
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    const { data, setData, errors, put, reset, processing, recentlySuccessful } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword: FormEventHandler = (e) => {
        e.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current?.focus();
                }

                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current?.focus();
                }
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile settings" />

            <SettingsLayout>
                <div
                    className={cn(
                        'space-y-5 rounded-2xl p-5 md:p-6',
                        isAdmin
                            ? 'border border-[#DCD8FF] bg-white text-neutral-900 shadow-sm dark:border-[#2b2d4b] dark:bg-[#16172b] dark:text-white'
                            : 'border border-[#4ec77e]/30 bg-[#0c1d17] shadow-[0_20px_60px_rgba(7,20,15,0.7)]',
                    )}
                >
                    <HeadingSmall title="Update password" description="Ensure your account is using a long, random password to stay secure" />

                    <form onSubmit={updatePassword} className="space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="current_password" className={cn('text-sm font-medium', isAdmin ? 'text-neutral-800 dark:text-white' : 'text-[#f4fff8]')}>
                                Current password
                            </Label>

                            <Input
                                id="current_password"
                                ref={currentPasswordInput}
                                value={data.current_password}
                                onChange={(e) => setData('current_password', e.target.value)}
                                type="password"
                                className={cn(
                                    'mt-1 block h-10 w-full rounded-xl px-3 text-sm border',
                                    isAdmin
                                        ? 'border-[#E2DFFA] bg-white text-neutral-900 placeholder:text-neutral-400 focus-visible:border-[#5E4BF2] focus-visible:ring-[#5E4BF2]/20 dark:border-[#2f3154] dark:bg-[#1e1f38] dark:text-white dark:placeholder:text-[#8d8ba7]'
                                        : 'border-[#4ec77e]/30 bg-[#0e221b] text-[#ecfff5] placeholder:text-[#cfead9] focus-visible:border-[#76dba0] focus-visible:ring-[#4ec77e]/30',
                                )}
                                autoComplete="current-password"
                                placeholder="Current password"
                            />

                            <InputError message={errors.current_password} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password" className={cn('text-sm font-medium', isAdmin ? 'text-neutral-800 dark:text-white' : 'text-[#f4fff8]')}>
                                New password
                            </Label>

                            <Input
                                id="password"
                                ref={passwordInput}
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                type="password"
                                className={cn(
                                    'mt-1 block h-10 w-full rounded-xl px-3 text-sm border',
                                    isAdmin
                                        ? 'border-[#E2DFFA] bg-white text-neutral-900 placeholder:text-neutral-400 focus-visible:border-[#5E4BF2] focus-visible:ring-[#5E4BF2]/20 dark:border-[#2f3154] dark:bg-[#1e1f38] dark:text-white dark:placeholder:text-[#8d8ba7]'
                                        : 'border-[#4ec77e]/30 bg-[#0e221b] text-[#ecfff5] placeholder:text-[#cfead9] focus-visible:border-[#76dba0] focus-visible:ring-[#4ec77e]/30',
                                )}
                                autoComplete="new-password"
                                placeholder="New password"
                            />

                            <InputError message={errors.password} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password_confirmation" className={cn('text-sm font-medium', isAdmin ? 'text-neutral-800 dark:text-white' : 'text-[#f4fff8]')}>
                                Confirm password
                            </Label>

                            <Input
                                id="password_confirmation"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                type="password"
                                className={cn(
                                    'mt-1 block h-10 w-full rounded-xl px-3 text-sm border',
                                    isAdmin
                                        ? 'border-[#E2DFFA] bg-white text-neutral-900 placeholder:text-neutral-400 focus-visible:border-[#5E4BF2] focus-visible:ring-[#5E4BF2]/20 dark:border-[#2f3154] dark:bg-[#1e1f38] dark:text-white dark:placeholder:text-[#8d8ba7]'
                                        : 'border-[#4ec77e]/30 bg-[#0e221b] text-[#ecfff5] placeholder:text-[#cfead9] focus-visible:border-[#76dba0] focus-visible:ring-[#4ec77e]/30',
                                )}
                                autoComplete="new-password"
                                placeholder="Confirm password"
                            />

                            <InputError message={errors.password_confirmation} />
                        </div>

                        <div className="flex items-center gap-4">
                            <Button disabled={processing} variant={isAdmin ? 'admin' : 'owner'} className="rounded-xl">
                                Save password
                            </Button>

                            <Transition
                                show={recentlySuccessful}
                                enter="transition ease-in-out"
                                enterFrom="opacity-0"
                                leave="transition ease-in-out"
                                leaveTo="opacity-0"
                            >
                                <p className="text-sm text-neutral-600 dark:text-[#d4d0e6]">Saved</p>
                            </Transition>
                        </div>
                    </form>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
