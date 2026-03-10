import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET /api/user?user_id=U001
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('user_id') || 'U001';

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST /api/user  — called from signup page
export async function POST(req: NextRequest) {
  const body = await req.json();

  const { data, error } = await supabase
    .from('users')
    .insert([{
      user_id:                   `U${Date.now()}`,
      name:                      body.fullName,
      email:                     body.email?.trim().toLowerCase() || null,
      phone_number:              body.phone?.trim() || null,
      age:                       body.age ? parseInt(body.age) : null,
      gender:                    body.gender,
      marital_status:            body.maritalStatus,
      city_tier:                 body.cityTier,
      education:                 body.education,
      occupation:                body.occupation,
      income_band_inr_per_month: body.incomeBand,
      key_context:               body.keyContext,
      primary_goals:             body.primaryGoals?.join(', '),
      privacy_sensitivity:       body.privacySensitivity,
    }])
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
