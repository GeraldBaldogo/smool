import type { PageServerLoad } from './$types';
import { pool } from '$lib/server/db';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
  const user = locals.user;
  if (!user) throw redirect(302, '/login');

  if (!user.department_id) {
    console.error('User has no department_id!');
    throw redirect(302, '/login');
  }

  try {
    // ====== Reports table ======
    const reportsRes = await pool.query(`
      SELECT 
          mr.id,
          u.full_name AS name,
          d.name AS department,
          mr.issue_description AS issue,
          mr.status,
          mr.created_at, 
          mr.category
      FROM maintenance_requests mr
      JOIN users u ON u.id = mr.user_id
      LEFT JOIN departments d ON u.department_id = d.id
      WHERE u.role <> 'professor'
        AND u.department_id = $1
      ORDER BY mr.created_at DESC
    `, [user.department_id]); // parameter ng department

    const reports = reportsRes.rows.map(r => ({
      ...r,
      date: new Date(r.created_at).toLocaleDateString()
    }));

    // ====== Stats per department ======
    const statsRes = await pool.query(`
      SELECT 
          d.name AS department,
          COUNT(mr.id) AS total
      FROM maintenance_requests mr
      JOIN users u ON mr.user_id = u.id
      JOIN departments d ON u.department_id = d.id
      WHERE u.role <> 'professor'
        AND u.department_id = $1
      GROUP BY d.name
    `, [user.department_id]); // parameter din dito

    return {
      user,
      reports,
      stats: statsRes.rows
    };

  } catch (err) {
    console.error('Professor dashboard load error:', err);
    throw redirect(302, '/login');
  }
};