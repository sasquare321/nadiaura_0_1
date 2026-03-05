'use client';
import Link from 'next/link';
import BottomNav from '@/components/BottomNav';
import { ArrowLeftIcon, TrendUpIcon } from '@/components/Icons';

const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const SPEND_BARS = [2400, 3100, 1800, 2900, 3800, 4200, 3100]; // daily spend in ₹

const MILESTONES = [
  { label: 'Emergency Fund', target: 150000, current: 112000, color: 'var(--accent)', emoji: '🛡️' },
  { label: 'Vacation Fund', target: 60000, current: 28000, color: 'var(--physical)', emoji: '✈️' },
  { label: 'Investment SIP', target: 20000, current: 12000, color: 'var(--emotional)', emoji: '📈' },
];

const CATEGORIES = [
  { emoji: '🏠', label: 'Housing', amount: 18000, budget: 20000, pct: 90 },
  { emoji: '🍔', label: 'Food & Dining', amount: 8400, budget: 8000, pct: 105 },
  { emoji: '🚗', label: 'Transport', amount: 3200, budget: 5000, pct: 64 },
  { emoji: '💊', label: 'Health', amount: 2100, budget: 3000, pct: 70 },
  { emoji: '🎬', label: 'Entertainment', amount: 3600, budget: 3000, pct: 120 },
];

