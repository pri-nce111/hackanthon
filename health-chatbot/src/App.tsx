import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/Home'
import Learn from './pages/Learn'
import Chat from './pages/Chat'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header currentLanguage={navigator.language.startsWith('hi') ? 'hi' : navigator.language.startsWith('es') ? 'es' : 'en'} />
        <nav style={{ display: 'flex', gap: 12, padding: '8px 16px', borderBottom: '1px solid #e5e7eb' }}>
          <Link to="/">Home</Link>
          <Link to="/learn">Learn</Link>
          <Link to="/chat">Chatbot</Link>
        </nav>
        <main style={{ flex: 1, padding: 16 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="/chat" element={<Chat />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
