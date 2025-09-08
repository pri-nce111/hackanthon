import './App.css'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from './components/LanguageSwitcher'
import Chat from './components/Chat'
import Alerts from './components/Alerts'
import Vaccination from './components/Vaccination'

function App() {
  const { t } = useTranslation()
  return (
    <div style={{ maxWidth: 980, margin: '0 auto', padding: 16, textAlign: 'left' }}>
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 16 }}>
        <h1 style={{ margin: 0, fontSize: 24 }}>{t('app.title')}</h1>
        <LanguageSwitcher />
      </header>

      <nav style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 12, color: '#666' }}>
        <span>• {t('nav.chat')}</span>
        <span>• {t('nav.alerts')}</span>
        <span>• {t('nav.vaccinations')}</span>
      </nav>

      <main style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
        <section style={{ minHeight: 420 }}>
          <Chat />
        </section>
        <aside style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ padding: 12, border: '1px solid #ddd', borderRadius: 8 }}>
            <Alerts />
          </div>
          <div style={{ padding: 12, border: '1px solid #ddd', borderRadius: 8 }}>
            <Vaccination />
          </div>
        </aside>
      </main>

      <footer style={{ marginTop: 24, color: '#666', fontSize: 12 }}>
        {t('footer.disclaimer')}
      </footer>
    </div>
  )
}

export default App
