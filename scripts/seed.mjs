import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT      = resolve(__dirname, '..');

// ── Load .env.local ──────────────────────────────────────────
function loadEnv() {
  const envPath = resolve(ROOT, '.env.local');
  const lines   = readFileSync(envPath, 'utf8').split('\n');
  for (const line of lines) {
    const [key, ...rest] = line.trim().split('=');
    if (key && rest.length) process.env[key] = rest.join('=');
  }
}
loadEnv();

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌  Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ── CSV parser ───────────────────────────────────────────────
function parseCSV(filePath) {
  const raw  = readFileSync(filePath, 'utf8');
  const lines = raw.split('\n').filter(l => l.trim());
  const headers = parseRow(lines[0]);
  return lines.slice(1).map(line => {
    const values = parseRow(line);
    const row = {};
    headers.forEach((h, i) => { row[h] = values[i] ?? ''; });
    return row;
  });
}

function parseRow(line) {
  const result = [];
  let cur = '', inQ = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') { inQ = !inQ; continue; }
    if (c === ',' && !inQ) { result.push(cur.trim()); cur = ''; continue; }
    cur += c;
  }
  result.push(cur.trim());
  return result;
}

// ── Type coercions ───────────────────────────────────────────
const toNum  = v => v === '' || v === null ? null : Number(v);
const toBool = v => v === 'True' || v === '1' || v === 'true';
const toInt  = v => v === '' || v === null ? null : parseInt(v, 10);
const toStr  = v => v === '' ? null : String(v);

// ── Batch insert helper ──────────────────────────────────────
async function upsert(table, rows, onConflict) {
  const BATCH = 200;
  let total = 0;
  for (let i = 0; i < rows.length; i += BATCH) {
    const chunk = rows.slice(i, i + BATCH);
    const { error } = await supabase.from(table).upsert(chunk, { onConflict });
    if (error) { console.error(`  ⚠️  ${table} batch ${i}:`, error.message); }
    else total += chunk.length;
  }
  console.log(`  ✅  ${table}: ${total} rows inserted`);
}

// ── Table mappers ─────────────────────────────────────────────

function mapUsers(rows) {
  return rows.map(r => ({
    user_id:                   r.user_id,
    name:                      r.name,
    email:                     toStr(r.email),
    phone_number:              toStr(r.phone_number),
    age:                       toInt(r.age),
    gender:                    toStr(r.gender),
    marital_status:            toStr(r.marital_status),
    city_tier:                 toStr(r.city_tier),
    education:                 toStr(r.education),
    occupation:                toStr(r.occupation),
    income_band_inr_per_month: toStr(r.income_band_inr_per_month),
    key_context:               toStr(r.key_context),
    primary_goals:             toStr(r.primary_goals),
    privacy_sensitivity:       toStr(r.privacy_sensitivity),
  }));
}

function mapBuddies(rows) {
  return rows.map(r => ({
    buddy_id:        r.buddy_id,
    name:            r.name,
    relationship:    toStr(r.relationship),
    contact_channel: toStr(r.contact_channel),
    timezone:        toStr(r.timezone),
  }));
}

function mapBuddyLinks(rows) {
  return rows.map(r => ({
    user_id:                r.user_id,
    buddy_id:               r.buddy_id,
    escalation_priority:    toInt(r.escalation_priority),
    share_level:            toStr(r.share_level),
    preferred_alert_window: toStr(r.preferred_alert_window),
  }));
}

function mapCalendarEvents(rows) {
  return rows.map(r => ({
    event_id:       r.event_id,
    user_id:        r.user_id,
    start_datetime: toStr(r.start_datetime),
    end_datetime:   toStr(r.end_datetime),
    title:          toStr(r.title),
    event_type:     toStr(r.event_type),
    location:       toStr(r.location),
    importance_1_5: toInt(r.importance_1_5),
    recurring_id:   toStr(r.recurring_id),
    notes:          toStr(r.notes),
  }));
}

