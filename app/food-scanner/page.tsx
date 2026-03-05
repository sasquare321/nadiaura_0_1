'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { XIcon } from '@/components/Icons';

export default function FoodScannerPage() {
  const [scanning, setScanning] = useState(false);
  const [done, setDone] = useState(false);
  const router = useRouter();

  const handleScan = () => {
    setScanning(true);
    setTimeout(() => {
      setDone(true);
      setTimeout(() => router.push('/food-analysis'), 800);
    }, 1600);
  };

  return (
    <div style={{
      height: '100%', background: '#000',
      display: 'flex', flexDirection: 'column',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Camera sim */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at center, #1a2a1e 0%, #050e07 100%)',
      }} />

      {/* Scan overlay pattern */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.04,
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 20px, var(--accent) 20px, var(--accent) 21px)',
      }} />

      {/* Top bar */}
      <div style={{
        position: 'relative', zIndex: 10,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '20px 20px 0',
      }}>
        <Link href="/home" style={{ textDecoration: 'none' }}>
          <div style={{
            width: 40, height: 40, borderRadius: '50%',
            background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          }}>
            <XIcon size={18} color="white" />
          </div>
        </Link>
        <p style={{ color: 'white', fontWeight: 700, fontSize: 16 }}>Food Scanner</p>
        <div style={{
          background: 'rgba(0,214,143,0.15)', backdropFilter: 'blur(10px)',
          borderRadius: 99, 
          border: '1px solid rgba(0,214,143,0.3)',
        }} className=' px-4 flex py-1'>
          <span style={{ color: 'var(--accent)', fontSize: 12, fontWeight: 600 }}>AI Ready</span>
        </div>
      </div>

      {/* Viewfinder */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        position: 'relative', zIndex: 10, padding: 30,
      }}>
        <div style={{ position: 'relative', marginBottom: 24 }}>
          {/* Corner brackets */}
          {[
            { top: 0, left: 0, borderTop: 3, borderLeft: 3 },
            { top: 0, right: 0, borderTop: 3, borderRight: 3 },
            { bottom: 0, left: 0, borderBottom: 3, borderLeft: 3 },
            { bottom: 0, right: 0, borderBottom: 3, borderRight: 3 },
          ].map((corner, i) => (
            <div key={i} style={{
              position: 'absolute',
              width: 32, height: 32,
              borderStyle: 'solid',
              borderColor: scanning ? 'var(--accent)' : 'rgba(255,255,255,0.6)',
              borderWidth: 0,
              borderTopWidth: corner.borderTop || 0,
              borderLeftWidth: corner.borderLeft || 0,
              borderBottomWidth: corner.borderBottom || 0,
              borderRightWidth: corner.borderRight || 0,
              top: corner.top, left: corner.left,
              bottom: corner.bottom, right: corner.right,
              borderRadius: i === 0 ? '6px 0 0 0' : i === 1 ? '0 6px 0 0' : i === 2 ? '0 0 0 6px' : '0 0 6px 0',
              transition: 'border-color 0.3s',
            }} />
          ))}

          {/* Center viewfinder */}
          <div style={{
            width: 220, height: 220,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {done ? (
              <div className="animate-scale-in" style={{ fontSize: 80 }}>🥗</div>
            ) : (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 56, marginBottom: 12 }}>🍽️</div>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>Point at food to scan</p>
              </div>
            )}
          </div>

          {/* Scan line */}
          {scanning && !done && (
            <div style={{
              position: 'absolute', left: 0, right: 0, top: '30%',
              height: 2,
              background: 'linear-gradient(90deg, transparent, var(--accent), transparent)',
              boxShadow: '0 0 12px var(--accent)',
              animation: 'scan-line 1s ease-in-out infinite alternate',
            }} />
          )}
        </div>

        {/* Status */}
        <div style={{
          background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(12px)',
          borderRadius: 14, padding: '10px 20px',
          border: '1px solid rgba(255,255,255,0.1)',
          marginBottom: 32, textAlign: 'center',
        }}>
          <p style={{ color: scanning ? 'var(--accent)' : 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 600 }}>
            {done ? '✓ Food identified!' : scanning ? '⚡ Analyzing nutrients...' : 'AI ready to analyze'}
          </p>
        </div>

        {/* Tips */}
        <div style={{
          background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(12px)',
          borderRadius: 12, padding: '10px 16px',
          border: '1px solid rgba(255,255,255,0.06)',
          marginBottom: 28,
        }}>
          {['📍 Hold steady, 30–60cm away', '💡 Good lighting helps accuracy', '🎯 Centre the food in frame'].map((tip, i) => (
            <p key={i} style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, lineHeight: 1.6 }}>{tip}</p>
          ))}
        </div>
      </div>

      {/* Shutter */}
      <div style={{
        position: 'relative', zIndex: 10,
        display: 'flex', justifyContent: 'center',
        paddingBottom: 40,
      }}>
        <button
          onClick={handleScan}
          disabled={scanning}
          style={{
            width: 80, height: 80, borderRadius: '50%',
            background: scanning
              ? 'linear-gradient(135deg, var(--accent-dim), var(--accent))'
              : 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(12px)',
            border: `3px solid ${scanning ? 'var(--accent)' : 'rgba(255,255,255,0.5)'}`,
            cursor: scanning ? 'default' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.3s',
            boxShadow: scanning ? '0 0 30px var(--accent-glow)' : 'none',
          }}
        >
           
        </button>
      </div>

      <style>{`
        @keyframes scan-line {
          from { top: 10%; }
          to { top: 80%; }
        }
      `}</style>
    </div>
  );
}
