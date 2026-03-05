'use client';
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';

/* ─── Types ──────────────────────────────────────────────── */
interface Message { role: 'user' | 'assistant'; content: string; }
type Status = 'idle' | 'listening' | 'thinking' | 'speaking';

/* ─── Animated SVG Companion ─────────────────────────────── */
function Companion({ mouthOpen, blinking }: { mouthOpen: number; blinking: boolean }) {
  const eyeScaleY = blinking ? 0.06 : 1;
  const mouthOpenPx = mouthOpen * 22;

  return (
    <svg viewBox="0 0 320 370" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', maxWidth: 320 }}>
      <defs>
        <radialGradient id="skinGrad" cx="45%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#f5c5a3" /><stop offset="100%" stopColor="#e0a882" />
        </radialGradient>
        <linearGradient id="hairGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d0d0d0" /><stop offset="100%" stopColor="#a0a8b0" />
        </linearGradient>
        <linearGradient id="jacketGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7a8a9a" /><stop offset="100%" stopColor="#4a5a6a" />
        </linearGradient>
        <linearGradient id="shirtGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4a8fd0" /><stop offset="100%" stopColor="#2a6faa" />
        </linearGradient>
        <radialGradient id="beardGrad" cx="50%" cy="30%" r="60%">
          <stop offset="0%" stopColor="#e8e8e8" /><stop offset="100%" stopColor="#c0c4c8" />
        </radialGradient>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="rgba(0,0,0,0.4)"/>
        </filter>
      </defs>

      {/* Body / Jacket */}
      <ellipse cx="160" cy="360" rx="130" ry="60" fill="url(#jacketGrad)" />
      <path d="M 60 310 Q 80 290 120 280 L 160 340 L 200 280 Q 240 290 260 310 L 280 380 H 40 Z" fill="url(#jacketGrad)" />
      <path d="M 120 280 L 140 320 L 160 340 L 155 280 Z" fill="#5a6a7a" />
      <path d="M 200 280 L 180 320 L 160 340 L 165 280 Z" fill="#5a6a7a" />
      <path d="M 140 320 L 160 340 L 180 320 L 172 278 L 148 278 Z" fill="url(#shirtGrad)" />
      <path d="M 148 278 L 155 295 L 160 300 L 165 295 L 172 278 L 162 272 L 158 272 Z" fill="#5ab0e8" />

      {/* Neck */}
      <rect x="142" y="248" width="36" height="35" rx="8" fill="url(#skinGrad)" />

      {/* Head */}
      <ellipse cx="160" cy="165" rx="95" ry="110" fill="url(#skinGrad)" filter="url(#shadow)" />

      {/* Ears */}
      <ellipse cx="67" cy="170" rx="14" ry="18" fill="url(#skinGrad)" />
      <ellipse cx="67" cy="170" rx="8" ry="12" fill="#d4956e" />
      <ellipse cx="253" cy="170" rx="14" ry="18" fill="url(#skinGrad)" />
      <ellipse cx="253" cy="170" rx="8" ry="12" fill="#d4956e" />

      {/* Hair */}
      <ellipse cx="160" cy="73" rx="90" ry="45" fill="url(#hairGrad)" />
      <path d="M 72 115 Q 65 90 70 65 Q 90 40 130 38 Q 160 32 190 38 Q 225 42 242 68 Q 250 90 248 115 Q 230 75 210 68 Q 185 58 160 60 Q 132 58 108 68 Q 88 76 72 115 Z" fill="url(#hairGrad)" />
      <path d="M 90 55 Q 100 48 115 50" stroke="#b0b8c0" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <path d="M 105 48 Q 125 42 145 44" stroke="#b0b8c0" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <path d="M 175 44 Q 195 42 210 48" stroke="#b0b8c0" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <path d="M 215 50 Q 228 55 235 62" stroke="#b0b8c0" strokeWidth="2" fill="none" strokeLinecap="round"/>

      {/* Eyebrows */}
      <path d="M 108 120 Q 120 112 136 116" stroke="#9aa0a8" strokeWidth="5" fill="none" strokeLinecap="round"/>
      <path d="M 184 116 Q 200 112 212 120" stroke="#9aa0a8" strokeWidth="5" fill="none" strokeLinecap="round"/>

      {/* Glasses */}
      <circle cx="122" cy="148" r="28" fill="none" stroke="#3a3a3a" strokeWidth="3.5" />
      <circle cx="198" cy="148" r="28" fill="none" stroke="#3a3a3a" strokeWidth="3.5" />
      <path d="M 150 147 Q 160 143 170 147" stroke="#3a3a3a" strokeWidth="3" fill="none"/>
      <path d="M 94 142 Q 80 138 70 140" stroke="#3a3a3a" strokeWidth="3" fill="none"/>
      <path d="M 226 142 Q 240 138 250 140" stroke="#3a3a3a" strokeWidth="3" fill="none"/>

      {/* Eyes – animated */}
      {/* LEFT */}
      <ellipse cx="122" cy="148" rx="20" ry="16" fill="white" />
      <ellipse cx="122" cy="148" rx="11" ry={11 * eyeScaleY} fill="#6b4226"
        style={{ transition: blinking ? 'ry 0.05s ease-in' : 'ry 0.12s ease-out' }} />
      <ellipse cx="122" cy="148" rx="5" ry={5 * eyeScaleY} fill="#111"
        style={{ transition: blinking ? 'ry 0.05s ease-in' : 'ry 0.12s ease-out' }} />
      {!blinking && <circle cx="126" cy="144" r="3" fill="white" opacity="0.9" />}
      <ellipse cx="122" cy="148" rx="22" ry={22 * (1 - eyeScaleY) * 0.85} fill="#e5a87a"
        style={{ transition: blinking ? 'ry 0.05s ease-in' : 'ry 0.12s ease-out' }} />
      {/* RIGHT */}
      <ellipse cx="198" cy="148" rx="20" ry="16" fill="white" />
      <ellipse cx="198" cy="148" rx="11" ry={11 * eyeScaleY} fill="#6b4226"
        style={{ transition: blinking ? 'ry 0.05s ease-in' : 'ry 0.12s ease-out' }} />
      <ellipse cx="198" cy="148" rx="5" ry={5 * eyeScaleY} fill="#111"
        style={{ transition: blinking ? 'ry 0.05s ease-in' : 'ry 0.12s ease-out' }} />
      {!blinking && <circle cx="202" cy="144" r="3" fill="white" opacity="0.9" />}
      <ellipse cx="198" cy="148" rx="22" ry={22 * (1 - eyeScaleY) * 0.85} fill="#e5a87a"
        style={{ transition: blinking ? 'ry 0.05s ease-in' : 'ry 0.12s ease-out' }} />

      {/* Nose */}
      <path d="M 155 165 Q 148 185 145 195 Q 152 202 160 200 Q 168 202 175 195 Q 172 185 165 165 Z" fill="#d4956e" opacity="0.6"/>
      <ellipse cx="149" cy="196" rx="7" ry="5" fill="#c0805a" opacity="0.7"/>
      <ellipse cx="171" cy="196" rx="7" ry="5" fill="#c0805a" opacity="0.7"/>

      {/* Mustache */}
      <path d="M 135 210 Q 148 205 160 207 Q 172 205 185 210 Q 175 215 160 213 Q 145 215 135 210 Z" fill="#d8dcdf" />

      {/* Mouth – animated */}
      {mouthOpen < 0.1 ? (
        <path d={`M 138 222 Q 160 ${230 + mouthOpenPx * 0.3} 182 222`} stroke="#8a4a2a" strokeWidth="3" fill="none" strokeLinecap="round"/>
      ) : (
        <g>
          <ellipse cx="160" cy="224" rx={22} ry={mouthOpenPx * 0.6 + 4} fill="#3a1a0a" />
          {mouthOpen > 0.3 && <rect x="142" y="215" width="36" height={Math.min(mouthOpenPx * 0.35, 10)} rx="3" fill="white" />}
          {mouthOpen > 0.4 && <rect x="144" y={228 + mouthOpenPx * 0.2} width="32" height={Math.min(mouthOpenPx * 0.28, 8)} rx="3" fill="#f0f0f0" />}
          <path d="M 138 218 Q 160 215 182 218" stroke="#b05a3a" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
          <path d={`M 138 ${228 + mouthOpenPx * 0.5} Q 160 ${233 + mouthOpenPx * 0.6} 182 ${228 + mouthOpenPx * 0.5}`} stroke="#9a4a2a" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        </g>
      )}

      {/* Beard */}
      <path d="M 100 210 Q 90 235 95 268 Q 110 305 160 315 Q 210 305 225 268 Q 230 235 220 210 Q 200 218 160 220 Q 120 218 100 210 Z" fill="url(#beardGrad)" />
      <path d="M 115 235 Q 118 255 120 275" stroke="#d0d4d8" strokeWidth="1.5" fill="none" opacity="0.6"/>
      <path d="M 140 228 Q 142 255 142 280" stroke="#d0d4d8" strokeWidth="1.5" fill="none" opacity="0.6"/>
      <path d="M 160 228 Q 160 258 158 285" stroke="#d0d4d8" strokeWidth="1.5" fill="none" opacity="0.6"/>
      <path d="M 180 228 Q 178 255 178 280" stroke="#d0d4d8" strokeWidth="1.5" fill="none" opacity="0.6"/>
      <path d="M 200 235 Q 200 255 198 272" stroke="#d0d4d8" strokeWidth="1.5" fill="none" opacity="0.6"/>

      {/* Cheeks */}
      <ellipse cx="96" cy="185" rx="16" ry="10" fill="#e07060" opacity="0.18"/>
      <ellipse cx="224" cy="185" rx="16" ry="10" fill="#e07060" opacity="0.18"/>

      {/* Forehead wrinkles */}
      <path d="M 120 108 Q 140 104 160 105" stroke="#c8946c" strokeWidth="1.2" fill="none" opacity="0.5"/>
      <path d="M 115 118 Q 137 114 160 115" stroke="#c8946c" strokeWidth="1.2" fill="none" opacity="0.4"/>
      <path d="M 160 105 Q 180 104 200 108" stroke="#c8946c" strokeWidth="1.2" fill="none" opacity="0.5"/>
    </svg>
  );
}

