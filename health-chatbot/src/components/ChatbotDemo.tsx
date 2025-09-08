import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
  intent?: string;
  confidence?: number;
};

// Demo responses for offline mode
const getDemoResponse = (message: string, language: 'en' | 'hi'): string => {
  const lc = message.toLowerCase();
  
  if (lc.includes('fever') || lc.includes('बुखार')) {
    return language === 'hi' 
      ? 'बुखार के लिए: आराम करें, तरल पदार्थ लें, तापमान की निगरानी करें। यदि 102°F (39°C) से अधिक हो या 3 दिन तक रहे तो डॉक्टर से मिलें।'
      : 'For fever: Rest, drink fluids, monitor temperature. See a doctor if above 102°F (39°C) or persists for 3+ days.';
  }
  
  if (lc.includes('covid') || lc.includes('कोविड')) {
    return language === 'hi'
      ? 'कोविड-19 के लक्षण: बुखार, खांसी, सांस की तकलीफ, स्वाद/गंध का चले जाना। जांच कराएं और अलग रहें।'
      : 'COVID-19 symptoms: Fever, cough, shortness of breath, loss of taste/smell. Get tested and isolate.';
  }
  
  if (lc.includes('vaccine') || lc.includes('टीका')) {
    return language === 'hi'
      ? 'टीकाकरण कार्यक्रम:\n• जन्म: बीसीजी, हेपेटाइटिस बी\n• 6 सप्ताह: डीपीटी, पोलियो\n• 9 महीने: खसरा\n• वयस्कों के लिए: कोविड, इन्फ्लूएंजा टीके'
      : 'Vaccination Schedule:\n• Birth: BCG, Hepatitis B\n• 6 weeks: DPT, Polio\n• 9 months: Measles\n• Adults: COVID, Influenza vaccines';
  }
  
  if (lc.includes('dengue') || lc.includes('डेंगू')) {
    return language === 'hi'
      ? 'डेंगू की रोकथाम: जमा पानी हटाएं, मच्छर भगाने वाली दवा का उपयोग करें, पूरी आस्तीन के कपड़े पहनें।'
      : 'Dengue prevention: Remove stagnant water, use mosquito repellents, wear full sleeves.';
  }
  
  if (lc.includes('emergency') || lc.includes('आपातकाल')) {
    return language === 'hi'
      ? '🚨 आपातकाल:\n• राष्ट्रीय एम्बुलेंस: 108\n• सामान्य आपातकाल: 112\n• स्थानीय अस्पताल से तुरंत संपर्क करें'
      : '🚨 Emergency:\n• National Ambulance: 108\n• General Emergency: 112\n• Contact local hospital immediately';
  }
  
  return language === 'hi'
    ? 'मैं आपकी स्वास्थ्य संबंधी सहायता के लिए यहाँ हूँ। आप बुखार, कोविड, टीकाकरण, या डेंगू के बारे में पूछ सकते हैं।'
    : 'I\'m here to help with your health questions. You can ask about fever, COVID, vaccination, or dengue.';
};

export default function ChatbotDemo() {
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

  // Welcome message
  useEffect(() => {
    const welcomeMessage: Message = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: i18n.language.startsWith('hi') 
        ? '🙏 नमस्ते! मैं आपका स्वास्थ्य सहायक हूँ। मैं आपको बुखार, कोविड, टीकाकरण, और डेंगू के बारे में जानकारी दे सकता हूँ। कुछ भी पूछें!'
        : '👋 Hello! I\'m your health assistant. I can help you with information about fever, COVID, vaccination, and dengue. Ask me anything!',
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, [i18n.language]);

  const quickReplies = useMemo(() => {
    if (i18n.language.startsWith('hi')) {
      return [
        'मुझे बुखार है',
        'कोविड के लक्षण',
        'टीकाकरण की जानकारी',
        'डेंगू से कैसे बचें'
      ];
    }
    return [
      'I have fever',
      'COVID symptoms',
      'Vaccination info',
      'How to prevent dengue'
    ];
  }, [i18n.language]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = { 
      id: crypto.randomUUID(), 
      role: 'user', 
      content: text.trim(),
      timestamp: new Date()
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate API delay
    setTimeout(() => {
      const language = i18n.language.startsWith('hi') ? 'hi' : 'en';
      const response = getDemoResponse(text.trim(), language);
      
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
        confidence: 0.85
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 12 }}>
      {/* Demo Banner */}
      <div style={{ 
        background: '#fef3c7', 
        border: '1px solid #f59e0b', 
        borderRadius: 8, 
        padding: '8px 12px',
        fontSize: 14,
        color: '#92400e'
      }}>
        🚧 Demo Mode - Running with mock data. Full features available with backend setup.
      </div>

      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '8px 0' 
      }}>
        <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>
          {t('chatbot')} - Demo
        </h3>
      </div>

      {/* Chat Messages */}
      <div ref={listRef} style={{ 
        flex: 1, 
        overflowY: 'auto', 
        padding: '8px', 
        border: '1px solid #e5e7eb', 
        borderRadius: 8,
        minHeight: 300
      }}>
        {messages.map((m) => (
          <div key={m.id} style={{ 
            display: 'flex', 
            justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', 
            marginBottom: 12 
          }}>
            <div style={{
              maxWidth: '80%',
              padding: '10px 14px',
              borderRadius: 12,
              background: m.role === 'user' ? '#2563eb' : '#f3f4f6',
              color: m.role === 'user' ? 'white' : '#111827',
              whiteSpace: 'pre-wrap',
              boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
            }}>
              {m.content}
              {m.confidence && m.confidence < 0.7 && (
                <div style={{ 
                  fontSize: 10, 
                  marginTop: 4, 
                  opacity: 0.7 
                }}>
                  {i18n.language.startsWith('hi') 
                    ? 'यदि यह सहायक नहीं था, तो कृपया अधिक विस्तार से पूछें।'
                    : 'If this wasn\'t helpful, please ask with more details.'
                  }
                </div>
              )}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div style={{ 
            fontSize: 12, 
            color: '#6b7280', 
            fontStyle: 'italic',
            padding: '8px 14px'
          }}>
            {t('typing')}...
          </div>
        )}
      </div>

      {/* Quick Tips */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ fontWeight: 600, fontSize: 12, color: '#374151' }}>
          {t('quickTips')}:
        </span>
        {quickReplies.map((q) => (
          <button 
            key={q} 
            onClick={() => sendMessage(q)} 
            style={{ 
              fontSize: 12, 
              padding: '6px 12px', 
              border: '1px solid #d1d5db', 
              borderRadius: 20,
              background: 'white',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = '#f3f4f6';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'white';
            }}
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form onSubmit={(e) => { e.preventDefault(); sendMessage(input); }} style={{ 
        display: 'flex', 
        gap: 8 
      }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t('inputPlaceholder')}
          style={{ 
            flex: 1, 
            padding: '12px 16px', 
            borderRadius: 24, 
            border: '1px solid #d1d5db',
            fontSize: 14,
            outline: 'none'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#2563eb';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#d1d5db';
          }}
        />
        <button 
          type="submit" 
          disabled={!input.trim() || isTyping}
          style={{ 
            padding: '12px 20px', 
            borderRadius: 24, 
            background: input.trim() && !isTyping ? '#2563eb' : '#9ca3af', 
            color: 'white', 
            border: 'none',
            cursor: input.trim() && !isTyping ? 'pointer' : 'not-allowed',
            fontWeight: 600,
            transition: 'all 0.2s'
          }}
        >
          {isTyping ? '⏳' : '📤'} {t('send')}
        </button>
      </form>
    </div>
  );
}