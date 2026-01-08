import { NextRequest, NextResponse } from 'next/server';

// Local medical knowledge base for offline AI responses
const medicalKnowledgeBase = {
  en: {
    symptoms: {
      fever: "For fever: Rest, stay hydrated, take paracetamol if needed. See a doctor if fever exceeds 102°F or persists over 3 days.",
      headache: "For headaches: Rest in a dark room, stay hydrated, consider over-the-counter pain relievers. Consult a doctor for severe or persistent headaches.",
      cough: "For cough: Stay hydrated, use honey (adults only), avoid irritants. See a doctor if cough persists over 2 weeks or includes blood.",
      "sore throat": "For sore throat: Gargle with warm salt water, stay hydrated, use throat lozenges. See a doctor if severe or lasts over a week.",
      nausea: "For nausea: Eat small, bland meals, stay hydrated, rest. Consult a doctor if persistent or accompanied by severe symptoms.",
      diarrhea: "For diarrhea: Stay hydrated with ORS, eat bland foods, rest. See a doctor if severe, bloody, or lasts over 3 days.",
      "stomach pain": "For stomach pain: Avoid solid foods temporarily, stay hydrated, rest. Seek immediate care for severe or persistent pain.",
    },
    conditions: {
      diabetes: "Diabetes management: Monitor blood sugar regularly, maintain a balanced diet, exercise regularly, take medications as prescribed. Regular doctor checkups are essential.",
      hypertension: "High blood pressure: Reduce salt intake, exercise regularly, maintain healthy weight, manage stress. Monitor BP regularly and follow doctor's advice.",
      asthma: "Asthma care: Avoid triggers, use prescribed inhalers correctly, have an action plan. Seek immediate help during severe attacks.",
      arthritis: "Arthritis management: Stay active with gentle exercises, maintain healthy weight, use hot/cold therapy. Consult rheumatologist for proper treatment.",
    },
    general: {
      diet: "Healthy diet: Include fruits, vegetables, whole grains, lean proteins. Limit processed foods, sugar, and excessive salt. Stay hydrated.",
      exercise: "Regular exercise: Aim for 150 minutes of moderate activity weekly. Include cardio, strength training, and flexibility exercises.",
      sleep: "Good sleep: Aim for 7-9 hours nightly. Maintain regular sleep schedule, create comfortable environment, avoid screens before bed.",
      stress: "Stress management: Practice deep breathing, meditation, regular exercise. Maintain work-life balance and seek support when needed.",
    }
  },
  hi: {
    symptoms: {
      fever: "बुखार के लिए: आराम करें, पानी पिएं, जरूरत पर पैरासिटामोल लें। 102°F से ज्यादा या 3 दिन से अधिक बुखार हो तो डॉक्टर को दिखाएं।",
      headache: "सिरदर्द के लिए: अंधेरे कमरे में आराम करें, पानी पिएं, दर्द निवारक दवा ले सकते हैं। गंभीर या लगातार दर्द हो तो डॉक्टर से मिलें।",
      cough: "खांसी के लिए: पानी पिएं, शहद का सेवन करें, धुएं से बचें। 2 सप्ताह से अधिक या खून आने पर डॉक्टर को दिखाएं।",
    },
    conditions: {
      diabetes: "मधुमेह प्रबंधन: नियमित शुगर जांच, संतुलित आहार, व्यायाम, दवा समय पर लें। डॉक्टर की नियमित जांच जरूरी है।",
      hypertension: "उच्च रक्तचाप: नमक कम करें, व्यायाम करें, वजन नियंत्रित रखें, तनाव कम करें। नियमित BP जांच और डॉक्टर की सलाह लें।",
    },
    general: {
      diet: "स्वस्थ आहार: फल, सब्जी, अनाज, प्रोटीन शामिल करें। प्रोसेसड फूड, चीनी, नमक कम करें। पानी पिएं।",
      exercise: "नियमित व्यायाम: सप्ताह में 150 मिनट मध्यम गतिविधि करें। कार्डियो, स्ट्रेंथ ट्रेनिंग शामिल करें।",
    }
  }
};

