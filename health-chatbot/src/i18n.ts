import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      appName: 'Health Assist',
      language: 'Language',
      home: 'Home',
      learn: 'Learn',
      chatbot: 'Chatbot',
      outbreakAlerts: 'Outbreak Alerts',
      welcomeHeadline: 'AI-Driven Public Health Chatbot',
      welcomeSub: 'Trusted guidance on prevention, symptoms, and vaccinations',
      inputPlaceholder: 'Ask about symptoms, prevention, or vaccines…',
      send: 'Send',
      typing: 'Assistant is typing…',
      quickTips: 'Quick tips',
      tipHandwash: 'Wash hands with soap for 20 seconds',
      tipMask: 'Wear a mask in crowded indoor places',
      tipBooster: 'Keep vaccinations up to date',
      alertsEmpty: 'No active outbreak alerts in your area',
      settings: 'Settings',
      phoneNumber: 'Phone Number',
      location: 'Location',
      state: 'State',
      pincode: 'Pincode',
      cancel: 'Cancel',
      save: 'Save',
      phoneRequired: 'Please provide your phone number in settings first.',
    },
  },
  hi: {
    translation: {
      appName: 'स्वास्थ्य सहायक',
      language: 'भाषा',
      home: 'होम',
      learn: 'जानकारी',
      chatbot: 'चैटबॉट',
      outbreakAlerts: 'प्रकोप अलर्ट',
      welcomeHeadline: 'एआई-संचालित जन स्वास्थ्य चैटबॉट',
      welcomeSub: 'रोकथाम, लक्षण और टीकाकरण पर विश्वसनीय मार्गदर्शन',
      inputPlaceholder: 'लक्षण, रोकथाम या टीके के बारे में पूछें…',
      send: 'भेजें',
      typing: 'सहायक लिख रहा है…',
      quickTips: 'त्वरित सुझाव',
      tipHandwash: '20 सेकंड तक साबुन से हाथ धोएं',
      tipMask: 'भीड़भाड़ वाले अंदरूनी स्थानों में मास्क पहनें',
      tipBooster: 'टीकाकरण अद्यतन रखें',
      alertsEmpty: 'आपके क्षेत्र में कोई सक्रिय प्रकोप अलर्ट नहीं',
      settings: 'सेटिंग्स',
      phoneNumber: 'फोन नंबर',
      location: 'स्थान',
      state: 'राज्य',
      pincode: 'पिनकोड',
      cancel: 'रद्द करें',
      save: 'सेव करें',
      phoneRequired: 'कृपया पहले सेटिंग्स में अपना फोन नंबर दें।',
    },
  },
  es: {
    translation: {
      appName: 'Asistente de Salud',
      language: 'Idioma',
      home: 'Inicio',
      learn: 'Aprender',
      chatbot: 'Chatbot',
      outbreakAlerts: 'Alertas de brotes',
      welcomeHeadline: 'Chatbot de Salud impulsado por IA',
      welcomeSub: 'Guía confiable sobre prevención, síntomas y vacunas',
      inputPlaceholder: 'Pregunta sobre síntomas, prevención o vacunas…',
      send: 'Enviar',
      typing: 'El asistente está escribiendo…',
      quickTips: 'Consejos rápidos',
      tipHandwash: 'Lávate las manos con jabón por 20 segundos',
      tipMask: 'Usa mascarilla en lugares cerrados concurridos',
      tipBooster: 'Mantén tus vacunas al día',
      alertsEmpty: 'No hay alertas de brotes activas en tu zona',
    },
  },
} as const;

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  });

export default i18n;
