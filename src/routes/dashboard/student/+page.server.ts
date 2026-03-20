import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { pool } from '$lib/server/db';

export const load: PageServerLoad = async ({ locals }) => {
  const user = locals.user;
  if (!user) throw redirect(302, '/login');

  const reportsRes = await pool.query(
    `SELECT id, issue_description, status, created_at, category
     FROM maintenance_requests
     WHERE user_id = $1
     ORDER BY created_at DESC`,
    [user.id]
  );

  const reports = reportsRes.rows;

  const stats = {
    total: reports.length,
    pending: reports.filter(r => r.status?.toLowerCase() === 'pending').length,
    completed: reports.filter(r => r.status?.toLowerCase() === 'completed').length
  };

  return {
    user,
    reports,
    stats
  };
};