function findBestMatch(query: string, language: 'en' | 'hi'): string {
  const lowerQuery = query.toLowerCase();
  console.log('Finding match for:', lowerQuery, 'in language:', language);
  
  // Enhanced symptom matching
  if (lowerQuery.includes('cold') || lowerQuery.includes('cough') || lowerQuery.includes('खांसी') || lowerQuery.includes('सर्दी')) {
    return language === 'hi'
      ? "😷 सर्दी-खांसी के लिए: गर्म पानी पिएं, शहद का सेवन करें, आराम करें। भाप लें और धुएं से बचें। 2 सप्ताह से अधिक हो तो डॉक्टर को दिखाएं। ⚠️ बुखार या सांस लेने में कठिनाई हो तो तुरंत चिकित्सा सहायता लें।"
      : "😷 For cold/cough: Drink warm water, use honey, rest well. Take steam and avoid smoke. See a doctor if it persists over 2 weeks. ⚠️ Seek immediate help for fever or breathing difficulty.";
  }
  
  if (lowerQuery.includes('fever') || lowerQuery.includes('बुखार') || lowerQuery.includes('temperature')) {
    return language === 'hi'
      ? "🌡️ बुखार के लिए: आराम करें, पानी पिएं, पैरासिटामोल ले सकते हैं। 102°F से ज्यादा या 3 दिन से अधिक हो तो डॉक्टर को दिखाएं। ⚠️ गंभीर लक्षणों के लिए तुरंत चिकित्सा सहायता लें।"
      : "🌡️ For fever: Rest, stay hydrated, take paracetamol if needed. See a doctor if fever exceeds 102°F or persists over 3 days. ⚠️ Seek immediate medical help for severe symptoms.";
  }
  
  if (lowerQuery.includes('headache') || lowerQuery.includes('सिरदर्द') || lowerQuery.includes('head') && lowerQuery.includes('pain')) {
    return language === 'hi'
      ? "🤕 सिरदर्द के लिए: अंधेरे कमरे में आराम करें, पानी पिएं, दर्द निवारक ले सकते हैं। गंभीर या लगातार दर्द हो तो डॉक्टर से मिलें। ⚠️ अचानक तेज दर्द हो तो तुरंत अस्पताल जाएं।"
      : "🤕 For headaches: Rest in a dark room, stay hydrated, consider pain relievers. Consult a doctor for severe or persistent headaches. ⚠️ Seek immediate help for sudden severe pain.";
  }
  
  if (lowerQuery.includes('stomach') || lowerQuery.includes('pain') || lowerQuery.includes('hurt') || lowerQuery.includes('दर्द') || lowerQuery.includes('पेट')) {
    return language === 'hi'
      ? "🤒 दर्द के लिए: आराम करें, हल्का खाना खाएं, पानी पिएं। गंभीर या लगातार दर्द हो तो डॉक्टर से मिलें। ⚠️ तेज पेट दर्द के लिए तुरंत चिकित्सा सहायता लें।"
      : "🤒 For pain: Rest, eat light foods, stay hydrated. Consult a doctor for severe or persistent pain. ⚠️ Seek immediate help for severe abdominal pain.";
  }
  
  if (lowerQuery.includes('diabetes') || lowerQuery.includes('sugar') || lowerQuery.includes('मधुमेह')) {
    return language === 'hi'
      ? "🩺 मधुमेह प्रबंधन: नियमित शुगर जांच, संतुलित आहार, व्यायाम, दवा समय पर लें। डॉक्टर की नियमित जांच जरूरी है। 💡 मिठाई और तली चीजों से बचें।"
      : "🩺 Diabetes management: Monitor blood sugar regularly, balanced diet, exercise, take medications on time. Regular doctor checkups essential. 💡 Avoid sweets and fried foods.";
  }
  
  if (lowerQuery.includes('blood pressure') || lowerQuery.includes('bp') || lowerQuery.includes('रक्तचाप')) {
    return language === 'hi'
      ? "💓 उच्च रक्तचाप: नमक कम करें, व्यायाम करें, वजन नियंत्रित रखें, तनाव कम करें। नियमित BP जांच और डॉक्टर की सलाह लें। 💡 धूम्रपान छोड़ें।"
      : "💓 High blood pressure: Reduce salt, exercise regularly, maintain healthy weight, manage stress. Monitor BP regularly and follow doctor's advice. 💡 Quit smoking.";
  }
  
  if (lowerQuery.includes('stress') || lowerQuery.includes('anxiety') || lowerQuery.includes('तनाव') || lowerQuery.includes('worried')) {
    return language === 'hi'
      ? "🧘‍♀️ तनाव प्रबंधन: गहरी सांस लें, योग करें, पर्याप्त नींद लें, दोस्तों से बात करें। जरूरत पर काउंसलर से मिलें। 💡 मेडिटेशन करें।"
      : "🧘‍♀️ Stress management: Practice deep breathing, yoga, get adequate sleep, talk to friends. Consult a counselor if needed. 💡 Try meditation daily.";
  }
  
  if (lowerQuery.includes('diet') || lowerQuery.includes('food') || lowerQuery.includes('आहार') || lowerQuery.includes('nutrition')) {
    return language === 'hi'
      ? "🥗 स्वस्थ आहार: फल, सब्जी, अनाज, प्रोटीन शामिल करें। प्रोसेसड फूड, चीनी, नमक कम करें। भरपूर पानी पिएं। 💡 छोटे-छोटे भोजन करें।"
      : "🥗 Healthy diet: Include fruits, vegetables, whole grains, lean proteins. Limit processed foods, sugar, salt. Drink plenty of water. 💡 Eat smaller, frequent meals.";
  }
  
  if (lowerQuery.includes('exercise') || lowerQuery.includes('workout') || lowerQuery.includes('व्यायाम')) {
    return language === 'hi'
      ? "🏃‍♂️ व्यायाम: रोजाना 30 मिनट चलना, योग, या कोई भी शारीरिक गतिविधि करें। धीरे-धीरे शुरू करें। 💡 डॉक्टर की सलाह लेकर शुरू करें।"
      : "🏃‍♂️ Exercise: 30 minutes daily of walking, yoga, or any physical activity. Start gradually and build up. 💡 Consult doctor before starting new exercise routine.";
  }
  
  if (lowerQuery.includes('hospital') || lowerQuery.includes('अस्पताल') || lowerQuery.includes('doctor') || lowerQuery.includes('where')) {
    return language === 'hi'
      ? "🏥 चिकित्सा सुविधाएं: ऊपर दिए गए खोज बॉक्स का उपयोग करके नजदीकी अस्पताल, क्लिनिक खोजें। आपातकाल के लिए 102 डायल करें। 💡 हमेशा योग्य डॉक्टर से सलाह लें।"
      : "🏥 Medical facilities: Use the search box above to find nearby hospitals, clinics. For emergencies, dial your local emergency number. 💡 Always consult qualified doctors.";
  }
  
  if (lowerQuery.includes('pharmacy') || lowerQuery.includes('दवाखाना') || lowerQuery.includes('medicine')) {
    return language === 'hi'
      ? "💊 दवाखाना: ऊपर दिए गए फिल्टर से नजदीकी दवाखाने खोजें। हमेशा डॉक्टर के पर्चे के अनुसार दवा लें। 💡 दवा की एक्सपायरी डेट चेक करें।"
      : "💊 Pharmacy: Use the filters above to find nearby pharmacies. Always take medicines as prescribed by doctor. 💡 Check expiry dates of medicines.";
  }
  
  // Check for general health context
  const healthWords = ['sick', 'ill', 'health', 'medical', 'symptom', 'बीमार', 'स्वास्थ्य', 'लक्षण'];
  const hasHealthContext = healthWords.some(word => lowerQuery.includes(word));
  
  if (hasHealthContext) {
    return language === 'hi'
      ? `🤖 आपके स्वास्थ्य संबंधी प्रश्न "${query}" के लिए मैं सुझाव देता हूं कि आप किसी योग्य डॉक्टर से सलाह लें। व्यक्तिगत जांच और सही निदान के लिए चिकित्सक से मिलना जरूरी है। 💡 आप हमारे ऐप से नजदीकी अस्पताल खोज सकते हैं।`
      : `🤖 For your health question "${query}", I recommend consulting a qualified healthcare professional. Personal examination and proper diagnosis are essential for health issues. 💡 You can find nearby hospitals using our app.`;
  }
  
  // Default response
  return language === 'hi'
    ? `🤖 मैं आपका स्वास्थ्य सहायक हूं। कृपया अपने लक्षण, समस्या या स्वास्थ्य संबंधी चिंता के बारे में बताएं। मैं आपको सही सलाह देने की कोशिश करूंगा। 💡 गंभीर समस्याओं के लिए हमेशा डॉक्टर से सलाह लें।`
    : `🤖 I'm your health assistant. Please tell me about your symptoms, problems, or health concerns. I'll try to provide helpful advice. 💡 Always consult a doctor for serious issues.`;
}

export async function POST(request: NextRequest) {
  try {
    const { message, language } = await request.json();
    
    const response = findBestMatch(message, language === 'hi' ? 'hi' : 'en');
    
    return NextResponse.json({ response });
  } catch (error) {
    console.error('Local AI error:', error);
    const { language } = await request.json().catch(() => ({ language: 'en' }));
    return NextResponse.json({ 
      response: language === 'hi' 
        ? 'क्षमा करें, मैं अभी आपकी मदद नहीं कर सकता। कृपया बाद में पुनः प्रयास करें।'
        : 'Sorry, I cannot help you right now. Please try again later.'
    });
  }
}