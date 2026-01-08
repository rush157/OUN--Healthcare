# AI Chatbot Setup Guide

Your Health Finder now has a **smart AI chatbot** that can answer any health-related questions! Here's how to set it up:

## 🤖 How It Works

The chatbot uses **multiple AI services** with automatic fallbacks:

1. **OpenAI GPT** (if configured) - Most advanced
2. **Google Gemini** (if configured) - Free alternative  
3. **Hugging Face** (if configured) - Open source models
4. **Local AI** (always works) - Built-in medical knowledge base
5. **Keyword fallback** (always works) - Enhanced responses

## 🚀 Quick Start (No Setup Required!)

**Your chatbot already works!** Even without any API keys, it uses:
- Local medical knowledge base
- Enhanced keyword matching
- Intelligent health responses

Just open your app and start chatting!

## 🔑 Optional: Add AI API Keys for Enhanced Responses

### Option 1: OpenAI (Most Advanced)
1. Go to https://platform.openai.com/api-keys
2. Create an account and get API key
3. Add to `.env.local`: `OPENAI_API_KEY=your_key_here`

**Cost:** ~$0.002 per conversation

### Option 2: Google Gemini (Free!)
1. Go to https://makersuite.google.com/app/apikey
2. Create free API key (no credit card required)
3. Add to `.env.local`: `GEMINI_API_KEY=your_key_here`

**Cost:** Free up to 60 requests per minute

### Option 3: Hugging Face (Free!)
1. Go to https://huggingface.co/settings/tokens
2. Create free account and token
3. Add to `.env.local`: `HUGGINGFACE_API_KEY=your_key_here`

**Cost:** Free with rate limits

## 🧪 Test Your Chatbot

Try asking these questions:

### English:
- "I have a fever, what should I do?"
- "How to manage diabetes?"
- "What are symptoms of high blood pressure?"
- "I have chest pain, is it serious?"
- "Best diet for heart health?"

### Hindi:
- "मुझे बुखार है, क्या करूं?"
- "मधुमेह कैसे नियंत्रित करें?"
- "उच्च रक्तचाप के लक्षण क्या हैं?"
- "सीने में दर्द है, क्या गंभीर है?"

## 🎯 Features

✅ **Multi-language support** (English & Hindi)
✅ **Voice input** (speak your questions)
✅ **Medical knowledge base** (symptoms, conditions, treatments)
✅ **Always recommends professional consultation**
✅ **Works offline** (local AI fallback)
✅ **Multiple AI providers** (automatic failover)
✅ **Real-time responses**
✅ **Context-aware conversations**

## 🔒 Privacy & Safety

- **No data stored**: Conversations are not saved
- **Medical disclaimer**: Always recommends consulting professionals
- **Safe responses**: Trained on medical guidelines
- **Privacy-first**: API calls are encrypted

## 🛠️ Troubleshooting

### Chatbot not responding?
1. Check browser console for errors
2. Verify API keys in `.env.local`
3. Restart development server: `npm run dev`

### Slow responses?
1. OpenAI/Gemini might be rate-limited
2. Local AI will automatically take over
3. Check your internet connection

### Wrong language responses?
1. Switch language in the app interface
2. The AI will respond in the selected language

## 📊 Response Quality

| AI Service | Quality | Speed | Cost | Availability |
|------------|---------|-------|------|--------------|
| OpenAI GPT | ⭐⭐⭐⭐⭐ | Fast | Paid | 99.9% |
| Google Gemini | ⭐⭐⭐⭐ | Fast | Free | 99% |
| Hugging Face | ⭐⭐⭐ | Medium | Free | 95% |
| Local AI | ⭐⭐⭐ | Instant | Free | 100% |

## 🎉 Your AI Chatbot is Ready!

**No setup required** - your chatbot works immediately with built-in intelligence!

**Optional enhancement** - add API keys for even smarter responses!

Start chatting and experience the power of AI-assisted healthcare! 🏥🤖