export default function FinancialPage() {
  const totalSpend = 35300;
  const monthBudget = 42000;
  const spendPct = Math.round((totalSpend / monthBudget) * 100);
  const maxBar = Math.max(...SPEND_BARS);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg-primary)' }}>
      <div className="screen-scroll page-enter" style={{ flex: 1, padding: '20px 18px 0' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <Link href="/analytics" style={{ textDecoration: 'none' }}>
            <div className="btn-icon"><ArrowLeftIcon size={18} color="var(--text-secondary)" /></div>
          </Link>
          <h1 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)' }}>Financial Health</h1>
          <div className="badge orange">Score 65</div>
        </div>

        {/* Spend Hero */}
        <div className="animate-fade-in" style={{
          background: 'linear-gradient(135deg, rgba(251,146,60,0.1) 0%, var(--bg-card) 65%)',
          borderRadius: 22, padding: 20,
          border: '1px solid rgba(251,146,60,0.2)',
          marginBottom: 18, position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', right: -20, bottom: -20,
            width: 130, height: 130, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(251,146,60,0.08) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />

          <p style={{ color: 'var(--text-muted)', fontSize: 12, marginBottom: 4 }}>March 2026 Spend</p>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, marginBottom: 6 }}>
            <span style={{ color: 'var(--text-primary)', fontSize: 30, fontWeight: 900, letterSpacing: '-0.02em', lineHeight: 1 }}>
              ₹{totalSpend.toLocaleString()}
            </span>
            <span style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 4 }}>/ ₹{monthBudget.toLocaleString()}</span>
          </div>

          <div style={{ marginBottom: 12 }}>
            <div className="progress-track" style={{ height: 8 }}>
              <div style={{
                width: `${Math.min(spendPct, 100)}%`, height: '100%', borderRadius: 99,
                background: spendPct > 90 ? 'var(--danger)' : spendPct > 70 ? 'var(--warning)' : 'var(--financial)',
                transition: 'width 1s ease',
              }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5 }}>
              <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>{spendPct}% of monthly budget</span>
              <span style={{ color: 'var(--accent)', fontSize: 12, fontWeight: 600 }}>₹{(monthBudget - totalSpend).toLocaleString()} left</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <span className={`badge ${spendPct > 90 ? 'red' : 'orange'}`}>
              {spendPct > 90 ? '⚠️ Over budget risk' : `${100 - spendPct}% budget remaining`}
            </span>
            <span className="badge red">▼ -3 score</span>
          </div>

          {/* Weekly chart */}
          <div style={{ marginTop: 18 }}>
            <p style={{ color: 'var(--text-muted)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Daily Spend (₹)</p>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 60 }}>
              {SPEND_BARS.map((v, i) => {
                const isHigh = v > monthBudget / 7;
                return (
                  <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                    <div style={{
                      width: '100%',
                      height: `${(v / maxBar) * 52}px`,
                      background: isHigh ? 'var(--danger)' : (i === 6 ? 'var(--financial)' : 'rgba(251,146,60,0.25)'),
                      borderRadius: '4px 4px 0 0',
                      boxShadow: i === 6 ? '0 0 8px var(--financial-glow)' : 'none',
                    }} />
                    <span style={{ color: 'var(--text-dim)', fontSize: 9, fontWeight: 600 }}>{DAYS[i]}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="animate-fade-in delay-1" style={{
          background: 'var(--bg-card)',
          borderRadius: 20, padding: 18,
          border: '1px solid var(--border-subtle)',
          marginBottom: 18,
        }}>
          <p style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: 15, marginBottom: 14 }}>Spending Breakdown</p>
          {CATEGORIES.map((cat, i) => (
            <div key={i} style={{ marginBottom: i < CATEGORIES.length - 1 ? 14 : 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <span style={{ fontSize: 18 }}>{cat.emoji}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ color: 'var(--text-secondary)', fontSize: 13, fontWeight: 500 }}>{cat.label}</span>
                    <span style={{ fontSize: 12 }}>
                      <span style={{ color: cat.pct > 100 ? 'var(--danger)' : 'var(--text-primary)', fontWeight: 700 }}>
                        ₹{cat.amount.toLocaleString()}
                      </span>
                      <span style={{ color: 'var(--text-muted)' }}> / ₹{cat.budget.toLocaleString()}</span>
                    </span>
                  </div>
                  <div className="progress-track" style={{ height: 5 }}>
                    <div style={{
                      width: `${Math.min(cat.pct, 100)}%`, height: '100%', borderRadius: 99,
                      background: cat.pct > 100 ? 'var(--danger)' : cat.pct > 80 ? 'var(--warning)' : 'var(--financial)',
                      transition: 'width 1s ease',
                    }} />
                  </div>
                </div>
                {cat.pct > 100 && (
                  <span style={{ fontSize: 12, color: 'var(--danger)', fontWeight: 700, flexShrink: 0 }}>⚠️</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Savings Milestones */}
        <div className="animate-fade-in delay-2" style={{ marginBottom: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <p className="section-title" style={{ marginBottom: 0 }}>Savings Goals</p>
            <span className="badge gold">🎯 3 Active</span>
          </div>

          {MILESTONES.map((m, i) => {
            const pct = Math.round((m.current / m.target) * 100);
            return (
              <div key={i} style={{
                background: 'var(--bg-card)',
                borderRadius: 16, padding: '14px 16px',
                border: '1px solid var(--border-subtle)',
                marginBottom: 10,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 12,
                    background: `${m.color}15`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 20, flexShrink: 0,
                  }}>{m.emoji}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                      <span style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: 14 }}>{m.label}</span>
                      <span style={{ color: m.color, fontWeight: 700, fontSize: 14 }}>{pct}%</span>
                    </div>
                    <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>
                      ₹{m.current.toLocaleString()} of ₹{m.target.toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="progress-track" style={{ height: 7 }}>
                  <div style={{
                    width: `${pct}%`, height: '100%', borderRadius: 99,
                    background: m.color,
                    transition: 'width 1.2s ease',
                  }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Alert */}
        <div className="animate-fade-in delay-3" style={{
          background: 'rgba(255,82,82,0.06)',
          borderRadius: 16, padding: '14px 16px',
          border: '1px solid rgba(255,82,82,0.2)',
          marginBottom: 18, display: 'flex', gap: 12,
        }}>
          <span style={{ fontSize: 22 }}>⚠️</span>
          <div>
            <p style={{ color: 'var(--danger)', fontWeight: 700, fontSize: 14, marginBottom: 4 }}>Overspend Alert</p>
            <p style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.5 }}>
              Food & dining and entertainment are over budget. Nadi suggests skipping 2 restaurant outings this week to save ₹1,800.
            </p>
          </div>
        </div>

        <div style={{ height: 8 }} />
      </div>
      <BottomNav />
    </div>
  );
}
