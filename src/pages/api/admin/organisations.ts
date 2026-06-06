// Simple admin API for organisations used by AdminOrganisations page.

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  if (process.env.ADMIN_TOKEN && req.headers['x-admin-token'] !== process.env.ADMIN_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { data } = await supabase.from('organisations').select('id,name,created_at,user_count,active').limit(5000);
    res.json({ data: data ?? [] });
  } catch (e) {
    console.error('admin organisations error', e);
    res.status(500).json({ error: 'Server error' });
  }
}
