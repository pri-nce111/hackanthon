import { useTranslation } from 'react-i18next'

const SCHEDULE = [
  { age: 'At Birth', vaccine: 'BCG, OPV-0, HepB-0', dose: '1 each' },
  { age: '6, 10, 14 weeks', vaccine: 'OPV, Pentavalent (DPT+HepB+Hib), Rotavirus', dose: 'As per schedule' },
  { age: '9–12 months', vaccine: 'Measles-Rubella (MR)', dose: '1' },
  { age: '16–24 months', vaccine: 'DPT/OPV boosters', dose: 'Boosters' },
]

function Vaccination() {
  const { t } = useTranslation()
  return (
    <div>
      <h3>{t('vax.title')}</h3>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #ccc', padding: 8 }}>{t('vax.age')}</th>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #ccc', padding: 8 }}>{t('vax.vaccine')}</th>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #ccc', padding: 8 }}>{t('vax.dose')}</th>
            </tr>
          </thead>
          <tbody>
            {SCHEDULE.map((row, idx) => (
              <tr key={idx}>
                <td style={{ borderBottom: '1px solid #eee', padding: 8 }}>{row.age}</td>
                <td style={{ borderBottom: '1px solid #eee', padding: 8 }}>{row.vaccine}</td>
                <td style={{ borderBottom: '1px solid #eee', padding: 8 }}>{row.dose}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Vaccination

