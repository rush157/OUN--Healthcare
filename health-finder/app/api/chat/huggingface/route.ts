import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { message, language, context } = await request.json();
    
    // Using Hugging Face's free inference API
    const hfApiKey = process.env.HUGGINGFACE_API_KEY;
    
    // Even without API key, some models work with rate limits
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (hfApiKey) {
      headers['Authorization'] = `Bearer ${hfApiKey}`;
    }

    const prompt = `Health Assistant: Answer this health question in ${language === 'hi' ? 'Hindi' : 'English'}: "${message}". Provide helpful advice but recommend consulting healthcare professionals. Keep it concise.`;

    // Try multiple models for better reliability
    const models = [
      'microsoft/DialoGPT-medium',
      'facebook/blenderbot-400M-distill',
      'microsoft/DialoGPT-small'
    ];

    for (const model of models) {
      try {
        const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            inputs: prompt,
            parameters: {
              max_length: 200,
              temperature: 0.7,
              do_sample: true,
            }
          }),
        });

        if (response.ok) {
          const data = await response.json();
          let aiResponse = '';
          
          if (Array.isArray(data) && data[0]?.generated_text) {
            aiResponse = data[0].generated_text.replace(prompt, '').trim();
          } else if (data.generated_text) {
            aiResponse = data.generated_text.replace(prompt, '').trim();
          }
          
          if (aiResponse && aiResponse.length > 10) {
            return NextResponse.json({ response: aiResponse });
          }
        }
      } catch (modelError) {
        console.log(`Model ${model} failed, trying next...`);
        continue;
      }
    }

    throw new Error('All Hugging Face models failed');
  } catch (error) {
    console.error('Hugging Face API error:', error);
    return NextResponse.json({ error: 'Failed to get AI response' }, { status: 500 });
  }
}