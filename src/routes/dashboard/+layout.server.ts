import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { pool } from '$lib/server/db';

export const load: LayoutServerLoad = async ({ locals }) => {
  // 🔐 Primary auth check
  const sessionUser = locals.user;

  if (!sessionUser) {
    throw redirect(302, '/login');
  }

  // 🧠 OPTIONAL: re-validate user from DB
  // (useful kung may role/department changes)
  const result = await pool.query(
    `SELECT id, full_name, email, role, department_id
     FROM users
     WHERE id = $1`,
    [sessionUser.id]
  );

  if (result.rows.length === 0) {
    throw redirect(302, '/login');
  }

  // ✅ Final trusted user
  const user = result.rows[0];

  return {
    user
  };
};
