"use client";

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Bot, User, Mic, MicOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Message, ChatBotProps } from '../types';

// Extend window interface for speech recognition
declare global {
  interface Window {
    webkitSpeechRecognition: any;
    chatSpeechRecognition: any;
  }
}

const translations = {
  en: {
    chatTitle: 'AI Assistant',
    placeholder: 'Ask me ANYTHING - health, general questions, casual chat...',
    send: 'Send',
    typing: 'AI is thinking...',
    welcomeMessage: '🤖 Hey there! I\'m your super-smart AI assistant powered by advanced AI! I can help you with:\n\n• 🏥 Health symptoms & medical advice\n• 💊 Medication information\n• 🌟 General knowledge & questions\n• 💬 Casual conversation\n• 🔍 Finding nearby medical facilities\n• 📚 Any topic you\'re curious about!\n\nAsk me ANYTHING - I\'m here to help! 🚀',
    errorMessage: 'I apologize, but I\'m having trouble processing your request. Please try rephrasing your question.',
    voiceStart: 'Listening...',
    voiceStop: 'Click to speak'
  },
  hi: {
    chatTitle: 'AI सहायक',
    placeholder: 'कुछ भी पूछें - स्वास्थ्य, सामान्य प्रश्न, बातचीत...',
    send: 'भेजें',
    typing: 'AI सोच रहा है...',
    welcomeMessage: '🤖 नमस्ते! मैं आपका सुपर-स्मार्ट AI सहायक हूं! मैं इनमें आपकी मदद कर सकता हूं:\n\n• 🏥 स्वास्थ्य लक्षण और चिकित्सा सलाह\n• 💊 दवाओं की जानकारी\n• 🌟 सामान्य ज्ञान और प्रश्न\n• 💬 आम बातचीत\n• 🔍 नजदीकी चिकित्सा सुविधाएं\n• 📚 कोई भी विषय!\n\nकुछ भी पूछें - मैं यहां मदद के लिए हूं! 🚀',
    errorMessage: 'क्षमा करें, मुझे आपके प्रश्न को समझने में कठिनाई हो रही है। कृपया अपना प्रश्न दूसरे तरीके से पूछें।',
    voiceStart: 'सुन रहा हूं...',
    voiceStop: 'बोलने के लिए क्लिक करें'
  }
};

// Predefined responses for common health queries
const healthResponses = {
  en: {
    fever: "For fever, rest and stay hydrated. If temperature exceeds 102°F (39°C) or persists for more than 3 days, consult a doctor immediately.",
    headache: "For headaches, try rest in a dark room, stay hydrated, and consider over-the-counter pain relievers. Seek medical help for severe or persistent headaches.",
    cough: "For cough, stay hydrated, use honey (for adults), and avoid irritants. See a doctor if cough persists for more than 2 weeks or includes blood.",
    emergency: "For medical emergencies, call your local emergency number immediately. Common signs include chest pain, difficulty breathing, severe bleeding, or loss of consciousness.",
    pharmacy: "I can help you find nearby pharmacies. Use the search function above to locate pharmacies in your area.",
    hospital: "I can help you find nearby hospitals. Use the search function to find hospitals based on your location and needs.",
    insurance: "Many facilities accept various insurance plans. Check the facility details for accepted insurance providers, or contact them directly."
  },
  hi: {
    fever: "बुखार के लिए, आराम करें और हाइड्रेटेड रहें। यदि तापमान 102°F (39°C) से अधिक हो या 3 दिन से अधिक बना रहे, तुरंत डॉक्टर से सलाह लें।",
    headache: "सिरदर्द के लिए, अंधेरे कमरे में आराम करें, हाइड्रेटेड रहें, और ओवर-द-काउंटर दर्द निवारक दवाओं पर विचार करें। गंभीर या लगातार सिरदर्द के लिए चिकित्सा सहायता लें।",
    cough: "खांसी के लिए, हाइड्रेटेड रहें, शहद का उपयोग करें (वयस्कों के लिए), और परेशान करने वाली चीजों से बचें। यदि खांसी 2 सप्ताह से अधिक बनी रहे या खून आए तो डॉक्टर को दिखाएं।",
    emergency: "चिकित्सा आपातकाल के लिए, तुरंत अपना स्थानीय आपातकालीन नंबर कॉल करें। सामान्य संकेतों में सीने में दर्द, सांस लेने में कठिनाई, गंभीर रक्तस्राव, या बेहोशी शामिल है।",
    pharmacy: "मैं आपको नजदीकी दवाखाने खोजने में मदद कर सकता हूं। अपने क्षेत्र में दवाखाने खोजने के लिए ऊपर दिए गए खोज फ़ंक्शन का उपयोग करें।",
    hospital: "मैं आपको नजदीकी अस्पताल खोजने में मदद कर सकता हूं। अपने स्थान और आवश्यकताओं के आधार पर अस्पताल खोजने के लिए खोज फ़ंक्शन का उपयोग करें।",
    insurance: "कई सुविधाएं विभिन्न बीमा योजनाओं को स्वीकार करती हैं। स्वीकृत बीमा प्रदाताओं के लिए सुविधा विवरण देखें, या सीधे उनसे संपर्क करें।"
  }
};

