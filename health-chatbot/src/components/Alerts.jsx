import useSWR from 'swr'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'

const fetcher = async (url) => {
  try {
    const res = await fetch(url)
    if (!res.ok) throw new Error('Failed to fetch alerts')
    return await res.json()
  } catch (e) {
    // Fallback to sample data
    return {
      updatedAt: new Date().toISOString(),
      alerts: [
        { id: 'al1', disease: 'Dengue', district: 'Pune', severity: 'High' },
        { id: 'al2', disease: 'Chikungunya', district: 'Nashik', severity: 'Medium' },
      ],
    }
  }
}

function Alerts() {
  const { t } = useTranslation()
  const { data } = useSWR(
    import.meta.env.VITE_ALERTS_URL || '/api/alerts.json',
    fetcher,
    { refreshInterval: 60_000 }
  )

  const alerts = data?.alerts || []
  const updatedAt = data?.updatedAt

  return (
    <div style={{ textAlign: 'left' }}>
      <h3>{t('alerts.title')}</h3>
      {updatedAt && (
        <div style={{ color: '#666', fontSize: 12 }}>
          {t('alerts.updated')}: {dayjs(updatedAt).format('DD MMM YYYY, HH:mm')}
        </div>
      )}
      {alerts.length === 0 ? (
        <p>{t('alerts.empty')}</p>
      ) : (
        <ul style={{ paddingLeft: 18 }}>
          {alerts.map((a) => (
            <li key={a.id} style={{ margin: '8px 0' }}>
              <strong>{a.disease}</strong> — {a.district} ({a.severity})
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Alerts

