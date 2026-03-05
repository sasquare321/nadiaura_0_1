'use client';
import { useState } from 'react';
import Link from 'next/link';
import BottomNav from '@/components/BottomNav';
import { BellIcon, FlameIcon, CheckIcon, ArrowRightIcon } from '@/components/Icons';
import { ThemeToggle } from '@/components/ThemeProvider';

const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const QUESTS = [
  { id:1, icon:'🍳', title:'Log Breakfast',  subtitle:'High protein recommended', xp:20, done:false, cat:'physical'  },
  { id:2, icon:'🧘', title:'5-min Breathing', subtitle:'Mindful session',          xp:15, done:true,  cat:'emotional' },
  { id:3, icon:'💧', title:'Hydration Goal',  subtitle:'3 / 8 glasses logged',     xp:10, done:false, cat:'physical'  },
  { id:4, icon:'📊', title:'Review Budget',   subtitle:'Weekly check-in',          xp:25, done:false, cat:'financial' },
];
const DOMAINS = [
  { icon:'💪', label:'Physical',  href:'/physical',  color:'var(--physical)',  glow:'var(--physical-glow)',  score:78 },
  { icon:'💚', label:'Emotional', href:'/emotional', color:'var(--emotional)', glow:'var(--emotional-glow)', score:91 },
  { icon:'💰', label:'Financial', href:'/financial', color:'var(--financial)', glow:'var(--financial-glow)', score:65 },
];

