'use client';
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';

/* ─── Types ──────────────────────────────────────────────── */
interface Message {
  role: 'user' | 'assistant';
  content: string;
}
type Status = 'idle' | 'listening' | 'thinking' | 'speaking';

/* ─── Animated SVG Companion ─────────────────────────────── */
function Companion({ mouthOpen, blinking }: { mouthOpen: number; blinking: boolean }) {
  const eyeScaleY = blinking ? 0.06 : 1;
  const mouthOpenPx = mouthOpen * 22;

  return (
    <svg
      viewBox="0 0 320 370"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', height: '100%', maxWidth: 320 }}
    >
      <defs>
        <radialGradient id="skinGrad" cx="45%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#f5c5a3" />
          <stop offset="100%" stopColor="#e0a882" />
        </radialGradient>
        <linearGradient id="hairGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d0d0d0" />
          <stop offset="100%" stopColor="#a0a8b0" />
        </linearGradient>
        <linearGradient id="jacketGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7a8a9a" />
          <stop offset="100%" stopColor="#4a5a6a" />
        </linearGradient>
        <linearGradient id="shirtGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4a8fd0" />
          <stop offset="100%" stopColor="#2a6faa" />
        </linearGradient>
        <radialGradient id="beardGrad" cx="50%" cy="30%" r="60%">
          <stop offset="0%" stopColor="#e8e8e8" />
          <stop offset="100%" stopColor="#c0c4c8" />
        </radialGradient>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="rgba(0,0,0,0.4)" />
        </filter>
      </defs>

      <ellipse cx="160" cy="360" rx="130" ry="60" fill="url(#jacketGrad)" />
      <path d="M 60 310 Q 80 290 120 280 L 160 340 L 200 280 Q 240 290 260 310 L 280 380 H 40 Z" fill="url(#jacketGrad)" />
      <path d="M 120 280 L 140 320 L 160 340 L 155 280 Z" fill="#5a6a7a" />
      <path d="M 200 280 L 180 320 L 160 340 L 165 280 Z" fill="#5a6a7a" />
      <path d="M 140 320 L 160 340 L 180 320 L 172 278 L 148 278 Z" fill="url(#shirtGrad)" />
      <path d="M 148 278 L 155 295 L 160 300 L 165 295 L 172 278 L 162 272 L 158 272 Z" fill="#5ab0e8" />

      <rect x="142" y="248" width="36" height="35" rx="8" fill="url(#skinGrad)" />

      <ellipse cx="160" cy="165" rx="95" ry="110" fill="url(#skinGrad)" filter="url(#shadow)" />

      <ellipse cx="67" cy="170" rx="14" ry="18" fill="url(#skinGrad)" />
      <ellipse cx="67" cy="170" rx="8" ry="12" fill="#d4956e" />
      <ellipse cx="253" cy="170" rx="14" ry="18" fill="url(#skinGrad)" />
      <ellipse cx="253" cy="170" rx="8" ry="12" fill="#d4956e" />

      <ellipse cx="160" cy="73" rx="90" ry="45" fill="url(#hairGrad)" />
      <path d="M 72 115 Q 65 90 70 65 Q 90 40 130 38 Q 160 32 190 38 Q 225 42 242 68 Q 250 90 248 115 Q 230 75 210 68 Q 185 58 160 60 Q 132 58 108 68 Q 88 76 72 115 Z" fill="url(#hairGrad)" />
      <path d="M 90 55 Q 100 48 115 50" stroke="#b0b8c0" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M 105 48 Q 125 42 145 44" stroke="#b0b8c0" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M 175 44 Q 195 42 210 48" stroke="#b0b8c0" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M 215 50 Q 228 55 235 62" stroke="#b0b8c0" strokeWidth="2" fill="none" strokeLinecap="round" />

      <path d="M 108 120 Q 120 112 136 116" stroke="#9aa0a8" strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M 184 116 Q 200 112 212 120" stroke="#9aa0a8" strokeWidth="5" fill="none" strokeLinecap="round" />

      <circle cx="122" cy="148" r="28" fill="none" stroke="#3a3a3a" strokeWidth="3.5" />
      <circle cx="198" cy="148" r="28" fill="none" stroke="#3a3a3a" strokeWidth="3.5" />
      <path d="M 150 147 Q 160 143 170 147" stroke="#3a3a3a" strokeWidth="3" fill="none" />
      <path d="M 94 142 Q 80 138 70 140" stroke="#3a3a3a" strokeWidth="3" fill="none" />
      <path d="M 226 142 Q 240 138 250 140" stroke="#3a3a3a" strokeWidth="3" fill="none" />

      <ellipse cx="122" cy="148" rx="20" ry="16" fill="white" />
      <ellipse
        cx="122"
        cy="148"
        rx="11"
        ry={11 * eyeScaleY}
        fill="#6b4226"
        style={{ transition: blinking ? 'ry 0.05s ease-in' : 'ry 0.12s ease-out' }}
      />
      <ellipse
        cx="122"
        cy="148"
        rx="5"
        ry={5 * eyeScaleY}
        fill="#111"
        style={{ transition: blinking ? 'ry 0.05s ease-in' : 'ry 0.12s ease-out' }}
      />
      {!blinking && <circle cx="126" cy="144" r="3" fill="white" opacity="0.9" />}
      <ellipse
        cx="122"
        cy="148"
        rx="22"
        ry={22 * (1 - eyeScaleY) * 0.85}
        fill="#e5a87a"
        style={{ transition: blinking ? 'ry 0.05s ease-in' : 'ry 0.12s ease-out' }}
      />

      <ellipse cx="198" cy="148" rx="20" ry="16" fill="white" />
      <ellipse
        cx="198"
        cy="148"
        rx="11"
        ry={11 * eyeScaleY}
        fill="#6b4226"
        style={{ transition: blinking ? 'ry 0.05s ease-in' : 'ry 0.12s ease-out' }}
      />
      <ellipse
        cx="198"
        cy="148"
        rx="5"
        ry={5 * eyeScaleY}
        fill="#111"
        style={{ transition: blinking ? 'ry 0.05s ease-in' : 'ry 0.12s ease-out' }}
      />
      {!blinking && <circle cx="202" cy="144" r="3" fill="white" opacity="0.9" />}
      <ellipse
        cx="198"
        cy="148"
        rx="22"
        ry={22 * (1 - eyeScaleY) * 0.85}
        fill="#e5a87a"
        style={{ transition: blinking ? 'ry 0.05s ease-in' : 'ry 0.12s ease-out' }}
      />

      <path d="M 155 165 Q 148 185 145 195 Q 152 202 160 200 Q 168 202 175 195 Q 172 185 165 165 Z" fill="#d4956e" opacity="0.6" />
      <ellipse cx="149" cy="196" rx="7" ry="5" fill="#c0805a" opacity="0.7" />
      <ellipse cx="171" cy="196" rx="7" ry="5" fill="#c0805a" opacity="0.7" />

      <path d="M 135 210 Q 148 205 160 207 Q 172 205 185 210 Q 175 215 160 213 Q 145 215 135 210 Z" fill="#d8dcdf" />

      {mouthOpen < 0.1 ? (
        <path
          d={`M 138 222 Q 160 ${230 + mouthOpenPx * 0.3} 182 222`}
          stroke="#8a4a2a"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
      ) : (
        <g>
          <ellipse cx="160" cy="224" rx={22} ry={mouthOpenPx * 0.6 + 4} fill="#3a1a0a" />
          {mouthOpen > 0.3 && <rect x="142" y="215" width="36" height={Math.min(mouthOpenPx * 0.35, 10)} rx="3" fill="white" />}
          {mouthOpen > 0.4 && (
            <rect
              x="144"
              y={228 + mouthOpenPx * 0.2}
              width="32"
              height={Math.min(mouthOpenPx * 0.28, 8)}
              rx="3"
              fill="#f0f0f0"
            />
          )}
          <path d="M 138 218 Q 160 215 182 218" stroke="#b05a3a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path
            d={`M 138 ${228 + mouthOpenPx * 0.5} Q 160 ${233 + mouthOpenPx * 0.6} 182 ${228 + mouthOpenPx * 0.5}`}
            stroke="#9a4a2a"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
          />
        </g>
      )}

      <path d="M 100 210 Q 90 235 95 268 Q 110 305 160 315 Q 210 305 225 268 Q 230 235 220 210 Q 200 218 160 220 Q 120 218 100 210 Z" fill="url(#beardGrad)" />
      <path d="M 115 235 Q 118 255 120 275" stroke="#d0d4d8" strokeWidth="1.5" fill="none" opacity="0.6" />
      <path d="M 140 228 Q 142 255 142 280" stroke="#d0d4d8" strokeWidth="1.5" fill="none" opacity="0.6" />
      <path d="M 160 228 Q 160 258 158 285" stroke="#d0d4d8" strokeWidth="1.5" fill="none" opacity="0.6" />
      <path d="M 180 228 Q 178 255 178 280" stroke="#d0d4d8" strokeWidth="1.5" fill="none" opacity="0.6" />
      <path d="M 200 235 Q 200 255 198 272" stroke="#d0d4d8" strokeWidth="1.5" fill="none" opacity="0.6" />

      <ellipse cx="96" cy="185" rx="16" ry="10" fill="#e07060" opacity="0.18" />
      <ellipse cx="224" cy="185" rx="16" ry="10" fill="#e07060" opacity="0.18" />

      <path d="M 120 108 Q 140 104 160 105" stroke="#c8946c" strokeWidth="1.2" fill="none" opacity="0.5" />
      <path d="M 115 118 Q 137 114 160 115" stroke="#c8946c" strokeWidth="1.2" fill="none" opacity="0.4" />
      <path d="M 160 105 Q 180 104 200 108" stroke="#c8946c" strokeWidth="1.2" fill="none" opacity="0.5" />
    </svg>
  );
}

