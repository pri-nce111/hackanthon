import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const resources = {
  en: {
    translation: {
      app: {
        title: 'Public Health Chatbot',
      },
      nav: {
        chat: 'Chat',
        alerts: 'Outbreak Alerts',
        vaccinations: 'Vaccination Schedule',
      },
      language: {
        en: 'English',
        hi: 'Hindi',
        bn: 'Bengali',
        label: 'Language',
      },
      chat: {
        placeholder: 'Type your health question (e.g., fever, malaria)...',
        send: 'Send',
        assistantDisclaimer: 'This is general information, not a diagnosis. Visit a health worker for medical advice.',
      },
      alerts: {
        title: 'Nearby Outbreak Alerts',
        empty: 'No current alerts.',
        updated: 'Updated',
      },
      vax: {
        title: 'Key Childhood Vaccination Milestones (India UIP)',
        age: 'Age',
        vaccine: 'Vaccine(s)',
        dose: 'Dose',
      },
      kb: {
        fallback: 'I am not sure. Please visit the nearest health center for advice.',
        fever_common: 'Common viral fever/cold: Rest, fluids, and paracetamol for fever (as per age/weight). Seek care if high fever >3 days, breathlessness, persistent vomiting, or confusion.',
        malaria_prevent: 'Malaria prevention: Sleep under insecticide-treated nets, use repellents, wear long sleeves, and remove stagnant water. If fever with chills, test promptly and follow prescribed treatment.',
        tb_symptoms: 'Tuberculosis: Cough >2 weeks, weight loss, night sweats, or fever. TB is curable with full course of free medicines. Visit DOTS center. BCG vaccine is given at birth.',
        diarrhea_ors: 'Diarrhea: Give Oral Rehydration Solution (ORS) frequently and continue feeding. Add zinc for 14 days per local guidelines. Seek care if blood in stool, sunken eyes, or very little urine.',
        vax_children: 'Child vaccination: Birth—BCG, OPV-0, HepB-0; 6/10/14 weeks—OPV, Pentavalent, Rotavirus; 9–12 months—Measles-Rubella; 16–24 months—Boosters. Keep the immunization card safe.',
        covid_prevent: 'COVID-19: Get vaccinated/boosters as eligible, wear a mask in crowded places, wash hands, and improve ventilation. Test if symptomatic and isolate as advised.',
        pregnancy_vax: 'Pregnancy: Tetanus/Tdap as per schedule, iron-folic acid, and regular ANC checkups. Seek care for bleeding, swelling, severe headache, or reduced fetal movement.',
      },
      footer: {
        disclaimer: 'Educational use only. For emergencies, call local health helpline.',
      },
    },
  },
  hi: {
    translation: {
      app: {
        title: 'सार्वजनिक स्वास्थ्य चैटबॉट',
      },
      nav: {
        chat: 'चैट',
        alerts: 'रोग प्रकोप अलर्ट',
        vaccinations: 'टीकाकरण समय-सारणी',
      },
      language: {
        en: 'English',
        hi: 'हिंदी',
        bn: 'বাংলা',
        label: 'भाषा',
      },
      chat: {
        placeholder: 'अपना स्वास्थ्य प्रश्न लिखें (जैसे, बुखार, मलेरिया)...',
        send: 'भेजें',
        assistantDisclaimer: 'यह सामान्य जानकारी है, निदान नहीं। सलाह के लिए स्वास्थ्य कर्मी से मिलें।',
      },
      alerts: {
        title: 'नज़दीकी प्रकोप अलर्ट',
        empty: 'वर्तमान में कोई अलर्ट नहीं।',
        updated: 'अद्यतित',
      },
      vax: {
        title: 'मुख्य बाल टीकाकरण माइलस्टोन (भारत UIP)',
        age: 'आयु',
        vaccine: 'टीका(एँ)',
        dose: 'खुराक',
      },
      kb: {
        fallback: 'मुझे निश्चित नहीं है। कृपया सलाह के लिए निकटतम स्वास्थ्य केंद्र जाएँ।',
        fever_common: 'सामान्य वायरल बुखार/जुकाम: आराम, तरल पदार्थ, और पैरासिटामोल (आयु/वज़न अनुसार)। उच्च बुखार >3 दिन, सांस में तकलीफ, लगातार उल्टी या भ्रम में तुरंत जाँच कराएँ।',
        malaria_prevent: 'मलेरिया रोकथाम: कीटनाशक जाल का उपयोग करें, रिपेलेंट लगाएँ, पूरी बाँह के कपड़े पहनें, और रुका हुआ पानी हटाएँ। बुखार व ठंड लगने पर तुरंत जाँच व उपचार लें।',
        tb_symptoms: 'टीबी: 2 सप्ताह से अधिक खाँसी, वज़न कम होना, रात में पसीना, या बुखार। मुफ़्त दवाओं से टीबी ठीक होती है। DOTS केंद्र जाएँ। BCG टीका जन्म पर दिया जाता है।',
        diarrhea_ors: 'दस्त: ORS बार-बार दें और खाना जारी रखें। स्थानीय दिशानिर्देश अनुसार 14 दिन जिंक दें। मल में खून, धँसी आँखें, या बहुत कम पेशाब होने पर तुरंत दिखाएँ।',
        vax_children: 'बाल टीकाकरण: जन्म—BCG, OPV-0, HepB-0; 6/10/14 सप्ताह—OPV, पेंटावेलेंट, रोटावायरस; 9–12 माह—खसरा-रुबेला; 16–24 माह—बूस्टर। टीकाकरण कार्ड सुरक्षित रखें।',
        covid_prevent: 'COVID-19: पात्र होने पर टीकाकरण/बूस्टर लें, भीड़ में मास्क पहनें, हाथ धोएँ, और वेंटिलेशन सुधारें। लक्षण होने पर जाँच करें और निर्देशानुसार अलग रहें।',
        pregnancy_vax: 'गर्भावस्था: टेटनस/टीडैप समयानुसार, आयरन-फोलिक एसिड, और नियमित ANC जाँच। रक्तस्राव, सूजन, तेज सिरदर्द, या भ्रूण की कम हरकत पर तुरंत दिखाएँ।',
      },
      footer: {
        disclaimer: 'केवल शैक्षिक उपयोग। आपात स्थिति में स्थानीय हेल्पलाइन पर कॉल करें।',
      },
    },
  },
  bn: {
    translation: {
      app: {
        title: 'জনস্বাস্থ্য চ্যাটবট',
      },
      nav: {
        chat: 'চ্যাট',
        alerts: 'রোগ প্রাদুর্ভাব সতর্কতা',
        vaccinations: 'টিকাদান সময়সূচি',
      },
      language: {
        en: 'English',
        hi: 'हिंदी',
        bn: 'বাংলা',
        label: 'ভাষা',
      },
      chat: {
        placeholder: 'আপনার স্বাস্থ্য প্রশ্ন লিখুন (যেমন, জ্বর, ম্যালেরিয়া)...',
        send: 'পাঠান',
        assistantDisclaimer: 'এটি সাধারণ তথ্য, নির্ণয় নয়। পরামর্শের জন্য স্বাস্থ্যকর্মীর সাথে যোগাযোগ করুন।',
      },
      alerts: {
        title: 'নিকটবর্তী প্রাদুর্ভাব সতর্কতা',
        empty: 'এই মুহূর্তে কোনো সতর্কতা নেই।',
        updated: 'আপডেট',
      },
      vax: {
        title: 'শিশুদের মূল টিকাদান মাইলস্টোন (ভারত UIP)',
        age: 'বয়স',
        vaccine: 'টিকা',
        dose: 'ডোজ',
      },
      kb: {
        fallback: 'আমি নিশ্চিত নই। দয়া করে নিকটস্থ স্বাস্থ্যকেন্দ্রে যান।',
        fever_common: 'সাধারণ ভাইরাল জ্বর/সর্দি: বিশ্রাম, প্রচুর পানি, এবং প্যারাসিটামল (বয়স/ওজন অনুযায়ী)। ৩ দিনের বেশি উচ্চ জ্বর, শ্বাসকষ্ট, অবিরাম বমি বা বিভ্রান্তি হলে দ্রুত দেখান।',
        malaria_prevent: 'ম্যালেরিয়া প্রতিরোধ: মশারি ব্যবহার করুন, রিপেলেন্ট লাগান, লম্বা জামা পরুন এবং জমে থাকা পানি সরান। জ্বর ও কাঁপুনি হলে দ্রুত পরীক্ষা ও চিকিৎসা নিন।',
        tb_symptoms: 'টিবি: ২ সপ্তাহের বেশি কাশি, ওজন কমা, রাতে ঘাম, বা জ্বর। টিবি সম্পূর্ণ কোর্স নিলে সারে। DOTS কেন্দ্রে যান। BCG জন্মেই দেওয়া হয়।',
        diarrhea_ors: 'ডায়রিয়া: ওআরএস বারবার দিন এবং খাওয়া চালিয়ে যান। স্থানীয় নির্দেশিকা অনুযায়ী ১৪ দিন জিংক দিন। মলে রক্ত, চোখ বসে যাওয়া, বা খুব কম প্রস্রাব হলে দ্রুত দেখান।',
        vax_children: 'শিশুর টিকা: জন্ম—BCG, OPV-0, HepB-0; ৬/১০/১৪ সপ্তাহ—OPV, পেন্টাভ্যালেন্ট, রোটাভাইরাস; ৯–১২ মাস—হাম-রুবেলা; ১৬–২৪ মাস—বুস্টার। টিকাকার্ডটি সংরক্ষণ করুন।',
        covid_prevent: 'কোভিড-১৯: যোগ্য হলে টিকা/বুস্টার নিন, ভিড়ে মাস্ক পরুন, হাত ধুয়ে নিন, এবং বাতাস চলাচল বাড়ান। উপসর্গ হলে পরীক্ষা করুন এবং নির্দেশমতো আলাদা থাকুন।',
        pregnancy_vax: 'গর্ভাবস্থা: টিটেনাস/টিড্যাপ সময়মতো, আয়রন-ফোলিক এসিড, এবং নিয়মিত ANC পরীক্ষা। রক্তপাত, ফোলা, তীব্র মাথাব্যথা, বা নড়াচড়া কম হলে দ্রুত দেখান।',
      },
      footer: {
        disclaimer: 'শিক্ষামূলক উদ্দেশ্যে। জরুরি অবস্থায় স্থানীয় হেল্পলাইনে কল করুন।',
      },
    },
  },
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  })

export default i18n

