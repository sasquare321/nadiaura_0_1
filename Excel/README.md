# NADIAURA Test Dataset (Synthetic) — Last 6 Months
Date range: 2025-08-22 to 2026-02-22 (Asia/Kolkata)

This dataset is **synthetic** and created for product testing (no real people).

## Files
- users.csv — persona-level user profiles (4)
- buddies.csv — buddy directory (13)
- buddy_links.csv — user↔buddy mapping, escalation priority, share levels
- daily_metrics.csv — daily wellness + behavior signals (physical, emotional, digital)
- finance_daily.csv — daily aggregated spend/income + estimated cash balance **(+ payment splits)**
- finance_payment_split_daily.csv — daily spend split by rails (UPI/GPay/Credit Card etc.)
- transactions.csv — transaction-level data (Zomato/Swiggy/Amazon etc.) **(+ UPI app + credit/debit split)**
- payment_instruments.csv — per-user payment instruments (UPI apps, cards, wallets)
- credit_card_statements.csv — monthly synthetic statements (amount, min due, paid status)
- calendar_events.csv — calendar events used for “next best step” **(+ credit card due reminders)**
- checkins.csv — Nadiaura video check-in logs (completed/missed + Aura-like KPIs)
- alerts.csv — alerts generated from deviations (severity + escalation)

## Key columns (quick map)
### daily_metrics.csv
- sleep_hours, sleep_quality, steps, resting_hr, hrv_ms
- bp_systolic, bp_diastolic, glucose_fasting_mgdl (primarily for Suchithra)
- alcohol_units, cigarettes
- screen_time_hours, late_night_activity_min
- mood_score_1_10, stress_score_1_10, energy_score_1_10, loneliness_score_1_10

### checkins.csv
- sentiment_score_-1_to_1 (derived from mood/stress)
- tone_energy_0_1, speech_rate_wpm, pause_ratio, facial_fatigue_0_1
- key_topics, summary, recommended_next_step
- escalation_level_0_4 + buddy_notified

### finance_daily.csv
- spend_food_delivery_inr / spend_ecommerce_inr, etc.
- cash_balance_est_inr (simple running balance)

### calendar_events.csv
- title + event_type + importance_1_5

## Suggested ingestion order
1) users → buddies → buddy_links
2) calendar_events
3) daily_metrics + finance_daily + transactions
4) checkins
5) alerts


### transactions.csv (payments)
- payment_method: upi | card | wallet | netbanking | bank_transfer
- payment_subtype:
  - UPI apps: gpay | phonepe | paytm_upi | bhim | bank_upi
  - Cards: credit_card | debit_card
  - Wallets: paytm_wallet | amazon_pay
  - Transfers: imps | neft | netbanking
- instrument_id: foreign key into payment_instruments.csv
- is_gpay / is_upi / is_credit_card: booleans for quick filters

### payment_instruments.csv
- instrument_id, user_id
- rail: UPI | CARD | WALLET | NETBANKING | BANK_TRANSFER
- subtype: e.g., credit_card, gpay, phonepe, paytm_wallet
- issuer / network where applicable (masked_identifier is always masked)

### credit_card_statements.csv
- month, statement_date, due_date
- statement_amount_inr, min_due_inr, paid_amount_inr, payment_status
- outstanding_after_payment_inr
