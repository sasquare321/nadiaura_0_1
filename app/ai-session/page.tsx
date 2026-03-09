'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  MdCallEnd,
  MdMic,
  MdVideocam,
  MdVideocamOff,
  MdFlipCameraIos,
} from 'react-icons/md';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

type Status = 'idle' | 'listening' | 'thinking' | 'speaking';

// ─── AI Spectrum Orb ──────────────────────────────────────────────────────────
function AISpectrumOrb({ status, mouthOpen }: { status: Status; mouthOpen: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef  = useRef<number>(0);
  const timeRef   = useRef(0);

  const isActive   = status === 'listening' || status === 'speaking';
  const isThinking = status === 'thinking';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const W = canvas.width, H = canvas.height;
    const cx = W / 2, cy = H / 2;

    const glowPalette: Record<Status, [string, string, string]> = {
      speaking:  ['rgba(142,187,255,', 'rgba(100,160,255,', 'rgba(180,210,255,'],
      listening: ['rgba(85,228,174,',  'rgba(60,200,150,',  'rgba(120,240,190,'],
      thinking:  ['rgba(232,176,75,',  'rgba(255,200,80,',  'rgba(200,140,50,' ],
      idle:      ['rgba(160,180,210,', 'rgba(130,155,190,', 'rgba(180,200,220,'],
    };

    const draw = () => {
      timeRef.current += 0.018;
      const t = timeRef.current;
      const gc = glowPalette[status];

      ctx.clearRect(0, 0, W, H);

      // Outer ambient rings
      for (let ring = 3; ring >= 1; ring--) {
        const ringR = 82 + ring * 20 + Math.sin(t * 0.7 + ring) * (isActive ? 9 : 2);
        const alpha = isActive ? 0.055 - ring * 0.012 : 0.022;
        const g = ctx.createRadialGradient(cx, cy, ringR * 0.5, cx, cy, ringR);
        g.addColorStop(0,   gc[0] + '0)');
        g.addColorStop(0.6, gc[1] + alpha + ')');
        g.addColorStop(1,   gc[2] + '0)');
        ctx.beginPath(); ctx.arc(cx, cy, ringR, 0, Math.PI * 2);
        ctx.fillStyle = g; ctx.fill();
      }

      // Spectrum bars
      const barCount = 72;
      const baseR    = 76;
      const maxBarH  = isActive ? 30 + mouthOpen * 36 : isThinking ? 15 : 5;

      for (let i = 0; i < barCount; i++) {
        const angle = (i / barCount) * Math.PI * 2 - Math.PI / 2;
        const noise =
          Math.sin(t * 2.4 + i * 0.38) * 0.42 +
          Math.sin(t * 3.9 + i * 0.73) * 0.30 +
          Math.sin(t * 1.2 + i * 0.18) * 0.28;
        const barH = Math.max(3, maxBarH * (0.38 + 0.62 * ((noise + 1) / 2)));

        const hue =
          status === 'speaking'  ? 210 + i * 0.9
          : status === 'listening' ? 155 + i * 0.65
          : status === 'thinking'  ? 38  + i * 0.4
          : 200 + i * 0.5;
        const sat   = isActive ? 82 : 38;
        const lum   = isActive ? 68 : 54;
        const alpha = isActive ? 0.88 : 0.32;

        const x1 = cx + Math.cos(angle) * baseR;
        const y1 = cy + Math.sin(angle) * baseR;
        const x2 = cx + Math.cos(angle) * (baseR + barH);
        const y2 = cy + Math.sin(angle) * (baseR + barH);

        ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2);
        ctx.strokeStyle = `hsla(${hue},${sat}%,${lum}%,${alpha})`;
        ctx.lineWidth = 2.6; ctx.lineCap = 'round'; ctx.stroke();
      }

      // Core orb
      const coreR     = 64;
      const corePulse = coreR + (isActive ? Math.sin(t * 4.2) * 2.5 : 0);
      const coreGrad  = ctx.createRadialGradient(cx - 15, cy - 20, 4, cx, cy, coreR);

      const coreColors: Record<Status, [string, string, string, string]> = {
        speaking:  ['rgba(200,225,255,0.96)', 'rgba(120,175,255,0.88)', 'rgba(70,130,220,0.78)',  'rgba(30,80,180,0.58)'],
        listening: ['rgba(200,255,235,0.96)', 'rgba(80,230,170,0.88)',  'rgba(30,185,130,0.78)',  'rgba(10,130,90,0.58)'],
        thinking:  ['rgba(255,235,170,0.96)', 'rgba(240,185,70,0.88)',  'rgba(200,140,30,0.78)',  'rgba(150,100,10,0.58)'],
        idle:      ['rgba(220,230,245,0.80)', 'rgba(150,170,210,0.68)', 'rgba(100,130,180,0.52)', 'rgba(60,90,150,0.32)'],
      };
      const [c0, c1, c2, c3] = coreColors[status];
      coreGrad.addColorStop(0,    c0);
      coreGrad.addColorStop(0.34, c1);
      coreGrad.addColorStop(0.72, c2);
      coreGrad.addColorStop(1,    c3);

      ctx.beginPath(); ctx.arc(cx, cy, corePulse, 0, Math.PI * 2);
      ctx.fillStyle = coreGrad; ctx.fill();

      // Specular highlight
      const spec = ctx.createRadialGradient(cx - 20, cy - 24, 2, cx - 10, cy - 14, 32);
      spec.addColorStop(0,   'rgba(255,255,255,0.52)');
      spec.addColorStop(0.5, 'rgba(255,255,255,0.10)');
      spec.addColorStop(1,   'rgba(255,255,255,0)');
      ctx.beginPath(); ctx.arc(cx, cy, coreR, 0, Math.PI * 2);
      ctx.fillStyle = spec; ctx.fill();

      // Inner pulse
      if (isActive || isThinking) {
        const pa = isThinking
          ? 0.18 + Math.abs(Math.sin(t * 2.5)) * 0.14
          : 0.10 + mouthOpen * 0.24;
        const pg = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreR);
        pg.addColorStop(0, gc[0] + pa + ')');
        pg.addColorStop(1, gc[0] + '0)');
        ctx.beginPath(); ctx.arc(cx, cy, coreR, 0, Math.PI * 2);
        ctx.fillStyle = pg; ctx.fill();
      }

      frameRef.current = requestAnimationFrame(draw);
    };

    frameRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frameRef.current);
  }, [status, mouthOpen, isActive, isThinking]);

  return (
    <canvas
      ref={canvasRef}
      width={300} height={300}
      style={{ width: 260, height: 260 }}
    />
  );
}

