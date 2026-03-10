'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeftIcon, ArrowRightIcon, CheckIcon, UserIcon } from '@/components/Icons';

/* ─────────── Types ─────────── */
type Step = 1 | 2 | 3;

interface FormData {
  // Step 1 — Contact & Identity
  fullName: string;
  email: string;
  phone: string;
  age: string;
  gender: string;
  // Step 2 — Background
  maritalStatus: string;
  cityTier: string;
  education: string;
  occupation: string;
  incomeBand: string;
  // Step 3 — Goals & Privacy
  primaryGoals: string[];
  keyContext: string;
  privacySensitivity: string;
}

const INITIAL: FormData = {
  fullName: '', email: '', phone: '', age: '', gender: '',
  maritalStatus: '', cityTier: '', education: '', occupation: '', incomeBand: '',
  primaryGoals: [], keyContext: '', privacySensitivity: '',
};

/* ─────────── Option lists ─────────── */
const GENDERS        = ['Male', 'Female', 'Non-binary', 'Prefer not to say'];
const MARITAL        = ['Unmarried', 'Married', 'Widowed', 'Divorced', 'Separated'];
const CITY_TIERS     = ['Tier-1 Metro', 'Tier-1 / Tier-2 Business Hub', 'Tier-2', 'Tier-3', 'Rural'];
const INCOME_BANDS   = [
  'Below ₹15k', '₹15k–₹35k', '₹35k–₹55k', '₹55k–₹1L',
  '₹1L–₹2L', 'Above ₹2L', 'Variable / Business', 'Pension / Savings',
];
const PRIVACY_LEVELS = [
  { value: 'Low',    label: 'Open',       desc: 'Comfortable sharing with family & care team',  icon: '🌐' },
  { value: 'Medium', label: 'Selective',  desc: 'Share with specific trusted contacts only',     icon: '🔒' },
  { value: 'High',   label: 'Private',    desc: 'Keep data strictly within the app',             icon: '🛡️' },
];
const GOAL_OPTIONS = [
  { value: 'sleep',    label: 'Improve sleep',        icon: '🌙' },
  { value: 'mood',     label: 'Stabilize mood',       icon: '💙' },
  { value: 'stress',   label: 'Reduce stress',        icon: '🧘' },
  { value: 'spending', label: 'Control spending',     icon: '💸' },
  { value: 'energy',   label: 'Boost energy',         icon: '⚡' },
  { value: 'social',   label: 'Rebuild connections',  icon: '🤝' },
  { value: 'health',   label: 'Monitor vitals',       icon: '❤️' },
  { value: 'clarity',  label: 'Regain focus/clarity', icon: '🎯' },
];

/* ─────────── Helpers ─────────── */
const inputStyle = (focused: boolean, hasVal: boolean) => ({
  background:  focused ? 'var(--bg-card-3)' : 'var(--bg-card-2)',
  border:      `1.5px solid ${focused ? 'var(--accent)' : hasVal ? 'var(--border)' : 'var(--border-subtle)'}`,
  color:       'var(--text-primary)',
  boxShadow:   focused ? '0 0 0 3px var(--accent-subtle)' : 'none',
  borderRadius: 14,
  padding:     '14px 18px',
  fontSize:    15,
  width:       '100%',
  outline:     'none',
  transition:  'all .2s',
  appearance:  'none' as const,
  WebkitAppearance: 'none' as const,
});

/* ─────────── Sub-components ─────────── */
function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-[11px] font-semibold tracking-[0.08em] mb-1.5 uppercase"
      style={{ color: 'var(--text-muted)' }}>
      {children}
    </label>
  );
}

function TextInput({
  placeholder, value, onChange, type = 'text', icon,
}: {
  placeholder: string; value: string; onChange: (v: string) => void;
  type?: string; icon?: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="relative">
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={inputStyle(focused, !!value)}
        className="block"
      />
      {icon && (
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-base opacity-50 pointer-events-none">
          {icon}
        </span>
      )}
    </div>
  );
}

function SelectInput({
  placeholder, value, onChange, options,
}: {
  placeholder: string; value: string; onChange: (v: string) => void; options: string[];
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="relative">
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={inputStyle(focused, !!value)}
        className="block"
      >
        <option value="" disabled style={{ color: 'var(--text-muted)', background: 'var(--bg-card-2)' }}>
          {placeholder}
        </option>
        {options.map(o => (
          <option key={o} value={o} style={{ background: 'var(--bg-card-2)', color: 'var(--text-primary)' }}>
            {o}
          </option>
        ))}
      </select>
      <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-sm"
        style={{ color: 'var(--text-muted)' }}>▾</span>
    </div>
  );
}