/* ─── Waveform ───────────────────────────────────────────── */
function Waveform({ active, color = 'var(--accent)' }: { active: boolean; color?: string }) {
  const params = useMemo(
    () =>
      Array.from({ length: 22 }, (_, i) => ({
        dur: (0.28 + Math.random() * 0.42).toFixed(2),
        delay: (i * 0.04).toFixed(2),
      })),
    []
  );

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
            animation: active ? `wave-bar ${p.dur}s ${p.delay}s ease-in-out infinite alternate` : 'none',
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
  const [lastReply, setLastReply] = useState("Hi there! I'm Nadi. Press Start to begin our conversation.");
  const [mouthOpen, setMouthOpen] = useState(0);
  const [blinking, setBlinking] = useState(false);
  const [error, setError] = useState('');
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [cameraError, setCameraError] = useState('');

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number>(0);
  const blinkTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const messagesRef = useRef<Message[]>([]);
  messagesRef.current = messages;
  const sessionActiveRef = useRef(false);
  sessionActiveRef.current = sessionActive;

  const stopCamera = useCallback(() => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraEnabled(false);
  }, []);

  const startCamera = useCallback(async () => {
    try {
      setCameraError('');
      if (!navigator.mediaDevices?.getUserMedia) {
        setCameraError('Camera is not supported in this browser.');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
        audio: false,
      });

      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
      }
      setCameraEnabled(true);
    } catch {
      setCameraError('Camera permission denied or unavailable.');
      setCameraEnabled(false);
    }
  }, []);

  const scheduleBlink = useCallback(() => {
    const delay = 2500 + Math.random() * 4500;
    blinkTimerRef.current = setTimeout(() => {
      setBlinking(true);
      setTimeout(() => {
        setBlinking(false);
        scheduleBlink();
      }, 160);
    }, delay);
  }, []);

  useEffect(() => {
    scheduleBlink();
    return () => {
      if (blinkTimerRef.current) clearTimeout(blinkTimerRef.current);
    };
  }, [scheduleBlink]);

  const startMouthAnimation = useCallback((audioEl: HTMLAudioElement) => {
    if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
      audioContextRef.current = new (
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      )();
    }
    const ctx = audioContextRef.current;

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

  const playAudio = useCallback(
    (base64: string) => {
      return new Promise<void>((resolve) => {
        if (currentAudioRef.current) currentAudioRef.current.pause();
        const audio = new Audio(`data:audio/mp3;base64,${base64}`);
        currentAudioRef.current = audio;
        audio.crossOrigin = 'anonymous';
        audio.addEventListener('play', () => startMouthAnimation(audio));
        audio.addEventListener('ended', () => {
          stopMouthAnimation();
          resolve();
        });
        audio.addEventListener('error', () => {
          stopMouthAnimation();
          resolve();
        });
        audio.play().catch(() => resolve());
      });
    },
    [startMouthAnimation, stopMouthAnimation]
  );

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
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognitionRef.current = recognition;

    recognition.onstart = () => setStatus('listening');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onerror = (e: any) => {
      if (e.error === 'no-speech') {
        if (sessionActiveRef.current) setTimeout(startOneTurn, 300);
        return;
      }
      setError(`Mic error: ${e.error}`);
    };

    recognition.onend = () => {
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
  }, []);

  const sendTurn = useCallback(
    async (text: string) => {
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
          const dur = data.text.length * 52;
          const iv = setInterval(() => setMouthOpen(0.2 + Math.random() * 0.7), 100);
          await new Promise((r) => setTimeout(r, dur));
          clearInterval(iv);
          stopMouthAnimation();
        }

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
    },
    [playAudio, stopMouthAnimation, startOneTurn]
  );

  const startSession = useCallback(async () => {
    setSessionActive(true);
    sessionActiveRef.current = true;
    setMessages([]);
    setError('');
    setLastReply('');
    await startCamera();
    setTimeout(startOneTurn, 200);
  }, [startOneTurn, startCamera]);

  const endSession = useCallback(() => {
    setSessionActive(false);
    sessionActiveRef.current = false;
    recognitionRef.current?.stop();
    recognitionRef.current?.abort?.();
    if (currentAudioRef.current) currentAudioRef.current.pause();
    stopMouthAnimation();
    stopCamera();
    setStatus('idle');
    setTranscript('');
    router.push('/home');
  }, [stopMouthAnimation, stopCamera, router]);

  useEffect(() => {
    return () => {
      sessionActiveRef.current = false;
      recognitionRef.current?.stop();
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (currentAudioRef.current) currentAudioRef.current.pause();
      audioContextRef.current?.close();
      stopCamera();
    };
  }, [stopCamera]);

  const statusColor: Record<Status, string> = {
    idle: 'var(--text-muted)',
    listening: 'var(--accent)',
    thinking: '#d89614',
    speaking: '#4f8cff',
  };

  const statusLabel: Record<Status, string> = {
    idle: sessionActive ? 'Preparing your session...' : 'Ready to start',
    listening: 'Listening now...',
    thinking: 'Thinking...',
    speaking: 'Nadi is speaking...',
  };

  const accentRing =
    status === 'speaking'
      ? 'rgba(79,140,255,0.28)'
      : status === 'listening'
      ? 'rgba(34,255,85,0.28)'
      : 'rgba(255,255,255,0.08)';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: `
          radial-gradient(900px 500px at 50% -10%, rgba(255,255,255,0.06), transparent 60%),
          linear-gradient(180deg, #0b1117 0%, #0e141b 45%, #0a1016 100%)
        `,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.03), transparent 28%)',
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '18%',
          left: '50%',
          transform: 'translate(-50%,-50%)',
          width: 420,
          height: 420,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(34,255,85,0.05) 0%, transparent 72%)',
          pointerEvents: 'none',
          zIndex: 0,
          filter: 'blur(6px)',
        }}
      />

      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '18px 20px 0',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <button
          onClick={endSession}
          style={{
            width: 46,
            height: 46,
            borderRadius: 16,
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#f5f7fa',
            fontSize: 18,
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
          }}
        >
          ✕
        </button>

        <div style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: 16, margin: 0 }}>
            Nadi AI Session
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center', marginTop: 4 }}>
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: sessionActive ? 'var(--accent)' : 'var(--text-muted)',
                boxShadow: sessionActive ? '0 0 12px var(--accent)' : 'none',
                transition: 'all 0.3s',
              }}
            />
            <span
              style={{
                color: sessionActive ? 'var(--accent)' : 'var(--text-muted)',
                fontWeight: 700,
                fontSize: 11,
                letterSpacing: 1,
              }}
            >
              {sessionActive ? 'LIVE' : 'READY'}
            </span>
          </div>
        </div>

        <div style={{ width: 46 }} />
      </div>

      {/* Main Call Area */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          zIndex: 2,
          padding: '0 20px 132px',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: 388,
            borderRadius: 30,
            background: 'linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.035))',
            border: '1px solid rgba(255,255,255,0.10)',
            boxShadow: '0 28px 80px rgba(0,0,0,0.28)',
            padding: '18px 18px 16px',
            position: 'relative',
            overflow: 'hidden',
            backdropFilter: 'blur(14px)',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(180deg, rgba(255,255,255,0.025), transparent 35%)',
              pointerEvents: 'none',
            }}
          />

          <div style={{ textAlign: 'center', marginBottom: 10, position: 'relative', zIndex: 1 }}>
            <div style={{ color: 'var(--text-primary)', fontSize: 18, fontWeight: 700 }}>Nadi</div>
            <div style={{ color: statusColor[status], fontSize: 12, fontWeight: 600, marginTop: 4 }}>
              {statusLabel[status]}
            </div>
          </div>

          <div
            style={{
              width: '100%',
              maxWidth: 280,
              position: 'relative',
              padding: 10,
              margin: '0 auto',
              zIndex: 1,
            }}
          >
            {(status === 'speaking' || status === 'listening') && (
              <>
                <div
                  className="animate-pulse-ring"
                  style={{
                    position: 'absolute',
                    inset: -12,
                    borderRadius: '50%',
                    border: `2px solid ${accentRing}`,
                  }}
                />
                <div
                  className="animate-pulse-ring-2"
                  style={{
                    position: 'absolute',
                    inset: -24,
                    borderRadius: '50%',
                    border: `1px solid ${accentRing}`,
                  }}
                />
              </>
            )}

            {status === 'thinking' && (
              <div
                className="animate-spin-slow"
                style={{
                  position: 'absolute',
                  inset: -12,
                  borderRadius: '50%',
                  border: '2px dashed rgba(216,150,20,0.35)',
                }}
              />
            )}

            <div
              style={{
                background: 'radial-gradient(ellipse at center, rgba(34,255,85,0.07) 0%, transparent 72%)',
                borderRadius: '50%',
              }}
            >
              <Companion mouthOpen={mouthOpen} blinking={blinking} />
            </div>
          </div>

          <div
            style={{
              marginTop: 8,
              textAlign: 'center',
              minHeight: 62,
              padding: '0 12px',
              position: 'relative',
              zIndex: 1,
            }}
          >
            {transcript ? (
              <p
                style={{
                  color: 'var(--accent)',
                  fontWeight: 600,
                  fontSize: 15,
                  lineHeight: 1.55,
                  margin: 0,
                }}
              >
                “{transcript}”
              </p>
            ) : lastReply && status !== 'listening' ? (
              <p
                style={{
                  color: 'var(--text-secondary)',
                  fontSize: 14,
                  lineHeight: 1.65,
                  fontStyle: 'italic',
                  margin: 0,
                }}
              >
                “{lastReply}”
              </p>
            ) : null}
          </div>

          <div
            style={{
              marginTop: 10,
              height: 34,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              zIndex: 1,
            }}
          >
            <Waveform active={status === 'listening' || status === 'speaking'} color={status === 'speaking' ? '#4f8cff' : 'var(--accent)'} />
          </div>
        </div>

        {/* Camera preview */}
        <div
          style={{
            position: 'absolute',
            right: 20,
            top: 16,
            width: 116,
            height: 162,
            borderRadius: 24,
            overflow: 'hidden',
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.12)',
            boxShadow: '0 18px 44px rgba(0,0,0,0.30)',
            backdropFilter: 'blur(14px)',
            zIndex: 3,
          }}
        >
          {cameraEnabled ? (
            <video
              ref={videoRef}
              muted
              playsInline
              autoPlay
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transform: 'scaleX(-1)',
                background: '#111',
              }}
            />
          ) : (
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-muted)',
                padding: 12,
                textAlign: 'center',
                fontSize: 11,
                lineHeight: 1.45,
                background: 'linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.03))',
              }}
            >
              <div style={{ fontSize: 20, marginBottom: 6 }}>📷</div>
              <div>{cameraError || 'Front camera preview'}</div>
            </div>
          )}

          <div
            style={{
              position: 'absolute',
              left: 8,
              bottom: 8,
              padding: '4px 8px',
              borderRadius: 999,
              background: 'rgba(0,0,0,0.44)',
              color: '#fff',
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: 0.5,
              backdropFilter: 'blur(8px)',
            }}
          >
            You
          </div>
        </div>

        {error && (
          <div
            style={{
              background: 'rgba(255,78,78,0.10)',
              border: '1px solid rgba(255,78,78,0.25)',
              borderRadius: 14,
              padding: '10px 14px',
              marginTop: 16,
              maxWidth: 340,
              backdropFilter: 'blur(8px)',
            }}
          >
            <p style={{ color: '#ff8f8f', fontSize: 13, margin: 0 }}>{error}</p>
          </div>
        )}

        {messages.length > 0 && (
          <div
            style={{
              marginTop: 16,
              width: '100%',
              maxWidth: 332,
              maxHeight: 104,
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
              paddingRight: 2,
            }}
          >
            {messages.slice(-4).map((m, i) => (
              <div
                key={i}
                style={{
                  background: m.role === 'user' ? 'rgba(34,255,85,0.08)' : 'rgba(79,140,255,0.09)',
                  borderRadius: 12,
                  padding: '8px 12px',
                  alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '90%',
                  border: `1px solid ${m.role === 'user' ? 'rgba(34,255,85,0.14)' : 'rgba(79,140,255,0.14)'}`,
                  backdropFilter: 'blur(8px)',
                }}
              >
                <p
                  style={{
                    color: m.role === 'user' ? 'var(--accent)' : '#9ec2ff',
                    fontSize: 12.5,
                    lineHeight: 1.45,
                    margin: 0,
                  }}
                >
                  {m.content}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom controls */}
      <div
        style={{
          padding: '0 24px 30px',
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 12,
          background: 'linear-gradient(180deg, transparent, rgba(0,0,0,0.18) 24%, rgba(0,0,0,0.42))',
        }}
      >
        {!sessionActive ? (
          <button
            onClick={startSession}
            style={{
              width: '100%',
              maxWidth: 312,
              padding: '18px 20px',
              borderRadius: 20,
              background: 'linear-gradient(135deg, #5dff87 0%, #22ff55 100%)',
              border: 'none',
              color: '#06100a',
              fontWeight: 800,
              fontSize: 17,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              boxShadow: '0 16px 36px rgba(34,255,85,0.24)',
              transition: 'all 0.2s ease',
            }}
          >
            🎙️ Start Video Call
          </button>
        ) : (
          <div
            style={{
              display: 'flex',
              gap: 14,
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              padding: 10,
              borderRadius: 28,
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              backdropFilter: 'blur(14px)',
              maxWidth: 280,
              boxShadow: '0 14px 36px rgba(0,0,0,0.24)',
            }}
          >
            <button
              onClick={cameraEnabled ? stopCamera : startCamera}
              style={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.12)',
                color: '#fff',
                fontSize: 21,
                cursor: 'pointer',
              }}
            >
              {cameraEnabled ? '📷' : '🚫'}
            </button>

            <button
              onClick={endSession}
              style={{
                width: 74,
                height: 74,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(255,95,95,0.18), rgba(255,68,68,0.22))',
                border: '2px solid rgba(255,90,90,0.42)',
                color: '#ff6e6e',
                fontWeight: 700,
                fontSize: 25,
                cursor: 'pointer',
                boxShadow: '0 12px 28px rgba(0,0,0,0.24)',
              }}
            >
              📞
            </button>

            <button
              onClick={() => recognitionRef.current?.stop()}
              style={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.12)',
                color: '#fff',
                fontSize: 21,
                cursor: 'pointer',
              }}
            >
              🎤
            </button>
          </div>
        )}

        <p style={{ color: 'var(--text-muted)', fontSize: 12, textAlign: 'center', margin: 0 }}>
          {sessionActive
            ? 'Nadi listens automatically while your front camera stays visible.'
            : 'Start a clean, live video-style conversation with Nadi.'}
        </p>

        {!!cameraError && sessionActive && (
          <p style={{ color: '#ffb3b3', fontSize: 11, textAlign: 'center', margin: 0 }}>
            {cameraError}
          </p>
        )}
      </div>

      <style>{`
        @keyframes wave-bar {
          from { transform: scaleY(0.25); }
          to { transform: scaleY(1); }
        }

        .animate-pulse-ring {
          animation: pulseRing 1.8s ease-out infinite;
        }

        .animate-pulse-ring-2 {
          animation: pulseRing 2.4s ease-out infinite;
        }

        .animate-spin-slow {
          animation: spinSlow 2.8s linear infinite;
        }

        @keyframes pulseRing {
          0% { transform: scale(0.96); opacity: 0.85; }
          70% { transform: scale(1.06); opacity: 0.18; }
          100% { transform: scale(1.1); opacity: 0; }
        }

        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}