// ─── Waveform ─────────────────────────────────────────────────────────────────
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
        <div key={i} style={{
          width: 3, borderRadius: 999, background: color,
          height: active ? 8 : 4,
          opacity: active ? 0.95 : 0.3,
          animation: active ? `wave-bar ${p.dur}s ${p.delay}s ease-in-out infinite alternate` : 'none',
        }} />
      ))}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AISessionPage() {
  const router = useRouter();

  const [sessionActive, setSessionActive] = useState(false);
  const [status,        setStatus]        = useState<Status>('idle');
  const [messages,      setMessages]      = useState<Message[]>([]);
  const [transcript,    setTranscript]    = useState('');
  const [lastReply,     setLastReply]     = useState("Hi there! I'm Nadi.");
  const [mouthOpen,     setMouthOpen]     = useState(0);
  const [error,         setError]         = useState('');
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [cameraError,   setCameraError]   = useState('');
  const [facingMode,    setFacingMode]    = useState<'user' | 'environment'>('user');

  const videoRef         = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef   = useRef<MediaStream | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef   = useRef<any>(null);
  const audioContextRef  = useRef<AudioContext | null>(null);
  const analyserRef      = useRef<AnalyserNode | null>(null);
  const animFrameRef     = useRef<number>(0);
  const blinkTimerRef    = useRef<ReturnType<typeof setTimeout> | null>(null);
  const currentAudioRef  = useRef<HTMLAudioElement | null>(null);
  const messagesRef      = useRef<Message[]>([]);
  const sessionActiveRef = useRef(false);

  messagesRef.current      = messages;
  sessionActiveRef.current = sessionActive;

  // suppress unused
  void lastReply;
  void blinkTimerRef;

  const stopCamera = useCallback(() => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (videoRef.current) videoRef.current.srcObject = null;
    setCameraEnabled(false);
  }, []);

  const startCamera = useCallback(async (facing: 'user' | 'environment' = 'user') => {
    try {
      setCameraError('');
      if (!navigator.mediaDevices?.getUserMedia) { setCameraError('Camera not supported'); return; }
      mediaStreamRef.current?.getTracks().forEach(t => t.stop());
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facing, width: { ideal: 720 }, height: { ideal: 1280 } },
        audio: false,
      });
      mediaStreamRef.current = stream;
      // Attach directly so flip works while camera is already enabled
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        try { await videoRef.current.play(); } catch { /* autoplay policy */ }
      }
      setCameraEnabled(true);
    } catch (err) {
      console.error(err);
      setCameraEnabled(false);
      setCameraError('Camera unavailable');
    }
  }, []);

  const flipCamera = useCallback(async () => {
    const next: 'user' | 'environment' = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(next);
    await startCamera(next);
  }, [facingMode, startCamera]);

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

  const playAudio = useCallback((base64: string) => {
    return new Promise<void>((resolve) => {
      if (currentAudioRef.current) currentAudioRef.current.pause();
      const audio = new Audio(`data:audio/mp3;base64,${base64}`);
      currentAudioRef.current = audio;
      audio.crossOrigin = 'anonymous';
      audio.addEventListener('play',  () => startMouthAnimation(audio));
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
    const SR  = win.SpeechRecognition || win.webkitSpeechRecognition;
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
    await startCamera(facingMode);
    setTimeout(startOneTurn, 260);
  }, [startCamera, startOneTurn, facingMode]);

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

  const statusUI = statusConfig[status];

  // Orb halo color
  const orbHalo =
    status === 'speaking'  ? 'radial-gradient(circle, rgba(80,140,255,0.18) 0%, transparent 70%)'
    : status === 'listening' ? 'radial-gradient(circle, rgba(50,210,150,0.18) 0%, transparent 70%)'
    : status === 'thinking'  ? 'radial-gradient(circle, rgba(220,160,50,0.14) 0%, transparent 70%)'
    : 'radial-gradient(circle, rgba(100,130,180,0.08) 0%, transparent 70%)';

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body {
          height: 100%; overflow: hidden; background: #061017;
          -webkit-tap-highlight-color: transparent;
        }
        #__next, main { height: 100%; }

        @keyframes wave-bar {
          from { transform: scaleY(0.28); }
          to   { transform: scaleY(1); }
        }
        @keyframes statusDot {
          0%, 100% { opacity: 1;   transform: scale(1);    }
          50%       { opacity: 0.4; transform: scale(0.75); }
        }
        @keyframes orbFloat {
          0%, 100% { transform: translateY(0px);  }
          50%       { transform: translateY(-8px); }
        }

        .session-btn {
          transition: transform 0.12s ease, opacity 0.12s ease, box-shadow 0.12s ease;
          -webkit-user-select: none; user-select: none;
        }
        .session-btn:active { transform: scale(0.94); opacity: 0.85; }
        .safe-top    { padding-top:    env(safe-area-inset-top,    12px); }
        .safe-bottom { padding-bottom: env(safe-area-inset-bottom, 16px); }
        .orb-float   { animation: orbFloat 4s ease-in-out infinite; }
      `}</style>

      {/* Root */}
      <div style={{
        position: 'fixed', inset: 0,
        display: 'flex', flexDirection: 'column',
        background: `
          radial-gradient(ellipse 900px 500px at 50% -5%, rgba(255,255,255,0.055), transparent 58%),
          radial-gradient(ellipse 500px 340px at 50% 38%, rgba(85,228,174,0.055), transparent 70%),
          linear-gradient(180deg, #061017 0%, #09141b 42%, #071118 100%)
        `,
        fontFamily: "'SF Pro Display','Helvetica Neue',system-ui,sans-serif",
      }}>

        {/* MAIN CARD */}
        <div className="safe-top" style={{
          flex: 1, minHeight: 0,
          display: 'flex', flexDirection: 'column',
          padding: '0 14px', overflow: 'hidden',
        }}>
          {/* Glass card */}
          <div style={{
            flex: 1, minHeight: 0,
            borderRadius: 32, position: 'relative', overflow: 'hidden',
            background: 'linear-gradient(180deg, rgba(255,255,255,0.10), rgba(255,255,255,0.038))',
            border: '1px solid rgba(255,255,255,0.09)',
            backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
            boxShadow: '0 24px 72px rgba(0,0,0,0.36)',
            display: 'flex', flexDirection: 'column',
          }}>
            {/* sheen */}
            <div style={{
              position: 'absolute', inset: 0, pointerEvents: 'none',
              background: 'linear-gradient(180deg, rgba(255,255,255,0.025), transparent 28%)',
            }} />

            {/* ── Top bar ── */}
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '16px 18px 10px', flexShrink: 0,
              position: 'relative', zIndex: 4,
            }}>
              <button className="session-btn" onClick={endSession} aria-label="End session"
                style={{
                  width: 44, height: 44, borderRadius: 15,
                  border: '1px solid rgba(255,255,255,0.10)',
                  background: 'rgba(255,255,255,0.07)',
                  color: '#EFF4FA', fontSize: 18, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  backdropFilter: 'blur(12px)',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.20)',
                }}>✕</button>

              {/* Status pill */}
              <div style={{
                padding: '9px 16px', borderRadius: 999,
                background: statusUI.bg, border: `1px solid ${statusUI.border}`,
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
                <span style={{ color: '#F2F6FB', fontSize: 13, fontWeight: 700, letterSpacing: 0.2 }}>Nadi</span>
                <span style={{
                  color: statusUI.color, fontSize: 12, fontWeight: 600,
                  borderLeft: '1px solid rgba(255,255,255,0.14)',
                  paddingLeft: 8, letterSpacing: 0.1,
                }}>{statusUI.label}</span>
              </div>

              {/* Flip camera */}
              <button className="session-btn" onClick={flipCamera} aria-label="Flip camera"
                style={{
                  width: 44, height: 44, borderRadius: 15,
                  border: '1px solid rgba(255,255,255,0.10)',
                  background: 'rgba(255,255,255,0.07)',
                  color: '#EFF4FA', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  backdropFilter: 'blur(12px)',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.20)',
                }}>
                <MdFlipCameraIos size={22} />
              </button>
            </div>

            {/* ── Camera PiP ── */}
            <div style={{
              position: 'absolute', right: 18, top: 80,
              width: 112, height: 152, borderRadius: 24, overflow: 'hidden',
              background: cameraEnabled
                ? 'rgba(0,0,0,0.5)'
                : 'linear-gradient(180deg, rgba(255,255,255,0.09), rgba(255,255,255,0.04))',
              border: '1px solid rgba(255,255,255,0.10)',
              boxShadow: '0 16px 40px rgba(0,0,0,0.28)',
              backdropFilter: 'blur(18px)', zIndex: 5,
            }}>
              <video ref={videoRef} muted playsInline autoPlay
                style={{
                  width: '100%', height: '100%', objectFit: 'cover',
                  transform: facingMode === 'user' ? 'scaleX(-1)' : 'none',
                  display: cameraEnabled ? 'block' : 'none',
                }}
              />
              {!cameraEnabled && (
                <div style={{
                  width: '100%', height: '100%',
                  display: 'grid', placeItems: 'center',
                  color: 'rgba(255,255,255,0.35)',
                }}>
                  <MdVideocamOff size={26} />
                </div>
              )}
              <div style={{
                position: 'absolute', top: 9, left: 9,
                width: 8, height: 8, borderRadius: '50%',
                background: cameraEnabled ? '#4EDE9E' : 'rgba(255,255,255,0.22)',
                boxShadow: cameraEnabled ? '0 0 8px #4EDE9E' : 'none',
              }} />
            </div>

            {/* ── Orb area ── */}
            <div style={{
              flex: 1, minHeight: 0,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              padding: '0 20px 16px', position: 'relative', zIndex: 2,
            }}>
              {/* Orb + halo */}
              <div className="orb-float" style={{
                position: 'relative',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {/* Halo glow */}
                <div style={{
                  position: 'absolute', width: 290, height: 290, borderRadius: '50%',
                  background: orbHalo,
                  filter: 'blur(24px)',
                  transition: 'background 0.5s ease',
                }} />
                <AISpectrumOrb status={status} mouthOpen={mouthOpen} />
              </div>

              {/* Transcript */}
              <div style={{
                minHeight: 32, display: 'flex', alignItems: 'center',
                justifyContent: 'center', marginTop: 12, width: '100%',
              }}>
                {transcript && (
                  <p style={{
                    margin: 0, color: '#55E4AE',
                    fontSize: 14, fontWeight: 600,
                    textAlign: 'center', lineHeight: 1.45, maxWidth: 260,
                  }}>{transcript}</p>
                )}
              </div>

              {/* Waveform */}
              <div style={{
                marginTop: 8, minHeight: 28,
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
                position: 'absolute', left: 16, right: 16, bottom: 16,
                padding: '10px 14px', borderRadius: 16,
                background: 'rgba(255,88,88,0.10)', border: '1px solid rgba(255,88,88,0.20)',
                color: '#FFB8B8', fontSize: 12.5, lineHeight: 1.45,
                textAlign: 'center', zIndex: 10,
              }}>
                {error || cameraError}
              </div>
            )}
          </div>
        </div>

        {/* BOTTOM CONTROLS */}
        <div className="safe-bottom" style={{
          flexShrink: 0, display: 'flex',
          justifyContent: 'center', alignItems: 'center',
          padding: '14px 20px',
        }}>
          {!sessionActive ? (
            <button className="session-btn" onClick={startSession} style={{
              width: '100%', maxWidth: 340, height: 58,
              borderRadius: 22, border: '1px solid rgba(78,222,158,0.28)',
              cursor: 'pointer',
              background: 'linear-gradient(135deg, #7EE0A1 0%, #3ECFA0 60%, #2DBEAE 100%)',
              color: '#061712', fontSize: 17, fontWeight: 800, letterSpacing: 0.2,
              boxShadow: '0 16px 38px rgba(62,207,160,0.28), 0 4px 12px rgba(0,0,0,0.20)',
            }}>
              Start Session
            </button>
          ) : (
            /* Camera · Mic · End Call */
            <div style={{
              width: '100%', maxWidth: 320,
              padding: '14px 24px', borderRadius: 36,
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.09)',
              boxShadow: '0 20px 48px rgba(0,0,0,0.28)',
              backdropFilter: 'blur(22px)', WebkitBackdropFilter: 'blur(22px)',
              display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 20,
            }}>

              {/* Camera */}
              <button className="session-btn"
                onClick={cameraEnabled ? stopCamera : () => startCamera(facingMode)}
                aria-label={cameraEnabled ? 'Disable camera' : 'Enable camera'}
                style={{
                  width: 54, height: 54, borderRadius: '50%',
                  border: `1.5px solid ${cameraEnabled ? 'rgba(255,255,255,0.14)' : 'rgba(142,187,255,0.30)'}`,
                  background: cameraEnabled ? 'rgba(255,255,255,0.08)' : 'rgba(142,187,255,0.12)',
                  color: cameraEnabled ? 'rgba(255,255,255,0.65)' : '#8EBBFF',
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: cameraEnabled ? 'none' : '0 0 16px rgba(142,187,255,0.18)',
                }}>
                {cameraEnabled ? <MdVideocam size={22} /> : <MdVideocamOff size={22} />}
              </button>

              {/* Mic */}
              <button className="session-btn"
                onClick={() => recognitionRef.current?.stop()}
                aria-label="Pause microphone"
                style={{
                  width: 54, height: 54, borderRadius: '50%',
                  border: `1.5px solid ${status === 'listening' ? 'rgba(85,228,174,0.34)' : 'rgba(255,255,255,0.10)'}`,
                  background: status === 'listening' ? 'rgba(85,228,174,0.12)' : 'rgba(255,255,255,0.07)',
                  color: status === 'listening' ? '#55E4AE' : 'rgba(255,255,255,0.60)',
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: status === 'listening' ? '0 0 16px rgba(85,228,174,0.20)' : 'none',
                }}>
                <MdMic size={22} />
              </button>

              {/* End Call — LAST */}
              <button className="session-btn" onClick={endSession} aria-label="End call"
                style={{
                  width: 70, height: 70, borderRadius: '50%',
                  border: '2px solid rgba(255,100,100,0.36)',
                  background: 'radial-gradient(circle at 30% 30%, rgba(255,100,100,0.36), rgba(140,20,20,0.32))',
                  color: '#FFD9D9', cursor: 'pointer',
                  boxShadow: '0 14px 30px rgba(120,20,20,0.32), 0 0 0 1px rgba(255,80,80,0.10)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                <MdCallEnd size={28} />
              </button>

            </div>
          )}
        </div>
      </div>
    </>
  );
}