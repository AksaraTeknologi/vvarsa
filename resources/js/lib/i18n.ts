import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '@/locales/en.json';
import id from '@/locales/id.json';

const savedLanguage = typeof window !== 'undefined' ? window.localStorage.getItem('vvarsa.language') : null;

void i18n.use(initReactI18next).init({
    resources: { id: { translation: id }, en: { translation: en } },
    lng: savedLanguage === 'en' ? 'en' : 'id',
    fallbackLng: 'id',
    interpolation: { escapeValue: false },
});

export default i18n;