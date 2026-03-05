'use client';
import Link from 'next/link';
import BottomNav from '@/components/BottomNav';
import { ArrowLeftIcon } from '@/components/Icons';

const NUTRIENTS = [
  { label: 'Protein', value: 22, max: 80, color: 'var(--physical)', emoji: '💪', unit: 'g' },
  { label: 'Carbs', value: 68, max: 200, color: 'var(--accent)', emoji: '⚡', unit: 'g' },
  { label: 'Fat', value: 18, max: 65, color: 'var(--financial)', emoji: '🫀', unit: 'g' },
  { label: 'Fiber', value: 8, max: 30, color: 'var(--emotional)', emoji: '🌿', unit: 'g' },
];

const VITAMINS = [
  { label: 'Vitamin C', pct: 42, color: 'var(--physical)' },
  { label: 'Iron', pct: 18, color: 'var(--danger)' },
  { label: 'Calcium', pct: 15, color: 'var(--accent)' },
  { label: 'Vitamin A', pct: 35, color: 'var(--financial)' },
];

export default function FoodAnalysisPage() {
  const kcal = 542;
  const kcalGoal = 600;
  const kcalPct = Math.round((kcal / kcalGoal) * 100);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg-primary)' }}>
      <div className="screen-scroll page-enter" style={{ flex: 1, padding: '20px 18px 0' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <Link href="/food-scanner" style={{ textDecoration: 'none' }}>
            <div className="btn-icon"><ArrowLeftIcon size={18} color="var(--text-secondary)" /></div>
          </Link>
          <h1 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)' }}>Food Analysis</h1>
          <span className="badge green">✓ Scanned</span>
        </div>

        {/* Food card */}
        <div className="animate-fade-in" style={{
          background: 'linear-gradient(135deg, rgba(0,214,143,0.08) 0%, var(--bg-card) 70%)',
          borderRadius: 22, padding: 20,
          border: '1px solid var(--border)',
          marginBottom: 18,
          display: 'flex', alignItems: 'center', gap: 16,
        }}>
          {/* Food emoji display */}
          <div style={{
            width: 88, height: 88, borderRadius: 20,
            background: 'var(--bg-card-2)',
            border: '1px solid var(--border-subtle)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 50, flexShrink: 0,
          }}>🥗</div>

          <div style={{ flex: 1 }}>
            <p style={{ color: 'var(--text-muted)', fontSize: 12, marginBottom: 2 }}>Identified Food</p>
            <p style={{ color: 'var(--text-primary)', fontSize: 20, fontWeight: 800, letterSpacing: '-0.01em', marginBottom: 4 }}>
              Garden Salad
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: 12, marginBottom: 10 }}>~1 serving (320g)</p>
            <div style={{ display: 'flex', gap: 6 }}>
              <span className="badge green">Healthy ✓</span>
              <span className="badge blue">Low GI</span>
            </div>
          </div>
        </div>

        {/* Calorie ring */}
        <div className="animate-fade-in delay-1" style={{
          background: 'var(--bg-card)',
          borderRadius: 22, padding: 18,
          border: '1px solid var(--border-subtle)',
          marginBottom: 18,
          display: 'flex', alignItems: 'center', gap: 20,
        }}>
          {(() => {
            const r = 44;
            const circ = 2 * Math.PI * r;
            const offset = circ - (kcalPct / 100) * circ;
            return (
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <svg width="104" height="104" viewBox="0 0 104 104">
                  <circle cx="52" cy="52" r={r} fill="none" stroke="var(--accent-subtle)" strokeWidth="8" />
                  <circle cx="52" cy="52" r={r} fill="none"
                    stroke="var(--accent)" strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={circ} strokeDashoffset={offset}
                    className="circle-progress"
                  />
                </svg>
                <div style={{
                  position: 'absolute', top: '50%', left: '50%',
                  transform: 'translate(-50%,-50%)', textAlign: 'center',
                }}>
                  <div style={{ fontSize: 20, fontWeight: 900, color: 'var(--accent)', lineHeight: 1 }}>{kcal}</div>
                  <div style={{ fontSize: 8, color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>kcal</div>
                </div>
              </div>
            );
          })()}

          <div style={{ flex: 1 }}>
            <p style={{ color: 'var(--text-muted)', fontSize: 12, marginBottom: 6 }}>Meal Calories</p>
            <p style={{ color: 'var(--text-primary)', fontSize: 26, fontWeight: 900, letterSpacing: '-0.02em', lineHeight: 1 }}>{kcal} kcal</p>
            <p style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 4 }}>of {kcalGoal} kcal meal goal</p>
            <div style={{ marginTop: 10 }}>
              <div className="progress-track" style={{ height: 5 }}>
                <div className="progress-fill accent" style={{ width: `${kcalPct}%` }} />
              </div>
              <p style={{ color: 'var(--accent)', fontSize: 11, fontWeight: 600, marginTop: 4 }}>{kcalGoal - kcal} kcal under goal 👍</p>
            </div>
          </div>
        </div>

        {/* Macro Grid */}
        <div className="animate-fade-in delay-2" style={{ marginBottom: 18 }}>
          <p className="section-title mb-4">Macronutrients</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {NUTRIENTS.map((n, i) => (
              <div key={i} className="stat-card bg-red-500/5 border-red-500/30" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 18, padding: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <span style={{ fontSize: 18 }}>{n.emoji}</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{n.label}</span>
                </div>
                <div style={{ marginBottom: 8 }}>
                  <span style={{ color: n.color, fontSize: 24, fontWeight: 900, letterSpacing: '-0.02em' }}>{n.value}</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: 12, fontWeight: 500 }}>{n.unit}</span>
                </div>
                <div className="progress-track" style={{ height: 5 }}>
                  <div style={{
                    width: `${Math.min((n.value / n.max) * 100, 100)}%`,
                    height: '100%', borderRadius: 99,
                    background: n.color, transition: 'width 1s ease',
                  }} />
                </div>
                <p style={{ color: 'var(--text-dim)', fontSize: 10, marginTop: 4 }}>{n.value}/{n.max}{n.unit} daily</p>
              </div>
            ))}
          </div>
        </div>

        {/* Micronutrients */}
        <div className="animate-fade-in delay-3" style={{
          background: 'var(--bg-card)',
          borderRadius: 20, padding: 18,
          border: '1px solid var(--border-subtle)',
          marginBottom: 18,
        }}>
          <p style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: 15, marginBottom: 14 }}>Vitamins & Minerals</p>
          {VITAMINS.map((v, i) => (
            <div key={i} style={{ marginBottom: i < VITAMINS.length - 1 ? 10 : 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{v.label}</span>
                <span style={{ color: v.color, fontSize: 13, fontWeight: 700 }}>{v.pct}% DV</span>
              </div>
              <div className="progress-track" style={{ height: 5 }}>
                <div style={{
                  width: `${v.pct}%`, height: '100%', borderRadius: 99,
                  background: v.color, transition: 'width 1s ease',
                }} />
              </div>
            </div>
          ))}
        </div>

        {/* Nadi insight */}
        <div className="animate-fade-in delay-4" style={{
          background: 'linear-gradient(135deg, var(--accent-subtle), var(--bg-card))',
          borderRadius: 18, padding: '14px 16px',
          border: '1px solid var(--border)',
          marginBottom: 18,
          display: 'flex', gap: 14, alignItems: 'flex-start',
        }}>
          <span style={{ fontSize: 28, lineHeight: 1 }}>🧙</span>
          <div>
            <p style={{ color: 'var(--accent)', fontWeight: 700, fontSize: 13, marginBottom: 4 }}>Nadi&apos;s Insight</p>
            <p style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.55 }}>
              Excellent choice! This salad provides great fiber and is low in saturated fat. Add a lean protein like grilled chicken to hit your protein goal for the day.
            </p>
          </div>
        </div>

        {/* Log button */}
        <div className='flex justify-center'>
          <Link  href="/physical" >
          <button  className="btn-primary bg-[var(--accent)]   px-4 py-1 rounded-[8px]" style={{
              width: '100%', maxWidth: 300,
              padding: '18px',
              borderRadius: 18,
              background: 'var(--accent)',
              border: 'none',
              color: '#000',
              fontWeight: 800,
              fontSize: 18,
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              boxShadow: '0 0 28px rgba(34,255,85,0.35)',
              transition: 'all 0.2s',
            }}>
            <span>+ Log This Meal</span>
            <span style={{ fontSize: 12, opacity: 0.8 }}>+15 XP</span>
          </button>
          </Link> 
        </div>
        <div style={{ height: 8 }} />
      </div>
      <BottomNav />
    </div>
  );
}
