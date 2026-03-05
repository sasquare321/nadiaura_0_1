'use client';
import { useState } from 'react';
import Link from 'next/link';
import BottomNav from '@/components/BottomNav';
import { ArrowLeftIcon, PhoneIcon, MessageIcon } from '@/components/Icons';

const ESCALATIONS = [
  { level: 1, label: 'Nadi AI', desc: 'AI companion responds with calming support', color: 'var(--accent)', icon: '🤖', borderColor: 'var(--accent)' },
  { level: 2, label: 'Community Buddy', desc: 'Anonymous peer support from trained volunteers', color: 'var(--physical)', icon: '👥', borderColor: 'var(--physical)' },
  { level: 3, label: 'Wellness Coach', desc: 'Live call with a certified wellness coach', color: 'var(--emotional)', icon: '🧑‍⚕️', borderColor: 'var(--emotional)' },
  { level: 4, label: 'Emergency Services', desc: 'Direct alert to emergency contacts + services', color: 'var(--danger)', icon: '🚨', borderColor: 'var(--danger)' },
];

const BUDDIES = [
  { name: 'Priya S.', role: 'Stress Coach', status: 'Online', emoji: '👩' },
  { name: 'Arjun M.', role: 'Peer Support', status: 'Online', emoji: '👨' },
  { name: 'Dr. Meera', role: 'Therapist', status: 'Available 4 PM', emoji: '👩‍⚕️' },
];

type Toggle = { label: string; key: string; on: boolean };

