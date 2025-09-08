export interface Intent {
  name: string;
  patterns: {
    en: string[];
    hi: string[];
  };
  responses: {
    en: string[];
    hi: string[];
  };
  keywords: string[];
  category: 'symptoms' | 'prevention' | 'vaccination' | 'general' | 'emergency';
}

export const healthIntents: Intent[] = [
  {
    name: 'fever_symptoms',
    patterns: {
      en: [
        'I have fever',
        'My temperature is high',
        'I feel hot and cold',
        'Running a fever',
        'High temperature',
        'Fever symptoms'
      ],
      hi: [
        'मुझे बुखार है',
        'मेरा तापमान ज्यादा है',
        'मुझे गर्म और ठंड लग रही है',
        'बुखार आ रहा है',
        'तेज बुखार है'
      ]
    },
    responses: {
      en: [
        'Fever can have many causes. Here are some steps you can take:\n\n• Rest and drink plenty of fluids\n• Monitor your temperature regularly\n• Take paracetamol if needed\n• Seek medical care if fever exceeds 102°F (39°C) or persists for more than 3 days\n• Watch for warning signs like difficulty breathing, severe headache, or persistent vomiting\n\nThis is general information only. Please consult a healthcare professional for proper diagnosis.'
      ],
      hi: [
        'बुखार के कई कारण हो सकते हैं। यहाँ कुछ कदम हैं जो आप उठा सकते हैं:\n\n• आराम करें और पर्याप्त तरल पदार्थ लें\n• नियमित रूप से अपना तापमान जांचें\n• जरूरत पड़ने पर पेरासिटामोल लें\n• यदि बुखार 102°F (39°C) से अधिक हो या 3 दिनों तक बना रहे तो चिकित्सा सहायता लें\n• सांस लेने में कठिनाई, तेज सिरदर्द, या लगातार उल्टी जैसे चेतावनी संकेतों पर ध्यान दें\n\nयह केवल सामान्य जानकारी है। उचित निदान के लिए कृपया एक स्वास्थ्य पेशेवर से सलाह लें।'
      ]
    },
    keywords: ['fever', 'temperature', 'hot', 'cold', 'बुखार', 'तापमान'],
    category: 'symptoms'
  },
  {
    name: 'covid_symptoms',
    patterns: {
      en: [
        'COVID symptoms',
        'coronavirus symptoms',
        'I think I have COVID',
        'COVID-19 signs',
        'corona virus symptoms'
      ],
      hi: [
        'कोविड के लक्षण',
        'कोरोना वायरस के लक्षण',
        'मुझे लगता है कि मुझे कोविड है',
        'कोविड-19 के संकेत'
      ]
    },
    responses: {
      en: [
        'Common COVID-19 symptoms include:\n\n• Fever or chills\n• Cough (usually dry)\n• Shortness of breath\n• Fatigue\n• Body aches\n• Headache\n• Loss of taste or smell\n• Sore throat\n• Congestion or runny nose\n• Nausea or vomiting\n• Diarrhea\n\nIf you have symptoms:\n• Get tested for COVID-19\n• Isolate yourself from others\n• Monitor your symptoms\n• Seek immediate medical care if you have trouble breathing, persistent chest pain, confusion, or bluish lips/face\n\nThis is general information. Please consult healthcare professionals for proper guidance.'
      ],
      hi: [
        'सामान्य कोविड-19 लक्षणों में शामिल हैं:\n\n• बुखार या ठंड लगना\n• खांसी (आमतौर पर सूखी)\n• सांस की तकलीफ\n• थकान\n• शरीर में दर्द\n• सिरदर्द\n• स्वाद या गंध का चले जाना\n• गले में खराश\n• नाक बंद होना या बहना\n• मतली या उल्टी\n• दस्त\n\nयदि आपमें लक्षण हैं:\n• कोविड-19 की जांच कराएं\n• दूसरों से अलग रहें\n• अपने लक्षणों पर नजर रखें\n• यदि सांस लेने में तकलीफ, लगातार छाती में दर्द, भ्रम, या होंठ/चेहरे का नीला पड़ना हो तो तुरंत चिकित्सा सहायता लें\n\nयह सामान्य जानकारी है। उचित मार्गदर्शन के लिए कृपया स्वास्थ्य पेशेवरों से सलाह लें।'
      ]
    },
    keywords: ['covid', 'corona', 'coronavirus', 'covid-19', 'कोविड', 'कोरोना'],
    category: 'symptoms'
  },
  {
    name: 'dengue_symptoms',
    patterns: {
      en: [
        'dengue symptoms',
        'dengue fever',
        'I have dengue',
        'mosquito fever',
        'dengue signs'
      ],
      hi: [
        'डेंगू के लक्षण',
        'डेंगू बुखार',
        'मुझे डेंगू है',
        'मच्छर का बुखार',
        'डेंगू के संकेत'
      ]
    },
    responses: {
      en: [
        'Dengue symptoms typically include:\n\n• High fever (104°F/40°C)\n• Severe headache\n• Pain behind the eyes\n• Muscle and joint pains\n• Skin rash\n• Nausea and vomiting\n• Mild bleeding (nose, gums)\n\nWarning signs (seek immediate medical care):\n• Severe abdominal pain\n• Persistent vomiting\n• Rapid breathing\n• Bleeding gums\n• Blood in vomit\n• Restlessness\n• Skin pallor\n\nPrevention:\n• Remove stagnant water around your home\n• Use mosquito repellents\n• Wear long-sleeved clothes\n• Use bed nets\n\nSeek medical attention immediately if you suspect dengue.'
      ],
      hi: [
        'डेंगू के लक्षणों में आमतौर पर शामिल हैं:\n\n• तेज बुखार (104°F/40°C)\n• तेज सिरदर्द\n• आंखों के पीछे दर्द\n• मांसपेशियों और जोड़ों में दर्द\n• त्वचा पर चकत्ते\n• मतली और उल्टी\n• हल्की रक्तस्राव (नाक, मसूड़े)\n\nचेतावनी के संकेत (तुरंत चिकित्सा सहायता लें):\n• पेट में तेज दर्द\n• लगातार उल्टी\n• तेज सांस\n• मसूड़ों से खून आना\n• उल्टी में खून\n• बेचैनी\n• त्वचा का पीला पड़ना\n\nरोकथाम:\n• घर के आसपास जमा पानी हटाएं\n• मच्छर भगाने वाली दवा का उपयोग करें\n• लंबी आस्तीन के कपड़े पहनें\n• मच्छरदानी का उपयोग करें\n\nयदि आपको डेंगू का संदेह है तो तुरंत चिकित्सा सहायता लें।'
      ]
    },
    keywords: ['dengue', 'mosquito', 'डेंगू', 'मच्छर'],
    category: 'symptoms'
  },
  {
    name: 'vaccination_schedule',
    patterns: {
      en: [
        'vaccination schedule',
        'vaccine calendar',
        'when to get vaccinated',
        'immunization schedule',
        'vaccine timing'
      ],
      hi: [
        'टीकाकरण कार्यक्रम',
        'वैक्सीन कैलेंडर',
        'कब टीका लगवाना है',
        'प्रतिरक्षण अनुसूची',
        'टीके का समय'
      ]
    },
    responses: {
      en: [
        'Here is the basic vaccination schedule:\n\n**Infants (0-2 years):**\n• Birth: BCG, Hepatitis B, OPV\n• 6 weeks: DPT, IPV, Hepatitis B, Hib, Rotavirus, PCV\n• 10 weeks: DPT, IPV, Hib, Rotavirus, PCV\n• 14 weeks: DPT, IPV, Hib, Rotavirus, PCV\n• 9 months: Measles, JE (in endemic areas)\n• 16-24 months: DPT, IPV, Measles, JE\n\n**Adults:**\n• Tetanus: Every 10 years\n• Influenza: Annual\n• COVID-19: As per guidelines\n• Hepatitis B: If not vaccinated\n\n**Special groups:**\n• Pregnant women: TT, Influenza\n• Healthcare workers: Hepatitis B, Influenza\n\nConsult your healthcare provider for personalized vaccination advice. Keep vaccination records safe.'
      ],
      hi: [
        'यहाँ बुनियादी टीकाकरण अनुसूची है:\n\n**शिशु (0-2 वर्ष):**\n• जन्म: बीसीजी, हेपेटाइटिस बी, ओपीवी\n• 6 सप्ताह: डीपीटी, आईपीवी, हेपेटाइटिस बी, हिब, रोटावायरस, पीसीवी\n• 10 सप्ताह: डीपीटी, आईपीवी, हिब, रोटावायरस, पीसीवी\n• 14 सप्ताह: डीपीटी, आईपीवी, हिब, रोटावायरस, पीसीवी\n• 9 महीने: खसरा, जेई (स्थानिक क्षेत्रों में)\n• 16-24 महीने: डीपीटी, आईपीवी, खसरा, जेई\n\n**वयस्क:**\n• टिटनेस: हर 10 साल\n• इन्फ्लूएंजा: वार्षिक\n• कोविड-19: दिशानिर्देशों के अनुसार\n• हेपेटाइटिस बी: यदि टीका नहीं लगा है\n\n**विशेष समूह:**\n• गर्भवती महिलाएं: टीटी, इन्फ्लूएंजा\n• स्वास्थ्यकर्मी: हेपेटाइटिस बी, इन्फ्लूएंजा\n\nव्यक्तिगत टीकाकरण सलाह के लिए अपने स्वास्थ्य प्रदाता से सलाह लें। टीकाकरण रिकॉर्ड सुरक्षित रखें।'
      ]
    },
    keywords: ['vaccine', 'vaccination', 'immunization', 'टीका', 'टीकाकरण', 'प्रतिरक्षण'],
    category: 'vaccination'
  },
  {
    name: 'preventive_care',
    patterns: {
      en: [
        'how to prevent disease',
        'preventive healthcare',
        'stay healthy',
        'disease prevention',
        'health tips'
      ],
      hi: [
        'बीमारी से कैसे बचें',
        'निवारक स्वास्थ्य सेवा',
        'स्वस्थ रहें',
        'रोग की रोकथाम',
        'स्वास्थ्य सुझाव'
      ]
    },
    responses: {
      en: [
        'Here are key preventive healthcare measures:\n\n**Personal Hygiene:**\n• Wash hands frequently with soap for 20 seconds\n• Use hand sanitizer when soap isn\'t available\n• Cover mouth/nose when coughing or sneezing\n• Avoid touching face with unwashed hands\n\n**Nutrition & Lifestyle:**\n• Eat balanced diet with fruits and vegetables\n• Stay hydrated (8-10 glasses of water daily)\n• Exercise regularly (30 minutes daily)\n• Get adequate sleep (7-8 hours)\n• Avoid tobacco and limit alcohol\n\n**Environmental Health:**\n• Keep surroundings clean\n• Ensure proper ventilation\n• Eliminate stagnant water (prevents mosquito breeding)\n• Use safe drinking water\n\n**Regular Health Checks:**\n• Follow vaccination schedules\n• Regular health screenings\n• Monitor blood pressure and blood sugar\n\nStay informed about health alerts in your area.'
      ],
      hi: [
        'यहाँ मुख्य निवारक स्वास्थ्य उपाय हैं:\n\n**व्यक्तिगत स्वच्छता:**\n• 20 सेकंड तक साबुन से हाथ धोएं\n• जब साबुन उपलब्ध न हो तो हैंड सैनिटाइजर का उपयोग करें\n• खांसते या छींकते समय मुंह/नाक को ढकें\n• बिना धोए हाथों से चेहरा न छुएं\n\n**पोषण और जीवनशैली:**\n• फल और सब्जियों के साथ संतुलित आहार लें\n• हाइड्रेटेड रहें (दैनिक 8-10 गिलास पानी)\n• नियमित व्यायाम करें (दैनिक 30 मिनट)\n• पर्याप्त नींद लें (7-8 घंटे)\n• तंबाकू से बचें और शराब सीमित करें\n\n**पर्यावरणीय स्वास्थ्य:**\n• आसपास की सफाई रखें\n• उचित वेंटिलेशन सुनिश्चित करें\n• जमा हुआ पानी हटाएं (मच्छरों के प्रजनन को रोकता है)\n• सुरक्षित पेयजल का उपयोग करें\n\n**नियमित स्वास्थ्य जांच:**\n• टीकाकरण कार्यक्रम का पालन करें\n• नियमित स्वास्थ्य जांच\n• रक्तचाप और रक्त शर्करा की निगरानी करें\n\nअपने क्षेत्र में स्वास्थ्य अलर्ट के बारे में जानकारी रखें।'
      ]
    },
    keywords: ['prevent', 'prevention', 'healthy', 'hygiene', 'रोकथाम', 'स्वस्थ', 'स्वच्छता'],
    category: 'prevention'
  },
  {
    name: 'emergency',
    patterns: {
      en: [
        'emergency',
        'urgent help',
        'serious symptoms',
        'medical emergency',
        'call doctor'
      ],
      hi: [
        'आपातकाल',
        'तुरंत मदद',
        'गंभीर लक्षण',
        'मेडिकल इमरजेंसी',
        'डॉक्टर को कॉल करें'
      ]
    },
    responses: {
      en: [
        '🚨 **MEDICAL EMERGENCY** 🚨\n\nIf you or someone else is experiencing:\n• Difficulty breathing or shortness of breath\n• Chest pain or pressure\n• Severe bleeding\n• Loss of consciousness\n• Severe allergic reaction\n• Signs of stroke (face drooping, arm weakness, speech difficulty)\n• High fever with stiff neck\n• Severe abdominal pain\n\n**CALL EMERGENCY SERVICES IMMEDIATELY:**\n• India: 108 (National Ambulance)\n• General Emergency: 112\n• Local hospital emergency room\n\n**While waiting for help:**\n• Stay calm\n• Keep the person comfortable\n• Don\'t give food or water\n• Monitor breathing and pulse\n• Be ready to provide CPR if trained\n\nThis chatbot cannot replace emergency medical care. Seek immediate professional help.'
      ],
      hi: [
        '🚨 **मेडिकल इमरजेंसी** 🚨\n\nयदि आप या कोई और अनुभव कर रहा है:\n• सांस लेने में कठिनाई या सांस की तकलीफ\n• छाती में दर्द या दबाव\n• गंभीर रक्तस्राव\n• बेहोशी\n• गंभीर एलर्जी रिएक्शन\n• स्ट्रोक के संकेत (चेहरे का लटकना, बाह की कमजोरी, बोलने में कठिनाई)\n• गर्दन में अकड़न के साथ तेज बुखार\n• पेट में तेज दर्द\n\n**तुरंत इमरजेंसी सेवाओं को कॉल करें:**\n• भारत: 108 (राष्ट्रीय एम्बुलेंस)\n• सामान्य आपातकाल: 112\n• स्थानीय अस्पताल का आपातकालीन कक्ष\n\n**मदद का इंतजार करते समय:**\n• शांत रहें\n• व्यक्ति को आरामदायक रखें\n• खाना या पानी न दें\n• सांस और नाड़ी की निगरानी करें\n• यदि प्रशिक्षित हैं तो सीपीआर देने के लिए तैयार रहें\n\nयह चैटबॉट आपातकालीन चिकित्सा देखभाल का विकल्प नहीं हो सकता। तुरंत पेशेवर मदद लें।'
      ]
    },
    keywords: ['emergency', 'urgent', 'serious', 'आपातकाल', 'तुरंत', 'गंभीर'],
    category: 'emergency'
  }
];