'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeftIcon } from '@/components/Icons';
import { useUser } from '@/lib/UserContext';

export default function VerifyPage() {
  const [otp, setOtp] = useState(['', '', '', '']);
  const refs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];
  const router  = useRouter();
  const { setUser } = useUser();

  const completeLogin = () => {
    try {
      const raw = localStorage.getItem('nadiaura-pending-user');
      if (raw) { setUser(JSON.parse(raw)); localStorage.removeItem('nadiaura-pending-user'); }
    } catch { /* ignore */ }
    router.push('/home');
  };

  const handleChange = (i: number, val: string) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp]; next[i] = val; setOtp(next);
    if (val && i < 3) refs[i + 1].current?.focus();
    if (next.every(d => d !== '')) setTimeout(completeLogin, 400);
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) refs[i - 1].current?.focus();
  };

  const filled = otp.filter(d => d !== '').length;

  return (
    <div className="screen-scroll relative overflow-hidden flex flex-col min-h-full p-6"
      style={{ background: 'var(--bg-primary)' }}>
      <div className="absolute -top-20 -left-20 w-60 h-60 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, var(--accent-subtle) 0%, transparent 70%)' }} />

      <button onClick={() => router.back()} className="bg-transparent border-0 cursor-pointer self-start p-2 mb-2">
        <div className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ background: 'var(--bg-card-2)', border: '1px solid var(--border-subtle)' }}>
          <ArrowLeftIcon size={18} color="var(--text-secondary)" />
        </div>
      </button>

      <div className="animate-fade-in flex-1 flex flex-col justify-center pb-16">
        <div className="flex justify-center mb-7">
          <div className="w-20 h-20 rounded-[24px] flex items-center justify-center text-[38px]"
            style={{ background: 'var(--accent-subtle)', border: '1px solid var(--border)', boxShadow: '0 8px 30px var(--accent-glow)' }}>📱</div>
        </div>
        <h1 className="text-[26px] font-extrabold text-[var(--text-primary)] text-center mb-2.5 tracking-[-0.02em]">
          Verify Your Identity
        </h1>
        <p className="text-[var(--text-secondary)] text-[15px] text-center leading-relaxed mb-9">
          Enter the 4-digit code sent to your<br />phone or email
        </p>
        <div className="flex gap-3 justify-center mb-8">
          {otp.map((digit, i) => (
            <input key={i} ref={refs[i]} type="text" inputMode="numeric" maxLength={1} value={digit}
              onChange={e => handleChange(i, e.target.value)}
              onKeyDown={e => handleKeyDown(i, e)}
              className="w-[68px] h-[76px] rounded-[18px] text-[28px] font-extrabold text-center outline-none transition-all caret-transparent"
              style={{
                background: digit ? 'var(--accent-subtle)' : 'var(--bg-card-2)',
                border: `2px solid ${digit ? 'var(--accent)' : 'var(--border-subtle)'}`,
                color: 'var(--text-primary)',
                boxShadow: digit ? '0 0 0 3px rgba(0,214,143,0.1)' : 'none',
              }} />
          ))}
        </div>
        <div className="flex justify-center gap-1.5 mb-8">
          {[0,1,2,3].map(i => (
            <div key={i} className="h-[6px] rounded-full transition-all duration-300"
              style={{ width: i < filled ? 20 : 6, background: i < filled ? 'var(--accent)' : 'var(--border-subtle)', boxShadow: i < filled ? '0 0 6px var(--accent-glow)' : 'none' }} />
          ))}
        </div>
        <button onClick={completeLogin} disabled={filled !== 4}
          className="w-full rounded-2xl py-4 text-base font-bold flex items-center justify-center gap-1 border-0 cursor-pointer transition-all"
          style={{
            background: filled === 4 ? 'linear-gradient(135deg, var(--accent-dim), var(--accent))' : 'var(--bg-card-3)',
            color: filled === 4 ? '#fff' : 'var(--text-muted)',
            boxShadow: filled === 4 ? '0 4px 20px var(--accent-glow)' : 'none',
          }}>
          {filled === 4 ? '✓ Verified — Continue' : `Enter all 4 digits (${filled}/4)`}
        </button>
        <div className="text-center mt-6">
          <span className="text-[var(--text-muted)] text-sm">Didn&apos;t receive it? </span>
          <button className="bg-transparent border-0 text-[var(--accent)] font-bold text-sm cursor-pointer p-0">Resend OTP</button>
        </div>
      </div>
    </div>
  );
}
