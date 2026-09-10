import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

export function LanguageSwitcher({ className }: { className?: string }) {
    const { i18n, t } = useTranslation();
    const language = i18n.language === 'en' ? 'en' : 'id';

    const setLanguage = (nextLanguage: 'id' | 'en') => {
        void i18n.changeLanguage(nextLanguage);
        window.localStorage.setItem('vvarsa.language', nextLanguage);
    };

    return (
        <div className={cn('flex items-center gap-1', className)} aria-label={t('common.language')}>
            <Button type="button" variant={language === 'id' ? 'secondary' : 'ghost'} size="sm" onClick={() => setLanguage('id')}>
                🇮🇩 ID
            </Button>
            <Button type="button" variant={language === 'en' ? 'secondary' : 'ghost'} size="sm" onClick={() => setLanguage('en')}>
                🇬🇧 EN
            </Button>
        </div>
    );
}