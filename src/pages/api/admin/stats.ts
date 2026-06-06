import type { RequestHandler } from 'express';
// This file provides a simple node-style endpoint for local dev or server deployments.
// It is used by the AdminIndex stats fetch. In production you should implement
// an authenticated server endpoint that returns admin-level aggregates.

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  // Basic auth guard for safety in dev; in production replace with proper auth.
  if (process.env.ADMIN_TOKEN && req.headers['x-admin-token'] !== process.env.ADMIN_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const [{ count: users }, { data: credits }, { count: enrolments }] = await Promise.all([
      supabase.from('profiles').select('user_id', { count: 'exact' }),
      supabase.from('certificate_credits').select('user_id,balance,unlimited').limit(10000),
      supabase.from('course_enrollments').select('user_id', { count: 'exact' }),
    ]);

    const totalCredits = (credits ?? []).reduce((s: number, c: any) => s + (c.balance ?? 0), 0);

    res.json({ users: users ?? 0, credits: totalCredits ?? 0, enrolments: enrolments ?? 0 });
  } catch (e) {
    console.error('admin stats error', e);
    res.status(500).json({ error: 'Server error' });
  }
}
