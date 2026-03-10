import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET /api/finance?user_id=U001&days=30
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('user_id') || 'U001';
  const days   = parseInt(searchParams.get('days') || '30');

  const [finance, splits] = await Promise.all([
    supabase
      .from('finance_daily')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false })
      .limit(days),
    supabase
      .from('finance_payment_split_daily')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false })
      .limit(days),
  ]);

  if (finance.error) return NextResponse.json({ error: finance.error.message }, { status: 500 });
  return NextResponse.json({ daily: finance.data, splits: splits.data });
}
