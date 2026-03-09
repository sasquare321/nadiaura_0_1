import { NextRequest, NextResponse } from 'next/server';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const SYSTEM_PROMPT = `You are Nadi, a warm and wise AI wellness companion.
Be concise, conversational, and empathetic.
Reply in 2-3 short sentences only.`;

export async function POST(req: NextRequest) {
  if (!OPENAI_API_KEY) {
    return NextResponse.json(
      { error: 'OpenAI API key not configured' },
      { status: 500 }
    );
  }

  try {
    const { message, history = [] } = await req.json();

    // 1. Chat response
    const chatRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...history.slice(-4),
          { role: 'user', content: message },
        ],
        max_tokens: 90,
        temperature: 0.6,
      }),
    });

    if (!chatRes.ok) {
      const err = await chatRes.text();
      return NextResponse.json(
        { error: `Chat API error: ${err}` },
        { status: chatRes.status }
      );
    }

    const chatData = await chatRes.json();
    const text = chatData.choices?.[0]?.message?.content?.trim() || '';

    if (!text) {
      return NextResponse.json({ error: 'No text generated' }, { status: 500 });
    }

    // 2. TTS voice
    const ttsRes = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'tts-1',
        input: text,
        voice: 'onyx',
        response_format: 'mp3',
        speed: 1.0,
      }),
    });

    // if TTS fails, still return text
    if (!ttsRes.ok) {
      return NextResponse.json({ text, audio: null });
    }

    const audioBuffer = await ttsRes.arrayBuffer();
    const audioBase64 = Buffer.from(audioBuffer).toString('base64');

    return NextResponse.json({
      text,
      audio: audioBase64,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}