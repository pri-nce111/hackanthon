import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

export default function Chatbot() {
  const { t, i18n } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  const quickReplies = useMemo(() => [
    t('tipHandwash'),
    t('tipMask'),
    t('tipBooster'),
  ], [i18n.language]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    const userMessage: Message = { id: crypto.randomUUID(), role: 'user', content: text.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Placeholder: rule-based response for demo; replace with API call to model + gov DB
    const response = await new Promise<string>((resolve) => {
      setTimeout(() => {
        const lc = text.toLowerCase();
        if (lc.includes('fever') || lc.includes('बुखार') || lc.includes('fiebre')) {
          resolve('Fever can have many causes. Drink fluids, rest, monitor temperature. Seek care if above 102°F/39°C or with severe symptoms.');
        } else if (lc.includes('vaccine') || lc.includes('टीका') || lc.includes('vacuna')) {
          resolve('Vaccination schedules vary by age. Please consult official schedule. Keep records and complete all doses.');
        } else if (lc.includes('dengue')) {
          resolve('To prevent dengue, remove stagnant water, use mosquito repellents, and wear full sleeves. If high fever with pain, seek care.');
        } else {
          resolve('I will try to help. Could you share age, symptoms, and duration? This is informational only and not a substitute for professional medical advice.');
        }
      }, 700);
    });

    setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: 'assistant', content: response }]);
    setIsTyping(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 12 }}>
      <div ref={listRef} style={{ flex: 1, overflowY: 'auto', padding: '8px', border: '1px solid #e5e7eb', borderRadius: 8 }}>
        {messages.map((m) => (
          <div key={m.id} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', marginBottom: 8 }}>
            <div style={{
              maxWidth: '80%',
              padding: '8px 10px',
              borderRadius: 10,
              background: m.role === 'user' ? '#dbeafe' : '#f3f4f6',
              color: '#111827',
              whiteSpace: 'pre-wrap'
            }}>{m.content}</div>
          </div>
        ))}
        {isTyping && (
          <div style={{ fontSize: 12, color: '#6b7280' }}>{t('typing')}</div>
        )}
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <span style={{ fontWeight: 600, fontSize: 12, color: '#374151' }}>{t('quickTips')}:</span>
        {quickReplies.map((q) => (
          <button key={q} onClick={() => sendMessage(q)} style={{ fontSize: 12, padding: '6px 8px', border: '1px solid #d1d5db', borderRadius: 999 }}>{q}</button>
        ))}
      </div>

      <form onSubmit={(e) => { e.preventDefault(); sendMessage(input); }} style={{ display: 'flex', gap: 8 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t('inputPlaceholder')}
          style={{ flex: 1, padding: '10px 12px', borderRadius: 8, border: '1px solid #d1d5db' }}
        />
        <button type="submit" style={{ padding: '10px 14px', borderRadius: 8, background: '#2563eb', color: 'white', border: 'none' }}>
          {t('send')}
        </button>
      </form>
    </div>
  );
}

