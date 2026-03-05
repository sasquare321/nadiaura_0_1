'use client';
import Link from 'next/link';
import BottomNav from '@/components/BottomNav';
import { ArrowLeftIcon, ArrowRightIcon, TrendUpIcon } from '@/components/Icons';

const DOMAINS = [
  { icon:'💪', label:'Physical Health',  href:'/physical',  score:78,  change:+5, color:'var(--physical)',  bars:[60,75,55,80,70,85,78], desc:'Good activity, sleep needs work' },
  { icon:'💚', label:'Emotional Health', href:'/emotional', score:91,  change:+8, color:'var(--emotional)', bars:[80,85,78,88,90,88,91], desc:'Excellent mood consistency' },
  { icon:'💰', label:'Financial Health', href:'/financial', score:65,  change:-3, color:'var(--financial)', bars:[70,72,68,65,60,63,65], desc:'Debt alert — review savings' },
];
const INSIGHTS = [
  { emoji:'😴', text:'Sleep quality dropped 12% — try reducing caffeine after 2pm' },
  { emoji:'💆', text:'Your calm mood streak is 4 days — a personal best!' },
  { emoji:'📉', text:'Weekend spending 40% above budget — review transactions' },
];
const DAYS = ['M','T','W','T','F','S','S'];
const OVERALL = [74,78,75,80,82,79,85];

