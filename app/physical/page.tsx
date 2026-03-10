'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import BottomNav from '@/components/BottomNav';
import { useUser } from '@/lib/UserContext';
import { ArrowLeftIcon, HeartIcon, MoonIcon, DropletIcon, StepsIcon } from '@/components/Icons';

interface MetricData {
  date: string;
  sleep_hours: number;
  sleep_quality: number;
  steps: number;
  resting_hr: number;
  hrv_ms: number;
  mood_score_1_10: number;
  stress_score_1_10: number;
  energy_score_1_10: number;
  loneliness_score_1_10: number;
  alcohol_units: number;
  cigarettes: number;
  screen_time_hours: number;
}

const MACROS = [
  { label:'Protein', value:72,  goal:80,  color:'var(--physical)',  unit:'g' },
  { label:'Carbs',   value:148, goal:200, color:'var(--accent)',    unit:'g' },
  { label:'Fat',     value:38,  goal:65,  color:'var(--financial)', unit:'g' },
  { label:'Fiber',   value:18,  goal:30,  color:'var(--emotional)', unit:'g' },
];
const TIPS = [
  { emoji:'🚶', text:'Add a 20-min walk after dinner to hit your step goal' },
  { emoji:'😴', text:'Set a consistent sleep schedule — aim for 7.5 hours' },
  { emoji:'💧', text:'Drink 2 glasses of water before each meal' },
];

