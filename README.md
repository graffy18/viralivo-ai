# Viralivo AI v1.0 — Launch Candidate

Viralivo AI is a Next.js + Supabase + Stripe + Remotion starter for a faceless short-video SaaS.

## Included
- Conversion-focused landing page and pricing page
- Supabase authentication and protected dashboard
- Creator Studio with 9:16 Remotion preview
- AI script, scenes, visual generation, voiceover and captions endpoints
- Render queue + Remotion worker + Supabase Storage
- Signed MP4 download flow
- Stripe subscription checkout/webhook
- Creator / Pro / Unlimited plan definitions
- Publishing Hub UI for YouTube Shorts, TikTok and Instagram Reels
- Account settings and legal-page templates

## Launch notes
This is a **launch candidate, not legal or production certification**. Before public sales, configure real environment variables, Supabase buckets/RLS, Stripe products/webhook, OpenAI billing/limits, a worker host, domain, email delivery, monitoring and final legal texts for the actual business.

The paid-plan credit reset is handled by the Stripe `invoice.paid` webhook. The Free plan still needs an automated calendar-month reset before promising exactly 2 fresh videos every month.

## Environment
Copy `.env.example` to `.env.local` and configure Supabase, OpenAI and Stripe server variables. Never expose service-role/secret keys to the browser.

## Supabase
Run `supabase/schema.sql` in the SQL editor and create a private bucket named `viralivo-assets`.

## Run locally
```bash
npm install
npm run dev
```

## Render worker
```bash
npm run render:worker -- <JOB_ID>
```

Run the worker in a separate long-lived Node process/worker host for production rather than inside a normal short-lived web request.

## Publishing
The Publishing Hub is an integration surface. OAuth apps/credentials and platform-specific permissions/review are still required before automated publishing is enabled. YouTube's upload API supports `videos.insert`; unverified API projects are subject to Google's private-upload restriction until audit.

## Security
Keep Stripe secret keys, Supabase service-role keys and OpenAI API keys server-side. Use RLS for user-owned data and private storage for user-generated media.
