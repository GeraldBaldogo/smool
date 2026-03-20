import { error } from '@sveltejs/kit';
import { pool } from '$lib/server/db';

export const load = async ({ params, locals }) => {
  const id = params.id;

  if (!id) {
    throw error(400, 'Invalid report ID');
  }

  const result = await pool.query(
    `
    SELECT
      id,
      issue_description,
      category,
      subcategory,
      status,
      created_at,
      latitude,
      longitude,
      address,
      landmark,
      photo_url,
      admin_feedback,
      completion_photo_url,
      completed_at
    FROM maintenance_requests
    WHERE id = $1 AND user_id = $2
    `,
    [id, locals.user?.id]
  );

  if (result.rows.length === 0) {
    throw error(404, 'Report not found');
  }

  const stats = await pool.query(`
    SELECT 
        u.department_id,
        COUNT(m.id) AS total
    FROM maintenance_requests m
    JOIN users u ON m.user_id = u.id
    GROUP BY u.department_id
  `);

  return {
    report: result.rows[0],
    stats: stats.rows
  };
};