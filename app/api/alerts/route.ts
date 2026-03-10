import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET /api/alerts?user_id=U001&resolved=false
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId   = searchParams.get('user_id') || 'U001';
  const resolved = searchParams.get('resolved');

  let query = supabase
    .from('alerts')
    .select('*')
    .eq('user_id', userId)
    .order('alert_datetime', { ascending: false })
    .limit(50);

  if (resolved !== null) query = query.eq('resolved', resolved === 'true');

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
