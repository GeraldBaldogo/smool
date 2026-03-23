import type { PageServerLoad } from './$types';
import { pool } from '$lib/server/db';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
	const user = locals.user;
	if (!user) throw redirect(302, '/login');

	try {
		// For admin report list only
		const reports = await pool.query(`
			SELECT 
				mr.id,
				mr.issue_description AS issue,
				mr.status,
				mr.created_at,
				mr.address,
				mr.landmark,
				u.full_name,
				d.name AS course,
				mr.category
			FROM maintenance_requests mr
			JOIN users u ON u.id = mr.user_id
			LEFT JOIN departments d ON d.id = u.department_id
			WHERE TRIM(LOWER(mr.status)) IN ('pending', 'submitted to admin', 'approved', 'in progress', 'completed')
			ORDER BY mr.created_at DESC
		`);

		// For charts only - ALL reports
		const chartReports = await pool.query(`
			SELECT
				id,
				status,
				created_at,
				category
			FROM maintenance_requests
			ORDER BY created_at DESC
		`);

		const pendingReports = await pool.query(`
			SELECT 
				mr.id,
				mr.issue_description AS issue,
				mr.status,
				mr.created_at,
				mr.address,
				mr.landmark,
				u.full_name,
				d.name AS course,
				mr.category
			FROM maintenance_requests mr
			JOIN users u ON u.id = mr.user_id
			LEFT JOIN departments d ON d.id = u.department_id
			WHERE TRIM(LOWER(mr.status)) = 'pending'
			ORDER BY mr.created_at DESC
		`);

		const stats = await pool.query(`
			SELECT
				COUNT(*) AS total_reports,
				COUNT(*) FILTER (WHERE TRIM(LOWER(status)) = 'pending') AS pending,
				COUNT(*) FILTER (WHERE TRIM(LOWER(status)) = 'denied') AS denied,
				COUNT(*) FILTER (WHERE TRIM(LOWER(status)) = 'approved') AS approved,
				COUNT(*) FILTER (WHERE TRIM(LOWER(status)) = 'in progress') AS in_progress,
				COUNT(*) FILTER (WHERE TRIM(LOWER(status)) = 'completed') AS completed,
				COUNT(*) FILTER (WHERE TRIM(LOWER(status)) = 'submitted to admin') AS submitted_to_admin
			FROM maintenance_requests
		`);

		return {
			user,
			reports: reports.rows,
			chartReports: chartReports.rows,
			pendingReports: pendingReports.rows,
			stats: stats.rows[0]
		};
	} catch (err) {
		console.error(err);
		throw redirect(302, '/login');
	}
};