function PillGroup({
  options, value, onChange, multi = false,
}: {
  options: string[]; value: string | string[]; onChange: (v: string) => void; multi?: boolean;
}) {
  const isActive = (o: string) => multi ? (value as string[]).includes(o) : value === o;
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(o => (
        <button
          key={o} type="button"
          onClick={() => onChange(o)}
          className="px-4 py-2 rounded-full text-[13px] font-semibold transition-all border-0 cursor-pointer"
          style={{
            background:  isActive(o) ? 'var(--accent-subtle)' : 'var(--bg-card-2)',
            color:       isActive(o) ? 'var(--accent)' : 'var(--text-secondary)',
            border:      `1.5px solid ${isActive(o) ? 'var(--accent)' : 'var(--border-subtle)'}`,
            boxShadow:   isActive(o) ? '0 0 0 2px var(--accent-subtle)' : 'none',
          }}>
          {o}
        </button>
      ))}
    </div>
  );
}

/* ─────────── Step components ─────────── */
function Step1({ data, set }: { data: FormData; set: (k: keyof FormData, v: string) => void }) {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <FieldLabel>Full Name</FieldLabel>
        <TextInput placeholder="e.g. Rahul Sharma" value={data.fullName} onChange={v => set('fullName', v)} icon="✦" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <FieldLabel>Email</FieldLabel>
          <TextInput type="email" placeholder="name@email.com" value={data.email} onChange={v => set('email', v)} />
        </div>
        <div>
          <FieldLabel>Phone</FieldLabel>
          <TextInput type="tel" placeholder="+91 98765..." value={data.phone} onChange={v => set('phone', v)} />
        </div>
      </div>
      <div>
        <FieldLabel>Age</FieldLabel>
        <TextInput type="number" placeholder="e.g. 30" value={data.age} onChange={v => set('age', v)} icon="🎂" />
      </div>
      <div>
        <FieldLabel>Gender</FieldLabel>
        <PillGroup options={GENDERS} value={data.gender} onChange={v => set('gender', v)} />
      </div>
    </div>
  );
}

function Step2({ data, set }: { data: FormData; set: (k: keyof FormData, v: string) => void }) {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <FieldLabel>Marital Status</FieldLabel>
        <PillGroup options={MARITAL} value={data.maritalStatus} onChange={v => set('maritalStatus', v)} />
      </div>
      <div>
        <FieldLabel>City / Region</FieldLabel>
        <SelectInput placeholder="Select city tier…" value={data.cityTier} onChange={v => set('cityTier', v)} options={CITY_TIERS} />
      </div>
      <div>
        <FieldLabel>Highest Education</FieldLabel>
        <TextInput placeholder="e.g. B.E. Mechanical Engineering" value={data.education} onChange={v => set('education', v)} icon="🎓" />
      </div>
      <div>
        <FieldLabel>Occupation</FieldLabel>
        <TextInput placeholder="e.g. BPO Associate, Entrepreneur…" value={data.occupation} onChange={v => set('occupation', v)} icon="💼" />
      </div>
      <div>
        <FieldLabel>Monthly Income (approx.)</FieldLabel>
        <SelectInput placeholder="Select income range…" value={data.incomeBand} onChange={v => set('incomeBand', v)} options={INCOME_BANDS} />
      </div>
    </div>
  );
}

