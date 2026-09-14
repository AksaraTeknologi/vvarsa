import { Button } from '@/components/ui/button';
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
            color: 'bg-owner-accent text-white',
        },
        {
            icon: MessageSquare,
            title: t('tax.contactLiveChatTitle'),
            desc: t('tax.contactLiveChatDesc'),
            value: t('tax.visitWebsite'),
            href: 'https://www.pajak.go.id',
            color: 'bg-owner-accent text-white',
        },
        {
            icon: Clock,
            title: t('tax.contactServiceHoursTitle'),
            desc: t('tax.contactServiceHoursDesc'),
            value: t('tax.contactServiceHoursValue'),
            href: null,
            color: 'bg-owner-accent text-white',
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
            <div className="business-page w-full p-4 md:p-6">
                <div className="mb-6">
                    <Button variant="ghost" asChild className="h-10 rounded-xl px-3 text-sm">
                        <Link href="/tax" aria-label={t('tax.backToReports')}>
                            <ArrowLeft size={18} />
                            {t('tax.backToReports')}
                        </Link>
                    </Button>
                </div>

                <div>
                    {/* Header */}
                    <div className="mb-6 rounded-2xl border border-owner-accent/30 bg-white p-5 shadow-sm md:p-6">
                        <div className="flex items-center gap-3">
                            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-owner-accent text-white">
                                <Shield size={22} />
                            </div>
                            <div>
                                <h1 className="text-[1.8rem] leading-none font-bold tracking-[-0.05em] text-[#1f2a23] md:text-[2.1rem]">{t('tax.consultationBannerTitle')}</h1>
                                <p className="text-muted-foreground mt-2 text-sm leading-relaxed md:text-[0.95rem]">{t('tax.consultationBannerDesc')}</p>
                            </div>
                        </div>
                    </div>

                    {/* Quick Contacts */}
                    <div className="mb-6 grid gap-4 [perspective:1100px] sm:grid-cols-3">
                        {quickContacts.map(({ icon: Icon, title, desc, value, href, color }) => (
                            <div
                                key={title}
                                className={`group rounded-2xl border border-owner-accent p-4 shadow-sm [transform-style:preserve-3d] transition-[transform,box-shadow,border-color] duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_14px_24px_rgba(90,166,122,0.24)] hover:[transform:rotateX(2deg)_rotateY(-1.5deg)_translateZ(5px)] motion-reduce:transition-none motion-reduce:hover:transform-none ${color}`}
                            >
                                <Icon size={20} className="mb-2 [transform:translateZ(5px)]" />
                                <p className="text-sm font-semibold text-white [transform:translateZ(3px)]">{title}</p>
                                <p className="mt-1 text-sm leading-relaxed text-white/80">{desc}</p>
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
                        <h2 className="mb-4 text-sm font-semibold">{t('tax.keyObligations')}</h2>
                        <div className="space-y-3">
                            {taxObligations.map((item) => (
                                <div key={item.title} className="flex items-start gap-3">
                                    <CheckCircle size={16} className="mt-0.5 shrink-0 text-owner-accent" />
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-medium">{item.title}</p>
                                            <span className="bg-muted rounded-full px-2 py-0.5 text-sm">{item.period}</span>
                                        </div>
                                        <p className="text-muted-foreground mt-1 text-sm leading-relaxed">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* FAQ */}
                    <div className="bg-card border-border rounded-2xl border p-5 shadow-sm">
                        <h2 className="mb-4 text-sm font-semibold">{t('tax.faqTitle')}</h2>
                        <div className="space-y-3 [perspective:1100px]">
                            {faqItems.map((item, i) => (
                                <div
                                    key={i}
                                    className="overflow-hidden rounded-xl border border-owner-accent/25 bg-white shadow-sm [transform-style:preserve-3d] transition-[transform,box-shadow,border-color] duration-300 ease-out hover:-translate-y-0.5 hover:border-owner-accent/50 hover:shadow-[0_10px_18px_rgba(90,166,122,0.12)] hover:[transform:rotateX(1deg)_translateZ(3px)] motion-reduce:transition-none motion-reduce:hover:transform-none"
                                >
                                    <p className="bg-owner-accent px-4 py-3 text-sm font-semibold text-white">{item.q}</p>
                                    <p className="border-t border-owner-accent/15 px-4 py-3 text-sm leading-relaxed text-muted-foreground">{item.a}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
