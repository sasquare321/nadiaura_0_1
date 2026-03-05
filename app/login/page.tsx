'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { GoogleIcon, AppleIcon } from '@/components/Icons';

export default function LoginPage() {
  const [input, setInput] = useState('');
  const [focused, setFocused] = useState(false);
  const router = useRouter();

  const handleSendOTP = () => { if (input.trim()) router.push('/verify'); };

  return (
    <div className="screen-scroll relative overflow-hidden flex flex-col min-h-full p-6 pb-8"
      style={{ background: 'var(--bg-primary)' }}>

      <div className="absolute -top-20 -right-16 w-56 h-56 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, var(--accent-subtle) 0%, transparent 70%)' }} />
      <div className="absolute bottom-24 -left-20 w-64 h-64 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(59,158,255,0.05) 0%, transparent 70%)' }} />

      <div className="relative flex justify-between items-center mb-3">
        <button className="bg-transparent border-0 text-[var(--text-muted)] text-xl cursor-pointer p-2 leading-none">✕</button>
        <span className="text-[var(--text-muted)] font-medium text-[13px] uppercase tracking-[0.08em]">Nadiaura</span>
        <div className="w-9" />
      </div>

      <div className="animate-fade-in flex flex-col items-center mt-7 mb-9">
        <div className="relative mb-6">
          <div
            className="w-[88px] h-[88px] rounded-[28px] flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, var(--accent-dark), var(--accent-subtle))',
              border: '1px solid var(--border)',
              boxShadow: '0 8px 32px var(--accent-glow)',
            }}
          >
            <Image
              src="/Icons/nadi.png"
              alt="Nadi"
              width={56}
              height={56}
              priority
              className="select-none"
              style={{ objectFit: 'contain' }}
            />
          </div>
          <div className="absolute -inset-2 rounded-[36px] border border-[var(--border)] opacity-50" />
        </div>

        <h1 className="text-[28px] font-extrabold text-[var(--text-primary)] tracking-[-0.02em] mb-2.5 text-center leading-tight">
          Your Wellness Journey<br />Starts Here
        </h1>
        <p className="text-[var(--text-secondary)] text-[15px] text-center leading-relaxed">
          Holistic care for your body, mind<br />and financial wellbeing.
        </p>
      </div>

      {/* <div className="animate-fade-in delay-1 flex justify-center mb-7">
        <div className="flex items-center gap-2 rounded-full px-[14px] py-1.5"
          style={{ background: 'var(--accent-subtle)' }}>
          <span className="text-sm"></span>
          <span className="text-[var(--gold)] text-xs font-semibold"></span>
        </div>
      </div> */}

      <div className="animate-fade-in delay-2 mb-4">
        <label className="block text-[var(--text-secondary)] text-[13px] font-semibold mb-2 tracking-[0.03em]">
          EMAIL OR PHONE NUMBER
        </label>
        <div className="relative mb-[14px]">
          <input
            type="text"
            placeholder="name@email.com or +91 98765..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSendOTP()}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className="w-full rounded-[14px] py-[15px] pl-[18px] pr-[52px] text-[15px] outline-none transition-all"
            style={{
              background: focused ? 'var(--bg-card-3)' : 'var(--bg-card-2)',
              border: `1.5px solid ${focused ? 'var(--accent)' : 'var(--border-subtle)'}`,
              color: 'var(--text-primary)',
              boxShadow: focused ? '0 0 0 3px var(--accent-subtle)' : 'none',
            }}
          />
          <div className={`absolute right-3.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center transition-all`}
            style={{ background: input ? 'var(--accent-subtle)' : 'transparent' }}>
            <span className="text-base" style={{ color: input ? 'var(--accent)' : 'var(--text-muted)' }}>
              {input ? '✓' : '@'}
            </span>
          </div>
        </div>

        <button onClick={handleSendOTP}
          className="w-full rounded-2xl py-4 text-base font-bold flex items-center justify-center gap-1 transition-all border-0 cursor-pointer"
          style={{
            background: input ? 'linear-gradient(135deg, var(--accent-dim), var(--accent))' : 'var(--bg-card-3)',
            color: input ? '#fff' : 'var(--text-muted)',
            boxShadow: input ? '0 4px 20px var(--accent-glow)' : 'none',
          }}>
          Continue with OTP <span className="opacity-80">→</span>
        </button>
      </div>

      <div className="animate-fade-in delay-3 flex items-center gap-3 my-[18px]">
        <div className="flex-1 h-px bg-[var(--border-subtle)]" />
        <span className="text-[var(--text-muted)] text-[11px] font-semibold tracking-[0.08em]">OR CONTINUE WITH</span>
        <div className="flex-1 h-px bg-[var(--border-subtle)]" />
      </div>

      <div className="animate-fade-in delay-4 flex gap-3 mb-6">
        {[{ Icon: GoogleIcon, label: 'Google' }, { Icon: AppleIcon, label: 'Apple' }].map(({ Icon, label }) => (
          <button key={label} onClick={() => router.push('/home')}
            className="flex-1 flex items-center justify-center gap-2.5 rounded-[14px] py-[14px] text-[15px] font-semibold cursor-pointer transition-all"
            style={{ background: 'var(--bg-card-2)', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)' }}>
            <Icon size={20} /> {label}
          </button>
        ))}
      </div>

      <div className="text-center mb-3">
        <span className="text-[var(--text-secondary)] text-sm">New to Nadiaura? </span>
        <Link href="/home" className="text-[var(--accent)] font-bold text-sm no-underline">Create Account</Link>
      </div>

      {/* <div className="flex justify-center gap-5 mt-auto pt-5">
        {[{ icon: '🔒', label: 'Secure' }, { icon: '🏥', label: 'HIPAA Safe' }, { icon: '⭐', label: 'Top Rated' }].map(item => (
          <div key={item.label} className="flex items-center gap-1 text-[var(--text-muted)] text-[11px] font-medium">
            <span className="text-xs">{item.icon}</span> {item.label}
          </div>
        ))}
      </div> */}

      <p className="text-[var(--text-dim)] text-[11px] text-center mt-3 leading-relaxed">
        By continuing, you agree to our{' '}
        <span className="text-[var(--text-muted)] underline cursor-pointer">Terms</span>
        {' & '}
        <span className="text-[var(--text-muted)] underline cursor-pointer">Privacy Policy</span>
      </p>
    </div>
  );
}