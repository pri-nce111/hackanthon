import { useTranslation } from 'react-i18next';

type HeaderProps = {
  onLanguageChange?: (lng: string) => void;
  currentLanguage: string;
};

export default function Header({ onLanguageChange, currentLanguage }: HeaderProps) {
  const { t, i18n } = useTranslation();

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = event.target.value;
    i18n.changeLanguage(newLang);
    onLanguageChange?.(newLang);
  };

  return (
    <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid #e5e7eb' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
        <span style={{ fontSize: 20, fontWeight: 700 }}>🩺 {t('appName')}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <label htmlFor="lng" style={{ fontSize: 14, color: '#374151' }}>{t('language')}</label>
        <select id="lng" value={currentLanguage} onChange={handleChange} style={{ padding: '6px 8px', borderRadius: 6, border: '1px solid #d1d5db' }}>
          <option value="en">English</option>
          <option value="hi">हिन्दी</option>
          <option value="es">Español</option>
        </select>
      </div>
    </header>
  );
}

