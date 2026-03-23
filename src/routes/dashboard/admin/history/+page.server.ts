import type { PageServerLoad } from './$types';
import { pool } from '$lib/server/db';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
	const user = locals.user;

	if (!user || user.role !== 'admin') {
		throw redirect(302, '/login');
	}

	try {
		const result = await pool.query(`
			SELECT
				mr.id,
				mr.issue_description AS issue,
				mr.status,
				mr.category,
				mr.created_at,
				mr.completed_at,
				mr.address,
				mr.landmark,
				mr.admin_feedback,
				mr.completion_photo_url,
				u.full_name,
				u.role,
				d.name AS course
			FROM maintenance_requests mr
			JOIN users u ON u.id = mr.user_id
			LEFT JOIN departments d ON d.id = u.department_id
			WHERE TRIM(LOWER(mr.status)) IN ('submitted to admin', 'pending', 'approved', 'denied', 'in progress', 'completed')
			ORDER BY COALESCE(mr.completed_at, mr.created_at) DESC
		`);

		return {
			historyReports: result.rows
		};
	} catch (err) {
		console.error('Admin history load error:', err);
		throw redirect(302, '/login');
	}
};