function mapDailyMetrics(rows) {
  return rows.map(r => ({
    date:                      r.date,
    user_id:                   r.user_id,
    sleep_hours:               toNum(r.sleep_hours),
    sleep_quality:             toNum(r.sleep_quality),
    steps:                     toInt(r.steps),
    resting_hr:                toNum(r.resting_hr),
    hrv_ms:                    toNum(r.hrv_ms),
    weight_kg:                 toNum(r.weight_kg),
    bp_systolic:               toInt(r.bp_systolic),
    bp_diastolic:              toInt(r.bp_diastolic),
    glucose_fasting_mgdl:      toNum(r.glucose_fasting_mgdl),
    alcohol_units:             toNum(r.alcohol_units),
    cigarettes:                toInt(r.cigarettes),
    screen_time_hours:         toNum(r.screen_time_hours),
    late_night_activity_min:   toInt(r.late_night_activity_min),
    social_interactions_count: toInt(r.social_interactions_count),
    mood_score_1_10:           toInt(r.mood_score_1_10),
    stress_score_1_10:         toInt(r.stress_score_1_10),
    energy_score_1_10:         toInt(r.energy_score_1_10),
    loneliness_score_1_10:     toInt(r.loneliness_score_1_10),
    productivity_score_1_10:   toInt(r.productivity_score_1_10),
    medication_adherence_0_1:  toNum(r.medication_adherence_0_1),
  }));
}

function mapFinanceDaily(rows) {
  return rows.map(r => ({
    date:                    r.date,
    user_id:                 r.user_id,
    income_inr:              toNum(r.income_inr),
    total_spend_inr:         toNum(r.total_spend_inr),
    spend_food_delivery_inr: toNum(r.spend_food_delivery_inr),
    spend_ecommerce_inr:     toNum(r.spend_ecommerce_inr),
    spend_groceries_inr:     toNum(r.spend_groceries_inr),
    spend_transport_inr:     toNum(r.spend_transport_inr),
    spend_entertainment_inr: toNum(r.spend_entertainment_inr),
    spend_healthcare_inr:    toNum(r.spend_healthcare_inr),
    spend_rent_or_home_inr:  toNum(r.spend_rent_or_home_inr),
    spend_loan_emi_inr:      toNum(r.spend_loan_emi_inr),
    spend_education_inr:     toNum(r.spend_education_inr),
    spend_misc_inr:          toNum(r.spend_misc_inr),
    spend_upi_inr:           toNum(r.spend_upi_inr),
    spend_wallet_inr:        toNum(r.spend_wallet_inr),
    spend_card_inr:          toNum(r.spend_card_inr),
    spend_netbanking_inr:    toNum(r.spend_netbanking_inr),
    spend_bank_transfer_inr: toNum(r.spend_bank_transfer_inr),
    spend_gpay_inr:          toNum(r.spend_gpay_inr),
    spend_credit_card_inr:   toNum(r.spend_credit_card_inr),
    spend_debit_card_inr:    toNum(r.spend_debit_card_inr),
    cash_balance_est_inr:    toNum(r.cash_balance_est_inr),
  }));
}

function mapPaymentSplitDaily(rows) {
  return rows.map(r => ({
    date:                    r.date,
    user_id:                 r.user_id,
    total_spend_inr:         toNum(r.total_spend_inr),
    income_inr:              toNum(r.income_inr),
    spend_upi_inr:           toNum(r.spend_upi_inr),
    spend_gpay_inr:          toNum(r.spend_gpay_inr),
    spend_credit_card_inr:   toNum(r.spend_credit_card_inr),
    spend_debit_card_inr:    toNum(r.spend_debit_card_inr),
    spend_wallet_inr:        toNum(r.spend_wallet_inr),
    spend_netbanking_inr:    toNum(r.spend_netbanking_inr),
    spend_bank_transfer_inr: toNum(r.spend_bank_transfer_inr),
    cash_balance_est_inr:    toNum(r.cash_balance_est_inr),
  }));
}

function mapPaymentInstruments(rows) {
  return rows.map(r => ({
    instrument_id:     r.instrument_id,
    user_id:           r.user_id,
    rail:              toStr(r.rail),
    subtype:           toStr(r.subtype),
    provider:          toStr(r.provider),
    issuer:            toStr(r.issuer),
    network:           toStr(r.network),
    label:             toStr(r.label),
    masked_identifier: toStr(r.masked_identifier),
  }));
}

function mapTransactions(rows) {
  return rows.map(r => ({
    txn_id:          r.txn_id,
    user_id:         r.user_id,
    txn_datetime:    toStr(r.txn_datetime),
    direction:       toStr(r.direction),
    category:        toStr(r.category),
    merchant:        toStr(r.merchant),
    amount_inr:      toNum(r.amount_inr),
    payment_method:  toStr(r.payment_method),
    payment_rail:    toStr(r.payment_rail),
    payment_subtype: toStr(r.payment_subtype),
    instrument_id:   toStr(r.instrument_id),
    is_upi:          toBool(r.is_upi),
    is_gpay:         toBool(r.is_gpay),
    is_credit_card:  toBool(r.is_credit_card),
    notes:           toStr(r.notes),
  }));
}

