import type { PageServerLoad } from './$types';
import { pool } from '$lib/server/db';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
  const user = locals.user;
  if (!user) throw redirect(302, '/login');

  try {
    const { rows } = await pool.query(
      `
      SELECT id, issue_description, status, created_at
      FROM maintenance_requests
      WHERE user_id = $1
      ORDER BY created_at DESC
      `,
      [user.id]
    );

    return { reports: rows };
  } catch (err) {
    console.error(err);
    return { reports: [] };
  }
};