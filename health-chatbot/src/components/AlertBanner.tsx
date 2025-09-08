import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

type Alert = {
  id: string;
  disease: string;
  level: 'info' | 'warning' | 'critical';
  message: string;
};

export default function AlertBanner() {
  const { t } = useTranslation();
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    let isMounted = true;
    // Placeholder: simulate fetching government outbreak alerts
    const timer = setTimeout(() => {
      if (!isMounted) return;
      setAlerts([
        {
          id: '1',
          disease: 'Dengue',
          level: 'warning',
          message: 'Increased cases reported in your district. Remove stagnant water and use repellents.'
        },
      ]);
    }, 600);
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, []);

  if (alerts.length === 0) {
    return (
      <div style={{ background: '#f3f4f6', color: '#374151', padding: '8px 12px', borderRadius: 8, fontSize: 14 }}>
        {t('alertsEmpty')}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {alerts.map((a) => (
        <div key={a.id} style={{
          padding: '10px 12px',
          borderRadius: 8,
          border: '1px solid #e5e7eb',
          background: a.level === 'critical' ? '#fee2e2' : a.level === 'warning' ? '#fef3c7' : '#e0f2fe',
          color: '#111827'
        }}>
          <strong>{a.disease}</strong>: {a.message}
        </div>
      ))}
    </div>
  );
}

