# ARYAN FF CUP — Online Tournament App

## What this includes
- Public mobile web app
- Online team registration
- Shared Supabase database
- Match/room information
- Shared leaderboard
- Admin panel foundation
- SQL schema and Row Level Security

## Setup
1. Create a free Supabase project.
2. Open SQL Editor and run `supabase/schema.sql`.
3. Change `CHANGE_THIS_ADMIN_PASSWORD` in the SQL before running it.
4. Copy your Project URL and anon public key into `app.js`.
5. Deploy `index.html` and `app.js` to GitHub Pages, Netlify, or Vercel.
6. The public app will then use the same online database from every phone.

## Important
The included admin login is a prototype foundation. Before accepting real money or sensitive information, replace it with Supabase Auth and a protected Edge Function, and verify current Free Fire/Garena tournament rules and applicable laws.
