'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

type Status = 'idle' | 'listening' | 'thinking' | 'speaking';

function Companion({
  mouthOpen,
  blinking,
}: {
  mouthOpen: number;
  blinking: boolean;
}) {
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
          <stop offset="0%" stopColor="#d7dce2" />
          <stop offset="100%" stopColor="#9aa4af" />
        </linearGradient>
        <linearGradient id="jacketGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#596574" />
          <stop offset="100%" stopColor="#313c49" />
        </linearGradient>
        <linearGradient id="shirtGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5d8fd8" />
          <stop offset="100%" stopColor="#3768ad" />
        </linearGradient>
        <radialGradient id="beardGrad" cx="50%" cy="30%" r="60%">
          <stop offset="0%" stopColor="#edf0f2" />
          <stop offset="100%" stopColor="#c4c9ce" />
        </radialGradient>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="rgba(0,0,0,0.28)" />
        </filter>
      </defs>

      <ellipse cx="160" cy="360" rx="130" ry="60" fill="url(#jacketGrad)" />
      <path d="M 60 310 Q 80 290 120 280 L 160 340 L 200 280 Q 240 290 260 310 L 280 380 H 40 Z" fill="url(#jacketGrad)" />
      <path d="M 120 280 L 140 320 L 160 340 L 155 280 Z" fill="#4a5766" />
      <path d="M 200 280 L 180 320 L 160 340 L 165 280 Z" fill="#4a5766" />
      <path d="M 140 320 L 160 340 L 180 320 L 172 278 L 148 278 Z" fill="url(#shirtGrad)" />
      <path d="M 148 278 L 155 295 L 160 300 L 165 295 L 172 278 L 162 272 L 158 272 Z" fill="#84b7f2" />

      <rect x="142" y="248" width="36" height="35" rx="8" fill="url(#skinGrad)" />
      <ellipse cx="160" cy="165" rx="95" ry="110" fill="url(#skinGrad)" filter="url(#shadow)" />

      <ellipse cx="67" cy="170" rx="14" ry="18" fill="url(#skinGrad)" />
      <ellipse cx="67" cy="170" rx="8" ry="12" fill="#d4956e" />
      <ellipse cx="253" cy="170" rx="14" ry="18" fill="url(#skinGrad)" />
      <ellipse cx="253" cy="170" rx="8" ry="12" fill="#d4956e" />

      <ellipse cx="160" cy="73" rx="90" ry="45" fill="url(#hairGrad)" />
      <path d="M 72 115 Q 65 90 70 65 Q 90 40 130 38 Q 160 32 190 38 Q 225 42 242 68 Q 250 90 248 115 Q 230 75 210 68 Q 185 58 160 60 Q 132 58 108 68 Q 88 76 72 115 Z" fill="url(#hairGrad)" />

      <path d="M 108 120 Q 120 112 136 116" stroke="#8e98a2" strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M 184 116 Q 200 112 212 120" stroke="#8e98a2" strokeWidth="5" fill="none" strokeLinecap="round" />

      <circle cx="122" cy="148" r="28" fill="none" stroke="#373737" strokeWidth="3.5" />
      <circle cx="198" cy="148" r="28" fill="none" stroke="#373737" strokeWidth="3.5" />
      <path d="M 150 147 Q 160 143 170 147" stroke="#373737" strokeWidth="3" fill="none" />
      <path d="M 94 142 Q 80 138 70 140" stroke="#373737" strokeWidth="3" fill="none" />
      <path d="M 226 142 Q 240 138 250 140" stroke="#373737" strokeWidth="3" fill="none" />

      <ellipse cx="122" cy="148" rx="20" ry="16" fill="white" />
      <ellipse cx="122" cy="148" rx="11" ry={11 * eyeScaleY} fill="#6b4226"
        style={{ transition: blinking ? 'ry 0.05s ease-in' : 'ry 0.12s ease-out' }} />
      <ellipse cx="122" cy="148" rx="5" ry={5 * eyeScaleY} fill="#111"
        style={{ transition: blinking ? 'ry 0.05s ease-in' : 'ry 0.12s ease-out' }} />
      {!blinking && <circle cx="126" cy="144" r="3" fill="white" opacity="0.9" />}
      <ellipse cx="122" cy="148" rx="22" ry={22 * (1 - eyeScaleY) * 0.85} fill="#e5a87a"
        style={{ transition: blinking ? 'ry 0.05s ease-in' : 'ry 0.12s ease-out' }} />

      <ellipse cx="198" cy="148" rx="20" ry="16" fill="white" />
      <ellipse cx="198" cy="148" rx="11" ry={11 * eyeScaleY} fill="#6b4226"
        style={{ transition: blinking ? 'ry 0.05s ease-in' : 'ry 0.12s ease-out' }} />
      <ellipse cx="198" cy="148" rx="5" ry={5 * eyeScaleY} fill="#111"
        style={{ transition: blinking ? 'ry 0.05s ease-in' : 'ry 0.12s ease-out' }} />
      {!blinking && <circle cx="202" cy="144" r="3" fill="white" opacity="0.9" />}
      <ellipse cx="198" cy="148" rx="22" ry={22 * (1 - eyeScaleY) * 0.85} fill="#e5a87a"
        style={{ transition: blinking ? 'ry 0.05s ease-in' : 'ry 0.12s ease-out' }} />

      <path d="M 155 165 Q 148 185 145 195 Q 152 202 160 200 Q 168 202 175 195 Q 172 185 165 165 Z" fill="#d4956e" opacity="0.6" />
      <ellipse cx="149" cy="196" rx="7" ry="5" fill="#c0805a" opacity="0.7" />
      <ellipse cx="171" cy="196" rx="7" ry="5" fill="#c0805a" opacity="0.7" />

      <path d="M 135 210 Q 148 205 160 207 Q 172 205 185 210 Q 175 215 160 213 Q 145 215 135 210 Z" fill="#d8dcdf" />

      {mouthOpen < 0.1 ? (
        <path
          d={`M 138 222 Q 160 ${230 + mouthOpenPx * 0.3} 182 222`}
          stroke="#8a4a2a" strokeWidth="3" fill="none" strokeLinecap="round"
        />
      ) : (
        <g>
          <ellipse cx="160" cy="224" rx={22} ry={mouthOpenPx * 0.6 + 4} fill="#3a1a0a" />
          {mouthOpen > 0.3 && <rect x="142" y="215" width="36" height={Math.min(mouthOpenPx * 0.35, 10)} rx="3" fill="white" />}
          {mouthOpen > 0.4 && (
            <rect x="144" y={228 + mouthOpenPx * 0.2} width="32" height={Math.min(mouthOpenPx * 0.28, 8)} rx="3" fill="#f0f0f0" />
          )}
          <path d="M 138 218 Q 160 215 182 218" stroke="#b05a3a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path
            d={`M 138 ${228 + mouthOpenPx * 0.5} Q 160 ${233 + mouthOpenPx * 0.6} 182 ${228 + mouthOpenPx * 0.5}`}
            stroke="#9a4a2a" strokeWidth="2.5" fill="none" strokeLinecap="round"
          />
        </g>
      )}

      <path d="M 100 210 Q 90 235 95 268 Q 110 305 160 315 Q 210 305 225 268 Q 230 235 220 210 Q 200 218 160 220 Q 120 218 100 210 Z" fill="url(#beardGrad)" />
      <path d="M 115 235 Q 118 255 120 275" stroke="#d0d4d8" strokeWidth="1.5" fill="none" opacity="0.6" />
      <path d="M 140 228 Q 142 255 142 280" stroke="#d0d4d8" strokeWidth="1.5" fill="none" opacity="0.6" />
      <path d="M 160 228 Q 160 258 158 285" stroke="#d0d4d8" strokeWidth="1.5" fill="none" opacity="0.6" />
      <path d="M 180 228 Q 178 255 178 280" stroke="#d0d4d8" strokeWidth="1.5" fill="none" opacity="0.6" />
      <path d="M 200 235 Q 200 255 198 272" stroke="#d0d4d8" strokeWidth="1.5" fill="none" opacity="0.6" />

      <ellipse cx="96" cy="185" rx="16" ry="10" fill="#e07060" opacity="0.12" />
      <ellipse cx="224" cy="185" rx="16" ry="10" fill="#e07060" opacity="0.12" />
    </svg>
  );
}

