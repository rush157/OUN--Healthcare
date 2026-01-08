import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 OpenRouter API called!');
    const { message, language, context } = await request.json();
    console.log('📝 Message:', message, 'Language:', language);
    
    const openrouterApiKey = process.env.OPENROUTER_API_KEY;
    console.log('🔑 API Key exists:', !!openrouterApiKey);
    
    if (!openrouterApiKey) {
      console.error('❌ No OpenRouter API key found!');
      return NextResponse.json({ error: 'OpenRouter API key not configured' }, { status: 400 });
    }

    const systemPrompt = `You are a helpful AI assistant for a health finder app. You can answer ANY question the user asks - not just health-related ones. 
    
    Be conversational, friendly, and helpful. If asked about health topics, provide good advice but always recommend consulting healthcare professionals for serious issues.
    
    Respond in ${language === 'hi' ? 'Hindi' : 'English'}.
    
    Keep responses concise but informative. Use emojis when appropriate to make responses engaging.
    
    You can discuss any topic: health, technology, general knowledge, casual conversation, etc.`;

    console.log('🌐 Making request to OpenRouter...');
    const requestBody = {
      model: 'openai/gpt-3.5-turbo', // Fallback to GPT-3.5-turbo
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ],
      max_tokens: 300,
      temperature: 0.7,
    };
    
    console.log('📦 Request body:', JSON.stringify(requestBody, null, 2));
    
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openrouterApiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'Health Finder App'
      },
      body: JSON.stringify(requestBody),
    });

    console.log('📡 OpenRouter response status:', response.status);

    if (!response.ok) {
      const errorData = await response.text();
      console.error('❌ OpenRouter API error:', response.status, errorData);
      throw new Error(`OpenRouter API request failed: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ OpenRouter response data:', data);
    const aiResponse = data.choices[0]?.message?.content || 'I apologize, but I cannot process your request right now.';

    console.log('🎯 Final AI response:', aiResponse);
    return NextResponse.json({ response: aiResponse });
  } catch (error) {
    console.error('OpenRouter API error:', error);
    return NextResponse.json({ error: 'Failed to get AI response' }, { status: 500 });
  }
}