'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import BottomNav from '@/components/BottomNav';
import { ArrowLeftIcon, ArrowRightIcon, LogoutIcon, UserIcon, BellIcon, ShieldIcon, EditIcon } from '@/components/Icons';
import { ThemeToggle } from '@/components/ThemeProvider';
import { useUser } from '@/lib/UserContext';

const SETTINGS_SECTIONS = [
  {
    title: 'Profile',
    icon: '👤',
    items: [
      { icon: UserIcon, label: 'Personal Information', desc: 'Name, age, health goals' },
      { icon: BellIcon, label: 'Notifications', desc: 'Daily reminders and alerts' },
      { icon: ShieldIcon, label: 'Privacy & Data', desc: 'Control your health data' },
    ],
  },
  {
    title: 'Wellness',
    icon: '🌿',
    items: [
      { icon: UserIcon, label: 'Health Goals', desc: 'Step targets, sleep hours' },
      { icon: UserIcon, label: 'Connected Devices', desc: 'Fitbit, Apple Watch, etc.' },
      { icon: UserIcon, label: 'Food Preferences', desc: 'Diet type, allergies' },
    ],
  },
  {
    title: 'App',
    icon: '⚙️',
    items: [
      { icon: UserIcon, label: 'Language', desc: 'English (India)' },
      { icon: UserIcon, label: 'Units', desc: 'Metric — kg, km' },
      { icon: UserIcon, label: 'Subscription', desc: 'Nadiaura Premium — Active' },
    ],
  },
];

export default function SettingsPage() {
  const { user, loading, logout } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg-primary)' }}>
        <div className="screen-scroll page-enter" style={{ flex: 1, padding: '20px 18px 0' }}>
          <p style={{ color: 'var(--text-secondary)' }}>Loading...</p>
        </div>
        <BottomNav />
      </div>
    );
  }

  const getInitial = (name: string) => name?.charAt(0).toUpperCase() || 'U';
  const contact = user.phone_number || user.email;
  const xpPct = 72; // static for now

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg-primary)' }}>
      <div className="screen-scroll page-enter" style={{ flex: 1, padding: '20px 18px 0' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <Link href="/home" style={{ textDecoration: 'none' }}>
            <div className="btn-icon"><ArrowLeftIcon size={18} color="var(--text-secondary)" /></div>
          </Link>
          <h1 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)' }}>Profile & Settings</h1>
          <ThemeToggle />
        </div>

        {/* Profile Card */}
        <div className="animate-fade-in" style={{
          background: 'linear-gradient(135deg, var(--accent-subtle) 0%, var(--bg-card) 70%)',
          borderRadius: 22, padding: 20,
          border: '1px solid var(--border)',
          marginBottom: 18, position: 'relative',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 18 }}>
            {/* Avatar */}
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <div style={{
                width: 72, height: 72, borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--accent-dark), var(--bg-card-2))',
                border: '2.5px solid var(--accent)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 34,
                boxShadow: '0 0 16px var(--accent-glow)',
              }}>
                {getInitial(user.name)}
              </div>
              <div style={{
                position: 'absolute', bottom: 0, right: 0,
                width: 24, height: 24, borderRadius: '50%',
                background: 'var(--accent)', border: '2px solid var(--bg-primary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
              }}>
                <EditIcon size={11} color="#fff" />
              </div>
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <p style={{ color: 'var(--text-primary)', fontWeight: 800, fontSize: 18, letterSpacing: '-0.01em' }}>{user.name}</p>
                <div className="level-badge" style={{ fontSize: 10 }}>⚡ LV 12</div>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>{contact}</p>
              <p style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 2 }}>Age {user.age} · {user.occupation}</p>
            </div>
          </div>

          {/* XP Bar */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: 12, fontWeight: 600 }}>Level Progress</span>
              <span style={{ color: 'var(--gold)', fontSize: 12, fontWeight: 700 }}>360 / 500 XP</span>
            </div>
            <div className="xp-track">
              <div className="xp-fill" style={{ width: `${xpPct}%` }} />
            </div>
          </div>

          {/* Stats row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
            {[
              { label: 'Wellness', value: 85, unit: '/100', color: 'var(--accent)' },
              { label: 'Streak', value: 12, unit: 'days', color: 'var(--warning)' },
              { label: 'XP Total', value: '2.8K', unit: 'pts', color: 'var(--gold)' },
            ].map((stat, i) => (
              <div key={i} style={{
                background: 'var(--bg-card)',
                borderRadius: 12, padding: '10px',
                border: '1px solid var(--border-subtle)',
                textAlign: 'center',
              }}>
                <p style={{ color: stat.color, fontSize: 18, fontWeight: 900, letterSpacing: '-0.01em' }}>
                  {stat.value}<span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 500 }}>{stat.unit}</span>
                </p>
                <p style={{ color: 'var(--text-muted)', fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div className="animate-fade-in delay-1" style={{
          background: 'var(--bg-card)',
          borderRadius: 20, padding: 16,
          border: '1px solid var(--border-subtle)',
          marginBottom: 18,
        }}>
          <p style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: 14, marginBottom: 12 }}>Achievements Unlocked</p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {[
              { emoji: '🔥', label: '12-Day Streak' },
              { emoji: '🌿', label: 'Wellness Starter' },
              { emoji: '💪', label: 'Step Master' },
              { emoji: '🧘', label: 'Mindful 7' },
              { emoji: '🏆', label: 'Top 10%' },
            ].map((a, i) => (
              <div key={i} className="achievement-pill">{a.emoji} {a.label}</div>
            ))}
          </div>
        </div>

        {/* Settings Sections */}
        {SETTINGS_SECTIONS.map((section, si) => (
          <div key={si} className={`animate-fade-in delay-${si + 2}`} style={{ marginBottom: 18 }}>
            <p className="section-title">{section.icon} {section.title}</p>
            <div style={{
              background: 'var(--bg-card)',
              borderRadius: 20,
              border: '1px solid var(--border-subtle)',
              overflow: 'hidden',
            }}>
              {section.items.map((item, ii) => {
                const Icon = item.icon;
                return (
                  <div key={ii} style={{
                    display: 'flex', alignItems: 'center', gap: 14,
                    padding: '14px 16px',
                    borderBottom: ii < section.items.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                    cursor: 'pointer', transition: 'background 0.2s',
                  }}>
                    <div className="domain-icon accent" style={{ width: 38, height: 38, borderRadius: 10 }}>
                      <Icon size={18} color="var(--accent)" />
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: 14 }}>{item.label}</p>
                      <p style={{ color: 'var(--text-muted)', fontSize: 12 }}>{item.desc}</p>
                    </div>
                    <ArrowRightIcon size={16} color="var(--text-dim)" />
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Logout */}
        <div className="animate-fade-in delay-5" style={{ marginBottom: 24 }}>
          <button
            onClick={async () => {
              await logout();
              router.push('/login');
            }}
            style={{
              width: '100%', padding: '14px',
              background: 'rgba(255,82,82,0.06)',
              border: '1px solid rgba(255,82,82,0.2)',
              borderRadius: 16, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              transition: 'all 0.2s',
            }}
          >
            <LogoutIcon size={18} color="var(--danger)" />
            <span style={{ color: 'var(--danger)', fontWeight: 700, fontSize: 15 }}>Sign Out</span>
          </button>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