/* ─── Waveform – fixed: no mixed shorthand/longhand ─────── */
function Waveform({ active, color = 'var(--accent)' }: { active: boolean; color?: string }) {
  // Pre-generate stable random durations (not regenerated on re-render)
  const params = useMemo(() =>
    Array.from({ length: 22 }, (_, i) => ({
      dur: (0.28 + Math.random() * 0.42).toFixed(2),
      delay: (i * 0.04).toFixed(2),
    })),
  []);

  return (
    <div style={{ display: 'flex', gap: 3, alignItems: 'center', height: 32 }}>
      {params.map((p, i) => (
        <div
          key={i}
          style={{
            width: 3,
            borderRadius: 3,
            background: color,
            height: active ? 8 : 4,
            opacity: active ? 0.85 : 0.25,
            /* Use full animation shorthand — no separate animationDelay */
            animation: active
              ? `wave-bar ${p.dur}s ${p.delay}s ease-in-out infinite alternate`
              : 'none',
          }}
        />
      ))}
    </div>
  );
}

/* ─── Main Page ──────────────────────────────────────────── */
export default function AISessionPage() {
  const router = useRouter();
  const [sessionActive, setSessionActive] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const [messages, setMessages] = useState<Message[]>([]);
  const [transcript, setTranscript] = useState('');
  const [lastReply, setLastReply] = useState('Hi there! I\'m Nadi. Press Start to begin our conversation.');
  const [mouthOpen, setMouthOpen] = useState(0);
  const [blinking, setBlinking] = useState(false);
  const [error, setError] = useState('');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number>(0);
  const blinkTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  // Keep a mutable ref to messages for use inside callbacks
  const messagesRef = useRef<Message[]>([]);
  messagesRef.current = messages;
  // Whether we should auto-restart listening after Nadi speaks
  const sessionActiveRef = useRef(false);
  sessionActiveRef.current = sessionActive;

  /* ── Random blink loop ── */
  const scheduleBlink = useCallback(() => {
    const delay = 2500 + Math.random() * 4500;
    blinkTimerRef.current = setTimeout(() => {
      setBlinking(true);
      setTimeout(() => { setBlinking(false); scheduleBlink(); }, 160);
    }, delay);
  }, []);

  useEffect(() => {
    scheduleBlink();
    return () => { if (blinkTimerRef.current) clearTimeout(blinkTimerRef.current); };
  }, [scheduleBlink]);

  /* ── Mouth animation from audio ── */
  const startMouthAnimation = useCallback((audioEl: HTMLAudioElement) => {
    if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
      audioContextRef.current = new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    const ctx = audioContextRef.current;

    // Resume if suspended (browser autoplay policy)
    if (ctx.state === 'suspended') ctx.resume();

    const analyser = ctx.createAnalyser();
    analyser.fftSize = 256;
    analyserRef.current = analyser;

    const source = ctx.createMediaElementSource(audioEl);
    source.connect(analyser);
    analyser.connect(ctx.destination);

    const data = new Uint8Array(analyser.frequencyBinCount);
    const tick = () => {
      analyser.getByteFrequencyData(data);
      let sum = 0;
      for (let i = 2; i < 24; i++) sum += data[i];
      setMouthOpen(Math.min(1, (sum / 22) / 95));
      animFrameRef.current = requestAnimationFrame(tick);
    };
    tick();
  }, []);

  const stopMouthAnimation = useCallback(() => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    setMouthOpen(0);
  }, []);

  /* ── Play TTS audio ── */
  const playAudio = useCallback((base64: string) => {
    return new Promise<void>((resolve) => {
      if (currentAudioRef.current) currentAudioRef.current.pause();
      const audio = new Audio(`data:audio/mp3;base64,${base64}`);
      currentAudioRef.current = audio;
      audio.crossOrigin = 'anonymous';
      audio.addEventListener('play', () => startMouthAnimation(audio));
      audio.addEventListener('ended', () => { stopMouthAnimation(); resolve(); });
      audio.addEventListener('error', () => { stopMouthAnimation(); resolve(); });
      audio.play().catch(() => resolve());
    });
  }, [startMouthAnimation, stopMouthAnimation]);

  /* ── Start one round of speech recognition ── */
  const startOneTurn = useCallback(() => {
    if (!sessionActiveRef.current) return;
    if (!('SpeechRecognition' in window) && !('webkitSpeechRecognition' in window)) {
      setError('Speech recognition not supported. Please use Chrome or Edge.');
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const win = window as any;
    const SR = win.SpeechRecognition || win.webkitSpeechRecognition;
    const recognition = new SR();
    recognition.continuous = false;    // single-utterance: browser auto-detects end
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognitionRef.current = recognition;

    recognition.onstart = () => setStatus('listening');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (e: any) => {
      const t = Array.from(e.results)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map((r: any) => r[0].transcript)
        .join('');
      setTranscript(t);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onerror = (e: any) => {
      // 'no-speech' just means silence — restart quietly
      if (e.error === 'no-speech') {
        if (sessionActiveRef.current) setTimeout(startOneTurn, 300);
        return;
      }
      setError(`Mic error: ${e.error}`);
    };

    recognition.onend = () => {
      // Capture the final transcript from ref (state may be stale in closure)
      const finalText = (recognitionRef.current as { _finalText?: string })?._finalText || '';
      setTranscript('');
      if (finalText.trim() && sessionActiveRef.current) {
        sendTurn(finalText.trim());
      } else if (sessionActiveRef.current) {
        setTimeout(startOneTurn, 300);
      } else {
        setStatus('idle');
      }
    };

    // Track final results manually to avoid stale-closure transcript
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (e: any) => {
      let interim = '';
      let finalText = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) finalText += e.results[i][0].transcript;
        else interim += e.results[i][0].transcript;
      }
      setTranscript(finalText || interim);
      if (finalText) {
        (recognitionRef.current as { _finalText?: string })._finalText = finalText;
      }
    };

    recognition.start();
  }, []); // no deps — uses refs

  /* ── Send user text → API → Nadi speaks → restart listening ── */
  const sendTurn = useCallback(async (text: string) => {
    setTranscript('');
    setStatus('thinking');
    setError('');

    const userMsg: Message = { role: 'user', content: text };
    const currentHistory = messagesRef.current;
    const updatedHistory = [...currentHistory, userMsg];
    setMessages(updatedHistory);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history: currentHistory }),
      });

      if (!res.ok) throw new Error(`Server error ${res.status}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      const aiMsg: Message = { role: 'assistant', content: data.text };
      setMessages([...updatedHistory, aiMsg]);
      setLastReply(data.text);
      setStatus('speaking');

      if (data.audio) {
        await playAudio(data.audio);
      } else {
        // Fallback: simulate mouth with timer when no audio
        const dur = data.text.length * 52;
        const iv = setInterval(() => setMouthOpen(0.2 + Math.random() * 0.7), 100);
        await new Promise(r => setTimeout(r, dur));
        clearInterval(iv);
        stopMouthAnimation();
      }

      // After speaking, auto-restart listening if session still active
      if (sessionActiveRef.current) {
        setStatus('listening');
        setTimeout(startOneTurn, 400);
      } else {
        setStatus('idle');
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Unknown error';
      setError(msg);
      setStatus('idle');
      stopMouthAnimation();
      if (sessionActiveRef.current) setTimeout(startOneTurn, 1500);
    }
  }, [playAudio, stopMouthAnimation, startOneTurn]);

  /* ── Start full session ── */
  const startSession = useCallback(() => {
    setSessionActive(true);
    sessionActiveRef.current = true;
    setMessages([]);
    setError('');
    setLastReply('');
    setTimeout(startOneTurn, 200);
  }, [startOneTurn]);

  /* ── End session ── */
  const endSession = useCallback(() => {
    setSessionActive(false);
    sessionActiveRef.current = false;
    recognitionRef.current?.stop();
    recognitionRef.current?.abort?.();
    if (currentAudioRef.current) currentAudioRef.current.pause();
    stopMouthAnimation();
    setStatus('idle');
    setTranscript('');
    router.push('/home');
  }, [stopMouthAnimation, router]);

  /* ── Cleanup on unmount ── */
  useEffect(() => {
    return () => {
      sessionActiveRef.current = false;
      recognitionRef.current?.stop();
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (currentAudioRef.current) currentAudioRef.current.pause();
      audioContextRef.current?.close();
    };
  }, []);

  /* ── Colors per status ── */
  const statusColor: Record<Status, string> = {
    idle: 'var(--text-muted)',
    listening: 'var(--accent)',
    thinking: '#ffaa00',
    speaking: '#4499ff',
  };
  const statusLabel: Record<Status, string> = {
    idle: sessionActive ? 'Getting ready...' : 'Press Start to chat',
    listening: 'Listening — speak now...',
    thinking: 'Thinking...',
    speaking: 'Nadi is speaking...',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg-primary)', position: 'relative', overflow: 'hidden' }}>

      {/* Ambient glow */}
      <div style={{ position: 'absolute', top: '25%', left: '50%', transform: 'translate(-50%,-50%)', width: 340, height: 340, borderRadius: '50%', background: 'radial-gradient(circle, rgba(34,255,85,0.05) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

      {/* ─── Header ─── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 20px 0', position: 'relative', zIndex: 2 }}>
        <button onClick={endSession}
          style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white', fontSize: 18 }}>
          ✕
        </button>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: 16 }}>Nadi AI</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center' }}>
            <div style={{
              width: 7, height: 7, borderRadius: '50%',
              background: sessionActive ? 'var(--accent)' : 'var(--text-muted)',
              boxShadow: sessionActive ? '0 0 8px var(--accent)' : 'none',
              transition: 'all 0.3s'
            }} />
            <span style={{ color: sessionActive ? 'var(--accent)' : 'var(--text-muted)', fontWeight: 600, fontSize: 11, letterSpacing: 1 }}>
              {sessionActive ? 'LIVE SESSION' : 'READY'}
            </span>
          </div>
        </div>
        <div style={{ width: 44 }} />
      </div>

      {/* ─── Character area ─── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 2, padding: '0 24px' }}>

        {/* Character with status rings */}
        <div style={{ width: '100%', maxWidth: 270, position: 'relative', padding: 10 }}>
          {status === 'speaking' && (
            <>
              <div className="animate-pulse-ring" style={{ position: 'absolute', inset: -14, borderRadius: '50%', border: '2px solid rgba(68,153,255,0.35)' }} />
              <div className="animate-pulse-ring-2" style={{ position: 'absolute', inset: -28, borderRadius: '50%', border: '1px solid rgba(68,153,255,0.15)' }} />
            </>
          )}
          {status === 'listening' && (
            <>
              <div className="animate-pulse-ring" style={{ position: 'absolute', inset: -14, borderRadius: '50%', border: '2px solid rgba(34,255,85,0.4)' }} />
              <div className="animate-pulse-ring-2" style={{ position: 'absolute', inset: -28, borderRadius: '50%', border: '1px solid rgba(34,255,85,0.18)' }} />
            </>
          )}
          {status === 'thinking' && (
            <div className="animate-spin-slow" style={{ position: 'absolute', inset: -14, borderRadius: '50%', border: '2px dashed rgba(255,170,0,0.4)' }} />
          )}
          <div style={{ background: 'radial-gradient(ellipse at center, rgba(34,255,85,0.07) 0%, transparent 70%)', borderRadius: '50%' }}>
            <Companion mouthOpen={mouthOpen} blinking={blinking} />
          </div>
        </div>

        {/* Status text */}
        <div style={{ marginTop: 18, textAlign: 'center', minHeight: 52, padding: '0 20px' }}>
          {transcript ? (
            <p style={{ color: 'var(--accent)', fontWeight: 500, fontSize: 15, lineHeight: 1.5 }}>
              "{transcript}"
            </p>
          ) : lastReply && status !== 'listening' ? (
            <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.6, fontStyle: 'italic' }}>
              "{lastReply}"
            </p>
          ) : (
            <p style={{ color: statusColor[status], fontSize: 15, fontWeight: 600, transition: 'color 0.3s' }}>
              {statusLabel[status]}
            </p>
          )}
        </div>

        {/* Waveform */}
        <div style={{ marginTop: 10, height: 34, display: 'flex', alignItems: 'center' }}>
          <Waveform
            active={status === 'listening' || status === 'speaking'}
            color={status === 'speaking' ? '#4499ff' : 'var(--accent)'}
          />
        </div>

        {/* Error banner */}
        {error && (
          <div style={{ background: 'rgba(255,68,68,0.1)', border: '1px solid rgba(255,68,68,0.25)', borderRadius: 10, padding: '8px 14px', marginTop: 10, maxWidth: 300 }}>
            <p style={{ color: '#ff6666', fontSize: 13 }}>{error}</p>
          </div>
        )}

        {/* Chat bubbles – last 4 messages */}
        {messages.length > 0 && (
          <div style={{ marginTop: 12, width: '100%', maxWidth: 320, maxHeight: 88, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 5 }}>
            {messages.slice(-4).map((m, i) => (
              <div key={i} style={{
                background: m.role === 'user' ? 'rgba(34,255,85,0.1)' : 'rgba(68,153,255,0.1)',
                borderRadius: 10, padding: '5px 12px',
                alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '88%',
                border: `1px solid ${m.role === 'user' ? 'rgba(34,255,85,0.15)' : 'rgba(68,153,255,0.15)'}`,
              }}>
                <p style={{ color: m.role === 'user' ? 'var(--accent)' : '#88bbff', fontSize: 12, lineHeight: 1.4 }}>{m.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ─── Single Start / End button ─── */}
      <div style={{ padding: '0 28px 38px', position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>

        {!sessionActive ? (
          /* START button */
          <button
            onClick={startSession}
            style={{
              width: '100%', maxWidth: 300,
              padding: '18px',
              borderRadius: 18,
              background: 'var(--accent)',
              border: 'none',
              color: '#000',
              fontWeight: 800,
              fontSize: 18,
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              boxShadow: '0 0 28px rgba(34,255,85,0.35)',
              transition: 'all 0.2s',
            }}>
            🎙️ Start Conversation
          </button>
        ) : (
          /* END button (shown during active session) */
          <button
            onClick={endSession}
            style={{
              width: '100%', maxWidth: 300,
              padding: '16px',
              borderRadius: 18,
              background: 'rgba(255,68,68,0.12)',
              border: '2px solid rgba(255,68,68,0.4)',
              color: '#ff5555',
              fontWeight: 700,
              fontSize: 17,
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              transition: 'all 0.2s',
            }}>
            📴 End Session
          </button>
        )}

        {/* Instruction text */}
        <p style={{ color: 'var(--text-muted)', fontSize: 12, textAlign: 'center' }}>
          {sessionActive
            ? 'Nadi listens automatically — just speak naturally'
            : 'Start a live conversation with your AI companion'}
        </p>
      </div>

      {/* Keyframes for waveform bars */}
      <style>{`
        @keyframes wave-bar {
          from { transform: scaleY(0.25); }
          to   { transform: scaleY(1); }
        }
      `}</style>
    </div>
  );
}