export default function PhysicalPage() {
  const router = useRouter();
  const { user, loading: userLoading } = useUser();
  const [metrics, setMetrics] = useState<MetricData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userLoading) return;

    if (!user) {
      router.push('/login');
      return;
    }

    const fetchMetrics = async () => {
      try {
        const response = await fetch(`/api/metrics?user_id=${user.user_id}&days=7`);
        if (!response.ok) throw new Error('Failed to fetch metrics');
        const data = await response.json();
        setMetrics(data);
      } catch (error) {
        console.error('Error fetching metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [user, userLoading, router]);

  if (userLoading || loading) {
    return (
      <div className="flex flex-col h-full" style={{ background:'var(--bg-primary)' }}>
        <div className="screen-scroll flex-1 page-enter px-[18px] pt-5">
          <div className="flex items-center justify-between mb-5">
            <Link href="/analytics" className="no-underline">
              <div className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer" style={{ background:'var(--bg-card-2)', border:'1px solid var(--border-subtle)' }}>
                <ArrowLeftIcon size={18} color="var(--text-secondary)" />
              </div>
            </Link>
            <h1 className="text-lg font-extrabold text-[var(--text-primary)]">Physical Health</h1>
            <span className="text-[11px] font-bold py-[3px] px-2.5 rounded-full" style={{ background:'rgba(59,158,255,0.1)', color:'var(--physical)', border:'1px solid rgba(59,158,255,0.2)' }}>…</span>
          </div>
          <div className="text-center py-10" style={{ color:'var(--text-muted)' }}>Loading metrics…</div>
        </div>
        <BottomNav />
      </div>
    );
  }

  const today = metrics[0];
  if (!today) {
    return (
      <div className="flex flex-col h-full" style={{ background:'var(--bg-primary)' }}>
        <div className="screen-scroll flex-1 page-enter px-[18px] pt-5">
          <div className="flex items-center justify-between mb-5">
            <Link href="/analytics" className="no-underline">
              <div className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer" style={{ background:'var(--bg-card-2)', border:'1px solid var(--border-subtle)' }}>
                <ArrowLeftIcon size={18} color="var(--text-secondary)" />
              </div>
            </Link>
            <h1 className="text-lg font-extrabold text-[var(--text-primary)]">Physical Health</h1>
            <span className="text-[11px] font-bold py-[3px] px-2.5 rounded-full" style={{ background:'rgba(59,158,255,0.1)', color:'var(--physical)', border:'1px solid rgba(59,158,255,0.2)' }}>—</span>
          </div>
          <div className="text-center py-10" style={{ color:'var(--text-muted)' }}>No data available</div>
        </div>
        <BottomNav />
      </div>
    );
  }

  const steps = today.steps || 0;
  const restingHR = today.resting_hr || 0;
  const sleepHours = today.sleep_hours || 0;
  const hrv = today.hrv_ms || 0;

  const goalPct = Math.round((steps / 10000) * 100);
  const physicalScore = Math.round(Math.min(100, (steps/10000)*40 + (sleepHours/8)*30 + 30));

  const circ = 2 * Math.PI * 52;
  const offset = circ - (goalPct / 100) * circ;

  const stepsRemaining = Math.max(0, 10000 - steps);
  const sleepOk = sleepHours >= 7;

  const stats = [
    {
      icon: <HeartIcon size={18} color="var(--danger)" />,
      label: 'Heart Rate',
      value: restingHR ? Math.round(restingHR).toString() : '—',
      unit: 'bpm',
      change: restingHR > 0 ? (restingHR < 70 ? '↓ Normal' : '→ Regular') : '—',
      ok: restingHR > 0 && restingHR < 80,
      bg: 'rgba(255,82,82,0.08)'
    },
    {
      icon: <MoonIcon size={18} color="var(--physical)" />,
      label: 'Sleep',
      value: sleepHours ? sleepHours.toFixed(1) : '—',
      unit: 'hrs',
      change: sleepHours > 0 ? (sleepOk ? '✓ Good' : '↓ Low') : '—',
      ok: sleepOk,
      bg: 'rgba(59,158,255,0.08)'
    },
    {
      icon: <DropletIcon size={18} color="var(--accent)" />,
      label: 'SpO2',
      value: '98',
      unit: '%',
      change: '✓ Great',
      ok: true,
      bg: 'var(--accent-subtle)'
    },
    {
      icon: <StepsIcon size={18} color="var(--financial)" />,
      label: 'Steps',
      value: steps ? steps.toLocaleString() : '—',
      unit: 'today',
      change: steps > 0 ? (steps >= 10000 ? '✓ Goal' : '↑ Keep going') : '—',
      ok: steps >= 10000,
      bg: 'rgba(251,146,60,0.08)'
    },
  ];

  // Weekly activity - last 7 days
  const weeklySteps = metrics.slice(0, 7).reverse().map(m => m.steps || 0);
  const maxSteps = Math.max(...weeklySteps, 10000);
  const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const avgSteps = Math.round(weeklySteps.reduce((a, b) => a + b, 0) / weeklySteps.length);
  const weeklyChange = weeklySteps.length > 1
    ? Math.round(((weeklySteps[weeklySteps.length - 1] - weeklySteps[0]) / weeklySteps[0]) * 100)
    : 0;

  return (
    <div className="flex flex-col h-full" style={{ background:'var(--bg-primary)' }}>
      <div className="screen-scroll flex-1 page-enter px-[18px] pt-5">

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <Link href="/analytics" className="no-underline">
            <div className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer" style={{ background:'var(--bg-card-2)', border:'1px solid var(--border-subtle)' }}>
              <ArrowLeftIcon size={18} color="var(--text-secondary)" />
            </div>
          </Link>
          <h1 className="text-lg font-extrabold text-[var(--text-primary)]">Physical Health</h1>
          <span className="text-[11px] font-bold py-[3px] px-2.5 rounded-full" style={{ background:'rgba(59,158,255,0.1)', color:'var(--physical)', border:'1px solid rgba(59,158,255,0.2)' }}>Score {physicalScore}</span>
        </div>

        {/* Goal Ring Hero */}
        <div className="animate-fade-in rounded-[22px] p-5 mb-[18px] flex items-center gap-5"
          style={{ background:'linear-gradient(135deg,rgba(59,158,255,0.08) 0%,var(--bg-card) 60%)', border:'1px solid rgba(59,158,255,0.15)' }}>
          <div className="relative shrink-0">
            <svg width="120" height="120" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(59,158,255,0.12)" strokeWidth="10" />
              <circle cx="60" cy="60" r="52" fill="none" stroke="var(--physical)" strokeWidth="10"
                strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset}
                className="circle-progress"  />
            </svg>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
              <div className="text-[22px] font-black leading-none" style={{ color:'var(--physical)' }}>{goalPct}%</div>
              <div className="text-[9px] font-bold uppercase tracking-[0.05em] mt-0.5" style={{ color:'var(--text-muted)' }}>Daily Goal</div>
            </div>
          </div>
          <div>
            <p className="text-xs mb-1" style={{ color:'var(--text-muted)' }}>Steps Today</p>
            <p className="font-black text-[28px] tracking-[-0.02em] leading-none mb-1" style={{ color:'var(--physical)' }}>{steps ? steps.toLocaleString() : '—'}</p>
            <p className="text-xs mb-3" style={{ color:'var(--text-muted)' }}>Goal: 10,000 steps</p>
            <div className="w-[120px] h-[6px] rounded-full overflow-hidden mb-1" style={{ background:'rgba(255,255,255,0.06)' }}>
              <div className="h-full rounded-full transition-[width] duration-1000" style={{ width:`${goalPct}%`, background:'var(--physical)' }} />
            </div>
            <p className="text-[11px]" style={{ color:'var(--text-dim)' }}>{stepsRemaining > 0 ? stepsRemaining.toLocaleString() : '✓ Goal met'} {stepsRemaining > 0 ? 'steps to go' : ''}</p>
          </div>
        </div>

        {/* Stat Grid */}
        <div className="animate-fade-in delay-1 grid grid-cols-2 gap-2.5 mb-[18px]">
          {stats.map((s,i) => (
            <div key={i} className="rounded-[18px] p-[14px] border transition-all hover:-translate-y-0.5" style={{ background:'var(--bg-card)', borderColor:'var(--border-subtle)' }}>
              <div className="w-[36px] h-[36px] rounded-[10px] flex items-center justify-center mb-2.5" style={{ background:s.bg }}>{s.icon}</div>
              <div className="text-[22px] font-black tracking-[-0.02em] leading-none text-[var(--text-primary)]">
                {s.value}<span className="text-xs font-medium ml-0.5" style={{ color:'var(--text-muted)' }}>{s.unit}</span>
              </div>
              <div className="text-[11px] font-medium uppercase tracking-[0.04em] mt-0.5" style={{ color:'var(--text-muted)' }}>{s.label}</div>
              <div className="text-[11px] font-semibold mt-1.5" style={{ color:s.ok?'var(--accent)':'var(--danger)' }}>{s.change}</div>
            </div>
          ))}
        </div>

        {/* Weekly Activity */}
        <div className="animate-fade-in delay-2 rounded-[20px] p-[18px] mb-[18px]" style={{ background:'var(--bg-card)', border:'1px solid var(--border-subtle)' }}>
          <div className="flex justify-between items-center mb-[14px]">
            <p className="font-bold text-[15px] text-[var(--text-primary)]">Weekly Activity</p>
            <span className="text-[11px] font-bold py-[3px] px-2.5 rounded-full" style={{ background:'rgba(59,158,255,0.1)', color:'var(--physical)', border:'1px solid rgba(59,158,255,0.2)' }}>{weeklyChange > 0 ? '+' : ''}{weeklyChange}%</span>
          </div>
          <div className="flex items-end gap-2 h-[72px]">
            {weeklySteps.map((steps,i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                <div className="w-full rounded-t-[5px] transition-[height] duration-700"
                  style={{ height:`${(steps/maxSteps)*60}px`, background:i===6?'var(--physical)':'rgba(59,158,255,0.2)', boxShadow:i===6?'0 0 10px var(--physical-glow)':'none' }} />
                <span className="text-[10px] font-semibold" style={{ color:'var(--text-dim)' }}>{weekDays[i]}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-3">
            <span className="text-xs" style={{ color:'var(--text-muted)' }}>Avg: {avgSteps.toLocaleString()} steps/day</span>
            <span className="text-xs font-semibold" style={{ color:'var(--physical)' }}>Goal: 10,000 steps</span>
          </div>
        </div>

        {/* Nutrition */}
        <div className="animate-fade-in delay-3 rounded-[20px] p-[18px] mb-[18px]" style={{ background:'var(--bg-card)', border:'1px solid var(--border-subtle)' }}>
          <div className="flex justify-between items-center mb-[14px]">
            <p className="font-bold text-[15px] text-[var(--text-primary)]">Today&apos;s Nutrition</p>
            <Link href="/food-scanner" className="no-underline text-xs font-semibold" style={{ color:'var(--accent)' }}>+ Log Meal</Link>
          </div>
          {MACROS.map((m,i) => (
            <div key={i} className={i<MACROS.length-1?'mb-3':''}>
              <div className="flex justify-between mb-[5px]">
                <span className="text-[13px] font-medium" style={{ color:'var(--text-secondary)' }}>{m.label}</span>
                <span className="text-[13px] font-bold text-[var(--text-primary)]">
                  {m.value}<span className="font-normal" style={{ color:'var(--text-muted)' }}>/{m.goal}{m.unit}</span>
                </span>
              </div>
              <div className="h-[7px] rounded-full overflow-hidden" style={{ background:'rgba(255,255,255,0.06)' }}>
                <div className="h-full rounded-full transition-[width] duration-1000" style={{ width:`${Math.min((m.value/m.goal)*100,100)}%`, background:m.color }} />
              </div>
            </div>
          ))}
        </div>

        {/* Tips */}
        <div className="animate-fade-in delay-4 mb-[18px]">
          <p className="text-[17px] font-bold tracking-[-0.01em] mb-3 text-[var(--text-primary)]">Recommendations</p>
          {TIPS.map((t,i) => (
            <div key={i} className="rounded-[14px] px-[14px] py-3 flex items-center gap-3 mb-2" style={{ background:'var(--bg-card)', border:'1px solid var(--border-subtle)' }}>
              <span className="text-[22px]">{t.emoji}</span>
              <p className="text-[var(--text-secondary)] text-[13px] leading-[1.5]">{t.text}</p>
            </div>
          ))}
        </div>
        <div className="h-2" />
      </div>
      <BottomNav />
    </div>
  );
}
