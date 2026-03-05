'use client';
import { useState } from 'react';
import Link from 'next/link';
import BottomNav from '@/components/BottomNav';
import { ArrowLeftIcon } from '@/components/Icons';

type Mood = 'happy'|'calm'|'angry'|'manic'|null;
const MOODS:{id:Mood;emoji:string;label:string}[] = [
  {id:'happy',emoji:'😊',label:'Happy'},{id:'calm',emoji:'😌',label:'Calm'},
  {id:'angry',emoji:'😤',label:'Stressed'},{id:'manic',emoji:'😰',label:'Anxious'},
];
const CAL_DAYS = [null,null,'calm','happy','calm','manic','happy','calm','calm','happy','happy','angry','calm','calm','happy','calm','calm','manic','happy','calm','happy','calm','calm','calm','happy',null,null,null];
const MOOD_COLOR:{[k:string]:string} = { happy:'#f5c842', calm:'var(--accent)', angry:'var(--danger)', manic:'var(--emotional)' };
const AFFIRMATIONS = [
  "You've maintained 91% positive energy this week 🌟",
  "Your calm mood streak is 4 days — a new record!",
  "You handled Tuesday's stress really well 💪",
];

export default function EmotionalPage() {
  const [mood,setMood]=useState<Mood>('calm');

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
          <span className="text-[11px] font-bold py-[3px] px-2.5 rounded-full" style={{ background:'rgba(192,132,252,0.1)', color:'var(--emotional)', border:'1px solid rgba(192,132,252,0.2)' }}>Score 91</span>
        </div>

        {/* Hero Card */}
        <div className="animate-fade-in gradient-card card-emotional rounded-[22px] p-5 mb-[18px] relative overflow-hidden"
          style={{ background:'linear-gradient(135deg,rgba(192,132,252,0.1) 0%,var(--bg-card) 70%)', border:'1px solid rgba(192,132,252,0.2)' }}>
          <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full pointer-events-none"
            style={{ background:'radial-gradient(circle,rgba(192,132,252,0.1) 0%,transparent 70%)' }} />
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs mb-1" style={{ color:'var(--text-muted)' }}>Emotional Wellbeing</p>
              <p className="text-[26px] font-black tracking-[-0.02em] leading-none mb-1" style={{ color:'var(--text-primary)' }}>Thriving</p>
              <p className="text-[13px] font-semibold" style={{ color:'var(--emotional)' }}>💫 Peak mood consistency</p>
            </div>
            <div className="text-center">
              <div className="text-[36px] leading-none mb-1">😌</div>
              <span className="text-[11px] font-bold py-[3px] px-2.5 rounded-full" style={{ background:'rgba(192,132,252,0.1)', color:'var(--emotional)', border:'1px solid rgba(192,132,252,0.2)' }}>91/100</span>
            </div>
          </div>
          {[
            {label:'Energy Level',   value:78, color:'var(--accent)',    inv:false},
            {label:'Stress Index',   value:24, color:'var(--danger)',    inv:true },
            {label:'Mood Stability', value:91, color:'var(--emotional)', inv:false},
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
          {AFFIRMATIONS.map((text,i) => (
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
