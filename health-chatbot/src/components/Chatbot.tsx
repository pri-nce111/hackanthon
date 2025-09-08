import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
  intent?: string;
  confidence?: number;
};

const API_BASE_URL = 'http://localhost:3001/api';

export default function Chatbot() {
  const { t, i18n } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [location, setLocation] = useState({ state: '', district: '', pincode: '' });
  const [showSettings, setShowSettings] = useState(false);
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
    
    // Check if phone number is provided for first message
    if (messages.length === 0 && !phoneNumber) {
      alert(t('phoneRequired') || 'Please provide your phone number in settings first.');
      setShowSettings(true);
      return;
    }

    const userMessage: Message = { 
      id: crypto.randomUUID(), 
      role: 'user', 
      content: text.trim(),
      timestamp: new Date()
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/chat/message`, {
        message: text.trim(),
        phoneNumber: phoneNumber || '+919999999999', // Default for demo
        language: i18n.language.startsWith('hi') ? 'hi' : 'en',
        location: location.pincode ? location : undefined
      });

      const { data } = response.data;
      
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: data.message,
        timestamp: new Date(),
        intent: data.intent,
        confidence: data.confidence
      };

      setMessages((prev) => [...prev, assistantMessage]);
      
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: i18n.language.startsWith('hi') 
          ? 'क्षमा करें, कुछ गलत हुआ है। कृपया दोबारा कोशिश करें।'
          : 'Sorry, something went wrong. Please try again.',
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 12 }}>
      {/* Settings Panel */}
      {showSettings && (
        <div style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          background: 'rgba(0,0,0,0.5)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          zIndex: 1000 
        }}>
          <div style={{ 
            background: 'white', 
            padding: 24, 
            borderRadius: 12, 
            width: '90%', 
            maxWidth: 400 
          }}>
            <h3 style={{ margin: '0 0 16px 0' }}>{t('settings') || 'Settings'}</h3>
            
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>
                {t('phoneNumber') || 'Phone Number'}
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+91 9999999999"
                style={{ 
                  width: '100%', 
                  padding: '10px 12px', 
                  borderRadius: 8, 
                  border: '1px solid #d1d5db' 
                }}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>
                {t('location') || 'Location (Optional)'}
              </label>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  type="text"
                  value={location.state}
                  onChange={(e) => setLocation(prev => ({ ...prev, state: e.target.value }))}
                  placeholder={t('state') || 'State'}
                  style={{ 
                    flex: 1, 
                    padding: '8px 10px', 
                    borderRadius: 6, 
                    border: '1px solid #d1d5db' 
                  }}
                />
                <input
                  type="text"
                  value={location.pincode}
                  onChange={(e) => setLocation(prev => ({ ...prev, pincode: e.target.value }))}
                  placeholder={t('pincode') || 'Pincode'}
                  style={{ 
                    flex: 1, 
                    padding: '8px 10px', 
                    borderRadius: 6, 
                    border: '1px solid #d1d5db' 
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowSettings(false)}
                style={{ 
                  padding: '8px 16px', 
                  borderRadius: 6, 
                  border: '1px solid #d1d5db', 
                  background: 'white' 
                }}
              >
                {t('cancel') || 'Cancel'}
              </button>
              <button
                onClick={() => setShowSettings(false)}
                style={{ 
                  padding: '8px 16px', 
                  borderRadius: 6, 
                  background: '#2563eb', 
                  color: 'white', 
                  border: 'none' 
                }}
              >
                {t('save') || 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header with Settings Button */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '8px 0' 
      }}>
        <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>
          {t('chatbot')}
        </h3>
        <button
          onClick={() => setShowSettings(true)}
          style={{ 
            padding: '6px 12px', 
            borderRadius: 6, 
            border: '1px solid #d1d5db', 
            background: 'white', 
            fontSize: 12 
          }}
        >
          ⚙️ {t('settings') || 'Settings'}
        </button>
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
        {messages.length === 0 && (
          <div style={{ 
            textAlign: 'center', 
            color: '#6b7280', 
            padding: 20,
            fontStyle: 'italic'
          }}>
            {i18n.language.startsWith('hi') 
              ? 'नमस्ते! मैं आपकी स्वास्थ्य संबंधी सहायता के लिए यहाँ हूँ। कुछ भी पूछें!'
              : 'Hello! I\'m here to help with your health questions. Ask me anything!'
            }
          </div>
        )}
        
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

