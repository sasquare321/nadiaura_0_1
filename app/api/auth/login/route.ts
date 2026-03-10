import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// POST /api/auth/login
// Body: { identifier: "phone or email" }
export async function POST(req: NextRequest) {
  const { identifier } = await req.json();
  if (!identifier?.trim()) {
    return NextResponse.json({ error: 'Phone number or email is required' }, { status: 400 });
  }

  const val = identifier.trim().toLowerCase();

  // Look up by email OR phone_number
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .or(`email.eq.${val},phone_number.eq.${val}`)
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (!data) {
    return NextResponse.json({ error: 'No account found with that phone or email.' }, { status: 404 });
  }

  // In production: trigger OTP via SMS/email here
  // For now: return user so client can store and complete verify step
  return NextResponse.json({ user: data });
}