function Step3({ data, set, toggleGoal }: {
  data: FormData;
  set: (k: keyof FormData, v: string) => void;
  toggleGoal: (g: string) => void;
}) {
  const [contextFocused, setContextFocused] = useState(false);
  return (
    <div className="flex flex-col gap-6">
      <div>
        <FieldLabel>Your primary goals <span className="normal-case tracking-normal font-normal text-[var(--text-muted)]">(pick all that apply)</span></FieldLabel>
        <div className="flex flex-wrap gap-2.5 mt-1">
          {GOAL_OPTIONS.map(g => {
            const active = data.primaryGoals.includes(g.value);
            return (
              <button
                key={g.value} type="button"
                onClick={() => toggleGoal(g.value)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-[13px] font-semibold transition-all border-0 cursor-pointer"
                style={{
                  background: active ? 'var(--accent-subtle)' : 'var(--bg-card-2)',
                  color:      active ? 'var(--accent)' : 'var(--text-secondary)',
                  border:     `1.5px solid ${active ? 'var(--accent)' : 'var(--border-subtle)'}`,
                }}>
                <span>{g.icon}</span> {g.label}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <FieldLabel>What's going on in your life? <span className="normal-case tracking-normal font-normal text-[var(--text-muted)]">(optional)</span></FieldLabel>
        <textarea
          placeholder="Briefly describe your current situation, challenges, or anything Nadi should know to support you better…"
          value={data.keyContext}
          onChange={e => set('keyContext', e.target.value)}
          onFocus={() => setContextFocused(true)}
          onBlur={() => setContextFocused(false)}
          rows={3}
          className="w-full resize-none outline-none"
          style={{
            ...inputStyle(contextFocused, !!data.keyContext),
            lineHeight: 1.6,
            paddingTop: 14,
          }}
        />
      </div>

      <div>
        <FieldLabel>Privacy Preference</FieldLabel>
        <div className="flex flex-col gap-2.5 mt-1">
          {PRIVACY_LEVELS.map(p => {
            const active = data.privacySensitivity === p.value;
            return (
              <button
                key={p.value} type="button"
                onClick={() => set('privacySensitivity', p.value)}
                className="flex items-center gap-3 px-4 py-3.5 rounded-[14px] text-left transition-all border-0 cursor-pointer w-full"
                style={{
                  background: active ? 'var(--accent-subtle)' : 'var(--bg-card-2)',
                  border:     `1.5px solid ${active ? 'var(--accent)' : 'var(--border-subtle)'}`,
                }}>
                <span className="text-xl">{p.icon}</span>
                <div className="flex-1">
                  <div className="font-semibold text-[14px]" style={{ color: active ? 'var(--accent)' : 'var(--text-primary)' }}>
                    {p.label}
                  </div>
                  <div className="text-[12px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{p.desc}</div>
                </div>
                {active && (
                  <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: 'var(--accent)' }}>
                    <CheckIcon size={12} color="#000" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ─────────── Validation ─────────── */
function isStepValid(step: Step, data: FormData): boolean {
  if (step === 1) return !!(data.fullName.trim() && (data.email.trim() || data.phone.trim()) && data.age && data.gender);
  if (step === 2) return !!(data.maritalStatus && data.cityTier && data.education.trim() && data.occupation.trim() && data.incomeBand);
  if (step === 3) return !!(data.primaryGoals.length > 0 && data.privacySensitivity);
  return false;
}

const STEP_LABELS: Record<Step, { title: string; subtitle: string; emoji: string }> = {
  1: { title: 'About You',     subtitle: 'Basic identity & contact info',       emoji: '👤' },
  2: { title: 'Your Background', subtitle: 'Help Nadi personalise your journey', emoji: '🌏' },
  3: { title: 'Goals & Privacy', subtitle: 'What matters most to you',           emoji: '🎯' },
};

/* ─────────── Page ─────────── */
export default function SignupPage() {
  const router  = useRouter();
  const [step, setStep]   = useState<Step>(1);
  const [data, setData]   = useState<FormData>(INITIAL);
  const [loading, setLoading] = useState(false);

  const set = (k: keyof FormData, v: string) => setData(prev => ({ ...prev, [k]: v }));

  const toggleGoal = (g: string) =>
    setData(prev => ({
      ...prev,
      primaryGoals: prev.primaryGoals.includes(g)
        ? prev.primaryGoals.filter(x => x !== g)
        : [...prev.primaryGoals, g],
    }));

  const next = () => { if (step < 3) setStep((step + 1) as Step); };
  const back = () => { if (step > 1) setStep((step - 1) as Step); else router.back(); };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Signup failed');
      router.push('/verify');
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const valid = isStepValid(step, data);
  const pct   = Math.round((step / 3) * 100);
  const info  = STEP_LABELS[step];

  return (
    <div className="screen-scroll relative flex flex-col min-h-full overflow-hidden"
      style={{ background: 'var(--bg-primary)' }}>

      {/* Ambient glows */}
      <div className="absolute -top-24 -right-20 w-60 h-60 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, var(--accent-subtle) 0%, transparent 70%)' }} />
      <div className="absolute bottom-20 -left-24 w-72 h-72 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(59,158,255,0.04) 0%, transparent 70%)' }} />

      {/* ── Header ── */}
      <div className="relative flex items-center justify-between px-5 pt-5 pb-3">
        <button onClick={back}
          className="bg-transparent border-0 cursor-pointer p-1">
          <div className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: 'var(--bg-card-2)', border: '1px solid var(--border-subtle)' }}>
            <ArrowLeftIcon size={18} color="var(--text-secondary)" />
          </div>
        </button>
        <span className="text-[var(--text-muted)] font-semibold text-[12px] uppercase tracking-[0.1em]">
          Create Account
        </span>
        <span className="text-[var(--accent)] font-bold text-[13px]">{step}/3</span>
      </div>

      {/* ── Progress bar ── */}
      <div className="px-5 mb-5">
        <div className="h-[3px] rounded-full w-full" style={{ background: 'var(--border-subtle)' }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${pct}%`, background: 'linear-gradient(90deg, var(--accent-dim), var(--accent))' }}
          />
        </div>
        <div className="flex justify-between mt-2">
          {([1, 2, 3] as Step[]).map(s => (
            <div key={s} className="flex items-center gap-1">
              <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all"
                style={{
                  background: s < step ? 'var(--accent)' : s === step ? 'var(--accent-subtle)' : 'var(--bg-card-2)',
                  border:     `1.5px solid ${s <= step ? 'var(--accent)' : 'var(--border-subtle)'}`,
                  color:      s < step ? '#000' : s === step ? 'var(--accent)' : 'var(--text-muted)',
                }}>
                {s < step ? <CheckIcon size={10} color="#000" /> : s}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Step header ── */}
      <div className="px-5 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-[16px] flex items-center justify-center text-2xl"
            style={{ background: 'var(--accent-subtle)', border: '1px solid var(--border)', boxShadow: '0 4px 16px var(--accent-glow)' }}>
            {info.emoji}
          </div>
          <div>
            <h2 className="text-[22px] font-extrabold tracking-[-0.02em]"
              style={{ color: 'var(--text-primary)' }}>{info.title}</h2>
            <p className="text-[13px]" style={{ color: 'var(--text-muted)' }}>{info.subtitle}</p>
          </div>
        </div>
      </div>

      {/* ── Form content ── */}
      <div className="flex-1 overflow-y-auto px-5 pb-2">
        <div className="animate-fade-in">
          {step === 1 && <Step1 data={data} set={set} />}
          {step === 2 && <Step2 data={data} set={set} />}
          {step === 3 && <Step3 data={data} set={set} toggleGoal={toggleGoal} />}
        </div>
      </div>

      {/* ── Bottom CTA ── */}
      <div className="px-5 pt-4 pb-8 mt-auto"
        style={{ borderTop: '1px solid var(--border-subtle)', background: 'var(--bg-primary)' }}>
        {step < 3 ? (
          <button
            onClick={next}
            disabled={!valid}
            className="w-full rounded-2xl py-4 text-[15px] font-bold flex items-center justify-center gap-2 border-0 cursor-pointer transition-all"
            style={{
              background: valid ? 'linear-gradient(135deg, var(--accent-dim), var(--accent))' : 'var(--bg-card-3)',
              color:      valid ? '#fff' : 'var(--text-muted)',
              boxShadow:  valid ? '0 4px 20px var(--accent-glow)' : 'none',
              opacity:    valid ? 1 : 0.6,
              cursor:     valid ? 'pointer' : 'not-allowed',
            }}>
            Continue <ArrowRightIcon size={16} color={valid ? '#fff' : 'var(--text-muted)'} />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!valid || loading}
            className="w-full rounded-2xl py-4 text-[15px] font-bold flex items-center justify-center gap-2 border-0 transition-all"
            style={{
              background: valid ? 'linear-gradient(135deg, var(--accent-dim), var(--accent))' : 'var(--bg-card-3)',
              color:      valid ? '#fff' : 'var(--text-muted)',
              boxShadow:  valid ? '0 4px 20px var(--accent-glow)' : 'none',
              cursor:     valid ? 'pointer' : 'not-allowed',
              opacity:    loading ? 0.8 : 1,
            }}>
            {loading
              ? <><span className="animate-spin text-lg">◌</span> Creating your profile…</>
              : <><span>✦</span> Start my Wellness Journey</>}
          </button>
        )}

        {step === 1 && (
          <p className="text-[11px] text-center mt-3 leading-relaxed" style={{ color: 'var(--text-dim)' }}>
            Already have an account?{' '}
            <button onClick={() => router.push('/login')}
              className="bg-transparent border-0 p-0 cursor-pointer font-semibold"
              style={{ color: 'var(--accent)' }}>
              Sign in
            </button>
          </p>
        )}

        {step > 1 && (
          <p className="text-[11px] text-center mt-3" style={{ color: 'var(--text-dim)' }}>
            Step {step} of 3 — you&apos;re almost there ✦
          </p>
        )}
      </div>
    </div>
  );
}
