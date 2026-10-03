import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';
import { useTranslation } from 'react-i18next';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { withAuthLayout } from '@/layouts/auth-layout';

type RegisterForm = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
};

export default function Register() {
    const { t } = useTranslation();
    const { data, setData, post, processing, errors, reset } = useForm<Required<RegisterForm>>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <>
            <Head title={t('auth.register.submitButton', 'Create account')} />

            <form className="flex flex-col gap-6" onSubmit={submit}>
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="name">{t('auth.register.nameLabel', 'Full Name')}</Label>
                        <Input
                            id="name"
                            type="text"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            disabled={processing}
                            placeholder={t('auth.register.namePlaceholder', 'Full name')}
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email">{t('auth.register.emailLabel', 'Email address')}</Label>
                        <Input
                            id="email"
                            type="email"
                            required
                            tabIndex={2}
                            autoComplete="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            disabled={processing}
                            placeholder={t('auth.register.emailPlaceholder', 'email@example.com')}
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password">{t('auth.register.passwordLabel', 'Password')}</Label>
                        <Input
                            id="password"
                            type="password"
                            required
                            tabIndex={3}
                            autoComplete="new-password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            disabled={processing}
                            placeholder={t('auth.register.passwordPlaceholder', 'Password')}
                        />
                        <InputError message={errors.password} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password_confirmation">{t('auth.register.confirmPasswordLabel', 'Confirm password')}</Label>
                        <Input
                            id="password_confirmation"
                            type="password"
                            required
                            tabIndex={4}
                            autoComplete="new-password"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            disabled={processing}
                            placeholder={t('auth.register.confirmPasswordPlaceholder', 'Confirm password')}
                        />
                        <InputError message={errors.password_confirmation} />
                    </div>

                    <Button type="submit" variant="default" className="mt-2 w-full shadow-lg transition duration-200 hover:-translate-y-0.5 dark:bg-[#5E4BF2] dark:text-white dark:hover:bg-[#4938D9] dark:shadow-[0_4px_20px_rgba(94,75,242,0.45)]" tabIndex={5} disabled={processing}>
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        {processing ? t('auth.register.registering', 'Creating account...') : t('auth.register.submitButton', 'Create account')}
                    </Button>
                </div>

                <div className="text-center text-sm text-neutral-600 dark:text-[#C5C3D6]">
                    {t('auth.register.haveAccount', 'Already have an account?')}{' '}
                    <TextLink href={route('login')} tabIndex={6} className="dark:text-[#D8F380] dark:hover:text-[#e5f8a0]">
                        {t('auth.register.logIn', 'Log in')}
                    </TextLink>
                </div>
            </form>
        </>
    );
}

// Pasang Persistent Layout
Register.layout = withAuthLayout;