export default function AlertsPage() {
  const [pressing, setPressing] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [toggles, setToggles] = useState<Toggle[]>([
    { label: 'Auto-alert after missed check-in', key: 'auto', on: true },
    { label: 'Night mode crisis detection', key: 'night', on: true },
    { label: 'Share location with emergency contacts', key: 'location', on: false },
  ]);

  const handlePressStart = () => setPressing(true);
  const handlePressEnd = () => {
    if (pressing) {
      setPressing(false);
      setPressed(true);
      setTimeout(() => setPressed(false), 3000);
    }
  };

  const toggleItem = (key: string) => {
    setToggles(prev => prev.map(t => t.key === key ? { ...t, on: !t.on } : t));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg-primary)' }}>
      <div className="screen-scroll page-enter" style={{ flex: 1, padding: '20px 18px 0' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
          <Link href="/home" style={{ textDecoration: 'none' }}>
            <div className="btn-icon"><ArrowLeftIcon size={18} color="var(--text-secondary)" /></div>
          </Link>
          <h1 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)' }}>Crisis Support</h1>
          <div className="btn-icon" >
            <span style={{ fontSize: 16 }}>🔔</span>
          </div>
        </div>

        {/* SOS Button */}
        <div className="animate-fade-in" style={{
          background: 'var(--bg-card)',
          borderRadius: 22, padding: 28,
          border: '1px solid var(--border-subtle)',
          marginBottom: 18,
          display: 'flex', flexDirection: 'column', alignItems: 'center',
        }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 24, textAlign: 'center' }}>
            Hold the button for 3 seconds to activate emergency support
          </p>

          {/* SOS button */}
          <div style={{ position: 'relative', marginBottom: 20 }}>
            {/* Pulse rings */}
            {(pressing || pressed) && (
              <>
                <div style={{
                  position: 'absolute', inset: -20, borderRadius: '50%',
                  border: '2px solid rgba(255,82,82,0.3)',
                  animation: 'pulse-ring 1.5s ease-in-out infinite',
                }} />
                <div style={{
                  position: 'absolute', inset: -36, borderRadius: '50%',
                  border: '1.5px solid rgba(255,82,82,0.15)',
                  animation: 'pulse-ring-2 2s ease-in-out infinite',
                }} />
              </>
            )}
            <div
              onMouseDown={handlePressStart}
              onMouseUp={handlePressEnd}
              onTouchStart={handlePressStart}
              onTouchEnd={handlePressEnd}
              style={{
                width: 140, height: 140, borderRadius: '50%',
                background: pressed
                  ? 'radial-gradient(circle, rgba(255,82,82,0.3), rgba(255,82,82,0.15))'
                  : pressing
                  ? 'radial-gradient(circle, rgba(255,82,82,0.2), var(--bg-card-2))'
                  : 'var(--bg-card-2)',
                border: `2.5px solid ${pressed ? 'var(--danger)' : pressing ? 'rgba(255,82,82,0.5)' : 'var(--border-subtle)'}`,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s',
                boxShadow: pressed ? '0 0 40px rgba(255,82,82,0.3)' : pressing ? '0 0 20px rgba(255,82,82,0.15)' : 'none',
                userSelect: 'none',
              }}
            >
              <span style={{ fontSize: 36, marginBottom: 6 }}>{pressed ? '🆘' : '🛡️'}</span>
              <span style={{ color: pressed ? 'var(--danger)' : 'var(--text-secondary)', fontWeight: 800, fontSize: 14, letterSpacing: '0.05em' }}>
                {pressed ? 'ACTIVE' : 'SOS'}
              </span>
            </div>
          </div>

          {pressed && (
            <div className="animate-scale-in" style={{
              background: 'rgba(255,82,82,0.1)',
              border: '1px solid rgba(255,82,82,0.3)',
              borderRadius: 14, padding: '10px 18px',
              textAlign: 'center',
            }}>
              <p style={{ color: 'var(--danger)', fontWeight: 700, fontSize: 14 }}>🚨 Emergency Alert Sent</p>
              <p style={{ color: 'var(--text-secondary)', fontSize: 12, marginTop: 4 }}>Your contacts have been notified</p>
            </div>
          )}
        </div>

        {/* Escalation levels */}
        <div className="animate-fade-in delay-1" style={{ marginBottom: 18 }}>
          <p className="section-title mb-4">Support Escalation</p>
          {ESCALATIONS.map((item, i) => (
            <div key={i} className={`level-card animate-fade-in delay-${i + 1}`}
              style={{
              background: 'var(--bg-card)',
              borderRadius: 16, padding: '14px 16px',
              border: '1px solid var(--border-subtle)',
              marginBottom: 8,
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: 12,
                background: `${item.color}15`,
                border: `1px solid ${item.color}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 20, flexShrink: 0,
              }}>{item.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: 14 }}>{item.label}</span>
                  <span style={{
                    width: 18, height: 18, borderRadius: '50%',
                    background: `${item.color}20`, color: item.color,
                    fontSize: 10, fontWeight: 800,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>{item.level}</span>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: 12 }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Support Buddies */}
        <div className="animate-fade-in delay-2" style={{ marginBottom: 18 }}>
          <p className="section-title mb-4">Available Support</p>
          {BUDDIES.map((buddy, i) => (
            <div key={i} style={{
              background: 'var(--bg-card)',
              borderRadius: 16, padding: '14px 16px',
              border: '1px solid var(--border-subtle)',
              marginBottom: 8,
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <div style={{
                width: 46, height: 46, borderRadius: '50%',
                background: 'var(--bg-card-2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 24, flexShrink: 0, position: 'relative',
              }}>
                {buddy.emoji}
                <div style={{
                  position: 'absolute', bottom: 1, right: 1,
                  width: 10, height: 10, borderRadius: '50%',
                  background: buddy.status === 'Online' ? 'var(--accent)' : 'var(--warning)',
                  border: '2px solid var(--bg-card)',
                }} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: 14, marginBottom: 2 }}>{buddy.name}</p>
                <p style={{ color: 'var(--text-muted)', fontSize: 12 }}>{buddy.role} · {buddy.status}</p>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <div className="btn-icon" style={{ width: 36, height: 36 }}>
                  <PhoneIcon size={16} color="var(--accent)" />
                </div>
                <div className="btn-icon" style={{ width: 36, height: 36 }}>
                  <MessageIcon size={16} color="var(--text-secondary)" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Alert Settings */}
        <div className="animate-fade-in delay-3" style={{
          background: 'var(--bg-card)',
          borderRadius: 20, padding: 18,
          border: '1px solid var(--border-subtle)',
          marginBottom: 18,
        }}>
          <p style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: 15, marginBottom: 14 }}>Auto-Alert Settings</p>
          {toggles.map((t, i) => (
            <div key={t.key} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              paddingBottom: i < toggles.length - 1 ? 14 : 0,
              borderBottom: i < toggles.length - 1 ? '1px solid var(--border-subtle)' : 'none',
              marginBottom: i < toggles.length - 1 ? 14 : 0,
            }}>
              <p style={{ color: 'var(--text-secondary)', fontSize: 13, flex: 1, lineHeight: 1.4 }}>{t.label}</p>
              <div className={`toggle ${t.on ? 'on' : ''}`} onClick={() => toggleItem(t.key)} />
            </div>
          ))}
        </div>

        <div style={{ height: 8 }} />
      </div>
      <BottomNav />
    </div>
  );
}
