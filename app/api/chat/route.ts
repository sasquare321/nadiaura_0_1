import { NextRequest, NextResponse } from 'next/server';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const DEFAULT_SYSTEM_PROMPT = `You are Nadi, a warm and wise AI wellness companion.
Be concise, conversational, and empathetic.
Reply in 2-3 short sentences only.`;

export async function POST(req: NextRequest) {
  if (!OPENAI_API_KEY) {
    return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 });
  }

  try {
    const { message, history = [], systemPrompt, voice = 'onyx', speed = 0.92 } = await req.json();

    const activePrompt = systemPrompt || DEFAULT_SYSTEM_PROMPT;

    // ── Step 1: Chat completion ───────────────────────────────────────────────
    const chatRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: activePrompt },
          ...history.slice(-6),
          { role: 'user', content: message },
        ],
        max_tokens: 100,
        temperature: 0.7,
      }),
    });

    if (!chatRes.ok) {
      const err = await chatRes.text();
      return NextResponse.json({ error: `Chat API error: ${err}` }, { status: chatRes.status });
    }

    const chatData = await chatRes.json();
    const text = chatData.choices?.[0]?.message?.content?.trim() || '';
    if (!text) return NextResponse.json({ error: 'No text generated' }, { status: 500 });

    // ── Step 2: TTS ───────────────────────────────────────────────────────────
    const ttsRes = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: { Authorization: `Bearer ${OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'tts-1',
        input: text,
        voice,
        response_format: 'mp3',
        speed,
      }),
    });

    if (!ttsRes.ok) return NextResponse.json({ text, audio: null });

    const audioBase64 = Buffer.from(await ttsRes.arrayBuffer()).toString('base64');
    return NextResponse.json({ text, audio: audioBase64 });

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
