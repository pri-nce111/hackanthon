import AlertBanner from '../components/AlertBanner';
import { useTranslation } from 'react-i18next';

export default function Home() {
  const { t } = useTranslation();
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <h1 style={{ fontSize: 24, margin: 0 }}>{t('welcomeHeadline')}</h1>
      <p style={{ margin: 0, color: '#374151' }}>{t('welcomeSub')}</p>
      <AlertBanner />
    </div>
  );
}

