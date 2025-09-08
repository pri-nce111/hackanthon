import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { KNOWLEDGE_BASE } from '../data/knowledgeBase'
import { scoreTextAgainstPatterns } from '../utils/textMatch'

function matchAnswerKey(question) {
  let bestKey = null
  let bestScore = 0
  for (const item of KNOWLEDGE_BASE) {
    const score = scoreTextAgainstPatterns(question, item.patterns)
    if (score > bestScore) {
      bestScore = score
      bestKey = item.key
    }
  }
  return bestScore >= 0.34 ? bestKey : null
}

function Chat() {
  const { t } = useTranslation()
  const [messages, setMessages] = useState([
    { role: 'assistant', text: t('chat.assistantDisclaimer') },
  ])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)

  const onSend = async () => {
    if (!input.trim()) return
    const userText = input.trim()
    setInput('')
    setMessages((prev) => [...prev, { role: 'user', text: userText }])
    setSending(true)
    try {
      const key = matchAnswerKey(userText)
      const answer = key ? t(key) : t('kb.fallback')
      setMessages((prev) => [...prev, { role: 'assistant', text: answer }])
    } finally {
      setSending(false)
    }
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onSend()
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, height: '100%' }}>
      <div
        role="log"
        aria-live="polite"
        style={{
          flex: 1,
          overflow: 'auto',
          padding: 12,
          border: '1px solid #ccc',
          borderRadius: 8,
          background: 'var(--chat-bg, rgba(0,0,0,0.03))',
        }}
      >
        {messages.map((m, idx) => (
          <div key={idx} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', margin: '6px 0' }}>
            <div
              style={{
                maxWidth: 560,
                padding: '10px 12px',
                borderRadius: 12,
                background: m.role === 'user' ? '#646cff' : '#f1f1f1',
                color: m.role === 'user' ? '#fff' : '#222',
                whiteSpace: 'pre-wrap',
              }}
            >
              {m.text}
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <textarea
          placeholder={t('chat.placeholder')}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          rows={2}
          style={{ flex: 1, padding: 10, borderRadius: 8, border: '1px solid #ccc' }}
        />
        <button onClick={onSend} disabled={sending} aria-label={t('chat.send')}>
          {t('chat.send')}
        </button>
      </div>
    </div>
  )
}

export default Chat