function Waveform({ active, color = 'var(--accent)' }: { active: boolean; color?: string }) {
  const params = useMemo(
    () => Array.from({ length: 22 }, (_, i) => ({
      dur: (0.28 + Math.random() * 0.42).toFixed(2),
      delay: (i * 0.04).toFixed(2),
    })),
    []
  );

  return (
    <div style={{ display: 'flex', gap: 3, alignItems: 'center', height: 28 }}>
      {params.map((p, i) => (
        <div
          key={i}
          style={{
            width: 3,
            borderRadius: 999,
            background: color,
            height: active ? 8 : 4,
            opacity: active ? 0.95 : 0.3,
            animation: active ? `wave-bar ${p.dur}s ${p.delay}s ease-in-out infinite alternate` : 'none',
          }}
        />
      ))}
    </div>
  );
}

export default function AISessionPage() {
  const router = useRouter();

  const [sessionActive, setSessionActive] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const [messages, setMessages] = useState<Message[]>([]);
  const [transcript, setTranscript] = useState('');
  const [lastReply, setLastReply] = useState("Hi there! I'm Nadi.");
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
  const sessionActiveRef = useRef(false);

  messagesRef.current = messages;
  sessionActiveRef.current = sessionActive;

  const stopCamera = useCallback(() => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (videoRef.current) videoRef.current.srcObject = null;
    setCameraEnabled(false);
  }, []);

  const startCamera = useCallback(async () => {
    try {
      setCameraError('');
      if (!navigator.mediaDevices?.getUserMedia) { setCameraError('Camera not supported'); return; }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 720 }, height: { ideal: 1280 } },
        audio: false,
      });
      mediaStreamRef.current = stream;
      setCameraEnabled(true);
    } catch (err) {
      console.error(err);
      setCameraEnabled(false);
      setCameraError('Camera unavailable');
    }
  }, []);

  useEffect(() => {
    const attachStream = async () => {
      if (cameraEnabled && videoRef.current && mediaStreamRef.current) {
        try {
          videoRef.current.srcObject = mediaStreamRef.current;
          await videoRef.current.play();
        } catch (err) {
          console.error(err);
          setCameraError('Preview failed');
        }
      }
    };
    attachStream();
  }, [cameraEnabled]);

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

  const startMouthAnimation = useCallback((audioEl: HTMLAudioElement) => {
    if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
      audioContextRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
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

  const startOneTurn = useCallback(() => {
    if (!sessionActiveRef.current) return;
    if (!('SpeechRecognition' in window) && !('webkitSpeechRecognition' in window)) {
      setError('Speech recognition not supported');
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
      if (e.error === 'no-speech') { if (sessionActiveRef.current) setTimeout(startOneTurn, 300); return; }
      setError(`Mic error: ${e.error}`);
    };
    recognition.onend = () => {
      const finalText = (recognitionRef.current as { _finalText?: string })?._finalText || '';
      setTranscript('');
      if (finalText.trim() && sessionActiveRef.current) sendTurn(finalText.trim());
      else if (sessionActiveRef.current) setTimeout(startOneTurn, 300);
      else setStatus('idle');
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (e: any) => {
      let interim = '', finalText = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) finalText += e.results[i][0].transcript;
        else interim += e.results[i][0].transcript;
      }
      setTranscript(finalText || interim);
      if (finalText) (recognitionRef.current as { _finalText?: string })._finalText = finalText;
    };
    recognition.start();
  }, []);

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
        const dur = data.text.length * 52;
        const iv = setInterval(() => setMouthOpen(0.2 + Math.random() * 0.7), 100);
        await new Promise((r) => setTimeout(r, dur));
        clearInterval(iv);
        stopMouthAnimation();
      }
      if (sessionActiveRef.current) { setStatus('listening'); setTimeout(startOneTurn, 400); }
      else setStatus('idle');
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Unknown error';
      setError(msg);
      setStatus('idle');
      stopMouthAnimation();
      if (sessionActiveRef.current) setTimeout(startOneTurn, 1500);
    }
  }, [playAudio, stopMouthAnimation, startOneTurn]);

  const startSession = useCallback(async () => {
    setSessionActive(true);
    sessionActiveRef.current = true;
    setMessages([]);
    setError('');
    setLastReply('');
    await startCamera();
    setTimeout(startOneTurn, 260);
  }, [startCamera, startOneTurn]);

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
  }, [router, stopCamera, stopMouthAnimation]);

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

  const statusConfig: Record<Status, { label: string; color: string; bg: string; border: string; dot: string }> = {
    idle: {
      label: 'Ready',
      color: '#B9C2CE',
      bg: 'rgba(255,255,255,0.06)',
      border: 'rgba(255,255,255,0.10)',
      dot: 'rgba(255,255,255,0.4)',
    },
    listening: {
      label: 'Listening…',
      color: '#55E4AE',
      bg: 'rgba(85,228,174,0.10)',
      border: 'rgba(85,228,174,0.22)',
      dot: '#55E4AE',
    },
    thinking: {
      label: 'Thinking…',
      color: '#E8B04B',
      bg: 'rgba(232,176,75,0.10)',
      border: 'rgba(232,176,75,0.22)',
      dot: '#E8B04B',
    },
    speaking: {
      label: 'Speaking',
      color: '#8EBBFF',
      bg: 'rgba(142,187,255,0.10)',
      border: 'rgba(142,187,255,0.22)',
      dot: '#8EBBFF',
    },
  };

  const ringColor =
    status === 'speaking' ? 'rgba(142,187,255,0.22)'
    : status === 'listening' ? 'rgba(85,228,174,0.18)'
    : 'rgba(255,255,255,0.06)';

  const statusUI = statusConfig[status];

  return (
    <>
      {/* ─── Global layout styles ─── */}
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        html, body {
          height: 100%;
          overflow: hidden;
          background: #061017;
          -webkit-tap-highlight-color: transparent;
        }

        #__next, main { height: 100%; }

        @keyframes wave-bar {
          from { transform: scaleY(0.28); }
          to   { transform: scaleY(1); }
        }

        @keyframes ringPulse1 {
          0%   { transform: scale(0.97); opacity: 0.85; }
          70%  { transform: scale(1.03); opacity: 0.20; }
          100% { transform: scale(1.06); opacity: 0;    }
        }

        @keyframes ringPulse2 {
          0%   { transform: scale(0.94); opacity: 0.65; }
          70%  { transform: scale(1.07); opacity: 0.14; }
          100% { transform: scale(1.11); opacity: 0;    }
        }

        @keyframes statusDot {
          0%, 100% { opacity: 1;   transform: scale(1);    }
          50%       { opacity: 0.4; transform: scale(0.75); }
        }

        @keyframes thinkingDot {
          0%, 80%, 100% { transform: scaleY(0.4); opacity: 0.4; }
          40%            { transform: scaleY(1.0); opacity: 1;   }
        }

        .ring-pulse-1 { animation: ringPulse1 2.0s ease-out infinite; }
        .ring-pulse-2 { animation: ringPulse2 2.6s ease-out infinite; }

        .session-btn {
          transition: transform 0.12s ease, opacity 0.12s ease, box-shadow 0.12s ease;
          -webkit-user-select: none;
          user-select: none;
        }
        .session-btn:active { transform: scale(0.94); opacity: 0.85; }

        /* ─── Safe area helpers ─── */
        .safe-top    { padding-top:    env(safe-area-inset-top,    12px); }
        .safe-bottom { padding-bottom: env(safe-area-inset-bottom, 16px); }
      `}</style>

      {/* ─── Root shell: full-viewport flex column ─── */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          background: `
            radial-gradient(ellipse 900px 500px at 50% -5%, rgba(255,255,255,0.055), transparent 58%),
            radial-gradient(ellipse 500px 340px at 50% 38%, rgba(85,228,174,0.055), transparent 70%),
            linear-gradient(180deg, #061017 0%, #09141b 42%, #071118 100%)
          `,
          fontFamily: "'SF Pro Display', 'Helvetica Neue', system-ui, sans-serif",
        }}
      >
        {/* ══════════════════════════════════════
            MAIN CARD — scrollable flex child
        ══════════════════════════════════════ */}
        <div
          className="safe-top"
          style={{
            flex: 1,
            minHeight: 0,          /* allow shrink */
            display: 'flex',
            flexDirection: 'column',
            padding: '0 14px',
            overflow: 'hidden',
          }}
        >
          {/* Glass card */}
          <div
            style={{
              flex: 1,
              minHeight: 0,
              borderRadius: 32,
              position: 'relative',
              overflow: 'hidden',
              background: 'linear-gradient(180deg, rgba(255,255,255,0.10), rgba(255,255,255,0.038))',
              border: '1px solid rgba(255,255,255,0.09)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              boxShadow: '0 24px 72px rgba(0,0,0,0.36)',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* inner top sheen */}
            <div style={{
              position: 'absolute', inset: 0, pointerEvents: 'none',
              background: 'linear-gradient(180deg, rgba(255,255,255,0.025), transparent 28%)',
            }} />

            {/* ─── Top bar ─── */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px 18px 10px',
              flexShrink: 0,
              position: 'relative',
              zIndex: 4,
            }}>
              {/* Close */}
              <button
                className="session-btn"
                onClick={endSession}
                aria-label="End session"
                style={{
                  width: 44, height: 44, borderRadius: 15,
                  border: '1px solid rgba(255,255,255,0.10)',
                  background: 'rgba(255,255,255,0.07)',
                  color: '#EFF4FA', fontSize: 18,
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  backdropFilter: 'blur(12px)',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.20)',
                }}
              >
                ✕
              </button>

              {/* Status pill */}
              <div style={{
                padding: '9px 16px',
                borderRadius: 999,
                background: statusUI.bg,
                border: `1px solid ${statusUI.border}`,
                backdropFilter: 'blur(14px)',
                boxShadow: '0 8px 20px rgba(0,0,0,0.16)',
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <div style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: statusUI.dot,
                  boxShadow: sessionActive ? `0 0 10px ${statusUI.dot}` : 'none',
                  animation: sessionActive && status !== 'idle' ? 'statusDot 1.4s ease-in-out infinite' : 'none',
                }} />
                <span style={{ color: '#F2F6FB', fontSize: 13, fontWeight: 700, letterSpacing: 0.2 }}>
                  Nadi
                </span>
                <span style={{
                  color: statusUI.color, fontSize: 12, fontWeight: 600,
                  borderLeft: '1px solid rgba(255,255,255,0.14)',
                  paddingLeft: 8, letterSpacing: 0.1,
                }}>
                  {statusUI.label}
                </span>
              </div>

              <div style={{ width: 44 }} />
            </div>

            {/* ─── Camera pip ─── */}
            <div style={{
              position: 'absolute',
              right: 18, top: 80,
              width: 112, height: 152,
              borderRadius: 24,
              overflow: 'hidden',
              background: cameraEnabled
                ? 'rgba(0,0,0,0.5)'
                : 'linear-gradient(180deg, rgba(255,255,255,0.09), rgba(255,255,255,0.04))',
              border: '1px solid rgba(255,255,255,0.10)',
              boxShadow: '0 16px 40px rgba(0,0,0,0.28)',
              backdropFilter: 'blur(18px)',
              zIndex: 5,
            }}>
              <video
                ref={videoRef}
                muted playsInline autoPlay
                style={{
                  width: '100%', height: '100%',
                  objectFit: 'cover',
                  transform: 'scaleX(-1)',
                  display: cameraEnabled ? 'block' : 'none',
                }}
              />
              {!cameraEnabled && (
                <div style={{
                  width: '100%', height: '100%',
                  display: 'grid', placeItems: 'center',
                  color: 'rgba(255,255,255,0.35)', fontSize: 24,
                }}>📷</div>
              )}
              {/* camera indicator LED */}
              <div style={{
                position: 'absolute', top: 9, left: 9,
                width: 8, height: 8, borderRadius: '50%',
                background: cameraEnabled ? '#4EDE9E' : 'rgba(255,255,255,0.22)',
                boxShadow: cameraEnabled ? '0 0 8px #4EDE9E' : 'none',
              }} />
            </div>

            {/* ─── Companion area — takes remaining space ─── */}
            <div style={{
              flex: 1,
              minHeight: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 20px 16px',
              position: 'relative',
              zIndex: 2,
            }}>
              {/* Companion ring */}
              <div style={{
                position: 'relative',
                width: '100%',
                maxWidth: 290,
                aspectRatio: '1 / 1.08',
                display: 'grid',
                placeItems: 'center',
              }}>
                <div style={{
                  position: 'absolute', inset: '8% 6%',
                  borderRadius: '50%',
                  border: `2px solid ${ringColor}`,
                  transition: 'border-color 0.4s ease',
                }} />
                <div style={{
                  position: 'absolute', inset: '0%',
                  borderRadius: '50%',
                  border: `1px solid ${ringColor}`,
                  opacity: 0.8,
                  transition: 'border-color 0.4s ease',
                }} />

                {(status === 'listening' || status === 'speaking') && (
                  <>
                    <div className="ring-pulse-1" style={{
                      position: 'absolute', inset: '4%', borderRadius: '50%',
                      border: `1px solid ${ringColor}`,
                    }} />
                    <div className="ring-pulse-2" style={{
                      position: 'absolute', inset: '-2%', borderRadius: '50%',
                      border: `1px solid ${ringColor}`,
                    }} />
                  </>
                )}

                <div style={{
                  width: '85%', maxWidth: 250,
                  position: 'relative', zIndex: 2,
                  filter: 'drop-shadow(0 16px 28px rgba(0,0,0,0.28))',
                }}>
                  <Companion mouthOpen={mouthOpen} blinking={blinking} />
                </div>
              </div>

              {/* Transcript */}
              <div style={{
                minHeight: 32,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginTop: 6, width: '100%',
              }}>
                {transcript && (
                  <p style={{
                    margin: 0,
                    color: '#55E4AE',
                    fontSize: 14, fontWeight: 600,
                    textAlign: 'center',
                    lineHeight: 1.45,
                    maxWidth: 260,
                  }}>
                    {transcript}
                  </p>
                )}
              </div>

              {/* Waveform */}
              <div style={{
                marginTop: 8,
                minHeight: 28,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Waveform
                  active={status === 'listening' || status === 'speaking'}
                  color={status === 'speaking' ? '#8EBBFF' : '#1DE8B5'}
                />
              </div>
            </div>

            {/* Error toast */}
            {(error || cameraError) && (
              <div style={{
                position: 'absolute',
                left: 16, right: 16, bottom: 16,
                padding: '10px 14px',
                borderRadius: 16,
                background: 'rgba(255,88,88,0.10)',
                border: '1px solid rgba(255,88,88,0.20)',
                color: '#FFB8B8',
                fontSize: 12.5, lineHeight: 1.45,
                textAlign: 'center', zIndex: 10,
              }}>
                {error || cameraError}
              </div>
            )}
          </div>
        </div>

        {/* ══════════════════════════════════════
            BOTTOM CONTROLS — always fixed
        ══════════════════════════════════════ */}
        <div
          className="safe-bottom"
          style={{
            flexShrink: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '14px 20px',
          }}
        >
          {!sessionActive ? (
            /* ── Start Session Button ── */
            <button
              className="session-btn"
              onClick={startSession}
              style={{
                width: '100%',
                maxWidth: 340,
                height: 58,
                borderRadius: 22,
                border: '1px solid rgba(78,222,158,0.28)',
                cursor: 'pointer',
                background: 'linear-gradient(135deg, #7EE0A1 0%, #3ECFA0 60%, #2DBEAE 100%)',
                color: '#061712',
                fontSize: 17,
                fontWeight: 800,
                letterSpacing: 0.2,
                boxShadow: '0 16px 38px rgba(62,207,160,0.28), 0 4px 12px rgba(0,0,0,0.20)',
              }}
            >
              Start Session
            </button>
          ) : (
            /* ── Active Session Controls ── */
            <div style={{
              width: '100%',
              maxWidth: 320,
              padding: '14px 24px',
              borderRadius: 36,
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.09)',
              boxShadow: '0 20px 48px rgba(0,0,0,0.28)',
              backdropFilter: 'blur(22px)',
              WebkitBackdropFilter: 'blur(22px)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 20,
            }}>
              {/* Camera toggle */}
              <button
                className="session-btn"
                onClick={cameraEnabled ? stopCamera : startCamera}
                aria-label={cameraEnabled ? 'Disable camera' : 'Enable camera'}
                style={{
                  width: 54, height: 54,
                  borderRadius: '50%',
                  border: `1.5px solid ${cameraEnabled ? 'rgba(255,255,255,0.14)' : 'rgba(142,187,255,0.30)'}`,
                  background: cameraEnabled ? 'rgba(255,255,255,0.08)' : 'rgba(142,187,255,0.12)',
                  color: cameraEnabled ? 'rgba(255,255,255,0.65)' : '#8EBBFF',
                  fontSize: 20, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: cameraEnabled ? 'none' : '0 0 16px rgba(142,187,255,0.18)',
                }}
              >
                {cameraEnabled ? '📷' : '🚫'}
              </button>

              {/* End Call */}
              <button
                className="session-btn"
                onClick={endSession}
                aria-label="End call"
                style={{
                  width: 70, height: 70,
                  borderRadius: '50%',
                  border: '2px solid rgba(255,100,100,0.36)',
                  background: 'radial-gradient(circle at 30% 30%, rgba(255,100,100,0.36), rgba(140,20,20,0.32))',
                  color: '#FFD9D9',
                  fontSize: 26, cursor: 'pointer',
                  boxShadow: '0 14px 30px rgba(120,20,20,0.32), 0 0 0 1px rgba(255,80,80,0.10)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                📞
              </button>

              {/* Mic toggle */}
              <button
                className="session-btn"
                onClick={() => recognitionRef.current?.stop()}
                aria-label="Pause microphone"
                style={{
                  width: 54, height: 54,
                  borderRadius: '50%',
                  border: `1.5px solid ${status === 'listening' ? 'rgba(85,228,174,0.34)' : 'rgba(255,255,255,0.10)'}`,
                  background: status === 'listening' ? 'rgba(85,228,174,0.12)' : 'rgba(255,255,255,0.07)',
                  color: status === 'listening' ? '#55E4AE' : 'rgba(255,255,255,0.60)',
                  fontSize: 20, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: status === 'listening' ? '0 0 16px rgba(85,228,174,0.20)' : 'none',
                }}
              >
                🎤
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}