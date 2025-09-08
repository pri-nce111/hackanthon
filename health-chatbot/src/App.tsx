import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/Home'
import Learn from './pages/Learn'
import Chat from './pages/Chat'
import AdminDemo from './pages/AdminDemo'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header currentLanguage={navigator.language.startsWith('hi') ? 'hi' : navigator.language.startsWith('es') ? 'es' : 'en'} />
        <nav style={{ 
          display: 'flex', 
          gap: 12, 
          padding: '8px 16px', 
          borderBottom: '1px solid #e5e7eb',
          background: '#f9fafb'
        }}>
          <Link 
            to="/" 
            style={{ 
              textDecoration: 'none', 
              padding: '8px 16px', 
              borderRadius: 6,
              color: '#374151',
              fontWeight: 500,
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = '#e5e7eb';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            🏠 Home
          </Link>
          <Link 
            to="/learn"
            style={{ 
              textDecoration: 'none', 
              padding: '8px 16px', 
              borderRadius: 6,
              color: '#374151',
              fontWeight: 500,
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = '#e5e7eb';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            📚 Learn
          </Link>
          <Link 
            to="/chat"
            style={{ 
              textDecoration: 'none', 
              padding: '8px 16px', 
              borderRadius: 6,
              color: '#374151',
              fontWeight: 500,
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = '#e5e7eb';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            💬 Chatbot
          </Link>
          <Link 
            to="/admin"
            style={{ 
              textDecoration: 'none', 
              padding: '8px 16px', 
              borderRadius: 6,
              color: '#dc2626',
              fontWeight: 500,
              transition: 'all 0.2s',
              marginLeft: 'auto'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = '#fee2e2';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            ⚙️ Admin
          </Link>
        </nav>
        <main style={{ flex: 1, padding: 16 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/admin" element={<AdminDemo />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
