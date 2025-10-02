import type { NextApiRequest, NextApiResponse } from 'next';

import { supabaseAdmin } from '../../supabaseAdmin';

type Role = 'teacher' | 'student';

type RegisterRequestBody = {
  role?: string;
  email?: string;
  supabase_uid?: string;
};

type RegisterResponse =
  | { ok: true }
  | { error: string };

const isRole = (value: string): value is Role => value === 'teacher' || value === 'student';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RegisterResponse>,
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { role, email, supabase_uid } = req.body as RegisterRequestBody;

  if (!role || !email || !supabase_uid) {
    return res.status(400).json({ error: 'Missing role, email, or supabase_uid' });
  }

  const normalizedRole = role.toLowerCase();

  if (!isRole(normalizedRole)) {
    return res.status(400).json({ error: 'Invalid role' });
  }

  const tableName = normalizedRole === 'teacher' ? 'teachers' : 'students';

  const { error } = await supabaseAdmin.from(tableName).upsert(
    {
      supabase_uid,
      email,
    },
    { onConflict: 'supabase_uid' },
  );

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json({ ok: true });
}