function mapCreditCardStatements(rows) {
  return rows.map(r => ({
    user_id:                       r.user_id,
    card_instrument_id:            toStr(r.card_instrument_id),
    month:                         toStr(r.month),
    cycle_start:                   toStr(r.cycle_start),
    cycle_end:                     toStr(r.cycle_end),
    statement_date:                toStr(r.statement_date),
    due_date:                      toStr(r.due_date),
    statement_amount_inr:          toNum(r.statement_amount_inr),
    min_due_inr:                   toNum(r.min_due_inr),
    paid_amount_inr:               toNum(r.paid_amount_inr),
    paid_date:                     toStr(r.paid_date),
    payment_status:                toStr(r.payment_status),
    outstanding_after_payment_inr: toNum(r.outstanding_after_payment_inr),
  }));
}

function mapCheckins(rows) {
  return rows.map(r => ({
    checkin_id:            r.checkin_id,
    user_id:               r.user_id,
    checkin_datetime:      toStr(r.checkin_datetime),
    modality:              toStr(r.modality),
    scheduled:             toBool(r.scheduled),
    completed:             toBool(r.completed),
    duration_min:          toInt(r.duration_min),
    sentiment_score:       toNum(r['sentiment_score_-1_to_1']),
    tone_energy:           toNum(r['tone_energy_0_1']),
    speech_rate_wpm:       toNum(r.speech_rate_wpm),
    pause_ratio:           toNum(r.pause_ratio),
    facial_fatigue:        toNum(r['facial_fatigue_0_1']),
    key_topics:            toStr(r.key_topics),
    summary:               toStr(r.summary),
    recommended_next_step: toStr(r.recommended_next_step),
    escalation_level:      toInt(r['escalation_level_0_4']),
    buddy_notified:        toStr(r.buddy_notified),
    clinician_review:      toBool(r.clinician_review),
  }));
}

function mapAlerts(rows) {
  return rows.map(r => ({
    alert_id:           r.alert_id,
    user_id:            r.user_id,
    alert_datetime:     toStr(r.alert_datetime),
    alert_type:         toStr(r.alert_type),
    severity:           toStr(r.severity),
    signals_triggered:  toStr(r.signals_triggered),
    explanation:        toStr(r.explanation),
    recommended_action: toStr(r.recommended_action),
    escalation_level:   toInt(r['escalation_level_0_4']),
    buddy_notified:     toStr(r.buddy_notified),
    resolved:           toBool(r.resolved),
  }));
}

// ── Main ─────────────────────────────────────────────────────
const CSV = p => resolve(ROOT, 'Excel', p);

async function main() {
  console.log('\n🚀  NADIAURA — Seeding Supabase\n');

  // Order matters — respect foreign keys
  console.log('📋  Step 1: Users & Buddies');
  await upsert('users',        mapUsers(parseCSV(CSV('users.csv'))),   'user_id');
  await upsert('buddies',      mapBuddies(parseCSV(CSV('buddies.csv'))), 'buddy_id');
  await upsert('buddy_links',  mapBuddyLinks(parseCSV(CSV('buddy_links.csv'))), 'id');

  console.log('\n📅  Step 2: Calendar Events');
  await upsert('calendar_events', mapCalendarEvents(parseCSV(CSV('calendar_events.csv'))), 'event_id');

  console.log('\n📊  Step 3: Daily Metrics & Finance');
  await upsert('daily_metrics',              mapDailyMetrics(parseCSV(CSV('daily_metrics.csv'))),                     'date,user_id');
  await upsert('finance_daily',              mapFinanceDaily(parseCSV(CSV('finance_daily.csv'))),                     'date,user_id');
  await upsert('finance_payment_split_daily',mapPaymentSplitDaily(parseCSV(CSV('finance_payment_split_daily.csv'))), 'date,user_id');

  console.log('\n💳  Step 4: Payment Instruments & Transactions');
  await upsert('payment_instruments',  mapPaymentInstruments(parseCSV(CSV('payment_instruments.csv'))),   'instrument_id');
  await upsert('transactions',         mapTransactions(parseCSV(CSV('transactions.csv'))),                 'txn_id');
  await upsert('credit_card_statements', mapCreditCardStatements(parseCSV(CSV('credit_card_statements.csv'))), 'id');

  console.log('\n🧘  Step 5: Check-ins & Alerts');
  await upsert('checkins', mapCheckins(parseCSV(CSV('checkins.csv'))), 'checkin_id');
  await upsert('alerts',   mapAlerts(parseCSV(CSV('alerts.csv'))),     'alert_id');

  console.log('\n✨  Done! All data seeded into Supabase.\n');
}

main().catch(err => { console.error('❌ Fatal error:', err); process.exit(1); });