export default function HomePage() {
  const [tasks, setTasks] = useState(QUESTS);
  const score = 85;
  const xpProgress = 72;
  const circ = 2 * Math.PI * 52;
  const offset = circ - (score / 100) * circ;
  const done = tasks.filter(t => t.done).length;
  const toggle = (id: number) => setTasks(p => p.map(t => t.id === id ? { ...t, done: !t.done } : t));

  return (
    <div className="flex flex-col h-full" style={{ background: 'var(--bg-primary)' }}>
      <div className="screen-scroll flex-1 page-enter px-[18px] pt-5">

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <Link href="/settings">
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-[22px] shrink-0"
                style={{ background:'linear-gradient(135deg,var(--accent-dark),var(--bg-card))', border:'2px solid var(--accent)', boxShadow:'0 0 12px var(--accent-glow)' }}>🐼</div>
            </Link>  
            <div>
              <p className="text-[var(--text-muted)] text-xs font-medium">Good morning,</p>
              <p className="text-[var(--text-primary)] font-extrabold text-lg tracking-[-0.01em]">Square ✨</p>
            </div>
          </div>
          <div className="flex gap-2">
            <ThemeToggle />
            <Link href="/alerts">
              <div className="relative w-10 h-10 rounded-full flex items-center justify-center cursor-pointer" style={{ background:'var(--bg-card-2)', border:'1px solid var(--border-subtle)' }}>
                <BellIcon size={18} color="var(--text-secondary)" />
                <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ background:'var(--danger)', border:'1.5px solid var(--bg-primary)' }} />
              </div>
            </Link>
          </div>
        </div>

        {/* XP Level Bar */}
        <div className="animate-fade-in flex items-center gap-3 rounded-2xl p-3 px-4 mb-[18px]"
          style={{ background:'var(--bg-card)', border:'1px solid var(--border-subtle)' }}>
          <div className="inline-flex items-center gap-[5px] rounded-full py-1 px-2.5 text-[11px] font-bold tracking-[0.03em] shrink-0"
            style={{ background:'linear-gradient(135deg,var(--gold-dark),rgba(245,200,66,0.15))', border:'1px solid var(--border-gold)', color:'var(--gold)' }}>
            <span>⚡</span> LV 12
          </div>
          <div className="flex-1">
            <div className="flex justify-between mb-[5px]">
              <span className="text-[var(--text-secondary)] text-xs font-semibold">Experience Points</span>
              <span className="text-[var(--gold)] text-xs font-bold">360 / 500 XP</span>
            </div>
            <div className="xp-track"><div className="xp-fill" style={{ width:`${xpProgress}%` }} /></div>
          </div>
          <div className="w-[34px] h-[34px] rounded-full flex items-center justify-center text-lg shrink-0"
            style={{ background:'var(--gold-subtle)', border:'1px solid var(--border-gold)' }}>🏆</div>
        </div>

        {/* Wellness Score Ring */}
        <div className="animate-fade-in delay-1 rounded-[22px] p-[18px] mb-[18px]"
          style={{ background:'var(--bg-card)', border:'1px solid var(--border-subtle)' }}>
          <div className="flex items-center  gap-4">
            <div className="relative   mt-5-6 shrink-0">
              <svg width="120" height="120" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="52" fill="none" stroke="var(--accent-subtle)" strokeWidth="9" />
                <circle cx="60" cy="60" r="52" fill="none" stroke="var(--accent)" strokeWidth="9"
                  strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset}
                  className="circle-progress " />
              </svg>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                <div className="text-[26px] font-black leading-none tracking-[-0.02em]" style={{ color:'var(--accent)' }}>{score}</div>
                <div className="text-[9px] font-bold uppercase tracking-[0.06em] mt-0.5" style={{ color:'var(--text-muted)' }}>Score</div>
              </div>
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center h-7 mb-2">
                <span className="text-[var(--text-primary)] absolute left-5 top-3 font-bold text-base tracking-[-0.01em]">Wellness Score</span>
                <span className="text-[11px] font-bold py-[3px] absolute right-5 text-nowrap px-2.5 rounded-full" style={{ background:'var(--accent-subtle)', color:'var(--accent)', border:'1px solid var(--border)' }}>↑ 3pts</span>
              </div>
              <p className="text-[var(--text-muted)] text-xs mb-3.5 leading-snug">You&apos;re thriving! Emotional health at peak.</p>
              {DOMAINS.map(d => (
                <div key={d.label} className="flex items-center gap-2 mb-1.5">
                  <span className="text-[12px] w-[68px] font-medium" style={{ color:'var(--text-secondary)' }}>{d.icon} {d.label}</span>
                  <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background:'rgba(255,255,255,0.06)' }}>
                    <div className="h-full rounded-full transition-[width] duration-1000"
                      style={{ width:`${d.score}%`, background:d.color, boxShadow:`0 0 6px ${d.glow}` }} />
                  </div>
                  <span className="text-[11px] font-bold w-[26px] text-right" style={{ color:d.color }}>{d.score}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Streak Card */}
        <div className="animate-fade-in delay-2 rounded-[20px] px-4 py-[14px] mb-[18px]"
          style={{ background:'var(--bg-card)', border:'1px solid var(--border-subtle)' }}>
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <FlameIcon size={20} color="var(--warning)" />
              <span className="text-[var(--text-primary)] font-bold text-[15px]">Weekly Streak</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[13px]">🔥</span>
              <span className="font-extrabold text-base" style={{ color:'var(--gold)' }}>12</span>
              <span className="text-[var(--text-muted)] text-xs">days</span>
            </div>
          </div>
          <div className="flex gap-1.5">
            {DAYS.map((_, i) => (
              <div key={i} className={`flex-1 h-8 rounded-lg flex items-center justify-center text-[9px] font-bold transition-all ${
                i < 4 ? 'streak-active text-white' : i === 4 ? 'streak-today text-white' : ''
              }`} style={i >= 5 ? { background:'var(--bg-card-2)', color:'var(--text-muted)', border:'1px solid var(--border-subtle)' } : {}}>
                {i < 4 ? '✓' : i === 4 ? '★' : DAYS[i].charAt(0)}
              </div>
            ))}
          </div>
          <p className="text-[var(--text-muted)] text-xs mt-2.5 text-center">🏅 Top 5% of members this week — keep it up!</p>
        </div>

        {/* Daily AI Insight */}
        <div className="animate-fade-in delay-3 rounded-[20px] p-4 mb-[18px] flex items-start gap-[14px]"
          style={{ background:'linear-gradient(135deg,rgba(0,214,143,0.08) 0%,rgba(59,158,255,0.06) 100%)', border:'1px solid var(--border)' }}>
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0"
            style={{ background:'var(--accent-subtle)', border:'1px solid var(--border)' }}>🧠</div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="font-bold text-sm" style={{ color:'var(--accent)' }}>Nadi&apos;s Insight</span>
              <span className="text-[10px] font-bold py-[3px] px-2 rounded-full" style={{ background:'var(--accent-subtle)', color:'var(--accent)', border:'1px solid var(--border)' }}>Daily</span>
            </div>
            <p className="text-[var(--text-secondary)] text-[13px] leading-[1.55]">
              Your sleep score dropped 12% — try a 5-minute breathing exercise before bed to restore your HRV.
            </p>
          </div>
        </div>

        {/* Daily Quests */}
        <div className="animate-fade-in delay-4 mb-[18px]">
          <div className="flex justify-between items-center mb-3">
            <p className="text-[17px] font-bold text-[var(--text-primary)] tracking-[-0.01em]">Daily Quests</p>
            <div className="flex items-center gap-2">
              <span className="text-[var(--text-muted)] text-xs">{done}/{tasks.length} done</span>
              <div className="w-[52px] h-[5px] rounded-full overflow-hidden" style={{ background:'var(--bg-card-3)' }}>
                <div className="h-full rounded-full transition-[width] duration-500" style={{ width:`${(done/tasks.length)*100}%`, background:'var(--accent)' }} />
              </div>
            </div>
          </div>
          {tasks.map((task, i) => (
            <div key={task.id} onClick={() => toggle(task.id)}
              className={`quest-stripe rounded-2xl flex items-center gap-3 mb-2 cursor-pointer ${task.done?'completed':''} animate-fade-in delay-${i+1}`}
              style={{ background:'var(--bg-card)', border:'1px solid var(--border-subtle)', padding:'12px 14px', opacity: task.done ? 0.6 : 1 }}>
              <div style={{
                position:'absolute', left:0, top:0, bottom:0, width:3, borderRadius:'3px 0 0 3px',
                background: task.cat==='physical'?'var(--physical)':task.cat==='emotional'?'var(--emotional)':'var(--financial)',
              }} />
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0" style={{ background:'var(--bg-card-2)' }}>{task.icon}</div>
              <div className="flex-1 min-w-0">
                <p className="text-[var(--text-primary)] font-semibold text-sm mb-0.5" style={{ textDecoration:task.done?'line-through':'none' }}>{task.title}</p>
                <p className="text-[var(--text-muted)] text-xs">{task.subtitle}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[11px] font-bold" style={{ color:'var(--gold)' }}>+{task.xp} XP</span>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${task.done?'quest-check-done':''}`}
                  style={{ borderColor: task.done ? 'transparent' : 'var(--border)' }}>
                  {task.done && <CheckIcon size={12} color="#fff" />}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Domain Access */}
        <div className="mb-[18px]">
          <div className="flex justify-between items-center mb-3">
            <p className="text-[17px] font-bold text-[var(--text-primary)] tracking-[-0.01em]">Health Domains</p>
            <Link href="/analytics" className="flex items-center gap-1 no-underline text-xs font-semibold" style={{ color:'var(--accent)' }}>
              View All <ArrowRightIcon size={14} color="var(--accent)" />
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-2.5">
            {DOMAINS.map(d => (
              <Link key={d.label} href={d.href} className="no-underline">
                <div className="rounded-[20px] text-center py-[18px] px-2.5 cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-lg"
                  style={{ background:'var(--bg-card)', border:'1px solid var(--border-subtle)' }}>
                  <div className="w-12 h-12 rounded-2xl mx-auto mb-2.5 flex items-center justify-center text-2xl"
                    style={{ background:d.glow, border:`1px solid ${d.color}30`, boxShadow:`0 4px 12px ${d.glow}` }}>{d.icon}</div>
                  <p className="text-xs font-semibold mb-1" style={{ color:'var(--text-secondary)' }}>{d.label}</p>
                  <p className="text-lg font-extrabold" style={{ color:d.color }}>{d.score}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
        <div className="h-2" />
      </div>
      <BottomNav />
    </div>
  );
}
