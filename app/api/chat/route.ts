import { NextRequest, NextResponse } from 'next/server';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const SYSTEM_PROMPT = `You are a warm, wise, and friendly AI wellness companion named Nadi. You appear as a kind elderly gentleman with silver hair and glasses. You speak with empathy, warmth, and gentle wisdom. You help users with their physical, emotional, and financial wellness journey.

Keep your responses concise and conversational — 2-4 sentences max. Be encouraging, caring, and occasionally use gentle humor. Address the user personally and reference their wellness data when relevant.`;

export async function POST(req: NextRequest) {
  if (!OPENAI_API_KEY) {
    return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 });
  }

  try {
    const { message, history = [] } = await req.json();

    // 1. Get chat response
    const chatRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...history.slice(-10), // last 10 messages for context
          { role: 'user', content: message },
        ],
        max_tokens: 150,
        temperature: 0.8,
      }),
    });

    if (!chatRes.ok) {
      const err = await chatRes.text();
      return NextResponse.json({ error: `Chat API error: ${err}` }, { status: chatRes.status });
    }

    const chatData = await chatRes.json();
    const text = chatData.choices[0].message.content;

    // 2. Generate TTS audio
    const ttsRes = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'tts-1',
        input: text,
        voice: 'onyx', // Deep, warm male voice
        response_format: 'mp3',
        speed: 0.95,
      }),
    });

    if (!ttsRes.ok) {
      // Return text only if TTS fails
      return NextResponse.json({ text, audio: null });
    }

    // Convert audio to base64
    const audioBuffer = await ttsRes.arrayBuffer();
    const audioBase64 = Buffer.from(audioBuffer).toString('base64');

    return NextResponse.json({ text, audio: audioBase64 });

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
