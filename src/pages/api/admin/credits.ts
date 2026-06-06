// Simple admin API for credits used by AdminCredits page.
// Protect with ADMIN_TOKEN header in development or deploy behind proper auth in production.

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  if (process.env.ADMIN_TOKEN && req.headers['x-admin-token'] !== process.env.ADMIN_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { data } = await supabase.from('certificate_credits').select('id,user_id,balance,unlimited,source,updated_at').limit(5000);
    res.json({ data: data ?? [] });
  } catch (e) {
    console.error('admin credits error', e);
    res.status(500).json({ error: 'Server error' });
  }
}