export default function AnalyticsPage() {
  const score = 85;
  const maxBar = Math.max(...OVERALL);
  const circ = 2*Math.PI*46;
  const offset = circ - (score/100)*circ;

  return (
    <div className="flex flex-col h-full" style={{ background:'var(--bg-primary)' }}>
      <div className="screen-scroll flex-1 page-enter px-[18px] pt-5">

        {/* Header */}
        <div className="flex items-center justify-between mb-[22px]">
          <Link href="/home" className="no-underline">
            <div className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer"
              style={{ background:'var(--bg-card-2)', border:'1px solid var(--border-subtle)' }}>
              <ArrowLeftIcon size={18} color="var(--text-secondary)" />
            </div>
          </Link>
          <h1 className="text-lg font-extrabold text-[var(--text-primary)] tracking-[-0.01em]">Health Analytics</h1>
          <span className="text-[11px] font-bold py-[3px] px-2.5 rounded-full inline-flex items-center gap-1"
            style={{ background:'var(--gold-subtle)', color:'var(--gold)', border:'1px solid var(--border-gold)' }}>This Week</span>
        </div>

        {/* Overall Score Hero */}
        <div className="animate-fade-in gradient-card rounded-[22px] p-5 mb-[18px]"
          style={{ background:'linear-gradient(135deg,var(--bg-card) 0%,var(--bg-card-2) 100%)', border:'1px solid var(--border-subtle)' }}>
          <div className="absolute -right-5 -top-5 w-36 h-36 rounded-full pointer-events-none"
            style={{ background:'radial-gradient(circle,var(--accent-subtle) 0%,transparent 70%)' }} />

          <div className="flex items-center gap-5">
            {/* Score ring */}
            <div className="relative shrink-0">
              <svg width="108" height="108" viewBox="0 0 108 108">
                <circle cx="54" cy="54" r="46" fill="none" stroke="var(--accent-subtle)" strokeWidth="8" />
                <circle cx="54" cy="54" r="46" fill="none" stroke="var(--accent)" strokeWidth="8"
                  strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset}
                  className="circle-progress" />
              </svg>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                <div className="text-2xl font-black leading-none" style={{ color:'var(--accent)' }}>{score}</div>
                <div className="text-[8px] font-bold uppercase tracking-[0.08em] mt-0.5" style={{ color:'var(--text-muted)' }}>Overall</div>
              </div>
            </div>
            <div className="flex-1">
              <p className="text-xs mb-1" style={{ color:'var(--text-muted)' }}>Wellness Score</p>
              <p className="text-xl font-black tracking-[-0.02em] leading-snug mb-2.5" style={{ color:'var(--text-primary)' }}>
                Excellent<br/><span className="text-[15px]" style={{ color:'var(--accent)' }}>Health Rank 🏅</span>
              </p>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold py-[3px] px-2.5 rounded-full inline-flex items-center gap-1"
                  style={{ background:'var(--accent-subtle)', color:'var(--accent)', border:'1px solid var(--border)' }}>
                  <TrendUpIcon size={10} color="var(--accent)" /> +7 this week
                </span>
                <span className="text-[11px] font-bold py-[3px] px-2.5 rounded-full"
                  style={{ background:'var(--gold-subtle)', color:'var(--gold)', border:'1px solid var(--border-gold)' }}>Top 8%</span>
              </div>
            </div>
          </div>

          {/* 7-day chart */}
          <div className="mt-[18px]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.06em] mb-2.5" style={{ color:'var(--text-muted)' }}>7-Day Trend</p>
            <div className="flex items-end gap-1.5 h-[52px]">
              {OVERALL.map((s,i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full relative rounded-t-[4px] transition-all duration-500"
                    style={{ height:`${(s/maxBar)*42}px`, background:i===6?'var(--accent)':'var(--accent-subtle)', boxShadow:i===6?'0 0 8px var(--accent-glow)':'none' }}>
                    {i===6 && (
                      <div className="absolute -top-5 left-1/2 -translate-x-1/2 rounded-[4px] px-1 text-[9px] font-bold text-white whitespace-nowrap"
                        style={{ background:'var(--accent)' }}>{s}</div>
                    )}
                  </div>
                  <span className="text-[9px] font-semibold" style={{ color:'var(--text-dim)' }}>{DAYS[i]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Domain Cards */}
        <div className="mb-[18px]">
          <p className="text-[17px] font-bold tracking-[-0.01em] mb-3" style={{ color:'var(--text-primary)' }}>Health Domains</p>
          {DOMAINS.map((d,i) => {
            const r=28, c=2*Math.PI*r, off=c-(d.score/100)*c;
            return (
              <Link key={d.label} href={d.href} className="no-underline">
                <div className={`animate-fade-in delay-${i+1} rounded-[18px] px-4 py-[14px] mb-2.5 flex items-center gap-[14px] cursor-pointer transition-all hover:-translate-y-0.5`}
                  style={{ background:'var(--bg-card)', border:'1px solid var(--border-subtle)' }}>
                  <div className="relative shrink-0">
                    <svg width="68" height="68" viewBox="0 0 68 68">
                      <circle cx="34" cy="34" r={r} fill="none" stroke={`${d.color}25`} strokeWidth="6" />
                      <circle cx="34" cy="34" r={r} fill="none" stroke={d.color} strokeWidth="6"
                        strokeLinecap="round" strokeDasharray={c} strokeDashoffset={off}
                        className="circle-progress"  />
                    </svg>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-base">{d.icon}</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-sm text-[var(--text-primary)]">{d.label}</span>
                      <span className="text-xs font-bold" style={{ color:d.change>0?'var(--accent)':'var(--danger)' }}>
                        {d.change>0?'▲':'▼'} {Math.abs(d.change)}
                      </span>
                    </div>
                    <p className="text-xs mb-2" style={{ color:'var(--text-muted)' }}>{d.desc}</p>
                    <div className="flex items-end gap-[3px] h-[22px]">
                      {d.bars.map((h,j) => (
                        <div key={j} className="flex-1 rounded-t-[2px]"
                          style={{ height:`${(h/100)*20}px`, background:j===6?d.color:`${d.color}30` }} />
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className="text-[22px] font-black tracking-[-0.02em]" style={{ color:d.color }}>{d.score}</span>
                    <ArrowRightIcon size={16} color="var(--text-dim)" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* AI Insights */}
        <div className="mb-[18px]">
          <div className="flex justify-between items-center mb-3">
            <p className="text-[17px] font-bold tracking-[-0.01em]" style={{ color:'var(--text-primary)' }}>Nadi&apos;s Top Insights</p>
            <span className="text-[11px] font-bold py-[3px] px-2.5 rounded-full" style={{ background:'var(--accent-subtle)', color:'var(--accent)', border:'1px solid var(--border)' }}>✨ AI</span>
          </div>
          {INSIGHTS.map((ins,i) => (
            <div key={i} className="rounded-[14px] px-[14px] py-3 flex items-start gap-3 mb-2" style={{ background:'var(--bg-card)', border:'1px solid var(--border-subtle)' }}>
              <span className="text-xl leading-[1.4] shrink-0">{ins.emoji}</span>
              <p className="text-[var(--text-secondary)] text-[13px] leading-[1.55]">{ins.text}</p>
            </div>
          ))}
        </div>
        <div className="h-2" />
      </div>
      <BottomNav />
    </div>
  );
}
