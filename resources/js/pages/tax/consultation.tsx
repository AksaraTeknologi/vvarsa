import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, CheckCircle, Clock, MessageSquare, Phone, Shield } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function TaxConsultation() {
    const { t } = useTranslation();

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('navigation.tax'), href: '/tax' },
        { title: t('tax.consultation'), href: '/tax/consultation' },
    ];

    const quickContacts = [
        {
            icon: Phone,
            title: t('tax.contactKringTitle'),
            desc: t('tax.contactKringDesc'),
            value: '1500200',
            href: 'tel:1500200',
            color: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
        },
        {
            icon: MessageSquare,
            title: t('tax.contactLiveChatTitle'),
            desc: t('tax.contactLiveChatDesc'),
            value: t('tax.visitWebsite'),
            href: 'https://www.pajak.go.id',
            color: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
        },
        {
            icon: Clock,
            title: t('tax.contactServiceHoursTitle'),
            desc: t('tax.contactServiceHoursDesc'),
            value: t('tax.contactServiceHoursValue'),
            href: null,
            color: 'bg-amber-500/10 text-amber-700 dark:text-amber-400',
        },
    ];

    const taxObligations = [
        { title: 'PPh Final 0,5%', desc: t('tax.obligationPphDesc'), period: t('tax.periodMonthly') },
        { title: 'SPT Tahunan PPh OP', desc: t('tax.obligationSptDesc'), period: t('tax.periodAnnually') },
        { title: 'PPN (jika PKP)', desc: t('tax.obligationPpnDesc'), period: t('tax.periodMonthly') },
        { title: 'PPh 21 Karyawan', desc: t('tax.obligationPph21Desc'), period: t('tax.periodMonthly') },
    ];

    const faqItems = [
        { q: t('tax.faq.q1'), a: t('tax.faq.a1') },
        { q: t('tax.faq.q2'), a: t('tax.faq.a2') },
        { q: t('tax.faq.q3'), a: t('tax.faq.a3') },
        { q: t('tax.faq.q4'), a: t('tax.faq.a4') },
        { q: t('tax.faq.q5'), a: t('tax.faq.a5') },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('tax.consultation')} />
            <div className="p-4 md:p-6">
                <div className="mb-6">
                    <Link href="/tax" className="hover:bg-muted inline-flex items-center gap-2 rounded-xl p-2 text-sm transition-colors">
                        <ArrowLeft size={16} />
                        {t('tax.backToReports')}
                    </Link>
                </div>

                <div className="mx-auto max-w-3xl">
                    {/* Header */}
                    <div className="mb-6 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
                        <div className="flex items-center gap-3">
                            <Shield size={32} className="shrink-0 text-white/80" />
                            <div>
                                <h1 className="text-2xl font-bold">{t('tax.consultationBannerTitle')}</h1>
                                <p className="mt-1 text-white/80">{t('tax.consultationBannerDesc')}</p>
                            </div>
                        </div>
                    </div>

                    {/* Quick Contacts */}
                    <div className="mb-6 grid gap-4 sm:grid-cols-3">
                        {quickContacts.map(({ icon: Icon, title, desc, value, href, color }) => (
                            <div key={title} className={`rounded-2xl p-4 ${color}`}>
                                <Icon size={20} className="mb-2" />
                                <p className="font-semibold">{title}</p>
                                <p className="text-xs opacity-70">{desc}</p>
                                {href ? (
                                    <a href={href} target="_blank" rel="noopener noreferrer" className="mt-1 block text-sm font-medium underline">
                                        {value}
                                    </a>
                                ) : (
                                    <p className="mt-1 text-sm font-medium">{value}</p>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Key Tax Obligations */}
                    <div className="bg-card border-border mb-6 rounded-2xl border p-5 shadow-sm">
                        <h2 className="mb-4 font-semibold">{t('tax.keyObligations')}</h2>
                        <div className="space-y-3">
                            {taxObligations.map((item) => (
                                <div key={item.title} className="flex items-start gap-3">
                                    <CheckCircle size={16} className="mt-0.5 shrink-0 text-emerald-500" />
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-medium">{item.title}</p>
                                            <span className="bg-muted rounded-full px-2 py-0.5 text-xs">{item.period}</span>
                                        </div>
                                        <p className="text-muted-foreground mt-0.5 text-xs">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* FAQ */}
                    <div className="bg-card border-border rounded-2xl border p-5 shadow-sm">
                        <h2 className="mb-4 font-semibold">{t('tax.faqTitle')}</h2>
                        <div className="space-y-4">
                            {faqItems.map((item, i) => (
                                <div key={i} className="border-border border-b pb-4 last:border-0 last:pb-0">
                                    <p className="mb-1.5 text-sm font-semibold">{item.q}</p>
                                    <p className="text-muted-foreground text-sm">{item.a}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