export default function ChatBot({ currentLanguage }: ChatBotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fix hydration issues
  useEffect(() => {
    setIsClient(true);
  }, []);

  const t = translations[currentLanguage as keyof typeof translations] || translations.en;
  const responses = healthResponses[currentLanguage as keyof typeof healthResponses] || healthResponses.en;

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Add welcome message when chat opens for the first time
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        text: t.welcomeMessage,
        isBot: true,
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, messages.length, t.welcomeMessage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Voice recognition setup
  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = currentLanguage === 'hi' ? 'hi-IN' : 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
      };

      (window as any).chatSpeechRecognition = recognition;
    }
  }, [currentLanguage]);

  const startVoiceInput = () => {
    if ((window as any).chatSpeechRecognition) {
      (window as any).chatSpeechRecognition.start();
    }
  };

  const stopVoiceInput = () => {
    if ((window as any).chatSpeechRecognition) {
      (window as any).chatSpeechRecognition.stop();
    }
  };

  // AI-powered response generation
  const generateResponse = async (userMessage: string): Promise<string> => {
    try {
      console.log('🎯 GENERATING RESPONSE FOR:', userMessage);
      
      // PRIORITY 1: Try OpenRouter (BEST - can answer ANYTHING!)
      console.log('🚀 STEP 1: Trying OpenRouter...');
      const openrouterResponse = await tryOpenRouter(userMessage);
      if (openrouterResponse && openrouterResponse.trim().length > 5) {
        console.log('✅ SUCCESS! Using OpenRouter response');
        return openrouterResponse;
      }
      console.log('❌ OpenRouter failed, trying next...');
      
      // PRIORITY 2: Try Local AI (health-focused)
      console.log('🏥 STEP 2: Trying Local AI...');
      const localResponse = await tryLocalAI(userMessage);
      if (localResponse && localResponse.length > 20) {
        console.log('✅ Using Local AI response');
        return localResponse;
      }
      console.log('❌ Local AI failed, using fallback...');
      
      // FINAL FALLBACK: Enhanced keyword responses
      console.log('🔄 STEP 3: Using keyword fallback...');
      const keywordResponse = getEnhancedKeywordResponse(userMessage);
      return keywordResponse;
      
    } catch (error) {
      console.error('💥 AI Response Error:', error);
      return getEnhancedKeywordResponse(userMessage);
    }
  };

  // OpenRouter API integration (BEST - can answer anything!)
  const tryOpenRouter = async (message: string): Promise<string | null> => {
    try {
      console.log('🚀 TRYING OPENROUTER AI FOR:', message);
      const response = await fetch('/api/chat/openrouter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message, 
          language: currentLanguage,
          context: 'general_assistant'
        })
      });
      
      console.log('🔥 OpenRouter response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ OpenRouter SUCCESS! Data:', data);
        return data.response;
      } else {
        const errorText = await response.text();
        console.error('❌ OpenRouter ERROR:', response.status, errorText);
      }
    } catch (error) {
      console.error('💥 OpenRouter EXCEPTION:', error);
    }
    return null;
  };

  // OpenAI API integration
  const tryOpenAI = async (message: string): Promise<string | null> => {
    try {
      const response = await fetch('/api/chat/openai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message, 
          language: currentLanguage,
          context: 'health_assistant'
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.response;
      }
    } catch (error) {
      console.log('OpenAI not available, trying alternatives...');
    }
    return null;
  };

  // Gemini API integration (free alternative)
  const tryGemini = async (message: string): Promise<string | null> => {
    try {
      const response = await fetch('/api/chat/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message, 
          language: currentLanguage,
          context: 'health_assistant'
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.response;
      }
    } catch (error) {
      console.log('Gemini not available, trying alternatives...');
    }
    return null;
  };

  // Hugging Face API integration (free alternative)
  const tryHuggingFace = async (message: string): Promise<string | null> => {
    try {
      const response = await fetch('/api/chat/huggingface', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message, 
          language: currentLanguage,
          context: 'health_assistant'
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.response;
      }
    } catch (error) {
      console.log('Hugging Face not available, trying local AI...');
    }
    return null;
  };

  // Local AI integration (always available)
  const tryLocalAI = async (message: string): Promise<string | null> => {
    try {
      console.log('Trying local AI for:', message);
      const response = await fetch('/api/chat/local', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message, 
          language: currentLanguage,
          context: 'health_assistant'
        })
      });
      
      console.log('Local AI response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Local AI data:', data);
        return data.response;
      }
    } catch (error) {
      console.error('Local AI error:', error);
    }
    return null;
  };

  // Enhanced keyword-based fallback (always works)
  const getEnhancedKeywordResponse = (userMessage: string): string => {
    console.log('Getting keyword response for:', userMessage);
    const message = userMessage.toLowerCase();
    
    // Health symptoms - comprehensive coverage
    if (message.includes('fever') || message.includes('बुखार') || message.includes('temperature') || message.includes('hot')) {
      return currentLanguage === 'hi' 
        ? "🌡️ बुखार के लिए: आराम करें, पानी पिएं, पैरासिटामोल ले सकते हैं। 102°F से ज्यादा या 3 दिन से अधिक हो तो डॉक्टर को दिखाएं। ⚠️ गंभीर लक्षणों के लिए तुरंत चिकित्सा सहायता लें।"
        : "🌡️ For fever: Rest, stay hydrated, take paracetamol if needed. See a doctor if fever exceeds 102°F or persists over 3 days. ⚠️ Seek immediate medical help for severe symptoms.";
    } 
    
    else if (message.includes('headache') || message.includes('सिरदर्द') || message.includes('migraine') || message.includes('head pain')) {
      return currentLanguage === 'hi'
        ? "🤕 सिरदर्द के लिए: अंधेरे कमरे में आराम करें, पानी पिएं, दर्द निवारक ले सकते हैं। गंभीर या लगातार दर्द हो तो डॉक्टर से मिलें। ⚠️ अचानक तेज दर्द हो तो तुरंत अस्पताल जाएं।"
        : "🤕 For headaches: Rest in a dark room, stay hydrated, consider pain relievers. Consult a doctor for severe or persistent headaches. ⚠️ Seek immediate help for sudden severe pain.";
    } 
    
    else if (message.includes('cough') || message.includes('खांसी') || message.includes('cold') || message.includes('throat')) {
      return currentLanguage === 'hi'
        ? "😷 खांसी के लिए: पानी पिएं, शहद का सेवन करें, धुएं से बचें। 2 सप्ताह से अधिक या खून आने पर डॉक्टर को दिखाएं। 💡 गर्म पानी से गरारे करें।"
        : "😷 For cough: Stay hydrated, use honey (adults), avoid irritants. See a doctor if cough persists over 2 weeks or includes blood. 💡 Try warm water gargles.";
    } 
    
    else if (message.includes('stomach') || message.includes('pain') || message.includes('hurt') || message.includes('दर्द') || message.includes('पेट')) {
      return currentLanguage === 'hi'
        ? "🤒 दर्द के लिए: आराम करें, हल्का खाना खाएं, पानी पिएं। गंभीर या लगातार दर्द हो तो डॉक्टर से मिलें। ⚠️ तेज पेट दर्द के लिए तुरंत चिकित्सा सहायता लें।"
        : "🤒 For pain: Rest, eat light foods, stay hydrated. Consult a doctor for severe or persistent pain. ⚠️ Seek immediate help for severe abdominal pain.";
    }
    
    // Chronic conditions
    else if (message.includes('diabetes') || message.includes('sugar') || message.includes('मधुमेह')) {
      return currentLanguage === 'hi' 
        ? "🩺 मधुमेह प्रबंधन: नियमित शुगर जांच, संतुलित आहार, व्यायाम, दवा समय पर लें। डॉक्टर की नियमित जांच जरूरी है। 💡 मिठाई और तली चीजों से बचें।"
        : "🩺 Diabetes management: Monitor blood sugar regularly, balanced diet, exercise, take medications on time. Regular doctor checkups essential. 💡 Avoid sweets and fried foods.";
    } 
    
    else if (message.includes('blood pressure') || message.includes('bp') || message.includes('रक्तचाप') || message.includes('hypertension')) {
      return currentLanguage === 'hi'
        ? "💓 उच्च रक्तचाप: नमक कम करें, व्यायाम करें, वजन नियंत्रित रखें, तनाव कम करें। नियमित BP जांच और डॉक्टर की सलाह लें। 💡 धूम्रपान छोड़ें।"
        : "💓 High blood pressure: Reduce salt, exercise regularly, maintain healthy weight, manage stress. Monitor BP regularly and follow doctor's advice. 💡 Quit smoking.";
    }
    
    // Emergency situations
    else if (message.includes('emergency') || message.includes('आपातकाल') || message.includes('urgent') || message.includes('chest pain') || message.includes('heart')) {
      return currentLanguage === 'hi'
        ? "🚨 आपातकाल: सीने में दर्द, सांस लेने में कठिनाई, या गंभीर लक्षणों के लिए तुरंत 102 पर कॉल करें या नजदीकी अस्पताल जाएं। ⚠️ देर न करें!"
        : "🚨 Emergency: For chest pain, difficulty breathing, or severe symptoms, call emergency services immediately or go to nearest hospital. ⚠️ Don't delay!";
    }
    
    // General health
    else if (message.includes('diet') || message.includes('nutrition') || message.includes('आहार') || message.includes('food')) {
      return currentLanguage === 'hi'
        ? "🥗 स्वस्थ आहार: फल, सब्जी, अनाज, प्रोटीन शामिल करें। प्रोसेसड फूड, चीनी, नमक कम करें। भरपूर पानी पिएं। 💡 छोटे-छोटे भोजन करें।"
        : "🥗 Healthy diet: Include fruits, vegetables, whole grains, lean proteins. Limit processed foods, sugar, salt. Drink plenty of water. 💡 Eat smaller, frequent meals.";
    } 
    
    else if (message.includes('exercise') || message.includes('workout') || message.includes('व्यायाम') || message.includes('fitness')) {
      return currentLanguage === 'hi'
        ? "🏃‍♂️ व्यायाम: रोजाना 30 मिनट चलना, योग, या कोई भी शारीरिक गतिविधि करें। धीरे-धीरे शुरू करें। 💡 डॉक्टर की सलाह लेकर शुरू करें।"
        : "🏃‍♂️ Exercise: 30 minutes daily of walking, yoga, or any physical activity. Start gradually and build up. 💡 Consult doctor before starting new exercise routine.";
    }
    
    // Mental health
    else if (message.includes('stress') || message.includes('anxiety') || message.includes('तनाव') || message.includes('depression') || message.includes('mental')) {
      return currentLanguage === 'hi'
        ? "🧘‍♀️ तनाव प्रबंधन: गहरी सांस लें, योग करें, पर्याप्त नींद लें, दोस्तों से बात करें। जरूरत पर काउंसलर से मिलें। 💡 मेडिटेशन करें।"
        : "🧘‍♀️ Stress management: Practice deep breathing, yoga, get adequate sleep, talk to friends. Consult a counselor if needed. 💡 Try meditation daily.";
    }
    
    // Facilities
    else if (message.includes('hospital') || message.includes('अस्पताल') || message.includes('doctor') || message.includes('clinic')) {
      return currentLanguage === 'hi'
        ? "🏥 चिकित्सा सुविधाएं: ऊपर दिए गए खोज बॉक्स का उपयोग करके नजदीकी अस्पताल, क्लिनिक खोजें। आपातकाल के लिए 102 डायल करें। 💡 हमेशा योग्य डॉक्टर से सलाह लें।"
        : "🏥 Medical facilities: Use the search box above to find nearby hospitals, clinics. For emergencies, dial your local emergency number. 💡 Always consult qualified doctors.";
    } 
    
    else if (message.includes('pharmacy') || message.includes('दवाखाना') || message.includes('medicine') || message.includes('drug')) {
      return currentLanguage === 'hi'
        ? "💊 दवाखाना: ऊपर दिए गए फिल्टर से नजदीकी दवाखाने खोजें। हमेशा डॉक्टर के पर्चे के अनुसार दवा लें। 💡 दवा की एक्सपायरी डेट चेक करें।"
        : "💊 Pharmacy: Use the filters above to find nearby pharmacies. Always take medicines as prescribed by doctor. 💡 Check expiry dates of medicines.";
    }
    
    // Default intelligent response
    else {
      return currentLanguage === 'hi'
        ? `🤖 मैं आपके सवाल "${userMessage}" को समझने की कोशिश कर रहा हूं। कृपया अधिक विशिष्ट जानकारी दें जैसे लक्षण, समस्या, या स्वास्थ्य संबंधी चिंता। 💡 किसी भी गंभीर समस्या के लिए डॉक्टर से सलाह लें।`
        : `🤖 I'm analyzing your question "${userMessage}". Please provide more specific information about symptoms, problems, or health concerns. 💡 For any serious issues, please consult a healthcare professional.`;
    }
  };

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    console.log('Sending message:', inputText);

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isBot: false,
      timestamp: new Date()
    };

    const messageToProcess = inputText;
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    try {
      console.log('Getting AI response...');
      // Get AI response
      const aiResponse = await generateResponse(messageToProcess);
      console.log('AI response received:', aiResponse);
      
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        isBot: true,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botResponse]);
      console.log('Bot response added to messages');
    } catch (error) {
      console.error('Chat error:', error);
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: t.errorMessage,
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white p-4 rounded-2xl shadow-2xl z-50 border-2 border-white"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {isOpen ? <X className="w-7 h-7" /> : <MessageCircle className="w-7 h-7" />}
        {!isOpen && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            className="fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-2xl z-40 flex flex-col border-2 border-gray-100"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="bg-white bg-opacity-20 p-2 rounded-xl">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{t.chatTitle}</h3>
                  <p className="text-blue-100 text-sm">Ask me anything about health</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-xs px-3 py-2 rounded-lg ${
                      message.isBot
                        ? 'bg-gray-100 text-gray-800'
                        : 'bg-blue-500 text-white'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {message.isBot && <Bot className="w-4 h-4 mt-1 flex-shrink-0" />}
                      <div className="text-sm">{message.text}</div>
                      {!message.isBot && <User className="w-4 h-4 mt-1 flex-shrink-0" />}
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-800 px-3 py-2 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Bot className="w-4 h-4" />
                      <div className="text-sm">{t.typing}</div>
                      <div className="flex space-x-1">
                        <div className="w-1 h-1 bg-gray-500 rounded-full animate-bounce"></div>
                        <div className="w-1 h-1 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-1 h-1 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

           {/* Input */}
           <div className="p-4 border-t border-gray-200">
            <div className="flex gap-2">
             <div className="flex-1 relative">
               <textarea
                 value={inputText}
                 onChange={(e) => setInputText(e.target.value)}
                 onKeyPress={handleKeyPress}
                 placeholder={t.placeholder}
                 className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                 style={{ color: "black" }}
                 rows={1}
                  />
                </div>
                
                <button
                  onClick={isListening ? stopVoiceInput : startVoiceInput}
                  className={`p-2 rounded-lg transition-colors ${
                    isListening 
                      ? 'bg-red-500 hover:bg-red-600 text-white' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>

                <button
                  onClick={sendMessage}
                  disabled={!inputText.trim()}
                  className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white p-2 rounded-lg transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}