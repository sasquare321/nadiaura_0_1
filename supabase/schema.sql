-- ============================================================
-- NADIAURA — Full Database Schema
-- Paste this entire file into Supabase SQL Editor and run it.
-- ============================================================

-- 1. USERS
create table if not exists public.users (
  user_id                    text primary key,
  name                       text not null,
  email                      text unique,
  phone_number               text unique,
  age                        integer,
  gender                     text,
  marital_status             text,
  city_tier                  text,
  education                  text,
  occupation                 text,
  income_band_inr_per_month  text,
  key_context                text,
  primary_goals              text,
  privacy_sensitivity        text,
  created_at                 timestamptz default now()
);

-- 2. BUDDIES
create table if not exists public.buddies (
  buddy_id         text primary key,
  name             text not null,
  relationship     text,
  contact_channel  text,
  timezone         text
);

-- 3. BUDDY LINKS  (user ↔ buddy mapping)
create table if not exists public.buddy_links (
  id                      bigserial primary key,
  user_id                 text references public.users(user_id) on delete cascade,
  buddy_id                text references public.buddies(buddy_id) on delete cascade,
  escalation_priority     integer,
  share_level             text,
  preferred_alert_window  text
);

-- 4. CALENDAR EVENTS
create table if not exists public.calendar_events (
  event_id        text primary key,
  user_id         text references public.users(user_id) on delete cascade,
  start_datetime  timestamptz,
  end_datetime    timestamptz,
  title           text,
  event_type      text,
  location        text,
  importance_1_5  integer,
  recurring_id    text,
  notes           text
);

-- 5. DAILY METRICS
create table if not exists public.daily_metrics (
  id                        bigserial primary key,
  date                      date not null,
  user_id                   text references public.users(user_id) on delete cascade,
  sleep_hours               numeric,
  sleep_quality             numeric,
  steps                     integer,
  resting_hr                numeric,
  hrv_ms                    numeric,
  weight_kg                 numeric,
  bp_systolic               integer,
  bp_diastolic              integer,
  glucose_fasting_mgdl      numeric,
  alcohol_units             numeric,
  cigarettes                integer,
  screen_time_hours         numeric,
  late_night_activity_min   integer,
  social_interactions_count integer,
  mood_score_1_10           integer,
  stress_score_1_10         integer,
  energy_score_1_10         integer,
  loneliness_score_1_10     integer,
  productivity_score_1_10   integer,
  medication_adherence_0_1  numeric,
  unique (date, user_id)
);

-- 6. FINANCE DAILY
create table if not exists public.finance_daily (
  id                       bigserial primary key,
  date                     date not null,
  user_id                  text references public.users(user_id) on delete cascade,
  income_inr               numeric default 0,
  total_spend_inr          numeric default 0,
  spend_food_delivery_inr  numeric default 0,
  spend_ecommerce_inr      numeric default 0,
  spend_groceries_inr      numeric default 0,
  spend_transport_inr      numeric default 0,
  spend_entertainment_inr  numeric default 0,
  spend_healthcare_inr     numeric default 0,
  spend_rent_or_home_inr   numeric default 0,
  spend_loan_emi_inr       numeric default 0,
  spend_education_inr      numeric default 0,
  spend_misc_inr           numeric default 0,
  spend_upi_inr            numeric default 0,
  spend_wallet_inr         numeric default 0,
  spend_card_inr           numeric default 0,
  spend_netbanking_inr     numeric default 0,
  spend_bank_transfer_inr  numeric default 0,
  spend_gpay_inr           numeric default 0,
  spend_credit_card_inr    numeric default 0,
  spend_debit_card_inr     numeric default 0,
  cash_balance_est_inr     numeric default 0,
  unique (date, user_id)
);

-- 7. FINANCE PAYMENT SPLIT DAILY
create table if not exists public.finance_payment_split_daily (
  id                      bigserial primary key,
  date                    date not null,
  user_id                 text references public.users(user_id) on delete cascade,
  total_spend_inr         numeric default 0,
  income_inr              numeric default 0,
  spend_upi_inr           numeric default 0,
  spend_gpay_inr          numeric default 0,
  spend_credit_card_inr   numeric default 0,
  spend_debit_card_inr    numeric default 0,
  spend_wallet_inr        numeric default 0,
  spend_netbanking_inr    numeric default 0,
  spend_bank_transfer_inr numeric default 0,
  cash_balance_est_inr    numeric default 0,
  unique (date, user_id)
);

-- 8. PAYMENT INSTRUMENTS
create table if not exists public.payment_instruments (
  instrument_id      text primary key,
  user_id            text references public.users(user_id) on delete cascade,
  rail               text,
  subtype            text,
  provider           text,
  issuer             text,
  network            text,
  label              text,
  masked_identifier  text
);

-- 9. TRANSACTIONS
create table if not exists public.transactions (
  txn_id           text primary key,
  user_id          text references public.users(user_id) on delete cascade,
  txn_datetime     timestamptz,
  direction        text,
  category         text,
  merchant         text,
  amount_inr       numeric,
  payment_method   text,
  payment_rail     text,
  payment_subtype  text,
  instrument_id    text references public.payment_instruments(instrument_id),
  is_upi           boolean default false,
  is_gpay          boolean default false,
  is_credit_card   boolean default false,
  notes            text
);

-- 10. CREDIT CARD STATEMENTS
create table if not exists public.credit_card_statements (
  id                           bigserial primary key,
  user_id                      text references public.users(user_id) on delete cascade,
  card_instrument_id           text references public.payment_instruments(instrument_id),
  month                        text,
  cycle_start                  date,
  cycle_end                    date,
  statement_date               date,
  due_date                     date,
  statement_amount_inr         numeric,
  min_due_inr                  numeric,
  paid_amount_inr              numeric,
  paid_date                    date,
  payment_status               text,
  outstanding_after_payment_inr numeric
);

-- 11. CHECKINS
create table if not exists public.checkins (
  checkin_id               text primary key,
  user_id                  text references public.users(user_id) on delete cascade,
  checkin_datetime         timestamptz,
  modality                 text,
  scheduled                boolean default true,
  completed                boolean default true,
  duration_min             integer,
  sentiment_score          numeric,
  tone_energy              numeric,
  speech_rate_wpm          numeric,
  pause_ratio              numeric,
  facial_fatigue           numeric,
  key_topics               text,
  summary                  text,
  recommended_next_step    text,
  escalation_level         integer default 0,
  buddy_notified           text,
  clinician_review         boolean default false
);

-- 12. ALERTS
create table if not exists public.alerts (
  alert_id            text primary key,
  user_id             text references public.users(user_id) on delete cascade,
  alert_datetime      timestamptz,
  alert_type          text,
  severity            text,
  signals_triggered   text,
  explanation         text,
  recommended_action  text,
  escalation_level    integer default 0,
  buddy_notified      text,
  resolved            boolean default false
);

-- ── Indexes for fast lookups ──────────────────────────────
create index if not exists idx_daily_metrics_user_date    on public.daily_metrics    (user_id, date desc);
create index if not exists idx_finance_daily_user_date    on public.finance_daily    (user_id, date desc);
create index if not exists idx_transactions_user          on public.transactions     (user_id, txn_datetime desc);
create index if not exists idx_checkins_user              on public.checkins         (user_id, checkin_datetime desc);
create index if not exists idx_alerts_user                on public.alerts           (user_id, alert_datetime desc);
create index if not exists idx_calendar_events_user       on public.calendar_events  (user_id, start_datetime);
