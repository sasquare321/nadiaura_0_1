'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import BottomNav from '@/components/BottomNav';
import { useUser } from '@/lib/UserContext';
import { ArrowLeftIcon } from '@/components/Icons';

type Mood = 'happy'|'calm'|'angry'|'manic'|null;

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

const MOODS:{id:Mood;emoji:string;label:string}[] = [
  {id:'happy',emoji:'😊',label:'Happy'},{id:'calm',emoji:'😌',label:'Calm'},
  {id:'angry',emoji:'😤',label:'Stressed'},{id:'manic',emoji:'😰',label:'Anxious'},
];
const MOOD_COLOR:{[k:string]:string} = { happy:'#f5c842', calm:'var(--accent)', angry:'var(--danger)', manic:'var(--emotional)' };

const CAL_DAYS = [null,null,'calm','happy','calm','manic','happy','calm','calm','happy','happy','angry','calm','calm','happy','calm','calm','manic','happy','calm','happy','calm','calm','calm','happy',null,null,null];

export default function EmotionalPage() {
  const router = useRouter();
  const { user, loading: userLoading } = useUser();
  const [metrics, setMetrics] = useState<MetricData[]>([]);
  const [loading, setLoading] = useState(true);
  const [mood, setMood] = useState<Mood>(null);

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
            <h1 className="text-lg font-extrabold text-[var(--text-primary)]">Emotional Health</h1>
            <span className="text-[11px] font-bold py-[3px] px-2.5 rounded-full" style={{ background:'rgba(192,132,252,0.1)', color:'var(--emotional)', border:'1px solid rgba(192,132,252,0.2)' }}>…</span>
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
            <h1 className="text-lg font-extrabold text-[var(--text-primary)]">Emotional Health</h1>
            <span className="text-[11px] font-bold py-[3px] px-2.5 rounded-full" style={{ background:'rgba(192,132,252,0.1)', color:'var(--emotional)', border:'1px solid rgba(192,132,252,0.2)' }}>—</span>
          </div>
          <div className="text-center py-10" style={{ color:'var(--text-muted)' }}>No data available</div>
        </div>
        <BottomNav />
      </div>
    );
  }

  const moodScore = today.mood_score_1_10 || 5;
  const stressScore = today.stress_score_1_10 || 5;
  const energyScore = today.energy_score_1_10 || 5;

  // Emotional score: mood (60%) + inverse stress (40%)
  const emotionalScore = Math.round((moodScore / 10) * 60 + ((10 - stressScore) / 10) * 40);

  // Mood stability: variance across last 7 days
  const moodVariance = metrics.length > 1
    ? Math.sqrt(
        metrics.reduce((sum, m) => {
          const avg = metrics.reduce((a, b) => a + b.mood_score_1_10, 0) / metrics.length;
          return sum + Math.pow(m.mood_score_1_10 - avg, 2);
        }, 0) / metrics.length
      )
    : 0;
  const moodStability = Math.round(Math.max(0, Math.min(100, 100 - moodVariance * 20)));

  // Status based on emotional score
  let statusText = 'Good';
  let statusEmoji = '😊';
  if (emotionalScore > 80) {
    statusText = 'Thriving';
    statusEmoji = '😌';
  } else if (emotionalScore >= 60) {
    statusText = 'Balanced';
    statusEmoji = '😊';
  } else if (emotionalScore >= 40) {
    statusText = 'Recovering';
    statusEmoji = '😐';
  } else {
    statusText = 'Struggling';
    statusEmoji = '😔';
  }

  // Dynamic affirmations based on actual data
  const affirmations = [];

  if (emotionalScore > 75) {
    affirmations.push(`You've maintained ${emotionalScore}% emotional wellness this week 🌟`);
  }

  if (moodStability > 75) {
    affirmations.push(`Your mood consistency is ${moodStability}% — excellent balance!`);
  }

  if (stressScore < 4) {
    affirmations.push('You handled this week\'s challenges really well 💪');
  } else if (stressScore > 7) {
    affirmations.push('Remember: It\'s okay to rest and recharge. You\'re doing great 🌿');
  }

  if (affirmations.length === 0) {
    affirmations.push('Every day is a chance to grow and find balance 🌱');
    affirmations.push('You\'re taking steps toward better emotional health 💫');
  }

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
          <h1 className="text-lg font-extrabold text-[var(--text-primary)]">Emotional Health</h1>
          <span className="text-[11px] font-bold py-[3px] px-2.5 rounded-full" style={{ background:'rgba(192,132,252,0.1)', color:'var(--emotional)', border:'1px solid rgba(192,132,252,0.2)' }}>Score {emotionalScore}</span>
        </div>

        {/* Hero Card */}
        <div className="animate-fade-in gradient-card card-emotional rounded-[22px] p-5 mb-[18px] relative overflow-hidden"
          style={{ background:'linear-gradient(135deg,rgba(192,132,252,0.1) 0%,var(--bg-card) 70%)', border:'1px solid rgba(192,132,252,0.2)' }}>
          <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full pointer-events-none"
            style={{ background:'radial-gradient(circle,rgba(192,132,252,0.1) 0%,transparent 70%)' }} />
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs mb-1" style={{ color:'var(--text-muted)' }}>Emotional Wellbeing</p>
              <p className="text-[26px] font-black tracking-[-0.02em] leading-none mb-1" style={{ color:'var(--text-primary)' }}>{statusText}</p>
              <p className="text-[13px] font-semibold" style={{ color:'var(--emotional)' }}>
                {emotionalScore > 80 ? '💫 Peak mood consistency' : emotionalScore > 60 ? '🌿 Finding your balance' : '🌊 Building momentum'}
              </p>
            </div>
            <div className="text-center">
              <div className="text-[36px] leading-none mb-1">{statusEmoji}</div>
              <span className="text-[11px] font-bold py-[3px] px-2.5 rounded-full" style={{ background:'rgba(192,132,252,0.1)', color:'var(--emotional)', border:'1px solid rgba(192,132,252,0.2)' }}>{emotionalScore}/100</span>
            </div>
          </div>
          {[
            {label:'Energy Level',   value: Math.round(energyScore * 10), color:'var(--accent)',    inv:false},
            {label:'Stress Index',   value: Math.round(stressScore * 10), color:'var(--danger)',    inv:true },
            {label:'Mood Stability', value: moodStability, color:'var(--emotional)', inv:false},
          ].map((m,i) => (
            <div key={i} className={i<2?'mb-2.5':''}>
              <div className="flex justify-between mb-[5px]">
                <span className="text-[13px]" style={{ color:'var(--text-secondary)' }}>{m.label}</span>
                <span className="text-[13px] font-bold" style={{ color:m.inv?'var(--accent)':m.color }}>
                  {m.inv?`Low (${m.value})`:`${m.value}%`}
                </span>
              </div>
              <div className="h-[7px] rounded-full overflow-hidden" style={{ background:'rgba(255,255,255,0.06)' }}>
                <div className="h-full rounded-full transition-[width] duration-1000"
                  style={{ width:`${m.value}%`, background:m.inv?'linear-gradient(90deg,var(--accent),var(--accent-dim))':m.color }} />
              </div>
            </div>
          ))}
        </div>

        {/* Mood Selector */}
        <div className="animate-fade-in delay-1 rounded-[20px] p-[18px] mb-[18px]" style={{ background:'var(--bg-card)', border:'1px solid var(--border-subtle)' }}>
          <p className="font-bold text-[15px] text-[var(--text-primary)] mb-[14px]">How are you feeling right now?</p>
          <div className="flex gap-2">
            {MOODS.map(m => (
              <button key={m.id} className={`mood-btn ${mood===m.id?`active-${m.id}`:''}`} onClick={() => setMood(m.id)}>
                <span className="text-[26px]">{m.emoji}</span><span>{m.label}</span>
              </button>
            ))}
          </div>
          {mood && (
            <div className="mt-[14px] px-[14px] py-2.5 rounded-xl" style={{ background:'var(--bg-card-2)', border:`1px solid ${mood==='happy'?'#f5c84240':mood==='calm'?'var(--border)':mood==='angry'?'rgba(255,82,82,0.2)':'rgba(192,132,252,0.2)'}` }}>
              <p className="text-[var(--text-secondary)] text-[13px] leading-[1.5]">
                {mood==='happy'&&'✨ Wonderful! Harness this energy for creative tasks.'}
                {mood==='calm' &&'🌿 Perfect state for focus and deep work.'}
                {mood==='angry'&&'🌊 Take 3 deep breaths. Try the 4-7-8 breathing technique.'}
                {mood==='manic'&&'🧘 Ground yourself — try 5-minute mindfulness with Nadi.'}
              </p>
            </div>
          )}
        </div>

        {/* Mood Calendar */}
        <div className="animate-fade-in delay-2 rounded-[20px] p-[18px] mb-[18px]" style={{ background:'var(--bg-card)', border:'1px solid var(--border-subtle)' }}>
          <div className="flex justify-between items-center mb-[14px]">
            <p className="font-bold text-[15px] text-[var(--text-primary)]">March 2026</p>
            <div className="flex gap-2">
              {Object.entries(MOOD_COLOR).slice(0,3).map(([k,v]) => (
                <div key={k} className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full" style={{ background:v }} />
                  <span className="text-[9px] capitalize" style={{ color:'var(--text-muted)' }}>{k}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-7 gap-1 mb-1.5">
            {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => (
              <div key={d} className="text-center text-[10px] font-semibold py-0.5" style={{ color:'var(--text-muted)' }}>{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {CAL_DAYS.map((d,i) => (
              <div key={i} className={`cal-day ${!d?'empty':d}`}
                style={{ background:d?MOOD_COLOR[d]:'transparent', color:d?(d==='happy'?'#000':'#fff'):'transparent', fontSize:11, borderRadius:8 }}>
                {d?(i-(CAL_DAYS.findIndex(x=>x!==null))+1)||'':''}
              </div>
            ))}
          </div>
        </div>

        {/* Affirmations */}
        <div className="animate-fade-in delay-3 mb-[18px]">
          <p className="text-[17px] font-bold tracking-[-0.01em] mb-3 text-[var(--text-primary)]">Your Wins This Week</p>
          {affirmations.slice(0, 3).map((text,i) => (
            <div key={i} className="rounded-[14px] px-[14px] py-3 mb-2"
              style={{ background:`linear-gradient(135deg,${i===0?'rgba(245,200,66,0.06)':i===1?'var(--accent-subtle)':'rgba(192,132,252,0.06)'},var(--bg-card))`, border:'1px solid var(--border-subtle)' }}>
              <p className="text-[var(--text-secondary)] text-[13px] leading-[1.55]">{text}</p>
            </div>
          ))}
        </div>
        <div className="h-2" />
      </div>
      <BottomNav />
    </div>
  );
}
